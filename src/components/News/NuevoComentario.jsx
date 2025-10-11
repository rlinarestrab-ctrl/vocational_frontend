import React, { useState } from "react";

const API_NEWS = import.meta.env.VITE_NEWS_API;

export default function NuevoComentario({ publicacionId, token, onNuevo }) {
  const [texto, setTexto] = useState("");
  const [enviando, setEnviando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    if (!texto.trim()) return;

    setEnviando(true);
    try {
      console.log("🔑 Token usado para comentar:", token);

      const res = await fetch(`${API_NEWS}/api/comentarios/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          contenido: texto,
          publicacion: publicacionId,
        }),
      });

      // 🧠 Manejo de errores de autenticación
      if (res.status === 401 || res.status === 403) {
        console.warn("Token inválido o expirado → redirigiendo al login");
        localStorage.clear();
        window.location.href = "/login";
        return;
      }

      if (res.ok) {
        setTexto("");
        onNuevo(); // refresca lista
      } else {
        const errorText = await res.text();
        console.error("Error al crear comentario:", errorText);
        alert("❌ No se pudo publicar el comentario.");
      }
    } catch (err) {
      console.error("Error de red al crear comentario:", err);
      alert("Error de conexión al crear comentario.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <form onSubmit={enviar} className="mt-2 flex gap-2">
      <input
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Escribe un comentario..."
        className="flex-1 border rounded px-2 py-1 text-sm"
        disabled={enviando}
      />
      <button
        type="submit"
        className={`px-3 py-1 text-sm rounded ${
          enviando
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-blue-600 text-white hover:bg-blue-700"
        }`}
        disabled={enviando}
      >
        {enviando ? "Enviando..." : "Enviar"}
      </button>
    </form>
  );
}
