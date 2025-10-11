import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Landing from "./components/Landing";
import Login from "./components/Login";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Users from "./components/Users";
import InstitucionesPage from "./components/Instituciones/InstitucionesPage";
import GoogleCallback from "./pages/google/Callback";
import ProtectedRoute from "./components/ProtectedRoute";
import StudentProfile from "./components/Students/StudentProfile";
import NewsPage from "./components/News/NewsPage";

// 🎥 Componentes de videollamadas
import MeetForm from "./components/Meets/MeetForm";
import MeetList from "./components/Meets/MeetList";
import MeetCalendar from "./components/Meets/MeetCalendar";

export default function App() {
  const [token, setToken] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [me, setMe] = useState(null);
  const [view, setView] = useState("dashboard");
  const [subView, setSubView] = useState(null); // 👈 control para submenús

  // 🔄 Restaurar sesión si ya había tokens guardados
  useEffect(() => {
    const savedAccess = localStorage.getItem("access");
    const savedRefresh = localStorage.getItem("refresh");
    const savedUser = localStorage.getItem("me");

    if (savedAccess && savedRefresh && savedUser) {
      console.log("🔑 Restaurando sesión previa...");
      setToken(savedAccess);
      setRefresh(savedRefresh);
      setMe(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (t, r, u) => {
    console.log("✅ Sesión iniciada:", u);
    setToken(t);
    setRefresh(r);
    setMe(u);
    localStorage.setItem("access", t);
    localStorage.setItem("refresh", r);
    localStorage.setItem("me", JSON.stringify(u));
  };

  const handleLogout = () => {
    console.log("🚪 Cierre de sesión");
    setToken(null);
    setRefresh(null);
    setMe(null);
    localStorage.clear();
  };

  return (
    <BrowserRouter>
      <Routes>
        {/* 🏠 Landing con redirección a login */}
        <Route path="/" element={<LandingWrapper />} />

        {/* 🔐 Login normal o con Google */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* 🔁 Callback de Google */}
        <Route path="/google/callback" element={<GoogleCallback onLogin={handleLogin} />} />

        {/* 🧭 Dashboard principal */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute token={token}>
              <div className="flex">
                {/* 🔹 Sidebar con submenús controlados */}
                <Sidebar
                  setView={setView}
                  view={view}
                  subView={subView}
                  setSubView={setSubView}
                />

                {/* 🔹 Contenido principal */}
                <div className="flex-1 min-h-screen bg-gray-50">
                  <Navbar me={me} onLogout={handleLogout} />

                  <main className="p-4">
                    {view === "users" && <Users token={token} me={me} />}
                    {view === "instituciones" && <InstitucionesPage />}
                    {view === "tests" && (
                      <div className="p-6 bg-white shadow rounded">
                        📝 Módulo de Tests vocacionales en construcción...
                      </div>
                    )}
                    {view === "noticias" && <NewsPage token={token} me={me} />}

                    {/* 🎥 Videollamadas — vistas controladas por subView */}
                    {view === "videollamadas" && (
                      <div className="p-6 bg-white rounded-2xl shadow-md">
                        {subView === "crear" && <MeetForm token={token} me={me} />}
                        {subView === "lista" && <MeetList token={token} me={me} />}
                        {subView === "calendario" && <MeetCalendar token={token} me={me} />}
                        {!subView && (
                          <div className="text-center text-gray-500 py-10">
                            📂 Selecciona una opción en el menú lateral para continuar
                          </div>
                        )}
                      </div>
                    )}

                    {view === "profile" && (
                      <div className="p-6 bg-white shadow rounded">
                        🙍‍♂️ Perfil en construcción...
                      </div>
                    )}

                    {view === "settings" && (
                      <div className="p-6 bg-white shadow rounded">
                        ⚙️ Configuración en construcción...
                      </div>
                    )}
                  </main>
                </div>
              </div>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

/* 🔎 Wrapper para Landing que redirige a /login */
function LandingWrapper() {
  const navigate = useNavigate();
  return <Landing onStart={() => navigate("/login")} />;
}
