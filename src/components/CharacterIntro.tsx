"use client";

import { CharacterProfile, IntroScene } from "@/data/gameData";

interface CharacterIntroProps {
  introScenes: IntroScene[];
  characters: CharacterProfile[];
  onContinue: () => void;
}

export default function CharacterIntro({
  introScenes,
  characters,
  onContinue,
}: CharacterIntroProps) {
  return (
    <section className="intro-section">
      <div className="container">
        <div className="intro-panel">
          <h2>Voor je begint</h2>
          <div className="intro-list">
            {introScenes.map((scene) => (
              <article key={scene.title} className="intro-item">
                <h3>{scene.title}</h3>
                <p>{scene.body}</p>
              </article>
            ))}
          </div>

          <h3 className="intro-cast-title">Hoofdpersonages</h3>
          <div className="character-grid">
            {characters.map((character) => (
              <article key={character.id} className="character-card">
                <div
                  className="character-image"
                  style={{ backgroundImage: `url(${character.image})` }}
                  aria-hidden
                />
                <div className="character-content">
                  <h4>{character.name}</h4>
                  <p><strong>Rol:</strong> {character.role}</p>
                  <p><strong>Motief:</strong> {character.motif}</p>
                  <p><strong>Relatie:</strong> {character.relationshipToCrime}</p>
                </div>
              </article>
            ))}
          </div>

          <button className="play-btn" onClick={onContinue}>KIES JE PERSPECTIEF</button>
        </div>
      </div>
    </section>
  );
}
