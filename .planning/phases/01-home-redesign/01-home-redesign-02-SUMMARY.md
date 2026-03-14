---
phase: 01-home-redesign
plan: 02
subsystem: ui
tags: [react, typescript, i18n, tailwind, gsap]

# Dependency graph
requires:
  - phase: 01-home-redesign-01
    provides: "TrustSignals section, 4th serviceTrack (Performance Marketing), ctaButtonStart i18n key"
provides:
  - "HowWeWork 4-step section (Architecture, Build, Deploy, Scale) in Home.tsx"
  - "howWeWork i18n keys in all three locales (en/fr/ar)"
  - "Services grid updated to md:grid-cols-2 lg:grid-cols-4 for 4 cards"
  - "Stats LazySection has id='stats' for DOM identification"
  - "METHOD LazySection removed from Home.tsx"
affects:
  - 01-home-redesign-03
  - home-page-verification

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "Memo component defined above Home function with explicit props interface — no closure over Home locals"
    - "Section i18n keys nested under copy.home.[sectionName] with label/headline/items shape"

key-files:
  created: []
  modified:
    - src/pages/Home.tsx
    - src/i18n.tsx

key-decisions:
  - "HowWeWork defined as memo component above Home with explicit props — matches TrustSignals pattern from plan 01-01"
  - "METHOD section removed from JSX only — i18n keys preserved (methodTitle, methodCards, methodCopy) for other page reuse"
  - "HowWeWork inserted between Services and Projects to match the intended 9-section order"
  - "Services grid changed to md:grid-cols-2 lg:grid-cols-4 — graceful 2-col at tablet, 4-col at desktop"

patterns-established:
  - "Pattern: All section components defined above Home() as named memos with typed props interface"
  - "Pattern: Section layout uses border-t wrapper + max-w-7xl mx-auto padding container"

requirements-completed: [HOW-WE-WORK-4-STEPS, SERVICES-4-PILLARS]

# Metrics
duration: 15min
completed: 2026-03-14
---

# Phase 01 Plan 02: How We Work + Services 4-Pillar Summary

**4-step process section (Architecture → Build → Deploy → Scale) added with full i18n in en/fr/ar; Services grid updated to 4 columns; legacy METHOD section removed**

## Performance

- **Duration:** 15 min
- **Started:** 2026-03-14T22:10:00Z
- **Completed:** 2026-03-14T22:26:44Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments

- Added `howWeWork` i18n namespace to all three locales (EN, FR, AR) with 4 step objects each
- Built `HowWeWork` memo component with 4 numbered step cards including connector line and Scale badge on last card
- Inserted HowWeWork section between Services and Featured Projects (section 4 of 9)
- Fixed Services grid from `md:grid-cols-3` to `md:grid-cols-2 lg:grid-cols-4` so all 4 service pillars display
- Added `id="stats"` to Stats LazySection for DOM identification
- Removed METHOD LazySection block from Home.tsx (i18n keys untouched)

## Task Commits

Each task was committed atomically:

1. **Task 1: Add howWeWork i18n keys** - `ff80706` (feat)
2. **Task 2: Fix Services grid, add Stats id, remove METHOD, build HowWeWork** - `2ed652c` (feat)

## Files Created/Modified

- `src/i18n.tsx` - Added `howWeWork` object (label, headline, 4 steps) to `home` namespace in EN, FR, AR locales
- `src/pages/Home.tsx` - Added HowWeWork component + 4 targeted changes (Services grid, Stats id, METHOD removal, HowWeWork insertion)

## Decisions Made

- HowWeWork component follows the same pattern as TrustSignals from plan 01-01: defined above Home as a named memo with explicit typed props, no closure over Home locals.
- METHOD section removed from JSX only — the corresponding i18n keys (`methodTitle`, `methodCards`, `methodCopy`, `methodSteps`) are preserved because they may still be used on other pages (e.g., Services, About).
- Services grid at tablet breakpoint uses 2 columns (`md:grid-cols-2`) rather than 4 to avoid cramped cards on narrow viewports.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

- Plan 01-03 can proceed: HowWeWork section is in place, Services shows 4 pillars, HOME has correct section order
- The `ctaButton` key is preserved in i18n for plan 01-03's dual-button Final CTA reuse
- Stats section is identifiable by `id="stats"` for any DOM-based verification

---
*Phase: 01-home-redesign*
*Completed: 2026-03-14*
