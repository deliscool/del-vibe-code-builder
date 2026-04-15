# Del Vibe Code Builder

deployed on https://main.d2rvryqqmh4ev8.amplifyapp.com/

A guided, browser-based product planning tool that walks builders through every phase of defining a product — from brief to roadmap — and exports a full Product Requirements Document (PRD) as markdown.

---

## What It Is

**Del Vibe Code Builder** is a step-by-step product discovery tool designed to help founders, PMs, and developers structure their product thinking before writing a single line of code. It guides users through 7 sequential phases:

| Phase | Name | What It Captures |
|-------|------|-----------------|
| 0 | Tutorial | Onboarding walkthrough (9 slides) |
| 1 | Product Brief | Summary, target customer, problems, requirements, UX, data model, tech stack |
| 2 | Market Research | User name, daily workflow, what they hear/see, frustrations, goals, current tools, success definition |
| 3 | Persona | Auto-generated user persona with display name, role, goal, and detail bullets |
| 4 | Empathy Map | 6-quadrant map: Think & Feel, Hear, See, Say & Do, Pains, Gains |
| 5 | Customer Journey Map | 5 lanes × 4 phases grid (Awareness → Consideration → Decision → Onboarding) |
| 6 | Product Roadmap | MoSCoW-prioritized user stories (Must Have / Should Have / Could Have) + Epics |
| 7 | Summary & Export | Completion review + full PRD export as `.md` or clipboard copy |

At the end, the user copies or downloads a structured `product-requirements.md` file and pastes it directly into Claude (or any AI) to start building their prototype.

---

## How It Is Built

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build Tool | Vite 5 (with SWC) |
| Styling | Tailwind CSS v3 + tailwindcss-animate |
| UI Components | shadcn/ui (Radix UI primitives) |
| Routing | React Router DOM v6 |
| State / Persistence | `useLocalStorage` custom hook (browser `localStorage`) |
| Forms | React Hook Form v7 + Zod validation |
| Drag and Drop | @dnd-kit/core + @dnd-kit/sortable (Roadmap phase) |
| Data Fetching | TanStack React Query v5 (QueryClient wired, ready for API layer) |
| Charts / Viz | Recharts v2 |
| Icons | Lucide React |
| Notifications | Sonner + shadcn/ui Toaster |
| Testing | Vitest + @testing-library/react |
| Linting | ESLint 9 + typescript-eslint |

### Project Structure

```
src/
├── App.tsx                    # Root: QueryClient, Router, Toasters
├── pages/
│   ├── Index.tsx              # Main app shell — phase state + localStorage orchestration
│   └── NotFound.tsx           # 404 fallback
├── components/
│   ├── LandingHero.tsx        # Entry screen (shown before user starts)
│   ├── PhaseNav.tsx           # Top navigation bar with phase progress indicators
│   ├── PhaseWrapper.tsx       # Layout wrapper for each phase (title + subtitle)
│   ├── PhaseFooter.tsx        # Next/Back footer controls
│   ├── NavLink.tsx            # Reusable nav link
│   ├── AutoSaveField.tsx      # Debounced auto-save input field
│   ├── ExportBlock.tsx        # PRD export UI (copy to clipboard + download .md)
│   └── phases/
│       ├── TutorialPhase.tsx  # 9-slide onboarding
│       ├── BriefPhase.tsx     # Phase 1 — Product Brief form
│       ├── ResearchPhase.tsx  # Phase 2 — Market Research form
│       ├── PersonaPhase.tsx   # Phase 3 — Persona generator
│       ├── EmpathyMapPhase.tsx# Phase 4 — Empathy Map editor
│       ├── JourneyMapPhase.tsx# Phase 5 — Journey Map grid
│       ├── RoadmapPhase.tsx   # Phase 6 — Roadmap + drag-and-drop user stories
│       └── SummaryPhase.tsx   # Phase 7 — Section review + export trigger
├── hooks/
│   ├── useLocalStorage.ts     # Generic typed localStorage hook
│   ├── use-mobile.tsx         # Mobile breakpoint detection
│   └── use-toast.ts           # Toast notifications
└── lib/
    └── utils.ts               # cn() utility (clsx + tailwind-merge)
```

