"use client";

const STATS = [
  { number: "1", label: "Kies perspectief" },
  { number: "2", label: "Maak kleine keuzes" },
  { number: "3", label: "Krijg grote payoff" },
];

export default function Stats() {
  return (
    <section className="stats">
      <div className="container">
        <h2 className="stats-title">Hoe het werkt</h2>
        <div className="stats-grid">
          {STATS.map((s) => (
            <div className="stat-card" key={s.label}>
              <div className="stat-number">{s.number}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
