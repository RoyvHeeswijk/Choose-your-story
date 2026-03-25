export interface SceneSegment {
  title: string;
  narrative: string[];
  image: string;
}

export interface ChapterData {
  start: number;
  title: string;
  defaultScene: SceneSegment;
  choiceScenes?: Record<string, SceneSegment>;
}

export interface ChoiceOption {
  id: string;
  label: string;
  desc: string;
  pct: number;
  risk: string;
  riskClass: string;
  previewImage: string;
  previewTeaser: string;
}

export interface ChoiceData {
  title: string;
  subtitle: string;
  options: ChoiceOption[];
}

export interface EndingData {
  title: string;
  sub: string;
  desc: string;
  pct: string;
}

export const TOTAL_TIME = 5400;
export const CHOICE_POINTS = [1200, 2400, 3600, 4800];

export const CHAPTERS: ChapterData[] = [
  {
    start: 0,
    title: "Chapter 1 — The Brief",
    defaultScene: {
      title: "Chapter 1 — The Brief",
      narrative: [
        "Two-thirty in the morning. Rain on the window. On Thomas's desk, an envelope sealed with red wax — no return address. \"Charles de Vries. Murdered. The police are looking in the wrong place.\"",
        "Charles de Vries: businessman, philanthropist, found dead in his penthouse. No sign of forced entry. And somewhere in this city, a killer still walks free.",
      ],
      image: "/images/scene-intro.png",
    },
  },
  {
    start: 1200,
    title: "Chapter 2 — The Investigation",
    defaultScene: {
      title: "Chapter 2 — The Crime Scene",
      narrative: [
        "The penthouse. Police tape. A chalk outline on the floor. And there on the counter — exhibit four — a bloodstained Italian leather glove.",
        "Three names. Richard de Vries, the husband. Sophie Laurent, the mistress. Marcus van den Berg, the business rival. His phone buzzes: \"Tick tock, detective.\"",
      ],
      image: "/images/scene-crime.png",
    },
    choiceScenes: {
      A: {
        title: "Chapter 2 — The Estate",
        narrative: [
          "Gravel drives, iron gates, old money. Richard opens the door with red-rimmed eyes. \"I was on my yacht.\" But Thomas checked the harbor logs — the yacht never left the dock.",
          "In the hall closet: a box of Italian leather gloves. One pair is missing.",
        ],
        image: "/images/scene-mansion.png",
      },
      B: {
        title: "Chapter 2 — The Shadow",
        narrative: [
          "Sophie Laurent, red coat, quick steps through rain-slick Amsterdam streets. Thomas follows at a distance. She slips into a private club on the Keizersgracht.",
          "She emerges with Erik Janssen — Charles's lawyer. They kiss in the shadows. This is no new fling. Sophie had an exit plan.",
        ],
        image: "/images/scene-mistress.png",
      },
      C: {
        title: "Chapter 2 — The Money Trail",
        narrative: [
          "Thirty-fourth floor, Van den Berg Industries. Financial filings reveal a two-point-three-billion-euro takeover — blocked by Charles. Without him, the deal closes.",
          "Hidden transfers to Switzerland. Hundreds of thousands. The security camera blinks. Is Thomas alone on this floor?",
        ],
        image: "/images/scene-corporate.png",
      },
    },
  },
  {
    start: 2400,
    title: "Chapter 3 — The Witness",
    defaultScene: {
      title: "Chapter 3 — Voices in the Dark",
      narrative: [
        "A dark alley behind Central Station. A nervous man steps from the shadows. \"I was there that night. I heard the argument. The glass breaking. And the silence after.\"",
        "But he has a price. And Thomas must decide how far he will go for the truth.",
      ],
      image: "/images/scene-witness.png",
    },
  },
  {
    start: 3600,
    title: "Chapter 4 — The Threat",
    defaultScene: {
      title: "Chapter 4 — \"Stop. Now.\"",
      narrative: [
        "Two a.m. Thomas sits in his car. His phone lights up — a photo of himself, taken today. Underneath, three words: \"STOP. OR ELSE.\"",
        "Someone is following him. Someone is afraid. That means Thomas is close. Closer than he realizes.",
      ],
      image: "/images/scene-threat.png",
    },
  },
  {
    start: 4800,
    title: "Chapter 5 — Unmasked",
    defaultScene: {
      title: "Chapter 5 — Eye to Eye",
      narrative: [
        "An abandoned warehouse. A single bulb swings from the ceiling. On the table: photos, documents, witness statements. The door opens. Footsteps on concrete.",
        "\"So you know,\" says the figure. \"I know,\" says Thomas. \"Confess. Or I show the world.\"",
      ],
      image: "/images/scene-confrontation.png",
    },
  },
];

