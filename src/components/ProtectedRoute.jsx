// ✅ src/components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children, token }) {
  const [checking, setChecking] = useState(true);
  const [validToken, setValidToken] = useState(null);

  useEffect(() => {
    if (token) {
      console.log("✅ Token recibido en ProtectedRoute:", token.slice(0, 15) + "...");
      setValidToken(true);
    } else {
      const savedAccess = localStorage.getItem("access");
      if (savedAccess) {
        console.log("♻️ Restaurando token desde localStorage:", savedAccess.slice(0, 15) + "...");
        setValidToken(true);
      } else {
        console.warn("⛔ No hay token guardado ni recibido");
        setValidToken(false);
      }
    }
    setChecking(false);
  }, [token]);

  if (checking) {
    return <p className="text-center mt-10 text-gray-500">Cargando sesión...</p>;
  }

  if (!validToken) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
