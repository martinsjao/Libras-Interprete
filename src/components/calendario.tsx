'use client';

import { useMemo } from 'react';
import { ptBR } from 'date-fns/locale';
import { Calendar } from '@/components/ui/calendar';

type CalendarioProps = {
  /** Datas sem nenhum horário livre. */
  datasLotadas: Set<string>;
  /** Datas com ao menos um horário ocupado (mas ainda com vagas). */
  datasParciais: Set<string>;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
};

function toISO(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function parseISO(dateStr: string) {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

function startOfToday() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
}

export default function Calendario({
  datasLotadas,
  datasParciais,
  selectedDate,
  onSelectDate,
}: CalendarioProps) {
  const today = useMemo(() => startOfToday(), []);
  const lotadas = useMemo(
    () => Array.from(datasLotadas).map(parseISO),
    [datasLotadas],
  );
  const selected = selectedDate ? parseISO(selectedDate) : undefined;

  return (
    <div className="flex flex-col gap-4">
      <Calendar
        mode="single"
        locale={ptBR}
        selected={selected}
        onSelect={(date) => {
          if (date) onSelectDate(toISO(date));
        }}
        disabled={[{ before: today }, ...lotadas]}
        modifiers={{
          lotado: lotadas,
          parcial: (date) => {
            const iso = toISO(date);
            return (
              date >= today &&
              datasParciais.has(iso) &&
              !datasLotadas.has(iso)
            );
          },
          livre: (date) => {
            const iso = toISO(date);
            return (
              date >= today &&
              !datasLotadas.has(iso) &&
              !datasParciais.has(iso)
            );
          },
        }}
        modifiersClassNames={{
          lotado: 'bg-unavailable text-unavailable-text opacity-100',
          parcial: 'bg-accent text-accent-foreground',
          livre: 'bg-available text-foreground',
        }}
        className="w-full [--cell-size:--spacing(9)]"
      />

      <ul className="flex list-none flex-wrap gap-4 text-sm text-muted-foreground">
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-available ring-1 ring-border" />
          Livre
        </li>
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-accent ring-1 ring-border" />
          Com vagas
        </li>
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-primary" />
          Selecionado
        </li>
        <li className="flex items-center gap-2">
          <span className="size-3 rounded-full bg-unavailable ring-1 ring-border" />
          Lotado
        </li>
      </ul>
    </div>
  );
}
