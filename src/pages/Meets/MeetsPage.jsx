import React, { useState } from "react";
import MeetForm from "../../components/Meets/MeetForm";
import MeetList from "../../components/Meets/MeetList"; 

export default function MeetsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleMeetingCreated = () => {
    // 🔄 Cambiamos el estado para refrescar la lista
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-4 text-center">
        🎥 Reuniones de Orientación Vocacional
      </h1>

      {/* 🧩 Formulario para crear reunión */}
      <MeetForm onCreated={handleMeetingCreated} />

      {/* 📋 Lista actualizada automáticamente */}
      <MeetList refresh={refreshKey} />
    </div>
  );
}
