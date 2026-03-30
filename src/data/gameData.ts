export type PerspectiveId = "colleague" | "politician" | "expartner";
export type ChoiceTrigger = "natural" | "checkpoint";
export type ChoiceType = "simple" | "major";

export interface SceneSegment {
  title: string;
  narrative: string[];
  image: string;
  video?: string;
}

type PerspectiveScene = SceneSegment | Record<PerspectiveId, SceneSegment>;

export interface ChapterData {
  start: number;
  title: string;
  defaultScene: PerspectiveScene;
  choiceScenes?: Record<string, PerspectiveScene>;
}

export interface CharacterProfile {
  id: PerspectiveId;
  name: string;
  role: string;
  motif: string;
  relationshipToCrime: string;
  image: string;
  introLine: string;
}

export interface IntroScene {
  title: string;
  body: string;
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
  effect: string;
  intentTags: string[];
}

export interface ChoiceData {
  id: string;
  title: string;
  subtitle: string;
  type: ChoiceType;
  trigger: ChoiceTrigger;
  chapterIndex: number;
  checkpointTime: number;
  options: ChoiceOption[];
}

export interface EndingData {
  title: string;
  sub: string;
  desc: string;
  pct: string;
}

export const TOTAL_TIME = 5400;
export const CHOICE_POINTS = [1700, 3300, 4500];

export const CHARACTER_PROFILES: CharacterProfile[] = [
  {
    id: "colleague",
    name: "Noor van Dijk",
    role: "Collega-journalist",
    motif: "Wil Eva's grote onthulling afmaken en tegelijk haar eigen carrière veiligstellen.",
    relationshipToCrime: "Had als laatste toegang tot Eva's concept-artikel en wil het direct overnemen.",
    image: "/images/scene-intro.png",
    introLine: "Als dit verhaal online komt, verandert alles. Ook voor mij.",
  },
  {
    id: "politician",
    name: "Victor Smit",
    role: "Invloedrijke politicus",
    motif: "Wil voorkomen dat Eva's publicatie zijn machtspositie beschadigt.",
    relationshipToCrime: "Wordt meerdere keren genoemd in Eva's notities over corruptie en deals.",
    image: "/images/scene-mansion.png",
    introLine: "Mensen verwarren invloed graag met schuld. Dat komt hen goed uit.",
  },
  {
    id: "expartner",
    name: "Milan Vos",
    role: "Ex-partner van Eva",
    motif: "Wil Eva beschermen, zelfs nu ze er niet meer is.",
    relationshipToCrime: "Kent Eva's verborgen archief en lijkt meer te weten dan hij vertelt.",
    image: "/images/scene-mistress.png",
    introLine: "Eva vertrouwde mij dingen toe die nooit in haar artikel stonden.",
  },
];

export const INTRO_SCENES: IntroScene[] = [
  {
    title: "Welkom bij jouw verhaal",
    body: "Journalist Eva Vermeer wordt dood gevonden in haar Amsterdamse appartement. Officieel: een val van de trap. Jij gelooft dat niet.",
  },
  {
    title: "Eerst de mensen, dan de keuzes",
    body: "Eva stond op het punt een onthulling te publiceren. In haar omgeving staan drie sleutelpersonen centraal: collega, politicus en ex-partner.",
  },
  {
    title: "Analyse bepaalt je waarheid",
    body: "Je kiest welke bewijzen je vertrouwt en welke verbanden je legt. Er is geen automatisch goed antwoord, alleen jouw interpretatie.",
  },
];

