# Carrossel de imagens (home)

O carrossel aparece na página inicial (`/`).

1. Coloque suas imagens nesta pasta (`.jpg`, `.png`, `.webp` ou `.svg`).
2. Atualize a lista em `src/data/carrossel.ts` com o caminho e o texto alternativo.

Exemplo:

```ts
export const slidesCarrossel = [
  { src: '/carrossel/minha-foto.jpg', alt: 'Intérprete em evento' },
  { src: '/carrossel/outra.png', alt: 'Consulta com Libras' },
];
```

Os slides de exemplo (`slide-1.svg`, `slide-2.svg`, `slide-3.svg`) podem ser trocados ou removidos.
