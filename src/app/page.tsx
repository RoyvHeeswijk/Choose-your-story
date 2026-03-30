"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import CharacterIntro from "@/components/CharacterIntro";
import PerspectivePicker from "@/components/PerspectivePicker";
import VideoPlayer from "@/components/VideoPlayer";
import ChoiceOverlayVoice from "@/components/ChoiceOverlayVoice";
import EndingOverlay from "@/components/EndingOverlay";
import ChoicesSidebar from "@/components/ChoicesSidebar";
import { useNarrator } from "@/hooks/useNarrator";
import {
  TOTAL_TIME,
  CHOICES_DATA,
  CHAPTERS,
  ENDINGS,
  CHARACTER_PROFILES,
  INTRO_SCENES,
  PerspectiveId,
  getEndingKey,
  getActiveScene,
  getChapterIndex,
  EndingData,
} from "@/data/gameData";

type Screen = "home" | "intro" | "perspective" | "playing" | "ending";

const SKIP_AMOUNT = 600;
const STORAGE_ENDINGS_KEY = "cplus_unlocked_endings";

function unlockMediaPlayback() {
  const a = new Audio();
  a.src =
    "data:audio/mp3;base64,SUQzAwAAAAAAR1RTU0UAAAAPAAADTGF2ZjU4LjI5LjEwMAAAAAAAAAAAAAAA//tQxAADBQAA";
  a.volume = 0;
  a.play().catch(() => {});
}

