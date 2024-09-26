/** Function that preload necessary templates */

export async function preloadHandlebarsTemplates() {
  const partials = [
    // Shared partials
    "system/degenesis/templates/partials/sheet-header.hbs",

    // Actor Sheet Partials

    // Item Sheet Partials
  ];

  const paths = {};
  for (const path of partials) {
    paths[path.replace(".hbs", ".html")] = path;
    paths[`degenesis.${path.split("/").pop().replace(".hbs", "")}`] = path;
  }

  return loadTemplates(paths);
}
