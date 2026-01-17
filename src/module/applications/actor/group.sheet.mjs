/**
 * Extend the basic ActorSheet class to suppose system-specific logic and functionality.
 * @abstract
 */
const { api, sheets } = foundry.applications;
const { DialogV2 } = foundry.applications.api;
const { TextEditor } = foundry.applications.ux;

import ActorSheetMixin from "./actor.sheet.mixin.mjs";

export default class DGNSGroupSheet extends ActorSheetMixin(
  sheets.ActorSheetV2,
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
    classes: ["dgns-group"],
  };

  static PARTS = {
    sheetHeader: {
      template: "systems/degenesisnext/templates/shared/sheet/title.hbs",
    },
    groupHeader: {
      template: "systems/degenesisnext/templates/actor/group/header.hbs",
    },
    /*  tabs: {
      template:
        "systems/degenesisnext/templates/actors/character.sheet/cs.tabs.hbs",
      scrollable: [""],
    },
    general: {
      template:
        "systems/degenesisnext/templates/actors/character.sheet/cs.general.hbs",
      scrollable: [""],
    },
 */
    sheetFooter: {
      template: "systems/degenesisnext/templates/shared/sheet/footer.hbs",
    },
  };

  static TABS = [];

  /** Preparing sheet context */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    context.document = this.document;
    context.system = this.document.system;
    context.fields = this.document.schema.fields;
    context.systemFields = this.document.system.schema.fields;
    context.mode = this._mode;
    context.isEditable = this.isEditable;

    context.members = this.actor.system.members;

    return context;
  }

  /*  async _preparePartContext(partId, context) {
    switch (partId) {
      case "general":
        context.tab = context.tabs[partId];
      case "stats":
        context.tab = context.tabs[partId];
      case "effects":
        context.tab = context.tabs[partId];
      case "combat":
        context.tab = context.tabs[partId];
      case "inventory":
        context.tab = context.tabs[partId];
      case "history":
        context.tab = context.tabs[partId];
        break;
      default:
    }
    return context;
  } */

  getTabs() {
    let tabs = [];
    return tabs;
  }

  /** @inheritdoc */
  async _onFirstRender(context, options) {
    await super._onFirstRender(context, options);
    // this.createContextMenus();
  }

  activateListeners(html) {
    super.activateListeners(html);
  }
  /** @inheritdoc */
  _onRender(context, options) {
    // You may want to add other special handling here
    // Foundry comes with a large number of utility classes, e.g. SearchFilter
    // That you may want to implement yourself.
    console.log(this);

    super._onRender(context, options);
  }

  async _renderFrame(options) {
    const html = await super._renderFrame(options);
    return html;
  }

  _onResize(event) {
    super._onResize(event);
  }

  async _onDrop(event) {
    event.preventDefault();
    return super._onDrop(event);
  }
}
