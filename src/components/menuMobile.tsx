'use client';
import { useState } from 'react';

export default function MenuMobile() {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button
        type="button"
        className="menu-mobile"
        aria-expanded={aberto}
        aria-label={aberto ? 'Fechar menu' : 'Abrir menu'}
        onClick={() => setAberto(!aberto)}
      >
        <span />
        <span />
        <span />
      </button>
      <ul className={`nav-links ${aberto ? 'active' : ''}`}>
        <li>
          <a href="#home" onClick={() => setAberto(false)}>
            Início
          </a>
        </li>
        <li>
          <a href="#services" onClick={() => setAberto(false)}>
            Serviços
          </a>
        </li>
        <li>
          <a href="#schedule" onClick={() => setAberto(false)}>
            Agendamento
          </a>
        </li>
        <li>
          <a href="#contact" onClick={() => setAberto(false)}>
            Contato
          </a>
        </li>
      </ul>
    </>
  );
}
