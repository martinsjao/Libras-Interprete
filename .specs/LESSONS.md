# LESSONS - auto-maintained by scripts/lessons.py

> Machine-owned. Do NOT hand-edit. Changes are overwritten on the next `lessons.py` write.
> Canonical state lives in `.specs/lessons.json`. Edit lessons only via the script.
> promote_threshold=2 distinct features · window_days=45 · quarantine_threshold=2

## Confirmed (load these at Plan/Checks)

Corroborated across multiple features. Safe to apply as guidance.

_none_

## Candidates (under observation - do NOT load as guidance yet)

Seen once or not yet corroborated. Tracked, not trusted.

### L-001 - Assert the specific decorative icon has aria-hidden, not that any aria-hidden node exists
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `a11y` · harmful: 0
- features: a11y-painel-tailwind
- evidence: C4 areaLogada.test.tsx (a11y)
- last seen: 2026-10-27T23:39:30Z

### L-002 - When purging CSS, assert banned selectors are absent from the stylesheet, not only that design tokens remain
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `css` · harmful: 0
- features: a11y-painel-tailwind
- evidence: C16 legacy-css.test.ts (css)
- last seen: 2026-10-27T23:39:30Z

### L-003 - Empty-state filter criteria need a case per filter mode that can clear the list, not only search
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `painel` · harmful: 0
- features: a11y-painel-tailwind
- evidence: C12 painelAdmin.test.tsx (painel)
- last seen: 2026-10-27T23:39:30Z

## Quarantined (failed when applied - ignore)

A confirmed lesson that recurred alongside failure. Kept for the maintainer to review.

_none_
