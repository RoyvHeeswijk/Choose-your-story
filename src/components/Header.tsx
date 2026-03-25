"use client";

interface HeaderProps {
  onGoHome: () => void;
}

export default function Header({ onGoHome }: HeaderProps) {
  return (
    <header className="header">
      <div className="container">
        <div className="logo" onClick={onGoHome}>
          CANAL+
        </div>
        <div className="profile">
          <span className="profile-name">Alex D.</span>
          <div className="avatar">AD</div>
        </div>
      </div>
    </header>
  );
}
