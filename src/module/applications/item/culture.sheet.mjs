/**
 * Extend the basic ItemSheet class to suppose system-specific logic and functionality.
 * @abstract
 */
const { api, sheets } = foundry.applications;

const { TextEditor } = foundry.applications.ux;
const { FilePicker } = foundry.applications.apps;

import ItemSheetMixin from "./mixins/item.sheet.mixin.mjs";
import BackgroundSheetMixin from "./mixins/background.sheet.mixin.mjs";

export default class DegenesisCultureSheet extends BackgroundSheetMixin(
  ItemSheetMixin(sheets.ItemSheetV2),
) {
  static DEFAULT_OPTIONS = {
    actions: {
      addCommonCult: this.#addCommonCult,
      removeCommonCult: this.#removeCommonCult,
    },

    form: {
      submitOnChange: true,
    },
    window: {
      controls: [
        {
          action: "changeSheetBackground",
          icon: "fa-solid fa-user-circle",
          label: "SHEET.ChangeBackground",
          ownership: "OWNER",
        },
      ],
      resizable: true,
      frame: true,
    },
    position: {
      width: 700,
      height: 800,
    },
    classes: ["dgns-culture", "sheet-customizable"],
  };

  static PARTS = {
    sheetHeader: {
      template: "systems/degenesisnext/templates/shared/sheet/title.hbs",
    },

    cultureHeader: {
      template: "systems/degenesisnext/templates/item/culture/header.hbs",
    },

    cultureData: {
      template: "systems/degenesisnext/templates/item/culture/data.hbs",
    },

    cultureLore: {
      template: "systems/degenesisnext/templates/item/culture/lore.hbs",
    },

    /* actorHeader: {
      template:
        "systems/degenesisnext/templates/actors/character.sheet/cs.header.hbs",
    },
    tabs: {
      template:
        "systems/degenesisnext/templates/actors/character.sheet/cs.tabs.hbs",
      scrollable: [""],
    },
    general: {
      template:
        "systems/degenesisnext/templates/actors/character.sheet/cs.general.hbs",
      scrollable: [""],
    },
    stats: {
      template:
        "systems/degenesisnext/templates/actors/character.sheet/cs.stats.hbs",
      scrollable: [""],
    },
    effects: {
      template:
        "systems/degenesisnext/templates/actors/character.sheet/cs.effects.hbs",
      scrollable: [""],
    },
    combat: {
      template:
        "systems/degenesisnext/templates/actors/character.sheet/cs.combat.hbs",
      scrollable: [""],
    },

    inventory: {
      template:
        "systems/degenesisnext/templates/actors/character.sheet/cs.inventory.hbs",
      scrollable: [""],
    },
    history: {
      template:
        "systems/degenesisnext/templates/actors/character.sheet/cs.history.hbs",
      scrollable: [".container-scrollable"],
    },

    sheetFooter: {
      template: "systems/degenesisnext/templates/partials/sheet.footer.hbs",
    }, */
  };

  static TABS = [];

  /** Preparing sheet context */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    // move to ItemSheetMixin ?

    context.document = this.document;
    context.system = this.document.system;
    context.fields = this.document.schema.fields;
    context.systemFields = this.document.system.schema.fields;
    context.isEditable = this.isEditable;
    context.tabGroups = this.tabGroups;
    context.tabs = this.getTabs();
    context.mode = this._mode;

    context.enriched = {
      description: await TextEditor.enrichHTML(
        this.document.system.description,
      ),

      /*  biography: await TextEditor.enrichHTML(this.document.system.biography, {
        secrets: this.document.isOwner,
      }),
      ownerNotes: await TextEditor.enrichHTML(this.document.system.ownerNotes, {
        secrets: this.document.isOwner,
      }),
      gmNotes: await TextEditor.enrichHTML(this.document.system.gmNotes, {
        secrets: this.document.isOwner,
      }), */
    };

    console.log(`Sheet context:`);
    console.log(context);

    return context;
  }

  async _preparePartContext(partId, context) {
    /*  switch (partId) {
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
    } */
    return context;
  }

  getTabs() {
    let tabGroup = "primary";

    if (!this.tabGroups[tabGroup]) this.tabGroups[tabGroup] = "general";
    let tabs = {
      /*
      general: {
        id: "general",
        label: "archetype",
        group: tabGroup,
        cssClass: this.tabGroups.primary === this.id ? "active" : "",
      },
      stats: {
        id: "stats",
        label: "statistics",
        group: tabGroup,
        cssClass: this.tabGroups.primary === this.id ? "active" : "",
      },
      effects: {
        id: "effects",
        label: "effects",
        group: tabGroup,
        cssClass: this.tabGroups.primary === this.id ? "active" : "",
      },
      combat: {
        id: "combat",
        label: "combat",
        group: tabGroup,
        cssClass: this.tabGroups.primary === this.id ? "active" : "",
      },
      inventory: {
        id: "inventory",
        label: "inventory",
        group: tabGroup,
        cssClass: this.tabGroups.primary === this.id ? "active" : "",
      },
      history: {
        id: "history",
        label: "history",
        group: tabGroup,
        cssClass: this.tabGroups.primary === this.id ? "active" : "",
      },*/
    };
    for (let tab in tabs) {
      if (this.tabGroups[tabGroup] === tabs[tab].id) {
        tabs[tab].cssClass = "active";
        tabs[tab].active = true;
      }
    }
    return tabs;
  }

  /**
   * Creating initial context menus for permanent objects
   */
  createContextMenus() {
    // menus needs to be defined as function
    function _actionRollContextOptions() {
      return [
        /*   {
          name: "Action roll",
          callback: (target) => {
            console.log(`Context action`);
          },
        },
        {
          name: "Combination roll",
          callback: (target) => {
            console.log(this);
          },
        }, */
      ];
    }

    // appv2 helper function
    /*  this._createContextMenu(
      _actionRollContextOptions,
      `[data-action=rollAction]`,
      {
        hookName: "getActionRollContextOptions",
        fixed: true,
        parentClassHooks: false,
      }
    ); */
  }

  /** @inheritdoc */
  async _onFirstRender(context, options) {
    await super._onFirstRender(context, options);
    // this.createContextMenus();
  }

  /** @inheritdoc */
  _onRender(context, options) {
    // You may want to add other special handling here
    // Foundry comes with a large number of utility classes, e.g. SearchFilter
    // That you may want to implement yourself.
    // console.log(this);

    super._onRender(context, options);
  }

  activateListeners(html) {
    super.activateListeners(html);
  }

  _onResize(event) {
    super._onResize(event);
  }

  // UI Actions

  static async #changeSheetBackground() {
    await super.changeSheetBackground();
  }

  /*   static async #changeSheetBackground() {
    const filePicker = new FilePicker({
      type: "image",
      wildcard: true,
      callback: async (path) => {
        if (path) {
          try {
            await this.document.update({
              ["system.backgroundImage"]: path,
            });
            ui.notifications.info(
              `Updated ${this.document.name} backgroundImage to: ${path}`
            );
          } catch (error) {
            console.error("Error updating document:", error);
            ui.notifications.error("Failed to update document");
          }
        } else {
          console.log("No path received in callback");
        }
      },
    });

    await filePicker.browse();
  } */

  // Data Actions

  /**
   * Add new Common Cult to system.commonCults array
   */
  static async #addCommonCult(event, target) {
    const cults = this.document.system.commonCults;
    cults.push("");
    await this.document.update({ "system.commonCults": cults });
  }

  /**
   * Remove Common Cult from system.commonCults array
   * @param {*} event
   * @param {*} target
   */
  static async #removeCommonCult(event, target) {
    const cults = this.document.system.commonCults;
    const index = target.dataset.index;
    cults.splice(index, 1);
    await this.document.update({ "system.commonCults": cults });
  }
}
