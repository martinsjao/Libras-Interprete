import { asc, eq } from 'drizzle-orm';
import AreaLogada from '@/src/components/areaLogada';
import ContaCliente from '@/src/components/contaCliente';
import { exigirPapel } from '@/src/lib/auth/sessao';
import { db } from '@/src/db';
import { agendamentos } from '@/src/db/schema';

export const dynamic = 'force-dynamic';

export default async function ContaPage() {
  const sessao = await exigirPapel('cliente');
  const nomePadrao = sessao.perfil?.nome || sessao.user.name || '';
  const emailPadrao = sessao.user.email || '';

  const itens = await db
    .select({
      id: agendamentos.id,
      tipo: agendamentos.tipo,
      data: agendamentos.data,
      horario: agendamentos.horario,
      nome: agendamentos.nome,
      email: agendamentos.email,
      telefone: agendamentos.telefone,
    })
    .from(agendamentos)
    .where(eq(agendamentos.userId, sessao.user.id))
    .orderBy(asc(agendamentos.data), asc(agendamentos.horario));

  return (
    <AreaLogada
      titulo="Minha conta"
      descricao={`Olá, ${nomePadrao}. Agende interpretações e acompanhe os seus horários.`}
      papel="cliente"
    >
      <ContaCliente
        itens={itens}
        nomePadrao={nomePadrao}
        emailPadrao={emailPadrao}
      />
    </AreaLogada>
  );
}
