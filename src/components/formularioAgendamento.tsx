'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CircleAlertIcon, CircleCheckIcon } from 'lucide-react';
import Calendario from './calendario';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  HORARIOS,
  TIPOS_SERVICO,
  dataFormatadaLonga,
  datasLotadas,
  montarMapaHorarios,
  type SlotOcupado,
} from '@/src/lib/agendamento';

export default function FormularioAgendamento({
  nomePadrao,
  emailPadrao,
}: {
  nomePadrao: string;
  emailPadrao: string;
}) {
  const router = useRouter();
  const [slots, setSlots] = useState<SlotOcupado[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [observations, setObservations] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const mapaHorarios = useMemo(() => montarMapaHorarios(slots), [slots]);
  const datasLotadasSet = useMemo(
    () => new Set(datasLotadas(mapaHorarios)),
    [mapaHorarios],
  );
  const datasParciaisSet = useMemo(() => {
    const parciais = new Set<string>();
    for (const [data, horarios] of mapaHorarios) {
      if (horarios.size > 0 && !datasLotadasSet.has(data)) {
        parciais.add(data);
      }
    }
    return parciais;
  }, [mapaHorarios, datasLotadasSet]);

  const horariosOcupadosNaData = useMemo(() => {
    if (!selectedDate) return new Set<string>();
    return mapaHorarios.get(selectedDate) ?? new Set<string>();
  }, [mapaHorarios, selectedDate]);

  const horarioSelecionado =
    timeSlot && !horariosOcupadosNaData.has(timeSlot) ? timeSlot : '';

  useEffect(() => {
    let ativo = true;

    async function carregarSlots() {
      try {
        const res = await fetch('/api/agendamento');
        if (!res.ok) return;
        const payload = (await res.json()) as { slots?: SlotOcupado[] };
        if (ativo && Array.isArray(payload.slots)) {
          setSlots(payload.slots);
        }
      } catch {
        // Calendar stays interactive even if booked slots fail to load.
      }
    }

    void carregarSlots();
    return () => {
      ativo = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!selectedDate) {
      setErro('Selecione uma data no calendário.');
      return;
    }

    if (!serviceType) {
      setErro('Selecione o tipo de serviço.');
      return;
    }

    if (!horarioSelecionado) {
      setErro('Selecione um horário disponível.');
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch('/api/agendamento', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tipo: serviceType,
          data: selectedDate,
          horario: horarioSelecionado,
          telefone: clientPhone,
          observations,
        }),
      });

      if (res.status === 401) {
        throw new Error('Faça login para confirmar o agendamento.');
      }

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error || 'Falha ao salvar');
      }

      setSlots((atual) => [
        ...atual,
        { data: selectedDate, horario: horarioSelecionado },
      ]);

      setSucesso(
        `Agendamento confirmado para ${nomePadrao} em ${dataFormatadaLonga(selectedDate)}, ${horarioSelecionado}.`,
      );

      setSelectedDate(null);
      setServiceType('');
      setTimeSlot('');
      setClientPhone('');
      setObservations('');
      router.refresh();
    } catch (err) {
      console.error(err);
      setErro(
        err instanceof Error
          ? err.message
          : 'Erro ao confirmar agendamento. Tente novamente.',
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-start">
      <Card>
        <CardHeader>
          <CardTitle>Escolha a data</CardTitle>
          <CardDescription>
            Só o horário reservado fica indisponível. Você pode agendar no mesmo
            dia em outro horário livre.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Calendario
            datasLotadas={datasLotadasSet}
            datasParciais={datasParciaisSet}
            selectedDate={selectedDate}
            onSelectDate={(data) => {
              setSelectedDate(data);
              setTimeSlot('');
              setErro('');
              setSucesso('');
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dados do agendamento</CardTitle>
          <CardDescription>
            Horários já ocupados por outros clientes ficam desabilitados.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="serviceType">Tipo de serviço</FieldLabel>
                <Select
                  items={[...TIPOS_SERVICO]}
                  value={serviceType || null}
                  onValueChange={(value) => setServiceType(value ?? '')}
                >
                  <SelectTrigger id="serviceType" className="w-full">
                    <SelectValue placeholder="Selecione..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {TIPOS_SERVICO.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="selectedDate">Data selecionada</FieldLabel>
                <Input
                  id="selectedDate"
                  type="text"
                  value={selectedDate ? dataFormatadaLonga(selectedDate) : ''}
                  placeholder="Clique em um dia com vagas no calendário"
                  readOnly
                />
              </Field>

              <Field>
                <FieldLabel>Horário</FieldLabel>
                <ToggleGroup
                  variant="outline"
                  spacing={2}
                  className="flex w-full flex-wrap"
                  value={horarioSelecionado ? [horarioSelecionado] : []}
                  onValueChange={(values) => setTimeSlot(values[0] ?? '')}
                  disabled={!selectedDate}
                >
                  {HORARIOS.map((horario) => {
                    const ocupado = horariosOcupadosNaData.has(horario);
                    return (
                      <ToggleGroupItem
                        key={horario}
                        value={horario}
                        aria-label={horario}
                        disabled={!selectedDate || ocupado}
                        className="min-w-[7.5rem] flex-1"
                      >
                        {horario}
                        {ocupado ? ' · ocupado' : ''}
                      </ToggleGroupItem>
                    );
                  })}
                </ToggleGroup>
              </Field>

              <Field>
                <FieldLabel htmlFor="clientName">Seu nome</FieldLabel>
                <Input
                  id="clientName"
                  type="text"
                  value={nomePadrao}
                  readOnly
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="clientEmail">E-mail</FieldLabel>
                <Input
                  id="clientEmail"
                  type="email"
                  value={emailPadrao}
                  readOnly
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="clientPhone">Telefone</FieldLabel>
                <Input
                  id="clientPhone"
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="(11) 99999-9999"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="observations">Observações</FieldLabel>
                <Textarea
                  id="observations"
                  rows={3}
                  value={observations}
                  onChange={(e) => setObservations(e.target.value)}
                />
              </Field>

              {erro ? (
                <Alert variant="destructive">
                  <CircleAlertIcon />
                  <AlertTitle>Não foi possível agendar</AlertTitle>
                  <AlertDescription>{erro}</AlertDescription>
                </Alert>
              ) : null}

              {sucesso ? (
                <Alert>
                  <CircleCheckIcon />
                  <AlertTitle>Agendamento confirmado</AlertTitle>
                  <AlertDescription>{sucesso}</AlertDescription>
                </Alert>
              ) : null}
            </FieldGroup>
          </CardContent>
          <CardFooter className="justify-end border-t-0 bg-transparent">
            <Button
              type="submit"
              size="lg"
              disabled={enviando}
              className="w-full sm:w-auto"
            >
              {enviando ? <Spinner data-icon="inline-start" /> : null}
              {enviando ? 'Enviando...' : 'Confirmar agendamento'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
