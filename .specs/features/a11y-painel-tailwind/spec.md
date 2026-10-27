# Acessibilidade, painel intérprete e Tailwind Specification

**Approved**: 2026-10-27 - user: "aprovado"

## Problem Statement

As telas misturam HTML semântico incompleto (hierarquia de headings, alts do carrossel forçados a vazio) com classes CSS legadas ao lado do Tailwind/shadcn. O painel do intérprete só lista totais e tabelas, sem destacar próximos horários nem filtrar/buscar a agenda. Precisamos de acessibilidade consistente, um painel legível no dia a dia e estilos só via Tailwind/tokens.

## Goals

- [ ] Todas as rotas de UI usam landmarks/headings/labels/alts descritivos verificáveis por teste
- [ ] O intérprete filtra e busca a agenda e vê próximos em destaque sem sair do painel
- [ ] Nenhuma classe CSS de layout/componente legado permanece referenciada no TSX; `globals.css` só tokens + base shadcn/Tailwind

## Out of Scope

| Feature | Reason |
| ------- | ------ |
| Confirmar / cancelar / status de agendamento | Decisão do usuário: só leitura nesta entrega |
| Auditoria axe/Lighthouse no CI | Fora do escopo combinado |
| Skip link global | Não pedido; deferido |
| Redesign visual da marca / home | Home já em Tailwind; só a11y + limpeza residual |
| Novas APIs ou mudanças de schema | Filtro/busca no cliente sobre dados já carregados |

---

## Assumptions & Open Questions

| Assumption / decision | Chosen default | Rationale | Confirmed? |
| --------------------- | -------------- | --------- | ---------- |
| Cobertura a11y | Todas as telas; HTML/ARIA no espírito WCAG 2.2 AA | User: "1 - A" | y |
| Melhoria do painel | UX leitura: próximos, filtros hoje/próximos/todos, busca nome/e-mail | User: "2-a" | y |
| Ações de gestão no admin | Fora de escopo | User: "3-a" | y |
| Alts do carrossel | Textos descritivos de `carrossel.ts` no `<Image>` | User: "precisa ter texto descritivos" | y |
| Limpeza CSS | Migrar classes usadas → Tailwind/shadcn; apagar mortas; manter tokens | User: "b recomendação" | y |
| Filtro/busca do painel | Client-side sobre a lista já carregada em `/painel` | Sem API nova; dados já no SSR | y |
| Hierarquia do logo | Marca no header não é `h1`; o `h1` é o título da página (ou o hero na home) | Evita dois h1 e atende leitores de tela | y |
| Skip link | Não implementar nesta feature | Deferido no context | y |
| Estilo de implementação | Ponytail: menor diff completo; sem abstração/lib nova; delete > add | User: "não esquece de aplicar o ponytail" + AD-001 | y |
| Testes do PI | Vitest + Testing Library; harness + baseline domínio + ACs; sem e2e nesta feature | User: testes no projeto todo (PI) + AD-002 | y |

**Open questions:** none - all resolved or logged above.

---

## User Stories

### P1: HTML semântico e textos alternativos ⭐ MVP

**User Story**: Como visitante ou usuário logado, quero percorrer as páginas com estrutura semântica e imagens descritas, para que leitores de tela e teclado funcionem de forma previsível.

**Why P1**: Pedido explícito e pré-requisito de inclusão do produto.

**Acceptance Criteria** (each line is one EARS pattern):

1. The system SHALL expose exactly one `h1` visível por rota de página (home: título do hero; áreas logadas e auth: título da página, não a marca no header).
2. The system SHALL structure cada página pública e autenticada com landmarks `header`, `nav`, `main` e, na home, `footer`.
3. WHEN o carrossel da home renderiza um slide THEN the system SHALL definir o atributo `alt` da imagem com o texto descritivo não vazio correspondente em `src/data/carrossel.ts`.
4. The system SHALL marcar ícones puramente decorativos (Lucide sem rótulo próprio) com `aria-hidden="true"`.
5. WHEN um formulário (entrar, cadastro, contato, agendamento) renderiza um campo de entrada THEN the system SHALL associar um `label` (ou `aria-label` equivalente) ao controle.
6. IF uma mensagem de erro de formulário for exibida THEN the system SHALL torná-la perceptível a tecnologias assistivas (`role="alert"` ou `aria-live="assertive"`).

**Independent Test**: Abrir home/entrar/cadastro/conta/painel e verificar landmarks, um `h1`, alts do carrossel e labels via testes de renderização.

---

### P1: Painel do intérprete legível ⭐ MVP

**User Story**: Como intérprete, quero ver próximos horários em destaque e filtrar/buscar a agenda, para planejar o dia sem varrer a tabela inteira.

**Why P1**: Melhoria pedida do admin; valor imediato sem novas ações.

**Acceptance Criteria**:

