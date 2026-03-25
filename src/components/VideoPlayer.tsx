"use client";

import { useCallback, ReactNode } from "react";
import { formatTime, TOTAL_TIME, SceneSegment } from "@/data/gameData";

interface VideoPlayerProps {
  currentTime: number;
  playing: boolean;
  scene: SceneSegment;
  narratorParagraphCount: number;
  narratorSpeaking: boolean;
  onTogglePlay: () => void;
  onSkipBack: () => void;
  onSkipForward: () => void;
  onSeek: (time: number) => void;
  children?: ReactNode;
}

export default function VideoPlayer({
  currentTime,
  playing,
  scene,
  narratorParagraphCount,
  narratorSpeaking,
  onTogglePlay,
  onSkipBack,
  onSkipForward,
  onSeek,
  children,
}: VideoPlayerProps) {
  const pct = (currentTime / TOTAL_TIME) * 100;
  const timeStr = `${formatTime(currentTime)} / 90:00`;

  const visibleCount = Math.min(
    scene.narrative.length,
    Math.max(1, narratorParagraphCount + (narratorSpeaking ? 1 : 0))
  );
  const visibleParagraphs = scene.narrative.slice(0, visibleCount);

  const handleSeek = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const ratio = (e.clientX - rect.left) / rect.width;
      onSeek(Math.floor(ratio * TOTAL_TIME));
    },
    [onSeek]
  );

  const handleFullscreen = useCallback(() => {
    const el = document.getElementById("playerWrap");
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  return (
    <div className="container">
      <div className="player-wrap" id="playerWrap">
        <div className="scene-visual">
          <div className="scene-fallback" style={{ backgroundImage: `url(${scene.image})` }} />
          <div className="scene-overlay">
            <div className="scene-timer">{timeStr}</div>
            <div className="scene-narrative scene-subtitles">
              <h2 className="scene-chapter-title">{scene.title}</h2>
              <div className="scene-paragraphs">
                {visibleParagraphs.map((p, i) => {
                  const isBeingRead = i === narratorParagraphCount && narratorSpeaking;
                  const isSpoken = i < narratorParagraphCount;
                  const cls = isBeingRead ? " reading" : isSpoken ? " spoken" : "";
                  return (
                    <p
                      key={`${scene.title}-${i}`}
                      className={`scene-paragraph${cls}`}
                      style={{ animationDelay: `${i * 0.15}s` }}
                    >
                      {p}
                    </p>
                  );
                })}
              </div>
              {narratorSpeaking && (
                <div className="narrator-indicator">
                  <span className="narrator-eq">
                    <span className="eq-bar" />
                    <span className="eq-bar" />
                    <span className="eq-bar" />
                    <span className="eq-bar" />
                  </span>
                  Listening...
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="controls">
          <div className="progress-wrap" onClick={handleSeek}>
            <div className="progress-fill" style={{ width: `${pct}%` }} />
            <div className="choice-marker" style={{ left: "22.2%" }} title="Choice 1" />
            <div className="choice-marker" style={{ left: "44.4%" }} title="Choice 2" />
            <div className="choice-marker" style={{ left: "66.6%" }} title="Choice 3" />
            <div className="choice-marker" style={{ left: "88.8%" }} title="Choice 4" />
          </div>
          <div className="control-row">
            <div className="ctrl-left">
              <button className="ctrl-btn" onClick={onTogglePlay}>
                {playing ? "⏸" : "▶"}
              </button>
              <button className="ctrl-btn" onClick={onSkipBack}>⏪</button>
              <button className="ctrl-btn" onClick={onSkipForward}>⏩</button>
              <input type="range" className="volume-slider" min={0} max={100} defaultValue={80} />
              <span className="time-display">{timeStr}</span>
            </div>
            <div className="ctrl-right">
              <span className="chapter-label">
                {scene.title.replace(/^Chapter \d+\s*[—–-]\s*/i, "")}
              </span>
              <button className="ctrl-btn" onClick={handleFullscreen}>⛶</button>
            </div>
          </div>
        </div>

        {/* Rendered inside player-wrap so overlays stay visible in fullscreen */}
        {children}
      </div>
    </div>
  );
}
