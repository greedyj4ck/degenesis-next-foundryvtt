export async function registerHandlebarsHelpers() {
  Handlebars.registerHelper("sheetEditMode", function (mode) {
    return mode === 2 ? true : false;
  });

  Handlebars.registerHelper("isGM", function (options) {
    return game.user.isGM;
  });

  /**
   * Checking if skill should be disabled based on primal / focus and
   * fait / willpower choices.
   */
  Handlebars.registerHelper("isSkillDisabled", function (skill, modes) {
    if (skill === "primal" && modes.primalFocus === "focus") {
      return true;
    }
    if (skill === "focus" && modes.primalFocus === "primal") {
      return true;
    }
    if (skill === "faith" && modes.faithWillpower === "willpower") {
      return true;
    }
    if (skill === "willpower" && modes.faithWillpower === "faith") {
      return true;
    }
    return false;
  });

  Handlebars.registerHelper("json", function (context) {
    return JSON.stringify(context);
  });

  Handlebars.registerHelper("prettyJson", function (context) {
    return JSON.stringify(context, null, 2);
  });
}
