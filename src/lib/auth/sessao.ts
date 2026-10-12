import { redirect } from 'next/navigation';
import { auth } from '@/src/lib/auth/server';
import { destinoDoPapel, obterPerfil, type Papel } from '@/src/lib/perfil';

export async function sessaoAtual() {
  try {
    const { data, error } = await auth.getSession();
    if (error || !data?.user) return null;

    const perfil = await obterPerfil(data.user.id);
    const papelAuth = typeof data.user.role === 'string' ? data.user.role : '';
    const papel: Papel =
      perfil?.papel === 'interprete' || papelAuth === 'admin' ? 'interprete' : 'cliente';

    return { user: data.user, perfil, papel };
  } catch {
    return null;
  }
}

export async function exigirSessao() {
  const sessao = await sessaoAtual();
  if (!sessao) redirect('/entrar');
  return sessao;
}

export async function exigirPapel(esperado: Papel) {
  const sessao = await exigirSessao();
  if (sessao.papel !== esperado) redirect(destinoDoPapel(sessao.papel));
  return sessao;
}
