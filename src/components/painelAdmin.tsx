'use client';

import { useState } from 'react';
import {
  CalendarCheckIcon,
  CalendarClockIcon,
  ChartColumnIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ListIcon,
  UsersIcon,
} from 'lucide-react';
import ListaAgendamentos, {
  type ItemAgendamento,
} from '@/src/components/listaAgendamentos';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  filtrarAgenda,
  hojeISO,
  proximosDe,
  type FiltroAgenda,
} from '@/src/lib/agendamento';

export type ClienteResumo = {
  userId: string;
  nome: string;
  email: string;
  total: number;
};

const FILTROS: { valor: FiltroAgenda; rotulo: string }[] = [
  { valor: 'hoje', rotulo: 'Hoje' },
  { valor: 'proximos', rotulo: 'Próximos' },
  { valor: 'todos', rotulo: 'Todos' },
];

export default function PainelAdmin({
  agendamentos,
  clientes,
}: {
  agendamentos: ItemAgendamento[];
  clientes: ClienteResumo[];
}) {
  const [filtro, setFiltro] = useState<FiltroAgenda>('todos');
  const [busca, setBusca] = useState('');
  const [filtrosAbertos, setFiltrosAbertos] = useState(true);

  const hoje = hojeISO();
  const proximos = proximosDe(agendamentos, hoje);
  const totalClientes = clientes.length;
  const totalAgendamentos = agendamentos.length;
  const agendaFiltrada = filtrarAgenda(agendamentos, filtro, busca);

  const [aba, setAba] = useState('agenda');

  return (
    <Tabs
      value={aba}
      onValueChange={(valor) => {
        if (typeof valor === 'string') setAba(valor);
      }}
      className="gap-6"
    >
      <TabsList className="w-full max-w-md">
        <TabsTrigger value="agenda">
          <ListIcon data-icon="inline-start" aria-hidden="true" />
          Agenda
        </TabsTrigger>
        <TabsTrigger value="analitico">
          <ChartColumnIcon data-icon="inline-start" aria-hidden="true" />
          Analítico
        </TabsTrigger>
      </TabsList>

      <TabsContent value="agenda" className="flex flex-col gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <CardTitle>Filtros</CardTitle>
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={() => setFiltrosAbertos((aberto) => !aberto)}
              aria-expanded={filtrosAbertos}
            >
              {filtrosAbertos ? (
                <>
                  <ChevronUpIcon data-icon="inline-start" aria-hidden="true" />
                  Recolher filtros
                </>
              ) : (
                <>
                  <ChevronDownIcon data-icon="inline-start" aria-hidden="true" />
                  Expandir filtros
                </>
              )}
            </Button>
          </CardHeader>
          {filtrosAbertos ? (
            <CardContent className="flex flex-col gap-4">
              <div
                className="flex flex-wrap gap-2"
                role="group"
                aria-label="Filtro da agenda"
              >
                {FILTROS.map(({ valor, rotulo }) => (
                  <Button
                    key={valor}
                    type="button"
                    size="sm"
                    variant={filtro === valor ? 'default' : 'outline'}
                    onClick={() => setFiltro(valor)}
                    aria-pressed={filtro === valor}
                  >
                    {rotulo}
                  </Button>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="busca-agenda">Buscar por nome ou e-mail</Label>
                <Input
                  id="busca-agenda"
                  type="search"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  placeholder="Nome ou e-mail"
                />
              </div>
            </CardContent>
          ) : null}
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Próximos</CardTitle>
            <CardDescription>
              Horários de hoje em diante, em destaque.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ListaAgendamentos
              itens={proximos}
              mostrarCliente
              vazio="Nenhum agendamento próximo."
            />
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
              itens={agendaFiltrada}
              mostrarCliente
              vazio="Nenhum agendamento corresponde ao filtro ou busca."
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="analitico" className="flex flex-col gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div className="flex flex-col gap-1">
                <CardDescription>Agendamentos</CardDescription>
                <CardTitle className="text-3xl tabular-nums">
                  {totalAgendamentos}
                </CardTitle>
              </div>
              <CalendarCheckIcon
                className="text-muted-foreground size-5"
                aria-hidden="true"
              />
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
              <UsersIcon
                className="text-muted-foreground size-5"
                aria-hidden="true"
              />
            </CardHeader>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div className="flex flex-col gap-1">
                <CardDescription>Próximos</CardDescription>
                <CardTitle className="text-3xl tabular-nums">
                  {proximos.length}
                </CardTitle>
              </div>
              <CalendarClockIcon
                className="text-muted-foreground size-5"
                aria-hidden="true"
              />
            </CardHeader>
          </Card>
        </div>

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
      </TabsContent>
    </Tabs>
  );
}
