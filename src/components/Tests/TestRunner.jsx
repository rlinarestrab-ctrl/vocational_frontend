import React, { useEffect, useState } from "react";
import { fetchTestDetail, enviarRespuestas } from "./TestAPI";
import { ArrowRightCircle } from "lucide-react";

export default function TestRunner({ token, test, me, onFinish }) {
  const [preguntas, setPreguntas] = useState([]);
  const [respuestas, setRespuestas] = useState({});
  const [loading, setLoading] = useState(true);
  const [pagina, setPagina] = useState(0);

  useEffect(() => {
    fetchTestDetail(test.id, token)
      .then((data) => setPreguntas(data.preguntas))
      .finally(() => setLoading(false));
  }, [test, token]);

  const handleChange = (preguntaId, puntuacion) => {
    setRespuestas((prev) => ({ ...prev, [preguntaId]: puntuacion }));
  };

  const handleEnviar = async () => {
    const payload = {
      usuario_id: me.id || localStorage.getItem("id"),
      test_id: test.id,
      respuestas: Object.entries(respuestas).map(([pregunta_id, puntuacion]) => ({
        pregunta_id,
        puntuacion,
      })),
    };
    const data = await enviarRespuestas(token, payload);
    onFinish(data);
  };

  if (loading) return <p className="text-center text-gray-500 mt-10">Cargando test...</p>;
  const current = preguntas[pagina];

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-md p-6 mt-4">
      <h2 className="text-xl font-bold text-blue-700 mb-2">{test.titulo}</h2>
      <p className="text-sm text-gray-600 mb-4">{test.descripcion}</p>

      {current ? (
        <div>
          <p className="text-gray-800 mb-3 font-medium">{pagina + 1}. {current.texto_pregunta}</p>
          <div className="flex flex-col gap-2">
            {current.opciones.map((op) => (
              <label
                key={op.id}
                className={`border rounded-lg px-4 py-2 cursor-pointer hover:bg-blue-50 ${
                  respuestas[current.id] === op.puntuacion ? "bg-blue-100 border-blue-500" : "border-gray-300"
                }`}
              >
                <input
                  type="radio"
                  name={current.id}
                  value={op.puntuacion}
                  checked={respuestas[current.id] === op.puntuacion}
                  onChange={() => handleChange(current.id, op.puntuacion)}
                  className="mr-2"
                />
                {op.texto_opcion}
              </label>
            ))}
          </div>

          <div className="flex justify-between items-center mt-6">
            <button
              disabled={pagina === 0}
              onClick={() => setPagina((p) => p - 1)}
              className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
            >
              Anterior
            </button>

            {pagina === preguntas.length - 1 ? (
              <button
                onClick={handleEnviar}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <ArrowRightCircle className="w-5 h-5" /> Enviar respuestas
              </button>
            ) : (
              <button
                onClick={() => setPagina((p) => p + 1)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Siguiente
              </button>
            )}
          </div>
        </div>
      ) : (
        <p>No hay preguntas disponibles.</p>
      )}
    </div>
  );
}