export const CHAPTERS: ChapterData[] = [
  {
    start: 0,
    title: "Hoofdstuk 1 — Schaduw over Amsterdam",
    defaultScene: {
      colleague: {
        title: "Hoofdstuk 1 — De gesloten zaak",
        narrative: [
          "Regen tikt tegen de ramen van Eva Vermeers appartement. De politie sluit haar dossier als ongeluk, maar haar laptop stond open op een onvoltooid artikel.",
          "Als onafhankelijk onderzoeker krijg je toegang tot haar notities, berichten en een lijst met namen die ze net voor haar dood onderzocht.",
        ],
        image: "/images/scene-intro.png",
      },
      politician: {
        title: "Hoofdstuk 1 — De laatste draft",
        narrative: [
          "In Eva's cloudmap vind je een concept met de titel 'Schaduw van de Waarheid'. De alinea over politicus Victor Smit is half verwijderd.",
          "Twee uur voor haar dood stuurde Eva: 'Als mij iets overkomt, kijk dan naar wie dit verhaal wil stoppen.'",
        ],
        image: "/images/scene-mansion.png",
      },
      expartner: {
        title: "Hoofdstuk 1 — Onvoltooide lijnen",
        narrative: [
          "De tijdlijn klopt niet: Eva's laatste spraakmemo is gemaakt na het tijdstip dat volgens de politie haar val plaatsvond.",
          "Iemand heeft bestanden verplaatst in haar archief. Wat ontbreekt lijkt belangrijker dan wat overblijft.",
        ],
        image: "/images/scene-mistress.png",
      },
    },
  },
  {
    start: 1200,
    title: "Hoofdstuk 2 — Drie gezichten van de waarheid",
    defaultScene: {
      colleague: {
        title: "Hoofdstuk 2 — Noor onder druk",
        narrative: [
          "Noor zegt dat ze Eva's artikel alleen wilde beschermen. Toch staat haar naam op een conceptversie waarin cruciale paragrafen ontbreken.",
          "Ze beweert dat Eva haar niet meer vertrouwde. De vraag is: omdat Noor iets wist, of omdat Noor iets deed?",
        ],
        image: "/images/scene-crime.png",
      },
      politician: {
        title: "Hoofdstuk 2 — Victor in beeld",
        narrative: [
          "Victor Smit ontkent alles in Eva's notities. Zijn woordvoerder noemt haar onderzoek 'speculatie'.",
          "Toch blijkt dat Eva meerdere afspraken met zijn staf had in de week voor haar dood.",
        ],
        image: "/images/scene-threat.png",
      },
      expartner: {
        title: "Hoofdstuk 2 — Milan zwijgt",
        narrative: [
          "Milan geeft je Eva's oude telefoon, maar zonder simkaart. 'Die had ze elders bewaard,' zegt hij.",
          "In zijn reacties zit twijfel: hij lijkt bang voor wat je vindt, of voor wat je al weet.",
        ],
        image: "/images/scene-mistress.png",
      },
    },
    choiceScenes: {
      A: {
        colleague: {
          title: "Hoofdstuk 2 — Directe confrontatie",
          narrative: [
            "Je kiest voor directe gesprekken. Noor reageert fel zodra je de ontbrekende alinea's laat zien.",
            "Victor verbreekt het interview na één vraag over financiële donaties. Milan zegt alleen: 'Je zit dicht op de kern.'",
          ],
          image: "/images/scene-mansion.png",
        },
        politician: {
          title: "Hoofdstuk 2 — Politieke druk",
          narrative: [
            "Na je vragen over Victor ontvang je een anonieme waarschuwing: 'Stop met graven als je veilig wilt blijven.'",
            "Noor wil publiceren, maar alleen als jij eerst je bronnen prijsgeeft.",
          ],
          image: "/images/scene-mansion.png",
        },
        expartner: {
          title: "Hoofdstuk 2 — Breuklijnen",
          narrative: [
            "Milan ziet je bericht en belt meteen terug. Zijn stem breekt als je Eva's laatste memo citeert.",
            "Hij noemt één detail dat nergens in het dossier staat: Eva droeg die avond haar recorder.",
          ],
          image: "/images/scene-mansion.png",
        },
      },
      B: {
        colleague: {
          title: "Hoofdstuk 2 — Observeren in stilte",
          narrative: [
            "Je luistert meer dan je spreekt. Noor en Victor lijken elkaar niet te vertrouwen, maar delen dezelfde framing over Eva.",
            "In metadata van een geüploade foto zie je dat Eva op de avond van haar dood niet thuis was op het genoemde tijdstip.",
          ],
          image: "/images/scene-mistress.png",
        },
        politician: {
          title: "Hoofdstuk 2 — Verborgen netwerk",
          narrative: [
            "Via agenda-overlap ontdek je dat Victor's adviseur en Noor kort na elkaar in Eva's buurt waren.",
            "Milan ontkent betrokkenheid, maar wist wel exact wanneer Eva haar concept afrondde.",
          ],
          image: "/images/scene-threat.png",
        },
        expartner: {
          title: "Hoofdstuk 2 — Tegenstrijdige signalen",
          narrative: [
            "Milan zegt dat Eva afstand van hem nam om hem te beschermen.",
            "Noor zegt juist dat Milan haar die week nog wilde spreken over 'het laatste hoofdstuk'.",
          ],
          image: "/images/scene-mistress.png",
        },
      },
      C: {
        colleague: {
          title: "Hoofdstuk 2 — Data en bewijs",
          narrative: [
            "Je volgt geldstromen en serverlogs. Een betaling aan een PR-bureau valt precies samen met Eva's laatste onderzoekslijn.",
            "In een verwijderde map staat een spreadsheet met de codenaam 'VV-FINAL'.",
          ],
          image: "/images/scene-corporate.png",
        },
        politician: {
          title: "Hoofdstuk 2 — Sporen in systemen",
          narrative: [
            "Logbestanden tonen dat iemand op afstand in Eva's account zat terwijl haar telefoon offline was.",
            "De gebruikte IP-range loopt via een overheidsnetwerk dat aan Victor's ministerie is gelinkt.",
          ],
          image: "/images/scene-corporate.png",
        },
        expartner: {
          title: "Hoofdstuk 2 — Achtergelaten code",
          narrative: [
            "Je vindt in Eva's notities een korte codezin die alleen Milan kan verklaren.",
            "Hij geeft de sleutel, maar waarschuwt: 'Niet alles wat zij schreef, was bedoeld om publiek te worden.'",
          ],
          image: "/images/scene-corporate.png",
        },
      },
    },
  },
  {
    start: 2400,
    title: "Hoofdstuk 3 — Breuk in het verhaal",
    defaultScene: {
      colleague: {
        title: "Hoofdstuk 3 — Onvolledige waarheid",
        narrative: [
          "Een bron van Eva wil praten, maar alleen off-record. Hij zegt dat Eva opzettelijk informatie achterhield.",
          "Dat verandert alles: was ze slachtoffer van haar onderzoek, of regisseur van het spel?",
        ],
        image: "/images/scene-witness.png",
      },
      politician: {
        title: "Hoofdstuk 3 — Framing",
        narrative: [
          "Media nemen het ongeluk-verhaal over. Jouw bevindingen worden weggezet als complotdenken.",
          "Noor twijfelt of ze nog wil publiceren. Milan zegt dat tijd tegen je werkt.",
        ],
        image: "/images/scene-witness.png",
      },
      expartner: {
        title: "Hoofdstuk 3 — De ontbrekende opname",
        narrative: [
          "De recorder van Eva wordt gevonden, maar de laatste minuut ontbreekt.",
          "In de vorige minuten hoor je paniek, een mannenstem, en Eva die zegt: 'Niet via de trap.'",
        ],
        image: "/images/scene-witness.png",
      },
    },
  },
  {
    start: 3600,
    title: "Hoofdstuk 4 — Kantelpunt",
    defaultScene: {
      colleague: {
        title: "Hoofdstuk 4 — Onder druk",
        narrative: [
          "Je krijgt een bericht zonder afzender met een foto van jouw voordeur.",
          "Kort daarna verdwijnt een map uit Eva's cloud. Iemand kijkt mee terwijl jij onderzoekt.",
        ],
        image: "/images/scene-threat.png",
      },
      politician: {
        title: "Hoofdstuk 4 — Politieke schade",
        narrative: [
          "Victor verschijnt onverwacht in een live-interview en noemt Eva's onderzoek 'persoonlijke wraak'.",
          "Zijn verhaal klinkt overtuigend, maar botst met drie feiten uit jouw dossier.",
        ],
        image: "/images/scene-threat.png",
      },
      expartner: {
        title: "Hoofdstuk 4 — Breekbare bondgenoten",
        narrative: [
          "Noor en Milan wijzen naar elkaar. Beiden geven bruikbare info, beiden houden iets achter.",
          "Jouw interpretatie bepaalt wie je vertrouwt in de laatste fase.",
        ],
        image: "/images/scene-threat.png",
      },
    },
  },
  {
    start: 4800,
    title: "Hoofdstuk 5 — Schaduw van de Waarheid",
    defaultScene: {
      colleague: {
        title: "Hoofdstuk 5 — Eindconclusie",
        narrative: [
          "Je legt notities, metadata, getuigenverklaringen en financiële sporen naast elkaar.",
          "De officiële versie kan niet langer zonder vragen blijven staan. Maar wat jij gelooft, bepaalt de uitkomst.",
        ],
        image: "/images/scene-confrontation.png",
      },
      politician: {
        title: "Hoofdstuk 5 — De laatste puzzel",
        narrative: [
          "Was Eva's dood een ongeluk, zelfmoord, of moord die als ongeluk werd verpakt?",
          "Jouw dossier ondersteunt meerdere verklaringen, maar alleen één narratief krijgt de publieke waarheid.",
        ],
        image: "/images/scene-confrontation.png",
      },
      expartner: {
        title: "Hoofdstuk 5 — Wat bleef verborgen",
        narrative: [
          "Je ontdekt dat Eva bewust twee versies van haar verhaal had voorbereid.",
          "Misschien wilde ze iemand ontmaskeren. Misschien wilde ze zelf verdwijnen in de ruis.",
        ],
        image: "/images/scene-confrontation.png",
      },
    },
  },
];

