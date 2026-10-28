import { and, eq, ne } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/src/db';
import { agendamentos } from '@/src/db/schema';
import {
  intervaloValido,
  intervalosConflitam,
  TIPOS_SERVICO,
} from '@/src/lib/agendamento';
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

export async function PATCH(request: Request, context: RouteContext) {
  const sessao = await sessaoAtual();
  if (!sessao) {
    return NextResponse.json(
      { error: 'Faça login para editar o agendamento.' },
      { status: 401 },
    );
  }

  if (sessao.papel !== 'cliente') {
    return NextResponse.json(
      { error: 'Somente clientes podem editar seus agendamentos.' },
      { status: 403 },
    );
  }

  const { id: idParam } = await context.params;
  const id = Number(idParam);
  if (!Number.isInteger(id) || id <= 0) {
    return NextResponse.json({ error: 'Agendamento inválido.' }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido.' }, { status: 400 });
  }

  const tipo = String(body.tipo ?? '').trim();
  const data = String(body.data ?? '').trim();
  const horario = String(body.horario ?? '').trim();
  const telefone = String(body.telefone ?? '').trim();

  if (
    !TIPOS_SERVICO.some((servico) => servico.value === tipo) ||
    !data ||
    !intervaloValido(horario)
  ) {
    return NextResponse.json(
      { error: 'Informe tipo, data e um horário válido.' },
      { status: 400 },
    );
  }

  const existentes = await db
    .select({ horario: agendamentos.horario })
    .from(agendamentos)
    .where(and(eq(agendamentos.data, data), ne(agendamentos.id, id)));

  if (existentes.some((item) => intervalosConflitam(horario, item.horario))) {
    return NextResponse.json(
      { error: 'Este período já está reservado para a data selecionada.' },
      { status: 409 },
    );
  }

  try {
    const [updated] = await db
      .update(agendamentos)
      .set({ tipo, data, horario, telefone: telefone || null })
      .where(and(eq(agendamentos.id, id), eq(agendamentos.userId, sessao.user.id)))
      .returning({
        id: agendamentos.id,
        tipo: agendamentos.tipo,
        data: agendamentos.data,
        horario: agendamentos.horario,
        telefone: agendamentos.telefone,
      });

    if (!updated) {
      return NextResponse.json(
        { error: 'Agendamento não encontrado.' },
        { status: 404 },
      );
    }

    return NextResponse.json({ ok: true, agendamento: updated });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: 'Não foi possível editar o agendamento.' },
      { status: 500 },
    );
  }
}
