/** Function that preload necessary templates */

export async function preloadHandlebarsTemplates() {
  const partials = [
    // Shared partials
    "systems/degenesisnext/templates/shared/group/header.hbs",
  ];

  const paths = {};
  for (const path of partials) {
    const parts = path.split("/");
    const fileName = parts.pop().replace(".hbs", "");
    const folderName = parts.pop();
    paths[`dgns.${folderName}.${fileName}`] = path;
  }

  return await foundry.applications.handlebars.loadTemplates(paths);
}
