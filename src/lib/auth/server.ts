import { createNeonAuth } from '@neondatabase/auth/next/server';

const baseUrl = process.env.NEON_AUTH_BASE_URL!;

// Neon Auth rejeita origens fora da lista. A aplicação autentica como
// localhost para o endereço de quem abre o site não impedir o login.
const origemAceita = 'http://localhost:3000';
const marca = '__librasAuthFetch';

type GlobalComMarca = typeof globalThis & { [marca]?: true };

const globalMarcado = globalThis as GlobalComMarca;

if (!globalMarcado[marca]) {
  globalMarcado[marca] = true;
  const fetchOriginal = globalThis.fetch.bind(globalThis);

  globalThis.fetch = (input, init) => {
    const url =
      typeof input === 'string' ? input : input instanceof URL ? input.toString() : input.url;

    if (!url.startsWith(baseUrl)) {
      return fetchOriginal(input, init);
    }

    const headers = new Headers(init?.headers ?? (input instanceof Request ? input.headers : undefined));
    headers.set('Origin', origemAceita);

    return fetchOriginal(input, { ...init, headers });
  };
}

export const auth = createNeonAuth({
  baseUrl,
  cookies: {
    secret: process.env.NEON_AUTH_COOKIE_SECRET!,
  },
});
