export default function () {
  Hooks.on("renderMainMenu", async (app, html) => {
    console.log(`Hooks.js renderMainMenu`, { app, html });

    html.classList.remove("themed", "theme-dark", "theme-light");
  });
}
