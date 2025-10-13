import React, { useState } from "react";
import { Trash2, Heart } from "lucide-react";

const API_NEWS = import.meta.env.VITE_NEWS_API;

export default function NewsCard({ publicacion, me, token, onDelete, onLike }) {
  const {
    id,
    titulo,
    contenido,
    imagen,
    fecha_publicacion,
    tipo_autor,
    autor_id,
    comentarios = [],
    likes_count = 0,
  } = publicacion;

  const [nuevoComentario, setNuevoComentario] = useState("");
  const [comentariosLocal, setComentariosLocal] = useState(comentarios);

  const puedeEliminar = me && (me.rol === "admin" || me.id === autor_id);

  const fechaFormateada = fecha_publicacion
    ? new Date(fecha_publicacion).toLocaleDateString("es-ES", {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Sin fecha";

  const handleComentar = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    try {
      const res = await fetch(`${API_NEWS}/api/comentarios/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          publicacion: id,
          contenido: nuevoComentario,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setComentariosLocal((prev) => [...prev, data]);
        setNuevoComentario("");
      } else {
        const errData = await res.json();
        console.error("Error al comentar:", errData);
      }
    } catch (err) {
      console.error("❌ Error al enviar comentario:", err);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow p-4 space-y-2">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg text-gray-800">{titulo || "Sin título"}</h3>
        {puedeEliminar && (
          <button
            onClick={() => onDelete && onDelete(id)}
            className="text-red-500 hover:text-red-700"
            title="Eliminar publicación"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <p className="text-sm text-gray-500">
        📅 {fechaFormateada} — 👤 {tipo_autor === "institucion" ? "Institución" : "Usuario"}
      </p>

      {imagen && (
        <img
          src={imagen}
          alt="Imagen de publicación"
          className="w-full h-64 object-cover rounded-lg my-2"
        />
      )}

      <div
        className="text-gray-800 text-sm prose max-w-none"
        dangerouslySetInnerHTML={{ __html: contenido || "" }}
      />

      <div className="flex items-center gap-2 text-gray-500">
        <button
          onClick={() => onLike && onLike(id)}
          className="flex items-center gap-1 hover:text-red-500 transition"
        >
          <Heart size={16} />
          <span>{likes_count}</span>
        </button>
      </div>

      {/* 💬 Comentarios */}
      <div className="pt-3 border-t mt-2">
        <h4 className="font-semibold text-gray-700 mb-2">
          Comentarios ({comentariosLocal.length})
        </h4>

        {comentariosLocal.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay comentarios aún.</p>
        ) : (
          comentariosLocal.map((c) => (
            <div key={c.id} className="border-b pb-1 mb-1">
              <p className="text-sm text-gray-700">
                <span className="font-semibold text-blue-600">
                  {c.usuario_nombre || "Usuario"}
                </span>{" "}
                <span className="text-gray-400 text-xs ml-2">
                  {c.fecha_formateada}
                </span>
              </p>
              <p className="text-gray-800 text-sm">{c.contenido}</p>
            </div>
          ))
        )}

        <form onSubmit={handleComentar} className="flex flex-col gap-2 mt-2">
          <textarea
            value={nuevoComentario}
            onChange={(e) => setNuevoComentario(e.target.value)}
            placeholder="Escribe un comentario..."
            className="w-full p-2 border rounded-lg resize-none text-sm focus:ring focus:ring-blue-200"
            rows="2"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm self-end"
          >
            Enviar
          </button>
        </form>
      </div>
    </div>
  );
}
