# Painel abas e filtros Context

**Gathered:** 2026-10-27
**Spec:** `.specs/features/painel-abas-filtros/spec.md`
**Status:** Ready for design

---

## Feature Boundary

Reorganizar o painel do intérprete (`/painel`) em duas abas — Agenda e Analítico — com filtros globais colapsáveis acima da listagem na aba Agenda. Sem novas APIs, ações de gestão ou mudança de regras de filtro/busca já existentes.

---

## Implementation Decisions

### Conteúdo das abas

- **Agenda:** filtros colapsáveis + bloco "Próximos" + listagem da agenda (filtrada/buscada)
- **Analítico:** cards KPI (Agendamentos, Clientes, Próximos) + tabela de clientes
- User: "1ok"

### Aba padrão

- Ao abrir `/painel`, a aba ativa é **Agenda**
- User: "2-agenda"

### Estado dos filtros

- Painel de filtros **aberto por padrão**, com controle para recolher/expandir
- User: "3 abertos"

### Rótulos

- Abas: **Agenda** e **Analítico**
- User: "4 ok"

### Agent's Discretion

- Mecanismo visual do colapso (botão + painel vs. outro padrão shadcn já no repo)
- Ordem interna na aba Agenda: filtros → Próximos → listagem (recomendação alinhada ao pedido)

### Declined / Undiscussed Gray Areas → Assumptions

- Persistência de aba/filtro na URL: não — estado só no cliente (session da página)
- Filtros não alteram totais dos KPIs (já definido em a11y-painel-tailwind ADM-07)

---

## Specific References

- Pedido: duas abas; filtros em div separada com ampliar/diminuir tipo "global filters"; abaixo a listagem; na outra aba dados analíticos

---

## Deferred Ideas

- Ações de confirmar/cancelar agendamento (fora do escopo anterior e deste)
- Novos gráficos ou métricas além dos cards e tabela de clientes já existentes
