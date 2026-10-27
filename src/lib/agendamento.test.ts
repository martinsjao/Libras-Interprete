import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  filtrarAgenda,
  formatarTelefone,
  hojeISO,
  intervaloValido,
  intervalosConflitam,
  proximosDe,
  rotuloTipo,
  type ItemAgendamento,
} from '@/src/lib/agendamento';

const itens: ItemAgendamento[] = [
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

describe('agendamento helpers', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('rotuloTipo retorna label conhecido ou o tipo cru', () => {
    expect(rotuloTipo('curso')).toBe('Curso/Palestra');
    expect(rotuloTipo('consulta')).toBe('Consulta médica');
    expect(rotuloTipo('desconhecido')).toBe('desconhecido');
  });

  it('formatarTelefone mascara DDD e número', () => {
    expect(formatarTelefone('11')).toBe('(11');
    expect(formatarTelefone('11987654321')).toBe('(11) 98765-4321');
    expect(formatarTelefone('1133334444')).toBe('(11) 3333-4444');
  });

  it('intervaloValido aceita faixas da grade e rejeita invertidas', () => {
    expect(intervaloValido('08:00 - 09:00')).toBe(true);
    expect(intervaloValido('09:00 - 08:00')).toBe(false);
    expect(intervaloValido('07:00 - 08:00')).toBe(false);
  });

  it('intervalosConflitam detecta sobreposição', () => {
    expect(intervalosConflitam('08:00 - 10:00', '09:00 - 11:00')).toBe(true);
    expect(intervalosConflitam('08:00 - 09:00', '09:00 - 10:00')).toBe(false);
    expect(intervalosConflitam('08:00 - 09:00', '10:00 - 11:00')).toBe(false);
  });

  it('hojeISO retorna YYYY-MM-DD no fuso local', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 27, 15, 0, 0));
    expect(hojeISO()).toBe('2026-10-27');
  });

  it('proximosDe retorna apenas data >= hoje', () => {
    const resultado = proximosDe(itens, '2026-10-27');
    expect(resultado.map((i) => i.id)).toEqual([2, 3]);
  });

  it('filtro hoje restringe à data de hoje', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 27, 12, 0, 0));
    expect(filtrarAgenda(itens, 'hoje', '').map((i) => i.id)).toEqual([2]);
  });

  it('filtro proximos restringe a data >= hoje', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 27, 12, 0, 0));
    expect(filtrarAgenda(itens, 'proximos', '').map((i) => i.id)).toEqual([
      2, 3,
    ]);
  });

  it('filtro todos retorna todos', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 27, 12, 0, 0));
    expect(filtrarAgenda(itens, 'todos', '').map((i) => i.id)).toEqual([
      1, 2, 3,
    ]);
  });

  it('busca filtra por nome ou e-mail case-insensitive', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 9, 27, 12, 0, 0));
    expect(filtrarAgenda(itens, 'todos', 'ANA').map((i) => i.id)).toEqual([1]);
    expect(filtrarAgenda(itens, 'todos', 'BRUNO@').map((i) => i.id)).toEqual([
      2,
    ]);
    expect(filtrarAgenda(itens, 'todos', 'zzz')).toEqual([]);
  });
});
