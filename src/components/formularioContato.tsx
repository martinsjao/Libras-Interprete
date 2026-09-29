'use client';
import { useState } from 'react';

export default function FormularioContato() {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [mensagem, setMensagem] = useState('');
  const [enviado, setEnviado] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnviado(true);
    setNome('');
    setEmail('');
    setMensagem('');
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="contatoNome">Nome</label>
        <input
          id="contatoNome"
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => {
            setNome(e.target.value);
            setEnviado(false);
          }}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="contatoEmail">E-mail</label>
        <input
          id="contatoEmail"
          type="email"
          placeholder="voce@email.com"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            setEnviado(false);
          }}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="contatoMensagem">Mensagem</label>
        <textarea
          id="contatoMensagem"
          rows={4}
          placeholder="Como podemos ajudar?"
          value={mensagem}
          onChange={(e) => {
            setMensagem(e.target.value);
            setEnviado(false);
          }}
          required
        />
      </div>
      <button className="btn-primary" type="submit">
        Enviar mensagem
      </button>
      {enviado ? (
        <p className="form-feedback success">
          Mensagem enviada com sucesso! Entraremos em contato em breve.
        </p>
      ) : null}
    </form>
  );
}
