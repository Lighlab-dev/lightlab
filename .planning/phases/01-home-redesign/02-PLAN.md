---
phase: 01-home-redesign
plan: 02
type: execute
wave: 1
depends_on: []
files_modified:
  - src/pages/Home.tsx
autonomous: true
requirements:
  - REQ-001
  - REQ-002
  - REQ-003

must_haves:
  truths:
    - "Home.tsx compiles and renders without errors in both dark and light themes"
    - "All copy.home.* i18n keys are consumed somewhere in the file"
    - "LazySection, palette tokens (LT/DK), and GSAP ScrollTrigger are correctly wired"
    - "Git repository is in a clean state (revert aborted)"
    - "Projects section renders 3 cards with hover-to-play video previews"
    - "Hero section is 100vh with cinematic video loop, parallax, and blend-mode headlines"
  artifacts:
    - path: "src/pages/Home.tsx"
      provides: "Complete Home page with Hero + Projects sections"
      exports: ["default Home"]
      contains: "HeroSection, ProjectsSection, gsap.context"
  key_links:
    - from: "src/pages/Home.tsx"
      to: "src/components/PremiumUI.tsx"
      via: "named imports"
      pattern: "MagneticButton|TextReveal|SplitText|CinematicVideo|useCursor|ANIMATION"
    - from: "src/pages/Home.tsx"
      to: "src/i18n.tsx"
      via: "useLanguage hook"
      pattern: "copy\\.home\\."
---

<objective>
Abort the in-progress git revert, then perform a full rewrite of src/pages/Home.tsx implementing the Hero and Projects sections — the two primary 100vh cinematic panels.

Purpose: Establish the correct codebase baseline and deliver the highest-impact sections first. The Hero is the first impression; Projects immediately proves authority. Both are 100vh media-first sections that define the luxury aesthetic.

Output: A compiling Home.tsx with Hero (cinematic video + blend-mode typography + GSAP parallax) and Projects (3 full-width cards with hover-to-play video previews, asymmetric layout).
</objective>

<execution_context>
@C:/Users/PC/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/PC/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/REQUIREMENTS.md
@.planning/phases/01-home-redesign/01-CONTEXT.md
@.planning/phases/01-home-redesign/01-RESEARCH.md
@src/components/PremiumUI.tsx
@src/pages/Home.tsx

<interfaces>
<!-- Key exports from PremiumUI.tsx the executor will use directly. -->

From src/components/PremiumUI.tsx:
```typescript
// Cursor
export type CursorType = "default" | "view" | "play" | "hide" | "pointer";
export const CursorProvider: ({ children }: { children: ReactNode }) => JSX.Element
export const useCursor: () => CursorContextValue  // { type, setType }

// Animation constants — use these, do NOT define new easing values
export const ANIMATION = {
  duration: { reveal: 1.2, hover: 0.6, stagger: 0.08 },
  ease: {
    luxury: "cubic-bezier(0.16, 1, 0.3, 1)",
    smooth: "cubic-bezier(0.62, 0.05, 0.01, 0.99)",
    bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
}

// Components
export const MagneticButton: React.FC<MagneticButtonProps>
// Props: children, className?, href?, onClick?, variant?: "primary"|"outline", isDark?: boolean

export const TextReveal: React.FC<TextRevealProps>
// Props: children, delay?: number, className?, direction?: "up"|"down"|"left"|"right"

export const SplitText: React.FC<SplitTextProps>
// Props: text: string, className?, delay?: number, type?: "chars"|"words"

export const CinematicImage: React.FC<CinematicImageProps>
// Props: src, alt, className?, priority?: boolean

export const CinematicVideo: React.FC<CinematicVideoProps>
// Props: src, poster?, className?
// Already handles IntersectionObserver play/pause internally

export const CustomCursor: React.FC  // position:fixed cursor, uses CursorContext
```

