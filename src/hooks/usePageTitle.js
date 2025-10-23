import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function usePageTitle(view) {
  const location = useLocation();

  useEffect(() => {
    let title = "Tu Ruta Educativa";
    if (view === "dashboard") title = "Panel | Tu Ruta Educativa";
    else if (view === "users") title = "Usuarios | Tu Ruta Educativa";
    else if (view === "instituciones") title = "Instituciones | Tu Ruta Educativa";
    else if (view === "tests") title = "Tests Vocacionales | Tu Ruta Educativa";
    else if (view === "noticias") title = "Noticias | Tu Ruta Educativa";
    else if (view === "videollamadas") title = "Videollamadas | Tu Ruta Educativa";
    else if (view === "profile") title = "Perfil | Tu Ruta Educativa";
    else if (view === "settings") title = "Configuración | Tu Ruta Educativa";
    else if (location.pathname === "/login") title = "Iniciar Sesión | Tu Ruta Educativa";
    else if (location.pathname === "/register") title = "Registro | Tu Ruta Educativa";
    else if (location.pathname === "/") title = "Inicio | Tu Ruta Educativa";
    document.title = title;
  }, [location, view]);
}
