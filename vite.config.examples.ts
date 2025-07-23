import react from "@vitejs/plugin-react";
import tailwindcss from '@tailwindcss/vite'
import { defineConfig, mergeConfig } from "vite";
import { sharedConfig } from "./vite.config";

export default defineConfig(
  mergeConfig(sharedConfig, {
    plugins: [
      react(),
      tailwindcss(),
    ],
    root: "./examples",
    base: "./",
    build: {
      outDir: "../dist-examples",
    },
  })
);