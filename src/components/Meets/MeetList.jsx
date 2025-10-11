import React, { useEffect, useState } from "react";
import { API } from "../../config/api";

export default function MeetList({ refresh }) {
  const [meets, setMeets] = useState([]);
  const token = localStorage.getItem("access");

  useEffect(() => {
    const fetchMeets = async () => {
      try {
        const res = await fetch(`${API.MEETS}/api/meet/salas/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setMeets(data);
      } catch (err) {
        console.error("Error cargando reuniones:", err);
      }
    };
    fetchMeets();
  }, [refresh, token]);

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-3 text-gray-800">Reuniones programadas</h2>
      <ul>
        {meets.length === 0 ? (
          <p className="text-gray-500">No hay reuniones registradas.</p>
        ) : (
          meets.map((m) => (
            <li
              key={m.id}
              className="border p-3 rounded mb-2 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">{m.titulo}</p>
                <p className="text-sm text-gray-500">
                  {new Date(m.fecha_programada).toLocaleString()}
                </p>
                {m.enlace_acceso && (
                  <a
                    href={m.enlace_acceso}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    🔗 Abrir en Google Meet
                  </a>
                )}
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
