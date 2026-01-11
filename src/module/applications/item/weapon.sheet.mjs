import { Qualities } from "../../logic/quality.mjs";

const { api, sheets } = foundry.applications;

const { TextEditor } = foundry.applications.ux;
const { FilePicker } = foundry.applications.apps;

import ItemSheetMixin from "./mixins/item.sheet.mixin.mjs";

export default class DegenesisWeaponSheet extends ItemSheetMixin(
  sheets.ItemSheetV2
) {
  static DEFAULT_OPTIONS = {
    actions: {},
    form: {
      submitOnChange: true,
    },
    window: {
      controls: [],
      resizable: true,
      frame: true,
    },
    position: {
      width: 600,
      height: 600,
    },
    classes: ["dgns-weapon", "dgns-item", "sheet-customizable"],
  };

  static PARTS = {
    sheetTitle: {
      template: "systems/degenesisnext/templates/partials/sheet.title.bar.hbs", // without input field
    },
    itemHeader: {
      template: "systems/degenesisnext/templates/partials/item.header.hbs",
    },
    tabs: {
      template: "systems/degenesisnext/templates/partials/item.tabs.hbs",
      scrollable: [""],
    },
    description: {
      template:
        "systems/degenesisnext/templates/partials/item.tab.description.hbs",
      scrollable: [""],
    },
    details: {
      template:
        "systems/degenesisnext/templates/items/weapon.sheet/ws.details.hbs",
      scrollable: [""],
    },
    qualities: {
      template:
        "systems/degenesisnext/templates/items/weapon.sheet/ws.qualities.hbs",
      scrollable: [""],
    },

    sheetFooter: {
      template: "systems/degenesisnext/templates/partials/sheet.footer.hbs",
    },
  };

  static TABS = {
    main: {
      initial: "description", // Set the initial tab
      tabs: [
        { id: "description", label: "DGNS.Description" },
        { id: "details", label: "DGNS.Details" },
        { id: "qualities", label: "DGNS.Qualities" },
        { id: "effects", label: "DGNS.Effects" },
      ],
    },
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Context                                  */
  /* -------------------------------------------------------------------------- */

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    //todo: move standard stuff to mixin
    Object.assign(context, {
      mode: this._mode,
      document: this.document,
      system: this.document.system,
      fields: this.document.schema.fields,
      systemFields: this.document.system.schema.fields,
      isEditable: this.isEditable,

      // System data
      qualities: Qualities.weapon,
      qualities2: Qualities.agent,

      // Tabs
      tabGroups: this.tabGroups,
      mainTabs: this._prepareTabs("main"), // main navigation groups

      enriched: {
        description: await TextEditor.enrichHTML(
          this.document.system.description
        ),
      },
    });

    console.log(`WeaponSheet | Context`);
    console.log(context);
    return context;
  }

  async _preparePartContext(partId, context, options) {
    //context = await super._preparePartContext(partId, context, options);
    // now that i am thinking, if i need it anyway

    if (context.mainTabs?.[partId]) {
      context.tab = context.mainTabs[partId];
    }

    return context;
  }

  /**
   * Format window title.
   */
  get title() {
    return `${this.document.name}`;
  }
}
