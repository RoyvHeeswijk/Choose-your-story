"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChoiceOption } from "@/data/gameData";

type SpeechStatus = "idle" | "listening" | "error" | "unsupported";

interface UseSpeechRecognitionArgs {
  active: boolean;
  options?: ChoiceOption[];
  onMatch: (value: string) => void;
}

interface SpeechResult {
  status: SpeechStatus;
  transcript: string;
  error: string | null;
  supported: boolean;
}

interface SpeechRecognitionResultLike {
  transcript: string;
}

interface SpeechRecognitionEventLike {
  results: ArrayLike<ArrayLike<SpeechRecognitionResultLike>>;
}

interface SpeechRecognitionErrorEventLike {
  error: string;
}

interface SpeechRecognitionLike {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  maxAlternatives: number;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

type SpeechRecognitionCtor = new () => SpeechRecognitionLike;

declare global {
  interface Window {
    SpeechRecognition?: SpeechRecognitionCtor;
    webkitSpeechRecognition?: SpeechRecognitionCtor;
  }
}

function matchByIntent(spoken: string, options: ChoiceOption[]): string | null {
  const n = spoken
    .replace(/[.,!?]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

  if (n === "a" || /\b(optie|option)\s*a\b/.test(n) || /\b(een|one|1st|first)\b/.test(n)) return "A";
  if (n === "b" || /\b(optie|option)\s*b\b/.test(n) || /\b(twee|two|2nd|second)\b/.test(n)) return "B";
  if (n === "c" || /\b(optie|option)\s*c\b/.test(n) || /\b(drie|three|3rd|third)\b/.test(n)) return "C";

  const scores = options.map((option) => {
    let score = 0;
    option.intentTags.forEach((tag) => {
      if (n.includes(tag.toLowerCase())) score += 2;
    });
    option.label
      .toLowerCase()
      .split(" ")
      .filter((word) => word.length > 3)
      .forEach((word) => {
        if (n.includes(word)) score += 1;
      });
    return { id: option.id, score };
  });

  const best = scores.sort((a, b) => b.score - a.score)[0];
  if (best && best.score > 0) return best.id;

  return null;
}

export function useSpeechRecognition({ active, options = [], onMatch }: UseSpeechRecognitionArgs): SpeechResult {
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const [status, setStatus] = useState<SpeechStatus>("idle");
  const [transcript, setTranscript] = useState("");
  const [error, setError] = useState<string | null>(null);

  const supported = useMemo(() => {
    if (typeof window === "undefined") return false;
    return Boolean(window.SpeechRecognition || window.webkitSpeechRecognition);
  }, []);

  const stopRecognition = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.onresult = null;
      recognitionRef.current.onerror = null;
      recognitionRef.current.onend = null;
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
    setStatus("idle");
  }, []);

  useEffect(() => {
    if (!active) {
      stopRecognition();
      return;
    }

    if (!supported) {
      setStatus("unsupported");
      setError("Spraakherkenning wordt niet ondersteund in deze browser.");
      return;
    }

    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Ctor) {
      setStatus("unsupported");
      setError("Spraak-API niet beschikbaar.");
      return;
    }

    const recognition = new Ctor();
    recognition.lang = "nl-NL";
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition;

    recognition.onresult = (event: SpeechRecognitionEventLike) => {
      const result = event.results[event.results.length - 1];
      const spoken = result[0]?.transcript?.trim() ?? "";
      setTranscript(spoken);
      if (!spoken) return;

      const m = matchByIntent(spoken.toLowerCase(), options);
      if (m) onMatch(m);
    };

    recognition.onerror = (event: SpeechRecognitionErrorEventLike) => {
      setStatus("error");
      setError(`Spraakfout: ${event.error}`);
    };

    recognition.onend = () => {
      if (active) {
        try {
          recognition.start();
          setStatus("listening");
        } catch {
          setStatus("idle");
        }
      }
    };

    try {
      recognition.start();
      setStatus("listening");
    } catch {
      setStatus("error");
      setError("Kon de microfoon niet starten.");
    }

    return () => {
      stopRecognition();
    };
  }, [active, onMatch, options, stopRecognition, supported]);

  return { status, transcript, error, supported };
}
