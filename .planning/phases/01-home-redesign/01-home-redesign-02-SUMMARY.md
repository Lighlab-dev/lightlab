---
phase: 01-home-redesign
plan: 02
subsystem: pages/home
tags: [hero, projects, gsap, video, rtl, i18n]
dependency_graph:
  requires: []
  provides: [home-hero-section, home-projects-section, home-placeholder-sections]
  affects: [src/pages/Home.tsx, src/components/Layout.tsx]
tech_stack:
  added: []
  patterns: [gsap-context-scoping, lazy-section-reveal, cursor-provider-pattern, hover-to-play-video]
key_files:
  created: []
  modified:
    - src/pages/Home.tsx
    - src/components/Layout.tsx
decisions:
  - CursorProvider already exists in App.tsx — no double-wrap in Home.tsx
  - ProjectCard uses native video element (not CinematicVideo) for hover-controlled play/pause
  - Layout.tsx unused mobileNavClass removed to resolve pre-existing TS error blocking build
metrics:
  duration: ~20 minutes
  completed: 2026-03-14
  tasks_completed: 2
  files_modified: 2
---

# Phase 01 Plan 02: Home.tsx Hero + Projects Sections Summary

**One-liner:** Rewrote Home.tsx with cinematic Hero (video loop, blend-mode h1, GSAP parallax) and Projects section (3 hover-to-play full-width video cards with asymmetric layout), plus empty placeholders for plan 04.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Abort git revert and confirm clean baseline | (no-op) | No revert was in progress |
| 2 | Rewrite Home.tsx — Hero + Projects sections | 72db99f | src/pages/Home.tsx, src/components/Layout.tsx |

## What Was Built

### Hero Section
- Full-screen `CinematicVideo` background with `scale-110` to prevent parallax edges
- Two scrim layers: `bg-black/40 mix-blend-multiply` + `bg-gradient-to-t from-black/80`
- Studio badge (top-right, flips left for Arabic) using `heroMeta` key
- `heroTag` label (top-left) in fine mono uppercase
- `<h1>` with `mix-blend-difference text-white font-display` at `clamp(4.5rem,11vw,11rem)`
  - Two `.hero-line` spans with overflow-hidden clip for entrance animation
  - Second line: `italic text-white/70` for `heroTitle2`
- `heroCopy` sub-copy, CTA `MagneticButton` with `ctaButton` key, scroll indicator with pulse animation
- GSAP entrance timeline: `.hero-line` stagger, `.hero-body`, `.hero-meta`, `.hero-cta`, `.hero-video-wrap` fade
- Parallax: `.hero-video-wrap` `yPercent:15`, `.hero-content-inner` `yPercent:-10` (scrub)
- Reduced motion guard on all GSAP animations

### Projects Section
- `LazySection` wrapper for IntersectionObserver reveal
- Section eyebrow with `viewProjectLabel` i18n key + `SplitText` headline
- New memoized `ProjectCard` component:
  - Props: `project`, `index`, `isArabic`, `isDark`, `align: 'left'|'right'|'center'`
  - Poster `<img>` as background, `<video>` overlay plays on hover
  - `onMouseEnter` → `video.play()` + `setType('play')` + GSAP title `yPercent:-5`
  - `onMouseLeave` → `video.pause()` + `setType('default')` + GSAP title `yPercent:0`
  - Asymmetric overlay alignment (RTL-aware: left↔right flips for Arabic)
  - Ghost typography accent: `aria-hidden` span with `text-[22vw] opacity-[0.04] mix-blend-overlay`
  - Category label in `font-mono small-caps text-white/50`
  - Project title in `font-display text-[6vw] text-white`
- 3 cards with `align` values: `'left'`, `'right'`, `'center'`
- Editorial stacked layout with `mb-4 md:mb-6` gap

### Placeholder Sections
- `<section id="services">`, `<section id="about">`, `<section id="contact">` with `{/* TODO: plan 04 */}` comments

### i18n Keys Consumed
- `copy.home.heroTag` — tag label top-left
- `copy.home.heroTitle1` — "Revenue"
- `copy.home.heroTitle2` — "Scaling."
- `copy.home.heroMeta` — "Lightlab Studio ©2026"
- `copy.home.heroCopy` — hero sub-paragraph
- `copy.home.scrollLabel` — "Scroll"
- `copy.home.ctaButton` — "Book a Diagnostic"
- `copy.home.viewProjectLabel` — "View Project"

### RTL Support
- Studio badge flips: `isArabic ? 'left-8 md:left-14' : 'right-8 md:right-14'`
- heroTag label flips to right for Arabic
- ProjectCard overlay alignment inverts: `align='left'` becomes `'right'` for Arabic
- All flex rows use `isArabic ? 'flex-row-reverse' : 'flex-row'`

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Removed unused `mobileNavClass` in Layout.tsx**
- **Found during:** Task 2 — first build attempt
- **Issue:** Pre-existing TS6133 error `'mobileNavClass' is declared but its value is never read` in `src/components/Layout.tsx:45` prevented `npm run build` from exiting 0
- **Fix:** Removed the unused `mobileNavClass` function (mobile nav already used inline arrow functions in JSX)
- **Files modified:** src/components/Layout.tsx
- **Commit:** 72db99f

**2. [Rule 1 - Bug] Removed unused `CinematicImage` import from Home.tsx**
- **Found during:** Task 2 — first build attempt
- **Issue:** TS6133 error — `CinematicImage` was imported but not used in new Home.tsx (projects use native `<video>` + `<img>` for hover control, not CinematicVideo)
- **Fix:** Removed `CinematicImage` from the named import block
- **Files modified:** src/pages/Home.tsx
- **Commit:** 72db99f (same commit, fixed before committing)

## Decisions Made

1. **CursorProvider not added to Home.tsx** — `App.tsx` already wraps all routes in `<CursorProvider>`, so adding it in Home.tsx would double-wrap and break context isolation. The plan explicitly says "Check App.tsx — if CursorProvider is already there, do NOT double-wrap."

2. **ProjectCard uses native `<video>` + `<img>` instead of `CinematicVideo`** — `CinematicVideo` uses IntersectionObserver for auto-play control, which conflicts with the hover-based play/pause required by ProjectCard. Native video element gives direct imperative control via `videoRef.current?.play()` / `.pause()`.

3. **MEDIA constant instead of IMAGES** — Plan specifies `const MEDIA = { ... }` replacing the old `const IMAGES = { ... }`. New structure has `heroVideo`, `heroPoster`, `projects[]`, `services[]` arrays.

## Self-Check

Checking created/modified files and commits:

## Self-Check: PASSED
- `src/pages/Home.tsx` — FOUND
- `src/components/Layout.tsx` — FOUND
- Commit 72db99f — FOUND (verified via git log)
- `npm run build` exits 0 — VERIFIED
