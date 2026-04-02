// deprecated: do not use
// remnant of old version - delete with next release

export default function RegisterHandlebars() {
  Hooks.on("init", () => {
    Handlebars.registerHelper("eq", (a, b) => a == b);
  });
}
