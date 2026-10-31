import dotenv from "dotenv";
import React, { useState } from "react";

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

interface CreateContentProps {
  open: boolean;
  onClose: () => void;
}

export function CreateContent({ open, onClose }: CreateContentProps) {
  const [userApiKey, setUserApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [responseText, setResponseText] = useState<string | null>(null);

  if (!open) return null;

  async function sendTestPrompt() {
    setLoading(true);
    setResponseText(null);
    try {
      // lightweight call to backend helper endpoint
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // forward user key per-request; backend will prefer it
          "x-api-key": userApiKey,
        },
        body: JSON.stringify({ prompt: "Say hello in one sentence." }),
      });
      const data = await res.json();
      if (!res.ok) {
        setResponseText(data?.error || "Request failed");
      } else {
        // show result (the backend returns Gemini response in data.data)
        setResponseText(JSON.stringify(data?.data || data, null, 2));
      }
    } catch (err: any) {
      setResponseText(err?.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 flex justify-center items-center z-40"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-slate-500 bg-opacity-60" />
      <div
        className="relative bg-white p-4 rounded-2xl shadow-2xl z-50 max-w-lg w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-2">
          <label className="block text-xs text-slate-600 mb-1">
            Your Gemini API Key (optional)
          </label>
          <input
            type="password"
            value={userApiKey}
            onChange={(e) => setUserApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full border rounded px-2 py-1"
          />
          <p className="text-xs text-slate-400 mt-1">
            This key is sent only in the request to the backend and not stored.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={sendTestPrompt}
            disabled={loading}
            className="bg-blue-600 text-white px-3 py-1 rounded"
          >
            {loading ? "Sending..." : "Send test"}
          </button>
          <button onClick={onClose} className="bg-gray-200 px-3 py-1 rounded">
            Close
          </button>
        </div>

        {responseText && (
          <pre className="mt-3 p-2 bg-slate-50 border rounded text-xs overflow-auto">
            {responseText}
          </pre>
        )}
      </div>
    </div>
  );
}
