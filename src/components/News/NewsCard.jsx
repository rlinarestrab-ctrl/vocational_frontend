import React, { useState } from "react";
import Comentarios from "./Comentarios";

const API_NEWS = import.meta.env.VITE_NEWS_API;

export default function NoticiaCard({ publicacion, token, me }) {
  const [likes, setLikes] = useState(publicacion.likes_count || 0);
  const [liked, setLiked] = useState(publicacion.liked_by_user || false);

  // ✅ Definir imagenUrl antes del return
  const imagenUrl =
    publicacion.imagen && publicacion.imagen.startsWith("http")
      ? publicacion.imagen
      : publicacion.imagen
      ? `${API_NEWS}${publicacion.imagen}`
      : null;

  const toggleLike = async () => {
    if (!token) return alert("Debes iniciar sesión para dar like");
    try {
      const res = await fetch(
        `${API_NEWS}/api/publicaciones/${publicacion.id}/like_toggle/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res.ok) {
        setLiked(!liked);
        setLikes((prev) => (liked ? prev - 1 : prev + 1));
      } else {
        console.error(await res.text());
      }
    } catch (err) {
      console.error("Error al enviar like:", err);
    }
  };

  return (
    <div className="bg-white p-4 rounded shadow hover:shadow-md transition">
      <h3 className="text-xl font-semibold">{publicacion.titulo}</h3>

      {/* ✅ Imagen responsive con proporción */}
      {imagenUrl && (
        <div className="relative w-full overflow-hidden rounded-xl mt-3 aspect-[16/9] bg-gray-50">
          <img
            src={imagenUrl}
            alt={publicacion.titulo}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-105"
            onError={(e) => {
              e.target.src = "/default-image.jpg";
            }}
          />
        </div>
      )}

      <div
        className="text-gray-700 mt-2 prose prose-indigo max-w-none"
        dangerouslySetInnerHTML={{ __html: publicacion.contenido }}
      ></div>

      <div className="mt-3 flex items-center justify-between">
        <button
          onClick={toggleLike}
          className={`px-3 py-1 rounded text-sm transition ${
            liked ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
          }`}
        >
          ❤️ {likes} Me gusta
        </button>
        <span className="text-xs text-gray-400">
          {new Date(publicacion.fecha_publicacion).toLocaleDateString()}
        </span>
      </div>

      <div className="mt-4 border-t pt-2">
        <Comentarios publicacionId={publicacion.id} token={token} me={me} />
      </div>
    </div>
  );
}
