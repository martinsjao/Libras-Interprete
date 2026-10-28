import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { CalendarDaysIcon } from "lucide-react";
import { ListaAgendamentosTabela } from "@/src/components/listaAgendamentosTabela";

export type ItemAgendamento = {
  id: number;
  tipo: string;
  data: string;
  horario: string;
  nome: string;
  email: string;
  telefone?: string | null;
};

export default function ListaAgendamentos({
  itens,
  vazio,
  mostrarCliente,
  onCancel,
  onEdit,
}: {
  itens: ItemAgendamento[];
  vazio: string;
  mostrarCliente: boolean;
  onCancel?: (id: number) => Promise<boolean>;
  onEdit?: (item: ItemAgendamento) => Promise<boolean>;
}) {
  if (itens.length === 0) {
    return (
      <Empty className="border border-dashed">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <CalendarDaysIcon />
          </EmptyMedia>
          <EmptyTitle>Nenhum agendamento</EmptyTitle>
          <EmptyDescription>{vazio}</EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <ListaAgendamentosTabela
      itens={itens}
      mostrarCliente={mostrarCliente}
      onCancel={onCancel}
      onEdit={onEdit}
    />
  );
}
