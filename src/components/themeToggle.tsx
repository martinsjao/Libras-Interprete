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
      className="theme-toggle"
      onClick={alternar}
      aria-label={escuro ? 'Ativar modo claro' : 'Ativar modo escuro'}
      title={escuro ? 'Modo claro' : 'Modo escuro'}
    >
      {montado && escuro ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </button>
  );
}
