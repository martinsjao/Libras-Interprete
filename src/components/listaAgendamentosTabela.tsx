import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CancelamentoAgendamento } from '@/src/components/cancelamentoAgendamento';
import type { ItemAgendamento } from '@/src/components/listaAgendamentos';
import { dataFormatadaCurta, rotuloTipo } from '@/src/lib/agendamento';

export function ListaAgendamentosTabela({
  itens,
  mostrarCliente,
  onCancel,
  onEdit,
}: {
  itens: ItemAgendamento[];
  mostrarCliente: boolean;
  onCancel?: (id: number) => Promise<boolean>;
  onEdit?: (item: ItemAgendamento) => Promise<boolean>;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Horário</TableHead>
          <TableHead>Serviço</TableHead>
          {mostrarCliente ? <TableHead>Cliente</TableHead> : null}
          {onCancel ? <TableHead className="text-right">Ações</TableHead> : null}
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
                  <span className="text-xs text-muted-foreground">
                    {item.email}
                  </span>
                </div>
              </TableCell>
            ) : null}
            {onCancel ? (
              <TableCell className="text-right">
                <CancelamentoAgendamento
                  item={item}
                  onCancel={onCancel}
                  onEdit={onEdit}
                />
              </TableCell>
            ) : null}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
