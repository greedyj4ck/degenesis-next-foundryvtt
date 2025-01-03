/** Function that preload necessary templates */

export async function preloadHandlebarsTemplates() {
  const partials = [
    // Shared partials
    "systems/degenesisnext/templates/partials/sheet-header.hbs",

    // Actor Sheet Partials

    // Item Sheet Partials
  ];

  const paths = {};
  for (const path of partials) {
    paths[`degenesis.${path.split("/").pop().replace(".hbs", "")}`] = path;
  }

  console.log(`Registering following partial templates:`);
  console.log(paths);

  return loadTemplates(paths);
}
