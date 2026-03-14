---
phase: 01-home-redesign
plan: 03
type: execute
wave: 2
depends_on:
  - "01-home-redesign-02"
files_modified:
  - src/pages/Home.tsx
autonomous: false
requirements:
  - REQ-001
  - REQ-002
  - REQ-003

must_haves:
  truths:
    - "Services section renders a Visual Dynamic List where each row swaps a background image on hover"
    - "About/Stats section shows animated counters that count up when scrolled into view"
    - "Contact CTA section is always dark (#080807) with a prominent MagneticButton"
    - "All remaining copy.home.* keys are consumed (expertiseLabel, expertiseTitle, expertiseCopy, coreLabel, servicesTitleLine1/2, clarity, serviceTracks, impactStats, methodTitle/Cards/Steps/Copy, testimonialsTitle, testimonials, ctaTitle/Copy/Label/Meta/MetaValue/Button)"
    - "Full Home.tsx compiles and passes npm run build"
    - "RTL Arabic layout mirrors asymmetric sections"
  artifacts:
    - path: "src/pages/Home.tsx"
      provides: "Complete Home page — all 5 sections implemented"
      contains: "ServicesSection, AboutStatsSection, ContactCTASection, AnimatedCounter"
  key_links:
    - from: "src/pages/Home.tsx"
      to: "gsap ScrollTrigger"
      via: "AnimatedCounter useLayoutEffect"
      pattern: "ScrollTrigger.*onEnter|gsap\\.to.*counter"
    - from: "src/pages/Home.tsx"
      to: "src/components/PremiumUI.tsx"
      via: "DynamicServiceRow uses CinematicImage + useCursor"
      pattern: "CinematicImage|useCursor"
---

<objective>
Fill the three remaining placeholder sections in Home.tsx (Services, About/Stats, Contact CTA) with complete implementations. After this plan, Home.tsx is the full luxury experience with all 5 sections, every copy.home.* key consumed, and a human verification checkpoint confirming the visual result.

Purpose: Sections 3-5 carry the authority signals (services credibility, trust stats, conversion CTA) that close the luxury experience loop opened by the Hero and Projects sections in plan 02.

Output: Complete Home.tsx with all 5 sections. Human checkpoint to verify visual quality.
</objective>

<execution_context>
@C:/Users/PC/.claude/get-shit-done/workflows/execute-plan.md
@C:/Users/PC/.claude/get-shit-done/templates/summary.md
</execution_context>

<context>
@.planning/REQUIREMENTS.md
@.planning/phases/01-home-redesign/01-CONTEXT.md
@.planning/phases/01-home-redesign/01-RESEARCH.md
@.planning/phases/01-home-redesign/01-home-redesign-02-SUMMARY.md
@src/pages/Home.tsx
@src/components/PremiumUI.tsx

<interfaces>
<!-- Contracts established in plan 02 that this plan extends. -->

From src/pages/Home.tsx (after plan 02):
- LT / DK palette tokens — keep verbatim, use via `P = isDark ? DK : LT`
- MEDIA constant — includes `services` array of 3 image URLs
- LazySection component — use for all new sections
- Home component structure — insert new sections replacing `{/* TODO: plan 04 */}` comments

copy.home keys consumed in this plan (all remaining keys):
```
expertiseLabel, expertiseTitle, expertiseCopy
coreLabel, servicesTitleLine1, servicesTitleLine2, servicesCta
clarity[3]    — { title, lead, copy }
serviceTracks[3] — { title, copy, result, href }
impactStats[3]   — { label, value }
methodTitle, methodCards[3], methodSteps[3], methodCopy
testimonialsTitle, testimonials[2] — { quote, name, role }
ctaTitle, ctaCopy, ctaLabel, ctaMeta, ctaMetaValue, ctaButton
```

ServiceRowItem type (already in current Home.tsx):
```typescript
interface ServiceRowItem { title: string; copy: string; result?: string; href?: string }
```
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Implement Services + About/Stats sections</name>
  <files>src/pages/Home.tsx</files>
  <action>
Replace the `{/* TODO: plan 04 */}` placeholder comments for the `#services` and `#about` sections with full implementations. Do NOT touch the Hero or Projects sections from plan 02.

**Services section** (replaces `<section id="services">` placeholder):

