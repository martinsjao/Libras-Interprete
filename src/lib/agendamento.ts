export const HORARIOS = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
] as const;

export type Horario = (typeof HORARIOS)[number];

export const TIPOS_SERVICO = [
  { value: 'curso', label: 'Curso/Palestra' },
  { value: 'consulta', label: 'Consulta médica' },
  { value: 'reuniao', label: 'Reunião empresarial' },
  { value: 'evento', label: 'Evento ao vivo' },
] as const;

export type TipoServico = (typeof TIPOS_SERVICO)[number]['value'];

export type SlotOcupado = {
  data: string;
  horario: string;
};

export function rotuloTipo(tipo: string) {
  return TIPOS_SERVICO.find((item) => item.value === tipo)?.label ?? tipo;
}

export function chaveSlot(data: string, horario: string) {
  return `${data}|${horario}`;
}

export function montarMapaHorarios(slots: SlotOcupado[]) {
  const mapa = new Map<string, Set<string>>();
  for (const slot of slots) {
    const atual = mapa.get(slot.data) ?? new Set<string>();
    atual.add(slot.horario);
    mapa.set(slot.data, atual);
  }
  return mapa;
}

export function datasLotadas(mapa: Map<string, Set<string>>) {
  const lotadas: string[] = [];
  for (const [data, horarios] of mapa) {
    if (HORARIOS.every((horario) => horarios.has(horario))) {
      lotadas.push(data);
    }
  }
  return lotadas;
}

export function dataFormatadaCurta(dataStr: string) {
  const [ano, mes, dia] = dataStr.split('-');
  return new Date(Number(ano), Number(mes) - 1, Number(dia)).toLocaleDateString(
    'pt-BR',
  );
}

export function dataFormatadaLonga(dataStr: string) {
  const [ano, mes, dia] = dataStr.split('-');
  return new Date(Number(ano), Number(mes) - 1, Number(dia)).toLocaleDateString(
    'pt-BR',
    { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
  );
}

export function hojeISO() {
  const hoje = new Date();
  return `${hoje.getFullYear()}-${String(hoje.getMonth() + 1).padStart(2, '0')}-${String(hoje.getDate()).padStart(2, '0')}`;
}
