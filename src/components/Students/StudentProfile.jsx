import React from "react"

export default function StudentProfile({ me }) {
  if (!me) return null

  return (
    <div className="p-6 max-w-2xl mx-auto bg-white rounded-xl shadow-lg space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        👩‍🎓 Mi Perfil
      </h2>

      <div className="space-y-3">
        <div>
          <span className="font-semibold text-gray-700">Nombre:</span>
          <p className="text-gray-600">
            {me.nombre} {me.apellido}
          </p>
        </div>

        <div>
          <span className="font-semibold text-gray-700">Correo:</span>
          <p className="text-gray-600">{me.email}</p>
        </div>

        <div>
          <span className="font-semibold text-gray-700">Rol:</span>
          <p className="text-gray-600 capitalize">{me.rol}</p>
        </div>

        {me.telefono && (
          <div>
            <span className="font-semibold text-gray-700">Teléfono:</span>
            <p className="text-gray-600">{me.telefono}</p>
          </div>
        )}

        {me.fecha_nacimiento && (
          <div>
            <span className="font-semibold text-gray-700">Fecha de nacimiento:</span>
            <p className="text-gray-600">{me.fecha_nacimiento}</p>
          </div>
        )}
      </div>

      <div className="mt-6">
        <p className="text-sm text-gray-500 italic">
          Este es tu panel personal. No tienes permisos de administrador.
        </p>
      </div>
    </div>
  )
}
