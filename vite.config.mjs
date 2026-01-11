import { defineConfig } from "vite";

import path from "path";

export default defineConfig({
  publicDir: false,
  root: "./",
  base: "/systems/degenesisnext/",

  build: {
    outDir: "./",
    emptyOutDir: false,
    copyPublicDir: false,
    cssCodeSplit: false,
    minify: false,
    lib: {
      entry: path.resolve(__dirname, "src/degenesis.mjs"),
      formats: ["es"],
      fileName: "degenesis-bundle",
    },
    rollupOptions: {
      output: {
        entryFileNames: "[name].mjs",
        assetFileNames: (assetInfo) => {
          // Vite domyślnie nazywa plik stylu "style.css" w trybie lib
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "styles/degenesis.css";
          }
          return "assets/[name].[ext]";
        },
      },
    },
  },
});
