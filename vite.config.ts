import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      "/cognito": {
        target: "https://livenesscheck.auth.us-east-1.amazoncognito.com",
        changeOrigin: true,
        rewrite: () => "http://localhost:5173",
      },
    },
  },
});
