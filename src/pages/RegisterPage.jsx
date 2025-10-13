import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_AUTH = import.meta.env.VITE_AUTH_API;

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    telefono: "",
    rol: "estudiante",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const res = await fetch(`${API_AUTH}/api/auth/register/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        const errMsg =
          data.email?.[0] ||
          data.detail ||
          "Error al registrarte. Verifica los datos.";
        throw new Error(errMsg);
      }

      setSuccess("✅ Registro exitoso. Redirigiendo al login...");
      setForm({
        nombre: "",
        apellido: "",
        email: "",
        password: "",
        telefono: "",
        rol: "estudiante",
      });

      // ⏳ Redirigir al login después de 3 segundos
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Crear cuenta
        </h2>

        {error && (
          <p className="text-red-600 mb-3 text-center bg-red-50 p-2 rounded">
            {error}
          </p>
        )}
        {success && (
          <p className="text-green-600 mb-3 text-center bg-green-50 p-2 rounded">
            {success}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="nombre"
            placeholder="Nombre"
            value={form.nombre}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="apellido"
            placeholder="Apellido"
            value={form.apellido}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
          />
          <input
            type="text"
            name="telefono"
            placeholder="Teléfono (opcional)"
            value={form.telefono}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          />
          <select
            name="rol"
            value={form.rol}
            onChange={handleChange}
            className="w-full border p-2 rounded"
          >
            <option value="estudiante">Estudiante</option>
            <option value="orientador">Orientador</option>
            <option value="institucion">Institución</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            Crear cuenta
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => navigate("/login")}
            className="inline-block text-blue-600 hover:underline"
          >
            ⬅ Regresar al login
          </button>

          <p className="text-gray-600 text-sm mt-4">¿Prefieres usar Google?</p>
          <a
            href={`${API_AUTH}/api/auth/google/login/`}
            className="inline-block bg-red-500 text-white px-4 py-2 rounded mt-2 hover:bg-red-600"
          >
            Iniciar con Google
          </a>
        </div>
      </div>
    </div>
  );
}