Wrap in `<LazySection>`. Full implementation:
- Visual "Pause" text block: `copy.home.expertiseLabel` label + `SplitText` for `copy.home.expertiseTitle` at `text-4xl md:text-6xl lg:text-7xl font-display font-light` + `TextReveal` for `copy.home.expertiseCopy` body. Solid `P.bg` background, centered text, generous padding `py-40 md:py-60`. Fine-line `P.border` divider below.
- Section header: `copy.home.coreLabel` eyebrow + fine-line rule + `SplitText` rendering `copy.home.servicesTitleLine1 + ' ' + copy.home.servicesTitleLine2` at `text-5xl md:text-6xl lg:text-[5rem] font-display font-light`.
- **Clarity cards** (3 cards from `copy.home.clarity`) using `ClarityCard` component (keep verbatim from current Home.tsx). Grid: `grid-cols-1 md:grid-cols-3 gap-5 mb-16`.
- `DynamicServiceRow` component (keep from current Home.tsx, reuse verbatim):
  - Background media swaps on hover using `CinematicImage` at `opacity-10` (hovered) / `opacity-0` (default)
  - `setType('view')` / `setType('default')` on enter/leave
  - Title: `text-4xl md:text-5xl lg:text-6xl font-display font-light`
  - Index label: `font-mono text-[10px] tracking-[0.4em] uppercase`
  - Body copy + result badge
  - `translate-x-4` / `-translate-x-4` shift on hover (RTL-aware)
- Render `copy.home.serviceTracks.map(...)` using DynamicServiceRow, wrapped in `border-t P.border`
- Ghost typography accent: `aria-hidden="true"` absolute span `text-[28vw] font-display font-bold opacity-[0.025] mix-blend-overlay pointer-events-none select-none` showing "SCALE" in the section background (section must be `relative overflow-hidden`).

**About/Stats section** (replaces `<section id="about">` placeholder):

Wrap in `<LazySection>`. Full implementation:
- Section eyebrow: `copy.home.methodTitle` label in `text-[9px] font-bold tracking-[0.52em] uppercase P.muted`
- Two-column layout on desktop (`grid grid-cols-1 lg:grid-cols-2 gap-16 items-start`):
  - Left: vision text block with `copy.home.expertiseCopy` as body copy (`text-lg md:text-xl font-light leading-[1.8]`) and `copy.home.expertiseLabel` as fine-line label
  - Right: animated counters — 3 items from `copy.home.impactStats`, each using `AnimatedCounter` component

- **AnimatedCounter component** (create as memoized function inside Home.tsx):
  ```typescript
  const AnimatedCounter = memo(({ value, label, isDark }: { value: string; label: string; isDark: boolean }) => {
    const numRef = useRef<HTMLDivElement>(null)
    useLayoutEffect(() => {
      const el = numRef.current
      if (!el) return
      const numeric = parseFloat(value.replace(/[^0-9.]/g, '')) || 0
      const suffix = value.replace(/[0-9.]/g, '')
      const ctx = gsap.context(() => {
        const counter = { val: 0 }
        gsap.to(counter, {
          val: numeric,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: { trigger: el, start: 'top 85%', once: true },
          onUpdate() {
            if (el) el.textContent = Math.round(counter.val) + suffix
          },
        })
      }, numRef)
      return () => ctx.revert()
    }, [value])
    return (
      <div className={isArabic ? 'text-right' : ''}>  {/* note: isArabic from outer scope */}
        <div className={`h-px w-10 mb-3 ${isDark ? 'bg-white/15' : 'bg-[#c8c4b8]'}`} />
        <span className={`text-[9px] font-bold tracking-[0.44em] uppercase block mb-2 ${isDark ? 'text-white/25' : 'text-[#8c8780]'}`}>{label}</span>
        <div ref={numRef} className={`font-display font-light leading-[0.9] text-[5rem] md:text-[7rem] lg:text-[8rem] ${isDark ? 'text-white/90' : 'text-[#18160f]'}`}>
          {value}
        </div>
      </div>
    )
  })
  ```
  Note: AnimatedCounter does NOT receive isArabic — handle RTL in the parent grid alignment.

