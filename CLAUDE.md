# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start Vite dev server with HMR
npm run build     # TypeScript check (tsc -b) + Vite production build
npm run lint      # ESLint
npm run preview   # Preview production build locally
npx playwright test  # Run E2E tests
```

## Architecture

**Lightlab Studio** — multilingual marketing/portfolio website for a digital agency.

**Stack**: React 19 + TypeScript 5.9, Vite 7 + SWC, Tailwind CSS 4, Material-UI 6 (theming only), React Router v6, GSAP 3 + ScrollTrigger, Lenis (smooth scroll), Playwright (E2E).

### Key patterns

**Routing & Layout** — All routes share a single `Layout` component (`src/components/Layout.tsx`) that manages the navbar, footer, Lenis smooth scroll, GSAP reveal animations, theme toggle, language selector, and the intro logo animation. Pages live in `src/pages/`.

**Theme** — Light/dark mode via MUI `ThemeProvider` + a `data-theme` attribute on `<html>`. Persisted to `localStorage`. Toggle lives in `Layout`.

**i18n** — Context-based localization in `src/i18n.tsx` supporting English, French, and Arabic (with RTL layout). Language is stored in `localStorage` and switching re-applies RTL classes.

**Animations** — GSAP ScrollTrigger drives scroll-reveal; Lenis provides smooth scrolling. Both are initialized and cleaned up inside `Layout`'s `useEffect`.

**Styling** — Tailwind CSS 4 for utilities, MUI only for its theming/color-system primitives, Emotion for MUI's CSS-in-JS internals. Custom global resets and font imports are in `src/index.css`.
