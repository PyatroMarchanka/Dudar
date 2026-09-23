# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Dudar (deployed as dudahero.org) is a web app for learning to play bagpipes (Belarusian duda, Polish duda, Dudelsack, Highlander, etc.). It plays MIDI tunes with sampled bagpipe sounds and animates the fingering on a bagpipe image in sync with playback. Create React App + TypeScript, React 17, react-router v5, styled-components + Material-UI v4, i18next (en / be / pl).

## Commands

The project uses npm (`package-lock.json`, `packageManager: npm`), even though the README says `yarn`.

- `npm start`: dev server on http://localhost:3000
- `npm run build`: production build into `build/`
- `npm test`: Jest via react-scripts (watch mode). Run one file with `npm test -- src/path/to/file.test.ts`. There are currently no test files.
- `npx tsc --noEmit`: type-check. There is no separate lint script; ESLint (`react-app` config) runs inside start and build.
- `npm run update-sitemap`: regenerates `public/sitemap.xml` from the backend's songs and articles
- `npm run songlist` points at a `load.ts` that no longer exists.

Prettier config (`.prettierrc.js`): 120 columns, single quotes, trailing commas `es5`. Older files still use double quotes.

Environment (`.env`): `REACT_APP_BACKEND_URL` (the REST backend, a separate repo) and `REACT_APP_GOOGLE_CLIENT_ID` (Google OAuth).

## Architecture

### Global state
One React Context (`src/context/index.tsx`, exported as `store`) combines two `useReducer` slices:
- `reducers/player.tsx`: song and playback state (`midi` ArrayBuffer, `midiData` as a `@tonejs/midi` `Midi`, `activeSong`, `progress`, `isPlaying`, `listsByBagpipe`, loading and unavailable flags).
- `reducers/settings.ts`: user settings (`bagpipeType`, `tempo`, `transpose`, `metronome`, `loop`, `holesMode`, `language`, `userData`, `isMusicSheets`, ...).

Components read state with `const { state: {...}, setX } = useContext(store)`. To add state, add an action type to the reducer, add a dispatcher in that reducer's hook, and declare it in both the `Context` interface and the default `createContext` object in `context/index.tsx`.

### Song loading pipeline
- The catalog (metadata) comes from the backend: `songApi.getSongList()` returns `GET /v1/songs`. `useSongList` groups the songs by bagpipe and then by song type into `listsByBagpipe`.
- The MIDI files themselves are served locally from `public/midi/<genre>/...` (`songApi.getSong` resolves `song.pathName` against `/midi`). Metronome click tracks are in `public/midi/common/metronome-X-Y.mid`.
- `useLoadSong` (route `/app/play/:id`) fetches the MIDI and runs `prepareSongMidi` (`src/utils/midiUtils/prepareSongMidi.ts`), which merges in the metronome (`addMetronome`), sets the tempo, normalises octaves (`fixMidiDataOctaves`), and then stores `midi` and `midiData` in context.
- `useAbcSong` (route `/app/abc?abc=<ABC text>`) converts ABC notation into a synthetic `Song` plus a MIDI buffer with `abcToMidi` (abcjs) and feeds it through the same `prepareSongMidi` path. It never touches the catalog, so it can be embedded in an iframe. It enforces input size and note-count caps.
- **Tempo convention:** `prepareSongMidi` applies `originalTempo / 2`, so `Song.originalTempo` stores double the real BPM. `abcToMidi` doubles the BPM to match.
- Metronome files exist only for the time signatures listed in `abcToMidi.ts`. Other meters fall back to 4/4.

### Playback
`src/utils/MidiPlayer.ts` wraps `midi-player-js` for event timing and plays notes through Tone.js samplers (`src/utils/midiUtils/sampler.ts`, one `Tone.Sampler` per bagpipe type, with samples in `public/samples/`). It handles transpose, loop (in bars), the drone, the metronome and silent mode. `useMidiPlayer` creates the instance and exposes it to the `Dudar` screen, which passes `player` down to the controls and canvases.

### Rendering (the `/app` screen, `components/screens/Dudar.tsx`)
There are two view modes:
- **Bagpipe view**: three stacked canvases. `BackCanvas` is the bagpipe image. `DynamicCanvas` is the scrolling note "piano roll", driven by `useDrawDynamic`, `useNotesMoving` and the player's `handleNotesMoving` tick callback. `StaticCanvas` shows the active holes and fingers for the current note. The drawing functions are in `src/utils/drawUtils/`.
- **Sheet music**: `components/MusicSheets` (VexFlow), toggled by `isMusicSheets`.

### Bagpipe data
`src/dataset/bagpipes.ts` assembles a `BagpipeConfig` for each `BagpipeTypes` value from parallel per-type maps in `src/dataset/` (notes map, hole positions, image properties, images, note-to-line mapping, finger maps). Adding a bagpipe means adding an entry to every one of those maps, plus a sampler in `sampler.ts` and translation keys.

### Backend and auth
- API clients are in `src/api/`. Every URL is built in `src/api/links.ts` from `REACT_APP_BACKEND_URL` (`/v1/...`).
- Auth is Google OAuth. The JWT and user ID are stored in cookies (`jwtToken`, `userId`), and `withAuth()` in `src/api/utils.ts` builds the auth headers.
- Beyond songs, the backend serves user profile and settings, playlists, articles and categories (the blog and "Learning Book"), and admin song editing.

### Other
- Routes are in `src/router/` (`routes.ts` holds the paths). Nested `/app` routes are defined in `Dudar.tsx`.
- Translations: `src/locales/{en,be,pl}/translation.json`, set up in `src/i18n.ts`. Belarusian song names are transliterated for other languages (`src/locales/index.ts`).
- A PWA service worker is registered in `src/index.tsx`.
