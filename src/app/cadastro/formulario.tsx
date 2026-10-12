'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Handshake } from 'lucide-react';
import ThemeToggle from '@/src/components/themeToggle';
import { criarConta } from './actions';

export default function FormularioCadastro() {
  const [state, formAction, pending] = useActionState(criarConta, null);

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
          <h2>Criar conta</h2>
          <p className="auth-lead">
            Crie sua conta de cliente para agendar interpretações em Libras.
          </p>

          <div className="form-group">
            <label htmlFor="name">Nome</label>
            <input id="name" name="name" type="text" autoComplete="name" required />
          </div>

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
              autoComplete="new-password"
              required
              minLength={8}
            />
          </div>

          {state?.error ? <p className="form-feedback error">{state.error}</p> : null}

          <button type="submit" className="btn-primary auth-submit" disabled={pending}>
            {pending ? 'Criando conta...' : 'Criar conta'}
          </button>

          <p className="auth-switch">
            Já tem conta? <Link href="/entrar">Entrar</Link>
          </p>
        </form>
      </main>
    </div>
  );
}
