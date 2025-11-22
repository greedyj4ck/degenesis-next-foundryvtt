/**
 * Extend the basic ActorSheet class to suppose system-specific logic and functionality.
 * @abstract
 */
const { api, sheets } = foundry.applications;

import ActorSheetMixin from "./actor.sheet.mixin.mjs";

export default class DegenesisCharacterSheet extends ActorSheetMixin(
  sheets.ActorSheetV2
) {
  static DEFAULT_OPTIONS = {
    actions: {
      rollAction: this.#rollAction,
      removeCult: this._onRemoveCult,
    },

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
    classes: ["dgns-character"],
  };

  static PARTS = {
    sheetHeader: {
      template: "systems/degenesisnext/templates/partials/sheet.title.hbs",
    },
    actorHeader: {
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
    },
  };

  static TABS = [];

  /** Preparing sheet context */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    const cultItem = this.actor.items.find((i) => i.type === "cult"); // find cult item

    context.cult = cultItem
      ? {
          id: cultItem.id,
          name: cultItem.name,
          img: cultItem.img,
          description: cultItem.system.description || "",
          data: cultItem.system,
        }
      : null;

    context.document = this.document;
    context.system = this.document.system;
    context.fields = this.document.schema.fields;
    context.systemFields = this.document.system.schema.fields;
    context.isEditable = this.isEditable;
    context.tabGroups = this.tabGroups;
    context.tabs = this.getTabs();
    context.mode = this._mode;

    context.enriched = {
      biography: await TextEditor.enrichHTML(this.document.system.biography, {
        secrets: this.document.isOwner,
      }),
      ownerNotes: await TextEditor.enrichHTML(this.document.system.ownerNotes, {
        secrets: this.document.isOwner,
      }),
      gmNotes: await TextEditor.enrichHTML(this.document.system.gmNotes, {
        secrets: this.document.isOwner,
      }),
    };

    console.log(`Sheet context:`);
    console.log(context);

    return context;
  }

  async #close(options) {
    console.log(`Closing options`);
    console.log(options);
  }

  async _preparePartContext(partId, context) {
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
  }

  getTabs() {
    let tabGroup = "primary";

    if (!this.tabGroups[tabGroup]) this.tabGroups[tabGroup] = "general";
    let tabs = {
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
      },
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
        {
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
        },
      ];
    }

    // appv2 helper function
    this._createContextMenu(
      _actionRollContextOptions,
      `[data-action=rollAction]`,
      {
        hookName: "getActionRollContextOptions",
        fixed: true,
        parentClassHooks: false,
      }
    );
  }

  /** @inheritdoc */
  async _onFirstRender(context, options) {
    await super._onFirstRender(context, options);
    this.createContextMenus();
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

  async _renderFrame(options) {
    const html = await super._renderFrame(options);

    console.log(`renderFrame on character sheet`, html);

    let resizeHandle = html.lastChild;
    resizeHandle.innerHTML = `<svg><path d="M0,11L11,0L11,11L0,11Z"/></svg>`;

    return html;
  }

  _onResize(event) {
    super._onResize(event);
  }

  // character actions

  static async #rollAction(event, target) {
    event.preventDefault();

    const skill = target.dataset.skill;
    console.log(`Action roll for ${skill}`);

    await this.actor.actionRoll(skill);

    //  await this.actor.rollAbilityCheck(ability); actor logic
  }

  async _onDrop(event) {
    event.preventDefault();

    // Get the dropped data
    const data = TextEditor.getDragEventData(event);

    if (data.type !== "Item") return;

    // Get the item being dropped
    const item = await Item.implementation.fromDropData(data);

    // Check if it's a cult type item
    if (item.type === "cult") {
      // Check if actor already has a cult item
      const existingCult = this.actor.items.find((i) => i.type === "cult");

      if (existingCult) {
        ui.notifications.warn(
          "This character already belongs to a cult. Remove the existing cult first."
        );
        return false;
      }
    }

    // Allow the default drop behavior for non-cult items or if no cult exists
    return super._onDrop(event);
  }

  static async _onRemoveCult(event, target) {
    const cultId = target.dataset.itemId;

    const confirm = await Dialog.confirm({
      title: "Remove Cult",
      content: "<p>Are you sure you want to remove this cult affiliation?</p>",
      yes: () => true,
      no: () => false,
    });

    if (confirm) {
      await this.actor.deleteEmbeddedDocuments("Item", [cultId]);
      ui.notifications.info("Cult affiliation removed.");
    }
  }
}
