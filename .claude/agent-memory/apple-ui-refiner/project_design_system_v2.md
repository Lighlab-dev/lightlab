---
name: Lightlab Design System v2
description: Full palette, accent colors, CSS classes, and visual identity tokens established in the v2 design-system upgrade
type: project
---

The design system was upgraded to a Stripe/Linear/Vercel-caliber visual identity in March 2026.

**Why:** The studio needed to feel capable of selling $20k–$200k+ technology engagements. The previous warm-neutral palette was elevated with a precise red accent and gold metric highlight.

**How to apply:** Always use these tokens when touching any of the 7 core files. Never revert to the old hex values.

## Palette tokens

| Token | Tailwind class / value |
|---|---|
| bg-light | `bg-[#EDE8DF]` |
| bg-dark | `bg-[#090909]` |
| text-primary | `text-[#0F0F0F]` |
| text-stone | `text-[#4A4540]` |
| text-muted | `text-[#8A8580]` |
| border | `border-[#D8D3C8]` |
| card-bg-light | `bg-[#F7F4EF]` |
| accent-red | `#FF3B3B` (hover: `#E02E2E`) |
| gold | `#C6A96B` |

## Accent red usage rules
`#FF3B3B` is used ONLY on:
- Primary CTA buttons (bg + border)
- Nav link active/hover underlines
- Service card icon backgrounds
- Result/metric pill borders + text
- Timeline progress line
- Pillar dots, FAQ open indicators
- Stats section counter numbers
- Testimonial stars + ghost quote mark
- Scroll progress bar
- Hero tag dot + thin rule
- Ticker: every 3rd item gets 60% opacity red

## Gold usage rules
`#C6A96B` is used ONLY on:
- Testimonial author names
- Footer "Lightlab Studio" copyright text

## CSS classes (defined in index.css)
- `theme-surface` — page bg + matching text, light/dark aware
- `theme-outline` — bordered button, light/dark aware
- `theme-solid` — always red (`#FF3B3B`) background, white text
- `theme-hero-overlay` — intro logo animation backdrop
- `theme-menu-overlay` — mobile menu backdrop
- `nav-over-hero` — transparent navbar when over hero
- `navbar-scrolled` — backdrop-blur + bg at 92% opacity, light/dark aware
- `font-display` — Playfair Display, Georgia fallback
