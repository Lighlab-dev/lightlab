# Phase 1: Home Page Redesign - Context

**Gathered:** 2026-03-14
**Status:** Ready for planning

<domain>
## Phase Boundary

Redesign and rebuild the `Home.tsx` landing page (`/`) into a conversion-optimized, premium technology studio page. All 9 sections defined in the PRD are in scope. Other pages (Services, Projects, Contact, About, Method) are out of scope unless directly linked from Home CTAs.

</domain>

<decisions>
## Implementation Decisions

### Positioning & Messaging
- Position LIGHTLAB as "Your outsourced product and growth engineering team" — not a marketing agency
- Target clients willing to spend $20k–$200k+ on projects (startups, scaleups, SaaS, e-commerce)
- Quality benchmark: Linear, Stripe, Vercel, Ramp, OpenAI, Framer, Replit
- Hero headline direction: outcome-focused — e.g., "Engineering Growth Infrastructure." or "We Build Systems That Scale Revenue."
- Hero subheadline: one sentence explaining what LIGHTLAB does — "Custom SaaS, AI automation, and growth systems designed to accelerate modern companies."

### Page Structure (9 sections, in order)
1. **Hero** — headline + subheadline + primary CTA ("Start a Project") + secondary CTA ("View Our Work") + visual element
2. **Trust Signals** — immediately after hero; client logos, performance metrics, industries
3. **Services** — 4 pillars: AI Systems, Custom SaaS Development, Growth Infrastructure, Performance Marketing; each card has title + description + key outcomes
4. **How We Work** — 4 steps: Architecture → Build → Deploy → Scale
5. **Featured Projects** — case study cards with project name, type (SaaS/AI/Growth), measurable results
6. **Performance Metrics** — large visually impactful numbers (35% avg growth, 4x marketing perf, 40% faster deployment)
7. **Client Testimonials** — professional quotes from founders/executives focused on business impact, speed, engineering quality
8. **Why LIGHTLAB** — differentiation: engineering-first, performance-focused, long-term partnership, data-driven, built for scale
9. **Final CTA** — large bold section, headline "Build Your Next Growth System.", primary "Start a Project", secondary "Book a Diagnostic"

### Visual Design
- Color palette: warm minimal neutral — soft beige/sand background, near-black charcoal text, deep neutral gray accent, optional subtle gold/champagne highlight
- Dark sections allowed for contrast (especially Final CTA or Metrics sections)
- No cheap gradients, no startup clichés, no stock-like marketing design
- Generous whitespace, clear hierarchy, subtle motion only

### Typography
- Hero headline: elegant serif font (premium editorial feel)
- Body text: modern sans-serif
- Section titles: large, confident, minimal
- Overall feel: luxury technology studio, not startup template

### Hero Visual
- Subtle animated dashboard, product architecture visualization, or system diagrams
- No generic stock photos
- Should feel like a tech workspace or system architecture visualization

### Motion & Animation
- GSAP ScrollTrigger for scroll-reveal (already established pattern)
- Hover interactions on cards/CTAs
- Animated metrics (count-up on scroll)
- Parallax depth on hero
- Elegant microinteractions — nothing flashy
- Lenis smooth scroll already handles page-level smoothness

### Conversion Optimization
- CTA visible above fold (in hero)
- CTA repeated every few sections throughout the page
- Trust signals immediately after hero
- Frictionless contact path

### Content (placeholder data acceptable for launch)
- Performance metrics: +35% average revenue growth, 4x marketing performance, 40% faster product launches
- Services example outcome: AI Systems — "reduce operational complexity and unlock scale"
- Featured projects: AI Revenue Engine (+52% leads), Growth Platform (4x ROI), Media Optimization System (40% CAC reduction)
- "How We Work" steps: Architecture, Build, Deploy, Scale

### Claude's Discretion
- Exact serif font choice (Playfair Display, DM Serif Display, or similar premium serif already in the stack or easily imported)
- Loading skeleton / page transition details
- Exact card shadow and border-radius values
- Specific animation easing curves and durations
- Whether metrics section is dark or light background
- Exact grid layout within each section (2-col, 3-col, etc.)
- Testimonial card layout details

</decisions>

<specifics>
## Specific Ideas

- "This company builds serious technology" — the feeling visitors should leave with
- Reference quality: Linear (clean card layouts), Stripe (trust signals + metrics), Vercel (minimal, dark sections), Ramp (business ROI focus)
- Hero visual: subtle animated dashboard or product architecture diagram — NOT stock photos
- Metrics section: numbers should be "very visually impactful" — large, bold, possibly counting up on scroll
- Services cards: title + short description + key outcomes format
- Project cards: project name + type label + measurable result in large text
- Final CTA section: "large bold section" — likely dark background for contrast

</specifics>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/PremiumUI.tsx`: Animated UI primitives already built — use for cards, reveals, hover states, metric counters
- `src/components/Layout.tsx`: Provides Lenis smooth scroll, GSAP context, navbar, footer — page only needs to provide content sections
- `react-icons` (Feather Icons set): Available for service icons, CTA arrows, etc.
- `/public/logo.svg` + `/public/lightlab-lightlogo.svg`: Two logo variants available

### Established Patterns
- **GSAP animations**: Use `gsap.context()` with `.reveal-el` class pattern for scroll reveals; cleanup via `ctx.revert()`
- **Tailwind CSS 4**: All styling via utility classes; no separate CSS files per component
- **TypeScript strict mode**: All components must be typed; props interfaces defined above or inline
- **i18n**: `useLanguage()` hook + `t()` function for all user-facing strings (EN/FR/AR support required)
- **Theme**: `data-theme` attribute handles light/dark; color tokens via CSS variables in `App.css`

### Integration Points
- `src/App.tsx` → `Home.tsx` is the `/` route — no routing changes needed
- Layout wraps the page — navbar and footer are automatic
- Smooth scroll and reveal animations are initialized in Layout — Home just needs `.reveal-el` classes
- i18n translations must be added to `src/i18n.tsx` for any new strings

</code_context>

<deferred>
## Deferred Ideas

- Contact form with lead capture (mentioned in PRD as "frictionless contact path" — the CTA links to `/contact` which already exists)
- Blog/case study detail pages — Full case studies are a separate feature
- Animated background effects beyond the hero (separate animation polish phase if needed)
- A/B testing on CTAs — future growth optimization phase

</deferred>

---

*Phase: 01-home-redesign*
*Context gathered: 2026-03-14*
