import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    // 🧩 Tokens emitidos por tu backend (Django)
    const access = params.get("access");
    const refresh = params.get("refresh");

    // 🧩 Información del usuario
    const email = params.get("email");
    const nombre = params.get("nombre");
    const apellido = params.get("apellido");
    const rol = params.get("rol");

    // 🧩 Tokens de Google (solo si los necesitas para Calendar)
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

      // 👤 Guardar datos básicos del usuario
      localStorage.setItem("email", email);
      localStorage.setItem("nombre", nombre);
      localStorage.setItem("apellido", apellido);
      localStorage.setItem("rol", rol);

      // (Opcional) Tokens de Google, solo si usarás Calendar o Meet
      if (google_access_token)
        localStorage.setItem("google_access_token", google_access_token);
      if (google_refresh_token)
        localStorage.setItem("google_refresh_token", google_refresh_token);

      // 🚀 Redirige al dashboard o página principal
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
