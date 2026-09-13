'use client';
import { useState } from 'react';

export default function MenuMobile() {
  const [aberto, setAberto] = useState(false);

  return (
    <>
      <button className="menu-mobile" onClick={() => setAberto(!aberto)}>
        ☰
      </button>
      <nav className={`nav-links ${aberto ? 'active' : ''}`}>
        <a href="#home" onClick={() => setAberto(false)}>Início</a>
        <a href="#services" onClick={() => setAberto(false)}>Serviços</a>
        <a href="#schedule" onClick={() => setAberto(false)}>Agendamento</a>
        <a href="#contact" onClick={() => setAberto(false)}>Contato</a>
      </nav>
    </>
  );
}