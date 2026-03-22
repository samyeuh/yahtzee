# CLAUDE.md — Yahtzee Project

## Project overview

Web adaptation of Yahtzee with online leaderboard. Deployed at [yhtz.fr](https://yhtz.fr).

## Stack

- **Frontend**: React + TypeScript + Vite, Chakra UI (Navbar only), CSS modules
- **Backend**: Python Flask + Supabase (PostgreSQL)
- **Deploy**: Render (backend), Vercel (frontend), Docker available
- **Infra**: Terraform, nginx, GitHub Actions CI/CD

## Repo structure

```
/src
  /assets          → icons, funnyNames.json, changelog.json
  /class           → Combi.ts type definitions
  /components      → Navbar, Tableau, RollingDices, EndRolling, Combinations, CombiTooltip
  /context         → YahtzeeContext (game state + settings)
  /hooks           → useSettings.ts
  /i18n            → en.json, fr.json, useTranslation.ts
  /logic           → yahtzee.ts (game logic class), scoreCalculator.ts, exampleGenerator.ts
  /modals          → Rules, ScoreSaving, ScoreDetails, SettingsModal
  /page            → Login, Gameplay, Scores, LoadingPage
  /api             → YahtzeeAPI.ts (axios calls)
/back
  api.py           → Flask routes
  scoreManager.py  → Supabase queries
  requirements.txt
```

## Key conventions

### TypeScript / React

- Functional components only, hooks everywhere
- Context: `YahtzeeContext` holds game state + settings. `useYahtzeeContext()` to consume.
- Settings persisted in `localStorage` via `useSettings` hook (key: `yhtz_settings`)
- i18n: `useTranslation()` hook reads language from localStorage directly (no circular dep with context)
- CSS: one `.css` file per component, no CSS-in-JS except inline styles for dynamic values
- Font: **Nunito** in game components (Tableau etc.), **Press Start 2P** for pixel art elements (scores page, modals)
- Background color driven by CSS variable `--bg`, set via `document.documentElement.style.setProperty`

### Game logic

- `Yahtzee` class in `logic/yahtzee.ts` holds all game state (dice, score, combinations, sounds)
- Combination names are in English and used as identifiers — **do not translate them** (scoreCalculator compares `combi.nom` as strings)
- Scores: `score === -1` means not yet played, `score === 0` means played but scored 0
- Bonuses: upper section +35 if sum ≥ 63, yahtzee bonus +100 per extra yahtzee (from 2nd onwards)

### Backend (Python)

- Always use venv with **Python 3.12** (not 3.14 — pydantic-core build issues)
- Run: `venv\Scripts\activate` then `python back/api.py`
- `.env` is at project root, loaded with `load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))`
- `addScore` returns the inserted row ID (used for post-save personalization)
- `updateScore` updates name + icon by ID

### API routes

|Method|Route        |Description                                 |
|------|-------------|--------------------------------------------|
|GET   |/testServer  |Health check                                |
|GET   |/testSupabase|Supabase connection check                   |
|GET   |/getScores   |Returns daily/weekly/monthly/lifetime scores|
|POST  |/addScore    |Insert score, returns `{ id }`              |
|PUT   |/updateScore |Update name + icon by id                    |

### Scoring display

- Leaderboard shows **weekly** scores only + all-time #1 in a banner
- Limited to top 15
- Auto-save on game end with a funny name (from `funnyNames.json`), then player can personalize

## Environment variables (.env at root)

```
SUPABASE_URL=
SUPABASE_KEY=
VITE_BACKURL_LOCAL=
VITE_BACKURL_RENDER=
VITE_BACKURL_PROD=
VITE_FRONTURL_LOCAL=
VITE_FRONTURL_RENDER=
VITE_FRONTURL_PROD=
```

## Things to watch out for

- React StrictMode causes double `useEffect` — use `useRef` guard for one-shot effects (e.g. auto-save)
- `setScore` takes a direct value, not an updater function
- Combination names are used as IDs throughout — never rename them
- Python 3.14 breaks pydantic-core build — always use 3.12
- `venv/` must be in `.gitignore` and never pushed