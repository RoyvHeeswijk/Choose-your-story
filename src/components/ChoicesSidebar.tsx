"use client";

import { CHOICES_DATA } from "@/data/gameData";

interface ChoicesSidebarProps {
  open: boolean;
  visible: boolean;
  choices: string[];
  customInputs: string[];
  onToggle: () => void;
}

export default function ChoicesSidebar({
  open,
  visible,
  choices,
  customInputs,
  onToggle,
}: ChoicesSidebarProps) {
  return (
    <>
      <button
        className={`sidebar-toggle${visible ? " visible" : ""}`}
        onClick={onToggle}
        aria-label="Open keuzeoverzicht"
      >
        📋
      </button>
      <div className={`choices-sidebar${open ? " open" : ""}`}>
        <div className="sidebar-title">Jouw keuzes</div>
        <div>
          {choices.length === 0 ? (
            <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
              Nog geen keuzes gemaakt.
            </p>
          ) : (
            choices.map((c, i) => {
              const opt = CHOICES_DATA[i]?.options.find((o) => o.id === c);
              return (
                <div className="choice-history-item" key={i}>
                  <div className="ch-label">Keuze {i + 1}</div>
                  <div className="ch-text">
                    Optie {c}: {opt ? opt.label : "—"}
                  </div>
                  {opt?.effect && <div className="ch-effect">{opt.effect}</div>}
                  {customInputs[i] && <div className="ch-input">Input: "{customInputs[i]}"</div>}
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
