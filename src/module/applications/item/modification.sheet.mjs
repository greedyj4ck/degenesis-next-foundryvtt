import ItemSheetMixin from "./mixins/item.sheet.mixin.mjs";
import { Qualities } from "../../logic/quality.mjs";

const { api, sheets } = foundry.applications;
const { TextEditor } = foundry.applications.ux;

export default class DegenesisModificationSheet extends ItemSheetMixin(
  sheets.ItemSheetV2,
) {
  static DEFAULT_OPTIONS = {
    actions: {},
    form: { submitOnChange: true },
    window: { controls: [], resizable: true, frame: true },
    position: { width: 600, height: 600 },
    classes: ["dgns-modification", "dgns-item"],
  };

  static PARTS = {
    sheetTitle: {
      template: "systems/degenesisnext/templates/shared/sheet/title.bar.hbs",
    },
    header: {
      template: "systems/degenesisnext/templates/item/modification/header.hbs",
    },
    tabs: {
      template: "systems/degenesisnext/templates/shared/item/tabs.hbs",
      scrollable: [""],
    },
    description: {
      template:
        "systems/degenesisnext/templates/shared/item/tab.description.hbs",
      scrollable: [""],
    },

    effects: {
      template: "systems/degenesisnext/templates/shared/item/tab.effects.hbs",
      scrollable: [""],
    },
    qualities: {
      template:
        "systems/degenesisnext/templates/item/modification/qualities.hbs",
      scrollable: [""],
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
    const availableQualities = Qualities.modification;

    Object.assign(context, {
      mode: this._mode,
      document: this.document,
      system: this.document.system,
      fields: this.document.schema.fields,
      systemFields: this.document.system.schema.fields,
      isEditable: this.isEditable,

      // System data
      // * idea: make qualities avaiable based on modification basic type (melee, armor etc)
      qualities: availableQualities.map((def) => {
        const data = this.document.system.qualities.find(
          (q) => q.key === def.key,
        );
        return {
          key: def.key,
          label: def.label,
          description: def.description,
          // Jeśli nie ma w bazie, domyślnie jest wyłączona (false)
          enabled: data ? data.enabled : false,
          // Mapujemy inputy, wstrzykując aktualne wartości z bazy lub defaulty
          inputs: (def.inputs || []).map((input) => ({
            ...input,
            value: data?.values?.[input.name] ?? input.default,
          })),
        };
      }),

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

    console.log(`Modification Sheet | Context`);
    console.log(context);

    console.log(`Modification Sheet | Qualities`);
    console.log(context.system.qualities);
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
  /* ---------------------------------- */
  /*              Listeners             */
  /* ---------------------------------- */
}
