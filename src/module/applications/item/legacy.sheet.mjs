import ItemSheetMixin from "./mixins/item.sheet.mixin.mjs";

const { api, sheets } = foundry.applications;
const { TextEditor } = foundry.applications.ux;

export default class DegenesisLegacySheet extends ItemSheetMixin(
  sheets.ItemSheetV2,
) {
  static DEFAULT_OPTIONS = {
    actions: {},
    form: { submitOnChange: true },
    window: { controls: [], resizable: true, frame: true },
    position: { width: 600, height: 600 },
    classes: ["dgns-legacy", "dgns-item"],
  };

  static PARTS = {
    sheetTitle: {
      template: "systems/degenesisnext/templates/shared/sheet/title.hbs",
    },
    sheetFooter: {
      template: "systems/degenesisnext/templates/shared/sheet/footer.hbs",
    },
  };

  static TABS = {
    main: {
      initial: "description", // Set the initial tab
      tabs: [
        { id: "description", label: "DGNS.Description" },
        // { id: "details", label: "DGNS.Details" },
        { id: "effects", label: "DGNS.Effects" },
        { id: "qualities", label: "DGNS.Qualities" },
      ],
    },
  };

  /* ---------------------------------- */
  /*               Context              */
  /* ---------------------------------- */

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    Object.assign(context, {
      mode: this._mode,
      document: this.document,
      system: this.document.system,
      fields: this.document.schema.fields,
      systemFields: this.document.system.schema.fields,
      isEditable: this.isEditable,

      // System data
      // * idea: make qualities avaiable based on modification basic type (melee, armor etc)

      effects: await this.item._prepareEffects(),

      // Tabs
      tabGroups: this.tabGroups,
      mainTabs: this._prepareTabs("main"), // main navigation groups

      enriched: {
        description: await TextEditor.enrichHTML(
          this.document.system.description,
        ),
      },
    });

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
    const itemType = game.i18n.localize(this.document.type);
    return `${itemType}: ${this.document.name}`;
  }
  /* ---------------------------------- */
  /*              Listeners             */
  /* ---------------------------------- */
}
