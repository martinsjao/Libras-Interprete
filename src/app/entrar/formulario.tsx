'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Handshake } from 'lucide-react';
import ThemeToggle from '@/src/components/themeToggle';
import { entrarComEmail } from './actions';

export default function FormularioEntrar() {
  const [state, formAction, pending] = useActionState(entrarComEmail, null);

  return (
    <div className="auth-shell">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-[color-mix(in_srgb,var(--header-bg)_92%,transparent)] shadow-[var(--header-shadow)] backdrop-blur-sm">
        <nav className="flex h-16 w-full items-center justify-between gap-4 px-5 sm:px-8 md:px-10 lg:px-16">
          <Link href="/" className="logo flex items-center no-underline">
            <h1 className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-primary">
              <Handshake className="logo-icon" aria-hidden="true" />
              Libras Interprete
            </h1>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </nav>
      </header>
      <main className="auth-main">
        <form action={formAction} className="auth-card">
          <h2>Entrar</h2>
          <p className="auth-lead">Use o e-mail e a senha da sua conta.</p>

          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input id="email" name="email" type="email" autoComplete="email" required />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              minLength={8}
            />
          </div>

          {state?.error ? <p className="form-feedback error">{state.error}</p> : null}

          <button type="submit" className="btn-primary auth-submit" disabled={pending}>
            {pending ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="auth-switch">
            Ainda não tem conta? <Link href="/cadastro">Criar conta</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
