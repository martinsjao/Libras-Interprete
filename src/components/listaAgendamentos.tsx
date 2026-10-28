import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { dataFormatadaCurta, rotuloTipo } from "@/src/lib/agendamento";
import {
  CalendarDaysIcon,
  EllipsisIcon,
  PencilIcon,
  Trash2,
} from "lucide-react";
import { useState } from "react";

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
  onCancel,
}: {
  itens: ItemAgendamento[];
  vazio: string;
  mostrarCliente: boolean;
  onCancel?: (id: number) => Promise<boolean>;
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
          {onCancel ? (
            <TableHead className="text-right">Ações</TableHead>
          ) : null}
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
                <CancelamentoAgendamento item={item} onCancel={onCancel} />
              </TableCell>
            ) : null}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function CancelamentoAgendamento({
  item,
  onCancel,
}: {
  item: ItemAgendamento;
  onCancel: (id: number) => Promise<boolean>;
}) {
  const [aberto, setAberto] = useState(false);
  const [cancelando, setCancelando] = useState(false);

  async function confirmarCancelamento(event: React.MouseEvent) {
    event.preventDefault();
    setCancelando(true);
    try {
      if (await onCancel(item.id)) {
        setAberto(false);
      }
    } finally {
      setCancelando(false);
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              type="button"
              variant="ghost"
              size="icon"
              aria-label={`Ações para o agendamento de ${dataFormatadaCurta(item.data)}`}
            >
              <EllipsisIcon aria-hidden="true" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem disabled>
            <PencilIcon data-icon="inline-start" aria-hidden="true" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => setAberto(true)}
          >
            <Trash2 data-icon="inline-start" aria-hidden="true" />
            Cancelar horário
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={aberto} onOpenChange={setAberto}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancelar este horário?</AlertDialogTitle>
            <AlertDialogDescription>
              O horário de {dataFormatadaCurta(item.data)} às {item.horario}{" "}
              será liberado para novos agendamentos. Essa ação não pode ser
              desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelando}>
              Manter horário
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={cancelando}
              onClick={confirmarCancelamento}
            >
              {cancelando ? "Cancelando..." : "Cancelar horário"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
