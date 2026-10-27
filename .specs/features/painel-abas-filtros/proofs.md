# painel-abas-filtros proofs

**HEAD**: 7fcdf84
**Tree**: clean
**Result**: 15 pass, 0 fail; mutations 3 killed, 0 not

| Check | Proof | Ran | Passed | Result |
| --- | --- | --- | --- | --- |
| C1 | `npx vitest run src/components/painelAdmin.test.tsx -t "aba Agenda ativa"` | 1 | 1 | pass |
| C2 | `npx vitest run src/components/painelAdmin.test.tsx -t "rótulos Agenda e Analítico"` | 1 | 1 | pass |
| C3 | `npx vitest run src/components/painelAdmin.test.tsx -t "conteúdo Analítico"` | 1 | 1 | pass |
| C4 | `npx vitest run src/components/painelAdmin.test.tsx -t "conteúdo Agenda"` | 1 | 1 | pass |
| C5 | `npx vitest run src/components/painelAdmin.test.tsx -t "preserva filtro"` | 1 | 1 | pass |
| C6 | `npx vitest run src/components/painelAdmin.test.tsx -t "filtros acima"` | 1 | 1 | pass |
| C7 | `npx vitest run src/components/painelAdmin.test.tsx -t "filtros expandido"` | 1 | 1 | pass |
| C8 | `npx vitest run src/components/painelAdmin.test.tsx -t "recolher filtros"` | 1 | 1 | pass |
| C9 | `npx vitest run src/components/painelAdmin.test.tsx -t "expandir filtros"` | 1 | 1 | pass |
| C10 | `npx vitest run src/components/painelAdmin.test.tsx -t "nome acessível filtros"` | 1 | 1 | pass |
| C11 | `npx vitest run src/lib/agendamento.test.ts` | 10 | 10 | pass |
| C12 | `npx vitest run src/components/painelAdmin.test.tsx -t "totais"` | 1 | 1 | pass |
| Build | `npm run build` | - | - | pass |
| Build | `npm run lint` | - | - | pass |
| Build | `npx vitest run` | - | - | pass |

## Mutations

| Mutation | Location | Killed |
| --- | --- | --- |
| TAB-01 default tab Analítico instead of Agenda | `src/components/painelAdmin.tsx:81` | yes |
| FIL-02 filtros collapsed on load | `src/components/painelAdmin.tsx:72` | yes |
| FIL-06 agenda list ignores filtro/busca | `src/components/painelAdmin.tsx:78` | yes |
