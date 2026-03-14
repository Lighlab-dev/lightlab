# Phase 1: Home Page Redesign - Context

**Gathered:** 2026-03-14 (updated)
**Status:** Ready for planning

<domain>
## Phase Boundary

Transform `src/pages/Home.tsx` into a luxury, media-rich, animated experience. Full replacement of the current Home page is allowed. Scope: visual design, content sections, animations, and performance. Other pages, routing, and shared Layout are out of scope.

</domain>

<decisions>
## Implementation Decisions

### Section structure & order
- Hero → Projects → Services → About/Stats → Contact CTA
- Lead with impact, prove authority immediately with work, pitch services, add trust signals, close with CTA

### Hero section
- Full-screen cinematic video loop as background (100vh)
- Headlines rendered with `mix-blend-difference` or `mix-blend-exclusion` over the video
- "Visionary & Minimalist" copy — punchy, evocative, result-focused (no jargon)
- Hero reveal sequence: deliberate GSAP timeline, ~1.2s total settle
- `heroTitle1`, `heroTitle2`, `heroTag`, `heroMeta` copy keys must all appear

### Projects section
- 3–4 featured project cards, full-width
- Each card plays a short video loop on hover (hover-to-play video preview)
- Asymmetric layout — alternate card compositions (full-left image, full-right image, centered)
- Section height: 60–80vh per card or section total

### Services section
- Visual Dynamic List — background media swaps as user hovers/scrolls over each service track
- Replaces any accordion-style component
- Section height: 60–80vh

### About/Stats section
- Animated counters (clients, projects, years) that count up on scroll entry
- 1–2 sentence vision statement alongside the counters
- No team headshots in this phase
- Section height: 60–80vh

### Contact CTA section
- Bold, persistent "Start a Project" call-to-action
- Must always be visible or fixed so it's never more than a click away

### Spacing philosophy
- Generous, editorial breathing room — let content breathe
- Hero + Projects: 100vh
- Services, About/Stats, CTA: 60–80vh
- Tall section padding, comfortable internal gutters

### Typography scale
- Viewport-relative headings: 8–12vw, fluid and cinematic
- Scales naturally from large screens to mobile
- Typography as a primary design element, not just content carrier
- Elegant & Contained — large but perfectly framed and legible (no chaotic bleed-off)

### Visual accents
- Ghost typography: massive ultra-low-opacity background characters (`text-[30vw]`, `opacity-10`, `mix-blend-overlay`)
- Fine-line UI: 1px borders, mono-spaced labels throughout
- Visual "Pause" sections: pure text on solid `#080807`/`#eeeae0` between media-heavy sections
- Asymmetric rhythm: alternate text alignment (left/right/center) across sections — magazine feel

### Animation & interactions
- Fluid Parallax: background media `yPercent: 15`, foreground text `yPercent: -10`, `scrub: true`
- Custom Magnetic Cursor: `gsap.quickTo()` XY tracking, expands/reveals labels on CTA hover
- Animated counters in About/Stats: count up on scroll entry
- Clean Cinematic Fades/Wipes for transitions — no glitchy or liquid effects
- All GSAP scoped via `gsap.context()` for cleanup

### Performance
- Mandatory lazy-loading for all media via Intersection Observer (play/pause on viewport entry/exit)
- Loading sequence: poster image → `preload="metadata"` → GSAP opacity fade-in on `onLoadedData`
- Hero video only: `preload="auto"`
- Format: WebM (VP9/AV1) primary, H.264 MP4 fallback for Safari
- `muted playsInline autoPlay loop` on all background videos
- `object-cover` for full-screen bleed without distortion

### Claude's Discretion
- Exact animation durations and easing (use ANIMATION constants from PremiumUI.tsx)
- Loading skeleton or transition between poster and video
- Exact padding values within the generous spacing intent
- Error/fallback state for failed video loads
- Scroll-triggered counter animation implementation (GSAP countTo vs CSS)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PremiumUI.tsx` — `MagneticButton`, `TextReveal`, `SplitText`, `CinematicImage`, `CinematicVideo`, `useCursor`, `CursorProvider`, `ANIMATION` constants — all ready to use and extend
- `ANIMATION` constants: `{ duration: { reveal: 1.2, hover: 0.6, stagger: 0.08 }, ease: { luxury, smooth, bounce } }` — use these, don't define new easing values
- `LT` / `DK` palette token objects already defined in current `Home.tsx` — keep as-is, use via `P = isDark ? DK : LT` pattern
- `LazySection` component in current `Home.tsx` — Intersection Observer reveal wrapper, reuse

### Established Patterns
- GSAP must be scoped via `gsap.context()` — pattern established in Layout.tsx and Home.tsx
- ScrollTrigger registered at top of Home.tsx — maintain this
- Theme: `isDark` boolean derived from `themeMode` prop, `P = isDark ? DK : LT` for all tokens
- i18n: `const { copy, language } = useLanguage()` — all copy via `copy.home.*` keys
- RTL: `isArabic = language === 'ar'`, `dir={isArabic ? 'rtl' : 'ltr'}` on root wrapper — asymmetric layouts must mirror for Arabic

### Integration Points
- `Home.tsx` receives `themeMode: 'dark' | 'light'` prop from `App.tsx`
- `CursorProvider` wraps the Home component — custom cursor lives inside this provider
- Layout.tsx handles navbar, footer, Lenis — Home does not re-implement these
- Lenis smooth scroll is active — GSAP ScrollTrigger already set up to work with Lenis in Layout.tsx

</code_context>

<specifics>
## Specific Ideas

- "Feel alive" — videos and parallax create motion even when user is not actively scrolling
- "More content" — 5 clear sections (Hero, Projects, Services, About/Stats, CTA) each with substantial visual presence, not placeholder padding
- Project cards with hover-to-play video: premium interaction that showcases real work in motion
- Animated counters: simple but impactful trust signal in About/Stats
- Deleting and rewriting Home.tsx is explicitly allowed — no obligation to patch current code

</specifics>

<deferred>
## Deferred Ideas

- None — discussion stayed within phase scope

</deferred>

---

*Phase: 01-home-redesign*
*Context gathered: 2026-03-14 (updated session)*
