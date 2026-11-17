export default function () {
  Hooks.on("renderMainMenu", async (app, html) => {
    html.classList.remove("themed", "theme-dark", "theme-light");
  });
}
