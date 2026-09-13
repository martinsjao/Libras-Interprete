'use client';
import { useState } from 'react';

export default function FormularioContato() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
    setNome('');
    setEmail('');
    setMensagem('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
      <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <textarea placeholder="Mensagem" value={mensagem} onChange={(e) => setMensagem(e.target.value)} required />
      <button type="submit">Enviar Mensagem</button>
    </form>
  );
}