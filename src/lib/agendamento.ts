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

const partesHorarios = HORARIOS.map((horario) => horario.split(' - '));

export const HORARIOS_INICIO = [
  ...new Set(partesHorarios.map(([inicio]) => inicio)),
];

export const HORARIOS_FIM = [
  ...new Set(partesHorarios.map(([, fim]) => fim)),
];

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

export function formatarTelefone(valor: string) {
  const digitos = valor.replace(/\D/g, '').slice(0, 11);
  if (digitos.length <= 2) return digitos ? `(${digitos}` : '';

  const ddd = digitos.slice(0, 2);
  const numero = digitos.slice(2);
  const tamanhoLocal = digitos.length > 10 ? 5 : 4;
  const parteInicial = numero.slice(0, tamanhoLocal);
  const parteFinal = numero.slice(tamanhoLocal);

  return `(${ddd}) ${parteInicial}${parteFinal ? `-${parteFinal}` : ''}`;
}

function minutosHorario(horario: string) {
  const [hora, minuto] = horario.split(':').map(Number);
  return hora * 60 + minuto;
}

export function intervaloValido(horario: string) {
  const [inicio, fim] = horario.split(' - ');
  return (
    HORARIOS_INICIO.includes(inicio) &&
    HORARIOS_FIM.includes(fim) &&
    minutosHorario(inicio) < minutosHorario(fim)
  );
}

export function intervalosConflitam(primeiro: string, segundo: string) {
  const [inicioPrimeiro, fimPrimeiro] = primeiro.split(' - ');
  const [inicioSegundo, fimSegundo] = segundo.split(' - ');

  return (
    minutosHorario(inicioPrimeiro) < minutosHorario(fimSegundo) &&
    minutosHorario(inicioSegundo) < minutosHorario(fimPrimeiro)
  );
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