export default function Home() {
  const [screen, setScreen] = useState<Screen>("home");
  const [playing, setPlaying] = useState(false);
  const [chapterIdx, setChapterIdx] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [customInputs, setCustomInputs] = useState<string[]>([]);
  const [currentChoice, setCurrentChoice] = useState(0);
  const [inChoiceScreen, setInChoiceScreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ending, setEnding] = useState<EndingData | null>(null);
  const [perspective, setPerspective] = useState<PerspectiveId | null>(null);
  const [currentEffect, setCurrentEffect] = useState<string | null>(null);
  const [unlockedEndings, setUnlockedEndings] = useState<string[]>([]);
  const [micEnabled, setMicEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [narratorJump, setNarratorJump] = useState({ token: 0, index: 0 });

  const inChoiceRef = useRef(inChoiceScreen);
  const screenRef = useRef<Screen>(screen);
  const currentChoiceRef = useRef(currentChoice);
  const choicesRef = useRef(choices);
  const chapterIdxRef = useRef(chapterIdx);
  const perspectiveRef = useRef<PerspectiveId>("colleague");
  const showEndingRef = useRef<(choices: string[], perspective: PerspectiveId) => void>(() => {});
  const timeRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingCustomInputRef = useRef<string | null>(null);

  useEffect(() => { inChoiceRef.current = inChoiceScreen; }, [inChoiceScreen]);
  useEffect(() => { screenRef.current = screen; }, [screen]);
  useEffect(() => { currentChoiceRef.current = currentChoice; }, [currentChoice]);
  useEffect(() => { choicesRef.current = choices; }, [choices]);
  useEffect(() => { chapterIdxRef.current = chapterIdx; }, [chapterIdx]);
  useEffect(() => { perspectiveRef.current = perspective ?? "colleague"; }, [perspective]);
  useEffect(() => {
    const raw = localStorage.getItem(STORAGE_ENDINGS_KEY);
    if (!raw) return;
    try {
      const parsed = JSON.parse(raw) as string[];
      if (Array.isArray(parsed)) setUnlockedEndings(parsed);
    } catch {
      localStorage.removeItem(STORAGE_ENDINGS_KEY);
    }
  }, []);

  const activePerspective = perspective ?? "colleague";
  const chapter = CHAPTERS[chapterIdx] || CHAPTERS[0];
  const scene = getActiveScene(chapter, choices, chapterIdx, activePerspective);
  const activeChoice = CHOICES_DATA[currentChoice];
  const totalEndings = Object.keys(ENDINGS).filter((key) => key !== "DEFAULT").length;

  const narrator = useNarrator({
    scene,
    playing: playing && screen === "playing",
    inChoiceScreen,
    jumpToParagraph: narratorJump,
  });

  const stopTick = useCallback(() => {
    if (tickRef.current) { clearInterval(tickRef.current); tickRef.current = null; }
  }, []);

  const startTick = useCallback(() => {
    stopTick();
    tickRef.current = setInterval(() => {
      const idx = chapterIdxRef.current;
      const chStart = CHAPTERS[idx]?.start ?? 0;
      const chEnd = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1].start : TOTAL_TIME;
      const rate = (chEnd - chStart) / 30;
      const step = rate * 0.1;
      const nextTime = Math.min(timeRef.current + step, TOTAL_TIME);
      const ci = currentChoiceRef.current;
      const nextChoice = CHOICES_DATA[ci];

      if (
        !inChoiceRef.current &&
        nextChoice &&
        nextChoice.trigger === "checkpoint" &&
        idx >= nextChoice.chapterIndex &&
        nextTime >= nextChoice.checkpointTime
      ) {
        timeRef.current = nextChoice.checkpointTime;
        setCurrentTime(nextChoice.checkpointTime);
        setPlaying(false);
        setInChoiceScreen(true);
        return;
      }

      if (!inChoiceRef.current && nextTime >= chEnd) {
        if (
          nextChoice &&
          nextChoice.trigger === "natural" &&
          nextChoice.chapterIndex === idx
        ) {
          timeRef.current = chEnd;
          setCurrentTime(chEnd);
          setPlaying(false);
          setInChoiceScreen(true);
          return;
        }

        if (idx < CHAPTERS.length - 1) {
          const nextChapterIdx = idx + 1;
          setChapterIdx(nextChapterIdx);
          timeRef.current = CHAPTERS[nextChapterIdx]?.start ?? chEnd;
          setCurrentTime(timeRef.current);
          return;
        }

        timeRef.current = TOTAL_TIME;
        setCurrentTime(TOTAL_TIME);
        showEndingRef.current(choicesRef.current, perspectiveRef.current);
        return;
      }

      timeRef.current = nextTime;
      setCurrentTime(nextTime);
      if (nextTime >= TOTAL_TIME) {
        setPlaying(false);
      }
    }, 100);
  }, [stopTick]);

  useEffect(() => {
    if (playing && !inChoiceScreen && screen === "playing") {
      startTick();
    } else {
      stopTick();
    }
    return stopTick;
  }, [playing, inChoiceScreen, screen, startTick, stopTick]);

  const showEnding = useCallback((ch: string[], chosenPerspective: PerspectiveId) => {
    const key = getEndingKey(ch, chosenPerspective);
    const e = ENDINGS[key] || ENDINGS["DEFAULT"];
    setUnlockedEndings((prev) => {
      if (prev.includes(key)) return prev;
      const next = [...prev, key];
      localStorage.setItem(STORAGE_ENDINGS_KEY, JSON.stringify(next));
      return next;
    });
    setEnding(e);
    setScreen("ending");
    setPlaying(false);
  }, []);

  useEffect(() => {
    showEndingRef.current = showEnding;
  }, [showEnding]);

  const advanceChapter = useCallback(() => {
    setChapterIdx((prev) => {
      const next = Math.min(prev + 1, CHAPTERS.length - 1);
      timeRef.current = CHAPTERS[next]?.start ?? 0;
      setCurrentTime(timeRef.current);
      return next;
    });
  }, []);

  const triggerChoiceIfNeeded = useCallback((newTime: number) => {
    if (inChoiceRef.current) return true;
    const nextChoice = CHOICES_DATA[currentChoiceRef.current];
    const choiceChapterEnd =
      nextChoice && nextChoice.chapterIndex < CHAPTERS.length - 1
        ? CHAPTERS[nextChoice.chapterIndex + 1].start
        : TOTAL_TIME;

    if (nextChoice && nextChoice.trigger === "checkpoint" && newTime >= nextChoice.checkpointTime) {
      timeRef.current = nextChoice.checkpointTime;
      setCurrentTime(nextChoice.checkpointTime);
      setPlaying(false);
      setInChoiceScreen(true);
      return true;
    }
    if (nextChoice && nextChoice.trigger === "natural" && newTime >= choiceChapterEnd) {
      timeRef.current = choiceChapterEnd;
      setCurrentTime(choiceChapterEnd);
      setPlaying(false);
      setInChoiceScreen(true);
      return true;
    }
    if (newTime >= TOTAL_TIME) {
      timeRef.current = TOTAL_TIME;
      setCurrentTime(TOTAL_TIME);
      showEnding(choicesRef.current, activePerspective);
      return true;
    }
    return false;
  }, [showEnding, activePerspective]);

  const syncNarratorToTime = useCallback((t: number) => {
    const idx = getChapterIndex(t);
    if (idx !== chapterIdxRef.current) setChapterIdx(idx);
    const chStart = CHAPTERS[idx]?.start ?? 0;
    const chEnd = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1].start : TOTAL_TIME;
    const targetScene = getActiveScene(CHAPTERS[idx], choicesRef.current, idx, activePerspective);
    const paragraphCount = Math.max(targetScene.narrative.length, 1);
    const ratio = chEnd > chStart ? (t - chStart) / (chEnd - chStart) : 0;
    const paragraphIdx = Math.max(0, Math.min(paragraphCount - 1, Math.floor(ratio * paragraphCount)));
    setNarratorJump((prev) => ({ token: prev.token + 1, index: paragraphIdx }));
  }, [activePerspective]);

  const handleSeek = useCallback((t: number) => {
    if (inChoiceRef.current) return;
    if (!triggerChoiceIfNeeded(t)) {
      timeRef.current = t;
      setCurrentTime(t);
      syncNarratorToTime(t);
    }
  }, [triggerChoiceIfNeeded, syncNarratorToTime]);

  const handleSkipForward = useCallback(() => {
    if (inChoiceRef.current) return;
    const newTime = Math.min(timeRef.current + SKIP_AMOUNT, TOTAL_TIME);
    if (!triggerChoiceIfNeeded(newTime)) {
      timeRef.current = newTime;
      setCurrentTime(newTime);
      syncNarratorToTime(newTime);
    }
  }, [triggerChoiceIfNeeded, syncNarratorToTime]);

  const handleSkipBack = useCallback(() => {
    if (inChoiceRef.current) return;
    const newTime = Math.max(timeRef.current - SKIP_AMOUNT, 0);
    timeRef.current = newTime;
    setCurrentTime(newTime);
    syncNarratorToTime(newTime);
  }, [syncNarratorToTime]);

  const resetStoryState = useCallback(() => {
    stopTick();
    setChoices([]);
    setCustomInputs([]);
    setCurrentChoice(0);
    setChapterIdx(0);
    setPlaying(false);
    setInChoiceScreen(false);
    setEnding(null);
    setSidebarOpen(false);
    setCurrentEffect(null);
    timeRef.current = 0;
    setCurrentTime(0);
    pendingCustomInputRef.current = null;
  }, [stopTick]);

  const handleStart = useCallback(() => {
    resetStoryState();
    setScreen("intro");
  }, [resetStoryState]);

  const handleIntroContinue = useCallback(() => {
    setScreen("perspective");
  }, []);

  const handlePickPerspective = useCallback((selected: PerspectiveId) => {
    resetStoryState();
    setPerspective(selected);
    unlockMediaPlayback();
    setScreen("playing");
    setPlaying(true);
  }, [resetStoryState]);

  const handleBackToIntro = useCallback(() => {
    setScreen("intro");
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (screenRef.current !== "playing") return;
    if (inChoiceRef.current) return;
    setPlaying((p) => !p);
  }, []);

  const handleChoice = useCallback((optionId: string) => {
    const idx = currentChoiceRef.current;
    const choiceData = CHOICES_DATA[idx];
    const selectedOption = choiceData?.options.find((option) => option.id === optionId);
    setChoices((prev) => {
      const next = [...prev];
      next[idx] = optionId;
      localStorage.setItem("cplus_choices", JSON.stringify(next));
      return next;
    });
    if (pendingCustomInputRef.current) {
      setCustomInputs((prev) => {
        const next = [...prev];
        next[idx] = pendingCustomInputRef.current!;
        return next;
      });
    }
    setCurrentEffect(selectedOption?.effect ?? null);
    pendingCustomInputRef.current = null;
    setCurrentChoice(idx + 1);
    advanceChapter();
    setInChoiceScreen(false);
    setPlaying(true);
  }, [advanceChapter]);

  const handleRestart = useCallback(() => {
    resetStoryState();
    setScreen("perspective");
  }, [resetStoryState]);

  const handleGoHome = useCallback(() => {
    resetStoryState();
    setScreen("home");
  }, [resetStoryState]);

  const handleShare = useCallback(() => {
    if (!ending) return;
    const text = `I shaped my own story in "The Perfect Crime". Ending: ${ending.title}.`;
    if (navigator.share) {
      navigator.share({ title: "The Perfect Crime — Canal+", text });
    } else {
      navigator.clipboard?.writeText(text);
      alert("Result copied to clipboard!");
    }
  }, [ending]);

  const toggleSidebar = useCallback(() => setSidebarOpen((o) => !o), []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (screenRef.current !== "playing") return;
      if (e.code === "Space") { e.preventDefault(); handleTogglePlay(); }
      if (inChoiceRef.current && currentChoiceRef.current < CHOICES_DATA.length) {
        if (e.key === "1" || e.key === "a" || e.key === "A") handleChoice("A");
        if (e.key === "2" || e.key === "b" || e.key === "B") handleChoice("B");
        if (e.key === "3" || e.key === "c" || e.key === "C") handleChoice("C");
      }
      if (e.code === "ArrowRight") handleSkipForward();
      if (e.code === "ArrowLeft") handleSkipBack();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleTogglePlay, handleChoice, handleSkipForward, handleSkipBack]);

  return (
    <>
      <Header onGoHome={handleGoHome} />

      {screen === "home" && (
        <>
          <Hero onStart={handleStart} unlockedCount={unlockedEndings.length} totalEndings={totalEndings} />
          <Stats />
        </>
      )}

      {screen === "intro" && (
        <CharacterIntro
          introScenes={INTRO_SCENES}
          characters={CHARACTER_PROFILES}
          onContinue={handleIntroContinue}
        />
      )}

      {screen === "perspective" && (
        <PerspectivePicker
          characters={CHARACTER_PROFILES}
          onPick={handlePickPerspective}
          onBack={handleBackToIntro}
        />
      )}

      {screen === "playing" && (
        <section className="player-section active">
          <VideoPlayer
            currentTime={currentTime}
            playing={playing}
            scene={scene}
            perspectiveLabel={
              CHARACTER_PROFILES.find((profile) => profile.id === activePerspective)?.name ?? "Noor van Dijk"
            }
            currentEffect={currentEffect}
            choicePoints={CHOICES_DATA.map((choice) => choice.checkpointTime)}
            currentChoiceIndex={currentChoice}
            totalChoices={CHOICES_DATA.length}
            narratorParagraphCount={narrator.spokenCount}
            narratorSpeaking={narrator.speaking}
            onTogglePlay={handleTogglePlay}
            onSkipBack={handleSkipBack}
            onSkipForward={handleSkipForward}
            onSeek={handleSeek}
          >
            <ChoiceOverlayVoice
              active={inChoiceScreen && Boolean(activeChoice)}
              data={activeChoice || CHOICES_DATA[0]}
              micEnabled={micEnabled}
              onToggleMic={() => setMicEnabled((prev) => !prev)}
              onChoice={handleChoice}
              onCustomMapped={(fromInput) => {
                pendingCustomInputRef.current = fromInput;
              }}
            />
          </VideoPlayer>
        </section>
      )}

      <EndingOverlay
        active={screen === "ending"}
        ending={ending}
        choiceCount={choices.length}
        unlockedCount={unlockedEndings.length}
        totalEndings={totalEndings}
        onShare={handleShare}
        onRestart={handleRestart}
        onGoHome={handleGoHome}
      />

      <ChoicesSidebar
        open={sidebarOpen}
        visible={screen === "playing"}
        choices={choices}
        customInputs={customInputs}
        onToggle={toggleSidebar}
      />
    </>
  );
}
