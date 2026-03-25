"use client";

import { useEffect, useRef } from "react";

interface AudioManagerProps {
  playing: boolean;
  inChoiceScreen: boolean;
  choiceSignal: number;
}

export default function AudioManager({ inChoiceScreen, choiceSignal }: AudioManagerProps) {
  const tickRef = useRef<HTMLAudioElement | null>(null);
  const selectRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const tick = tickRef.current;
    if (!tick) return;
    tick.volume = 0.34;
    if (inChoiceScreen) {
      tick.currentTime = 0;
      tick.play().catch(() => {});
      return;
    }
    tick.pause();
    tick.currentTime = 0;
  }, [inChoiceScreen]);

  useEffect(() => {
    if (!choiceSignal) return;
    const sfx = selectRef.current;
    if (!sfx) return;
    sfx.volume = 0.42;
    sfx.currentTime = 0;
    sfx.play().catch(() => {});
  }, [choiceSignal]);

  return (
    <div style={{ display: "none" }} aria-hidden="true">
      <audio ref={tickRef} src="/audio/tick-tock.mp3" preload="auto" />
      <audio ref={selectRef} src="/audio/choice-select.mp3" preload="auto" />
    </div>
  );
}
