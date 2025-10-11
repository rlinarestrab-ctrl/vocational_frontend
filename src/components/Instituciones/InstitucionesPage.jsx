import React, { useState, useEffect } from "react"
import InstitucionesForm from "./InstitucionesForm"
import InstitucionesList from "./InstitucionesList"

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8001"

export default function InstitucionesPage({ token }) {
  const [instituciones, setInstituciones] = useState([])
  const [q, setQ] = useState("")
  const [editing, setEditing] = useState(null) // 👈 aquí guardamos institución a editar

  // cargar instituciones
  const load = async () => {
    const res = await fetch(`${API_BASE}/api/instituciones/?q=${encodeURIComponent(q)}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) {
      const data = await res.json()
      setInstituciones(data.results || data)
    }
  }

  useEffect(() => { load() }, [q])

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Instituciones</h2>
      <input
        placeholder="Buscar..."
        value={q}
        onChange={e => setQ(e.target.value)}
        className="border rounded px-3 py-2 mb-4 w-full"
      />

      <InstitucionesForm
        token={token}
        onSaved={load}
        editing={editing}
        setEditing={setEditing}
      />

      <InstitucionesList
        token={token}
        instituciones={instituciones}
        onDeleted={load}
        onEdit={setEditing} // 👈 pasamos función de editar
      />
    </div>
  )
}
