---
phase: 01-home-redesign
plan: 01
subsystem: ui
tags: [react, typescript, i18n, gsap, tailwind, trust-signals, project-cards]

# Dependency graph
requires: []
provides:
  - TrustSignals section component (section 2 of 9) inserted between Hero and Services
  - ProjectCard upgraded with per-card result stat badge (hover-reveal)
  - Hero primary CTA label changed from "Book a Diagnostic" to "Start a Project"
  - i18n keys: ctaButtonStart, projectsSectionTitle, viewAllLabel, trustSignals (en/fr/ar)
  - serviceTracks extended from 3 to 4 entries (Performance Marketing added) in en/fr/ar
affects:
  - 01-02 (Services section uses serviceTracks array — now has 4 entries)
  - 01-03 (secondary CTA uses ctaButton key which is untouched)

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "TrustSignals is an external memo component receiving all data as props (no closure over Home locals)"
    - "LazySection wraps TrustSignals for scroll-reveal — no internal GSAP needed"
    - "Project result stats use Tailwind group-hover opacity transition (opacity-0 -> opacity-100)"

key-files:
  created: []
  modified:
    - src/i18n.tsx
    - src/pages/Home.tsx

key-decisions:
  - "TrustSignals defined above Home function with explicit props interface — cannot close over Home locals"
  - "isDark kept in TrustSignalsProps interface for forward-compatibility; implementation uses P palette object"
  - "ctaButton key preserved untouched for reuse in plan 01-03 secondary CTA"
  - "4th serviceTrack (Performance Marketing) added in Task 1 to unblock plan 02"

patterns-established:
  - "All user-facing copy sourced from i18n — no hardcoded strings in JSX"
  - "New sections always wrapped in LazySection for scroll-reveal; no manual GSAP inside"

requirements-completed: [TRUST-SIGNALS, PROJECT-CARDS-RESULTS]

# Metrics
duration: 25min
completed: 2026-03-14
---

# Phase 01 Plan 01: Add Trust Signals section and upgrade ProjectCard with result metrics Summary

**TrustSignals section (6 muted client names + 5 industry pills) inserted between Hero and Services; ProjectCard shows hover-reveal result stat; Hero primary CTA uses 'Start a Project' i18n key; Projects section title and view-all link sourced from i18n in all 3 locales**

## Performance

- **Duration:** ~25 min
- **Started:** 2026-03-14T00:00:00Z
- **Completed:** 2026-03-14T00:25:00Z
- **Tasks:** 2
- **Files modified:** 2

## Accomplishments
- Added `trustSignals`, `ctaButtonStart`, `projectsSectionTitle`, `viewAllLabel` i18n keys to EN/FR/AR
- Extended `serviceTracks` array to 4 entries (Performance Marketing) in all 3 locales
- Built `TrustSignals` memo component with 6 client name logos, 5 industry pill tags, scroll-reveal via LazySection
- Upgraded `ProjectCard` to render result stat on hover with fade transition
- Fixed Hero primary CTA to use `copy.home.ctaButtonStart` ('Start a Project')
- Replaced hardcoded 'Selected Projects' and 'View all' with i18n keys in Projects section

## Task Commits

Each task was committed atomically:

1. **Task 1: Add i18n keys and extend project data** - `484ae61` (feat)
2. **Task 2: Build TrustSignals, upgrade ProjectCard, fix Hero CTA, wire Projects i18n** - `d089cdd` (feat)
3. **Lint fix: suppress unused isDark param in TrustSignals** - `5cda6f6` (fix)

## Files Created/Modified
- `src/i18n.tsx` - Added ctaButtonStart, projectsSectionTitle, viewAllLabel, trustSignals keys in en/fr/ar; added 4th serviceTrack (Performance Marketing) in all locales
- `src/pages/Home.tsx` - TrustSignals component, ProjectCard result badge, Hero CTA key swap, Projects i18n wiring

## Decisions Made
- `isDark` kept in `TrustSignalsProps` interface for forward-compatibility (plan spec requirement), but the component uses the `P` palette object for all styling — no direct use of `isDark` in JSX.
- `ctaButton` key left untouched so plan 01-03 can reuse it for the secondary CTA button.
- 4th serviceTrack added to i18n in Task 1 to pre-empt a separate i18n pass in plan 02.

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript unused variable lint error for `isDark` in TrustSignals**
- **Found during:** Task 2 (post-build lint check)
- **Issue:** `isDark` was declared in destructuring but not used in JSX body (P palette object used instead), causing `@typescript-eslint/no-unused-vars` error
- **Fix:** Added `// eslint-disable-next-line @typescript-eslint/no-unused-vars` directive above component; kept `isDark: _isDark` rename as the suppression target
- **Files modified:** src/pages/Home.tsx
- **Verification:** `npm run lint` shows no new errors in Home.tsx
- **Committed in:** `5cda6f6`

---

**Total deviations:** 1 auto-fixed (Rule 1 - Bug/lint)
**Impact on plan:** Minimal. The lint suppression preserves the interface contract from the plan spec while keeping the build clean.

## Issues Encountered
None beyond the TypeScript lint error documented above.

## User Setup Required
None - no external service configuration required.

## Next Phase Readiness
- Plan 01-02 can proceed: serviceTracks now has 4 entries (Performance Marketing added), so the Services grid will render 4 cards as plan 02 expects
- Plan 01-03 can proceed: ctaButton key is untouched and available for secondary CTA wiring
- Trust Signals section is live and scroll-reveals correctly via LazySection
- All copy is sourced from i18n — no hardcoded strings remain in the sections modified by this plan

---
*Phase: 01-home-redesign*
*Completed: 2026-03-14*
