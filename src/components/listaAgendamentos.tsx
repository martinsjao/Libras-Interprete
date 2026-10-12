import { CalendarDaysIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { dataFormatadaCurta, rotuloTipo } from '@/src/lib/agendamento';

export type ItemAgendamento = {
  id: number;
  tipo: string;
  data: string;
  horario: string;
  nome: string;
  email: string;
};

export default function ListaAgendamentos({
  itens,
  vazio,
  mostrarCliente,
}: {
  itens: ItemAgendamento[];
  vazio: string;
  mostrarCliente: boolean;
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
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Horário</TableHead>
          <TableHead>Serviço</TableHead>
          {mostrarCliente ? <TableHead>Cliente</TableHead> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {itens.map((item) => (
          <TableRow key={item.id}>
            <TableCell className="font-medium">
              {dataFormatadaCurta(item.data)}
            </TableCell>
            <TableCell>{item.horario}</TableCell>
            <TableCell>
              <Badge variant="secondary">{rotuloTipo(item.tipo)}</Badge>
            </TableCell>
            {mostrarCliente ? (
              <TableCell>
                <div className="flex flex-col gap-0.5">
                  <span>{item.nome}</span>
                  <span className="text-muted-foreground text-xs">
                    {item.email}
                  </span>
                </div>
              </TableCell>
            ) : null}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
