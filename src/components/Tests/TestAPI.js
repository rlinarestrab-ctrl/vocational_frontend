const API_TEST = import.meta.env.VITE_TEST_API;

export async function fetchTests(token) {
  const res = await fetch(`${API_TEST}/api/tests/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al cargar los tests");
  return res.json();
}

export async function fetchTestDetail(testId, token) {
  const res = await fetch(`${API_TEST}/api/tests/${testId}/`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Error al obtener detalles del test");
  return res.json();
}

export async function enviarRespuestas(token, payload) {
  const res = await fetch(`${API_TEST}/api/resultados/evaluar/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error("Error al evaluar el test");
  return res.json();
}
