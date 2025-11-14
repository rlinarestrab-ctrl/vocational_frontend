import React from "react";

export default function Navbar({ me, onLogout }) {
  // 🧠 Obtener datos del usuario (desde estado o localStorage)
  const nombre = me?.nombre || localStorage.getItem("nombre") || "Usuario";
  const apellido = me?.apellido || localStorage.getItem("apellido") || "";
  const rol = me?.rol || localStorage.getItem("rol") || "admin";

  return (
    <nav className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-6 py-3 shadow-md flex justify-between items-center">
      {/* 🔹 Espacio a la izquierda (sin ícono ni texto) */}
      <div className="flex items-center">
        {/* Puedes dejar este div vacío para mantener alineación */}
      </div>

      {/* 👤 Usuario y botón de cierre */}
      <div className="flex items-center gap-4">
        <div className="text-sm text-right">
          <span className="font-semibold">
            {nombre} {apellido}
          </span>{" "}
          <span className="bg-indigo-700 text-xs px-2 py-1 rounded uppercase">
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
