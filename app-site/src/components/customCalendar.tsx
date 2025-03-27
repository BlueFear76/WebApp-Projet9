import React from 'react';
import Calendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import  './customCalendarStyle.css'


interface CalendarEvent {
  title: string;
  start: string;
  end: string;
  description?: string;
}

interface CustomCalendarProps {
  events: CalendarEvent[];  // Liste d'événements
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ events }) => {
  return (
    <div className='calendarStyle'>
      <Calendar
        plugins={[dayGridPlugin , timeGridPlugin]}
        initialView="dayGridMonth"
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        }}
        weekends={false}
        locale={"fr"}
        events={events}
        height={'70vh'}
      />
    </div>
  );
}

export default CustomCalendar;
