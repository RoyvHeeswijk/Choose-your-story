"use client";

import { CharacterProfile, PerspectiveId } from "@/data/gameData";

interface PerspectivePickerProps {
  characters: CharacterProfile[];
  onPick: (perspective: PerspectiveId) => void;
  onBack: () => void;
}

export default function PerspectivePicker({
  characters,
  onPick,
  onBack,
}: PerspectivePickerProps) {
  return (
    <section className="perspective-section">
      <div className="container">
        <div className="intro-panel">
          <h2>Kies 1 perspectief voor deze speelronde</h2>
          <p className="hero-desc small">
            Je houdt dit perspectief vast tot het einde. Daardoor worden scènes, details en spanning
            anders opgebouwd.
          </p>
          <div className="character-grid">
            {characters.map((character) => (
              <button
                key={character.id}
                className="character-card pickable"
                onClick={() => onPick(character.id)}
                aria-label={`Kies perspectief ${character.name}`}
              >
                <div
                  className="character-image"
                  style={{ backgroundImage: `url(${character.image})` }}
                  aria-hidden
                />
                <div className="character-content">
                  <h4>{character.name}</h4>
                  <p><strong>Rol:</strong> {character.role}</p>
                  <p className="quote">{character.introLine}</p>
                </div>
              </button>
            ))}
          </div>
          <button className="end-btn secondary" onClick={onBack}>Terug naar intro</button>
        </div>
      </div>
    </section>
  );
}
