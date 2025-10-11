import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

const API_BASE = import.meta.env.VITE_AUTH_API || "http://localhost:8000"

export default function Login({ onLogin }) {
  const [email, setEmail] = useState("admin@example.com")
  const [password, setPassword] = useState("admin")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // 🔐 Login con usuario y contraseña
  const submit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/auth/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) throw new Error("Credenciales inválidas")

      const data = await res.json()

      // Guardar tokens y usuario
      localStorage.setItem("access", data.tokens.access)
      localStorage.setItem("refresh", data.tokens.refresh)
      localStorage.setItem("me", JSON.stringify(data.user))

      // Notificar al componente padre (App.jsx)
      onLogin(data.tokens.access, data.tokens.refresh, data.user)

      // Redirigir según el rol del usuario
      if (data.user.rol === "admin") {
        navigate("/dashboard")
      } else {
        navigate("/dashboard") // más adelante puede ser /perfil-estudiante
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // 🌐 Login con Google
  const loginWithGoogle = async () => {
    try {
      const res = await fetch(`${API_BASE}/api/auth/google/login/`)
      if (!res.ok) throw new Error("Error al conectar con Google")
      const data = await res.json()
      window.location.href = data.auth_url
    } catch (err) {
      console.error("Error iniciando login con Google:", err)
      setError("Error iniciando sesión con Google")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md transition-all duration-300 hover:shadow-2xl">
        
        {/* 🧭 Logo y título */}
        <div className="flex flex-col items-center mb-6">
          <img
            src="https://cdn-icons-png.flaticon.com/512/535/535239.png"
            alt="Brújula logo"
            className="w-16 h-16 mb-2"
          />
          <h1 className="text-2xl font-bold text-gray-800">Tu Ruta Educativa</h1>
          <p className="text-sm text-gray-500">Encuentra tu camino 🚀</p>
        </div>

        {/* 📋 Formulario de login */}
        <form onSubmit={submit} className="flex flex-col gap-4">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Correo electrónico"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Contraseña"
            className="border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={loading}
            className={`${
              loading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
            } text-white py-2 rounded-lg transition transform hover:scale-105`}
          >
            {loading ? "Iniciando..." : "Entrar"}
          </button>

          {error && (
            <div className="text-red-500 text-center text-sm mt-2">{error}</div>
          )}
        </form>

        {/* 🔸 Separador */}
        <div className="flex items-center my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-3 text-gray-500 text-sm">o</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* 🌍 Botón de Google */}
        <button
          onClick={loginWithGoogle}
          className="flex items-center justify-center w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition transform hover:scale-105"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google logo"
            className="w-5 h-5 mr-2 bg-white rounded-full p-1"
          />
          Entrar con Google
        </button>
      </div>
    </div>
  )
}
