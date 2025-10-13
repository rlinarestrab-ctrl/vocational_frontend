import React from "react";

export default function Navbar({ me, onLogout }) {
  // 🧠 Obtener datos del usuario (desde estado o localStorage)
  const nombre = me?.nombre || localStorage.getItem("nombre") || "Usuario";
  const apellido = me?.apellido || localStorage.getItem("apellido") || "";
  const rol = me?.rol || localStorage.getItem("rol") || "estudiante";

  return (
    <nav className="bg-blue-600 text-white px-6 py-3 shadow-md flex justify-between items-center">
      {/* Logo / Nombre app */}
      <div className="text-lg font-bold">
        🎓 Orientación Vocacional
      </div>

      {/* Usuario y logout */}
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
