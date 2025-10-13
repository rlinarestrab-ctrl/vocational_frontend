// src/components/Tests/TestAPI.js
const API_TEST = import.meta.env.VITE_TEST_API; // ejemplo: http://localhost:8005

export async function fetchTests(token) {
  const res = await fetch(`${API_TEST}/api/tests/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener los tests");
  return res.json();
}

export async function fetchTestDetail(testId, token) {
  const res = await fetch(`${API_TEST}/api/tests/${testId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener el test");
  return res.json();
}

export async function iniciarTest(testId, userId, token) {
  const res = await fetch(`${API_TEST}/api/resultados/iniciar/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ test_id: testId, usuario_id: userId }),
  });
  if (!res.ok) throw new Error("Error al iniciar test");
  return res.json();
}

export async function enviarRespuesta(resultadoId, preguntaId, opcionId, token) {
  const res = await fetch(`${API_TEST}/api/resultados/${resultadoId}/responder/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ pregunta_id: preguntaId, opcion_id: opcionId }),
  });
  if (!res.ok) throw new Error("Error al guardar respuesta");
  return res.json();
}

export async function finalizarTest(resultadoId, token) {
  const res = await fetch(`${API_TEST}/api/resultados/${resultadoId}/finalizar/`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al finalizar test");
  return res.json();
}
