# a11y-painel-tailwind verification

**Verdict**: PASS
**Mutations**: 3 - probed C7 (proximosDe bound), C11 (busca email), C13 (totais vs filtro) — all killed at 7fae78c
**Proofs**: `proofs.md` at d9034eb (gate green; `.specs/proofs.md` may stay dirty vs last docs commit — intentional)
**Verifier**: independent sub-agent (author != verifier)

## Findings

| Finding | Evidence | Fix | Closed |
| --- | --- | --- | --- |
| C4 asserts any `aria-hidden`, not that the decorative Lucide mark icon is hidden (A11Y-04) | `areaLogada.test.tsx` - `expect(hidden.length).toBeGreaterThan(0)`; removing `aria-hidden` from `Handshake` leaves C4 green (Separator still supplies a match) | Assert `Handshake` (or the brand SVG) has `aria-hidden="true"` | 7fae78c — C4 `areaLogada.test.tsx -t "aria-hidden"` |
| C16 asserts tokens exist, not that orphan layout rules were removed (TW-03) | `legacy-css.test.ts` - only `:root` / `--primary` / `.dark` / `@theme`; re-adding `.auth-shell { … }` to `globals.css` leaves C16 (and C14) green | Assert banned legacy selectors are absent from `globals.css` (or that listed orphan blocks are gone) | 7fae78c — C16 `legacy-css.test.ts -t "globals tokens"` |
| C12 proves only the busca-empty path, not filtro Hoje empty (ADM-06 + edge) | `painelAdmin.test.tsx` types `inexistente` only; no click on Hoje with a day that has zero items | Assert empty copy after filtro Hoje with fixtures that have no today row | 7fae78c — C12 + `painelAdmin.test.tsx -t "vazio quando filtro Hoje"` |