export const CHOICES_DATA: ChoiceData[] = [
  {
    title: "The bloody glove points three ways...",
    subtitle: "One trail leads to the truth. The other two to danger.",
    options: [
      {
        id: "A",
        label: "Confront the husband",
        desc: "Thomas drives to the estate for an unannounced visit.",
        pct: 65,
        risk: "High",
        riskClass: "risk-high",
        previewImage: "/images/scene-mansion.png",
        previewTeaser:
          "Richard opens the door with bloodshot eyes. In the hall closet Thomas finds a glove box — one pair is missing...",
      },
      {
        id: "B",
        label: "Shadow the mistress",
        desc: "Sophie is hiding something. Thomas melts into the night.",
        pct: 25,
        risk: "Medium",
        riskClass: "risk-med",
        previewImage: "/images/scene-mistress.png",
        previewTeaser:
          "Sophie hurries through rainy Amsterdam. At a private club she meets Charles's lawyer. They kiss in the shadows...",
      },
      {
        id: "C",
        label: "Follow the money",
        desc: "Money never lies. Thomas breaks into headquarters.",
        pct: 10,
        risk: "Low",
        riskClass: "risk-low",
        previewImage: "/images/scene-corporate.png",
        previewTeaser:
          "On the thirty-fourth floor Thomas finds hidden transfers to Switzerland. A two-point-three-billion deal — blocked by Charles...",
      },
    ],
  },
  {
    title: "\"I was there that night. I heard everything.\"",
    subtitle: "The witness knows more than the police. But freedom has a price.",
    options: [
      {
        id: "A",
        label: "Accept the deal",
        desc: "The witness demands immunity. Thomas hesitates.",
        pct: 45,
        risk: "High",
        riskClass: "risk-high",
        previewImage: "/images/scene-witness.png",
        previewTeaser:
          "The witness reveals details only an eyewitness could know. But his price is steep — and his motives unclear...",
      },
      {
        id: "B",
        label: "Bluff and intimidate",
        desc: "\"I already know more than you think. Talk. Now.\"",
        pct: 35,
        risk: "Medium",
        riskClass: "risk-med",
        previewImage: "/images/scene-witness.png",
        previewTeaser:
          "Thomas plays high stakes. The witness flinches — but something flickers in his eyes. Does he know more than he admits?",
      },
      {
        id: "C",
        label: "Trust no one",
        desc: "Thomas smells a trap. He digs on his own.",
        pct: 20,
        risk: "Low",
        riskClass: "risk-low",
        previewImage: "/images/scene-crime.png",
        previewTeaser:
          "Back at the crime scene. Alone, at night. Thomas finds something forensics missed — a second glove...",
      },
    ],
  },
  {
    title: "\"STOP. OR ELSE.\"",
    subtitle: "They know where he lives. Thomas can retreat — or go on the offensive.",
    options: [
      {
        id: "A",
        label: "Bring in the police",
        desc: "Inspector De Groot is an old acquaintance.",
        pct: 30,
        risk: "Low",
        riskClass: "risk-low",
        previewImage: "/images/scene-witness.png",
        previewTeaser:
          "De Groot listens, but his eyes show unease. \"Thomas, there are people inside the force who don't want you to finish this case.\"",
      },
      {
        id: "B",
        label: "Set a trap",
        desc: "Thomas plants false information as bait.",
        pct: 50,
        risk: "High",
        riskClass: "risk-high",
        previewImage: "/images/scene-threat.png",
        previewTeaser:
          "The bait works. Thomas sees movement at the address he leaked. At last — a face behind the threat...",
      },
      {
        id: "C",
        label: "Go undercover",
        desc: "Thomas infiltrates the suspect's inner circle.",
        pct: 20,
        risk: "Medium",
        riskClass: "risk-med",
        previewImage: "/images/scene-corporate.png",
        previewTeaser:
          "Under a false identity Thomas enters a world of power and secrets. One mistake and he is burned...",
      },
    ],
  },
  {
    title: "The killer stands before him. This is the moment.",
    subtitle: "One chance. One choice. The wrong move and it all falls apart.",
    options: [
      {
        id: "A",
        label: "Lay it all out",
        desc: "\"It's over. I know what you did.\"",
        pct: 40,
        risk: "High",
        riskClass: "risk-high",
        previewImage: "/images/scene-confrontation.png",
        previewTeaser:
          "Thomas slams the evidence down. The killer pales. Then reaches for something inside a coat pocket...",
      },
      {
        id: "B",
        label: "Play the long game",
        desc: "Wait. Watch. Let the silence do the work.",
        pct: 38,
        risk: "Medium",
        riskClass: "risk-med",
        previewImage: "/images/scene-confrontation.png",
        previewTeaser:
          "Thomas talks about nothing and everything. The killer grows restless. The silence presses. Until a confession slips out...",
      },
      {
        id: "C",
        label: "Offer a surprise pact",
        desc: "\"I know who set you up.\"",
        pct: 22,
        risk: "Low",
        riskClass: "risk-low",
        previewImage: "/images/scene-confrontation.png",
        previewTeaser:
          "The killer frowns. \"What do you mean?\" Thomas explains a larger conspiracy — and offers an alliance...",
      },
    ],
  },
];

