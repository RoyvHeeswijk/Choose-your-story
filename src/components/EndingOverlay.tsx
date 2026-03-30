"use client";

import { EndingData } from "@/data/gameData";

interface EndingOverlayProps {
  active: boolean;
  ending: EndingData | null;
  choiceCount: number;
  unlockedCount: number;
  totalEndings: number;
  onShare: () => void;
  onRestart: () => void;
  onGoHome: () => void;
}

export default function EndingOverlay({
  active,
  ending,
  choiceCount,
  unlockedCount,
  totalEndings,
  onShare,
  onRestart,
  onGoHome,
}: EndingOverlayProps) {
  if (!active || !ending) return null;

  return (
    <div className={`ending-overlay${active ? " active" : ""}`}>
      <div className="ending-content">
        <div className="ending-badge">JOUW VERHAAL IS AFGEROND</div>
        <div className="ending-title">{ending.title}</div>
        <div className="ending-subtitle">{ending.sub}</div>
        <div className="ending-desc">{ending.desc}</div>
        <div className="ending-stats">
          <div className="ending-stat-item">
            <div className="e-num">{choiceCount}</div>
            <div className="e-label">Keuzes gemaakt</div>
          </div>
          <div className="ending-stat-item">
            <div className="e-num">90 min</div>
            <div className="e-label">Speelduur</div>
          </div>
          <div className="ending-stat-item">
            <div className="e-num">{unlockedCount}/{totalEndings}</div>
            <div className="e-label">Eindes vrijgespeeld</div>
          </div>
        </div>
        <div className="ending-desc" style={{ marginTop: -10, marginBottom: 28 }}>
          Nog te ontdekken: {Math.max(totalEndings - unlockedCount, 0)} eindes.
        </div>
        <div className="ending-actions">
          <button className="end-btn secondary" onClick={onShare}>Share resultaat</button>
          <button className="end-btn primary" onClick={onRestart}>Speel opnieuw</button>
          <button className="end-btn secondary" onClick={onGoHome}>Home</button>
        </div>
      </div>
    </div>
  );
}