1. WHEN o intérprete abre `/painel` com ao menos um agendamento com `data >= hoje` THEN the system SHALL listar esses itens em uma seção intitulada "Próximos" distinta da agenda completa.
2. WHEN o intérprete escolhe o filtro "Hoje" THEN the system SHALL mostrar apenas agendamentos cuja data é a data de hoje (fuso já usado por `hojeISO`).
3. WHEN o intérprete escolhe o filtro "Próximos" THEN the system SHALL mostrar apenas agendamentos com `data >= hoje`.
4. WHEN o intérprete escolhe o filtro "Todos" THEN the system SHALL mostrar todos os agendamentos carregados.
5. WHEN o intérprete digita na busca THEN the system SHALL filtrar a lista visível por correspondência case-insensitive no nome ou e-mail do cliente.
6. WHILE não houver clientes (ou a busca/filtro zerar a lista) the system SHALL mostrar um estado vazio com título e descrição, sem tabela vazia sem explicação.
7. The system SHALL manter os totais de Agendamentos, Clientes e Próximos baseados no conjunto completo carregado (não no filtro/busca atuais).

**Independent Test**: Com fixtures de agendamentos, aplicar cada filtro e busca e assertar os itens restantes e o bloco "Próximos".

---

### P1: Substituir classes CSS legadas por Tailwind ⭐ MVP

**User Story**: Como mantenedor, quero estilos via Tailwind/shadcn e tokens, para não manter um segundo sistema de classes em `globals.css`.

**Why P1**: Pedido explícito do usuário.

**Acceptance Criteria**:

1. The system SHALL não referenciar no código TSX/TS das telas as classes legadas: `auth-shell`, `auth-main`, `auth-card`, `auth-lead`, `auth-submit`, `auth-switch`, `form-group`, `form-feedback`, `btn-primary`, `logo-icon`, `logo` (como classe de estilo), `papel-fieldset`, `papel-option`, `theme-toggle` (classe CSS).
2. WHEN as telas de entrar, cadastro e contato forem renderizadas THEN the system SHALL obter o mesmo papel visual (layout centrado, campos empilhados, botão primário) via utilitários Tailwind e/ou componentes shadcn (`Button`, `Input`, `Field`, etc.).
3. The system SHALL remover de `globals.css` as regras de componentes/layout que não forem mais referenciadas, preservando `:root`, `.dark`, `@theme` e a base shadcn/Tailwind.

**Independent Test**: Grep/teste falha se alguma classe legado listada aparecer em `src/**/*.{tsx,ts}`; build passa após limpeza do CSS.

---

### P2: Anúncio do slide ativo do carrossel

**User Story**: Como usuário de leitor de tela, quero ouvir a descrição do slide atual ao navegar o carrossel.

**Why P2**: Complementa alts; `aria-live` já existe e deve refletir o `alt` descritivo.

**Acceptance Criteria**:

1. WHEN o índice do carrossel muda THEN the system SHALL anunciar via região `aria-live` o texto descritivo (`alt`) do slide ativo.

**Independent Test**: Após mudar o índice, o conteúdo da região live contém o `alt` do slide.

---

## Edge Cases

- IF a lista de slides do carrossel estiver vazia THEN the system SHALL mostrar o estado vazio já existente (sem imagens sem `alt`).
- IF a busca não encontrar ninguém THEN the system SHALL mostrar estado vazio (não uma tabela em branco).
- IF não houver agendamentos futuros THEN the system SHALL mostrar estado vazio na seção "Próximos" e manter a agenda completa conforme o filtro.
- WHEN o filtro "Hoje" não tiver itens THEN the system SHALL mostrar estado vazio para a agenda filtrada.

---

## Requirement Traceability

| Requirement ID | Story | Phase | Status |
| -------------- | ----- | ----- | ------ |
| A11Y-01 | P1: HTML semântico | Design | Pending |
| A11Y-02 | P1: HTML semântico | Design | Pending |
| A11Y-03 | P1: HTML semântico | Design | Pending |
| A11Y-04 | P1: HTML semântico | Design | Pending |
| A11Y-05 | P1: HTML semântico | Design | Pending |
| A11Y-06 | P1: HTML semântico | Design | Pending |
| ADM-01 | P1: Painel intérprete | Design | Pending |
| ADM-02 | P1: Painel intérprete | Design | Pending |
| ADM-03 | P1: Painel intérprete | Design | Pending |
| ADM-04 | P1: Painel intérprete | Design | Pending |
| ADM-05 | P1: Painel intérprete | Design | Pending |
| ADM-06 | P1: Painel intérprete | Design | Pending |
| ADM-07 | P1: Painel intérprete | Design | Pending |
| TW-01 | P1: Tailwind | Design | Pending |
| TW-02 | P1: Tailwind | Design | Pending |
| TW-03 | P1: Tailwind | Design | Pending |
| A11Y-07 | P2: Anúncio carrossel | Design | Pending |

**Coverage:** 17 total, 0 mapped to tasks, 17 unmapped

---

## Differences from the source

N/A — nenhum capture binding nesta feature.

## Sources

- Pedido do usuário (chat 2026-10-27) — a11y semântica + alts; melhorar admin intérprete; parar classes CSS legadas em favor do Tailwind
- `.specs/features/a11y-painel-tailwind/context.md` — decisões A/B + ponytail
- `.cursor/rules/ponytail.mdc` — menor diff; sem extras; AD-001

---

## Success Criteria

- [ ] Testes cobrem landmarks/`h1`/alts/labels e filtros/busca do painel
- [ ] Grep das classes legadas listadas em TW-01 retorna zero matches em `src/**/*.{tsx,ts}`
- [ ] Intérprete consegue isolar "hoje" e buscar um cliente pelo e-mail no painel
