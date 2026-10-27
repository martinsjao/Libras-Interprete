# Painel abas e filtros Tasks

## Execution Protocol (MANDATORY -- do not skip)

Implement these tasks with the `tlc-spec-driven` skill: **activate it by name and follow its Execute flow and Critical Rules.** Do not search for skill files by filesystem path. The skill is the source of truth for the full flow (per-task cycle, sub-agent delegation, the walk, check_proofs, the Verifier and the screens sub-agent).

**If the skill cannot be activated, STOP and tell the user - do not proceed without it.**

---

**Design**: none - reorganização de `PainelAdmin`; reusa `Tabs` de `contaCliente` (Design skipped)
**Status**: Done
**Approved**: 2026-10-27 - user: "aprovado"
**Mutations**: 3
**Build**: `npm run build; npm run lint; npx vitest run`

---

## Test Coverage Matrix

> Generated from codebase, project guidelines, and spec - confirm before Execute. Guidelines found: AD-002 (Vitest + Testing Library); `.specs/features/a11y-painel-tailwind/tasks.md` como piso de estilo.

| Code Layer | Required Test Type | Coverage Expectation | Location Pattern | Run Command |
| ---------- | ------------------ | -------------------- | ---------------- | ----------- |
| UI (`PainelAdmin`) | unit | 1:1 aos ACs TAB/FIL + edges de vazio já existentes adaptados às abas | `src/components/painelAdmin.test.tsx` | `npx vitest run` |
| Domain (`filtrarAgenda` etc.) | unit (já existe) | FIL-06 reusa cobertura ADM em `agendamento.test.ts`; sem reimplementar | `src/lib/agendamento.test.ts` | `npx vitest run` |
| Route e2e | none | Deferido (AD-002) | - | - |

## Gate Check Commands

| Gate Level | When to Use | Command |
| ---------- | ----------- | ------- |
| Quick | Após cada task de UI | `npx vitest run src/components/painelAdmin.test.tsx` |
| Full | Após tasks que tocam domínio + UI | `npx vitest run` |
| Build | Fim da feature | `npm run build; npm run lint; npx vitest run` |

---

## Execution Plan

```
T1 → T2 → T3
```

### Phase 1: Abas + filtros colapsáveis

```
T1 → T2 → T3
```

---

## Task Breakdown

### T1: Abas Agenda e Analítico

**What**: Envolver o conteúdo de `PainelAdmin` em `Tabs` (padrão `contaCliente`): default `agenda`; aba Analítico com KPIs + clientes; aba Agenda com Próximos + listagem (filtros ainda no lugar atual nesta task).
**Where**: `src/components/painelAdmin.tsx`
**Depends on**: None
**Reuses**: `@/components/ui/tabs`; layout cards/tabelas existentes
**Requirement**: TAB-01, TAB-02, TAB-03, TAB-04

**Done when**:

- [x] `defaultValue="agenda"`; triggers "Agenda" e "Analítico"
- [x] Analítico: cards Agendamentos/Clientes/Próximos + tabela clientes; sem listagem operacional nem filtros
- [x] Agenda: seção Próximos + agenda; sem cards KPI nem tabela clientes
- [x] Testes: aba default Agenda; rótulos; conteúdo por aba
- [x] Gate quick passa

**Tests**: unit
**Gate**: quick
**Commit**: `feat(painel): abas Agenda e Analítico`
**Status**: ✅ Complete

---

### T2: Bloco de filtros colapsáveis na Agenda

**What**: Extrair filtro + busca para um bloco distinto acima de Próximos/listagem, expandido por padrão, com controle acessível para recolher/expandir.
**Where**: `src/components/painelAdmin.tsx`
**Depends on**: T1
**Reuses**: `Button`, `Input`, `Label`, grupo `aria-label="Filtro da agenda"` já existente
**Requirement**: FIL-01, FIL-02, FIL-03, FIL-04, FIL-05

**Done when**:

- [x] Bloco de filtros acima de Próximos e da listagem na aba Agenda
- [x] Expandido no load; recolher oculta controles e mantém Próximos/listagem; expandir restaura
- [x] Controle com nome acessível (expandir/recolher filtros)
- [x] Testes cobrem default expandido, recolher, expandir de novo
- [x] Gate quick passa

