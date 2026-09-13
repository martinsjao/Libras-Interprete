'use client';
import { useState } from 'react';
// import Calendario from './calendario';

export default function FormularioAgendamento() {
  const [bookedDates, setBookedDates] = useState<Set<string>>(
    new Set(['2024-12-10', '2024-12-15', '2024-12-20'])
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [serviceType, setServiceType] = useState('');
  const [timeSlot, setTimeSlot] = useState('');
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [observations, setObservations] = useState('');
  const [enviando, setEnviando] = useState(false);

  function dataFormatada(dataStr: string) {
    const [y, m, d] = dataStr.split('-');
    return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString('pt-BR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!selectedDate) {
      alert('Por favor, selecione uma data no calendário.');
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

      if (!res.ok) throw new Error('Falha ao salvar');

      alert(`✅ Agendamento confirmado para ${clientName}!\n\nData: ${dataFormatada(selectedDate)}\nHorário: ${timeSlot}`);

      setBookedDates((prev) => new Set(prev).add(selectedDate));
      setSelectedDate(null);
      setServiceType('');
      setTimeSlot('');
      setClientName('');
      setClientEmail('');
      setClientPhone('');
      setObservations('');
    } catch (err) {
      console.error(err);
      alert('Erro ao confirmar agendamento. Tente novamente.');
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div id="schedule">
      {/* <Calendario bookedDates={bookedDates} selectedDate={selectedDate} onSelectDate={setSelectedDate} /> */}

      <form onSubmit={handleSubmit}>
        <label>Tipo de Serviço:</label>
        <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} required>
          <option value="">Selecione...</option>
          <option value="curso">Curso/Palestra</option>
          <option value="consulta">Consulta Médica</option>
          <option value="reuniao">Reunião Empresarial</option>
          <option value="evento">Evento ao Vivo</option>
        </select>

        <label>Data Selecionada:</label>
        <input type="text" value={selectedDate ? dataFormatada(selectedDate) : ''} readOnly />

        <label>Horário:</label>
        <select value={timeSlot} onChange={(e) => setTimeSlot(e.target.value)} required>
          <option value="">Selecione...</option>
          {['08:00 - 09:00', '09:00 - 10:00', '10:00 - 11:00', '11:00 - 12:00',
            '13:00 - 14:00', '14:00 - 15:00', '15:00 - 16:00', '16:00 - 17:00', '17:00 - 18:00'
          ].map((h) => <option key={h} value={h}>{h}</option>)}
        </select>

        <label>Seu Nome:</label>
        <input type="text" value={clientName} onChange={(e) => setClientName(e.target.value)} required />

        <label>E-mail:</label>
        <input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} required />

        <label>Telefone:</label>
        <input type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} />

        <label>Observações:</label>
        <textarea value={observations} onChange={(e) => setObservations(e.target.value)} />

        <button type="submit" disabled={enviando}>
          {enviando ? 'Enviando...' : 'Confirmar Agendamento'}
        </button>
      </form>
    </div>
  );
}