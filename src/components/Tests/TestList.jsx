import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fetchTests, iniciarTest } from "./TestAPI";
import { Loader2, PlayCircle } from "lucide-react";

export default function TestList({ token, me, onStart }) {
  const [tests, setTests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchTests(token);
        setTests(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleStart = async (testId) => {
    const result = await iniciarTest(testId, me.id, token);
    onStart(result);
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-indigo-600">
        <Loader2 className="w-10 h-10 animate-spin mb-3" />
        <p className="text-lg font-semibold">Cargando tests...</p>
      </div>
    );

  if (!tests.length)
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-500">
        <p className="text-lg font-medium">No hay tests disponibles por ahora 😔</p>
      </div>
    );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <motion.h2
        className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        🧭 Explora tus tests vocacionales
      </motion.h2>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {tests.map((t, index) => (
            <motion.div
              key={t.id}
              className="relative group p-6 rounded-2xl shadow-lg bg-white/60 backdrop-blur-md border border-white/40 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Glow hover effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-400/20 to-blue-400/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-all duration-300"></div>

              <div className="relative z-10">
                <h3 className="font-semibold text-xl text-gray-800 mb-2">
                  {t.titulo}
                </h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {t.descripcion || "Descubre tus intereses y fortalezas."}
                </p>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleStart(t.id)}
                  className="flex items-center justify-center gap-2 w-full bg-gradient-to-r from-indigo-600 to-blue-500 text-white py-2.5 rounded-lg shadow-md hover:shadow-xl hover:brightness-110 transition-all"
                >
                  <PlayCircle className="w-5 h-5" />
                  <span className="font-semibold">Iniciar Test</span>
                </motion.button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
