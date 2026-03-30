"use client";

interface HeroProps {
  onStart: () => void;
  unlockedCount: number;
  totalEndings: number;
}

export default function Hero({ onStart, unlockedCount, totalEndings }: HeroProps) {
  return (
    <section className="hero">
      <div className="container">
        <div className="hero-layout">
          <div className="hero-copy">
            <div className="badge">Jij stuurt dit verhaal</div>
            <h1>Schaduw van de Waarheid</h1>
            <p className="hero-desc">
              Eva Vermeer, een bekende journalist, wordt dood gevonden in Amsterdam.
              <strong> Ongeluk, zelfmoord of moord? Jij onderzoekt wat echt gebeurd is.</strong>
            </p>
            <p className="hero-desc">
              Je start als onafhankelijk onderzoeker, kiest jouw onderzoekslijn en bouwt stap voor
              stap je eigen conclusie op.
            </p>
            <p className="hero-progress">
              Ontgrendelde eindes: <strong>{unlockedCount}</strong> / {totalEndings}
            </p>
            <button className="play-btn" onClick={onStart}>
              START INTRODUCTIE
            </button>
          </div>

          <div className="hero-media">
            <div className="hero-media-image" style={{ backgroundImage: "url('/images/scene-witness.png')" }} />
            <div className="hero-media-overlay">
              <p>Eva stond op het punt een onthulling te publiceren. Nu ontbreekt de waarheid.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
