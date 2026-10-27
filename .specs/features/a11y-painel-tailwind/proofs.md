# a11y-painel-tailwind proofs

**HEAD**: 76c8bb8
**Tree**: clean
**Result**: 20 pass, 0 fail; mutations 3 killed, 0 not

| Check | Proof | Ran | Passed | Result |
| --- | --- | --- | --- | --- |
| C1 | `npx vitest run src/components/areaLogada.test.tsx -t "um h1"` | 1 | 1 | pass |
| C2 | `npx vitest run src/components/areaLogada.test.tsx -t "landmarks"` | 1 | 1 | pass |
| C3 | `npx vitest run src/components/carrosselImagens.test.tsx -t "alt descritivo"` | 1 | 1 | pass |
| C4 | `npx vitest run src/components/areaLogada.test.tsx -t "aria-hidden"` | 1 | 1 | pass |
| C5 | `npx vitest run src/app/entrar/formulario.test.tsx -t "label"` | 1 | 1 | pass |
| C6 | `npx vitest run src/app/entrar/formulario.test.tsx -t "alert"` | 1 | 1 | pass |
| C7 | `npx vitest run src/lib/agendamento.test.ts -t "proximosDe"` | 1 | 1 | pass |
| C8 | `npx vitest run src/lib/agendamento.test.ts -t "filtro hoje"` | 1 | 1 | pass |
| C9 | `npx vitest run src/lib/agendamento.test.ts -t "filtro proximos"` | 1 | 1 | pass |
| C10 | `npx vitest run src/lib/agendamento.test.ts -t "filtro todos"` | 1 | 1 | pass |
| C11 | `npx vitest run src/lib/agendamento.test.ts -t "busca"` | 1 | 1 | pass |
| C12 | `npx vitest run src/components/painelAdmin.test.tsx -t "vazio"` | 2 | 2 | pass |
| C13 | `npx vitest run src/components/painelAdmin.test.tsx -t "totais"` | 1 | 1 | pass |
| C14 | `npx vitest run src/lib/legacy-css.test.ts -t "classes legadas"` | 1 | 1 | pass |
| C15 | `npx vitest run src/app/entrar/formulario.test.tsx -t "sem classes legadas"` | 1 | 1 | pass |
| C16 | `npx vitest run src/lib/legacy-css.test.ts -t "globals tokens"` | 1 | 1 | pass |
| C17 | `npx vitest run src/components/carrosselImagens.test.tsx -t "aria-live"` | 1 | 1 | pass |
| Build | `npm run build` | - | - | pass |
| Build | `npm run lint` | - | - | pass |
| Build | `npx vitest run` | - | - | pass |

## Mutations

| Mutation | Location | Killed |
| --- | --- | --- |
| proximosDe bound >= hoje -> > hoje | `src/lib/agendamento.ts:136` | yes |
| busca drops email match | `src/lib/agendamento.ts:157` | yes |
| totais Próximos uses filtered agenda | `src/components/painelAdmin.tsx:110` | yes |
