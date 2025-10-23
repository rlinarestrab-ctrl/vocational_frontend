import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard({ me, setView, setSubView }) {
  const navigate = useNavigate();
  const user = me || JSON.parse(localStorage.getItem("me"));
  const rol = user?.rol || "estudiante";

  const goTo = (v, sub = null) => {
    setView(v);
    setSubView(sub);
    let path = `/dashboard/${v}`;
    if (v === "videollamadas" && sub) path += `/${sub}`;
    navigate(path);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gray-50 py-10 px-4">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-4xl text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          ¡Bienvenido, {user?.nombre || "Usuario"}! 👋
        </h1>
        <p className="text-gray-600">
          Este es tu panel principal de <strong>Tu Ruta Educativa</strong>.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl w-full">
        <Card
          title="🧠 Tests vocacionales"
          description="Explora o administra tus tests vocacionales"
          label="Ir a Tests"
          onClick={() => goTo("tests")}
        />
        <Card
          title="📰 Noticias"
          description="Consulta y publica noticias"
          label="Ir a Noticias"
          onClick={() => goTo("noticias")}
        />
        <Card
          title="🎥 Videollamadas"
          description="Gestiona tus reuniones y calendario"
          label="Ir a Videollamadas"
          onClick={() => goTo("videollamadas", "lista")}
        />
        {rol === "admin" && (
          <Card
            title="👥 Usuarios"
            description="Administra usuarios del sistema"
            label="Ver usuarios"
            onClick={() => goTo("users")}
          />
        )}
        <Card
          title="🙍‍♂️ Perfil"
          description="Consulta o edita tu información personal"
          label="Ver perfil"
          onClick={() => goTo("profile")}
        />
      </div>
    </div>
  );
}

function Card({ title, description, label, onClick }) {
  return (
    <div
      onClick={onClick}
      className="cursor-pointer bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition hover:bg-indigo-50"
    >
      <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
      <p className="text-gray-600 mb-3">{description}</p>
      <span className="text-indigo-600 font-medium hover:underline">
        {label} →
      </span>
    </div>
  );
}
