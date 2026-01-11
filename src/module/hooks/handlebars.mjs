export default function RegisterHandlebars() {
  Hooks.on("init", () => {
    Handlebars.registerHelper("eq", (a, b) => a == b);
  });
}
