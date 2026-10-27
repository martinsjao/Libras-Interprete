import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import AreaLogada from '@/src/components/areaLogada';

vi.mock('next/link', () => ({
  default: ({
    children,
    href,
    ...props
  }: {
    children: React.ReactNode;
    href: string;
  }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock('@/src/components/themeToggle', () => ({
  default: () => <button type="button" aria-label="Ativar modo escuro" />,
}));

vi.mock('@/src/app/sair/actions', () => ({
  sair: vi.fn(),
}));

describe('AreaLogada', () => {
  afterEach(() => {
    cleanup();
  });

  it('um h1 é o título da página e a marca não é h1', () => {
    render(
      <AreaLogada titulo="Meu painel" descricao="Descrição" papel="cliente">
        <p>conteúdo</p>
      </AreaLogada>,
    );

    const headings = screen.getAllByRole('heading', { level: 1 });
    expect(headings).toHaveLength(1);
    expect(headings[0]).toHaveTextContent('Meu painel');
    expect(screen.getByText('Libras Interprete').closest('h1')).toBeNull();
  });

  it('landmarks header nav e main estão presentes', () => {
    render(
      <AreaLogada titulo="Conta" descricao="Descrição" papel="interprete">
        <p>conteúdo</p>
      </AreaLogada>,
    );

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('aria-hidden marca ícone decorativo da marca', () => {
    const { container } = render(
      <AreaLogada titulo="Conta" descricao="Descrição" papel="cliente">
        <p>conteúdo</p>
      </AreaLogada>,
    );

    const brandLink = screen.getByRole('link', { name: /libras interprete/i });
    const icon = brandLink.querySelector('svg');
    expect(icon).not.toBeNull();
    expect(icon).toHaveAttribute('aria-hidden', 'true');
    expect(container.querySelectorAll('[aria-hidden="true"]').length).toBeGreaterThan(0);
  });
});
