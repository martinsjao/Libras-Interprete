# Acessibilidade, painel intérprete e Tailwind Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, the walk, check_proofs, the Verifier and the screens sub-agent).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: `.specs/features/a11y-painel-tailwind/design.md`
**Status**: Approved
**Approved**: 2026-10-27 - user: "aprovado"
**Mutations**: 3
**Build**: `npm run build; npm run lint; npx vitest run`

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec - confirm before Execute. Guidelines found: none for testing (no jest/vitest config); strong defaults + user: testes no projeto todo (PI). Runner chosen: Vitest + Testing Library.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| Domain (`src/lib`) | unit | All branches for helpers touched; ADM filter/search/próximos 1:1 ACs; baseline dos helpers existentes de agendamento | `src/lib/*.test.ts` | `npx vitest run` |
| UI components (painel, carrossel, forms) | unit | Happy + empty/edge listados no spec; alts e landmarks assertáveis | `src/**/*.test.tsx` | `npx vitest run` |
| CSS / config | none | Grep/assert em teste de regressão de classes legadas (TW-01) | `src/lib/legacy-css.test.ts` | `npx vitest run` |
| Route e2e | none (nesta feature) | Deferido — PI ganha base unit/component; e2e depois se pedido | - | - |

## Gate Check Commands

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | Após tasks com unit | `npx vitest run` |
| Full | Após tasks de UI | `npx vitest run` |
| Build | Fim de fase / config | `npm run build; npm run lint; npx vitest run` |

---

## Execution Plan

Ordem total (uma seta = `Depends on` direto):

```
T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8 → T9 → T10 → T11 → T12
```

### Phase 1: Harness + baseline do domínio

```
T1 → T2 → T3
```

### Phase 2: Painel intérprete

```
T3 → T4 → T5
```

### Phase 3: A11y pontual

```
T5 → T6 → T7
```

### Phase 4: Tailwind + limpeza CSS

```
T7 → T8 → T9 → T10 → T11 → T12
```

---

## Task Breakdown

### T1: Scripts e dependências Vitest

**What**: Adicionar Vitest, jsdom, Testing Library e scripts `test` / `test:run` no package.json.
**Where**: `package.json`
**Depends on**: None
**Reuses**: stack Next já instalada; sem outras libs
**Requirement**: AD-002 (base de testes do PI)

**Done when**:

- [x] DevDeps: `vitest`, `@vitest/coverage-v8` opcional não — só `vitest`, `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`
- [x] Scripts: `"test": "vitest"`, `"test:run": "vitest run"` (+ `--passWithNoTests` até haver testes)
- [x] `npm install` conclui

**Tests**: none
**Gate**: build
**Status**: ✅ Complete (`6464bb9`)

---

### T2: Config Vitest

**What**: Criar `vitest.config.ts` com environment jsdom, alias `@`, setup de jest-dom.
**Where**: `vitest.config.ts`
**Depends on**: T1
**Reuses**: paths de `tsconfig.json` (`@/*` → `./*`)
**Requirement**: AD-002

**Done when**:

- [x] `vitest.config.ts` com `environment: 'jsdom'`, resolve alias `@`
- [x] `src/test/setup.ts` importa `@testing-library/jest-dom/vitest`
- [x] `npx vitest run` sobe (0 tests ok)

**Tests**: none
**Gate**: quick

---

### T3: Baseline unit dos helpers de agendamento

**What**: Cobrir helpers já existentes em `agendamento.ts` (PI: projeto tem testes no domínio).
**Where**: `src/lib/agendamento.test.ts`
**Depends on**: T2
**Reuses**: funções exportadas de `src/lib/agendamento.ts` (somente leituras)
**Requirement**: AD-002

**Done when**:

- [x] Testes para `rotuloTipo`, `formatarTelefone`, `intervaloValido`, `intervalosConflitam`, `hojeISO` (ou equivalentes exportados)
- [x] Gate quick passa

**Tests**: unit
**Gate**: quick
**Status**: ✅ Complete

---

### T4: Funções puras de filtro/próximos da agenda

**What**: Implementar `filtrarAgenda` e `proximosDe` (ou nomes equivalentes) e testes 1:1 ADM.
**Where**: `src/lib/agendamento.ts`
**Depends on**: T3
**Reuses**: `hojeISO`, tipo `ItemAgendamento` (import type se preciso)
**Requirement**: ADM-02, ADM-03, ADM-04, ADM-05, ADM-01

**Done when**:

