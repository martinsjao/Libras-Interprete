import { redirect } from 'next/navigation';
import FormularioCadastro from './formulario';
import { sessaoAtual } from '@/src/lib/auth/sessao';
import { destinoDoPapel } from '@/src/lib/perfil';

export const dynamic = 'force-dynamic';

export default async function CadastroPage() {
  const sessao = await sessaoAtual();
  if (sessao) redirect(destinoDoPapel(sessao.papel));
  return <FormularioCadastro />;
}
