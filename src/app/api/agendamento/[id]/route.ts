import { and, eq } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { agendamentos } from '@/src/db/schema';
import { sessaoAtual } from '@/src/lib/auth/sessao';

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function DELETE(_request: Request, context: RouteContext) {
  const sessao = await sessaoAtual();
  if (!sessao) {
    return NextResponse.json(
      { error: 'Faça login para cancelar o agendamento.' },
      { status: 401 },
    );
  }

  if (sessao.papel !== 'cliente') {
    return NextResponse.json(
      { error: 'Somente clientes podem cancelar seus agendamentos.' },
      { status: 403 },
    );
  }

  const { id: idParam } = await context.params;
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Agendamento inválido.' }, { status: 400 });
  }

  const [deleted] = await db
    .delete(agendamentos)
    .where(and(eq(agendamentos.id, id), eq(agendamentos.userId, sessao.user.id)))
    .returning({
      id: agendamentos.id,
      data: agendamentos.data,
      horario: agendamentos.horario,
    });

  if (!deleted) {
    return NextResponse.json(
      { error: 'Agendamento não encontrado.' },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true, agendamento: deleted });
}
