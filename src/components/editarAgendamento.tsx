import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { toast } from '@/components/ui/toast';
import Calendario from '@/src/components/calendario';
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
} from '@/src/lib/agendamento';
import type { ItemAgendamento } from '@/src/components/listaAgendamentos';

export function EditarAgendamento({
  item,
  aberto,
  onOpenChange,
  onEdit,
}: {
  item: ItemAgendamento;
  aberto: boolean;
  onOpenChange: (aberto: boolean) => void;
  onEdit: (item: ItemAgendamento) => Promise<boolean>;
}) {
  const [slots, setSlots] = useState<SlotOcupado[]>([]);
  const [data, setData] = useState(item.data);
  const [tipo, setTipo] = useState(item.tipo);
  const [horarioInicio, setHorarioInicio] = useState(
    item.horario.split(' - ')[0],
  );
  const [horarioFim, setHorarioFim] = useState(item.horario.split(' - ')[1]);
  const [telefone, setTelefone] = useState(item.telefone ?? '');
  const [carregando, setCarregando] = useState(false);
  const [salvando, setSalvando] = useState(false);

  const slotsDeOutros = slots.filter(
    (slot) => !(slot.data === item.data && slot.horario === item.horario),
  );
  const mapaHorarios = montarMapaHorarios(slotsDeOutros);
  const datasLotadasSet = new Set(datasLotadas(mapaHorarios));
  const horariosOcupados = mapaHorarios.get(data) ?? new Set<string>();
  const horario = `${horarioInicio} - ${horarioFim}`;
  const horarioDisponivel =
    Boolean(horarioInicio && horarioFim) &&
    ![...horariosOcupados].some((ocupado) =>
      intervalosConflitam(horario, ocupado),
    );

  async function carregarDados() {
    setData(item.data);
    setTipo(item.tipo);
    setHorarioInicio(item.horario.split(' - ')[0]);
    setHorarioFim(item.horario.split(' - ')[1]);
    setTelefone(item.telefone ?? '');
    setCarregando(true);
    try {
      const response = await fetch('/api/agendamento');
      if (!response.ok) throw new Error('Não foi possível carregar os horários.');
      const payload = (await response.json()) as { slots?: SlotOcupado[] };
      setSlots(Array.isArray(payload.slots) ? payload.slots : []);
    } catch (error) {
      toast.add({
        type: 'error',
        title: 'Não foi possível editar',
        description:
          error instanceof Error ? error.message : 'Tente novamente.',
      });
      onOpenChange(false);
    } finally {
      setCarregando(false);
    }
  }

  async function salvar(event: React.FormEvent) {
    event.preventDefault();
    if (!horarioDisponivel || !tipo) return;
    setSalvando(true);
    try {
      if (
        await onEdit({
          ...item,
          data,
          tipo,
          horario,
          telefone: telefone || null,
        })
      ) {
        onOpenChange(false);
      }
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Dialog
      open={aberto}
      onOpenChange={(novoAberto) => {
        onOpenChange(novoAberto);
        if (novoAberto) void carregarDados();
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl lg:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar agendamento</DialogTitle>
          <DialogDescription>
            Altere a data, o horário, o serviço ou o telefone.
          </DialogDescription>
        </DialogHeader>

        {carregando ? (
          <div className="flex items-center justify-center py-8">
            <Spinner />
          </div>
        ) : (
          <form onSubmit={salvar} className="flex flex-col gap-6">
            <Calendario
              datasLotadas={datasLotadasSet}
              datasParciais={new Set(mapaHorarios.keys())}
              selectedDate={data}
              onSelectDate={(novaData) => {
                setData(novaData);
                setHorarioInicio('');
                setHorarioFim('');
              }}
            />

            <FieldGroup>
              <Field>
                <FieldLabel htmlFor={`edit-date-${item.id}`}>
                  Data selecionada
                </FieldLabel>
                <Input
                  id={`edit-date-${item.id}`}
                  value={dataFormatadaLonga(data)}
                  readOnly
                  disabled
                />
              </Field>

              <Field>
                <FieldLabel>Tipo de serviço</FieldLabel>
                <Select
                  value={tipo}
                  onValueChange={(value) => setTipo(value ?? '')}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      {TIPOS_SERVICO.map((servico) => (
                        <SelectItem key={servico.value} value={servico.value}>
                          {servico.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>

              <FieldGroup className="grid gap-5 sm:grid-cols-2">
                <Field>
                  <FieldLabel>Horário de início</FieldLabel>
                  <Select
                    value={horarioInicio}
                    onValueChange={(value) => {
                      setHorarioInicio(value ?? '');
                      setHorarioFim('');
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione…" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {HORARIOS_INICIO.map((inicio) => (
                          <SelectItem
                            key={inicio}
                            value={inicio}
                            disabled={HORARIOS_FIM.every(
                              (fim) =>
                                fim <= inicio ||
                                [...horariosOcupados].some((ocupado) =>
                                  intervalosConflitam(
                                    `${inicio} - ${fim}`,
                                    ocupado,
                                  ),
                                ),
                            )}
                          >
                            {inicio}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>

                <Field>
                  <FieldLabel>Horário de fim</FieldLabel>
                  <Select
                    value={horarioFim}
                    onValueChange={(value) => setHorarioFim(value ?? '')}
                    disabled={!horarioInicio}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecione…" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {HORARIOS_FIM.filter((fim) => fim > horarioInicio).map(
                          (fim) => (
                            <SelectItem
                              key={fim}
                              value={fim}
                              disabled={[...horariosOcupados].some((ocupado) =>
                                intervalosConflitam(
                                  `${horarioInicio} - ${fim}`,
                                  ocupado,
                                ),
                              )}
                            >
                              {fim}
                            </SelectItem>
                          ),
                        )}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              </FieldGroup>

              <Field>
                <FieldLabel htmlFor={`edit-phone-${item.id}`}>
                  Telefone
                </FieldLabel>
                <Input
                  id={`edit-phone-${item.id}`}
                  type="tel"
                  inputMode="numeric"
                  maxLength={15}
                  value={telefone}
                  onChange={(event) =>
                    setTelefone(formatarTelefone(event.target.value))
                  }
                />
              </Field>
            </FieldGroup>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={salvando}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={salvando || !horarioDisponivel || !tipo}
              >
                {salvando ? (
                  <>
                    <Spinner data-icon="inline-start" /> Salvando...
                  </>
                ) : (
                  'Salvar alterações'
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
