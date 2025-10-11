import React from "react"
import MeetQuickCreate from "../components/Meets/MeetQuickCreate"

export default function Dashboard() {
  // Obtener datos del usuario autenticado
  const user = JSON.parse(localStorage.getItem("me"))

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Bienvenido 🚀
          </h1>
          <p className="text-gray-500">No hay datos de usuario.</p>
        </div>
      </div>
    )
  }

  const isAdmin = user.rol === "admin"
  const isEstudiante = user.rol === "estudiante"
  const isOrientador = user.rol === "orientador"

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 py-10 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ¡Bienvenido, {user.nombre || "Usuario"}! 👋
        </h1>
        <p className="text-gray-600">
          Este es tu panel principal de{" "}
          <strong>Tu Ruta Educativa</strong>.
        </p>
      </div>

      {/* Panel dinámico según el rol */}
      {isAdmin && <AdminDashboard />}
      {isEstudiante && <EstudianteDashboard user={user} />}
      {isOrientador && <OrientadorDashboard user={user} />}
    </div>
  )
}

// 🧑‍💼 Panel del ADMINISTRADOR
function AdminDashboard() {
  return (
    <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full">
      <Card
        title="👥 Usuarios"
        description="Administra usuarios del sistema"
        linkLabel="Ver usuarios"
        href="/dashboard?view=users"
      />
      <Card
        title="🏫 Instituciones"
        description="Gestiona universidades y colegios"
        linkLabel="Ver instituciones"
        href="/dashboard?view=instituciones"
      />
      <Card
        title="🧠 Tests vocacionales"
        description="Administra preguntas y escalas"
        linkLabel="Ver tests"
        href="/dashboard?view=tests"
      />
      <Card
        title="🎥 Videollamadas"
        description="Crea o revisa reuniones programadas"
        linkLabel="Ir al módulo"
        href="/dashboard?view=videollamadas"
      />
      <Card
        title="🔔 Notificaciones"
        description="Consulta avisos del sistema"
        linkLabel="Ver notificaciones"
        href="/dashboard?view=notificaciones"
      />
      <Card
        title="⚙️ Configuración"
        description="Ajustes y parámetros generales"
        linkLabel="Abrir configuración"
        href="/dashboard?view=settings"
      />
    </div>
  )
}

// 👩‍🎓 Panel del ESTUDIANTE
function EstudianteDashboard({ user }) {
  return (
    <div className="max-w-3xl w-full space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md text-left">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          🎓 Mi información personal
        </h2>
        <p className="text-gray-700">
          <strong>Nombre:</strong> {user.nombre} {user.apellido}
        </p>
        <p className="text-gray-700">
          <strong>Correo:</strong> {user.email}
        </p>
        <p className="text-gray-700 capitalize">
          <strong>Rol:</strong> {user.rol}
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card
          title="🧠 Mis Tests"
          description="Explora tus tests vocacionales"
          linkLabel="Ir a Tests"
          href="/dashboard?view=tests"
        />
        <Card
          title="🎥 Mis Videollamadas"
          description="Revisa tus sesiones agendadas"
          linkLabel="Ir a Videollamadas"
          href="/dashboard?view=videollamadas"
        />
      </div>
    </div>
  )
}

// 👨‍🏫 Panel del ORIENTADOR
function OrientadorDashboard({ user }) {
  return (
    <div className="max-w-3xl w-full space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md text-left">
        <h2 className="text-xl font-semibold text-gray-800 mb-2">
          👨‍🏫 Mi Panel de Orientador
        </h2>
        <p className="text-gray-700 mb-3">
          Bienvenido, {user.nombre}. Aquí podrás gestionar tus sesiones y estudiantes asignados.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card
          title="🎥 Videollamadas"
          description="Gestiona tus reuniones con estudiantes"
          linkLabel="Abrir módulo"
          href="/dashboard?view=videollamadas"
        />
        <Card
          title="👥 Estudiantes asignados"
          description="Revisa los perfiles de tus estudiantes"
          linkLabel="Ver lista"
          href="/dashboard?view=users"
        />
      </div>
    </div>
  )
}

// 🧱 Componente reutilizable de tarjeta
function Card({ title, description, linkLabel, href }) {
  return (
    <div
      onClick={() => (window.location.href = href)}
      className="cursor-pointer bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
    >
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-3">{description}</p>
      <span className="text-indigo-600 font-medium hover:underline">
        {linkLabel} →
      </span>
    </div>
  )
}
