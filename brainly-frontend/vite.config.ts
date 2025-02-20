import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173, // Ensures Vite runs on port 5173
  },
  plugins: [tailwindcss(), react()],
});
