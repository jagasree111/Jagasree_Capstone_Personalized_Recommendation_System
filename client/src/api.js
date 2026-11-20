export const API_URL = (import.meta.env.VITE_API_URL || "http://localhost:5000").replace(/\/$/, "");

export async function fetchWithBackendError(url, options) {
  try {
    return await fetch(url, options);
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error(
      `Cannot connect to the backend at ${API_URL}. Start it with "npm --prefix server start" and try again.`,
      { cause: error }
    );
  }
}

export async function authRequest(path, body) {
  let response;

  try {
    response = await fetch(`${API_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new Error(`Cannot reach the API at ${API_URL}. Check that the backend is running.`);
  }

  let data;
  try {
    data = await response.json();
  } catch {
    throw new Error("The API returned an invalid response. Please try again later.");
  }

  if (!response.ok) {
    throw new Error(data.message || `Request failed (${response.status}). Please try again.`);
  }

  return data;
}