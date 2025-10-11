import React from "react"

export default function Navbar({ me, onLogout }) {
  return (
    <nav className="bg-blue-600 text-white px-6 py-3 shadow-md flex justify-between items-center">
      {/* Logo / Nombre app */}
      <div className="text-lg font-bold">
        🎓 Orientación Vocacional
      </div>

      {/* Usuario y logout */}
      <div className="flex items-center gap-4">
        <div className="text-sm">
          <span className="font-semibold">{me?.nombre} {me?.apellido}</span>{" "}
          <span className="bg-blue-800 text-xs px-2 py-1 rounded">
            {me?.rol}
          </span>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
        >
          Cerrar sesión
        </button>
      </div>
    </nav>
  )
}