export const ENDINGS: Record<string, EndingData> = {
  AAAA: {
    title: '"The Husband Did It"',
    sub: "The classic motive — jealousy and greed.",
    desc: 'Richard de Vries broke that night. Tears streamed down his face when Thomas placed the glove on the table. Years of rage, jealousy of Charles\'s success, the knowledge that his own wife loved his brother more than him. One moment of fury. One blow too many. Richard will spend the rest of his life behind bars — but in his eyes Thomas saw something he did not expect. Relief.',
    pct: "18%",
  },
  BBBB: {
    title: '"The Mistress\'s Plot"',
    sub: "Behind every great man stands a woman with a plan.",
    desc: 'Sophie Laurent played the perfect game. She manipulated Charles, seduced his lawyer, and staged a murder that looked like a botched break-in. The money — twenty-three million euros — was already waiting in a Monaco account. Thomas found the plane tickets in her apartment. Two seats, first class, one way. Sophie looked at him with those green eyes and smiled. "You\'re good, detective. But not good enough." She was right. She almost got away.',
    pct: "12%",
  },
  CCCC: {
    title: '"Framed by the Rival"',
    sub: "In big business, a human life is a line item.",
    desc: 'Marcus van den Berg had planned it clinically. No emotion, no haste, no loose ends. A hired killer, paid through three shell companies. The two-point-three-billion deal went through the next morning. Thomas found the final piece in a hidden safe — a USB drive with phone recordings. Van den Berg did not sound like a murderer. He sounded like a CEO making a business decision. That made it even more chilling.',
    pct: "8%",
  },
  MIXED: {
    title: '"The Stranger Truth"',
    sub: "Sometimes the truth is stranger than the lie.",
    desc: 'Thomas stood at the harbor, staring at a face he knew only from photographs. Charles de Vries. Alive. Breathing. Grinning. "Surprised, detective?" Charles had staged his own death — a master plan to escape his debts, his wife, and a trial that would have cost him twenty years. The "victim" had directed the whole performance. Thomas now had a choice: call the police, or walk away and pretend he had seen nothing.',
    pct: "24%",
  },
  AABB: {
    title: '"Double Game"',
    sub: "Two hearts, one dark plan.",
    desc: "Richard and Sophie. Husband and mistress. They had found each other in their shared hatred of Charles, and in the millions that would come when he died. Thomas discovered their secret meeting place — a hotel room in The Hague, booked under a false name. The confrontation nearly cost him his life when Richard pulled a gun. But Thomas had already recorded the conversation. The police arrived within six minutes.",
    pct: "15%",
  },
  ABAB: {
    title: '"Cat and Mouse"',
    sub: "The hunter became the prey — until he flipped the script.",
    desc: 'Somewhere along the line Thomas had gone from investigator to suspect. Fake evidence in his office. His fingerprints at the scene — planted by someone with access to police files. They tried to frame him. But Thomas played along, pretended not to notice, and used his "suspect" status to get closer than would ever have been possible otherwise. It was the most dangerous bluff of his life. And it worked.',
    pct: "10%",
  },
  ABBA: {
    title: '"Justice on the Edge"',
    sub: "The law is a line. Thomas stood with one foot over it.",
    desc: "Thomas found the killer. He had the proof. But the proof was obtained illegally — no court would accept it. The murderer would walk free. Unless Thomas was willing to break the law himself. He stood on a bridge over the Amstel, the dossier in his hands, and made a choice that would change him forever. Some truths find their way to the light. Others sink to the bottom of a canal.",
    pct: "8%",
  },
  DEFAULT: {
    title: '"Your Unique Story"',
    sub: "A path no one else walked.",
    desc: "Thomas solved the case — but not the way he expected. Every choice pushed him further from a simple truth, and closer to something far more complicated. In the end he stood alone in his office, case files closed, whiskey poured. The case was closed. But the answer he found was one nobody wanted — not even him. Some mysteries are better left unsolved.",
    pct: "5%",
  },
};

