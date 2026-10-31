import dotenv from "dotenv";

dotenv.config();

interface Environment {
  MONGO_URI: string;
  JWT_SECRET: string;
  GEMINI_API_KEY?: string;
}

export const env: Environment = {
  MONGO_URI: process.env.MONGO_URI || "",
  JWT_SECRET: process.env.JWT_SECRET || "",
  GEMINI_API_KEY: process.env.GEMINI_API_KEY,
};

// Helper: prefer a user-provided key, otherwise return the server env key (may be undefined)
export function getGeminiApiKey(userKey?: string): string | undefined {
  if (userKey && typeof userKey === "string" && userKey.trim() !== "") {
    return userKey.trim();
  }
  return env.GEMINI_API_KEY;
}

// Helper: like getGeminiApiKey but throws an Error if no key is available.
// Use this in request handlers before calling Gemini so you fail fast and return a 4xx to client.
export function requireGeminiApiKey(userKey?: string): string {
  const key = getGeminiApiKey(userKey);
  if (!key) {
    throw new Error(
      "Gemini API key required. Provide one in the request (e.g. body.apiKey or header 'x-api-key') or set GEMINI_API_KEY on the server."
    );
  }
  return key;
}
