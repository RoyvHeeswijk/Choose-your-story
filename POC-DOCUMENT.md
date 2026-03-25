# POC Document - Interactieve Filmervaring Canal+

## 1. Inleiding

Deze Proof of Concept (POC) laat zien hoe een klassieke video-ervaring kan worden omgezet naar een interactieve filmervaring, waarbij de kijker actief invloed heeft op de verhaallijn van **De Perfecte Misdaad**.

Doel van deze POC:

- Aantonen dat interactieve storytelling technisch haalbaar is in een webomgeving.
- Onderzoeken welke keuze-interface het beste werkt voor immersie:
  - **Versie A**: click/touch keuzes
  - **Versie B**: spraakkeuzes via laptopmicrofoon
- Een architectuur neerzetten die later kan doorgroeien naar AI-gegenereerde video.

---

## 2. Probleemstelling

Traditionele VOD-content is passief: de gebruiker kijkt, maar beïnvloedt het verhaal niet. Voor een merk als Canal+ kan interactieve content:

- betrokkenheid verhogen;
- kijktijd verlengen;
- meerdere rewatch-momenten stimuleren (verschillende eindes).

De uitdaging is om interactie toe te voegen zonder het filmgevoel te verliezen.

---

## 3. Oplossing in deze POC

Deze POC bevat:

- een thrillerverhaal met meerdere keuzemomenten;
- twee interactiemodi (click en spraak);
- korte cinematografische video-loops per scene;
- een eindscherm op basis van gemaakte keuzes.

### Belangrijk kostenbesluit

Vanwege budgetbeperkingen worden video's **niet realtime door AI gegenereerd** in deze versie.
In plaats daarvan gebruikt de POC vooraf opgeslagen placeholder-video's en audiofiles.

De architectuur is wel voorbereid op toekomstige AI-generatie.

---

## 4. Wat de POC nu concreet doet

1. Gebruiker kiest op het startscherm:
   - Klikmodus (Bandersnatch-stijl)
   - Spraakmodus (microfoon)
2. Verhaal start in video-player met narrative subtitles.
3. Op keuze-momenten verschijnt een bottom overlay met 3 opties en 10s timer.
4. Gebruikerskeuze bepaalt verdere verhaallijn en eindresultaat.
5. Eindscherm toont uitkomst met video-achtergrond.

---

## 5. Technische architectuur

Stack:

- Next.js (App Router)
- React + TypeScript
- CSS in `globals.css`
- Web Speech API voor spraakversie

Belangrijkste onderdelen:

- `src/app/page.tsx`: centrale state en flow-orchestratie
- `src/components/VideoPlayer.tsx`: video + controls + subtitle-weergave
- `src/components/ChoiceOverlayClick.tsx`: click/touch keuze-UI
- `src/components/ChoiceOverlayVoice.tsx`: spraakkeuze-UI
- `src/hooks/useSpeechRecognition.ts`: herkenning van A/B/C of trefwoorden
- `src/components/AudioManager.tsx`: achtergrondmuziek + keuze-audio
- `src/data/gameData.ts`: chapters, choices, endings, video mapping

---

## 6. Interactieontwerp en onderbouwing

### 6.1 Waarom twee versies?

Doel van deze POC is niet alleen implementeren, maar ook vergelijken:

- **Click-versie** is robuust op elk device.
- **Spraak-versie** verhoogt gevoelsmatig agency/immersie, maar heeft compatibiliteitsrisico's.

### 6.2 Waarom bottom-bar keuzes?

Keuzes worden onderaan het scherm getoond als semi-transparante balk, omdat:

- de video zichtbaar blijft;
- de UI minder voelt als een game-menu;
- de ervaring dichter bij interactieve filmconventies blijft.

### 6.3 Waarom 10 seconden timer?

Een kortere timer verhoogt spanning en houdt flow in het verhaal.
In de POC is daarom gekozen voor 10 seconden i.p.v. 15.

### 6.4 Waarom 3 opties?

Drie opties geven variatie zonder keuze-overload.
Meer opties verhogen cognitieve belasting en vertragen besluitvorming.

### 6.5 Waarom preview-kaarten verwijderd?

Thumbnails, percentages en risk-labels werken game-achtig en verlagen filmimmersie.
In deze POC is het keuzescherm daarom vereenvoudigd naar tekstgedreven opties.

---

## 7. Video- en audio-aanpak (kostenbewust)

## 7.1 Huidige POC

Assets worden lokaal geladen:

- `public/videos/*.mp4` (placeholder scenes)
- `public/audio/*.mp3` (achtergrond en SFX)

### 7.2 Waarom placeholder-assets?

- Realtime AI-video is momenteel te duur voor het beschikbare budget.
- Placeholder-assets maken de UX, flow en techniek alsnog aantoonbaar.
- De POC demonstreert het concept zonder hoge operationele kosten.

### 7.3 AI-visie voor later

Toekomstig pad:

1. Prompt op basis van scene-tekst.
2. AI-video generatie per scene (bijv. Kling/Runway).
3. Opslaan/cachen van gegenereerde varianten.
4. Dynamisch afspelen op basis van keuzes.

---

## 8. Bekende beperkingen

- Web Speech API is browserafhankelijk (best in Chrome).
- Spraak kan falen door lawaai, accent of permissies.
- Placeholder-video's zijn niet verhaalspecifiek op shotniveau.
- Linting via `next lint` start interactieve setup in dit project; build-validatie is gebruikt als check.

---

## 9. Wat is bewezen met deze POC

Deze POC bewijst dat:

- interactieve verhaallogica stabiel werkt;
- twee keuze-inputmodi naast elkaar kunnen bestaan;
- een filmachtige UI mogelijk is zonder zware game-UI elementen;
- een kostenbewuste assetstrategie haalbaar is;
- de codebase voorbereid is op latere AI-videogeneratie.

---

## 10. Volgende stappen (aanbevolen)

1. Placeholder-assets vervangen met gekozen visuele stijl per scene.
2. Spraakherkenning uitbreiden met betere semantische matching.
3. Analytics toevoegen:
   - keuzeverdelingen;
   - drop-off per keuze;
   - vergelijking click vs. voice completion rate.
4. Pilot-test met kleine gebruikersgroep op desktop en mobiel.
5. Besluitvormingsdocument opstellen voor productievariant (batch-genereerde clips vs. near-realtime AI).

---

## 11. Geraadpleegde onderzoeksrichting

Voor ontwerpbeslissingen is gelet op:

- interactieve film UX-cases (o.a. Bandersnatch-analyses);
- timergedrag en keuze-urgentie in interactieve contexten;
- voice interaction patterns en fallback-principes;
- browserondersteuning van Web Speech API (MDN / Can I Use);
- immersion-effecten van interactiviteit in recente communicatie- en UX-literatuur.

Deze POC gebruikt die inzichten pragmatisch: eerst betrouwbaarheid en flow, daarna verdieping.
