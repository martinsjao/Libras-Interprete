import { useState } from 'react';

export function useAgendamentoAcoes(
  onCancel: (id: number) => Promise<boolean>,
  itemId: number,
) {
  const [aberto, setAberto] = useState(false);
  const [editarAberto, setEditarAberto] = useState(false);
  const [cancelando, setCancelando] = useState(false);

  async function confirmarCancelamento(event: React.MouseEvent) {
    event.preventDefault();
    setCancelando(true);
    try {
      if (await onCancel(itemId)) {
        setAberto(false);
      }
    } finally {
      setCancelando(false);
    }
  }

  return {
    aberto,
    setAberto,
    editarAberto,
    setEditarAberto,
    cancelando,
    confirmarCancelamento,
  };
}