export const STORY_CHOICES: ChoiceData[] = [
  {
    id: "trust_start",
    title: "Waar begin je met analyseren?",
    subtitle: "Eerst een eenvoudige keuze om je onderzoekslijn te bepalen.",
    type: "simple",
    trigger: "natural",
    chapterIndex: 1,
    checkpointTime: 1700,
    options: [
      {
        id: "A",
        label: "Ga direct in gesprek",
        desc: "Je confronteert één sleutelpersoon met Eva's laatste notities.",
        pct: 36,
        risk: "Medium",
        riskClass: "risk-med",
        previewImage: "/images/scene-mansion.png",
        previewTeaser: "Je krijgt snelle reacties, maar ook defensief gedrag.",
        effect: "Snelle info, hogere kans op misleiding.",
        intentTags: ["gesprek", "confronteer", "vragen", "direct"],
      },
      {
        id: "B",
        label: "Observeer eerst patronen",
        desc: "Je analyseert timelines, gedragsveranderingen en metadata.",
        pct: 34,
        risk: "Low",
        riskClass: "risk-low",
        previewImage: "/images/scene-mistress.png",
        previewTeaser: "Kleine afwijkingen kunnen later doorslaggevend worden.",
        effect: "Betere context, langzamere progressie.",
        intentTags: ["observeer", "patronen", "analyse", "metadata"],
      },
      {
        id: "C",
        label: "Volg het digitale spoor",
        desc: "Je focust op logins, bestanden en financiële koppelingen.",
        pct: 30,
        risk: "Medium",
        riskClass: "risk-med",
        previewImage: "/images/scene-corporate.png",
        previewTeaser: "Technische gegevens zijn hard, maar vaak zonder direct motief.",
        effect: "Feitelijke clues, minder menselijk inzicht.",
        intentTags: ["digitaal", "logs", "geld", "spoor"],
      },
    ],
  },
  {
    id: "pressure_mid",
    title: "Je dossier groeit. Welke lijn vertrouw je nu?",
    subtitle: "Middelgrote keuze met direct effect op volgende scènes.",
    type: "simple",
    trigger: "checkpoint",
    chapterIndex: 2,
    checkpointTime: 3300,
    options: [
      {
        id: "A",
        label: "Bescherm je bron",
        desc: "Je kiest betrouwbaarheid boven snelheid.",
        pct: 40,
        risk: "Low",
        riskClass: "risk-low",
        previewImage: "/images/scene-witness.png",
        previewTeaser: "Je bron durft meer te delen, maar je wordt zichtbaarder.",
        effect: "Meer diepgang, hoger persoonlijk risico.",
        intentTags: ["bron", "bescherm", "veilig", "vertrouw"],
      },
      {
        id: "B",
        label: "Zet strategische druk",
        desc: "Je forceert snelle antwoorden met gerichte informatie.",
        pct: 33,
        risk: "High",
        riskClass: "risk-high",
        previewImage: "/images/scene-threat.png",
        previewTeaser: "Je krijgt sneller bekentenissen, maar vertrouwen daalt hard.",
        effect: "Snelle doorbraak, meer tegenreactie.",
        intentTags: ["druk", "strategie", "forceren", "hard"],
      },
      {
        id: "C",
        label: "Werk volledig zelfstandig",
        desc: "Je deelt je analyse met niemand tot je conclusie vaststaat.",
        pct: 27,
        risk: "Medium",
        riskClass: "risk-med",
        previewImage: "/images/scene-crime.png",
        previewTeaser: "Je voorkomt beïnvloeding, maar je mist tegenspraak.",
        effect: "Hoge controle, grotere kans op tunnelvisie.",
        intentTags: ["zelfstandig", "alleen", "controle", "geheim"],
      },
    ],
  },
  {
    id: "final_call",
    title: "Laatste interpretatie: wat is er echt gebeurd met Eva?",
    subtitle: "Belangrijke keuze die jouw slotconclusie bepaalt.",
    type: "major",
    trigger: "natural",
    chapterIndex: 3,
    checkpointTime: 4500,
    options: [
      {
        id: "A",
        label: "Concludeer: moord",
        desc: "Je ziet patronen van regie en actieve tegenwerking.",
        pct: 38,
        risk: "High",
        riskClass: "risk-high",
        previewImage: "/images/scene-confrontation.png",
        previewTeaser: "Iemand had motief, kans en controle over Eva's laatste uren.",
        effect: "Harde beschuldiging, maximale impact.",
        intentTags: ["moord", "dader", "opzet", "tegenwerking"],
      },
      {
        id: "B",
        label: "Concludeer: ongeluk",
        desc: "Je ziet vooral chaos, fouten en toeval rond de fatale avond.",
        pct: 33,
        risk: "Medium",
        riskClass: "risk-med",
        previewImage: "/images/scene-confrontation.png",
        previewTeaser: "Geen sluitend bewijs voor opzet, wel voor nalatigheid.",
        effect: "Officiële rust, blijvende twijfel.",
        intentTags: ["ongeluk", "toeval", "nalatigheid", "val"],
      },
      {
        id: "C",
        label: "Concludeer: zelfmoord",
        desc: "Je interpreteert Eva's verborgen notities als een bewuste eindzet.",
        pct: 29,
        risk: "Medium",
        riskClass: "risk-med",
        previewImage: "/images/scene-confrontation.png",
        previewTeaser: "Fragmenten wijzen op angst, regie en een geplande breuk.",
        effect: "Psychologische uitkomst, moreel zwaar einde.",
        intentTags: ["zelfmoord", "eindzet", "wanhoop", "regie"],
      },
    ],
  },
];

