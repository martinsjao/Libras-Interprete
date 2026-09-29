import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  let body: Record<string, unknown>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 });
  }

  const tipo = String(body.tipo ?? '').trim();
  const data = String(body.data ?? '').trim();
  const horario = String(body.horario ?? '').trim();
  const nome = String(body.nome ?? '').trim();
  const email = String(body.email ?? '').trim();

  if (!tipo || !data || !horario || !nome || !email) {
    return NextResponse.json(
      { error: 'Preencha tipo, data, horário, nome e e-mail.' },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true });
}
