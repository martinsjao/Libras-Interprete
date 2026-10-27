import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import CarrosselImagens from '@/src/components/carrosselImagens';
import type { SlideCarrossel } from '@/src/data/carrossel';

vi.mock('next/image', () => ({
  default: ({
    alt,
    src,
  }: {
    alt: string;
    src: string;
  }) => (
    // eslint-disable-next-line @next/next/no-img-element -- test double
    <img alt={alt} src={src} data-testid="slide-image" />
  ),
}));

const slides: SlideCarrossel[] = [
  { src: '/carrossel/a.jpg', alt: 'Interpretação em Libras em eventos e cursos' },
  { src: '/carrossel/b.jpg', alt: 'Acompanhamento em consultas e reuniões' },
];

describe('CarrosselImagens', () => {
  afterEach(() => {
    cleanup();
  });

  it('alt descritivo vem do slide e não é vazio', () => {
    render(<CarrosselImagens slides={slides} />);

    const imagens = screen.getAllByTestId('slide-image');
    expect(imagens[0]).toHaveAttribute(
      'alt',
      'Interpretação em Libras em eventos e cursos',
    );
    expect(imagens[0]).not.toHaveAttribute('alt', '');
    expect(imagens[1]).toHaveAttribute(
      'alt',
      'Acompanhamento em consultas e reuniões',
    );
  });

  it('aria-live anuncia o alt do slide ativo', async () => {
    const user = userEvent.setup();
    render(<CarrosselImagens slides={slides} intervaloMs={60_000} />);

    const region = screen.getByRole('region', {
      name: 'Galeria de imagens de fundo',
    });
    const live = within(region).getByText(/Imagem 1 de 2:/);
    expect(live).toHaveAttribute('aria-live', 'polite');
    expect(live).toHaveTextContent(
      'Interpretação em Libras em eventos e cursos',
    );

    await user.click(
      within(region).getByRole('button', { name: 'Próxima imagem' }),
    );

    expect(
      within(region).getByText(/Imagem 2 de 2:/),
    ).toHaveTextContent('Acompanhamento em consultas e reuniões');
  });
});
