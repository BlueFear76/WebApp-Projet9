import React from 'react';
import Calendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from "@fullcalendar/interaction";
import './customCalendarStyle.css';
import { Tooltip } from 'react-tooltip';
import { EventContentArg } from '@fullcalendar/core';
import moment from 'moment';
import { EventApi } from '@fullcalendar/core';

interface CalendarEvent{
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
  const renderEventContent = (eventInfo: EventContentArg) => {
    const { event } = eventInfo;
    
    return (
      <div className='calendar'>
        <span data-tooltip-id={`tooltip-${event.id}`}>
          {event.title}
        </span>
        <Tooltip id={`tooltip-${event.id}`} place="top">
          <strong>{event.title}</strong><br />
          <strong>Début :</strong> {moment(event.start).format('DD/MM/YYYY HH:mm')}<br />
          <strong>Fin :</strong> {moment(event.end).format('DD/MM/YYYY HH:mm')}<br />
          <strong>Adresse :</strong> {event.extendedProps.location || 'Aucune adresse disponible'}<br />
          <strong>Description :</strong> {event.extendedProps.description || 'Aucune description disponible'}<br />
      </Tooltip>
      </div>
    );
  };

  return (
    <div className="calendarStyle">
      <Calendar
        plugins={[dayGridPlugin, timeGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay',
        }}
        locale="fr"
        events={events}
        height="70vh"
        eventContent={renderEventContent} // Utilisation correcte
      />
    </div>
  );
};

export default CustomCalendar;
