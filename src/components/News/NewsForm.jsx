import React, { useState } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // 🧩 estilos del editor

export default function NewsForm({ token, onCreated }) {
  const [titulo, setTitulo] = useState("");
  const [contenido, setContenido] = useState("");
  const [imagen, setImagen] = useState(null); // ahora archivo
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const API_NEWS = import.meta.env.VITE_NEWS_API;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagen(file);
      setPreview(URL.createObjectURL(file)); // previsualización
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 🧩 usamos FormData en lugar de JSON
      const formData = new FormData();
      formData.append("titulo", titulo);
      formData.append("contenido", contenido);
      if (imagen) formData.append("imagen", imagen);

      const res = await fetch(`${API_NEWS}/api/publicaciones/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!res.ok) throw new Error("Error al crear publicación");
      const data = await res.json();
      onCreated && onCreated(data);
      setTitulo("");
      setContenido("");
      setImagen(null);
      setPreview(null);
      alert("✅ Publicación creada correctamente");
    } catch (err) {
      console.error(err);
      alert("❌ Error al crear publicación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow p-6 rounded-lg mb-6 space-y-4"
    >
      <h3 className="text-2xl font-semibold text-indigo-700 flex items-center gap-2">
        📝 Nueva Publicación
      </h3>

      <input
        type="text"
        placeholder="Título de la publicación"
        className="w-full p-3 border rounded focus:ring-2 focus:ring-indigo-500"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
      />

      {/* 🧩 Editor enriquecido */}
      <ReactQuill
        theme="snow"
        value={contenido}
        onChange={setContenido}
        placeholder="Escribe tu contenido aquí..."
        className="bg-white rounded-lg"
        style={{ height: "200px" }}
      />

      {/* 🧩 Selector de imagen local */}
      <div className="pt-4">
        <label className="block text-gray-700 font-medium mb-2">
        
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500
                     file:mr-4 file:py-2 file:px-4
                     file:rounded-full file:border-0
                     file:text-sm file:font-semibold
                     file:bg-indigo-50 file:text-indigo-700
                     hover:file:bg-indigo-100"
        />
        {preview && (
          <img
            src={preview}
            alt="Previsualización"
            className="mt-3 w-48 rounded-lg shadow"
          />
        )}
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg transition"
      >
        {loading ? "Publicando..." : "Publicar"}
      </button>
    </form>
  );
}
