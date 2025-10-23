import React, { useEffect, useState } from "react";
import { fetchTests } from "./TestAPI";
import { Loader2, PlayCircle } from "lucide-react";

export default function TestList({ token, onSelect }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTests(token)
      .then((data) => setTests(data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <Loader2 className="animate-spin w-8 h-8 text-blue-500 mx-auto mt-10" />;
  if (tests.length === 0) return <p className="text-center text-gray-500 mt-10">No hay tests disponibles.</p>;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {tests.map((t) => (
        <div key={t.id} className="bg-white shadow-md rounded-2xl p-5 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-2">{t.titulo}</h2>
            <p className="text-sm text-gray-600 mb-4">{t.descripcion}</p>
          </div>
          <button
            onClick={() => onSelect(t)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
          >
            <PlayCircle className="w-5 h-5" /> Iniciar Test
          </button>
        </div>
      ))}
    </div>
  );
}
