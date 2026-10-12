'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/src/lib/auth/server';
import { destinoDoPapel, obterPerfil } from '@/src/lib/perfil';
import { mensagemAuth } from '@/src/lib/auth/mensagens';

export async function entrarComEmail(
  _prev: { error: string } | null,
  formData: FormData,
) {
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!email || !password) {
    return { error: 'Informe e-mail e senha.' };
  }

  const { data, error } = await auth.signIn.email({ email, password });

  if (error || !data?.user) {
    return { error: mensagemAuth(error?.message, 'Não foi possível entrar. Tente novamente.') };
  }

  const perfil = await obterPerfil(data.user.id);
  redirect(destinoDoPapel(perfil?.papel));
}
