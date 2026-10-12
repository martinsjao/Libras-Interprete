import { auth } from '@/src/lib/auth/server';

export default auth.middleware({
  loginUrl: '/entrar',
});

export const config = {
  matcher: ['/painel/:path*', '/conta/:path*'],
};
