"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SceneSegment } from "@/data/gameData";

interface UseNarratorArgs {
  scene: SceneSegment;
  playing: boolean;
  inChoiceScreen: boolean;
  jumpToParagraph?: { token: number; index: number };
}

interface NarratorState {
  spokenCount: number;
  speaking: boolean;
  done: boolean;
}

function splitIntoSentences(text: string): string[] {
  const parts = text.match(/[^.!?…]+[.!?…]+["']?\s*/g);
  if (!parts) return [text];
  return parts.map((s) => s.trim()).filter(Boolean);
}

type SentenceStyle = "dialogue" | "dramatic" | "question" | "whisper" | "normal";

function classifySentence(text: string): SentenceStyle {
  if (/["\"«»].{3,}["\"«»]/.test(text)) return "dialogue";
  if (/\?["']?\s*$/.test(text)) return "question";
  if (/[—–]\s/.test(text) || /\.{3}|…/.test(text)) return "dramatic";
  if (text.length < 30) return "whisper";
  return "normal";
}

function getStyleParams(style: SentenceStyle): { pauseAfterMs: number } {
  switch (style) {
    case "dialogue": return { pauseAfterMs: 300 };
    case "dramatic": return { pauseAfterMs: 900 };
    case "question": return { pauseAfterMs: 600 };
    case "whisper": return { pauseAfterMs: 700 };
    default: return { pauseAfterMs: 350 };
  }
}

/** Fetch aborted because a newer sentence started, or audio.play() interrupted by pause(). */
function isSupersededTtsError(e: unknown): boolean {
  if (e instanceof DOMException && e.name === "AbortError") return true;
  if (e && typeof e === "object" && "name" in e && (e as { name: string }).name === "AbortError") return true;
  const msg = e && typeof e === "object" && "message" in e ? String((e as Error).message) : "";
  if (msg.includes("interrupted by a call to pause")) return true;
  if (msg.includes("The play() request was interrupted")) return true;
  return false;
}

export function useNarrator({ scene, playing, inChoiceScreen, jumpToParagraph }: UseNarratorArgs): NarratorState {
  const [spokenCount, setSpokenCount] = useState(0);
  const [speaking, setSpeaking] = useState(false);

  const sceneKeyRef = useRef(scene.title);
  const paragraphIdxRef = useRef(0);
  const queueRef = useRef<string[]>([]);
  const busyRef = useRef(false);
  const keepAliveRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const retryRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sessionRef = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioUrlRef = useRef<string | null>(null);
  const requestAbortRef = useRef<AbortController | null>(null);
  const ttsGenRef = useRef(0);

  const clearTimers = useCallback(() => {
    if (keepAliveRef.current) { clearInterval(keepAliveRef.current); keepAliveRef.current = null; }
    if (retryRef.current) { clearTimeout(retryRef.current); retryRef.current = null; }
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = "";
      audioRef.current = null;
    }
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  const fullStop = useCallback(() => {
    sessionRef.current += 1;
    ttsGenRef.current += 1;
    clearTimers();
    requestAbortRef.current?.abort();
    requestAbortRef.current = null;
    stopAudio();
    busyRef.current = false;
    setSpeaking(false);
  }, [clearTimers, stopAudio]);

  const speakSentence = useCallback((text: string, runId: number, onDone: () => void) => {
    if (runId !== sessionRef.current) return;
    const style = classifySentence(text);
    const p = getStyleParams(style);

    const finish = () => {
      if (runId !== sessionRef.current) return;
      if (keepAliveRef.current) { clearInterval(keepAliveRef.current); keepAliveRef.current = null; }
      retryRef.current = setTimeout(onDone, p.pauseAfterMs);
    };

    const speakEleven = async () => {
      const myGen = ++ttsGenRef.current;
      const stillCurrent = () => runId === sessionRef.current && myGen === ttsGenRef.current;

      try {
        requestAbortRef.current?.abort();
        const controller = new AbortController();
        requestAbortRef.current = controller;

        const res = await fetch("/api/tts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text }),
          signal: controller.signal,
        });

        if (!stillCurrent()) return;

        if (!res.ok) {
          const errBody = await res.text().catch(() => "");
          console.error("[TTS] /api/tts failed", res.status, errBody.slice(0, 500));
          throw new Error(`TTS ${res.status}`);
        }

        const provider = res.headers.get("X-TTS-Provider");
        if (provider !== "elevenlabs") {
          console.error("[TTS] not ElevenLabs provider", provider ?? "missing");
          throw new Error("TTS provider mismatch");
        }
        const activeVoiceId = res.headers.get("X-TTS-Voice-Id");
        if (!activeVoiceId) {
          console.warn("[TTS] Missing X-TTS-Voice-Id header from API.");
        }

        const blob = await res.blob();
        if (!stillCurrent()) return;

        if (blob.size < 64) throw new Error("ElevenLabs audio too small");
        if (blob.type && !blob.type.includes("audio") && !blob.type.includes("octet") && !blob.type.includes("mpeg")) {
          throw new Error(`Unexpected audio type: ${blob.type}`);
        }

        stopAudio();
        if (!stillCurrent()) return;

        const url = URL.createObjectURL(blob);
        audioUrlRef.current = url;
        const audio = new Audio(url);
        audioRef.current = audio;
        setSpeaking(true);

        audio.onended = () => {
          if (!stillCurrent()) return;
          stopAudio();
          finish();
        };
        audio.onerror = () => {
          if (!stillCurrent()) return;
          stopAudio();
          // ElevenLabs-only mode: skip to next sentence, no browser-voice fallback.
          finish();
        };

        const playResult = audio.play();
        if (playResult && typeof (playResult as Promise<void>).then === "function") {
          await playResult.catch((e: unknown) => {
            if (isSupersededTtsError(e) || !stillCurrent()) return;
            console.error("[TTS] audio.play() failed", e);
            stopAudio();
            finish();
          });
        }
      } catch (e) {
        if (isSupersededTtsError(e) || !stillCurrent()) return;
        console.error("[TTS] ElevenLabs chain failed:", e);
        finish();
      }
    };

    void speakEleven();
  }, [stopAudio]);

  const drainQueue = useCallback((runId: number) => {
    if (runId !== sessionRef.current) return;
    if (!busyRef.current) return;
    const q = queueRef.current;
    if (q.length === 0) {
      setSpeaking(false);
      const nextPar = paragraphIdxRef.current + 1;
      paragraphIdxRef.current = nextPar;
      setSpokenCount(nextPar);

      if (nextPar < scene.narrative.length) {
        queueRef.current = splitIntoSentences(scene.narrative[nextPar]);
        retryRef.current = setTimeout(() => drainQueue(runId), 900);
      }
      return;
    }

    const sentence = q.shift()!;
    speakSentence(sentence, runId, () => drainQueue(runId));
  }, [scene.narrative, speakSentence]);

  const beginNarration = useCallback(() => {
    if (busyRef.current) return;
    const idx = paragraphIdxRef.current;
    if (idx >= scene.narrative.length) return;

    const runId = sessionRef.current + 1;
    sessionRef.current = runId;
    busyRef.current = true;
    requestAbortRef.current?.abort();
    requestAbortRef.current = null;
    stopAudio();
    queueRef.current = splitIntoSentences(scene.narrative[idx]);
    drainQueue(runId);
  }, [scene.narrative, drainQueue, stopAudio]);

  useEffect(() => {
    if (scene.title !== sceneKeyRef.current) {
      fullStop();
      sceneKeyRef.current = scene.title;
      paragraphIdxRef.current = 0;
      queueRef.current = [];
      setSpokenCount(0);
    }

    if (playing && !inChoiceScreen) {
      if (!busyRef.current) beginNarration();
    } else {
      clearTimers();
      ttsGenRef.current += 1;
      requestAbortRef.current?.abort();
      requestAbortRef.current = null;
      stopAudio();
      busyRef.current = false;
      setSpeaking(false);
    }

    return () => {
      clearTimers();
      ttsGenRef.current += 1;
      busyRef.current = false;
      requestAbortRef.current?.abort();
      requestAbortRef.current = null;
      stopAudio();
      setSpeaking(false);
    };
  }, [scene.title, playing, inChoiceScreen, fullStop, beginNarration, clearTimers, stopAudio]);

  useEffect(() => {
    return () => {
      fullStop();
    };
  }, [fullStop]);

  useEffect(() => {
    if (!jumpToParagraph) return;
    const nextIdx = Math.max(0, Math.min(jumpToParagraph.index, Math.max(scene.narrative.length - 1, 0)));

    clearTimers();
    ttsGenRef.current += 1;
    requestAbortRef.current?.abort();
    requestAbortRef.current = null;
    stopAudio();
    busyRef.current = false;
    queueRef.current = [];
    paragraphIdxRef.current = nextIdx;
    setSpokenCount(nextIdx);
    setSpeaking(false);

    if (playing && !inChoiceScreen && scene.narrative.length > 0) {
      beginNarration();
    }
  }, [
    jumpToParagraph?.token,
    jumpToParagraph?.index,
    scene.narrative.length,
    playing,
    inChoiceScreen,
    beginNarration,
    clearTimers,
    stopAudio,
  ]);

  const done = spokenCount >= scene.narrative.length && !speaking && paragraphIdxRef.current >= scene.narrative.length;

  return { spokenCount, speaking, done };
}
