import React, { useEffect, useState } from "react";
import NewsCard from "./NewsCard";
import NewsForm from "./NewsForm";

const API_NEWS = import.meta.env.VITE_NEWS_API;

export default function NoticiasPage({ token, me }) {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNews = async () => {
    try {
      const res = await fetch(`${API_NEWS}/api/publicaciones/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Error al obtener publicaciones");
      const data = await res.json();

      if (Array.isArray(data)) {
        setPublicaciones(data);
      } else if (data.results) {
        setPublicaciones(data.results);
      } else {
        setPublicaciones([]);
      }
    } catch (err) {
      console.error("Error al obtener publicaciones:", err);
      setPublicaciones([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [token]);

  const handleCreated = (nuevaPublicacion) => {
    setPublicaciones((prev) => [nuevaPublicacion, ...prev]);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("¿Eliminar esta publicación?")) return;
    try {
      const res = await fetch(`${API_NEWS}/api/publicaciones/${id}/eliminar/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) {
        alert("✅ Publicación eliminada correctamente.");
        fetchNews();
      } else {
        const errData = await res.json();
        alert(errData.detail || "❌ No tienes permiso para eliminar esta publicación.");
      }
    } catch (err) {
      console.error("Error al eliminar publicación:", err);
    }
  };

  const handleLike = async (id) => {
    try {
      const res = await fetch(`${API_NEWS}/api/publicaciones/${id}/like/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (res.ok) fetchNews();
    } catch (err) {
      console.error("Error al dar like:", err);
    }
  };

  if (loading) {
    return (
      <div className="p-6 bg-white rounded shadow text-center">
        ⏳ Cargando publicaciones...
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">📰 Noticias y Publicaciones</h2>

      {(me?.rol === "admin" || me?.rol === "institucion") && (
        <NewsForm token={token} onCreated={handleCreated} />
      )}

      {publicaciones.length === 0 ? (
        <div className="p-4 bg-white rounded shadow text-center text-gray-500">
          No hay publicaciones aún.
        </div>
      ) : (
        publicaciones.map((pub) => (
          <NewsCard
            key={pub.id}
            publicacion={pub}
            me={me}
            token={token}
            onDelete={handleDelete}
            onLike={handleLike}
          />
        ))
      )}
    </div>
  );
}
