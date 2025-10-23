import React, { useState, useEffect } from "react";
import TestList from "../components/Tests/TestList";
import TestRunner from "../components/Tests/TestRunner";
import TestResult from "../components/Tests/TestResult";
import MyResults from "../components/Tests/MyResults";
import ResumenVocacional from "../components/Tests/ResumenVocacional";
import { BarChart3, ClipboardList, GraduationCap } from "lucide-react";

export default function TestPage({ token, me, subView }) {
  const [selectedTest, setSelectedTest] = useState(null);
  const [resultado, setResultado] = useState(null);
  const [view, setView] = useState("list"); // vista interna local: list, history, summary

  // 🧭 Sincroniza automáticamente el subView del Sidebar con la vista interna
  useEffect(() => {
    if (!subView) setView("list");
    else if (subView === "historial") setView("history");
    else if (subView === "resumen") setView("summary");
    else setView("list");
  }, [subView]);

  // 📊 Si hay un resultado, mostrar el resultado final del test
  if (resultado)
    return (
      <TestResult
        resultado={resultado}
        onBack={() => {
          setResultado(null);
          setSelectedTest(null);
          setView("list");
        }}
      />
    );

  // 🧩 Si hay un test seleccionado, mostrar el test runner
  if (selectedTest)
    return (
      <TestRunner
        token={token}
        test={selectedTest}
        me={me}
        onFinish={setResultado}
      />
    );

  // 📋 Vista principal: lista, historial o resumen según `view`
  return (
    <div className="p-6">
      {/* Encabezado dinámico */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
            {view === "list" && <ClipboardList className="w-6 h-6 text-blue-600" />}
            {view === "history" && <BarChart3 className="w-6 h-6 text-blue-600" />}
            {view === "summary" && <GraduationCap className="w-6 h-6 text-blue-600" />}
            {view === "list" && "Tests Vocacionales"}
            {view === "history" && "Historial de Resultados"}
            {view === "summary" && "Resumen Vocacional"}
          </h1>
          <p className="text-gray-600 text-sm">
            {view === "list" &&
              "Selecciona un test para descubrir tus intereses y carreras afines."}
            {view === "history" &&
              "Consulta los resultados de los tests que has completado."}
            {view === "summary" &&
              "Visualiza la evolución de tus intereses vocacionales a lo largo del tiempo."}
          </p>
        </div>
      </div>

      {/* Contenido dinámico */}
      {view === "list" && <TestList token={token} onSelect={setSelectedTest} />}
      {view === "history" && <MyResults token={token} me={me} />}
      {view === "summary" && <ResumenVocacional token={token} me={me} />}
    </div>
  );
}
