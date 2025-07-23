import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  root: "./examples",
  base: "./",
  build: {
    outDir: "../dist-examples",
    rollupOptions: {
      external: ['**/*.test.*', '**/*.spec.*']
    }
  },
});