### State Management

All application state is persisted to `localStorage` via the `useLocalStorage` custom hook. There is no backend or database at this time. State keys:

| Key | Type | Contents |
|-----|------|----------|
| `vc-started` | `boolean` | Whether user has passed the landing screen |
| `vc-currentPhase` | `number` | Active phase index (0–7) |
| `vc-tutorialSlide` | `number` | Current tutorial slide (0–9) |
| `vc-brief` | `BriefData` | Product brief form fields |
| `vc-research` | `ResearchData` | Market research answers |
| `vc-persona` | `PersonaData \| null` | Generated persona object |
| `vc-empathyMap` | `EmpathyMapData \| null` | Empathy map quadrant values |
| `vc-journeyMap` | `JourneyMapData \| null` | Journey map cell grid |
| `vc-roadmap` | `RoadmapData \| null` | User stories (must/should/could) + epics |

### Export

The `ExportBlock` component compiles all phase data into a single structured markdown document with these sections:

```
# PRODUCT BRIEF
# PERSONA
# EMPATHY MAP
# CUSTOMER JOURNEY MAP
# PRODUCT ROADMAP (USER STORIES)
```

Users can:
- **Preview** — expand the markdown inline
- **Download** — saves `product-requirements.md` to their machine
- **Copy All** — copies to clipboard for pasting into Claude or any AI tool

---

## Running Locally

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Run tests
npm test
```

Requires Node.js 18+. No environment variables needed — the app runs fully client-side.

---

## Is It Database Ready?

**Not yet — but it is database-ready by design.**

### Current State
All data is stored in the user's browser `localStorage`. There is no user authentication, no backend API, and no database connection. Data does not persist across devices or browsers.

### What Makes It DB-Migration Ready

1. **Typed data models exist** — every phase has a well-defined TypeScript interface (`BriefData`, `ResearchData`, `PersonaData`, `RoadmapData`, `JourneyMapData`, `EmpathyMapData`). These map directly to database table schemas with no structural changes needed.

2. **TanStack React Query is already installed and wired** — `QueryClient` is set up in `App.tsx`. Swapping `useLocalStorage` calls for `useQuery` / `useMutation` hooks requires minimal refactoring.

3. **Storage is centralized** — all `localStorage` reads/writes go through the single `useLocalStorage` hook. Replacing that hook with an API-backed version upgrades all phases simultaneously.

### Recommended Path to Add a Database

| Step | Action |
|------|--------|
| 1 | Add **Supabase** (or Firebase / PlanetScale) as backend |
| 2 | Create a `sessions` table keyed by `user_id` + `session_id` |
| 3 | Create child tables: `brief`, `research`, `persona`, `empathy_map`, `journey_map`, `roadmap` — one row per session |
| 4 | Add **Supabase Auth** (email magic link or OAuth) |
| 5 | Replace `useLocalStorage` hook with React Query `useQuery` / `useMutation` calls to your Supabase client |
| 6 | Add `useEffect` sync on mount to hydrate from DB on login |

### Export Database Readiness

The export output is already structured markdown. To make exports persistable:
- Save the generated markdown string to a `exports` table on download
- Add a shareable link feature (slug-based URL → fetch export by ID)

---

## Deployment

Built to deploy on any static host (AWS Amplify, Vercel, Netlify, GitHub Pages):

```bash
npm run build
# Output: dist/
```

No server-side rendering. All routes are client-side — configure your host to redirect `/*` to `index.html`.

---

## Built With

- [Vite](https://vitejs.dev/) — build tool
- [React](https://react.dev/) — UI framework
- [shadcn/ui](https://ui.shadcn.com/) — component library
- [Tailwind CSS](https://tailwindcss.com/) — utility-first styling
- [Lovable](https://lovable.dev/) — AI-assisted scaffolding
