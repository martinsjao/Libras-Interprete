'use server';

import { redirect } from 'next/navigation';
import { auth } from '@/src/lib/auth/server';

export async function sair() {
  await auth.signOut();
  redirect('/');
}
