import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";

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
import usePageTitle from "./hooks/usePageTitle";
import MeetForm from "./components/Meets/MeetForm";
import MeetList from "./components/Meets/MeetList";
import MeetCalendar from "./components/Meets/MeetCalendar";
import TestPage from "./pages/TestPage";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const [token, setToken] = useState(null);
  const [refresh, setRefresh] = useState(null);
  const [me, setMe] = useState(null);
  const [view, setView] = useState("dashboard");
  const [subView, setSubView] = useState(null);

  useEffect(() => {
    const savedAccess = localStorage.getItem("access");
    const savedRefresh = localStorage.getItem("refresh");
    const savedUser = localStorage.getItem("me");

    if (savedAccess && savedRefresh && savedUser) {
      setToken(savedAccess);
      setRefresh(savedRefresh);
      setMe(JSON.parse(savedUser));
    }
  }, []);

  const handleLogin = (t, r, u) => {
    setToken(t);
    setRefresh(r);
    setMe(u);
    localStorage.setItem("access", t);
    localStorage.setItem("refresh", r);
    localStorage.setItem("me", JSON.stringify(u));
  };

  const handleLogout = () => {
    setToken(null);
    setRefresh(null);
    setMe(null);
    localStorage.clear();
  };

  return (
    <Router>
      <AppContent
        token={token}
        me={me}
        view={view}
        subView={subView}
        setView={setView}
        setSubView={setSubView}
        onLogin={handleLogin}
        onLogout={handleLogout}
      />
    </Router>
  );
}

function AppContent({
  token,
  me,
  view,
  subView,
  setView,
  setSubView,
  onLogin,
  onLogout,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  usePageTitle(location.pathname);

  // 🔄 Sincronizar estado → URL
  useEffect(() => {
    let path = `/dashboard/${view}`;
    if (view === "videollamadas" && subView) {
      path += `/${subView}`;
    }
    navigate(path, { replace: true });
  }, [view, subView]);

  // 🔁 Sincronizar URL → estado
  useEffect(() => {
    const pathParts = location.pathname.split("/dashboard/")[1]?.split("/") || [];
    const mainView = pathParts[0] || "dashboard";
    const sub = pathParts[1] || null;

    if (mainView !== view) setView(mainView);
    if (mainView === "videollamadas" && sub !== subView) setSubView(sub);
    if (mainView !== "videollamadas" && subView) setSubView(null);
  }, [location.pathname]);

  return (
    <Routes>
      <Route path="/" element={<Landing onStart={() => navigate("/login")} />} />
      <Route path="/login" element={<Login onLogin={onLogin} />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/google/callback"
        element={<GoogleCallback onLogin={onLogin} />}
      />

      {/* 🧭 Dashboard principal */}
      <Route
        path="/dashboard/*"
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
                <Navbar me={me} onLogout={onLogout} />
                <main className="p-4">
                  {view === "dashboard" && (
                    <Dashboard me={me} setView={setView} setSubView={setSubView} />
                  )}
                  {view === "users" && <Users token={token} me={me} />}
                  {view === "instituciones" && <InstitucionesPage />}
                  {view === "tests" && <TestPage token={token} me={me} />}
                  {view === "noticias" && <NewsPage token={token} me={me} />}
                  {view === "videollamadas" && (
                    <div className="p-6 bg-white rounded-2xl shadow-md">
                      {subView === "crear" && <MeetForm token={token} me={me} />}
                      {subView === "lista" && <MeetList token={token} me={me} />}
                      {subView === "calendario" && (
                        <MeetCalendar token={token} me={me} />
                      )}
                      {!subView && (
                        <div className="text-center text-gray-500 py-10">
                          📂 Selecciona una opción en el menú lateral para continuar
                        </div>
                      )}
                    </div>
                  )}
                  {view === "profile" && <StudentProfile token={token} me={me} />}
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
