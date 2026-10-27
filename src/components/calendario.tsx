"use client";

import { Calendar } from "@/components/ui/calendar";
import { ptBR } from "date-fns/locale";
import { useMemo } from "react";

type CalendarioProps = {
  /** Datas sem nenhum horário livre. */
  datasLotadas: Set<string>;
  /** Datas com ao menos um horário ocupado (mas ainda com vagas). */
  datasParciais: Set<string>;
  selectedDate: string | null;
  onSelectDate: (date: string) => void;
};

function toISO(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function parseISO(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
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

  const legendItems = [
    {
      label: "Disponível",
      color: "bg-primary/15",
    },
    {
      label: "Vagas limitadas",
      color: "bg-warning/25",
    },
    {
      label: "Sem disponibilidade",
      color: "bg-destructive/15",
    },
  ];

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
          semDisponibilidade: lotadas,
          vagasLimitadas: (date) => {
            const iso = toISO(date);
            return (
              date >= today && datasParciais.has(iso) && !datasLotadas.has(iso)
            );
          },
          disponivel: (date) => {
            const iso = toISO(date);
            return (
              date >= today && !datasLotadas.has(iso) && !datasParciais.has(iso)
            );
          },
        }}
        modifiersClassNames={{
          semDisponibilidade:
            "bg-destructive/15 text-destructive opacity-100 data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground",
          vagasLimitadas:
            "bg-warning/25 text-warning-foreground data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground",
          disponivel:
            "bg-primary/15 text-primary data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground",
        }}
        className="w-full [--cell-size:--spacing(9)]"
      />

      <ul className="flex list-none flex-wrap gap-4 text-sm text-muted-foreground">
        {legendItems.map((item) => (
          <li key={item.label} className="flex items-center gap-2">
            <span
              className={`size-3 rounded-full ${item.color} ring-1 ring-border`}
            />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