export const CHOICES_DATA = STORY_CHOICES;

export const ENDINGS: Record<string, EndingData> = {
  colleague_AAA: {
    title: "Schuld in de Schaduw",
    sub: "Jouw dossier wijst op moord.",
    desc: "Je publiceert een reconstructie waarin Eva's dood geen toeval kan zijn. De druk op Victor loopt op, Noor breekt publiekelijk, en Milan verdwijnt uit beeld. De waarheid komt naar buiten, maar tegen een hoge prijs.",
    pct: "14%",
  },
  politician_BBA: {
    title: "Val zonder Handen",
    sub: "Jouw analyse eindigt bij ongeluk.",
    desc: "Je conclusie volgt de officiële lijn: Eva viel door een samenloop van stress en omstandigheden. De zaak blijft gesloten, maar losse eindes blijven knagen. Je hebt rust gecreëerd, niet per se zekerheid.",
    pct: "17%",
  },
  expartner_CBC: {
    title: "De Laatste Keuze van Eva",
    sub: "Jouw interpretatie wijst op zelfmoord.",
    desc: "De tegenstrijdige notities, ontbrekende opnames en Eva's eigen codetaal vormen voor jou één lijn: ze koos haar einde om een groter netwerk te ontregelen. Je sluit af met begrip, maar zonder opluchting.",
    pct: "11%",
  },
  colleague_BCC: {
    title: "Gemanipuleerde Waarheid",
    sub: "Je ziet hoe verhalen machtiger zijn dan feiten.",
    desc: "Je ontdekt dat meerdere betrokkenen actief frames hebben gebouwd rond Eva's dood. De uitkomst blijft juridisch onduidelijk, maar je legt bloot hoe perceptie bewust is gestuurd.",
    pct: "13%",
  },
  MIXED: {
    title: "Gebroken evenwicht",
    sub: "Niemand wint volledig.",
    desc: "Je vindt sterke aanwijzingen, maar geen sluitende enkelvoudige waarheid. Eva's dood blijft een kruispunt van macht, angst en strategie. Jouw verhaal is coherent, maar nooit absoluut.",
    pct: "31%",
  },
  DEFAULT: {
    title: "Jouw unieke route",
    sub: "Een pad met eigen balans tussen waarheid en loyaliteit.",
    desc: "Je hebt bewijs gewogen, aannames getest en verbanden gelegd. De uitkomst die je kiest zegt niet alleen iets over Eva, maar ook over hoe jij waarheid definieert.",
    pct: "14%",
  },
};

