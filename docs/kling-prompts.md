# Kling AI prompts per scene

Gebruik dit document om consistente video-shots te genereren voor je interactieve verhaal.

## 1) Globale stijl (gebruik bij elke prompt)

Gebruik deze stijltekst als prefix:

`cinematic neo-noir drama set in Amsterdam at night, premium streaming look, realistic lighting, subtle film grain, high contrast but natural skin tones, moody rain reflections, 35mm lens feel, shallow depth of field, slow controlled camera movement, no text, no logos, no subtitles, no watermark, no jump cuts`

Aanbevolen Kling instellingen:
- Aspect ratio: `16:9`
- Duration: `8s` tot `12s`
- Motion: `low` tot `medium`
- Camera: `slow push-in` of `slow lateral drift`
- Consistency seed: per personage dezelfde seed behouden

## 2) Bestandsnamen die de app direct pakt

Plaats output in:
- `public/videos/scene-intro.mp4`
- `public/videos/scene-mansion.mp4`
- `public/videos/scene-mistress.mp4`
- `public/videos/scene-crime.mp4`
- `public/videos/scene-corporate.mp4`
- `public/videos/scene-witness.mp4`
- `public/videos/scene-threat.mp4`
- `public/videos/scene-confrontation.mp4`

De player gebruikt automatisch `/videos/<scene>.mp4` en valt terug op de bestaande afbeelding als video ontbreekt.

## 3) Prompt per scene

## `scene-intro.mp4`
`night interior detective office in Amsterdam, rain on large window, desk lamp casting warm pool of light, old case files, red wax envelope opened, smartphone with unheard voice message blinking, emotional tension, empty room but human presence implied, slow dolly in toward desk`

## `scene-mansion.mp4`
`luxury Dutch villa interior at dusk, polished dark wood, expensive but cold atmosphere, half-open closet with leather gloves box, male figure silhouette near doorway, emotional distance and suspicion, subtle handheld drift, dramatic practical lighting`

## `scene-mistress.mp4`
`Amsterdam canal street in rain, elegant woman in dark red coat walking fast under neon reflections, private club entrance in background, noir romance tension, shallow depth of field, soft anamorphic bokeh, side-tracking camera`

## `scene-crime.mp4`
`modern penthouse kitchen crime scene at night, two whiskey glasses on marble counter, faint police tape reflection in glass wall, forensic mood without explicit gore, city skyline outside, slow push-in with suspense atmosphere`

## `scene-corporate.mp4`
`high-rise corporate office at night, glass walls, financial documents and laptop with transaction charts on desk, empty floor with motion sensor light flicker, power and conspiracy mood, controlled cinematic pan`

## `scene-witness.mp4`
`narrow alley near Amsterdam central station, wet cobblestones, single overhead lamp, nervous witness silhouette waiting in shadows, breath visible in cold air, intense but quiet standoff, slow zoom`

## `scene-threat.mp4`
`inside parked car at 2 AM during rain, smartphone lights up with anonymous threat message glow on face, windshield raindrops and city lights bokeh, paranoia and urgency, subtle camera shake then steady lock`

## `scene-confrontation.mp4`
`abandoned warehouse interior, single swinging bulb over table with photos and documents, two human silhouettes facing each other in distance, final reveal tension, dramatic long shadows, slow circular camera move`

## 4) Variatie per perspectief (optioneel)

Als je meerdere versies per scene wilt maken:
- detective variant: meer observatie en evidence closeups
- spouse variant: meer emotionele stress en defensieve lichaamstaal
- lover variant: meer onzekerheid, geheimhouding en isolation framing

Voorbeeld suffix:
`same scene, but from spouse perspective: defensive posture, trapped feeling, social pressure, guilt ambiguity`

## 5) Negatieve prompt (overal toevoegen)

`cartoon, anime, CGI look, low detail faces, distorted hands, flickering artifacts, text overlays, subtitles, logos, watermark, overexposed highlights, fast chaotic camera shake`

## 6) Workflow die je nu kunt volgen

1. Genereer eerst alle 8 basisvideo's hierboven.
2. Zet ze in `public/videos/` met exact dezelfde bestandsnamen.
3. Start app en check flow.
4. Als een shot niet past: alleen die scene opnieuw genereren met zelfde stijlprefix + aangepaste scene prompt.
5. Daarna pas perspectiefvarianten genereren als extra polish.
