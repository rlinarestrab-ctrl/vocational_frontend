import React from "react"

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8001"

export default function InstitucionesList({ instituciones, token, onDeleted, onEdit }) {
  const del = async (id) => {
    const res = await fetch(`${API_BASE}/api/instituciones/${id}/`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    })
    if (res.ok) onDeleted()
  }

  return (
    <table className="w-full border border-gray-300 rounded-lg overflow-hidden shadow">
      <thead className="bg-gray-100 text-gray-700">
        <tr>
          <th className="px-4 py-2 text-left">Nombre</th>
          <th className="px-4 py-2 text-left">Tipo</th>
          <th className="px-4 py-2 text-left">RUC</th>
          <th className="px-4 py-2 text-left">Email</th>
          <th className="px-4 py-2 text-left">Acciones</th>
        </tr>
      </thead>
      <tbody>
        {instituciones.map(i => (
          <tr key={i.id} className="border-t hover:bg-gray-50">
            <td className="px-4 py-2">{i.nombre}</td>
            <td className="px-4 py-2">{i.tipo}</td>
            <td className="px-4 py-2">{i.ruc}</td>
            <td className="px-4 py-2">{i.email}</td>
            <td className="px-4 py-2 flex gap-2">
              <button onClick={() => onEdit(i)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                Editar
              </button>
              <button onClick={() => del(i.id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition">
                Eliminar
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
