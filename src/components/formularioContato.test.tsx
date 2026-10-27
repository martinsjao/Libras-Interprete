import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it } from 'vitest';
import FormularioContato from '@/src/components/formularioContato';

describe('FormularioContato', () => {
  afterEach(() => {
    cleanup();
  });

  it('campos têm label associado', () => {
    render(<FormularioContato />);

    expect(screen.getByLabelText('Nome')).toBeInTheDocument();
    expect(screen.getByLabelText('E-mail')).toBeInTheDocument();
    expect(screen.getByLabelText('Mensagem')).toBeInTheDocument();
  });

  it('feedback de sucesso é acessível após envio', async () => {
    const user = userEvent.setup();
    render(<FormularioContato />);

    await user.type(screen.getByLabelText('Nome'), 'Ana');
    await user.type(screen.getByLabelText('E-mail'), 'ana@email.com');
    await user.type(screen.getByLabelText('Mensagem'), 'Olá');
    await user.click(screen.getByRole('button', { name: 'Enviar mensagem' }));

    expect(screen.getByRole('status')).toHaveTextContent(
      'Mensagem enviada com sucesso',
    );
  });
});
