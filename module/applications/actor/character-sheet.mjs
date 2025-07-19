/**
 * Extend the basic ActorSheet class to suppose system-specific logic and functionality.
 * @abstract
 */
const { api, sheets } = foundry.applications;

import ActorSheetMixin from "./actor-sheet-mixin.mjs";

export default class DegenesisCharacterSheet extends ActorSheetMixin(
  sheets.ActorSheetV2
) {
  static DEFAULT_OPTIONS = {
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
}