**Tests**: unit
**Gate**: quick
**Commit**: `feat(painel): filtros globais colapsáveis na Agenda`
**Status**: ✅ Complete

---

### T3: Estado entre abas, totais e regressões

**What**: Preservar filtro/busca ao trocar de aba; adaptar testes de totais/vazio para o novo layout (totais só visíveis no Analítico); garantir FIL-06/FIL-07.
**Where**: `src/components/painelAdmin.test.tsx`
**Depends on**: T2
**Reuses**: fixtures e helpers do próprio arquivo; `agendamento.test.ts` para FIL-06
**Requirement**: TAB-05, FIL-06, FIL-07

**Done when**:

- [x] Teste: escolhe filtro/busca na Agenda, vai a Analítico e volta — mesmos valores ativos e listagem coerente
- [x] Teste de totais abre Analítico (ou navega) e confirma conjunto completo após filtro na Agenda
- [x] Testes de vazio (busca/Hoje) ainda passam na aba Agenda
- [x] Gate full + build passam

**Tests**: unit
**Gate**: build
**Commit**: `test(painel): estado entre abas e totais no Analítico`
**Status**: ✅ Complete

---

## Checks

**C1** - Ao abrir o painel a aba Agenda está ativa (TAB-01, AC 1)
Proof: `npx vitest run src/components/painelAdmin.test.tsx -t "aba Agenda ativa"`

**C2** - Controles de aba com rótulos Agenda e Analítico (TAB-02, AC 2)
Proof: `npx vitest run src/components/painelAdmin.test.tsx -t "rótulos Agenda e Analítico"`

**C3** - Aba Analítico mostra KPIs e clientes e não mostra filtros/listagem da agenda (TAB-03, AC 3)
Proof: `npx vitest run src/components/painelAdmin.test.tsx -t "conteúdo Analítico"`

**C4** - Aba Agenda mostra filtros, Próximos e listagem e não mostra KPIs/clientes (TAB-04, AC 4)
Proof: `npx vitest run src/components/painelAdmin.test.tsx -t "conteúdo Agenda"`

**C5** - Filtro e busca persistem ao voltar de Analítico (TAB-05, AC 5)
Proof: `npx vitest run src/components/painelAdmin.test.tsx -t "preserva filtro"`

**C6** - Filtros ficam num bloco acima de Próximos e listagem na Agenda (FIL-01, AC 1)
Proof: `npx vitest run src/components/painelAdmin.test.tsx -t "filtros acima"`

**C7** - Bloco de filtros inicia expandido (FIL-02, AC 2)
Proof: `npx vitest run src/components/painelAdmin.test.tsx -t "filtros expandido"`

**C8** - Recolher oculta controles e mantém Próximos/listagem (FIL-03, AC 3)
Proof: `npx vitest run src/components/painelAdmin.test.tsx -t "recolher filtros"`

**C9** - Expandir de novo mostra controles (FIL-04, AC 4)
Proof: `npx vitest run src/components/painelAdmin.test.tsx -t "expandir filtros"`

**C10** - Controle de colapso tem nome acessível de expandir/recolher (FIL-05, AC 5)
Proof: `npx vitest run src/components/painelAdmin.test.tsx -t "nome acessível filtros"`

**C11** - Filtros Hoje/Próximos/Todos e busca batem com ADM (FIL-06, AC 6)
Proof: `npx vitest run src/lib/agendamento.test.ts -t "filtro|busca"`

**C12** - Totais no Analítico usam conjunto completo (FIL-07, AC 7)
Proof: `npx vitest run src/components/painelAdmin.test.tsx -t "totais"`

---

## Handoff

**Settled mid-build:** none
**Dispatched:** Verifier at HEAD f679a1f — returned (PASS, 3/3 mutations killed, no findings)
**Walked:**
- P1 abas `/painel`: não andado no browser (exige sessão intérprete); coberto por painelAdmin.test.tsx (aba default, conteúdo por aba, colapso de filtros, preserva filtro, totais no Analítico)
- P1 filtros: gestos Recolher/Expandir e filtro Hoje+busca assertados nos testes unitários do componente

---

## Phase Execution Map

```
Phase 1

Phase 1:  T1 ------→ T2 ------→ T3
```

≤3 tasks → Execute inline (sem sub-agentes de batch).
