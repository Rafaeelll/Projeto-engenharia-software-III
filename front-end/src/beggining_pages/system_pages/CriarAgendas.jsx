import React, { useState } from 'react';
import '../../styles.css';
import HeaderBar from '../../components/ui/HeaderBar';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import ptBrLocale from '@fullcalendar/core/locales/pt-br';

export default function CriarAgendas() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateClick = (event) => {
    setIsOpen(true);
    setSelectedDate(event.date);
  };

  const handleFormSubmit = (data) => {
    // salvar dados do formulário aqui
    setIsOpen(false);
  };

  return (
    <div style={{ backgroundSize: 'cover', backgroundPosition: 'center', height: '100vh', justifyContent: 'center', background: 'whitesmokesss' }} className="Papai">
      <div>
        <HeaderBar />
      </div>
      {isOpen ? (
        <div>
          <h1>Agendar para {selectedDate.toLocaleString()}</h1>
          <form onSubmit={handleFormSubmit}>
            {/* adicionar campos do formulário aqui */}
            <button type="submit">Salvar</button>
            <button onClick={() => setIsOpen(false)}>Cancelar</button>
          </form>
        </div>
      ) : (
        <div style={{ width: '60%', margin: '0 auto', marginTop: '10px', fontFamily: 'monospace', padding: '20px', color: 'purple' }}>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridDay"
            headerToolbar={{
              start: 'today prev,next',
              center: 'title',
              end: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            dateClick={handleDateClick}
            locale={ptBrLocale}
          />
        </div>
      )}
    </div>
  );
}
