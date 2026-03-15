---
name: Lightlab Studio — Core Stack & Design System
description: Stack, palette tokens, i18n constraints, always-dark design rules, and PremiumUI exports for Lightlab Studio
type: project
---

## Stack
- React 19 + TypeScript 5.9, Vite 7 + SWC
- Tailwind CSS 4 (utility-first, no MUI theme modifications)
- Material-UI 6 (theming only — do not alter MUI palette tokens)
- GSAP 3 + ScrollTrigger (scroll animations, hero entrance timelines, parallax)
- Lenis (smooth scroll — respect in GSAP ScrollTrigger offsets)
- React Router v6
- Playwright (E2E tests)

## Always-dark design system (enforced site-wide as of March 2026)

All pages are always dark. Never add `isDark` conditionals or light palette fallbacks.

- Body background: `bg-[#090909]`
- Strip / alternate section background: `bg-[#060606]`
- Accent: `#FF3B3B` (red only — never orange)
- Cards: `rounded-3xl border border-white/[0.07] bg-gradient-to-b from-white/[0.03] to-transparent`
- Card red top hairline: `absolute top-0 left-0 right-0 h-px` + `background: linear-gradient(to right, rgba(255,59,59,0.4), transparent)`
- Eyebrow pattern: `<span className="w-5 h-px bg-[#FF3B3B]/50" />` + `text-[9px] font-bold tracking-[0.52em] uppercase text-white/25`
- Standard container: `max-w-7xl mx-auto px-6 md:px-12 lg:px-20`
- Suppress unused themeMode prop: `void themeMode`

## Hero section pattern (used on About, Services, Method, Contact)
- Giant ghost letter parallax background: `font-display font-bold text-white/[0.018]` at `clamp(18rem,55vw,80rem)`, GSAP `yPercent: 18` scrub
- Red dot-grid texture overlay
- Red ambient radial glow centered
- Bottom vignette `h-48 bg-gradient-to-t from-[#090909]`
- GSAP 5-beat entrance: tag → rule → hero-line stagger → copy → badge/stats

## PremiumUI exports (src/components/PremiumUI.tsx)
- `MagneticButton` — magnetic hover button, accepts `href`, `type`, `isDark`, `variant`, `style`, `className`
- `TextReveal` — scroll-triggered wrapper reveal
- `SplitText` — animated word/char split headline
- `CinematicImage` — lazy image with cinematic reveal (NOT used in redesigned pages)
- `NoiseTexture` — noise overlay (NOT used in redesigned pages)
- `AmbientGlow` — ambient glow (NOT used in redesigned pages — replaced by inline radial-gradient divs)
- `ANIMATION` — easing constants: `ANIMATION.ease.luxury`, `ANIMATION.ease.smooth`, `ANIMATION.ease.bounce`

## LazySection pattern
IntersectionObserver fade-in component used in all post-hero sections. Threshold: 0.04, rootMargin: '0px 0px -32px 0px', fires once.

## i18n
- Languages: English (en), French (fr), Arabic (ar / RTL)
- Key copy namespaces: `copy.contact.*`, `copy.about.*`, `copy.footer.*`, `copy.ui.*`, `copy.nav.*`
- RTL: detect with `language === 'ar'`, apply `text-right` and `flex-row-reverse` where needed

**Why:** The design system was locked to always-dark in March 2026 to unify the brand. Light palette variants were removed across all pages.

**How to apply:** Never write `isDark` conditionals. Never reference LT (light) palette tokens. Always use `void themeMode` at the top of page components.
