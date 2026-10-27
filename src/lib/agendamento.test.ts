import { describe, expect, it, vi, afterEach } from 'vitest';
import {
  formatarTelefone,
  hojeISO,
  intervaloValido,
  intervalosConflitam,
  rotuloTipo,
} from '@/src/lib/agendamento';

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
});
