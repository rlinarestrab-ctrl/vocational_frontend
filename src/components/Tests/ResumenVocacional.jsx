import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Loader2, TrendingUp } from "lucide-react";

const API_TEST = import.meta.env.VITE_TEST_API;

export default function ResumenVocacional({ token, me }) {
  const [historial, setHistorial] = useState([]);
  const [promedios, setPromedios] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const usuarioId = me?.id || localStorage.getItem("id");
    if (!usuarioId) return;

    fetch(`${API_TEST}/api/resultados/mis-resultados/${usuarioId}/`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!Array.isArray(data)) return;
        // 🔍 Tomamos los resultados que tengan datos por área (resultados_area)
        const parsed = data
          .filter((r) => r.resultados_area)
          .map((r) => ({
            fecha: new Date(r.fecha_completado).toLocaleDateString(),
            ...r.resultados_area,
          }));

        setHistorial(parsed);

        // 📊 Calcular promedios por área
        const sum = {};
        const count = {};
        parsed.forEach((res) => {
          Object.entries(res).forEach(([area, val]) => {
            if (area !== "fecha") {
              sum[area] = (sum[area] || 0) + val;
              count[area] = (count[area] || 0) + 1;
            }
          });
        });

        const avg = {};
        Object.keys(sum).forEach((area) => {
          avg[area] = sum[area] / count[area];
        });
        setPromedios(avg);
      })
      .finally(() => setLoading(false));
  }, [token, me]);

  if (loading)
    return (
      <div className="flex justify-center mt-10">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );

  if (historial.length === 0)
    return (
      <p className="text-center text-gray-500 mt-10">
        No hay suficientes datos para mostrar un resumen vocacional.
      </p>
    );

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-md p-6 mt-6">
      <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-2 mb-2">
        <TrendingUp className="w-6 h-6 text-blue-600" /> Resumen Vocacional
      </h2>
      <p className="text-gray-600 mb-6">
        Evolución de tus intereses según los resultados de tus tests vocacionales.
      </p>

      {/* 📈 Gráfico de líneas */}
      <div className="w-full h-96">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={historial}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="fecha" />
            <YAxis domain={[0, 5]} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="Realista" stroke="#2563eb" strokeWidth={2} />
            <Line type="monotone" dataKey="Investigador" stroke="#059669" strokeWidth={2} />
            <Line type="monotone" dataKey="Artístico" stroke="#ec4899" strokeWidth={2} />
            <Line type="monotone" dataKey="Social" stroke="#eab308" strokeWidth={2} />
            <Line type="monotone" dataKey="Emprendedor" stroke="#f97316" strokeWidth={2} />
            <Line type="monotone" dataKey="Convencional" stroke="#6b7280" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 📊 Promedios actuales */}
      <div className="mt-10">
        <h3 className="text-lg font-semibold mb-3">Promedio general por área</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Object.entries(promedios).map(([area, val]) => (
            <div
              key={area}
              className="bg-blue-50 p-4 rounded-xl text-center shadow-sm"
            >
              <p className="font-semibold text-gray-800">{area}</p>
              <p className="text-blue-700 text-2xl font-bold">
                {val.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* 💬 Interpretación */}
      <div className="mt-10 bg-gray-50 border-l-4 border-blue-500 p-4 rounded-lg shadow-sm">
        <p className="text-gray-700">
          {generarInterpretacion(promedios)}
        </p>
      </div>
    </div>
  );
}

// 🧠 Función auxiliar para interpretación automática
function generarInterpretacion(promedios) {
  if (!promedios || Object.keys(promedios).length === 0) return "";

  const sorted = Object.entries(promedios)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  const top = sorted.map(([area]) => area);
  return `Tu perfil actual muestra mayor afinidad por las áreas ${top.join(
    ", "
  )}. Esto sugiere que tus intereses se orientan hacia carreras relacionadas con estas dimensiones.`;
}
