/**
 * Extend the basic ActorSheet class to suppose system-specific logic and functionality.
 * @abstract
 */
const { api, sheets } = foundry.applications;
const { DialogV2 } = foundry.applications.api;
const { TextEditor } = foundry.applications.ux;

import ActorSheetMixin from "./actor.sheet.mixin.mjs";

export default class DegenesisCharacterSheet extends ActorSheetMixin(
  sheets.ActorSheetV2
) {
  static DEFAULT_OPTIONS = {
    actions: {
      // data actions
      showLinkedItem: this.showLinkedItem,
      removeLinkedItem: this.removeLinkedItem,
      //
      unsetGroup: this.unsetGroup,
      // roll actions
      rollAction: this.#rollAction,
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
      templates: [
        "systems/degenesisnext/templates/actors/character.sheet/history.partials/group.hbs",
        "systems/degenesisnext/templates/actors/character.sheet/history.partials/biography.hbs",
        "systems/degenesisnext/templates/actors/character.sheet/history.partials/notes.hbs",
        "systems/degenesisnext/templates/actors/character.sheet/history.partials/gmnotes.hbs",
      ],
      scrollable: [".container-scrollable"],
    },

    sheetFooter: {
      template: "systems/degenesisnext/templates/partials/sheet.footer.hbs",
    },
  };

  /** @type {Record<string, foundry.applications.types.ApplicationTabsConfiguration>} */

  static TABS = {
    main: {
      initial: "general", // Set the initial tab
      tabs: [
        { id: "general", label: "DGNS.General" },
        { id: "stats", label: "DGNS.Stats" },
        { id: "effects", label: "DGNS.Effects" },
        { id: "combat", label: "DGNS.Combat" },
        { id: "inventory", label: "DGNS.Inventory" },
        { id: "history", label: "DGNS.History" },
      ],
      //labelPrefix: "DGNS.tab",
    },
    history: {
      initial: "group",
      tabs: [
        { id: "group", label: "DGNS.Group" },
        { id: "biography", label: "DGNS.Biography" },
        { id: "notes", label: "DGNS.Notes" },
        { id: "gmnotes", label: "DGNS.Gmnotes" },
      ],
    },
  };

  /** Preparing sheet context */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    Object.assign(context, {
      mode: this._mode,
      owner: this.document.isOwner,
      limited: this.document.limited,
      isEditable: this.isEditable,
      actor: this.actor,
      system: this.actor.system,
      flags: this.actor.flags,
      actorFields: this.actor.schema.fields,

      // Simplified Data Access
      culture: this.actor.system.culture,
      concept: this.actor.system.concept,
      cult: this.actor.system.cult,
      group: this.actor.system.group,
      // Tabs
      tabGroups: this.tabGroups,
      mainTabs: this._prepareTabs("main"),
      historyTabs: this._prepareTabs("history"),

      // Enriched fields

      enriched: {
        biography: await TextEditor.enrichHTML(this.document.system.biography, {
          secrets: this.document.isOwner,
        }),
        ownerNotes: await TextEditor.enrichHTML(
          this.document.system.ownerNotes,
          {
            secrets: this.document.isOwner,
          }
        ),
        gmNotes: await TextEditor.enrichHTML(this.document.system.gmNotes, {
          secrets: this.document.isOwner,
        }),
      },
    });

    return context;
  }

  async _preparePartContext(partId, context, options) {
    //context = await super._preparePartContext(partId, context, options);

    if (context.mainTabs?.[partId]) {
      context.tab = context.mainTabs[partId];
      if (partId === "history") {
        context.subtabs = context.historyTabs;
      }
    }

    return context;
  }

  /*   _configureRenderOptions(options) {
    super._configureRenderOptions(options);
  } */
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

  activateListeners(html) {
    super.activateListeners(html);
  }

  /** @inheritdoc */
  _onRender(context, options) {
    super._onRender(context, options);
    // You may want to add other special handling here
    // Foundry comes with a large number of utility classes, e.g. SearchFilter
    // That you may want to implement yourself.
    console.log(this);
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

    // Get the dropped data
    const data = TextEditor.getDragEventData(event);

    if (data.type === "Actor") {
      const actor = await Actor.implementation.fromDropData(data);
      if (actor.type === "group") {
        await this.actor.setGroup(actor);
      }
    }

    if (data.type === "Item") {
      // Get the item being dropped
      const item = await Item.implementation.fromDropData(data);

      // Handling Culture / Concept / Cult
      if (item.type === "culture" && !item.actor) {
        await this.actor.system.setCulture(item.id);
        return false;
      }
      if (item.type === "cult" && !item.actor) {
        await this.actor.system.setCult(item.id);
        return false;
      }
      if (item.type === "concept" && !item.actor) {
        await this.actor.system.setConcept(item.id);
        return false;
      }
    }

    // Allow the default drop behavior for non-cult items or if no cult exists
    return super._onDrop(event);
  }

  // character actions
  static async #rollAction(event, target) {
    event.preventDefault();

    const skill = target.dataset.skill;
    console.log(`Action roll for ${skill}`);

    await this.actor.actionRoll(skill);

    //  await this.actor.rollAbilityCheck(ability); actor logic
  }

  /**
   * Display linked Item, and fallback to cached one if main do not exist anymore.
   * Mainly used with Culture / Concept / Cult
   * @param {*} event
   * @param {*} target
   */

  static async showLinkedItem(event, target) {
    const itemType = target.dataset.itemType;
    const itemId = this.actor.system[itemType].id;
    const item =
      itemId === this.actor.system[`${itemType}Item`].linked.id
        ? game.items.get(itemId)
        : this.actor.items.get(itemId);
    if (item) {
      item.sheet.render(true);
    }
  }

  static async removeLinkedItem(event, target) {
    const itemType = target.dataset.itemType;
    await this.actor.system.removeLinkedItem(itemType);
  }

  static async unsetGroup() {
    await this.actor.unsetGroup();
  }

  /*  changeTab(tab, group, options) {
    super.changeTab(tab, group, options);
  } */
}
