import React, { useEffect, useState } from "react";
import NuevoComentario from "./NuevoComentario";

const API_NEWS = import.meta.env.VITE_NEWS_API;

export default function Comentarios({ publicacionId, token, me }) {
  const [comentarios, setComentarios] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchComentarios = async () => {
    try {
      console.log("📡 Obteniendo comentarios con token:", token);
      const res = await fetch(
        `${API_NEWS}/api/publicaciones/${publicacionId}/comentarios/`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.status === 401 || res.status === 403) {
        console.warn("Token inválido o expirado → redirigiendo al login");
          localStorage.clear();
          window.location.href = "/login";
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setComentarios(data);
      } else {
        const errorText = await res.text();
        console.error("Error al obtener comentarios:", errorText);
      }
    } catch (err) {
      console.error("Error de red al obtener comentarios:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComentarios();
  }, [publicacionId]);

  if (loading) {
    return <p className="text-gray-500 text-sm mt-2">Cargando comentarios...</p>;
  }

  return (
    <div className="mt-2">
      {comentarios.length === 0 ? (
        <p className="text-gray-500 text-sm">No hay comentarios aún.</p>
      ) : (
        comentarios.map((c) => (
          <div key={c.id} className="p-2 border-b border-gray-100">
            <p className="text-sm">
              <span className="font-semibold">
                {c.usuario_nombre || "Usuario"}
              </span>
              : {c.contenido || c.texto || "(sin contenido)"}
            </p>
          </div>
        ))
      )}

      {/* 🔹 Formulario para nuevo comentario */}
      <NuevoComentario
        publicacionId={publicacionId}
        token={token}
        me={me}
        onNuevo={fetchComentarios}
      />
    </div>
  );
}
