---
name: Lightlab Design System v2 — Full Token Reference
description: Complete v2 palette tokens, accent red/gold usage rules, and CSS class definitions established March 2026
type: project
---

## Palette tokens (always-dark)

| Role | Value |
|---|---|
| Page background | `#090909` |
| Strip/alternate background | `#060606` |
| Accent red | `#FF3B3B` |
| Card border | `border-white/[0.07]` |
| Card bg | `bg-gradient-to-b from-white/[0.03] to-transparent` |
| Body text | `text-white/85` |
| Secondary text | `text-white/42` — `text-white/48` |
| Muted text | `text-white/28` — `text-white/38` |
| Ghost text | `text-white/[0.015]` — `text-white/[0.025]` |
| Section divider | `border-white/[0.07]` |

## Accent usage rules
- Red (#FF3B3B) is the only accent. No orange, no gold.
- Use for: CTA buttons, eyebrow rules, card top hairlines, checked pill toggles, focus rings, progress indicators, hover state text transitions.
- Opacity variants: `/50` (hairlines, eyebrow lines), `/40` (card hairline gradient start), `/28` (ghost glows), `/10` (icon backgrounds).

## Typography scale
- Giant hero headline: `clamp(3.5rem,10vw,10rem)` font-display font-light
- Section heading: `clamp(1.8rem,3vw,2.8rem)` font-display font-light
- Ghost watermark letters: `clamp(18rem,55vw,80rem)` text-white/[0.018]
- Eyebrow: `text-[9px] font-bold tracking-[0.52em] uppercase text-white/25`
- Labels: `text-[9px] font-bold tracking-[0.44em] uppercase text-white/28`
- Pill toggles: `text-[10px] font-bold tracking-[0.24em] uppercase`
- Submit button: `text-[11px] font-bold tracking-[0.24em] uppercase`
- Body: `text-base font-light leading-[1.82]`

## Card anatomy
```
rounded-3xl border border-white/[0.07] bg-gradient-to-b from-white/[0.03] to-transparent p-10 overflow-hidden relative
  + absolute top-0 left-0 right-0 h-px :: linear-gradient(to right, rgba(255,59,59,0.4), transparent)
```

## CTA button (primary red)
```
MagneticButton style={{ backgroundColor: '#FF3B3B', color: '#ffffff', borderColor: '#FF3B3B' }}
className="group inline-flex items-center gap-3 px-10 py-5 rounded-full
  text-[11px] font-bold tracking-[0.24em] uppercase border
  transition-all duration-300 ease-out hover:shadow-[0_0_32px_rgba(255,59,59,0.28)]"
```

**Why:** Design system was formally locked in March 2026. All page redesigns must conform to these exact tokens to maintain brand coherence.

**How to apply:** Treat these as immutable design primitives. Do not deviate unless the user explicitly requests a token change.
