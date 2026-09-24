import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  build: {
    target: "es2020",
    minify: true,
    sourcemap: false,
    lib: {
      entry: path.resolve(__dirname, "src/amina-s-card.ts"),
      formats: ["es"],
      fileName: () => "amina-s-card.js"
    },
    outDir: "dist",
    emptyOutDir: true
  }
});