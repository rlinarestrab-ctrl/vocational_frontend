import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Callback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // 🧩 Tokens emitidos por tu backend (Django)
    const access = params.get("access");
    const refresh = params.get("refresh");

    // 🧩 Información del usuario (si el backend los manda en la URL)
    let email = params.get("email");
    let nombre = params.get("nombre");
    let apellido = params.get("apellido");
    let rol = params.get("rol");

    // 🧩 Tokens de Google (solo si usas Calendar / Meet)
    const google_access_token = params.get("google_access_token");
    const google_refresh_token = params.get("google_refresh_token");

    console.log("🎯 Tokens recibidos del backend:", { access, refresh });
    console.log("📧 Usuario:", email, nombre, apellido, rol);

    if (access && refresh) {
      // 🧹 Limpieza antes de guardar nuevos tokens
      localStorage.clear();

      // ✅ Guardar tokens del BACKEND (los válidos para JWT)
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      // 🔍 Si faltan datos, los extraemos del JWT (más confiable)
      try {
        const payload = JSON.parse(atob(access.split(".")[1]));
        email = email || payload.email;
        nombre = nombre || payload.nombre;
        apellido = apellido || payload.apellido;
        rol = rol || payload.rol;
      } catch (error) {
        console.warn("⚠️ No se pudo decodificar el token:", error);
      }

      // 👤 Guardar datos básicos del usuario
      if (email) localStorage.setItem("email", email);
      if (nombre) localStorage.setItem("nombre", nombre);
      if (apellido) localStorage.setItem("apellido", apellido);
      if (rol) localStorage.setItem("rol", rol);

      // 🧩 Guardar tokens de Google (si existen)
      if (google_access_token)
        localStorage.setItem("google_access_token", google_access_token);
      if (google_refresh_token)
        localStorage.setItem("google_refresh_token", google_refresh_token);

      // 🚀 Redirige al dashboard principal
      navigate("/dashboard");
    } else {
      console.error("❌ No se recibieron tokens válidos en el callback.");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="flex items-center justify-center h-screen">
      <p className="text-gray-600 text-lg">Procesando inicio de sesión...</p>
    </div>
  );
}
