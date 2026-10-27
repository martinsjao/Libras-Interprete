# Acessibilidade, painel intérprete e Tailwind Context

**Gathered:** 2026-10-27
**Spec:** `.specs/features/a11y-painel-tailwind/spec.md`
**Status:** Ready for design

---

## Feature Boundary

Tornar as telas adequadas a acessibilidade (HTML semântico + textos alternativos descritivos), melhorar a UX de leitura do painel do intérprete (sem ações de gestão), e substituir classes CSS legadas ainda usadas por utilitários Tailwind / componentes shadcn, limpando regras mortas em `globals.css` e mantendo tokens.

---

## Implementation Decisions

### Escopo de acessibilidade

- Cobrir todas as telas: home, entrar, cadastro, conta (cliente), painel (intérprete)
- Alvo: HTML/ARIA alinhado a WCAG 2.2 AA (sem auditoria formal axe nesta entrega)
- Hierarquia de headings correta; labels em controles; ícones decorativos com `aria-hidden`

### Painel do intérprete

- Melhoria de UX/leitura: próximos em destaque, filtros (hoje / próximos / todos), busca por cliente/e-mail, estados vazios melhores
- Sem novos fluxos: confirmar, cancelar, editar status, contato — fora de escopo

### Carrossel / textos alternativos

- Imagens do carrossel **precisam** de textos descritivos (usar os `alt` de `src/data/carrossel.ts` no `<Image>`, não `alt=""`)

### Limpeza CSS → Tailwind

- Migrar apenas classes ainda referenciadas no TSX para Tailwind / shadcn
- Apagar regras mortas em `globals.css`
- Manter tokens `:root` / `@theme`
- Equivalência visual nas telas de auth — sem redesenho além do necessário

### Testes do projeto (PI)

- Vitest + Testing Library (jsdom); scripts `npm test` / `npm run test:run`
- Harness nesta feature + baseline dos helpers de `agendamento` + cobertura dos ACs
- E2e (Playwright) deferido — AD-002
- User: "preciso que o projeto como todo tenha testes pois é um pi da faculdade"

### Ponytail (obrigatório — `.cursor/rules/ponytail.mdc`)

- Menor diff que fecha a spec: reusar `PainelAdmin`, `ListaAgendamentos`, `Empty`, shadcn e tokens existentes
- Sem wrappers, hooks genéricos, libs novas ou “por enquanto”
- Deletar CSS morto > adicionar camada; um teste pequeno só onde a lógica for não trivial (filtro/busca do painel, alt do carrossel)
- Nunca cortar: a11y pedida, validação já existente, o que a spec exige
- Em Design/Tasks/Execute: se duas soluções passam no critério, fica a mais curta

### Agent's Discretion

- Ordem dos blocos no painel, desde que ADM-* passem
- `Button`/`Input` shadcn vs utilitário Tailwind na migração de auth/contato — o que for o menor patch local

### Declined / Undiscussed Gray Areas → Assumptions

- Skip link global: não pedido; fora desta entrega
- Auditoria axe/Lighthouse: fora; testes assertam estrutura/alts no código
- Extrair “design system” ou refatorar home já em Tailwind: fora (ponytail)

---

## Specific References

- User: "preciso que ... as telas sejam adequadas a acessibilidade com html semantico e textos alternativos, além disso quero melhorar a tela de admin(interprete)"
- User: "1 - A, 2-a 3-a" → a11y todas as telas; UX admin com filtros/busca; sem ações novas
- User: "quero que pare de usar todas essas classes já que já usamos o tailwind"
- User: "a- precisa ter texto descritivos" / "b - b recomendação" → alts descritivos no carrossel; limpeza CSS conforme recomendação
- User: "não esquece de aplicar o ponytail" → `.cursor/rules/ponytail.mdc` vincula Design/Execute (AD-001)

---

## Deferred Ideas

- Ações de gestão no painel (status, cancelar, editar)
- Auditoria formal WCAG / integração axe no CI
- Skip link e foco avançado em modais além do menu mobile já existente
- Refatoração estética da home além de a11y pontual