- [ ] `filtrarAgenda(itens, filtro, busca)` com filtro `'hoje' | 'proximos' | 'todos'` e busca case-insensitive em nome/email
- [ ] `proximosDe(itens, hoje)` retorna `data >= hoje`
- [ ] Testes cobrem filtros, busca, lista vazia, busca sem match
- [ ] Gate quick passa

**Tests**: unit
**Gate**: quick

---

### T5: UI do PainelAdmin (próximos, filtros, busca, vazios)

**What**: Ligar filtros/busca/seção Próximos no painel; totais no conjunto completo.
**Where**: `src/components/painelAdmin.tsx`
**Depends on**: T4
**Reuses**: `ListaAgendamentos`, `Empty`, `Card`, `filtrarAgenda`, `proximosDe`, `hojeISO`
**Requirement**: ADM-01, ADM-02, ADM-03, ADM-04, ADM-05, ADM-06, ADM-07

**Done when**:

- [ ] Seção "Próximos" distinta; filtros Hoje/Próximos/Todos; campo busca
- [ ] Totais ignoram filtro/busca
- [ ] Estado vazio quando filtro/busca zera
- [ ] `src/components/painelAdmin.test.tsx` cobre filtro e busca básicos
- [ ] Gate full passa

**Tests**: unit
**Gate**: full

---

### T6: Alts descritivos no carrossel

**What**: Usar `slide.alt` no `<Image>`; live anuncia o alt.
**Where**: `src/components/carrosselImagens.tsx`
**Depends on**: T5
**Reuses**: `slidesCarrossel` / `SlideCarrossel.alt`
**Requirement**: A11Y-03, A11Y-07

**Done when**:

- [ ] Nenhuma imagem do carrossel com `alt=""`
- [ ] `alt` = texto de `carrossel.ts`
- [ ] `src/components/carrosselImagens.test.tsx` asserta alt descritivo no slide
- [ ] Gate quick passa

**Tests**: unit
**Gate**: quick

---

### T7: Hierarquia de headings na AreaLogada

**What**: Marca no header deixa de ser `h1`; título da página passa a ser o único `h1`; remover `logo-icon` legado.
**Where**: `src/components/areaLogada.tsx`
**Depends on**: T6
**Reuses**: layout atual
**Requirement**: A11Y-01, A11Y-02, TW-01

**Done when**:

- [ ] Logo/marca não usa `h1`
- [ ] `{titulo}` é `h1`
- [ ] Landmarks `header`/`nav`/`main` mantidos
- [ ] Sem classe `logo-icon` / `logo` de estilo legado
- [ ] Teste RTL conta um `h1` com o título
- [ ] Gate quick passa

**Tests**: unit
**Gate**: quick

---

### T8: Entrar — Tailwind + alerta acessível

**What**: Remover classes legadas do formulário de entrar; erro com `role="alert"`; equivalentes Tailwind/shadcn.
**Where**: `src/app/entrar/formulario.tsx`
**Depends on**: T7
**Reuses**: `Button`, `Input`, `Field` shadcn se já no repo
**Requirement**: TW-01, TW-02, A11Y-05, A11Y-06

**Done when**:

- [ ] Sem `auth-shell`, `auth-main`, `auth-card`, `form-group`, `btn-primary`, `form-feedback`, `logo-icon`
- [ ] Labels nos campos; erro com `role="alert"`
- [ ] Teste mínimo de presença de labels + role alert quando há erro (ou assert de estrutura)
- [ ] Gate full passa

**Tests**: unit
**Gate**: full

---

### T9: Cadastro — Tailwind + alerta acessível

**What**: Mesmo padrão do entrar no cadastro.
**Where**: `src/app/cadastro/formulario.tsx`
**Depends on**: T8
**Reuses**: padrão visual de T8
**Requirement**: TW-01, TW-02, A11Y-05, A11Y-06

**Done when**:

- [ ] Classes legadas removidas; labels; erro `role="alert"`
- [ ] Teste mínimo espelhando T8
- [ ] Gate full passa

**Tests**: unit
**Gate**: full

---

### T10: Contato — Tailwind

**What**: Migrar `formularioContato` de classes legadas para Tailwind/shadcn.
**Where**: `src/components/formularioContato.tsx`
**Depends on**: T9
**Reuses**: padrão Field/Button
**Requirement**: TW-01, TW-02, A11Y-05

**Done when**:

- [ ] Sem `form-group` / `btn-primary` / `form-feedback`
- [ ] Labels associados; feedback de sucesso perceptível
- [ ] Teste mínimo de labels
- [ ] Gate full passa

**Tests**: unit
**Gate**: full

---

### T11: ThemeToggle sem classe CSS legada

