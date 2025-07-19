export default function () {
  Hooks.on("renderGamePause", async (app, html, settings) => {
    console.log(app);
    settings.icon = "systems/degenesisnext/ui/marauders.svg";
  });
}
