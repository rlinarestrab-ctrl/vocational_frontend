import React, { useEffect, useState } from "react";
import moment from "moment";
import "moment/locale/es";
import { Calendar, momentLocalizer } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { API } from "../../config/api";

moment.locale("es");
const localizer = momentLocalizer(moment);

export default function MeetCalendar() {
  const [events, setEvents] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await fetch(`${API.MEETS}/api/meet/salas/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();

        const formatted = data.map((meet) => ({
          id: meet.id,
          title: meet.titulo,
          start: new Date(meet.fecha_programada),
          end: new Date(
            new Date(meet.fecha_programada).getTime() + (meet.duracion_estimada || 60) * 60000
          ),
          link: meet.enlace_acceso,
          descripcion: meet.descripcion,
        }));
        setEvents(formatted);
      } catch (err) {
        console.error("❌ Error cargando eventos:", err);
      }
    };
    fetchMeetings();
  }, [token]);

  const handleSelectEvent = (event) => {
    if (event.link) {
      window.open(event.link, "_blank");
    } else {
      alert(`📅 ${event.title}\n\n${event.descripcion || "Sin descripción"}`);
    }
  };

  return (
    <div className="p-4 bg-white shadow rounded-md mt-4">
      <h2 className="text-lg font-bold mb-3 text-gray-800">Calendario de Reuniones</h2>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        views={["month", "week", "day"]}
        onSelectEvent={handleSelectEvent}
        messages={{
          today: "Hoy",
          previous: "Anterior",
          next: "Siguiente",
          month: "Mes",
          week: "Semana",
          day: "Día",
          agenda: "Agenda",
          showMore: (total) => `+${total} más`,
        }}
        eventPropGetter={() => ({
          style: {
            backgroundColor: "#2563eb",
            color: "white",
            borderRadius: "6px",
            border: "none",
          },
        })}
      />
    </div>
  );
}
