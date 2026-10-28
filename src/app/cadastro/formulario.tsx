"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import ThemeToggle from "@/src/components/themeToggle";
import { Eye, EyeOff, Handshake } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useActionState, useState } from "react";
import { criarConta } from "./actions";

export default function FormularioCadastro() {
  const [state, formAction, pending] = useActionState(criarConta, null);
  const [senhaVisivel, setSenhaVisivel] = useState(false);

  return (
    <div className="min-h-dvh bg-background">
      <header className="absolute inset-x-0 top-0 z-20">
        <nav className="flex h-16 w-full items-center justify-end px-5 sm:px-8 md:px-10 lg:px-16">
          <ThemeToggle />
        </nav>
      </header>

      <main className="grid min-h-dvh grid-cols-1 lg:h-dvh lg:min-h-0 lg:grid-cols-2 lg:overflow-hidden">
        <section className="flex items-center justify-center px-5 pt-24 pb-12 sm:px-8 lg:px-12 lg:pt-16">
          <form action={formAction} className="w-full max-w-md">
            <Handshake
              className="mb-2 size-8 text-primary"
              aria-hidden="true"
            />
            <h1 className="mb-1 text-3xl font-semibold tracking-tight text-primary">
              Criar conta
            </h1>
            <p className="mb-6 text-muted-foreground">
              Crie sua conta de cliente para agendar interpretações em Libras.
            </p>

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="name">Nome</FieldLabel>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  placeholder="Fulano da Silva"
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="email">E-mail</FieldLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="fulano@exemplo.com"
                  spellCheck={false}
                  required
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="password">Senha</FieldLabel>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={senhaVisivel ? "text" : "password"}
                    autoComplete="new-password"
                    placeholder="••••••••"
                    required
                    minLength={8}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    className="absolute top-1/2 right-2.5 -translate-y-1/2 rounded-md p-1 text-muted-foreground transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
                    onClick={() => setSenhaVisivel((visivel) => !visivel)}
                    aria-label={senhaVisivel ? "Ocultar senha" : "Visualizar senha"}
                    aria-pressed={senhaVisivel}
                  >
                    {senhaVisivel ? (
                      <EyeOff className="size-4" aria-hidden="true" />
                    ) : (
                      <Eye className="size-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
              </Field>

              {state?.error ? <FieldError>{state.error}</FieldError> : null}

              <Button
                type="submit"
                className="mt-1 w-full"
                disabled={pending}
                size="lg"
              >
                {pending ? "Criando conta…" : "Criar conta"}
              </Button>
            </FieldGroup>

            <p className="mt-4 text-center text-muted-foreground">
              Já tem conta?{" "}
              <Link href="/entrar" className="font-semibold text-primary">
                Entrar
              </Link>
            </p>
          </form>
        </section>

        <section
          className="relative min-h-72 overflow-hidden rounded-xl bg-primary lg:m-4 lg:h-[calc(100dvh-2rem)] lg:min-h-0"
          aria-label="Libras Interprete"
        >
          <Image
            src="/authentication/create-account-img.jpg"
            alt="Imagem ilustrativa para criação de conta"
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 50vw"
            className="object-cover"
          />

          <div className="absolute inset-0 bg-linear-to-b from-transparent to-background/80" />

          <div className="absolute top-0 left-0 pt-8 pl-8 sm:pl-12 lg:pl-16">
            <Link
              href="/"
              className="flex tracking-tight text-foreground no-underline"
            >
              <Handshake className="size-14" aria-hidden="true" />
            </Link>
          </div>

          <div className="absolute right-0 bottom-0 left-0 p-8 text-foreground sm:p-12 lg:p-16">
            <div className="max-w-md">
              <p className="mb-3 text-sm font-medium tracking-[0.18em] text-foreground/75 uppercase">
                Libras Interprete
              </p>
              <h2 className="text-3xl leading-tight font-semibold tracking-tight sm:text-4xl">
                Comunicação que aproxima pessoas.
              </h2>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
