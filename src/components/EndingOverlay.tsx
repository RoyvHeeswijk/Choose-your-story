"use client";

import { useEffect, useRef, useCallback } from "react";
import { EndingData } from "@/data/gameData";

interface EndingOverlayProps {
  active: boolean;
  ending: EndingData | null;
  choiceCount: number;
  onShare: () => void;
  onRestart: () => void;
  onGoHome: () => void;
}

const CONFETTI_COLORS = ["#ff6b6b", "#f7931e", "#4ecdc4", "#44a08d", "#fff", "#ffd93d", "#6c5ce7"];

export default function EndingOverlay({
  active,
  ending,
  choiceCount,
  onShare,
  onRestart,
  onGoHome,
}: EndingOverlayProps) {
  const confettiRef = useRef<HTMLDivElement>(null);

  const launchConfetti = useCallback(() => {
    const container = confettiRef.current;
    if (!container) return;
    container.innerHTML = "";
    for (let i = 0; i < 80; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti-piece";
      piece.style.left = Math.random() * 100 + "%";
      piece.style.backgroundColor = CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
      piece.style.width = (Math.random() * 8 + 6) + "px";
      piece.style.height = (Math.random() * 8 + 6) + "px";
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px";
      piece.style.animationDuration = (Math.random() * 2 + 2) + "s";
      piece.style.animationDelay = (Math.random() * 1.5) + "s";
      container.appendChild(piece);
    }
  }, []);

  useEffect(() => {
    if (active) launchConfetti();
    return () => {
      if (confettiRef.current) confettiRef.current.innerHTML = "";
    };
  }, [active, launchConfetti]);

  if (!active || !ending) return null;

  return (
    <div className={`ending-overlay${active ? " active" : ""}`}>
      <div className="confetti-container" ref={confettiRef} />
      <div className="ending-content">
        <div className="ending-badge">YOUR STORY IS COMPLETE</div>
        <div className="ending-title">{ending.title}</div>
        <div className="ending-subtitle">{ending.sub}</div>
        <div className="ending-desc">{ending.desc}</div>
        <div className="ending-stats">
          <div className="ending-stat-item">
            <div className="e-num">{choiceCount}</div>
            <div className="e-label">Choices made</div>
          </div>
          <div className="ending-stat-item">
            <div className="e-num">90 min</div>
            <div className="e-label">Runtime</div>
          </div>
          <div className="ending-stat-item">
            <div className="e-num">{ending.pct}</div>
            <div className="e-label">Chose this ending</div>
          </div>
        </div>
        <div className="ending-actions">
          <button className="end-btn secondary" onClick={onShare}>📤 Share result</button>
          <button className="end-btn primary" onClick={onRestart}>🔄 Play again — different choices</button>
          <button className="end-btn secondary" onClick={onGoHome}>🏠 Home</button>
        </div>
      </div>
    </div>
  );
}
