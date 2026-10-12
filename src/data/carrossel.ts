/**
 * Imagens do carrossel da home (`/`).
 * Coloque os arquivos em `public/carrossel/` e liste-os aqui.
 * As imagens ficam de fundo; o texto do hero fica na frente.
 */
export type SlideCarrossel = {
  src: string;
  alt: string;
};

export const slidesCarrossel: SlideCarrossel[] = [
  {
    src: '/carrossel/slide-1.jpg',
    alt: 'Interpretação em Libras em eventos e cursos',
  },
  {
    src: '/carrossel/slide-2.svg',
    alt: 'Acompanhamento em consultas e reuniões',
  },
  {
    src: '/carrossel/slide-3.svg',
    alt: 'Comunicação acessível para todos',
  },
];
