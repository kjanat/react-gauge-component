import { defineConfig, UserConfig } from "vite";

// Shared configuration for all Vite builds
export const sharedConfig: UserConfig = {
  build: {
    sourcemap: true,
    rollupOptions: {
      external: ['**/*.test.*', '**/*.spec.*']
    }
  }
};

// Base defineConfig that other configs can extend
export default defineConfig(sharedConfig);