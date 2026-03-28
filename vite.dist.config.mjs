import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  publicDir: false,
  root: "./",
  base: "./", // 👈 ważne dla dystrybucji

  build: {
    outDir: "dist",
    emptyOutDir: true,
    copyPublicDir: false,
    cssCodeSplit: false,
    minify: false,

    lib: {
      entry: path.resolve(__dirname, "src/degenesis.mjs"),
      formats: ["es"],
      fileName: () => "scripts/degenesis-bundle",
    },

    rollupOptions: {
      output: {
        entryFileNames: "[name].mjs",
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
});
