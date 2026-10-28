# Project State

## Decisions

### AD-001: Ponytail binds implementation for a11y-painel-tailwind
- **Date:** 2026-10-27
- **Decision:** Design, tasks e execute desta feature seguem `.cursor/rules/ponytail.mdc`: menor diff que cumpre a spec, reuso do que já existe, sem libs/wrappers novos, deletar CSS morto em vez de camadas extras.
- **Rationale:** User: "não esquece de aplicar o ponytail"

### AD-002: Vitest + Testing Library como base de testes do PI
- **Date:** 2026-10-27
- **Decision:** O projeto usa Vitest (jsdom) + Testing Library; scripts `test` / `test:run`. Nesta feature: harness + baseline do domínio `agendamento` + testes 1:1 dos ACs. E2e Playwright fora por enquanto.
- **Rationale:** User: "preciso que o projeto como todo tenha testes pois é um pi da faculdade e faz parte do escopo"

## Handoff

- Feature: `painel-abas-filtros` — **DONE**
- HEAD: `6124b9f` (proofs.md left dirty in `.specs/` at that SHA — gate pattern)
- Proofs: 15 pass; mutations 3/3 killed; `validate_verification` 0 errors
- Tests: `npx vitest run` — 39 passed
- Next: optional push (needs explicit go-ahead); browser walk of `/painel` when há sessão intérprete
