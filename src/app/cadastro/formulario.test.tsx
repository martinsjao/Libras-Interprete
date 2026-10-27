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
  criarConta: vi.fn(),
}));

const useActionStateMock = vi.fn();

vi.mock('react', async () => {
  const actual = await vi.importActual<typeof import('react')>('react');
  return {
    ...actual,
    useActionState: (...args: unknown[]) => useActionStateMock(...args),
  };
});

import FormularioCadastro from './formulario';

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

describe('FormularioCadastro', () => {
  afterEach(() => {
    cleanup();
    useActionStateMock.mockReset();
  });

  it('campos têm label associado', () => {
    useActionStateMock.mockReturnValue([null, vi.fn(), false]);
    render(<FormularioCadastro />);

    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Senha')).toBeInTheDocument();
  });

  it('erro expõe role alert', () => {
    useActionStateMock.mockReturnValue([
      { error: 'Não foi possível criar a conta.' },
      vi.fn(),
      false,
    ]);
    render(<FormularioCadastro />);

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Não foi possível criar a conta.',
    );
  });

  it('sem classes legadas TW-01', () => {
    useActionStateMock.mockReturnValue([null, vi.fn(), false]);
    const { container } = render(<FormularioCadastro />);
    const html = container.innerHTML;

    for (const cls of LEGADAS) {
      expect(html).not.toMatch(new RegExp(`class="[^"]*\\b${cls}\\b`));
    }
  });
});
