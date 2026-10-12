'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/src/lib/auth/server';
import { idDoUsuario, mensagemAuth } from '@/src/lib/auth/mensagens';
import { salvarPerfilCliente } from '@/src/lib/perfil';

export async function criarConta(
  _prev: { error: string } | null,
  formData: FormData,
) {
  const nome = String(formData.get('name') ?? '').trim();
  const email = String(formData.get('email') ?? '').trim().toLowerCase();
  const password = String(formData.get('password') ?? '');

  if (!nome || !email || !password) {
    return { error: 'Preencha nome, e-mail e senha.' };
  }

  if (password.length < 8) {
    return { error: 'A senha precisa ter pelo menos 8 caracteres.' };
  }

  const { data, error } = await auth.signUp.email({
    name: nome,
    email,
    password,
  });

  const userId = idDoUsuario(data);

  if (error || !userId) {
    return { error: mensagemAuth(error?.message, 'Não foi possível criar a conta.') };
  }

  try {
    await salvarPerfilCliente({ userId, email, nome });
  } catch (err) {
    console.error(err);
    return {
      error: 'A conta foi criada, mas o perfil não foi salvo. Tente entrar novamente.',
    };
  }

  redirect('/conta');
}
