import { cleanup, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';
import PainelAdmin from '@/src/components/painelAdmin';
import type { ItemAgendamento } from '@/src/components/listaAgendamentos';

const agendamentos: ItemAgendamento[] = [
  {
    id: 1,
    tipo: 'curso',
    data: '2026-10-26',
    horario: '08:00 - 09:00',
    nome: 'Ana Silva',
    email: 'ana@exemplo.com',
  },
  {
    id: 2,
    tipo: 'consulta',
    data: '2026-10-27',
    horario: '09:00 - 10:00',
    nome: 'Bruno Costa',
    email: 'bruno@exemplo.com',
  },
  {
    id: 3,
    tipo: 'reuniao',
    data: '2026-10-28',
    horario: '10:00 - 11:00',
    nome: 'Carla Dias',
    email: 'carla@exemplo.com',
  },
];

const clientes = [
  { userId: 'u1', nome: 'Ana Silva', email: 'ana@exemplo.com', total: 1 },
  { userId: 'u2', nome: 'Bruno Costa', email: 'bruno@exemplo.com', total: 1 },
  { userId: 'u3', nome: 'Carla Dias', email: 'carla@exemplo.com', total: 1 },
];

function valorDoTotal(rotulo: string) {
  const desc = screen
    .getAllByText(rotulo)
    .find((el) => el.getAttribute('data-slot') === 'card-description');
  if (!desc?.parentElement) throw new Error(`total ${rotulo} não encontrado`);
  return within(desc.parentElement).getByText(/^\d+$/).textContent;
}

describe('PainelAdmin', () => {
  afterEach(() => {
    cleanup();
    vi.useRealTimers();
  });

  it('totais usam o conjunto completo independente de filtro e busca', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date(2026, 9, 27, 12, 0, 0));
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <PainelAdmin agendamentos={agendamentos} clientes={clientes} />,
    );

    expect(valorDoTotal('Agendamentos')).toBe('3');
    expect(valorDoTotal('Clientes')).toBe('3');
    expect(valorDoTotal('Próximos')).toBe('2');

    await user.click(screen.getByRole('button', { name: 'Hoje' }));
    await user.type(
      screen.getByLabelText(/buscar por nome ou e-mail/i),
      'zzz',
    );

    expect(valorDoTotal('Agendamentos')).toBe('3');
    expect(valorDoTotal('Clientes')).toBe('3');
    expect(valorDoTotal('Próximos')).toBe('2');
  });

  it('vazio quando filtro ou busca zera a lista', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date(2026, 9, 27, 12, 0, 0));
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <PainelAdmin agendamentos={agendamentos} clientes={clientes} />,
    );

    await user.type(
      screen.getByLabelText(/buscar por nome ou e-mail/i),
      'inexistente',
    );

    expect(
      screen.getByText(
        'Nenhum agendamento corresponde ao filtro ou busca.',
      ),
    ).toBeInTheDocument();
  });

  it('vazio quando filtro Hoje não tem itens no dia', async () => {
    vi.useFakeTimers({ shouldAdvanceTime: true });
    vi.setSystemTime(new Date(2026, 9, 29, 12, 0, 0));
    const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });

    render(
      <PainelAdmin agendamentos={agendamentos} clientes={clientes} />,
    );

    const filtros = screen.getByRole('group', { name: 'Filtro da agenda' });
    await user.click(within(filtros).getByRole('button', { name: 'Hoje' }));

    expect(
      screen.getByText(
        'Nenhum agendamento corresponde ao filtro ou busca.',
      ),
    ).toBeInTheDocument();
  });
});
