'use client';

import { useState } from 'react';

type CalendarioProps = {
  bookedDates: Set<string>;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
};

function toISO(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function hojeISO() {
  const t = new Date();
  return toISO(t.getFullYear(), t.getMonth(), t.getDate());
}

export default function Calendario({
  bookedDates,
  selectedDate,
  onSelectDate,
}: CalendarioProps) {
  const [cursor, setCursor] = useState(() => {
    const n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), 1);
  });

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const hoje = hojeISO();

  const cells: Array<{ day: number | null; date?: string }> = [];
  for (let i = 0; i < firstWeekday; i++) cells.push({ day: null });
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push({ day: d, date: toISO(year, month, d) });
  }
  while (cells.length % 7 !== 0) cells.push({ day: null });

  const weeks: (typeof cells)[] = [];
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7));
  }

  const titulo = cursor.toLocaleDateString('pt-BR', {
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="calendar-container">
      <div className="calendar-header">
        <button
          type="button"
          aria-label="Mês anterior"
          onClick={() => setCursor(new Date(year, month - 1, 1))}
        >
          ‹
        </button>
        <h3 className="calendar-month">{titulo}</h3>
        <button
          type="button"
          aria-label="Próximo mês"
          onClick={() => setCursor(new Date(year, month + 1, 1))}
        >
          ›
        </button>
      </div>

      <table className="calendar">
        <thead>
          <tr>
            {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia) => (
              <th key={dia}>{dia}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => (
            <tr key={wi}>
              {week.map((cell, di) => {
                if (!cell.day || !cell.date) {
                  return <td key={di} className="empty" />;
                }

                const passada = cell.date < hoje;
                const ocupada = bookedDates.has(cell.date);
                const indisponivel = passada || ocupada;
                const selecionada = selectedDate === cell.date;

                let className = 'available';
                if (indisponivel) className = 'unavailable';
                if (selecionada) className = 'selected';

                return (
                  <td
                    key={cell.date}
                    className={className}
                    aria-current={cell.date === hoje ? 'date' : undefined}
                    onClick={() => {
                      if (!indisponivel) onSelectDate(cell.date!);
                    }}
                  >
                    {cell.day}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="calendar-legend">
        <li>
          <span className="dot available" /> Livre
        </li>
        <li>
          <span className="dot selected" /> Selecionado
        </li>
        <li>
          <span className="dot unavailable" /> Indisponível
        </li>
      </ul>
    </div>
  );
}
