"use client";

interface HeroProps {
  onStart: () => void;
}

export default function Hero({ onStart }: HeroProps) {
  return (
    <section className="hero">
      <div className="container">
        <div className="badge">Kies jouw verhaal ⭐</div>
        <h1>The Perfect Crime</h1>
        <p className="hero-desc">
          Privédetective Thomas Verhoeven krijgt een mysterieuze opdracht: los de moord op zakenman
          Charles de Vries op. Maar niets is wat het lijkt -{" "}
          <strong>JIJ bepaalt wie de dader is.</strong>
        </p>
        <p className="hero-desc">
          Tijdens elk keuzemoment kun je altijd klikken en de microfoon aan- of uitzetten wanneer je wilt.
        </p>
        <button className="play-btn" onClick={onStart}>
          <span className="icon">▶</span> START JE VERHAAL
        </button>
      </div>
    </section>
  );
}
