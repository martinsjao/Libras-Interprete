'use client';
import Link from 'next/link';
import { useState } from 'react';
import ThemeToggle from '@/src/components/themeToggle';

export default function MenuMobile({
  entrarHref,
  entrarLabel,
}: {
  entrarHref: string;
  entrarLabel: string;
}) {
  const [aberto, setAberto] = useState(false);

  const linkClass =
    'font-medium text-foreground no-underline transition-colors hover:text-primary';

  const contaClass =
    'inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground no-underline transition-colors hover:bg-(--primary-hover) active:scale-95';

  return (
    <>
      <ul
        id="menu-principal"
        className={[
          'list-none items-center justify-center gap-8',
          'md:col-start-2 md:flex md:justify-self-center',
          aberto
            ? 'absolute inset-x-0 top-16 z-40 flex flex-col gap-4 border-b border-border bg-(--header-bg) px-5 py-5 shadow-(--header-shadow) sm:px-8'
            : 'hidden',
        ].join(' ')}
      >
        <li>
          <a href="#home" className={linkClass} onClick={() => setAberto(false)}>
            Início
          </a>
        </li>
        <li>
          <a
            href="#services"
            className={linkClass}
            onClick={() => setAberto(false)}
          >
            Serviços
          </a>
        </li>
        <li>
          <a
            href="#schedule"
            className={linkClass}
            onClick={() => setAberto(false)}
          >
            Agendamento
          </a>
        </li>
        <li>
          <a
            href="#contact"
            className={linkClass}
            onClick={() => setAberto(false)}
          >
            Contato
          </a>
        </li>
        <li className="md:hidden">
          <Link
            href={entrarHref}
            className={contaClass}
            onClick={() => setAberto(false)}
          >
            {entrarLabel}
          </Link>
        </li>
      </ul>

      <div className="flex items-center justify-end gap-3 justify-self-end md:col-start-3">
        <ThemeToggle />
        <Link href={entrarHref} className={`${contaClass} hidden md:inline-flex`}>
          {entrarLabel}
        </Link>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-lg border border-border bg-(--toggle-bg) outline-none transition-colors hover:bg-muted focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 md:hidden"
          aria-expanded={aberto}
          aria-controls="menu-principal"
          aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
          onClick={() => setAberto(!aberto)}
        >
          <span className="flex w-4 flex-col gap-1" aria-hidden="true">
            <span className="block h-0.5 w-full rounded-full bg-foreground" />
            <span className="block h-0.5 w-full rounded-full bg-foreground" />
            <span className="block h-0.5 w-full rounded-full bg-foreground" />
          </span>
        </button>
      </div>
    </>
  );
}
