'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import { Handshake } from 'lucide-react';
import ThemeToggle from '@/src/components/themeToggle';
import { Button } from '@/components/ui/button';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { criarConta } from './actions';

export default function FormularioCadastro() {
  const [state, formAction, pending] = useActionState(criarConta, null);

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-(--header-bg)/92 shadow-(--header-shadow) backdrop-blur-sm">
        <nav className="flex h-16 w-full items-center justify-between gap-4 px-5 sm:px-8 md:px-10 lg:px-16">
          <Link
            href="/"
            className="flex items-center gap-2.5 text-lg font-semibold tracking-tight text-primary no-underline"
          >
            <Handshake className="size-5" aria-hidden="true" />
            <span>Libras Interprete</span>
          </Link>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </nav>
      </header>
      <main className="grid place-items-center px-5 pb-12 pt-28">
        <form
          action={formAction}
          className="w-full max-w-md rounded-2xl border border-border bg-(--surface) p-8 shadow-(--card-shadow)"
        >
          <h1 className="mb-1 text-3xl font-semibold tracking-tight text-primary">
            Criar conta
          </h1>
          <p className="mb-6 text-muted-foreground">
            Crie sua conta de cliente para agendar interpretações em Libras.
          </p>

          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">Nome</FieldLabel>
              <Input id="name" name="name" type="text" autoComplete="name" required />
            </Field>

            <Field>
              <FieldLabel htmlFor="email">E-mail</FieldLabel>
              <Input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                spellCheck={false}
                required
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="password">Senha</FieldLabel>
              <Input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                minLength={8}
              />
            </Field>

            {state?.error ? <FieldError>{state.error}</FieldError> : null}

            <Button type="submit" className="mt-1 w-full" disabled={pending}>
              {pending ? 'Criando conta…' : 'Criar conta'}
            </Button>
          </FieldGroup>

          <p className="mt-4 text-center text-muted-foreground">
            Já tem conta?{' '}
            <Link href="/entrar" className="font-semibold text-primary">
              Entrar
            </Link>
          </p>
        </form>
      </main>
    </div>
  );
}
