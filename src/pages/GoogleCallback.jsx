import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

const API_BASE = import.meta.env.VITE_AUTH_API || "http://localhost:8000"

export default function GoogleCallback({ onLogin }) {
  const navigate = useNavigate()

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get("code")
    const state = params.get("state")

    const fetchTokens = async () => {
      try {
        const res = await fetch(
          `${API_BASE}/api/auth/google/callback/?code=${code}&state=${state}`,
          { credentials: "include" }
        )
        if (!res.ok) throw new Error("Error al autenticar con Google")
        const data = await res.json()

        // 🔑 Guardamos tokens con el mismo flujo que tu login normal
        onLogin(data.tokens.access, data.tokens.refresh, data.user)

        // Redirige al dashboard
        navigate("/Dashboard")
      } catch (err) {
        console.error(err)
        navigate("/login?error=google")
      }
    }

    if (code) fetchTokens()
  }, [navigate, onLogin])

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p className="text-gray-600 text-lg">Conectando con Google...</p>
    </div>
  )
}
