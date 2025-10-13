import React, { useEffect, useState } from "react";

const API_NEWS = import.meta.env.VITE_NEWS_API;

export default function CommentsSection({
  token,
  publicacionId,
  comentariosIniciales = [],
  me,
}) {
  const [comentarios, setComentarios] = useState(comentariosIniciales);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [respondiendoA, setRespondiendoA] = useState(null);
  const [cargando, setCargando] = useState(false);

  // ---------------- 🔄 CARGAR COMENTARIOS ----------------
  const fetchComentarios = async () => {
    try {
      const res = await fetch(
        `${API_NEWS}/api/comentarios/de-publicacion/${publicacionId}/`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );

      if (!res.ok) throw new Error("Error al obtener comentarios");
      const data = await res.json();
      setComentarios(data);
    } catch (err) {
      console.error("❌ Error al cargar comentarios:", err);
    }
  };

  useEffect(() => {
    if (publicacionId) {
      console.log("🆔 Cargando comentarios para publicación:", publicacionId);
      fetchComentarios();
    }
  }, [publicacionId]);

  // ---------------- 💬 CREAR COMENTARIO / RESPUESTA ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!nuevoComentario.trim()) return;

    setCargando(true);
    try {
      const url = respondiendoA
        ? `${API_NEWS}/api/comentarios/${respondiendoA}/responder/`
        : `${API_NEWS}/api/comentarios/`;

      const body = respondiendoA
        ? JSON.stringify({ contenido: nuevoComentario })
        : JSON.stringify({
            publicacion: publicacionId,
            contenido: nuevoComentario,
          });

      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
          "Content-Type": "application/json",
        },
        body,
      });

      if (!res.ok) throw new Error("Error al crear comentario");

      await fetchComentarios();
      setNuevoComentario("");
      setRespondiendoA(null);
    } catch (err) {
      console.error("❌ Error al enviar comentario:", err);
    } finally {
      setCargando(false);
    }
  };

  // ---------------- 🗑️ ELIMINAR COMENTARIO ----------------
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Eliminar este comentario?")) return;
    try {
      const res = await fetch(`${API_NEWS}/api/comentarios/${id}/`, {
        method: "DELETE",
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (res.ok) {
        setComentarios((prev) => prev.filter((c) => c.id !== id));
      }
    } catch (err) {
      console.error("❌ Error al eliminar comentario:", err);
    }
  };

  // ---------------- 💬 RENDERIZAR RESPUESTAS ----------------
  const renderRespuestas = (respuestas = [], nivel = 1) =>
    respuestas.map((resp) => (
      <div
        key={resp.id}
        className={`mt-2 ml-${nivel * 4} border-l pl-3 border-gray-300`}
      >
        <div className="flex justify-between items-start">
          <p className="text-sm text-gray-700">
            <span className="font-semibold text-blue-600">
              {resp.usuario_nombre || "Usuario"}
            </span>{" "}
            <span className="text-gray-400 text-xs ml-2">
              {resp.fecha_formateada}
            </span>
          </p>
          {(me?.rol === "admin" || me?.id === resp.usuario_id) && (
            <button
              onClick={() => handleEliminar(resp.id)}
              className="text-xs text-red-500 hover:text-red-700"
            >
              Eliminar
            </button>
          )}
        </div>

        <p className="text-gray-800 text-sm mb-1">{resp.contenido}</p>

        <button
          onClick={() => setRespondiendoA(resp.id)}
          className="text-xs text-gray-500 hover:text-blue-600"
        >
          Responder
        </button>

        {resp.respuestas && resp.respuestas.length > 0 && (
          <div>{renderRespuestas(resp.respuestas, nivel + 1)}</div>
        )}
      </div>
    ));

  // ---------------- 🖼️ UI PRINCIPAL ----------------
  return (
    <div className="space-y-4">
      <h4 className="font-semibold text-gray-700 mb-2">
        Comentarios ({comentarios.length})
      </h4>

      {/* FORMULARIO */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <textarea
          value={nuevoComentario}
          onChange={(e) => setNuevoComentario(e.target.value)}
          placeholder={
            respondiendoA
              ? "Escribe tu respuesta..."
              : "Escribe un comentario..."
          }
          className="w-full p-2 border rounded-lg resize-none text-sm focus:ring focus:ring-blue-200"
          rows="3"
          disabled={cargando}
        ></textarea>
        <div className="flex justify-between items-center">
          {respondiendoA && (
            <button
              type="button"
              onClick={() => setRespondiendoA(null)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              Cancelar respuesta
            </button>
          )}
          <button
            type="submit"
            disabled={cargando}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
          >
            {cargando ? "Enviando..." : "Enviar"}
          </button>
        </div>
      </form>

      {/* LISTA DE COMENTARIOS */}
      <div className="space-y-3">
        {comentarios.length === 0 ? (
          <p className="text-gray-500 text-sm">No hay comentarios aún.</p>
        ) : (
          comentarios.map((c) => (
            <div key={c.id} className="border-b pb-2">
              <div className="flex justify-between items-start">
                <p className="text-sm text-gray-700">
                  <span className="font-semibold text-blue-600">
                    {c.usuario_nombre || "Usuario"}
                  </span>{" "}
                  <span className="text-gray-400 text-xs ml-2">
                    {c.fecha_formateada}
                  </span>
                </p>
                {(me?.rol === "admin" || me?.id === c.usuario_id) && (
                  <button
                    onClick={() => handleEliminar(c.id)}
                    className="text-xs text-red-500 hover:text-red-700"
                  >
                    Eliminar
                  </button>
                )}
              </div>

              <p className="text-gray-800 text-sm mb-1">{c.contenido}</p>

              <button
                onClick={() => setRespondiendoA(c.id)}
                className="text-xs text-gray-500 hover:text-blue-600"
              >
                Responder
              </button>

              {c.respuestas && c.respuestas.length > 0 && (
                <div>{renderRespuestas(c.respuestas)}</div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
