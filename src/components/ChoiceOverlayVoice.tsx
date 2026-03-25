"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChoiceData } from "@/data/gameData";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface ChoiceOverlayVoiceProps {
  active: boolean;
  data: ChoiceData;
  micEnabled: boolean;
  onToggleMic: () => void;
  onChoice: (optionId: string) => void;
}

export default function ChoiceOverlayVoice({
  active,
  data,
  micEnabled,
  onToggleMic,
  onChoice,
}: ChoiceOverlayVoiceProps) {
  const [selectedByVoice, setSelectedByVoice] = useState<string | null>(null);
  const voiceChoiceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const awaitingVoiceChoiceRef = useRef(false);

  const handleVoiceMatch = useCallback(
    (optionId: string) => {
      if (awaitingVoiceChoiceRef.current) return;
      const available = data.options.find((opt) => opt.id === optionId);
      if (!available) return;
      awaitingVoiceChoiceRef.current = true;
      setSelectedByVoice(optionId);

      voiceChoiceTimerRef.current = setTimeout(() => {
        onChoice(optionId);
      }, 2000);
    },
    [data.options, onChoice]
  );

  const speech = useSpeechRecognition({
    active: active && micEnabled,
    onMatch: handleVoiceMatch,
  });

  useEffect(() => {
    if (voiceChoiceTimerRef.current) {
      clearTimeout(voiceChoiceTimerRef.current);
      voiceChoiceTimerRef.current = null;
    }
    awaitingVoiceChoiceRef.current = false;
    if (!active) return;
    setSelectedByVoice(null);
  }, [active]);

  useEffect(() => {
    return () => {
      if (voiceChoiceTimerRef.current) {
        clearTimeout(voiceChoiceTimerRef.current);
        voiceChoiceTimerRef.current = null;
      }
    };
  }, []);

  const statusText = useMemo(() => {
    if (!micEnabled) return "Microfoon staat uit. Klik op een optie of zet de microfoon aan.";
    if (!speech.supported) return "Spraak wordt niet ondersteund in deze browser. Klik op een optie.";
    if (speech.status === "listening") return "Luistert... zeg A, B of C";
    if (speech.status === "error") return speech.error ?? "Microfoonfout. Klik op een optie.";
    return "Microfoon wordt gestart...";
  }, [micEnabled, speech.error, speech.status, speech.supported]);

  if (!active) return null;

  return (
    <div className="choice-bottom-overlay voice">
      <div className="choice-bottom-content">
        <div className="choice-bottom-title">{data.title}</div>
        <div className="choice-voice-status">
          <span className={`mic-dot ${micEnabled && speech.status === "listening" ? "active" : ""}`}>🎙</span>
          <span>{statusText}</span>
        </div>
        <button className="mode-btn" onClick={onToggleMic} aria-pressed={micEnabled}>
          {micEnabled ? "Microfoon uitzetten" : "Microfoon aanzetten"}
        </button>
        <div className="choice-voice-transcript">
          {micEnabled && speech.transcript ? `Gehoord: "${speech.transcript}"` : "Of klik direct op een optie"}
        </div>
        <div className="choice-bottom-grid">
          {data.options.map((opt) => (
            <button
              key={opt.id}
              className={`choice-bottom-btn${selectedByVoice === opt.id ? " by-voice" : ""}`}
              onClick={() => {
                if (awaitingVoiceChoiceRef.current) return;
                onChoice(opt.id);
              }}
              aria-label={`Kies optie ${opt.id}: ${opt.label}`}
            >
              <span className="choice-letter">{opt.id}</span>
              <span className="choice-text">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
