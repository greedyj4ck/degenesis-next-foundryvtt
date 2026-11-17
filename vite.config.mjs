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
    sourcemap: true, // important for debugging
    minify: false,
    lib: {
      entry: path.resolve(__dirname, "src/system.mjs"),
      formats: ["es"],
      fileName: "degenesis-bundle",
    },
    rollupOptions: {
      output: {
        entryFileNames: "degenesis.mjs",
        assetFileNames: (assetInfo) => {
          const names = assetInfo.names || [];
          const isCss = names.some((n) => n.endsWith(".css"));

          if (isCss) {
            return "styles/degenesis.css";
          }

          return "assets/[name].[ext]";
        },
      },
    },
  },
  server: {
    watch: {
      usePolling: false, // optional, helps with FS watching issues
    },
  },
  esbuild: {
    sourcemap: true, // for esbuild transforms
  },
});
