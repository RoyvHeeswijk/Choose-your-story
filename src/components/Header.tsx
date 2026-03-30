"use client";

interface HeaderProps {
  onGoHome: () => void;
}

export default function Header({ onGoHome }: HeaderProps) {
  return (
    <header className="header">
      <div className="container">
        <div className="brand-wrap">
          <button className="logo" onClick={onGoHome} aria-label="Ga naar home">
            CANAL+
          </button>
          <nav className="top-nav" aria-label="Hoofdnavigatie">
            <button className="top-nav-link" onClick={onGoHome}>Home</button>
            <span className="top-nav-link muted">Series</span>
            <span className="top-nav-link muted">Films</span>
          </nav>
        </div>
        <div className="profile">
          <span className="profile-name">Profiel</span>
          <div className="avatar">R</div>
        </div>
      </div>
    </header>
  );
}
