import { eq } from 'drizzle-orm';
import { db } from '@/src/db';
import { perfis } from '@/src/db/schema';

export const PAPEIS = ['interprete', 'cliente'] as const;

export type Papel = (typeof PAPEIS)[number];

export function destinoDoPapel(papel: string | null | undefined) {
  return papel === 'interprete' ? '/painel' : '/conta';
}

export async function obterPerfil(userId: string) {
  const [perfil] = await db.select().from(perfis).where(eq(perfis.userId, userId)).limit(1);
  return perfil ?? null;
}

export async function salvarPerfilCliente(dados: {
  userId: string;
  email: string;
  nome: string;
}) {
  await db
    .insert(perfis)
    .values({ ...dados, papel: 'cliente' })
    .onConflictDoNothing({ target: perfis.userId });
}
