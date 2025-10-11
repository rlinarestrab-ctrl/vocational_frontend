import React, { useState, useEffect } from "react"

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8001"

export default function InstitucionesForm({ token, onSaved, editing, setEditing }) {
  const [form, setForm] = useState({
    nombre: "",
    tipo: "universidad",
    ruc: "",
    email: "",
    telefono: "",
    direccion: "",
    sitio_web: "",
    logo_url: ""
  })

  // cuando selecciono institución a editar, cargamos datos en el form
  useEffect(() => {
    if (editing) {
      setForm(editing)
    }
  }, [editing])

  const save = async (e) => {
    e.preventDefault()
    const url = editing
      ? `${API_BASE}/api/instituciones/${editing.id}/`
      : `${API_BASE}/api/instituciones/`

    const method = editing ? "PUT" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    })

    if (res.ok) {
      setForm({
        nombre: "",
        tipo: "universidad",
        ruc: "",
        email: "",
        telefono: "",
        direccion: "",
        sitio_web: "",
        logo_url: ""
      })
      setEditing(null) // reset edición
      onSaved()
    }
  }

  return (
    <form onSubmit={save} className="grid gap-3 grid-cols-2 md:grid-cols-3 mb-6">
      <input placeholder="Nombre" value={form.nombre} onChange={e => setForm({ ...form, nombre: e.target.value })} className="border rounded px-3 py-2" />
      <select value={form.tipo} onChange={e => setForm({ ...form, tipo: e.target.value })} className="border rounded px-3 py-2">
        <option value="colegio">Colegio</option>
        <option value="universidad">Universidad</option>
        <option value="instituto">Instituto</option>
        <option value="centro_formacion">Centro de formación</option>
      </select>
      <input placeholder="RUC" value={form.ruc} onChange={e => setForm({ ...form, ruc: e.target.value })} className="border rounded px-3 py-2" />
      <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="border rounded px-3 py-2" />
      <input placeholder="Teléfono" value={form.telefono} onChange={e => setForm({ ...form, telefono: e.target.value })} className="border rounded px-3 py-2" />
      <input placeholder="Dirección" value={form.direccion} onChange={e => setForm({ ...form, direccion: e.target.value })} className="border rounded px-3 py-2" />
      <input placeholder="Sitio web" value={form.sitio_web} onChange={e => setForm({ ...form, sitio_web: e.target.value })} className="border rounded px-3 py-2" />
      <input placeholder="Logo URL" value={form.logo_url} onChange={e => setForm({ ...form, logo_url: e.target.value })} className="border rounded px-3 py-2" />
      <div className="col-span-2 flex gap-2">
        <button className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition">
          {editing ? "Actualizar" : "Crear"}
        </button>
        {editing && (
          <button type="button" onClick={() => { setEditing(null); setForm({ nombre: "", tipo: "universidad", ruc: "", email: "", telefono: "", direccion: "", sitio_web: "", logo_url: "" }) }} className="bg-gray-400 text-white py-2 px-4 rounded hover:bg-gray-500 transition">
            Cancelar
          </button>
        )}
      </div>
    </form>
  )
}
