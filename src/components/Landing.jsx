import React from "react"
import { useNavigate } from "react-router-dom"

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 text-white">
      <div className="text-center p-8">
        {/* Logo brújula grande */}
        <img 
          src="https://cdn-icons-png.flaticon.com/512/535/535239.png" 
          alt="Brújula"
          className="w-24 h-24 mx-auto mb-6"
        />
        
        <h1 className="text-4xl font-bold mb-4">Tu Ruta Educativa</h1>
        <p className="text-lg mb-8">Encuentra tu camino, construye tu futuro 🚀</p>

        <button 
          onClick={() => navigate("/login")}
          className="bg-white text-blue-700 px-6 py-3 rounded-full font-semibold hover:bg-gray-100 shadow-lg transition transform hover:scale-105"
        >
          Entrar al sistema
        </button>
      </div>
    </div>
  )
}
