"use client";

import { ChoiceData } from "@/data/gameData";

interface ChoiceOverlayClickProps {
  active: boolean;
  data: ChoiceData;
  onChoice: (optionId: string) => void;
}

export default function ChoiceOverlayClick({ active, data, onChoice }: ChoiceOverlayClickProps) {
  if (!active) return null;

  return (
    <div className="choice-bottom-overlay">
      <div className="choice-bottom-content">
        <div className="choice-bottom-title">{data.title}</div>
        <div className="choice-bottom-grid">
          {data.options.map((opt) => (
            <button
              key={opt.id}
              className="choice-bottom-btn"
              onClick={() => onChoice(opt.id)}
              aria-label={`Choose option ${opt.id}: ${opt.label}`}
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
