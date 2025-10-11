import React, { useEffect, useState } from "react"

const API_BASE = import.meta.env.VITE_AUTH_API || "http://localhost:8000"

export default function Users({ token, me }) {
  const [users, setUsers] = useState([])
  const [q, setQ] = useState("")
  const [form, setForm] = useState({
    email: "",
    password: "",
    nombre: "",
    apellido: "",
    rol: "estudiante",
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const isAdmin = me?.rol === "admin"

  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {}

  // Cargar usuarios
  const load = async () => {
    if (!token) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(
        `${API_BASE}/api/users/?q=${encodeURIComponent(q)}`,
        { headers: { ...authHeaders } }
      )
      if (res.status === 401) {
        setError("Sesión expirada. Vuelve a iniciar sesión.")
        setUsers([])
        return
      }
      if (!res.ok) {
        const txt = await res.text()
        throw new Error(`Error cargando usuarios: ${res.status} ${txt}`)
      }
      const data = await res.json()
      setUsers(data.results || data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, q])

  // Crear usuario
  const save = async (e) => {
    e.preventDefault()
    if (!token) return setError("No hay token. Inicia sesión.")
    setError(null)
    try {
      const res = await fetch(`${API_BASE}/api/users/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...authHeaders,
        },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(`No se pudo crear: ${res.status} ${msg}`)
      }
      setForm({
        email: "",
        password: "",
        nombre: "",
        apellido: "",
        rol: "estudiante",
      })
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  // Eliminar usuario
  const del = async (id) => {
    if (!token) return setError("No hay token. Inicia sesión.")
    try {
      const res = await fetch(`${API_BASE}/api/users/${id}/`, {
        method: "DELETE",
        headers: { ...authHeaders },
      })
      if (!res.ok) {
        const msg = await res.text()
        throw new Error(`No se pudo eliminar: ${res.status} ${msg}`)
      }
      load()
    } catch (e) {
      setError(e.message)
    }
  }

  if (!token) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2">Usuarios</h2>
        <div className="text-red-600">
          No hay token. Inicia sesión para ver esta sección.
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Usuarios</h2>

      {error && (
        <div className="mb-4 p-3 rounded bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <input
        placeholder="Buscar..."
        value={q}
        onChange={(e) => setQ(e.target.value)}
        className="border rounded px-3 py-2 mb-4 w-full"
      />

      {isAdmin && (
        <form onSubmit={save} className="grid gap-3 grid-cols-2 md:grid-cols-3 mb-6">
          <input
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Nombre"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <input
            placeholder="Apellido"
            value={form.apellido}
            onChange={(e) => setForm({ ...form, apellido: e.target.value })}
            className="border rounded px-3 py-2"
          />
          <select
            value={form.rol}
            onChange={(e) => setForm({ ...form, rol: e.target.value })}
            className="border rounded px-3 py-2"
          >
            <option value="estudiante">Estudiante</option>
            <option value="orientador">Orientador</option>
            <option value="admin">Admin</option>
          </select>
          <button className="bg-green-600 text-white py-2 rounded hover:bg-green-700 transition">
            Crear
          </button>
        </form>
      )}

      <div className="relative">
        {loading && (
          <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded">
            <div className="animate-spin h-6 w-6 border-2 border-gray-400 border-t-transparent rounded-full" />
          </div>
        )}

        <table className="w-full border border-gray-300 rounded-lg overflow-hidden shadow">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-2 text-left">Email</th>
              <th className="px-4 py-2 text-left">Nombre</th>
              <th className="px-4 py-2 text-left">Rol</th>
              <th className="px-4 py-2 text-left">Activo</th>
              <th className="px-4 py-2 text-left">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t hover:bg-gray-50">
                <td className="px-4 py-2">{u.email}</td>
                <td className="px-4 py-2">
                  {u.nombre} {u.apellido}
                </td>
                <td className="px-4 py-2">{u.rol}</td>
                <td className="px-4 py-2">{u.activo ? "Sí" : "No"}</td>
                <td className="px-4 py-2">
                  {isAdmin && (
                    <button
                      onClick={() => del(u.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                    >
                      Eliminar
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {!loading && users.length === 0 && (
              <tr>
                <td colSpan="5" className="px-4 py-6 text-center text-gray-500">
                  No hay usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
