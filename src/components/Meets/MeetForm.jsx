import React, { useState } from "react";
import { API } from "../../config/api";

export default function MeetForm({ onCreated }) {
  const [form, setForm] = useState({
    titulo: "",
    descripcion: "",
    fecha_programada: "",
  });
  const [mensaje, setMensaje] = useState("");
  const [loading, setLoading] = useState(false);
  const [enlaceMeet, setEnlaceMeet] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje("");
    setEnlaceMeet(null);

    const token = localStorage.getItem("access");
    const googleToken = localStorage.getItem("google_access_token");

    if (!token) {
      setMensaje("⚠️ Sesión expirada. Inicia sesión nuevamente.");
      setLoading(false);
      return;
    }

    if (!googleToken) {
      setMensaje("⚠️ No se detectó autorización de Google Calendar. Inicia sesión con Google nuevamente.");
      setLoading(false);
      return;
    }

    try {
      console.log("📤 Enviando datos:", form);
      console.log("🔑 Google Token:", googleToken);

      const res = await fetch(`${API.MEETS}/api/meet/salas/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // JWT backend
          "Google-Access-Token": googleToken, // 🔑 token real de Google
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        console.error("❌ Error backend:", data);
        if (res.status === 403) setMensaje("🚫 No tienes permiso para crear reuniones.");
        else if (res.status === 401) setMensaje("⚠️ Token inválido o expirado. Inicia sesión de nuevo.");
        else setMensaje(data.detail || "❌ Error al crear la reunión.");
        setLoading(false);
        return;
      }

      // ✅ Éxito
      console.log("✅ Reunión creada:", data);
      setForm({ titulo: "", descripcion: "", fecha_programada: "" });
      setMensaje("✅ Reunión creada correctamente");

      if (data.enlace_acceso) {
        setEnlaceMeet(data.enlace_acceso);
        console.log("🔗 Enlace de Meet:", data.enlace_acceso);
      }

      onCreated && onCreated();
    } catch (error) {
      console.error("⚠️ Error de conexión con el backend:", error);
      setMensaje("⚠️ No se pudo conectar con el servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-white shadow rounded-md max-w-md mx-auto mt-4"
    >
      <h2 className="text-lg font-bold mb-3 text-gray-800">Crear nueva reunión</h2>

      <input
        type="text"
        name="titulo"
        placeholder="Título"
        className="border p-2 mb-2 w-full rounded"
        value={form.titulo}
        onChange={handleChange}
        required
      />

      <textarea
        name="descripcion"
        placeholder="Descripción (opcional)"
        className="border p-2 mb-2 w-full rounded"
        value={form.descripcion}
        onChange={handleChange}
      />

      <input
        type="datetime-local"
        name="fecha_programada"
        className="border p-2 mb-2 w-full rounded"
        value={form.fecha_programada}
        onChange={handleChange}
        required
      />

      <button
        type="submit"
        disabled={loading}
        className={`${loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} text-white px-4 py-2 rounded transition`}
      >
        {loading ? "Guardando..." : "Guardar"}
      </button>

      {mensaje && (
        <p
          className={`mt-3 text-sm ${
            mensaje.includes("✅")
              ? "text-green-600"
              : mensaje.includes("⚠️")
              ? "text-yellow-600"
              : "text-red-600"
          }`}
        >
          {mensaje}
        </p>
      )}

      {enlaceMeet && (
        <div className="mt-4 p-3 border rounded bg-green-50 text-center">
          <p className="text-sm font-semibold text-green-700">
            ☕ Enlace de videollamada:
          </p>
          <a
            href={enlaceMeet}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 underline"
          >
            {enlaceMeet}
          </a>
        </div>
      )}
    </form>
  );
}
