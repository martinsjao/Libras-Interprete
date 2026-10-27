import { NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/src/db';
import { agendamentos } from '@/src/db/schema';
import { intervaloValido, intervalosConflitam } from '@/src/lib/agendamento';
import { sessaoAtual } from '@/src/lib/auth/sessao';

export const dynamic = 'force-dynamic';

function postgresErrorCode(error: unknown): string {
  if (typeof error !== 'object' || error === null) return '';
  if ('code' in error && error.code != null) return String(error.code);
  if ('cause' in error) return postgresErrorCode(error.cause);
  return '';
}

export async function GET() {
  const sessao = await sessaoAtual();
  if (!sessao) {
    return NextResponse.json({ error: 'Faça login para continuar.' }, { status: 401 });
  }

  const slots = await db
    .select({
      data: agendamentos.data,
      horario: agendamentos.horario,
    })
    .from(agendamentos);

  return NextResponse.json({ slots });
}

export async function POST(request: Request) {
  const sessao = await sessaoAtual();
  if (!sessao) {
    return NextResponse.json({ error: 'Faça login para agendar.' }, { status: 401 });
  }

  if (sessao.papel !== 'cliente') {
    return NextResponse.json(
      { error: 'Somente clientes podem criar agendamentos.' },
      { status: 403 },
    );
  }

  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const tipo = String(body.tipo ?? '').trim();
  const data = String(body.data ?? '').trim();
  const horario = String(body.horario ?? '').trim();
  const telefone = String(body.telefone ?? '').trim();
  const observacoes = String(body.observations ?? body.observacoes ?? '').trim();
  const nome = (sessao.perfil?.nome || sessao.user.name || '').trim();
  const email = (sessao.user.email || '').trim().toLowerCase();

  if (!tipo || !data || !horario || !nome || !email) {
    return NextResponse.json(
      { error: 'Preencha tipo, data e horário. Nome e e-mail vêm da sua conta.' },
      { status: 400 },
    );
  }

  if (!intervaloValido(horario)) {
    return NextResponse.json(
      { error: 'Selecione um intervalo de horário válido.' },
      { status: 400 },
    );
  }

  try {
    const existentes = await db
      .select({ horario: agendamentos.horario })
      .from(agendamentos)
      .where(eq(agendamentos.data, data));

    if (existentes.some((item) => intervalosConflitam(horario, item.horario))) {
      return NextResponse.json(
        { error: 'Este período já está reservado para a data selecionada.' },
        { status: 409 },
      );
    }

    const [created] = await db
      .insert(agendamentos)
      .values({
        userId: sessao.user.id,
        tipo,
        data,
        horario,
        nome,
        email,
        telefone: telefone || null,
        observacoes: observacoes || null,
      })
      .returning({
        id: agendamentos.id,
        data: agendamentos.data,
        horario: agendamentos.horario,
      });

    return NextResponse.json({ ok: true, agendamento: created });
  } catch (error) {
    const code = postgresErrorCode(error);

    if (code === '23505') {
      return NextResponse.json(
        { error: 'Este horário já está reservado para a data selecionada.' },
        { status: 409 },
      );
    }

    console.error(error);
    return NextResponse.json(
      { error: 'Não foi possível salvar o agendamento.' },
      { status: 500 },
    );
  }
}
