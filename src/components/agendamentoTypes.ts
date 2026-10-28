export type ItemAgendamento = {
  id: number;
  tipo: string;
  data: string;
  horario: string;
  nome: string;
  email: string;
  telefone?: string | null;
};
