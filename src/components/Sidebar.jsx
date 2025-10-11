import React, { useState } from "react";

export default function Sidebar({ setView, view, subView, setSubView }) {
  const user = JSON.parse(localStorage.getItem("me"));
  const rol = user?.rol || "estudiante";

  const [openSubmenu, setOpenSubmenu] = useState(null);

  const toggleSubmenu = (id) => {
    setOpenSubmenu(openSubmenu === id ? null : id);
  };

  const menuItems =
    rol === "admin"
      ? [
          { id: "users", label: "👥 Usuarios" },
          { id: "instituciones", label: "🏫 Instituciones" },
          { id: "tests", label: "📝 Tests vocacionales" },
          { id: "noticias", label: "🔔 Noticias" },
          {
            id: "videollamadas",
            label: "🎥 Videollamadas",
            subitems: [
              { id: "crear", label: "➕ Crear reunión" },
              { id: "lista", label: "📋 Ver reuniones" },
              { id: "calendario", label: "📅 Calendario" },
            ],
          },
          { id: "profile", label: "🙍‍♂️ Perfil" },
          { id: "settings", label: "⚙️ Configuración" },
        ]
      : [
          { id: "dashboard", label: "🎓 Mi Panel" },
          { id: "tests", label: "🧠 Mis Tests" },
          { id: "noticias", label: "🔔 Noticias" },
          {
            id: "videollamadas",
            label: "🎥 Videollamadas",
            subitems: [
              { id: "lista", label: "📋 Mis reuniones" },
              { id: "calendario", label: "📅 Calendario" },
            ],
          },
          { id: "profile", label: "🙍‍♂️ Mi Perfil" },
        ];

  return (
    <aside className="w-64 min-h-screen bg-gradient-to-b from-indigo-600 to-blue-500 text-white shadow-lg flex flex-col">
      {/* Encabezado */}
      <div className="p-5 text-center border-b border-indigo-400">
        <h1 className="text-2xl font-bold tracking-wide">🎓 Tu Ruta</h1>
        <p className="text-sm text-indigo-200">{rol.toUpperCase()}</p>
      </div>

      {/* Navegación */}
      <nav className="flex-1 p-3">
        {menuItems.map((item) => (
          <div key={item.id}>
            {/* Botón principal */}
            <button
              onClick={() => {
                if (item.subitems) {
                  toggleSubmenu(item.id);
                  // Solo despliega el submenú, sin cambiar la vista principal
                } else {
                  setView(item.id);
                  setSubView(null);
                }
              }}
              className={`flex items-center justify-between w-full text-left px-4 py-2 rounded-lg mb-2 transition ${
                view === item.id
                  ? "bg-white text-indigo-600 font-semibold"
                  : "hover:bg-indigo-500 hover:text-white"
              }`}
            >
              <span>{item.label}</span>
              {item.subitems && (
                <span className="text-xs opacity-80">
                  {openSubmenu === item.id ? "▾" : "▸"}
                </span>
              )}
            </button>

            {/* Submenú visible solo si está abierto */}
            {item.subitems && openSubmenu === item.id && (
              <div className="ml-6 mt-1 border-l border-indigo-300 pl-3">
                {item.subitems.map((sub) => (
                  <button
                    key={sub.id}
                    onClick={() => {
                      setView("videollamadas");
                      setSubView(sub.id);
                    }}
                    className={`block w-full text-left px-3 py-1.5 text-sm rounded-md mb-1 transition-all duration-200 ${
                      sub.id === subView
                        ? "bg-indigo-100 text-indigo-700 font-semibold shadow-sm"
                        : "hover:bg-indigo-500 hover:text-white"
                    }`}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Pie */}
      <div className="text-center p-4 border-t border-indigo-400 text-sm text-indigo-200">
        Orientación Vocacional © 2025
      </div>
    </aside>
  );
}
