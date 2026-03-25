"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Stats from "@/components/Stats";
import VideoPlayer from "@/components/VideoPlayer";
import ChoiceOverlayVoice from "@/components/ChoiceOverlayVoice";
import EndingOverlay from "@/components/EndingOverlay";
import ChoicesSidebar from "@/components/ChoicesSidebar";
import { useNarrator } from "@/hooks/useNarrator";
import {
  TOTAL_TIME,
  CHOICE_POINTS,
  CHOICES_DATA,
  CHAPTERS,
  ENDINGS,
  getEndingKey,
  getActiveScene,
  EndingData,
} from "@/data/gameData";

type Screen = "home" | "playing" | "ending";

const SKIP_AMOUNT = 600;

function unlockMediaPlayback() {
  // Warm up HTMLAudio autoplay permission in user-gesture context.
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
  const [currentChoice, setCurrentChoice] = useState(0);
  const [inChoiceScreen, setInChoiceScreen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [ending, setEnding] = useState<EndingData | null>(null);
  const [micEnabled, setMicEnabled] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [narratorJump, setNarratorJump] = useState({ token: 0, index: 0 });

  const inChoiceRef = useRef(inChoiceScreen);
  const currentChoiceRef = useRef(currentChoice);
  const choicesRef = useRef(choices);
  const chapterIdxRef = useRef(chapterIdx);
  const timeRef = useRef(0);
  const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pendingNarratorSyncTimeRef = useRef<number | null>(null);

  useEffect(() => { inChoiceRef.current = inChoiceScreen; }, [inChoiceScreen]);
  useEffect(() => { currentChoiceRef.current = currentChoice; }, [currentChoice]);
  useEffect(() => { choicesRef.current = choices; }, [choices]);
  useEffect(() => { chapterIdxRef.current = chapterIdx; }, [chapterIdx]);
  useEffect(() => { localStorage.removeItem("cplus_choices"); }, []);

  const chapter = CHAPTERS[chapterIdx] || CHAPTERS[0];
  const scene = getActiveScene(chapter, choices, chapterIdx);

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
      const pendingChoicePoint = ci < CHOICE_POINTS.length ? CHOICE_POINTS[ci] : null;

      if (!inChoiceRef.current && pendingChoicePoint !== null && nextTime >= pendingChoicePoint) {
        timeRef.current = pendingChoicePoint;
        setCurrentTime(pendingChoicePoint);
        setPlaying(false);
        setInChoiceScreen(true);
        return;
      }

      timeRef.current = nextTime;
      setCurrentTime(nextTime);
    }, 100);
  }, [stopTick]);

  useEffect(() => {
    if (playing && narrator.speaking && !inChoiceScreen && screen === "playing") {
      startTick();
    } else {
      stopTick();
    }
    return stopTick;
  }, [playing, narrator.speaking, inChoiceScreen, screen, startTick, stopTick]);

  const showEnding = useCallback((ch: string[]) => {
    const key = getEndingKey(ch);
    const e = ENDINGS[key] || ENDINGS["DEFAULT"];
    setEnding(e);
    setScreen("ending");
    setPlaying(false);
  }, []);

  useEffect(() => {
    if (!narrator.done || !playing || inChoiceScreen || screen !== "playing") return;

    const timer = setTimeout(() => {
      const ci = currentChoiceRef.current;
      const idx = chapterIdxRef.current;
      if (ci < CHOICE_POINTS.length && idx < CHAPTERS.length - 1) {
        setPlaying(false);
        setInChoiceScreen(true);
      } else {
        showEnding(choicesRef.current);
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [narrator.done, playing, inChoiceScreen, screen, showEnding]);

  const fallbackTriggeredRef = useRef(false);

  useEffect(() => {
    if (!playing || inChoiceScreen || screen !== "playing") {
      fallbackTriggeredRef.current = false;
      return;
    }
    if (narrator.speaking || narrator.spokenCount > 0) return;

    const fallback = setTimeout(() => {
      if (fallbackTriggeredRef.current) return;
      if (narrator.spokenCount === 0 && !narrator.speaking) {
        fallbackTriggeredRef.current = true;
        const ci = currentChoiceRef.current;
        const idx = chapterIdxRef.current;
        if (ci < CHOICE_POINTS.length && idx < CHAPTERS.length - 1) {
          setPlaying(false);
          setInChoiceScreen(true);
        } else {
          showEnding(choicesRef.current);
        }
      }
    }, 8000);

    return () => clearTimeout(fallback);
  }, [playing, inChoiceScreen, screen, narrator.speaking, narrator.spokenCount, showEnding]);

  const triggerChoiceIfNeeded = useCallback((newTime: number) => {
    if (inChoiceRef.current) return true;
    const ci = currentChoiceRef.current;
    if (ci < CHOICE_POINTS.length && newTime >= CHOICE_POINTS[ci]) {
      timeRef.current = CHOICE_POINTS[ci];
      setCurrentTime(CHOICE_POINTS[ci]);
      setPlaying(false);
      setInChoiceScreen(true);
      return true;
    }
    if (newTime >= TOTAL_TIME) {
      timeRef.current = TOTAL_TIME;
      setCurrentTime(TOTAL_TIME);
      showEnding(choicesRef.current);
      return true;
    }
    return false;
  }, [showEnding]);

  const syncNarratorToTime = useCallback((t: number) => {
    const computeAndApplyJump = (time: number, idx: number) => {
      const chStart = CHAPTERS[idx]?.start ?? 0;
      const chEnd = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1].start : TOTAL_TIME;
      const targetScene = getActiveScene(CHAPTERS[idx], choicesRef.current, idx);
      const paragraphCount = Math.max(targetScene.narrative.length, 1);
      const ratio = chEnd > chStart ? (time - chStart) / (chEnd - chStart) : 0;
      const paragraphIdx = Math.max(0, Math.min(paragraphCount - 1, Math.floor(ratio * paragraphCount)));
      setNarratorJump((prev) => ({ token: prev.token + 1, index: paragraphIdx }));
    };

    const targetChapterIdx = CHAPTERS.reduce((acc, ch, idx) => (t >= ch.start ? idx : acc), 0);
    const currentChapterIdx = chapterIdxRef.current;

    if (targetChapterIdx !== currentChapterIdx) {
      // Delay narrator jump until scene/chapter state has actually switched,
      // otherwise we can momentarily speak lines from the previous scene.
      pendingNarratorSyncTimeRef.current = t;
      setChapterIdx(targetChapterIdx);
      return;
    }

    computeAndApplyJump(t, currentChapterIdx);
  }, []);

  useEffect(() => {
    const pendingTime = pendingNarratorSyncTimeRef.current;
    if (pendingTime === null) return;

    pendingNarratorSyncTimeRef.current = null;
    const idx = chapterIdxRef.current;
    const chStart = CHAPTERS[idx]?.start ?? 0;
    const chEnd = idx < CHAPTERS.length - 1 ? CHAPTERS[idx + 1].start : TOTAL_TIME;
    const targetScene = getActiveScene(CHAPTERS[idx], choicesRef.current, idx);
    const paragraphCount = Math.max(targetScene.narrative.length, 1);
    const ratio = chEnd > chStart ? (pendingTime - chStart) / (chEnd - chStart) : 0;
    const paragraphIdx = Math.max(0, Math.min(paragraphCount - 1, Math.floor(ratio * paragraphCount)));
    setNarratorJump((prev) => ({ token: prev.token + 1, index: paragraphIdx }));
  }, [chapterIdx, scene.title]);

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

  const handleStart = useCallback(() => {
    unlockMediaPlayback();
    setScreen("playing");
    setPlaying(true);
  }, []);

  const handleTogglePlay = useCallback(() => {
    if (inChoiceRef.current) return;
    setPlaying((p) => !p);
  }, []);

  const handleChoice = useCallback((optionId: string) => {
    const idx = currentChoiceRef.current;
    pendingNarratorSyncTimeRef.current = null;
    setChoices((prev) => {
      const next = [...prev];
      next[idx] = optionId;
      localStorage.setItem("cplus_choices", JSON.stringify(next));
      return next;
    });
    setCurrentChoice(idx + 1);
    setChapterIdx((prev) => {
      const next = Math.min(prev + 1, CHAPTERS.length - 1);
      timeRef.current = CHAPTERS[next]?.start ?? 0;
      setCurrentTime(timeRef.current);
      return next;
    });
    setInChoiceScreen(false);
    setPlaying(true);
  }, []);

  const handleRestart = useCallback(() => {
    stopTick();
    setChoices([]);
    setCurrentChoice(0);
    setChapterIdx(0);
    setPlaying(false);
    setInChoiceScreen(false);
    setEnding(null);
    setSidebarOpen(false);
    timeRef.current = 0;
    setCurrentTime(0);
    localStorage.removeItem("cplus_choices");
    setScreen("playing");
    setTimeout(() => {
      unlockMediaPlayback();
      setPlaying(true);
    }, 50);
  }, [stopTick]);

  const handleGoHome = useCallback(() => {
    stopTick();
    setChoices([]);
    setCurrentChoice(0);
    setChapterIdx(0);
    setPlaying(false);
    setInChoiceScreen(false);
    setEnding(null);
    setSidebarOpen(false);
    timeRef.current = 0;
    setCurrentTime(0);
    localStorage.removeItem("cplus_choices");
    setScreen("home");
  }, [stopTick]);

  const handleShare = useCallback(() => {
    if (!ending) return;
    const text = `I watched "The Perfect Crime" on Canal+! My ending: ${ending.title}. Try it yourself!`;
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
          <Hero onStart={handleStart} />
          <Stats />
        </>
      )}

      {screen === "playing" && (
        <section className="player-section active">
          <VideoPlayer
            currentTime={currentTime}
            playing={playing}
            scene={scene}
            narratorParagraphCount={narrator.spokenCount}
            narratorSpeaking={narrator.speaking}
            onTogglePlay={handleTogglePlay}
            onSkipBack={handleSkipBack}
            onSkipForward={handleSkipForward}
            onSeek={handleSeek}
          >
            <ChoiceOverlayVoice
              active={inChoiceScreen && currentChoice < CHOICES_DATA.length}
              data={CHOICES_DATA[currentChoice] || CHOICES_DATA[0]}
              micEnabled={micEnabled}
              onToggleMic={() => setMicEnabled((prev) => !prev)}
              onChoice={handleChoice}
            />
          </VideoPlayer>
        </section>
      )}

      <EndingOverlay
        active={screen === "ending"}
        ending={ending}
        choiceCount={choices.length}
        onShare={handleShare}
        onRestart={handleRestart}
        onGoHome={handleGoHome}
      />

      <ChoicesSidebar
        open={sidebarOpen}
        visible={screen === "playing"}
        choices={choices}
        onToggle={toggleSidebar}
      />
    </>
  );
}
