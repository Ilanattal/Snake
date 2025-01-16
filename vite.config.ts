import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/Snake/", // Nom exact de votre dépôt (sensible à la casse)
  plugins: [react()],
});