From src/i18n.tsx (copy.home key inventory used in this plan):
```typescript
// Required keys — all must be consumed across plans 02–04
copy.home.heroTag        // 'AI Solutions · Development · Media Buying'
copy.home.heroTitle1     // 'Revenue'
copy.home.heroTitle2     // 'Scaling.'
copy.home.heroMeta       // 'Lightlab Studio ©2026'
copy.home.heroCopy       // hero sub-copy paragraph
copy.home.scrollLabel    // 'Scroll'
// Projects section — use placeholder data (no dedicated copy key exists)
// All other keys consumed in plan 04
```

Palette tokens (keep exactly as-is from current Home.tsx):
```typescript
const LT = {
  bg: 'bg-[#eeeae0]', text: 'text-[#18160f]', stone: 'text-[#56514a]',
  muted: 'text-[#8c8780]', border: 'border-[#d9d5ca]', divideX: 'divide-[#d9d5ca]',
  cardBg: 'bg-white', faint: 'bg-[#e8e4d9]', watermark: 'text-[#d0ccbf]',
}
const DK = {
  bg: 'bg-[#080807]', text: 'text-white', stone: 'text-white/50',
  muted: 'text-white/25', border: 'border-white/[0.07]', divideX: 'divide-white/[0.06]',
  cardBg: 'bg-white/[0.03]', faint: 'bg-white/[0.015]', watermark: 'text-white/[0.025]',
}
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Abort git revert and confirm clean baseline</name>
  <files>— (git operation only, no source files modified)</files>
  <action>
Run `git revert --abort` to cancel the paused revert operation. The repo is stuck mid-revert from commit 359054c. The current working tree (fdce874 version — 964-line premium rebuild) is the correct base. After aborting, run `git status` to confirm no staged changes or merge conflicts remain. If `git revert --abort` returns "no revert in progress", the revert was already resolved — continue without error.
  </action>
  <verify>
    <automated>git status --short | grep -v "^??" | wc -l</automated>
  </verify>
  <done>git status shows no merge conflicts, untracked planning files are the only noise, working tree is clean except for .planning/ and playwright files</done>
</task>

<task type="auto" tdd="false">
  <name>Task 2: Rewrite Home.tsx — Hero + Projects sections</name>
  <files>src/pages/Home.tsx</files>
  <action>
Perform a full rewrite of src/pages/Home.tsx. The current file is the starting reference for patterns (GSAP context scoping, palette tokens, LazySection, imports). The new file must implement the section structure: Hero → Projects → (Services + About/Stats + CTA scaffolded as empty section placeholders that plan 04 fills).

**File structure to produce:**

1. **Imports block** — identical imports to current file plus any additions needed. Keep: gsap, ScrollTrigger, useLanguage, MagneticButton, TextReveal, SplitText, CinematicImage, CinematicVideo, ANIMATION, useCursor, CursorProvider. Register ScrollTrigger at module level.

2. **LT / DK palette tokens** — copy verbatim from current Home.tsx. No changes.

3. **MEDIA_ASSETS constant** — project video/poster URLs. Use these placeholder Unsplash/Vimeo URLs (real assets will be swapped later):
   ```typescript
   const MEDIA = {
     heroVideo: 'https://player.vimeo.com/external/494252666.sd.mp4?s=7297370e7674844339f8164366539e6a00839e9f&profile_id=165',
     heroPoster: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600&q=90',
     projects: [
       { id: 'prj-01', title: 'AI Revenue Engine', category: 'AI Automation', videoSrc: 'https://player.vimeo.com/external/434045526.sd.mp4?s=c27eecc69a27dbc4ff2b87d38aaa35f1d0ffe1ca&profile_id=165', poster: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=1200&q=85' },
       { id: 'prj-02', title: 'Growth Platform', category: 'Development', videoSrc: 'https://player.vimeo.com/external/370467553.sd.mp4?s=ce49c8c6d8e28a89298ffb4c53a2e842bab71348&profile_id=165', poster: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&q=85' },
       { id: 'prj-03', title: 'Media Scale', category: 'Media Buying', videoSrc: 'https://player.vimeo.com/external/291648067.sd.mp4?s=94350b646e6b5e10aa85264f7e01fdb64c31e0e2&profile_id=165', poster: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=85' },
     ],
     services: [
       'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=85',
       'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&q=85',
       'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=85',
     ],
   }
   ```

4. **LazySection component** — keep verbatim from current Home.tsx (Intersection Observer reveal wrapper). It is used for all non-hero sections.

5. **ProjectCard component** — new memoized component for the Projects section:
   ```
   interface ProjectCardProps {
     project: { id: string; title: string; category: string; videoSrc: string; poster: string }
     index: number
     isArabic: boolean
     isDark: boolean
     align: 'left' | 'right' | 'center'  // asymmetric layout control
   }
   ```
   Layout: full-width card (100% width, aspect-[16/9] on desktop, aspect-[4/3] on mobile). Video plays on hover (`onMouseEnter` → `videoRef.current?.play()`, `onMouseLeave` → `videoRef.current?.pause()`). Poster image shows when video is paused. `setType('play')` on enter, `setType('default')` on leave.

   Asymmetric layout per `align` prop:
   - `'left'`: text overlay anchored bottom-left
   - `'right'`: text overlay anchored bottom-right
   - `'center'`: text overlay centered

   Text overlay content: category label (mono, small-caps, `P.muted`), project title (font-display, `text-[6vw]` fluid, white). On dark backgrounds always use `text-white` for readability — the card is always on a dark video backdrop.

   Ghost typography accent: `aria-hidden="true"` span with `text-[22vw] font-display opacity-[0.04] mix-blend-overlay absolute pointer-events-none select-none` showing the project index (01, 02, 03).

   GSAP: on hover, animate title `yPercent: -5` with `duration: 0.6, ease: ANIMATION.ease.luxury`.

6. **Home component (main export)**:
   - Props: `{ themeMode: 'dark' | 'light' }`
   - `isDark`, `P`, `isArabic`, `dir` derived exactly as in current file
   - Scroll-progress bar — keep verbatim from current file
   - GSAP context scoped to `wrapperRef` via `gsap.context(() => { ... }, wrapperRef)`, returned as `ctx.revert()` in cleanup

   **Hero section** (`ref={heroRef}`, `min-h-screen flex items-end overflow-hidden`):
   - `hero-video-wrap div` (absolute inset-0): contains `CinematicVideo` with `src={MEDIA.heroVideo}` and `poster={MEDIA.heroPoster}`, `className="w-full h-full scale-110"`. Add two scrim layers: `bg-black/40 mix-blend-multiply` and `bg-gradient-to-t from-black/80 via-transparent to-transparent`.
   - Studio badge top-right: `heroMeta` key in fine-line pill (`text-[9px] font-mono tracking-[0.42em] uppercase border border-white/10 px-4 py-2.5 rounded-full backdrop-blur-md`). `isArabic` → position on left instead.
   - `heroTag` label: fine-line mono tag below/above title (`text-[9px] font-bold tracking-[0.44em] uppercase text-white/30`). Position at top-left.
   - `hero-content-inner div` (relative z-10, bottom-aligned): Contains:
     - `<h1>` with `mix-blend-difference text-white font-display font-light leading-[0.85] text-[clamp(4.5rem,11vw,11rem)]`
       - First line: `<span class="hero-line block overflow-hidden"><span class="block">{copy.home.heroTitle1}</span></span>`
       - Second line: `<span class="hero-line block overflow-hidden italic text-white/70"><span class="block">{copy.home.heroTitle2}</span></span>`
     - `heroCopy` sub-copy: `hero-body`, `text-white/70 max-w-[34rem] leading-[1.72] font-light`
     - CTA row (`hero-cta`): `MagneticButton` href="#contact" variant="primary" isDark with `{copy.home.ctaButton}` + arrow SVG. Scroll indicator with animated pulse line + `{copy.home.scrollLabel}`.
   - GSAP parallax in `useLayoutEffect` (scoped to wrapperRef): `.hero-video-wrap` yPercent: 15, `.hero-content-inner` yPercent: -10, both scrub: true.
   - GSAP entrance timeline: `.hero-line` y:60→0 opacity:0→1 stagger:0.15 duration:1.2, `.hero-body` delayed, `.hero-meta` delayed, `.hero-cta` delayed, `.hero-video-wrap` opacity fade from 0 over 1.5s. Wrap in `if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches)` guard.

   **Projects section** (`<LazySection>`):
   - Label row: `copy.home.viewProjectLabel` or a hardcoded "Selected Work" eyebrow, `copy.home.heroTag` can appear as section descriptor
   - 3 `ProjectCard` components with `align` values `['left', 'right', 'center']`
   - Vertical stack layout: each card is `w-full` with `mb-4 md:mb-6` gap — editorial stacked layout, not a grid
   - Section `aria-label="Featured projects"`

   **Placeholder sections** (empty shells for plan 04 to fill — just `<section id="services">`, `<section id="about">`, `<section id="contact">` with a `{/* TODO: plan 04 */}` comment each)

   **RTL support**: All `isArabic` guards must mirror asymmetric elements:
   - ProjectCard: when `isArabic`, text overlay side flips (left→right, right→left)
   - Studio badge position flips
   - Flex rows use `isArabic ? 'flex-row-reverse' : 'flex-row'`

   **Inline `<style>` block** at end: keep marquee and scroll-pulse keyframe animations from current file.

   Wrap return in `<CursorProvider>` if not already provided by App.tsx. Check App.tsx — if CursorProvider is already there, do NOT double-wrap. Based on the current Home.tsx, CursorProvider is NOT wrapping Home; add it as the outermost wrapper around the div.

   **No new brand colors.** Only `#080807`, `#eeeae0`, `#18160f`, and white with existing opacity tokens.
  </action>
  <verify>
    <automated>npm run build 2>&1 | tail -20</automated>
  </verify>
  <done>
`npm run build` exits 0 with no TypeScript errors. Home page renders in browser with cinematic hero video playing on load, blend-mode headlines visible, hero parallax active on scroll, 3 project cards visible with hover-to-play video behavior. Both dark and light themes render without broken styles. Arabic RTL mode (`?lang=ar`) mirrors layout correctly.
  </done>
</task>

</tasks>

<verification>
1. `npm run build` exits 0 — no TypeScript or Vite errors
2. `git status` shows no merge conflicts
3. Hero section is 100vh with video background and `mix-blend-difference` headline
4. Projects section shows 3 cards; hovering a card plays its video
5. `copy.home.heroTitle1`, `heroTitle2`, `heroTag`, `heroMeta`, `heroCopy`, `scrollLabel`, `ctaButton` all render
6. No new color values outside `#080807`, `#eeeae0`, `#18160f`, and white/opacity tokens
7. GSAP parallax operates on scroll (hero video drifts slower than text)
8. Arabic RTL: text alignment and asymmetric layouts mirror correctly
</verification>

<success_criteria>
- git revert aborted, repo in clean state
- Home.tsx compiles and renders Hero + Projects sections
- Hero video plays with cinematic parallax and blend-mode typography
- 3 project cards render with hover-to-play video previews
- Empty section placeholders exist for Services, About/Stats, CTA
- All hero copy keys consumed (`heroTitle1`, `heroTitle2`, `heroTag`, `heroMeta`, `heroCopy`, `scrollLabel`)
</success_criteria>

<output>
After completion, create `.planning/phases/01-home-redesign/01-home-redesign-02-SUMMARY.md`
</output>
