/** Function that preload necessary templates */

export async function preloadHandlebarsTemplates() {
  const partials = [
    // Shared partials
    "systems/degenesisnext/templates/partials/group.header.hbs",
  ];

  const paths = {};
  for (const path of partials) {
    paths[`dgns.${path.split("/").pop().replace(".hbs", "")}`] = path;
  }

  return await foundry.applications.handlebars.loadTemplates(paths);
}
