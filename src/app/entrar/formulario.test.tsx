import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

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

vi.mock('./actions', () => ({
  entrarComEmail: vi.fn(),
}));

const useActionStateMock = vi.fn();

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');
  return {
    ...actual,
    useActionState: (...args: unknown[]) => useActionStateMock(...args),
  };
});

import FormularioEntrar from './formulario';

const LEGADAS = [
  'auth-shell',
  'auth-main',
  'auth-card',
  'auth-lead',
  'auth-submit',
  'auth-switch',
  'form-group',
  'form-feedback',
  'btn-primary',
  'logo-icon',
  'logo',
];

describe('FormularioEntrar', () => {
  afterEach(() => {
    cleanup();
    useActionStateMock.mockReset();
  });

  it('campos têm label associado', () => {
    useActionStateMock.mockReturnValue([null, vi.fn(), false]);
    render(<FormularioEntrar />);

    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
  });

  it('erro expõe role alert', () => {
    useActionStateMock.mockReturnValue([
      { error: 'Credenciais inválidas' },
      vi.fn(),
      false,
    ]);
    render(<FormularioEntrar />);

    expect(screen.getByRole('alert')).toHaveTextContent('Credenciais inválidas');
  });

  it('sem classes legadas TW-01', () => {
    useActionStateMock.mockReturnValue([null, vi.fn(), false]);
    const { container } = render(<FormularioEntrar />);
    const html = container.innerHTML;

    for (const cls of LEGADAS) {
      expect(html).not.toMatch(new RegExp(`class="[^"]*\\b${cls}\\b`));
    }
  });
});
