import { resolve } from "path";
import { defineConfig, mergeConfig } from "vite";
import dts from "vite-plugin-dts";
import { sharedConfig } from "./vite.config";

export default defineConfig(
  mergeConfig(sharedConfig, {
    plugins: [
      dts({
        insertTypesEntry: true,
        outDir: "dist",
        include: ["src/**/*.ts", "src/**/*.tsx"],
        exclude: [
          "examples/**/*",
          "src/**/*.test.ts",
          "src/**/*.test.tsx",
          "src/**/*.spec.ts",
          "src/**/*.spec.tsx"
        ],
      }),
    ],
    build: {
      lib: {
        entry: resolve(__dirname, "src/index.ts"),
        name: "ReactGaugeComponent",
        formats: ["es", "cjs", "umd"],
        fileName: (format) => {
          if (format === "es") return "index.esm.js";
          if (format === "cjs") return "index.js";
          return "index.umd.js";
        },
      },
      rollupOptions: {
        external: ["react", "react-dom"],
        output: {
          globals: {
            react: "React",
            "react-dom": "ReactDOM",
          },
          assetFileNames: (assetInfo) => {
            if (assetInfo.name === "style.css") return "styles.css";
            return assetInfo.name;
          },
        },
      },
      minify: true,
    },
  })
);