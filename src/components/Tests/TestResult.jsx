import React from "react";

export default function TestResult({ result, onRestart }) {
  if (!result) return null;

  return (
    <div className="p-6 text-center">
      <h2 className="text-2xl font-bold mb-3">Resultados del Test</h2>
      <p className="mb-4 text-gray-600">
        Puntuación total: <strong>{result.puntuacion_total}</strong>
      </p>

      <h3 className="text-lg font-semibold mt-6 mb-3">Carreras sugeridas</h3>
      <ul className="space-y-2">
        {result.carreras.map((c) => (
          <li
            key={c.id}
            className="p-3 border rounded shadow-sm bg-gray-50 text-left"
          >
            <p className="font-bold">{c.carrera.nombre}</p>
            <p className="text-sm text-gray-600">{c.carrera.descripcion}</p>
            <p className="text-sm mt-1 text-blue-700">
              Compatibilidad: {c.compatibilidad}%
            </p>
          </li>
        ))}
      </ul>

      <button
        onClick={onRestart}
        className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Volver a la lista de tests
      </button>
    </div>
  );
}
