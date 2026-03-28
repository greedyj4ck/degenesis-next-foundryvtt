import { Qualities } from "../../logic/quality.mjs";

const { api, sheets } = foundry.applications;

const { TextEditor } = foundry.applications.ux;
const { FilePicker } = foundry.applications.apps;

import ItemSheetMixin from "./mixins/item.sheet.mixin.mjs";

export default class DegenesisWeaponSheet extends ItemSheetMixin(
  sheets.ItemSheetV2,
) {
  static DEFAULT_OPTIONS = {
    actions: {
      manageQuality: this.#onManageQuality,
    },
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
      template: "systems/degenesisnext/templates/shared/sheet/title.bar.hbs", // without input field
    },
    itemHeader: {
      template: "systems/degenesisnext/templates/shared/item/header.hbs",
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
    details: {
      template: "systems/degenesisnext/templates/item/weapon/details.hbs",
      scrollable: [""],
    },
    qualities: {
      template: "systems/degenesisnext/templates/item/weapon/qualities.hbs",
      scrollable: [""],
    },
    modifications: {
      template: "systems/degenesisnext/templates/item/weapon/modifications.hbs",
      scrollable: [""],
    },
    effects: {
      template: "systems/degenesisnext/templates/shared/item/tab.effects.hbs",
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
        { id: "details", label: "DGNS.Details" },
        { id: "effects", label: "DGNS.Effects" },
        { id: "qualities", label: "DGNS.Qualities" },
        { id: "modifications", label: "DGNS.Mods" },
      ],
    },
  };

  /* -------------------------------------------------------------------------- */
  /*                                   Context                                  */
  /* -------------------------------------------------------------------------- */

  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const availableQualities = Qualities.weapon;

    //todo: move standard stuff to mixin
    Object.assign(context, {
      mode: this._mode,
      document: this.document,
      system: this.document.system,
      fields: this.document.schema.fields,
      systemFields: this.document.system.schema.fields,
      isEditable: this.isEditable,

      // System data
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
      modifications: this.document.system.modifications,

      // Tabs
      tabGroups: this.tabGroups,
      mainTabs: this._prepareTabs("main"), // main navigation groups

      enriched: {
        description: await TextEditor.enrichHTML(
          this.document.system.description,
        ),
      },
    });

    console.log(`WeaponSheet | Context`);
    console.log(context);

    console.log(`WeaponSheet | Qualities`);
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

  activateListeners(html) {
    super.activateListeners(this.element);
    //manual binding for change event for inputs
    html.querySelectorAll(".quality-input").forEach((input) => {
      input.addEventListener("change", (event) => {
        this._onManageQuality(event, event.currentTarget);
      });
    });
  }

  /* ---------------------------------- */
  /*              Qualities             */
  /* ---------------------------------- */

  /** Static wrapper for logic. */
  static async #onManageQuality(event, target) {
    await this._onManageQuality(event, target);
  }

  async _onManageQuality(event, target) {
    if (event) event.preventDefault();
    let { field = null, value = null } = {};

    const action = target.dataset.type;
    const qualityKey = target.closest(".quality")?.dataset.qualityKey;

    if (action === "update") {
      field = target.dataset.field;
      value = target.value;
    }

    return await this.document._manageQualities(
      action,
      qualityKey,
      field,
      value,
    );
  }
}
