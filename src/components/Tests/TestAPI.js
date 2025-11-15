const API_TEST = import.meta.env.VITE_TEST_API;

if (!API_TEST) {
  console.error(
    "❌ VITE_TEST_API no está definido. Configura esta variable de entorno en Vite/Vercel."
  );
}

export async function fetchTests(token) {
  const base = (API_TEST || "").replace(/\/+$/, ""); // limpia / al final por si acaso
  const url = `${base}/api/tests/`;
  console.log("➡️ fetchTests URL:", url);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (!res.ok) {
    console.error("❌ Error al cargar los tests:", res.status, res.statusText);
    console.error("Respuesta:", text.slice(0, 300));
    throw new Error("Error al cargar los tests");
  }

  if (!contentType.includes("application/json")) {
    console.error("❌ La API de tests NO devolvió JSON.");
    console.error("content-type:", contentType);
    console.error("Respuesta:", text.slice(0, 300));
    throw new Error("La API de tests no devolvió JSON");
  }

  return JSON.parse(text);
}

export async function fetchTestDetail(testId, token) {
  const base = (API_TEST || "").replace(/\/+$/, "");
  const url = `${base}/api/tests/${testId}/`;
  console.log("➡️ fetchTestDetail URL:", url);

  const res = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  });

  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (!res.ok) throw new Error("Error al obtener detalles del test");
  if (!contentType.includes("application/json")) {
    console.error("❌ Detalle test no devolvió JSON:", text.slice(0, 300));
    throw new Error("La API de detalles del test no devolvió JSON");
  }

  return JSON.parse(text);
}

export async function enviarRespuestas(token, payload) {
  const base = (API_TEST || "").replace(/\/+$/, "");
  const url = `${base}/api/resultados/evaluar/`;
  console.log("➡️ enviarRespuestas URL:", url);

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const contentType = res.headers.get("content-type") || "";
  const text = await res.text();

  if (!res.ok) {
    console.error("❌ Error al evaluar el test:", res.status, res.statusText);
    console.error("Respuesta:", text.slice(0, 300));
    throw new Error("Error al evaluar el test");
  }

  if (!contentType.includes("application/json")) {
    console.error(
      "❌ La API de evaluación de test no devolvió JSON:",
      text.slice(0, 300)
    );
    throw new Error("La API de evaluación no devolvió JSON");
  }

  return JSON.parse(text);
}
