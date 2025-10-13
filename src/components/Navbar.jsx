import React from "react";
import { Compass } from "lucide-react"; // 🧭 Icono de brújula

export default function Navbar({ me, onLogout }) {
  // 🧠 Obtener datos del usuario (desde estado o localStorage)
  const nombre = me?.nombre || localStorage.getItem("nombre") || "Usuario";
  const apellido = me?.apellido || localStorage.getItem("apellido") || "";
  const rol = me?.rol || localStorage.getItem("rol") || "estudiante";

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 shadow-md flex justify-between items-center">
      {/* 🧭 Logo / Nombre app */}
      <div className="flex items-center gap-2">
        <Compass className="w-6 h-6 text-white" />
        <span className="text-lg font-bold tracking-wide">
          Tu Ruta Educativa
        </span>
      </div>

      {/* 👤 Usuario y logout */}
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="font-semibold">
            {nombre} {apellido}
          </span>{" "}
          <span className="bg-blue-800 text-xs px-2 py-1 rounded uppercase">
            {rol}
          </span>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm transition"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  );
}
