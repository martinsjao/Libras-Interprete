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
import { toast } from '@/components/ui/toast';
import { useRouter } from 'next/navigation';

export default function ContaCliente({
  itens,
  nomePadrao,
  emailPadrao,
}: {
  itens: ItemAgendamento[];
  nomePadrao: string;
  emailPadrao: string;
}) {
  const router = useRouter();
  const [cancelados, setCancelados] = useState<Set<number>>(() => new Set());
  const [aba, setAba] = useState(itens.length === 0 ? 'agendar' : 'meus');
  const agendamentos = itens.filter((item) => !cancelados.has(item.id));

  async function cancelarAgendamento(id: number) {
    try {
      const response = await fetch(`/api/agendamento/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error || 'Não foi possível cancelar o horário.');
      }

      setCancelados((atual) => new Set(atual).add(id));
      toast.add({
        type: 'success',
        title: 'Horário cancelado',
        description: 'O horário foi cancelado e liberado para novos agendamentos.',
      });
      router.refresh();
      return true;
    } catch (error) {
      console.error(error);
      toast.add({
        type: 'error',
        title: 'Não foi possível cancelar',
        description:
          error instanceof Error
            ? error.message
            : 'Ocorreu um erro ao cancelar o horário. Tente novamente.',
      });
      return false;
    }
  }

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
              itens={agendamentos}
              mostrarCliente={false}
              onCancel={cancelarAgendamento}
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
