"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import {
  HORARIOS_FIM,
  HORARIOS_INICIO,
  TIPOS_SERVICO,
  dataFormatadaLonga,
  datasLotadas,
  formatarTelefone,
  intervalosConflitam,
  montarMapaHorarios,
  type SlotOcupado,
} from "@/src/lib/agendamento";
import { CircleAlertIcon, CircleCheckIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import Calendario from "./calendario";

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
  const [serviceType, setServiceType] = useState("");
  const [initialHour, setInitialHour] = useState("");
  const [finalHour, setFinalHour] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [observations, setObservations] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");

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
    initialHour && finalHour ? `${initialHour} - ${finalHour}` : "";
  const horarioDisponivel =
    horarioSelecionado &&
    ![...horariosOcupadosNaData].some((horario) =>
      intervalosConflitam(horarioSelecionado, horario),
    )
      ? horarioSelecionado
      : "";
  const horariosFimDisponiveis = HORARIOS_FIM.filter(
    (horario) => !initialHour || horario > initialHour,
  );

  useEffect(() => {
    let ativo = true;

    async function carregarSlots() {
      try {
        const res = await fetch("/api/agendamento");
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
    setErro("");
    setSucesso("");

    if (!selectedDate) {
      setErro("Selecione uma data no calendário.");
      return;
    }

    if (!serviceType) {
      setErro("Selecione o tipo de serviço.");
      return;
    }

    if (!horarioDisponivel) {
      setErro("Selecione um horário disponível.");
      return;
    }

    setEnviando(true);
    try {
      const res = await fetch("/api/agendamento", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tipo: serviceType,
          data: selectedDate,
          horario: horarioDisponivel,
          telefone: clientPhone,
          observations,
        }),
      });

      if (res.status === 401) {
        throw new Error("Faça login para confirmar o agendamento.");
      }

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error || "Falha ao salvar");
      }

      setSlots((atual) => [
        ...atual,
        { data: selectedDate, horario: horarioDisponivel },
      ]);

      setSucesso(
        `Agendamento confirmado para ${nomePadrao} em ${dataFormatadaLonga(selectedDate)}, ${horarioDisponivel}.`,
      );

      setSelectedDate(null);
      setServiceType("");
      setInitialHour("");
      setFinalHour("");
      setClientPhone("");
      setObservations("");
      router.refresh();
    } catch (err) {
      console.error(err);
      setErro(
        err instanceof Error
          ? err.message
          : "Erro ao confirmar agendamento. Tente novamente.",
      );
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Escolha a data</CardTitle>
          <CardDescription>
            Só o horário reservado fica indisponível. Você pode agendar no mesmo
            dia em outro horário livre.
          </CardDescription>
        </CardHeader>
        <CardContent className="mt-2 flex min-h-0 flex-1 flex-col">
          <Calendario
            datasLotadas={datasLotadasSet}
            datasParciais={datasParciaisSet}
            selectedDate={selectedDate}
            onSelectDate={(data) => {
              setSelectedDate(data);
              setInitialHour("");
              setFinalHour("");
              setErro("");
              setSucesso("");
            }}
          />
        </CardContent>
      </Card>

      <Card className="h-full">
        <CardHeader>
          <CardTitle>Dados do agendamento</CardTitle>
          <CardDescription>
            Horários já ocupados por outros clientes ficam desabilitados.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit} className="flex min-h-0 flex-1 flex-col">
          <CardContent className="flex-1">
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="serviceType">Tipo de serviço</FieldLabel>
                <Select
                  items={[...TIPOS_SERVICO]}
                  value={serviceType || null}
                  onValueChange={(value) => setServiceType(value ?? "")}
                >
                  <SelectTrigger id="serviceType" className="w-full">
                    <SelectValue placeholder="Selecione…" />
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
                  value={selectedDate ? dataFormatadaLonga(selectedDate) : ""}
                  placeholder="Clique em um dia com vagas no calendário"
                  readOnly
                />
              </Field>

              <FieldGroup className="grid gap-5 sm:grid-cols-2">
                <Field data-disabled={!selectedDate}>
                  <FieldLabel htmlFor="initialHour">
                    Horário de início
                  </FieldLabel>
                  <Select
                    items={HORARIOS_INICIO.map((horario) => ({
                      label: horario,
                      value: horario,
                    }))}
                    value={initialHour || null}
                    onValueChange={(value) => {
                      const inicio = value ?? "";
                      setInitialHour(inicio);
                      const novoIntervalo = finalHour
                        ? `${inicio} - ${finalHour}`
                        : "";
                      const fimIndisponivel =
                        !inicio ||
                        !finalHour ||
                        inicio >= finalHour ||
                        [...horariosOcupadosNaData].some((existente) =>
                          intervalosConflitam(novoIntervalo, existente),
                        );

                      if (fimIndisponivel) {
                        setFinalHour("");
                      }
                    }}
                    disabled={!selectedDate}
                  >
                    <SelectTrigger id="initialHour" className="w-full">
                      <SelectValue placeholder="Selecione…" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {HORARIOS_INICIO.map((horario) => (
                          <SelectItem
                            key={horario}
                            value={horario}
                            disabled={
                              !selectedDate ||
                              HORARIOS_FIM.every(
                                (fim) =>
                                  fim <= horario ||
                                  [...horariosOcupadosNaData].some((ocupado) =>
                                    intervalosConflitam(
                                      `${horario} - ${fim}`,
                                      ocupado,
                                    ),
                                  ),
                              )
                            }
                          >
                            {horario}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field data-disabled={!selectedDate || !initialHour}>
                  <FieldLabel htmlFor="finalHour">Horário de fim</FieldLabel>
                  <Select
                    items={horariosFimDisponiveis.map((horario) => ({
                      label: horario,
                      value: horario,
                    }))}
                    value={finalHour || null}
                    onValueChange={(value) => setFinalHour(value ?? "")}
                    disabled={!selectedDate || !initialHour}
                  >
                    <SelectTrigger id="finalHour" className="w-full">
                      <SelectValue placeholder="Selecione…" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {horariosFimDisponiveis.map((horario) => {
                          const intervalo = `${initialHour} - ${horario}`;
                          const ocupado = [...horariosOcupadosNaData].some(
                            (existente) =>
                              intervalosConflitam(intervalo, existente),
                          );
                          return (
                            <SelectItem
                              key={horario}
                              value={horario}
                              disabled={ocupado}
                            >
                              {horario}
                              {ocupado ? " · ocupado" : ""}
                            </SelectItem>
                          );
                        })}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>

              <Field>
                <FieldLabel htmlFor="clientName">Seu nome</FieldLabel>
                <Input
                  id="clientName"
                  name="clientName"
                  type="text"
                  autoComplete="name"
                  value={nomePadrao}
                  readOnly
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="clientEmail">E-mail</FieldLabel>
                <Input
                  id="clientEmail"
                  name="clientEmail"
                  type="email"
                  autoComplete="email"
                  spellCheck={false}
                  value={emailPadrao}
                  readOnly
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="clientPhone">Telefone</FieldLabel>
                <Input
                  id="clientPhone"
                  name="clientPhone"
                  type="tel"
                  autoComplete="tel"
                  inputMode="numeric"
                  maxLength={15}
                  value={clientPhone}
                  onChange={(e) =>
                    setClientPhone(formatarTelefone(e.target.value))
                  }
                  placeholder="(11) 99999-9999…"
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="observations">Observações</FieldLabel>
                <Textarea
                  id="observations"
                  name="observations"
                  rows={3}
                  autoComplete="off"
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
              {enviando ? "Enviando…" : "Confirmar agendamento"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
