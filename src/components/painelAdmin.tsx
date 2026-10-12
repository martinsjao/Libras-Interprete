import {
  CalendarCheckIcon,
  CalendarClockIcon,
  UsersIcon,
} from 'lucide-react';
import ListaAgendamentos, {
  type ItemAgendamento,
} from '@/src/components/listaAgendamentos';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
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
import { hojeISO } from '@/src/lib/agendamento';

export type ClienteResumo = {
  userId: string;
  nome: string;
  email: string;
  total: number;
};

export default function PainelAdmin({
  agendamentos,
  clientes,
}: {
  agendamentos: ItemAgendamento[];
  clientes: ClienteResumo[];
}) {
  const hoje = hojeISO();
  const proximos = agendamentos.filter((item) => item.data >= hoje).length;
  const totalClientes = clientes.length;
  const totalAgendamentos = agendamentos.length;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div className="flex flex-col gap-1">
              <CardDescription>Agendamentos</CardDescription>
              <CardTitle className="text-3xl tabular-nums">
                {totalAgendamentos}
              </CardTitle>
            </div>
            <CalendarCheckIcon className="text-muted-foreground size-5" />
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div className="flex flex-col gap-1">
              <CardDescription>Clientes</CardDescription>
              <CardTitle className="text-3xl tabular-nums">
                {totalClientes}
              </CardTitle>
            </div>
            <UsersIcon className="text-muted-foreground size-5" />
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div className="flex flex-col gap-1">
              <CardDescription>Próximos</CardDescription>
              <CardTitle className="text-3xl tabular-nums">{proximos}</CardTitle>
            </div>
            <CalendarClockIcon className="text-muted-foreground size-5" />
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Clientes</CardTitle>
            <CardDescription>
              Quantidade de agendamentos por cliente.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {clientes.length === 0 ? (
              <Empty className="border border-dashed">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <UsersIcon />
                  </EmptyMedia>
                  <EmptyTitle>Sem clientes ainda</EmptyTitle>
                  <EmptyDescription>
                    Quando alguém agendar, o resumo aparece aqui.
                  </EmptyDescription>
                </EmptyHeader>
              </Empty>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead className="text-right">Agendamentos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientes.map((cliente) => (
                    <TableRow key={cliente.userId}>
                      <TableCell>
                        <div className="flex flex-col gap-0.5">
                          <span className="font-medium">{cliente.nome}</span>
                          <span className="text-muted-foreground text-xs">
                            {cliente.email}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Badge variant="secondary">{cliente.total}</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Agenda completa</CardTitle>
            <CardDescription>
              Todos os horários reservados, ordenados por data.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ListaAgendamentos
              itens={agendamentos}
              mostrarCliente
              vazio="Nenhum agendamento registrado ainda."
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
