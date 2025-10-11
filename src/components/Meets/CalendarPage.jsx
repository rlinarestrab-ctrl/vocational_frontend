import React from "react";
import MeetCalendar from "../../components/Meets/MeetCalendar";

export default function CalendarPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">
        📅 Calendario de reuniones
      </h1>
      <MeetCalendar />
    </div>
  );
}
