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

  const branch = "alpha";
  const isAlpha = branch === "alpha";

  const sourcePath = path.resolve("system.json");
  const destPath = path.resolve("dist/system.json");

  const baseJson = JSON.parse(fs.readFileSync(sourcePath, "utf-8"));

  baseJson.manifest = isAlpha
    ? "https://raw.githubusercontent.com/USER/REPO/alpha/system.json"
    : "https://raw.githubusercontent.com/USER/REPO/main/system.json";
  baseJson.download = isAlpha
    ? "https://github.com/USER/REPO/archive/refs/heads/alpha.zip"
    : "https://github.com/USER/REPO/archive/refs/heads/main.zip";

  console.log("mkdirSync:", path.dirname(destPath));
  fs.mkdirSync(path.dirname(destPath), { recursive: true });
  fs.writeFileSync(path.join(destPath), JSON.stringify(baseJson, null, 2));

  console.log(`System.json modified for alpha testing.`);

  const src = [
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
