'use client';
import { useEffect, useState } from 'react';
import Calendario from './calendario';

const BOOKED_KEY = 'libras-booked-dates';
const HORARIOS = [
  '08:00 - 09:00',
  '09:00 - 10:00',
  '10:00 - 11:00',
  '11:00 - 12:00',
  '13:00 - 14:00',
  '14:00 - 15:00',
  '15:00 - 16:00',
  '16:00 - 17:00',
  '17:00 - 18:00',
];

function carregarDatas(): Set<string> {
  try {
    const bruto = localStorage.getItem(BOOKED_KEY);
    if (!bruto) return new Set();
    const lista = JSON.parse(bruto) as string[];
    return new Set(Array.isArray(lista) ? lista : []);
  } catch {
    return new Set();
  }
}

export default function FormularioAgendamento() {
  const [bookedDates, setBookedDates] = useState<Set<string>>(new Set());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [observations, setObservations] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    setBookedDates(carregarDatas());
  }, []);

  function dataFormatada(dataStr: string) {
    const [y, m, d] = dataStr.split('-');
    return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString(
      'pt-BR',
      { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' },
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!selectedDate) {
      setErro('Selecione uma data no calendário.');
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
          horario: timeSlot,
          nome: clientName,
          email: clientEmail,
          telefone: clientPhone,
          observations,
        }),
      });

      if (!res.ok) {
        const payload = await res.json().catch(() => null);
        throw new Error(payload?.error || 'Falha ao salvar');
      }

      const atualizadas = new Set(bookedDates).add(selectedDate);
      setBookedDates(atualizadas);
      localStorage.setItem(BOOKED_KEY, JSON.stringify([...atualizadas]));

      setSucesso(
        `Agendamento confirmado para ${clientName} em ${dataFormatada(selectedDate)}, ${timeSlot}.`,
      );

      setSelectedDate(null);
      setServiceType('');
      setTimeSlot('');
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setObservations('');
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
    <>
      <Calendario
        bookedDates={bookedDates}
        selectedDate={selectedDate}
        onSelectDate={(data) => {
          setSelectedDate(data);
          setErro('');
          setSucesso('');
        }}
      />

      <form className="booking-form" onSubmit={handleSubmit}>
        <h3>Dados do agendamento</h3>

        <div className="form-group">
          <label htmlFor="serviceType">Tipo de serviço</label>
          <select
            id="serviceType"
            value={serviceType}
            onChange={(e) => setServiceType(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            <option value="curso">Curso/Palestra</option>
            <option value="consulta">Consulta médica</option>
            <option value="reuniao">Reunião empresarial</option>
            <option value="evento">Evento ao vivo</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="selectedDate">Data selecionada</label>
          <input
            id="selectedDate"
            type="text"
            value={selectedDate ? dataFormatada(selectedDate) : ''}
            placeholder="Clique em um dia livre no calendário"
            readOnly
          />
        </div>

        <div className="form-group">
          <label htmlFor="timeSlot">Horário</label>
          <select
            id="timeSlot"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            required
          >
            <option value="">Selecione...</option>
            {HORARIOS.map((h) => (
              <option key={h} value={h}>
                {h}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="clientName">Seu nome</label>
          <input
            id="clientName"
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="clientEmail">E-mail</label>
          <input
            id="clientEmail"
            type="email"
            value={clientEmail}
            onChange={(e) => setClientEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="clientPhone">Telefone</label>
          <input
            id="clientPhone"
            type="tel"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            placeholder="(11) 99999-9999"
          />
        </div>

        <div className="form-group">
          <label htmlFor="observations">Observações</label>
          <textarea
            id="observations"
            rows={3}
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
          />
        </div>

        <button className="btn-primary" type="submit" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Confirmar agendamento'}
        </button>

        {erro ? <p className="form-feedback error">{erro}</p> : null}
        {sucesso ? <p className="form-feedback success">{sucesso}</p> : null}
      </form>
    </>
  );
}
