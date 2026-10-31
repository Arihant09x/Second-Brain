let cachedUserApiKey: string | null = null;

// Persist the user key for the browser session (in-memory only).
// Also send it to the backend so the server can set an HttpOnly cookie for subsequent requests.
export async function storeUserApiKey(userApiKey: string) {
  cachedUserApiKey = userApiKey?.trim() || null;
  // Send to backend to set HttpOnly cookie (backend must implement /api/set-user-key)
  await fetch("/api/set-user-key", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ apiKey: cachedUserApiKey }),
  });
}

// Clear stored key from frontend memory and ask backend to clear cookie.
export async function clearStoredUserApiKey() {
  cachedUserApiKey = null;
  await fetch("/api/clear-user-key", { method: "POST" });
}

// Call backend gemini proxy.
// Behavior:
// - If an explicit userApiKey argument is provided, it will be sent as header 'x-api-key' (and not stored).
// - If not provided but a key was stored via storeUserApiKey during this session, that cached key is sent as header.
// - Otherwise rely on backend cookie (set by /api/set-user-key) or server env key.
export async function callBackendGemini(prompt: string, userApiKey?: string) {
  const headerKey = userApiKey?.trim() || cachedUserApiKey || undefined;

  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(headerKey ? { "x-api-key": headerKey } : {}),
    },
    body: JSON.stringify({ prompt }),
    // credentials: "include" when relying on cookies — include if backend uses cookies.
    credentials: headerKey ? "omit" : "include",
  });

  const json = await res.json();
  if (!res.ok) throw new Error(json?.error || "Backend request failed");
  return json;
}
