---
name: Lightlab Studio tech stack and design tokens
description: Core stack, palette, and design constraints for the Lightlab Studio project
type: project
---

Lightlab Studio is a multilingual marketing/portfolio site for a digital agency.

**Stack**: React 19 + TypeScript 5.9, Vite 7 + SWC, Tailwind CSS 4, MUI 6 (theming only), React Router v6, GSAP 3 + ScrollTrigger, Lenis smooth scroll, Playwright E2E.

**Palette (must never change)**:
- `#eeeae0` — light bg
- `#080807` — dark bg
- `#18160f` — primary text
- `#56514a` — stone/secondary text
- `#8c8780` — muted text
- `#d9d5ca` — border

**Why:** Brand identity is locked. Palette tokens are the design system foundation.
**How to apply:** Every UI improvement must work within these exact hex values. Never introduce new color tokens.

**i18n**: English, French, Arabic (RTL). Language stored in localStorage, RTL classes re-applied on switch. All strings come from `copy.*` keys via `useLanguage()` — never hardcode strings.

**PremiumUI exports**: `ANIMATION`, `MagneticButton`, `TextReveal`, `SplitText`, `CinematicImage`, `CinematicVideo`, `NoiseTexture`, `AmbientGlow`, `useCursor`, `CursorType`.

**Always-dark pages**: Method.tsx, Services.tsx, and About.tsx are all always-dark. The `themeMode` prop is received but immediately voided (`void themeMode`). No `isDark` conditionals — all colors are hardcoded dark tokens. `CinematicImage`, `NoiseTexture`, `AmbientGlow` must NOT be imported in these pages.

**Page pattern (Method/Services/About)**: LazySection IntersectionObserver wrapper, hero with giant bg letter parallax (GSAP `yPercent:18` scrub), red ambient glow + dot grid + bottom vignette, GSAP timeline on hero entrance classes, `useMemo` for `isArabic`, `memo` on sub-components, all i18n arrays typed as `readonly`.

**About.tsx i18n keys updated (March 2026)**: `overview.heroEyebrow`, `heroTitleLine1/2`, `manifestoLead`, `manifestoCopy`, `ctaEyebrow/Title/TitleEmphasis/Copy/MetaValue/Button`, `principlesTitle`, `principles[0-2]`.
