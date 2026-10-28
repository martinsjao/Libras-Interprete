'use client';

import { useState } from 'react';
import { CalendarPlusIcon, ListIcon } from 'lucide-react';
import FormularioAgendamento from '@/src/components/formularioAgendamento';
import ListaAgendamentos, {
  type ItemAgendamento,
} from '@/src/components/listaAgendamentos';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ContaCliente({
  itens,
  nomePadrao,
  emailPadrao,
}: {
  itens: ItemAgendamento[];
  nomePadrao: string;
  emailPadrao: string;
}) {
  const [aba, setAba] = useState(itens.length === 0 ? 'agendar' : 'meus');

  return (
    <Tabs
      value={aba}
      onValueChange={(valor) => {
        if (typeof valor === 'string') setAba(valor);
      }}
      className="gap-6"
    >
      <TabsList className="w-full max-w-md">
        <TabsTrigger value="meus">
          <ListIcon data-icon="inline-start" aria-hidden="true" />
          Meus agendamentos
        </TabsTrigger>
        <TabsTrigger value="agendar">
          <CalendarPlusIcon data-icon="inline-start" aria-hidden="true" />
          Novo agendamento
        </TabsTrigger>
      </TabsList>

      <TabsContent value="meus" className="flex flex-col gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Seus próximos horários</CardTitle>
            <CardDescription>
              Consulte aqui tudo o que você já agendou.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ListaAgendamentos
              itens={itens}
              mostrarCliente={false}
              vazio="Você ainda não tem agendamentos. Use a aba Novo agendamento."
            />
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="agendar">
        <FormularioAgendamento
          nomePadrao={nomePadrao}
          emailPadrao={emailPadrao}
        />
      </TabsContent>
    </Tabs>
  );
}
