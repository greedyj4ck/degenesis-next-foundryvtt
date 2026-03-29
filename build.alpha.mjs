import { build } from "vite";
import fs from "fs";
import path from "path";
import { cp } from "fs/promises";

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const viteConfig = {
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
};

async function runBuild() {
  console.log(`Building alpha...`);
  await build(viteConfig);
  console.log(`Build finished!`);

  console.log(`Copying files...`);

  const src = [
    { src: "system.json", dest: "dist/system.json" },
    { src: "assets", dest: "dist/assets" },
    { src: "fonts", dest: "dist/fonts" },
    { src: "packs", dest: "dist/packs" },
    { src: "lang", dest: "dist/lang" },
    { src: "templates", dest: "dist/templates" },
    { src: "ui", dest: "dist/ui" },
  ];

  for (const item of src) {
    const srcPath = path.resolve(item.src);
    const destPath = path.resolve(item.dest);

    if (!fs.existsSync(srcPath)) {
      console.warn(`⚠️  Skipping missing item: ${item.src}`);
      continue;
    }

    try {
      await cp(srcPath, destPath, { recursive: true, force: true });
      console.log(`✅ Copied ${item.src} → ${item.dest}`);
    } catch (err) {
      console.error(`❌ Error copying ${item.src}:`, err);
    }
  }
}

runBuild().catch((err) => {
  console.error("Error during building", err);
  process.exit(1);
});
