/**
 * Extend the basic ActorSheet class to suppose system-specific logic and functionality.
 * @abstract
 */
const { api, sheets } = foundry.applications;
import ActorSheetMixin from "./actor-sheet-mixin.mjs";

export default class DegenesisCharacterSheet extends ActorSheetMixin(
  sheets.ActorSheetV2
) {
  static PARTS = {
    form: {
      template: "systems/degenesis/templates/actors/character-sheet.hbs",
    },
  };

  _onRender(context, options) {
    // You may want to add other special handling here
    // Foundry comes with a large number of utility classes, e.g. SearchFilter
    // That you may want to implement yourself.
    console.log(this);
  }
}
