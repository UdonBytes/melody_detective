# Melody Detective

A mobile-first piano playback game for beginners. Five evenly spaced pitches are played; students reproduce the full melody with the on-screen piano.

## Run

```bash
npm install
npm run dev
```

Use `npm run build` for Netlify. The included configuration publishes `dist`.

## Structure

- `src/main.jsx` — exercise UI, scoring, and settings
- `src/music.js` — melody generation and sample playback
- `src/styles.css` — responsive styling and touch keyboard
- `public/audio` — compact WAV piano samples

Progress and preferences are saved with `localStorage`. V1 intentionally uses C4–G4; future note ranges are already defined in `src/music.js`.
