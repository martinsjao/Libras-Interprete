import { asc, count, desc, sql } from 'drizzle-orm';
import AreaLogada from '@/src/components/areaLogada';
import PainelAdmin from '@/src/components/painelAdmin';
import { exigirPapel } from '@/src/lib/auth/sessao';
import { db } from '@/src/db';
import { agendamentos } from '@/src/db/schema';

export const dynamic = 'force-dynamic';

export default async function PainelPage() {
  const sessao = await exigirPapel('interprete');

  const [itens, clientes] = await Promise.all([
    db
      .select({
        id: agendamentos.id,
        tipo: agendamentos.tipo,
        data: agendamentos.data,
        horario: agendamentos.horario,
        nome: agendamentos.nome,
        email: agendamentos.email,
      })
      .from(agendamentos)
      .orderBy(asc(agendamentos.data), asc(agendamentos.horario)),
    db
      .select({
        userId: agendamentos.userId,
        nome: sql<string>`max(${agendamentos.nome})`,
        email: sql<string>`max(${agendamentos.email})`,
        total: count(),
      })
      .from(agendamentos)
      .groupBy(agendamentos.userId)
      .orderBy(desc(count())),
  ]);

  return (
    <AreaLogada
      titulo="Painel administrativo"
      descricao={`Olá, ${sessao.user.name}. Acompanhe a agenda, os clientes e o volume de agendamentos.`}
      papel="interprete"
    >
      <PainelAdmin agendamentos={itens} clientes={clientes} />
    </AreaLogada>
  );
}
