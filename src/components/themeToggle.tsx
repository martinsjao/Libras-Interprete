'use client';

import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

const STORAGE_KEY = 'libras-theme';

function aplicarTema(escuro: boolean) {
  document.documentElement.classList.toggle('dark', escuro);
  document.documentElement.dataset.theme = escuro ? 'dark' : 'light';
  localStorage.setItem(STORAGE_KEY, escuro ? 'dark' : 'light');
}

export default function ThemeToggle() {
  const [escuro, setEscuro] = useState(false);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    // Hydrate from DOM theme set by beforeInteractive script (SSR-safe).
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client sync after mount
    setEscuro(document.documentElement.classList.contains('dark'));
    setMontado(true);
  }, []);

  function alternar() {
    const proximo = !escuro;
    setEscuro(proximo);
    aplicarTema(proximo);
  }

  return (
    <button
      type="button"
      className="grid size-10 place-items-center rounded-full border border-border bg-[var(--toggle-bg)] text-foreground disabled:opacity-60 [&_svg]:size-[1.15rem] [&_svg]:stroke-2"
      onClick={alternar}
      aria-label={escuro ? 'Ativar modo claro' : 'Ativar modo escuro'}
      title={escuro ? 'Modo claro' : 'Modo escuro'}
    >
      {montado && escuro ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </button>
  );
}
