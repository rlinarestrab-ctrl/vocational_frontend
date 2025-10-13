import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";

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
import RegisterPage from "./pages/RegisterPage";


// 🎥 Componentes de videollamadas
import MeetForm from "./components/Meets/MeetForm";
import MeetList from "./components/Meets/MeetList";
import MeetCalendar from "./components/Meets/MeetCalendar";
import TestPage from "./pages/TestPage";


export default function App() {
  const [token, setToken] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [me, setMe] = useState(null);
  const [view, setView] = useState("dashboard");
  const [subView, setSubView] = useState(null);

  // 🔄 Restaurar sesión previa (normal o Google)
  useEffect(() => {
    const savedAccess = localStorage.getItem("access");
    const savedRefresh = localStorage.getItem("refresh");
    const savedUser = localStorage.getItem("me");

    // 🧠 Caso 1: sesión normal (ya tenía "me")
    if (savedAccess && savedRefresh && savedUser) {
      console.log("🔑 Restaurando sesión previa...");
      setToken(savedAccess);
      setRefresh(savedRefresh);
      setMe(JSON.parse(savedUser));
      return;
    }

    // 🧠 Caso 2: login Google (solo tiene valores individuales)
    if (savedAccess && !savedUser) {
      console.log("🔁 Reconstruyendo sesión desde localStorage (Google)...");
      const email = localStorage.getItem("email");
      const nombre = localStorage.getItem("nombre");
      const apellido = localStorage.getItem("apellido");
      const rol = localStorage.getItem("rol") || "estudiante";

      const nuevoUsuario = { email, nombre, apellido, rol };

      setToken(savedAccess);
      setRefresh(localStorage.getItem("refresh"));
      setMe(nuevoUsuario);
      localStorage.setItem("me", JSON.stringify(nuevoUsuario));
    }
  }, []);

  // 🔐 Manejo de login manual o backend normal
  const handleLogin = (t, r, u) => {
    console.log("✅ Sesión iniciada:", u);
    setToken(t);
    setRefresh(r);
    setMe(u);
    localStorage.setItem("access", t);
    localStorage.setItem("refresh", r);
    localStorage.setItem("me", JSON.stringify(u));

    // ⚡️ también guardamos datos individuales para consistencia
    if (u?.email) localStorage.setItem("email", u.email);
    if (u?.nombre) localStorage.setItem("nombre", u.nombre);
    if (u?.apellido) localStorage.setItem("apellido", u.apellido);
    if (u?.rol) localStorage.setItem("rol", u.rol);
  };

  // 🚪 Cierre de sesión completo
  const handleLogout = () => {
    console.log("🚪 Cierre de sesión");
    setToken(null);
    setRefresh(null);
    setMe(null);
    localStorage.clear();
  };

  return (
    <Router>
      <Routes>
        {/* 🏠 Landing inicial */}
        <Route path="/" element={<LandingWrapper />} />

        {/* 🔐 Login clásico o con Google */}
        <Route path="/login" element={<Login onLogin={handleLogin} />} />

        {/* 🧾 Registro manual */}
        <Route path="/register" element={<RegisterPage />} />

        {/* 🔁 Callback de Google */}
        <Route
          path="/google/callback"
          element={<GoogleCallback onLogin={handleLogin} />}
        />

        {/* 🧭 Dashboard protegido */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute token={token}>
              <div className="flex">
                <Sidebar
                  setView={setView}
                  view={view}
                  subView={subView}
                  setSubView={setSubView}
                />
                <div className="flex-1 min-h-screen bg-gray-50">
                  <Navbar me={me} onLogout={handleLogout} />
                  <main className="p-4">
                    {view === "users" && <Users token={token} me={me} />}
                    {view === "instituciones" && <InstitucionesPage />}
                    {view === "tests" && <TestPage token={token} me={me} />}
                    {view === "noticias" && <NewsPage token={token} me={me} />}
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
                    {view === "profile" && <StudentProfile token={token} me={me} />}
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
    </Router>
  );
}

/* 🏠 Landing redirige a /login */
function LandingWrapper() {
  const navigate = useNavigate();
  return <Landing onStart={() => navigate("/login")} />;
}
