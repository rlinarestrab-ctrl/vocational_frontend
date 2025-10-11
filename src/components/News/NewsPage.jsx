import React, { useEffect, useState } from "react";
import NoticiaCard from "./NewsCard";
import NewsForm from "./NewsForm"; // 👈 nuevo formulario para publicar

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

      // ✅ Manejar respuesta paginada o lista directa
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

  // 👇 se ejecuta cuando se crea una nueva publicación
  const handleCreated = (nuevaPublicacion) => {
    setPublicaciones((prev) => [nuevaPublicacion, ...prev]);
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

      {/* 👇 Formulario visible solo para admin o institución */}
      {(me?.rol === "admin" || me?.rol === "institucion") && (
        <NewsForm token={token} onCreated={handleCreated} />
      )}

      {publicaciones.length === 0 ? (
        <div className="p-4 bg-white rounded shadow text-center text-gray-500">
          No hay publicaciones aún.
        </div>
      ) : (
        publicaciones.map((pub) => (
          <NoticiaCard key={pub.id} publicacion={pub} token={token} me={me} />
        ))
      )}
    </div>
  );
}
