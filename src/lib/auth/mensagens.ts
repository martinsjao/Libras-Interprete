export function mensagemAuth(message: string | undefined, fallback: string) {
  const texto = message?.toLowerCase() ?? '';

  if (
    texto.includes('invalid email or password') ||
    texto.includes('invalid credentials') ||
    texto.includes('invalid password')
  ) {
    return 'E-mail ou senha incorretos.';
  }

  if (texto.includes('already') || texto.includes('exist')) {
    return 'Já existe uma conta com este e-mail.';
  }

  if (texto.includes('password') && (texto.includes('short') || texto.includes('least') || texto.includes('8'))) {
    return 'A senha precisa ter pelo menos 8 caracteres.';
  }

  return message || fallback;
}

export function idDoUsuario(data: unknown) {
  if (!data || typeof data !== 'object' || !('user' in data)) return null;
  const user = data.user;
  if (!user || typeof user !== 'object' || !('id' in user)) return null;
  return typeof user.id === 'string' && user.id ? user.id : null;
}
