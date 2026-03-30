"use client";

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChoiceData } from "@/data/gameData";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";

interface ChoiceOverlayVoiceProps {
  active: boolean;
  data: ChoiceData;
  micEnabled: boolean;
  onToggleMic: () => void;
  onChoice: (optionId: string) => void;
  onCustomMapped?: (fromInput: string, mappedOptionId: string) => void;
}

function mapFreeInputToOption(input: string, data: ChoiceData): string | null {
  const normalized = input.trim().toLowerCase();
  if (!normalized) return null;

  const directOption = data.options.find((opt) => opt.id.toLowerCase() === normalized);
  if (directOption) return directOption.id;

  const scores = data.options.map((option) => {
    let score = 0;
    option.intentTags.forEach((tag) => {
      if (normalized.includes(tag.toLowerCase())) score += 2;
    });
    option.label
      .toLowerCase()
      .split(" ")
      .filter((part) => part.length > 3)
      .forEach((part) => {
        if (normalized.includes(part)) score += 1;
      });
    return { id: option.id, score };
  });

  const best = scores.sort((a, b) => b.score - a.score)[0];
  if (!best || best.score <= 0) return null;
  return best.id;
}

export default function ChoiceOverlayVoice({
  active,
  data,
  micEnabled,
  onToggleMic,
  onChoice,
  onCustomMapped,
}: ChoiceOverlayVoiceProps) {
  const [selectedByVoice, setSelectedByVoice] = useState<string | null>(null);
  const [freeInput, setFreeInput] = useState("");
  const [freeInputHint, setFreeInputHint] = useState<string | null>(null);
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
    options: data.options,
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
    setFreeInput("");
    setFreeInputHint(null);
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
    if (speech.status === "listening") return "Luistert... zeg A/B/C of noem je intentie.";
    if (speech.status === "error") return speech.error ?? "Microfoonfout. Klik op een optie.";
    return "Microfoon wordt gestart...";
  }, [micEnabled, speech.error, speech.status, speech.supported]);

  const handleSubmitFreeInput = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      if (awaitingVoiceChoiceRef.current) return;
      const mapped = mapFreeInputToOption(freeInput, data);
      if (!mapped) {
        setFreeInputHint("Kon geen duidelijke match vinden. Probeer een concretere intentie.");
        return;
      }
      setFreeInputHint(`Je input is gekoppeld aan optie ${mapped}.`);
      onCustomMapped?.(freeInput, mapped);
      onChoice(mapped);
    },
    [data, freeInput, onChoice, onCustomMapped]
  );

  if (!active) return null;

  return (
    <div className="choice-bottom-overlay voice">
      <div className="choice-bottom-content">
        <div className="choice-bottom-title">{data.title}</div>
        <div className="choice-kind">{data.type === "major" ? "Belangrijke keuze" : "Snelle keuze"}</div>
        <div className="choice-voice-transcript">{data.subtitle}</div>
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
        <form className="free-input-row" onSubmit={handleSubmitFreeInput}>
          <input
            className="free-input"
            value={freeInput}
            onChange={(event) => setFreeInput(event.target.value)}
            placeholder="Vrije input (bijv. 'ik wil eerst observeren')"
          />
          <button className="mode-btn" type="submit">Gebruik vrije input</button>
        </form>
        {freeInputHint && <div className="choice-voice-transcript">{freeInputHint}</div>}
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
              <span className="choice-text">
                {opt.label}
                <small>{opt.effect}</small>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
