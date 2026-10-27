# Painel: abas Agenda / Analítico e filtros colapsáveis Specification

**Approved**: 2026-10-27 - user: "aprovado"

## Problem Statement

O painel do intérprete empilha KPIs, próximos, clientes e agenda numa única rolagem, com filtros embutidos na card da agenda. O intérprete precisa separar operação do dia (agenda + filtros) de visão resumida (analítico), com filtros globais fáceis de recolher.

## Goals

- [ ] `/painel` expõe duas abas navegáveis: Agenda e Analítico
- [ ] Na Agenda, filtros ficam num bloco colapsável acima da listagem; comportamento Hoje/Próximos/Todos e busca permanece o já especificado
- [ ] No Analítico, cards KPI e tabela de clientes permanecem acessíveis sem a listagem operacional misturada

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Novas métricas / gráficos | Só reorganizar o que já existe |
| Novas APIs ou schema | Filtro/busca client-side já existentes |
| Confirmar / cancelar agendamento | Fora do escopo do produto nesta fase |
| Persistência de aba/filtro na URL | Estado de sessão da página basta |
| Redesign visual da marca | Só reorganização do painel |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Conteúdo Agenda | Filtros + Próximos + listagem filtrada | User: "1ok" | y |
| Conteúdo Analítico | Cards KPI + tabela clientes | User: "1ok" | y |
| Aba inicial | Agenda | User: "2-agenda" | y |
| Filtros ao carregar | Expandidos | User: "3 abertos" | y |
| Rótulos das abas | "Agenda" e "Analítico" | User: "4 ok" | y |
| Totais dos KPIs | Sempre sobre o conjunto completo carregado | Herança ADM-07 / a11y-painel-tailwind | y |
| Persistência URL | Não persistir aba nem filtros | Default de baixo risco; user não pediu | y |
| Estilo de implementação | Ponytail: reusar Tabs/shadcn existentes; menor diff | AD-001 + context | y |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: Duas abas no painel ⭐ MVP

**User Story**: Como intérprete, quero alternar entre Agenda e Analítico no painel, para separar a operação do dia do resumo numérico.

**Why P1**: Pedido central da feature.

**Acceptance Criteria** (each line is one EARS pattern):

1. WHEN o intérprete abre `/painel` THEN the system SHALL mostrar a aba "Agenda" como ativa.
2. The system SHALL expor controles de aba com os rótulos "Agenda" e "Analítico".
3. WHEN o intérprete seleciona a aba "Analítico" THEN the system SHALL mostrar os cards de totais (Agendamentos, Clientes, Próximos) e a tabela de clientes, e SHALL NÃO mostrar o bloco de filtros da agenda nem a listagem operacional da agenda.
4. WHEN o intérprete seleciona a aba "Agenda" THEN the system SHALL mostrar o bloco de filtros, a seção "Próximos" e a listagem da agenda, e SHALL NÃO mostrar os cards de totais nem a tabela de clientes.
5. WHILE a aba "Agenda" estiver ativa the system SHALL manter filtro e busca já escolhidos ao voltar de "Analítico" (estado client-side da sessão da página).

**Independent Test**: Renderizar `PainelAdmin` e assertar aba default, troca de conteúdo por aba e preservação de filtro/busca.

---

### P1: Filtros globais colapsáveis na Agenda ⭐ MVP

**User Story**: Como intérprete, quero filtros numa área separada acima da listagem, com controle para expandir ou recolher, para limpar a vista quando não preciso filtrar.

**Why P1**: Pedido explícito ("global filters" com ampliar/diminuir).

**Acceptance Criteria**:

1. WHILE a aba "Agenda" estiver ativa the system SHALL renderizar os controles de filtro (Hoje, Próximos, Todos) e a busca por nome/e-mail num bloco distinto acima da seção "Próximos" e da listagem.
2. WHEN o painel carrega com a aba "Agenda" THEN the system SHALL mostrar o bloco de filtros expandido.
3. WHEN o intérprete aciona o controle de recolher filtros THEN the system SHALL ocultar os controles de filtro e busca, mantendo visíveis a seção "Próximos" e a listagem.
4. WHEN o intérprete aciona o controle de expandir filtros (com o bloco recolhido) THEN the system SHALL voltar a mostrar os controles de filtro e busca.
5. The system SHALL expor no controle de expandir/recolher um nome acessível que indique a ação (expandir ou recolher filtros).
6. WHEN o intérprete escolhe "Hoje", "Próximos" ou "Todos", ou digita na busca THEN the system SHALL filtrar a listagem da agenda exatamente como em ADM-02..ADM-05 (hoje / data >= hoje / todos; busca case-insensitive em nome ou e-mail).
7. The system SHALL manter os totais dos cards na aba Analítico baseados no conjunto completo carregado (não no filtro/busca da Agenda).

**Independent Test**: Na aba Agenda, expandir/recolher; aplicar cada filtro e busca; na Analítico, assertar totais do conjunto completo.

---

## Edge Cases

- IF a listagem filtrada estiver vazia THEN the system SHALL mostrar o estado vazio já existente da agenda (sem tabela em branco sem explicação).
- IF não houver agendamentos futuros THEN the system SHALL mostrar estado vazio na seção "Próximos" na aba Agenda.
- IF não houver clientes THEN the system SHALL mostrar estado vazio na tabela de clientes na aba Analítico.
- WHILE o bloco de filtros estiver recolhido the system SHALL continuar aplicando o último filtro e busca à listagem.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| TAB-01 | P1: Duas abas | Execute | Verified |
| TAB-02 | P1: Duas abas | Execute | Verified |
| TAB-03 | P1: Duas abas | Execute | Verified |
| TAB-04 | P1: Duas abas | Execute | Verified |
| TAB-05 | P1: Duas abas | Execute | Verified |
| FIL-01 | P1: Filtros colapsáveis | Execute | Verified |
| FIL-02 | P1: Filtros colapsáveis | Execute | Verified |
| FIL-03 | P1: Filtros colapsáveis | Execute | Verified |
| FIL-04 | P1: Filtros colapsáveis | Execute | Verified |
| FIL-05 | P1: Filtros colapsáveis | Execute | Verified |
| FIL-06 | P1: Filtros colapsáveis | Execute | Verified |
| FIL-07 | P1: Filtros colapsáveis | Execute | Verified |

**Coverage:** 12 total, 0 mapped to tasks, 12 unmapped

---

## Differences from the source

N/A — nenhum capture binding nesta feature.

## Sources

- Pedido do usuário (chat 2026-10-27) — duas abas; filtros globais colapsáveis; listagem abaixo; analítico na outra aba
- `.specs/features/painel-abas-filtros/context.md` — decisões 1–4
- `.specs/features/a11y-painel-tailwind/spec.md` — comportamento de filtro/busca/próximos/totais a preservar (ADM-01..07)
- `.cursor/rules/ponytail.mdc` — menor diff; reuso

---

## Success Criteria

- [ ] Intérprete abre o painel na Agenda, recolhe filtros e ainda vê a listagem coerente com o último filtro
- [ ] Troca para Analítico mostra só KPIs + clientes; volta para Agenda com filtro/busca preservados
- [ ] Testes cobrem default de aba, colapso dos filtros e filtragem/totais