function resolvePerspectiveScene(scene: PerspectiveScene, perspective: PerspectiveId): SceneSegment {
  if ("title" in scene && "narrative" in scene) {
    return scene;
  }
  return scene[perspective] || scene.colleague;
}

export function getEndingKey(choices: string[], perspective: PerspectiveId): string {
  const key = `${perspective}_${choices.join("")}`;
  if (ENDINGS[key]) return key;

  const counts: Record<string, number> = { A: 0, B: 0, C: 0 };
  choices.forEach((c) => {
    counts[c] = (counts[c] || 0) + 1;
  });

  if (counts.A >= 2 && perspective === "colleague") return "colleague_AAA";
  if (counts.B >= 2 && perspective === "politician") return "politician_BBA";
  if (counts.C >= 2 && perspective === "expartner") return "expartner_CBC";

  return "MIXED";
}

export function getChoiceByChapter(chapterIndex: number): ChoiceData | undefined {
  return STORY_CHOICES.find((choice) => choice.chapterIndex === chapterIndex);
}

export function formatTime(secs: number): string {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
}

export function getCurrentChapter(currentTime: number): ChapterData {
  let chapter = CHAPTERS[0];
  for (let i = CHAPTERS.length - 1; i >= 0; i--) {
    if (currentTime >= CHAPTERS[i].start) {
      chapter = CHAPTERS[i];
      break;
    }
  }
  return chapter;
}

export function getActiveScene(
  chapter: ChapterData,
  choices: string[],
  chapterIndex: number,
  perspective: PerspectiveId
): SceneSegment {
  if (chapterIndex > 0 && chapter.choiceScenes) {
    const prevChoice = choices[chapterIndex - 1];
    if (prevChoice && chapter.choiceScenes[prevChoice]) {
      return resolvePerspectiveScene(chapter.choiceScenes[prevChoice], perspective);
    }
  }
  return resolvePerspectiveScene(chapter.defaultScene, perspective);
}

export function getChapterIndex(currentTime: number): number {
  for (let i = CHAPTERS.length - 1; i >= 0; i--) {
    if (currentTime >= CHAPTERS[i].start) return i;
  }
  return 0;
}
