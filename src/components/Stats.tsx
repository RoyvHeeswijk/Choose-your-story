"use client";

const STATS = [
  { number: "8", label: "Unique endings" },
  { number: "90", label: "Min. your story" },
  { number: "78%", label: "Viewer rating" },
  { number: "-40%", label: "Less scrolling" },
  { number: "+40%", label: "Engagement" },
];

export default function Stats() {
  return (
    <section className="stats">
      <div className="container">
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
