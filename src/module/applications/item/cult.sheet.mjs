const { api, sheets } = foundry.applications;

const { TextEditor } = foundry.applications.ux;
const { FilePicker } = foundry.applications.apps;

import ItemSheetMixin from "./mixins/item.sheet.mixin.mjs";
import BackgroundSheetMixin from "./mixins/background.sheet.mixin.mjs";

export default class DegenesisCultSheet extends BackgroundSheetMixin(
  ItemSheetMixin(sheets.ItemSheetV2)
) {
  static DEFAULT_OPTIONS = {
    actions: {},
    form: {
      submitOnChange: true,
    },
    window: {
      resizable: true,
      frame: true,
    },
    position: {
      width: 700,
      height: 800,
    },
    classes: ["dgns-cult", "sheet-customizable"],
  };

  static PARTS = {
    sheetHeader: {
      template: "systems/degenesisnext/templates/partials/sheet.title.hbs",
    },
    conceptHeader: {
      template: "systems/degenesisnext/templates/items/cult.sheet/header.hbs",
    },

    conceptData: {
      template: "systems/degenesisnext/templates/items/cult.sheet/data.hbs",
    },
    conceptLore: {
      template: "systems/degenesisnext/templates/items/cult.sheet/lore.hbs",
    },
  };

  static TABS = [];

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.document = this.document;
    context.system = this.document.system;
    context.fields = this.document.schema.fields;
    context.systemFields = this.document.system.schema.fields;
    context.isEditable = this.isEditable;
    context.mode = this._mode;

    context.enriched = {
      description: await TextEditor.enrichHTML(
        this.document.system.description
      ),
    };

    console.log(`CultSheet | Context`);
    console.log(context);
    return context;
  }

  // Data Actions

  /**
   * Add new Common Cult to system.commonCults array
   */
  /*   static async #addCommonCult(event, target) {
    const cults = this.document.system.commonCults;
    cults.push("");
    await this.document.update({ "system.commonCults": cults });
  } */

  /**
   * Remove Common Cult from system.commonCults array
   * @param {*} event
   * @param {*} target
   */
  /*  static async #removeCommonCult(event, target) {
    const cults = this.document.system.commonCults;
    const index = target.dataset.index;
    cults.splice(index, 1);
    await this.document.update({ "system.commonCults": cults });
  } */
}
