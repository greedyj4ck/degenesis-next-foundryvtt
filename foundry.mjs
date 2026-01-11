import { readFileSync, existsSync } from "fs";
import { spawn } from "child_process";

import yaml from "js-yaml";
import path from "path";

const CONFIG_PATH = "./foundry-config.yaml";

if (!existsSync(CONFIG_PATH)) {
  console.error(`Config file not found: ${CONFIG_PATH}!`);
  process.exit(1);
}

try {
  // Reading YAML configuration.
  const fileContents = readFileSync(CONFIG_PATH, "utf8");
  const config = yaml.load(fileContents);

  // Building main.js path string.
  const mainJsPath = path.join(config.installPath, "main.js");

  console.log("Yaml configuration:-");
  console.log(`App: ${mainJsPath}`);
  console.log(`Data: ${config.dataPath}`);

  // Launching main node process
  const foundry = spawn("node", [mainJsPath, `--dataPath=${config.dataPath}`], {
    stdio: "inherit",
    shell: true,
  });
  foundry.on("error", (err) => console.error("Start error: ", err));
} catch (e) {
  console.error("YAML reading error:", e);
}
