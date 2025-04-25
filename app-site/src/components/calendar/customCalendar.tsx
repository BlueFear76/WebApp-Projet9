import React, { useState } from 'react';
import Calendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import './customCalendarStyle.css';
import { EventClickArg, EventContentArg } from '@fullcalendar/core';
import moment from 'moment';

interface CalendarEvent {
  extendedProps: {
    description?: string;
    location?: string;
    duration?: number;
  };
}

interface CustomCalendarProps {
  events: CalendarEvent[];
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  const handleEventClick = (clickInfo: EventClickArg) => {
    setSelectedEvent(clickInfo.event);
  };

  const closeModal = () => setSelectedEvent(null);

  const renderEventContent = (eventInfo: EventContentArg) => (
    <div className='calendar'>
      <span>{eventInfo.event.title}</span>
    </div>
  );

  return (
    <div className="calendarStyle">
      <Calendar
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        locale="fr"
        events={events}
        height="100vh"
        eventContent={renderEventContent}
        eventClick={handleEventClick}
      />

      {/* Modal */}
      {selectedEvent && (
        <div className="modal-overlay">
          <div className="modal">
            <button className="close-btn" onClick={closeModal}>✕</button>
            <h2>{selectedEvent.extendedProps.description}</h2>
            <p><strong>Adresse :</strong> {selectedEvent.extendedProps.location || 'Aucune adresse disponible'}</p>
            <p><strong>Début :</strong> {moment(selectedEvent.start).format('DD/MM/YYYY HH:mm')}</p>
            <p><strong>Fin :</strong> {moment(selectedEvent.end).format('DD/MM/YYYY HH:mm')}</p>
            
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomCalendar;
