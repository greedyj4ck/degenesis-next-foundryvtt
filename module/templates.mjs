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

  console.log(`preloading:`, paths);

  return await foundry.applications.handlebars.loadTemplates(paths);
}

export async function registerHandlebarsHelpers() {
  Handlebars.registerHelper("sheetEditMode", function (mode) {
    return mode === 2 ? true : false;
  });

  Handlebars.registerHelper("isGM", function (options) {
    return game.user.isGM;
  });
}
