export default function () {
  Hooks.on("renderGamePause", async (app, html, settings) => {
    settings.icon = "systems/degenesisnext/ui/marauders.svg";
  });
}
