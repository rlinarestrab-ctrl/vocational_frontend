import React, { useEffect, useState } from "react";
import { fetchTestDetail, enviarRespuesta, finalizarTest } from "./TestAPI.Js";

export default function TestDetail({ token, testResult, onFinish }) {
  const [test, setTest] = useState(null);
  const [current, setCurrent] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const data = await fetchTestDetail(testResult.test, token);
      setTest(data);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p>Cargando test...</p>;
  if (!test || !test.preguntas.length) return <p>Este test no tiene preguntas.</p>;

  const pregunta = test.preguntas[current];

  const handleAnswer = async (opcionId) => {
    await enviarRespuesta(testResult.id, pregunta.id, opcionId, token);
    if (current + 1 < test.preguntas.length) {
      setCurrent(current + 1);
    } else {
      const result = await finalizarTest(testResult.id, token);
      onFinish(result);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-3">{test.titulo}</h2>
      <p className="text-gray-700 mb-6">{pregunta.texto_pregunta}</p>

      <div className="space-y-2">
        {pregunta.opciones.map((op) => (
          <button
            key={op.id}
            onClick={() => handleAnswer(op.id)}
            className="w-full text-left px-4 py-2 bg-gray-100 hover:bg-blue-200 rounded"
          >
            {op.texto_opcion}
          </button>
        ))}
      </div>

      <p className="mt-6 text-sm text-gray-500">
        Pregunta {current + 1} de {test.preguntas.length}
      </p>
    </div>
  );
}