- **ProcessStep cards** (3 from `copy.home.methodCards`): use `ProcessStep` component verbatim from current Home.tsx. Grid `grid-cols-1 md:grid-cols-3 gap-8`. Pass `methodStepLabels` array using `copy.home.methodSteps` values: `[copy.home.methodSteps[0], copy.home.methodSteps[1], copy.home.methodSteps[2]]`.
- **Method copy**: `TextReveal` wrapping `copy.home.methodCopy` body paragraph.
- Ghost typography accent: `aria-hidden` absolute span, first letter of `copy.home.methodTitle` at `text-[30vw] opacity-[0.025] mix-blend-overlay`.

**Testimonials sub-section** (inside About/Stats LazySection, after ProcessStep grid):
- `TextReveal` wrapping `copy.home.testimonialsTitle` as section eyebrow
- 2 `TestimonialCard` components from `copy.home.testimonials.slice(0, 2)` (keep TestimonialCard verbatim)
- Grid `grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-start`; second card: `className={i === 1 ? 'md:mt-24' : ''}`
  </action>
  <verify>
    <automated>npm run build 2>&1 | tail -20</automated>
  </verify>
  <done>
`npm run build` exits 0. Services section renders with dynamic background swap on hover. About/Stats section shows counters that animate up from 0 when scrolled into view. Clarity cards, ProcessStep cards, and TestimonialCards all render. All copy.home.* keys except CTA keys are now consumed.
  </done>
</task>

<task type="auto">
  <name>Task 2: Implement Contact CTA section</name>
  <files>src/pages/Home.tsx</files>
  <action>
Replace the `<section id="contact">` placeholder with the full Contact CTA implementation.

**Contact CTA section** (replaces `<section id="contact">` placeholder):

Wrap in `<LazySection id="contact" className="scroll-mt-28">`.

The CTA panel is ALWAYS dark regardless of `themeMode`. Use hardcoded dark values only.

Structure:
- Outer section: `relative min-h-[70vh] md:min-h-[80vh] flex flex-col justify-center overflow-hidden rounded-3xl mb-24 md:mb-36 bg-[#080807] text-white`
- Two ambient light orbs (`aria-hidden="true"`):
  - Top-left: `absolute -top-60 -left-60 w-[700px] h-[700px] rounded-full bg-white/[0.018] blur-[200px] pointer-events-none`
  - Bottom-right: `absolute -bottom-48 -right-48 w-[550px] h-[550px] rounded-full bg-white/[0.012] blur-[170px] pointer-events-none`

Content block (`relative z-10 w-full max-w-4xl mx-auto px-8 md:px-14 py-24 md:py-36`, text-center unless isArabic):
1. `TextReveal`: `copy.home.ctaLabel` eyebrow — `text-[9px] font-bold tracking-[0.48em] uppercase block mb-12 text-white/25`
2. `SplitText`: `copy.home.ctaTitle` — `text-[clamp(4.5rem,10vw,12rem)] font-display font-light leading-[0.88] mb-12 overflow-visible text-white/92 text-center` type="words" delay={0.1}
3. `TextReveal` delay={0.22}: `copy.home.ctaCopy` — `text-base md:text-lg font-light leading-[1.76] mb-14 max-w-[28rem] mx-auto text-white/42`
4. Availability badge (`TextReveal` delay={0.30}): `inline-flex items-center gap-3 mb-14 px-5 py-2.5 rounded-full border border-white/[0.10] backdrop-blur-sm`. Contains:
   - Ping dot: `<span className="relative flex h-2 w-2 shrink-0"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" /><span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" /></span>`
   - Text: `text-[9px] font-bold tracking-[0.32em] uppercase text-white/35` showing `{copy.home.ctaMeta}: {copy.home.ctaMetaValue}`
5. `MagneticButton` href="mailto:hello@lightlab.dev" isDark variant="primary": `{copy.home.ctaButton}` + arrow SVG (`width="16" height="8"`). Classes: `inline-flex items-center gap-4 px-12 py-5 rounded-full text-[11px] font-bold tracking-[0.28em] uppercase`

Bottom wordmark watermark (`aria-hidden="true"`):
- `absolute inset-x-0 bottom-0 h-[11vw] overflow-hidden pointer-events-none flex items-start justify-center`
- Inner span: `text-[20vw] font-display font-bold leading-none whitespace-nowrap select-none text-white/[0.022] translate-y-[18%]` — text "LIGHTLAB"

