# Libras Interprete

Site para agendar interpretação em Libras. A página pública apresenta os serviços e o contato. Clientes autenticados reservam horários; intérpretes acompanham a agenda e os clientes no painel.

## Papéis

O cadastro público cria sempre um perfil `cliente`. O papel `interprete` é atribuído no banco, na tabela `perfis`. Usuário com `role` `admin` no Neon Auth também entra como intérprete.

| Papel | Destino após o login | O que pode fazer |
| --- | --- | --- |
| `cliente` | `/conta` | Agendar e ver os próprios horários |
| `interprete` | `/painel` | Ver toda a agenda e o resumo de clientes |

Cada horário (data + faixa) só pode ser reservado uma vez.

## Rotas

| Rota | Acesso |
| --- | --- |
| `/` | Público. Serviços, agendamento e contato |
| `/entrar` | Login |
| `/cadastro` | Criação de conta de cliente |
| `/conta` | Cliente autenticado |
| `/painel` | Intérprete autenticado |
| `/api/agendamento` | Leitura dos horários ocupados e criação de reserva (cliente) |
| `/api/auth/[...path]` | Rotas do Neon Auth |

`/conta` e `/painel` exigem sessão. Quem não tem o papel da rota é enviado para a área correspondente.

## Serviços agendáveis

- Curso ou palestra
- Consulta médica
- Reunião empresarial
- Evento ao vivo

Horários de 08:00 às 12:00 e de 13:00 às 18:00, em faixas de uma hora.

## Stack

- Next.js 16 (App Router) e React 19
- Tailwind CSS 4 e componentes shadcn
- Neon Postgres com Drizzle ORM
- Neon Auth (Better Auth)
- VLibras na interface

## Configuração

Requisitos: Node.js e um projeto Neon com Auth habilitado.

Variáveis em `.env`:

```bash
DATABASE_URL=
DATABASE_URL_UNPOOLED=
NEON_AUTH_BASE_URL=
NEON_AUTH_COOKIE_SECRET=
```

`DATABASE_URL` é a conexão usada pela aplicação. `DATABASE_URL_UNPOOLED` é a conexão direta usada pelo Drizzle Kit nas migrações.

```bash
npm install
npm run db:migrate
npm run dev
```

O servidor de desenvolvimento fica em [http://localhost:3000](http://localhost:3000).

## Scripts

| Comando | Uso |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção |
| `npm run start` | Servidor de produção |
| `npm run lint` | ESLint |
| `npm run db:generate` | Gera uma migração a partir de `src/db/schema.ts` |
| `npm run db:migrate` | Aplica as migrações em `drizzle/` |

## Banco

Duas tabelas da aplicação, em `src/db/schema.ts`:

- `perfis` — usuário do Neon Auth, nome, e-mail e papel
- `agendamentos` — tipo, data, horário, contato e observações, sempre ligados a um `user_id`

As migrações ficam em `drizzle/`.

## Imagens do carrossel

Os slides da página inicial ficam em `public/carrossel/` e a lista em `src/data/carrossel.ts`. O passo a passo está em `public/carrossel/README.md`.
