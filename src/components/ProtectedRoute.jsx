import React, { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * 🧠 Verifica si un JWT es válido o está expirado.
 */
function isTokenExpired(token) {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const now = Date.now() / 1000;
    return payload.exp < now; // true si expiró
  } catch (err) {
    console.warn("⚠️ Error al decodificar el token:", err);
    return true;
  }
}

/**
 * 🧩 ProtectedRoute — protege rutas que requieren sesión activa y rol autorizado
 * - Revisa si el token existe, no expiró y si el rol tiene permiso.
 */
export default function ProtectedRoute({ children, token, allowedRoles = [] }) {
  const [valid, setValid] = useState(false);
  const [checking, setChecking] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let activeToken = token || localStorage.getItem("access");

    if (activeToken && !isTokenExpired(activeToken)) {
      try {
        const payload = JSON.parse(atob(activeToken.split(".")[1]));
        const userRole = payload.rol || localStorage.getItem("rol");

        console.log("🔐 Validando acceso:", {
          rolDetectado: userRole,
          rolesPermitidos: allowedRoles,
        });

        // ✅ Si la ruta requiere rol y el usuario no está permitido → bloquea
        if (
          allowedRoles.length > 0 &&
          !allowedRoles.map((r) => r.toLowerCase()).includes(userRole?.toLowerCase())
        ) {
          console.warn(`🚫 Rol '${userRole}' no autorizado para esta ruta.`);
          setValid(false);
        } else {
          console.log("✅ Token y rol válidos, acceso permitido.");
          setValid(true);
        }
      } catch (err) {
        console.error("❌ Error al decodificar token:", err);
        setValid(false);
      }
    } else {
      console.warn("⛔ Token ausente o expirado. Limpiando sesión...");
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      localStorage.removeItem("me");
      setValid(false);
    }

    setChecking(false);
  }, [token, allowedRoles]);

  if (checking) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-500">
        Cargando sesión...
      </div>
    );
  }

  if (!valid) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          message: "Tu sesión ha expirado o no tienes permisos suficientes.",
        }}
      />
    );
  }

  return children;
}