RTL: when `isArabic`, use `text-right` for body copy paragraph, reverse flex rows with `flex-row-reverse`, mirror arrow SVG with `scale-x-[-1]`, swap badge to `flex-row-reverse`.

**Inline `<style>` block** — ensure marquee and scroll-pulse keyframe animations from plan 02 are still present at the bottom of the return statement:
```css
@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
.animate-marquee { animation: marquee 52s linear infinite; }
@keyframes scroll-pulse { 0% { transform: translateY(-100%); opacity: 0; } 30% { opacity: 1; } 70% { opacity: 1; } 100% { transform: translateY(300%); opacity: 0; } }
.animate-scroll-pulse { animation: scroll-pulse 2.2s cubic-bezier(0.4,0,0.2,1) infinite; }
@media (prefers-reduced-motion: reduce) { .animate-marquee { animation-play-state: paused; } .animate-scroll-pulse { animation: none; opacity: 0.4; } }
```

**Global scroll-progress bar** — verify it is still at the very top of the returned JSX (fixed top-0 div).
  </action>
  <verify>
    <automated>npm run build 2>&1 | tail -20</automated>
  </verify>
  <done>
`npm run build` exits 0. Contact CTA section is always dark, renders with large ctaTitle text, availability badge with green pulse dot, and MagneticButton. All copy.home.* keys are now consumed across the page.
  </done>
</task>

<task type="checkpoint:human-verify" gate="blocking">
  <name>Task 3: Visual quality verification</name>
    <files>src/pages/Home.tsx</files>
  <action>Run `npm run dev` to start the dev server, then perform the visual walkthrough checklist below. No code changes — this is a verification-only task.</action>
  <verify>
    <automated>npm run dev &amp; sleep 4 &amp;&amp; curl -s -o /dev/null -w "%{http_code}" http://localhost:5173</automated>
  </verify>
  <done>All 8 visual checks below pass and user types "approved".</done>
  <what-built>
Complete Home.tsx with all 5 sections: Hero (cinematic video + parallax + blend-mode headlines), Projects (3 hover-to-play video cards, asymmetric layout), Services (visual dynamic list with background swap on hover + ghost typography), About/Stats (animated scroll-triggered counters + ProcessStep cards + testimonials), Contact CTA (always-dark panel, MagneticButton, availability badge).
  </what-built>
  <how-to-verify>
1. Run `npm run dev` and open http://localhost:5173
2. Hero: full-screen video playing, headlines use mix-blend-difference (text inverts over video). Scroll slowly — hero video drifts slower than the text (parallax).
3. Projects: 3 full-width stacked cards visible. Hover each card — video should start playing. Move mouse away — video pauses.
4. Services: hover each of the 3 service rows. Background image should fade in at low opacity; the row shifts ~16px toward the cursor.
5. About/Stats: scroll to the stats section — the 3 numbers should count up from 0 to their final value on entry.
6. Contact CTA: section remains dark even when toggling light mode. Green dot pulsing in the availability badge. MagneticButton shifts slightly toward the cursor.
7. Theme toggle: all sections update dark/light correctly except CTA (always stays dark).
8. Arabic language toggle: text right-aligned, flex rows reversed, hero studio badge appears on the left side.
  </how-to-verify>
  <resume-signal>Type "approved" if all 8 checks pass, or describe which checks failed with details</resume-signal>
</task>

</tasks>

<verification>
1. `npm run build` exits 0
2. All 5 sections render in the browser
3. Animated counters count up from 0 on scroll entry
4. Services dynamic list: background image swaps on hover
5. CTA section is always dark (#080807) regardless of theme toggle
6. All copy.home.* keys confirmed consumed: `grep -c "copy\.home\." src/pages/Home.tsx` covers all keys from RESEARCH.md inventory
7. No new colors: only `#080807`, `#eeeae0`, `#18160f`, and white/opacity tokens appear in className values
</verification>

<success_criteria>
- All 5 sections implemented and rendering
- Animated counters working on scroll
- Services visual dynamic list implemented
- CTA always dark with MagneticButton
- Every copy.home.* key consumed
- npm run build exits 0
- Human checkpoint approved
</success_criteria>

<output>
After completion, create `.planning/phases/01-home-redesign/01-home-redesign-03-SUMMARY.md`
</output>
