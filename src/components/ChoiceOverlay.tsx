"use client";

import { useEffect, useRef, useState } from "react";
import { ChoiceData, ChoiceOption } from "@/data/gameData";

interface ChoiceOverlayProps {
  active: boolean;
  data: ChoiceData;
  rewindUsed: boolean;
  onChoice: (optionId: string) => void;
  onRewind: () => void;
  onToggleSidebar: () => void;
}

export default function ChoiceOverlay({
  active,
  data,
  rewindUsed,
  onChoice,
  onRewind,
  onToggleSidebar,
}: ChoiceOverlayProps) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [timerStarted, setTimerStarted] = useState(false);
  const [hoveredOption, setHoveredOption] = useState<ChoiceOption | null>(null);

  useEffect(() => {
    if (active) {
      setTimerStarted(false);
      setHoveredOption(null);
      const raf = requestAnimationFrame(() => {
        requestAnimationFrame(() => setTimerStarted(true));
      });

      timerRef.current = setTimeout(() => {
        onChoice(data.options[0].id);
      }, 15000);

      return () => {
        cancelAnimationFrame(raf);
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [active, data, onChoice]);

  if (!active) return null;

  return (
    <div className={`choice-overlay${active ? " active" : ""}`}>
      <div className="choice-content">
        <div className="choice-title">{data.title}</div>
        <div className="choice-subtitle">{data.subtitle}</div>
        <div className="choice-timer-bar">
          <div
            className="choice-timer-fill"
            style={{ width: timerStarted ? "0%" : "100%", transition: timerStarted ? "width 15s linear" : "none" }}
          />
        </div>

        {hoveredOption && (
          <div className="choice-preview">
            <div
              className="choice-preview-image"
              style={{ backgroundImage: `url(${hoveredOption.previewImage})` }}
            />
            <div className="choice-preview-text">
              <div className="choice-preview-label">Als je dit kiest...</div>
              <div className="choice-preview-teaser">{hoveredOption.previewTeaser}</div>
            </div>
          </div>
        )}

        <div className="choice-grid">
          {data.options.map((opt) => (
            <div
              key={opt.id}
              className={`choice-card${hoveredOption?.id === opt.id ? " hovered" : ""}`}
              onClick={() => onChoice(opt.id)}
              onMouseEnter={() => setHoveredOption(opt)}
              onMouseLeave={() => setHoveredOption(null)}
            >
              <div
                className="choice-card-thumb"
                style={{ backgroundImage: `url(${opt.previewImage})` }}
              >
                <div className="choice-card-thumb-overlay">
                  <div className="play-mini">▶</div>
                </div>
              </div>
              <div className="opt-label">{opt.label}</div>
              <div className="opt-desc">{opt.desc}</div>
              <div className="opt-meta">
                <span className="pct">{opt.pct}% koos dit</span>
                <span className={opt.riskClass}>Risico: {opt.risk}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="choice-actions">
          <button
            className={`action-btn${rewindUsed ? " disabled" : ""}`}
            onClick={onRewind}
          >
            {rewindUsed ? "⏪ Rewind (gebruikt)" : "⏪ Rewind (1x gratis)"}
          </button>
          <button className="action-btn" onClick={onToggleSidebar}>
            📊 Stats anderen
          </button>
        </div>
      </div>
    </div>
  );
}
