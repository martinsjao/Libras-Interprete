'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="contatoNome">Nome</FieldLabel>
          <Input
            id="contatoNome"
            name="name"
            autoComplete="name"
            placeholder="Seu nome…"
            value={nome}
            onChange={(e) => {
              setNome(e.target.value);
              setEnviado(false);
            }}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="contatoEmail">E-mail</FieldLabel>
          <Input
            id="contatoEmail"
            name="email"
            type="email"
            autoComplete="email"
            spellCheck={false}
            placeholder="voce@email.com…"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEnviado(false);
            }}
            required
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="contatoMensagem">Mensagem</FieldLabel>
          <Textarea
            id="contatoMensagem"
            name="message"
            rows={4}
            autoComplete="off"
            placeholder="Como podemos ajudar?…"
            value={mensagem}
            onChange={(e) => {
              setMensagem(e.target.value);
              setEnviado(false);
            }}
            required
          />
        </Field>
      </FieldGroup>
      <Button type="submit">Enviar mensagem</Button>
      {enviado ? (
        <p
          role="status"
          aria-live="polite"
          className="rounded-lg bg-(--success-bg) px-4 py-3 font-medium text-(--success-text)"
        >
          Mensagem enviada com sucesso! Entraremos em contato em breve.
        </p>
      ) : null}
    </form>
  );
}
