import { useState } from 'react';
import { toast } from '@/components/ui/toast';
import {
  HORARIOS_FIM,
  HORARIOS_INICIO,
  TIPOS_SERVICO,
  datasLotadas,
  formatarTelefone,
  intervalosConflitam,
  montarMapaHorarios,
  type SlotOcupado,
} from '@/src/lib/agendamento';
import type { ItemAgendamento } from '@/src/components/agendamentoTypes';

export function useAgendamentoEdicao(
  item: ItemAgendamento,
  onEdit: (item: ItemAgendamento) => Promise<boolean>,
) {
  const [slots, setSlots] = useState<SlotOcupado[]>([]);
  const [data, setData] = useState(item.data);
  const [tipo, setTipo] = useState(item.tipo);
  const [horarioInicio, setHorarioInicio] = useState(
    item.horario.split(' - ')[0],
  );
  const [horarioFim, setHorarioFim] = useState(item.horario.split(' - ')[1]);
  const [telefone, setTelefone] = useState(item.telefone ?? '');
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const slotsDeOutros = slots.filter(
    (slot) => !(slot.data === item.data && slot.horario === item.horario),
  );
  const mapaHorarios = montarMapaHorarios(slotsDeOutros);
  const datasLotadasSet = new Set(datasLotadas(mapaHorarios));
  const horariosOcupados = mapaHorarios.get(data) ?? new Set<string>();
  const horario = `${horarioInicio} - ${horarioFim}`;
  const horarioDisponivel =
    Boolean(horarioInicio && horarioFim) &&
    ![...horariosOcupados].some((ocupado) =>
      intervalosConflitam(horario, ocupado),
    );

  async function carregarDados() {
    setData(item.data);
    setTipo(item.tipo);
    setHorarioInicio(item.horario.split(' - ')[0]);
    setHorarioFim(item.horario.split(' - ')[1]);
    setTelefone(item.telefone ?? '');
    setCarregando(true);
    try {
      const response = await fetch('/api/agendamento');
      if (!response.ok) throw new Error('Não foi possível carregar os horários.');
      const payload = (await response.json()) as { slots?: SlotOcupado[] };
      setSlots(Array.isArray(payload.slots) ? payload.slots : []);
    } catch (error) {
      toast.add({
        type: 'error',
        title: 'Não foi possível editar',
        description:
          error instanceof Error ? error.message : 'Tente novamente.',
      });
      return false;
    } finally {
      setCarregando(false);
    }

    return true;
  }

  async function salvar(event: React.FormEvent) {
    event.preventDefault();
    if (!horarioDisponivel || !tipo) return false;
    setSalvando(true);
    try {
      return await onEdit({
        ...item,
        data,
        tipo,
        horario,
        telefone: telefone || null,
      });
    } finally {
      setSalvando(false);
    }
  }

  function onChangeTelefone(value: string) {
    setTelefone(formatarTelefone(value));
  }

  return {
    data,
    setData,
    tipo,
    setTipo,
    horarioInicio,
    setHorarioInicio,
    horarioFim,
    setHorarioFim,
    telefone,
    setTelefone,
    carregando,
    salvando,
    slots,
    datasLotadasSet,
    mapaHorarios,
    horariosOcupados,
    horarioDisponivel,
    carregarDados,
    salvar,
    onChangeTelefone,
    opcoesTipoServico: TIPOS_SERVICO,
    horariosInicio: HORARIOS_INICIO,
    horariosFim: HORARIOS_FIM,
  };
}
