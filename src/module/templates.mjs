/** Function that preload necessary templates */

export async function preloadHandlebarsTemplates() {
  const partials = [
    // Shared partials
    "systems/degenesisnext/templates/shared/group/header.hbs",
    "systems/degenesisnext/templates/shared/item/summary.hbs",

    // Actor Partials
    // Culture, Concept, Cult / Clan
    "systems/degenesisnext/templates/shared/actor/culture.hbs",
    "systems/degenesisnext/templates/shared/actor/concept.hbs",
    "systems/degenesisnext/templates/shared/actor/cult.hbs",

    // Tables and lists
    "systems/degenesisnext/templates/shared/actor/potentials.hbs",

    // Combat specific templates
    "systems/degenesisnext/templates/shared/actor/combat/weapon.hbs",
    "systems/degenesisnext/templates/shared/actor/combat/armor.hbs",
  ];

  const paths = {};
  for (const path of partials) {
    const parts = path.split("/");
    const fileName = parts.pop().replace(".hbs", "");
    const folderName = parts.pop();
    paths[`dgns.${folderName}.${fileName}`] = path;
  }

  console.log(paths);

  return await foundry.applications.handlebars.loadTemplates(paths);
}
