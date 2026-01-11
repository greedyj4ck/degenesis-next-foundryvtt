import { defineConfig } from "vite";

import path from "path";

export default defineConfig({
  publicDir: "public",
  root: "src",
  base: "/systems/degenesisnext/",

  build: {
    outDir: "./",
    emptyOutDir: false,
    minify: false,
    lib: {
      entry: path.resolve(__dirname, "src/degenesis.mjs"),
      formats: ["es"],
      fileName: "degenesis",
    },
    rollupOptions: {
      output: {
        // To sprawi, że plik będzie nazywał się dokładnie degenesis.mjs
        entryFileNames: "[name].mjs",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "styles/degenesis.css";
          return "assets/[name].[ext]";
        },
      },
    },
  },
});