export function getEndingKey(choices: string[]): string {
  const key = choices.join("");
  if (ENDINGS[key]) return key;
  const counts: Record<string, number> = { A: 0, B: 0, C: 0 };
  choices.forEach((c) => (counts[c] = (counts[c] || 0) + 1));
  const majority = Object.keys(counts).reduce((a, b) =>
    counts[a] >= counts[b] ? a : b
  );
  if (counts[majority] >= 3) {
    if (majority === "A") return "AAAA";
    if (majority === "B") return "BBBB";
    if (majority === "C") return "CCCC";
  }
  return "MIXED";
}

export function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

export function getCurrentChapter(currentTime: number): ChapterData {
  let ch = CHAPTERS[0];
  for (let i = CHAPTERS.length - 1; i >= 0; i--) {
    if (currentTime >= CHAPTERS[i].start) {
      ch = CHAPTERS[i];
      break;
    }
  }
  return ch;
}

export function getActiveScene(
  chapter: ChapterData,
  choices: string[],
  chapterIndex: number
): SceneSegment {
  if (chapterIndex > 0 && chapter.choiceScenes) {
    const prevChoice = choices[chapterIndex - 1];
    if (prevChoice && chapter.choiceScenes[prevChoice]) {
      return chapter.choiceScenes[prevChoice];
    }
  }
  return chapter.defaultScene;
}

export function getChapterIndex(currentTime: number): number {
  for (let i = CHAPTERS.length - 1; i >= 0; i--) {
    if (currentTime >= CHAPTERS[i].start) return i;
  }
  return 0;
}