**What**: Trocar `className="theme-toggle"` por utilitários Tailwind (ou `Button` shadcn).
**Where**: `src/components/themeToggle.tsx`
**Depends on**: T10
**Reuses**: estilo visual aproximado ao atual
**Requirement**: TW-01

**Done when**:

- [ ] Sem classe `theme-toggle`
- [ ] `aria-label` mantido
- [ ] Gate quick passa (teste opcional trivial — pode ser coberto pelo grep T12)

**Tests**: none
**Gate**: quick

---

### T12: Purgar CSS morto e travar regressão de classes legadas

**What**: Remover regras órfãs em `globals.css`; teste que falha se classes TW-01 reaparecerem no TSX.
**Where**: `src/app/globals.css`
**Depends on**: T11
**Reuses**: tokens `:root` / `.dark` / `@theme` / base shadcn
**Requirement**: TW-01, TW-03

**Done when**:

- [ ] Regras de `auth-*`, `form-group`, `btn-primary`, `theme-toggle`, hero/services legado não usadas removidas
- [ ] Tokens preservados
- [ ] `src/lib/legacy-css.test.ts` grepa `src/**/*.{tsx,ts}` e falha se achar a lista TW-01
- [ ] Gate build passa

**Tests**: unit
**Gate**: build

---

## Checks

**C1** - Cada rota de página tem exatamente um `h1` (área logada: título, não a marca) (A11Y-01, AC 1)
Proof: `npx vitest run src/components/areaLogada.test.tsx -t "um h1"`

**C2** - Landmarks header/nav/main presentes na AreaLogada (A11Y-02, AC 2)
Proof: `npx vitest run src/components/areaLogada.test.tsx -t "landmarks"`

**C3** - Imagem do carrossel usa alt descritivo de `carrossel.ts` (A11Y-03, AC 3)
Proof: `npx vitest run src/components/carrosselImagens.test.tsx -t "alt descritivo"`

**C4** - Ícones decorativos com aria-hidden permanecem nos componentes tocados (A11Y-04, AC 4)
Proof: `npx vitest run src/components/areaLogada.test.tsx -t "aria-hidden"`

**C5** - Campos de entrar têm label associado (A11Y-05, AC 5)
Proof: `npx vitest run src/app/entrar/formulario.test.tsx -t "label"`

**C6** - Erro de entrar expõe role alert (A11Y-06, AC 6)
Proof: `npx vitest run src/app/entrar/formulario.test.tsx -t "alert"`

**C7** - Seção Próximos lista só data >= hoje (ADM-01, AC 1)
Proof: `npx vitest run src/lib/agendamento.test.ts -t "proximosDe"`

**C8** - Filtro Hoje restringe à data de hoje (ADM-02, AC 2)
Proof: `npx vitest run src/lib/agendamento.test.ts -t "filtro hoje"`

**C9** - Filtro Próximos restringe a data >= hoje (ADM-03, AC 3)
Proof: `npx vitest run src/lib/agendamento.test.ts -t "filtro proximos"`

**C10** - Filtro Todos retorna todos (ADM-04, AC 4)
Proof: `npx vitest run src/lib/agendamento.test.ts -t "filtro todos"`

**C11** - Busca filtra por nome ou e-mail case-insensitive (ADM-05, AC 5)
Proof: `npx vitest run src/lib/agendamento.test.ts -t "busca"`

**C12** - Lista vazia após filtro/busca mostra empty state na UI (ADM-06, AC 6)
Proof: `npx vitest run src/components/painelAdmin.test.tsx -t "vazio"`

**C13** - Totais usam conjunto completo (ADM-07, AC 7)
Proof: `npx vitest run src/components/painelAdmin.test.tsx -t "totais"`

**C14** - Nenhuma classe legada TW-01 em src TS/TSX (TW-01, AC 1)
Proof: `npx vitest run src/lib/legacy-css.test.ts -t "classes legadas"`

**C15** - Entrar renderiza sem classes auth-* / form-group (TW-02, AC 2)
Proof: `npx vitest run src/app/entrar/formulario.test.tsx -t "sem classes legadas"`

**C16** - globals.css preserva tokens e remove blocos órfãos listados (TW-03, AC 3)
Proof: `npx vitest run src/lib/legacy-css.test.ts -t "globals tokens"`

**C17** - aria-live do carrossel inclui o alt do slide ativo (A11Y-07, P2 AC 1)
Proof: `npx vitest run src/components/carrosselImagens.test.tsx -t "aria-live"`

**Build**: `npm run build; npm run lint; npx vitest run`
**Mutations**: 3

---

## Handoff

**Dispatched:** Batch A (phases 1–3, T1–T7) — T1 done by orchestrator after lint/vitest unblock; resumed for T2–T7
