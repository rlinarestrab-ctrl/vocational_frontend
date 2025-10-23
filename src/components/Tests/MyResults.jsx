import React from "react";
import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Bar,
} from "recharts";

export default function TestResult({ resultado, onBack }) {
  if (!resultado) return null;

  const { codigo_holland, resultados_area, carreras_recomendadas } = resultado;

  // 🔢 Convertimos resultados_area en formato para el gráfico
  const data = Object.entries(resultados_area).map(([area, valor]) => ({
    area,
    puntuacion: Number(valor.toFixed(2)),
  }));

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-8">
      <h2 className="text-3xl font-bold text-center text-blue-700 mb-2">
        Resultado del Test RIASEC
      </h2>
      <p className="text-center text-gray-600 mb-8">
        Tu perfil Holland es:{" "}
        <span className="font-bold text-blue-600">{codigo_holland}</span>
      </p>

      {/* 🧭 Radar Chart */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={data}>
              <PolarGrid />
              <PolarAngleAxis dataKey="area" />
              <PolarRadiusAxis angle={30} domain={[0, 5]} />
              <Radar
                name="Puntuación"
                dataKey="puntuacion"
                stroke="#2563eb"
                fill="#3b82f6"
                fillOpacity={0.5}
              />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* 🧱 Bar Chart */}
        <div className="w-full h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="area" />
              <YAxis domain={[0, 5]} />
              <Tooltip />
              <Legend />
              <Bar dataKey="puntuacion" fill="#2563eb" name="Nivel de interés" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 📊 Tabla de resultados */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-3">Puntuaciones por área</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {data.map((d) => (
            <div
              key={d.area}
              className="bg-blue-50 p-4 rounded-xl shadow-sm text-center"
            >
              <p className="font-semibold text-gray-800">{d.area}</p>
              <p className="text-blue-700 text-2xl font-bold">{d.puntuacion}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 🎓 Carreras sugeridas */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-3">Carreras sugeridas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {carreras_recomendadas.map((carrera, index) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-4 bg-gradient-to-r from-blue-50 to-blue-100 shadow-sm"
            >
              <h4 className="font-semibold text-gray-800">
                {carrera.nombre}
              </h4>
              <p className="text-sm text-gray-600 mt-1">{carrera.descripcion}</p>
              <span className="inline-block mt-2 text-xs text-blue-700 font-semibold bg-white px-3 py-1 rounded-full">
                {carrera.area_conocimiento}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 🔙 Botón volver */}
      <div className="text-center mt-10">
        <button
          onClick={onBack}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all"
        >
          Volver a los tests
        </button>
      </div>
    </div>
  );
}
