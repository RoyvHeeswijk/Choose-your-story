"use client";

import { CHOICES_DATA } from "@/data/gameData";

interface ChoicesSidebarProps {
  open: boolean;
  visible: boolean;
  choices: string[];
  onToggle: () => void;
}

export default function ChoicesSidebar({ open, visible, choices, onToggle }: ChoicesSidebarProps) {
  return (
    <>
      <button
        className={`sidebar-toggle${visible ? " visible" : ""}`}
        onClick={onToggle}
      >
        📋
      </button>
      <div className={`choices-sidebar${open ? " open" : ""}`}>
        <div className="sidebar-title">Your choices</div>
        <div>
          {choices.length === 0 ? (
            <p style={{ color: "var(--text-secondary)", fontSize: 15 }}>
              No choices yet. Start the story!
            </p>
          ) : (
            choices.map((c, i) => {
              const opt = CHOICES_DATA[i]?.options.find((o) => o.id === c);
              return (
                <div className="choice-history-item" key={i}>
                  <div className="ch-label">Choice {i + 1}</div>
                  <div className="ch-text">
                    Option {c}: {opt ? opt.label : "—"}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
