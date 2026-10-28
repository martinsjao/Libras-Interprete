import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { EllipsisIcon, PencilIcon, Trash2 } from 'lucide-react';
import { EditarAgendamento } from '@/src/components/editarAgendamento';
import type { ItemAgendamento } from '@/src/components/listaAgendamentos';

export function CancelamentoAgendamento({
  item,
  onCancel,
  onEdit,
}: {
  item: ItemAgendamento;
  onCancel: (id: number) => Promise<boolean>;
  onEdit?: (item: ItemAgendamento) => Promise<boolean>;
}) {
  const [aberto, setAberto] = useState(false);
  const [editarAberto, setEditarAberto] = useState(false);
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
              aria-label={`Ações para o agendamento de ${item.data}`}
            >
              <EllipsisIcon aria-hidden="true" />
            </Button>
          }
        />
        <DropdownMenuContent align="end" className="min-w-40">
          <DropdownMenuItem
            disabled={!onEdit}
            onClick={() => onEdit && setEditarAberto(true)}
          >
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
              O horário de {item.data} às {item.horario} será liberado para
              novos agendamentos. Essa ação não pode ser desfeita.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={cancelando}>Manter horário</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              disabled={cancelando}
              onClick={confirmarCancelamento}
            >
              {cancelando ? 'Cancelando...' : 'Cancelar horário'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {onEdit ? (
        <EditarAgendamento
          item={item}
          aberto={editarAberto}
          onOpenChange={setEditarAberto}
          onEdit={onEdit}
        />
      ) : null}
    </>
  );
}
