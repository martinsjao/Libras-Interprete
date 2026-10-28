# Documentação para o PI — Libras Interprete

Arquivos prontos para colar na monografia / relatório do Projeto Integrador.

| Documento | Conteúdo | Imagens |
| --- | --- | --- |
| [modelo-banco-dados.md](./modelo-banco-dados.md) | Modelo ER, dicionário de dados e relacionamentos | `diagramas/modelo-bd-erd.png` / `.svg` |
| [fluxograma-sistema.md](./fluxograma-sistema.md) | Fluxo geral: público → auth → papéis → agendamento | `diagramas/fluxograma-sistema.png` / `.svg` |

## Como usar no Word / Google Docs

1. Abra a seção correspondente do PI (Modelo de dados / Fluxograma).
2. Copie o texto explicativo do `.md`.
3. Insira a imagem **PNG** da pasta `diagramas/` (melhor para Word/PDF).
4. Se a ferramenta aceitar Mermaid (ex.: alguns editores online), use o arquivo `.mmd` correspondente.

## Regenerar as imagens

A partir da raiz do repositório (com Mermaid Studio configurado):

```bash
SKILL=/home/rad/.agents/skills/mermaid-studio
MMDC="$SKILL/.deps/node_modules/.bin/mmdc"
node "$SKILL/scripts/render.mjs" -i docs/pi/diagramas/modelo-bd-erd.mmd -o docs/pi/diagramas/modelo-bd-erd.svg
node "$SKILL/scripts/render.mjs" -i docs/pi/diagramas/fluxograma-sistema.mmd -o docs/pi/diagramas/fluxograma-sistema.svg
"$MMDC" -i docs/pi/diagramas/modelo-bd-erd.mmd -o docs/pi/diagramas/modelo-bd-erd.png -s 2
"$MMDC" -i docs/pi/diagramas/fluxograma-sistema.mmd -o docs/pi/diagramas/fluxograma-sistema.png -s 2
```
