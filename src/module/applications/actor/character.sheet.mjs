/** @import ActorSheetV2 from '@client/applications/sheets/actor-sheet.mjs*/

/**
 * Extend the basic ActorSheet class to suppose system-specific logic and functionality.
 * @abstract
 */
const { renderTemplate } = foundry.applications.handlebars;
const { api, sheets } = foundry.applications;
const { DialogV2 } = foundry.applications.api;
const { TextEditor } = foundry.applications.ux;

const { performIntegerSort } = foundry.utils;

import ActorSheetMixin from "./actor.sheet.mixin.mjs";

export default class DGNSCharacterSheet extends ActorSheetMixin(
  sheets.ActorSheetV2,
) {
  static DEFAULT_OPTIONS = {
    actions: {
      /** Linked items methods  */
      showLinkedItem: DGNSCharacterSheet.prototype.showLinkedItem,
      removeLinkedItem: DGNSCharacterSheet.prototype.removeLinkedItem,

      /** Inventory */
      toggleEquipped:
        DGNSCharacterSheet.prototype.toggleItemProp("system.equipped"),
      toggleDropped:
        DGNSCharacterSheet.prototype.toggleItemProp("system.dropped"),
      toggleDescription: DGNSCharacterSheet.prototype.toggleDescription,

      createItem: DGNSCharacterSheet.prototype.createItem,
      editItem: DGNSCharacterSheet.prototype.onEditItem,
      toggleSort: DGNSCharacterSheet.prototype.toggleSort,

      unsetGroup: DGNSCharacterSheet.prototype.unsetGroup,
      /** Rolls & Combat */
      rollAction: DGNSCharacterSheet.prototype.onActionRoll,
      rollCombination: DGNSCharacterSheet.prototype.onCombinationRoll,
      /** Handling Effects */
      manageEffect: DGNSCharacterSheet.prototype.onManageEffect,
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
      template: "systems/degenesisnext/templates/shared/sheet/title.hbs",
    },
    actorHeader: {
      template: "systems/degenesisnext/templates/actor/character/header.hbs",
      templates: [
        "systems/degenesisnext/templates/actor/character/details.hbs",
        "systems/degenesisnext/templates/actor/character/modes.hbs",
        "systems/degenesisnext/templates/actor/character/currency.hbs",
        "systems/degenesisnext/templates/actor/character/xp.hbs",
      ],
    },
    tabs: {
      template: "systems/degenesisnext/templates/actor/character/tabs.hbs",
      scrollable: [""],
    },
    general: {
      template: "systems/degenesisnext/templates/actor/character/general.hbs",
      scrollable: [""],
    },
    stats: {
      template: "systems/degenesisnext/templates/actor/character/stats.hbs",
      scrollable: [""],
    },
    /*  effects: {
      template: "systems/degenesisnext/templates/actor/character/effects.hbs",
      scrollable: [".container-scrollable"],
    }, */

    effects: {
      template: "systems/degenesisnext/templates/shared/general/effects.hbs",
      scrollable: [".container-scrollable"],
    },
    combat: {
      template: "systems/degenesisnext/templates/actor/character/combat.hbs",
      scrollable: [""],
    },
    inventory: {
      template: "systems/degenesisnext/templates/actor/character/inventory.hbs",
      scrollable: [""],
    },
    history: {
      template: "systems/degenesisnext/templates/actor/character/history.hbs",
      templates: [
        "systems/degenesisnext/templates/actor/character/legacies.hbs",
        "systems/degenesisnext/templates/actor/character/biography.hbs",
        "systems/degenesisnext/templates/actor/character/group.hbs",
        "systems/degenesisnext/templates/actor/character/notes.hbs",
        "systems/degenesisnext/templates/actor/character/gmnotes.hbs",
      ],
      scrollable: [".container-scrollable"],
    },

    sheetFooter: {
      template: "systems/degenesisnext/templates/shared/sheet/footer.hbs",
    },
  };

  /** @type {Record<string, foundry.applications.types.ApplicationTabsConfiguration>} */

  static TABS = {
    main: {
      initial: "general", // Set the initial tab
      tabs: [
        { id: "general", label: "UI.TABS.general" },
        { id: "stats", label: "UI.TABS.stats" },
        { id: "effects", label: "UI.TABS.effects" },
        { id: "combat", label: "UI.TABS.combat" },
        { id: "inventory", label: "UI.TABS.inventory" },
        { id: "history", label: "UI.TABS.history" },
      ],
    },
    header: {
      initial: "details",
      tabs: [
        {
          id: "details",
          label: "UI.TABS.details",
          icon: "fa-solid fa-circle-info",
        },
        { id: "modes", label: "UI.TABS.modes", icon: "fa-solid fa-brain" },
        {
          id: "currency",
          label: "UI.TABS.currency",
          icon: "fa-solid fa-coins",
        },
        { id: "xp", label: "UI.TABS.xp", icon: "fa-solid fa-timeline" },
      ],
    },
    history: {
      initial: "group",
      tabs: [
        { id: "biography", label: "UI.TABS.biography" },
        { id: "legacies", label: "UI.TABS.legacies" },
        { id: "group", label: "UI.TABS.group" },
        { id: "notes", label: "UI.TABS.notes" },
        { id: "gmnotes", label: "UI.TABS.gmnotes" },
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
      sortMode:
        this.actor.getFlag("degenesisnext", "inventorySortMode") || "manual",
      actorFields: this.actor.schema.fields,

      // Simplified Data Access
      culture: this.actor.system.culture,
      concept: this.actor.system.concept,
      cult: this.actor.system.cult,
      group: this.actor.system.group,
      potentials: this.actor._preparePotentials(),
      legacies: this.actor._prepareLegacies(),
      inventory: this.actor._prepareInventory(),
      effects: await this.actor._prepareEffects(),

      tabGroups: this.tabGroups,
      mainTabs: this._prepareTabs("main"), // main navigation groups
      headerTabs: this._prepareTabs("header"), // header display groups
      historyTabs: this._prepareTabs("history"), // history subtabs

      // Enriched fields

      enriched: {
        biography: await TextEditor.enrichHTML(this.document.system.biography, {
          secrets: this.document.isOwner,
        }),
        ownerNotes: await TextEditor.enrichHTML(
          this.document.system.ownerNotes,
          {
            secrets: this.document.isOwner,
          },
        ),
        gmNotes: await TextEditor.enrichHTML(this.document.system.gmNotes, {
          secrets: this.document.isOwner,
        }),
      },
    });

    console.log(`context: `);
    console.dir(context);
    return context;
  }

  async _preparePartContext(partId, context, options) {
    //context = await super._preparePartContext(partId, context, options);
    // now that i am thinking, if i need it anyway

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

  /* ---------- Context Menus --------- */
  createContextMenus() {
    // menus needs to be defined as function

    function _actionRollContextOptions() {
      return [
        {
          name: "Action roll",
          callback: async (target) => {
            await this.onActionRoll(null, target);
          },
        },
        {
          name: "Combination roll",
          callback: async (target) => {
            await this.onCombinationRoll(null, target);
          },
        },
      ];
    }

    function _itemContextOptions() {
      return [
        {
          name: "Edit",
          icon: '<i class="fas fa-edit"></i>',
          callback: async (target) => {
            await this.onEditItem(null, target);
          },
        },
        {
          name: "Delete",
          icon: '<i class="fas fa-trash"></i>',
          callback: async (target) => {
            await this.onDeleteItem(null, target);
          },
        },
      ];
    }

    // appv2 helper function
    this._createContextMenu(
      _actionRollContextOptions.bind(this),
      `[data-action=rollAction]`,
      {
        hookName: "getActionRollContextOptions",
        fixed: true,
        parentClassHooks: false,
      },
    );

    this._createContextMenu(
      _itemContextOptions.bind(this),
      `[data-action=openItemMenu]`,
      {
        eventName: "click",
        hookName: "getItemContextOptions",
        fixed: true,
        parentClassHooks: false,
      },
    );
  }

  /** @inheritdoc */
  async _onFirstRender(context, options) {
    await super._onFirstRender(context, options);
    this.createContextMenus();
  }

  activateListeners(html) {
    console.log(`Activate listeners`);
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

  async _onDropActor(data) {
    const actor = await Actor.implementation.fromDropData(data);
    if (actor.type === "group") {
      await this.actor.setGroup(actor);
    }
  }

  async _onDropItem(event, data) {
    const item = await Item.implementation.fromDropData(data);
    if (!item) return false;

    const targetElement = event.target.closest(".entry");
    const targetId = targetElement?.dataset.itemId;
    const targetItem = targetId ? this.actor.items.get(targetId) : null;

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

    const isSameActor = item.actor?.id === this.actor.id;
    const isFromSidebar = !item.actor;
    const isFromOtherActor = item.actor && item.actor.id !== this.actor.id;

    if (isSameActor) {
      if (targetItem) {
        if (item.id === targetItem.id) return false;

        const sortModes =
          this.actor.getFlag("degenesisnext", "inventorySortModes") || {};
        const sortMode = sortModes[targetItem.type] || "manual";

        console.log(sortMode);
        if (sortMode === "manual") {
          return this._handleSort(item, targetItem);
        } else {
          ui.notifications.warn("Disable alphabetical sorting first. ");
          return false;
        }
      }
    }

    if (isFromSidebar) {
      return super._onDropItem(event, item);
    }
  }

  /* ------- Sorting & DragNDrop ------ */

  async _handleSort(source, target) {
    const siblings = this.actor.items.filter(
      (i) => i.type === target.type && i.id !== source.id,
    );

    const sortUpdates = performIntegerSort(source, {
      target: target,
      siblings: siblings,
    });

    const updates = sortUpdates.map((u) => ({
      _id: u.target.id,
      sort: u.update.sort,
    }));

    return this.actor.updateEmbeddedDocuments("Item", updates);
  }

  //#region Effects

  /* ---------------------------------- */
  /*               Effects              */
  /* ---------------------------------- */

  /**
   * Manage effect on Actor's side.
   * @param {*} event
   * @param {*} target
   * @returns
   */
  async onManageEffect(event, target) {
    if (event) event.preventDefault();
    const action = target.dataset.type;
    const effectId = target.closest(".effect")?.dataset.effectId;
    return await this.actor._manageEffect(action, effectId);
  }

  /* ---------------------------------- */
  /*                Rolls               */
  /* ---------------------------------- */

  async onCombinationRoll(event, target) {
    if (event) event.preventDefault();
    const skill = target.dataset.skill;
    const attribute = target.dataset.attribute;
    await this.actor.combinationRoll(attribute, skill);
  }

  /* ---------------------------------- */

  async onActionRoll(event, target) {
    if (event) event.preventDefault();
    const skill = target.dataset.skill;
    const attribute = target.dataset.attribute;
    await this.actor.actionRoll(attribute, skill);
  }

  /* ---------------------------------- */

  /* ---------------------------------- */
  /*          Items / Inventory         */
  /* ---------------------------------- */

  async createItem(event, target) {
    const itemType = target.closest("[data-item-type")?.dataset.itemType;
    await this.actor._createItem(itemType);
  }

  /**
   * Display linked Item, and fallback to cached one if main do not exist anymore.
   * Mainly used with Culture / Concept / Cult
   * @param {*} event
   * @param {*} target
   */

  async showLinkedItem(event, target) {
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

  async onCreateItem() {}

  async onEditItem(event, target) {
    const itemId = target.closest("[data-item-id]")?.dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) item.sheet.render(true);
  }

  async onDeleteItem(event, target) {
    const itemId = target.closest("[data-item-id]")?.dataset.itemId;
    const item = this.actor.items.get(itemId);
    if (item) item.delete();
  }

  async removeLinkedItem(event, target) {
    const itemType = target.dataset.itemType;
    await this.actor.system.removeLinkedItem(itemType);
  }

  async unsetGroup() {
    await this.actor.unsetGroup();
  }

  async toggleSort(event, target) {
    const group = target.dataset.group;
    const currentMode =
      this.actor.getFlag("degenesisnext", `inventorySortModes.${group}`) ||
      "manual";
    const newMode = currentMode === "manual" ? "alpha" : "manual";
    await this.actor.setFlag(
      "degenesisnext",
      `inventorySortModes.${group}`,
      newMode,
    );
  }

  toggleItemProp(propPath) {
    return async function (event, target) {
      const itemId = target.closest("[data-item-id]").dataset.itemId;
      const item = this.document.items.get(itemId);
      console.log(`Toggle item prop`);
      console.log(item);
      console.log(propPath);
      const currentValue = foundry.utils.getProperty(item, propPath);
      console.log(currentValue);
      await item.update({ [propPath]: !currentValue });
    };
  }

  async toggleDescription(event, target) {
    const entry = target.closest(".entry.item");
    const itemId = entry.dataset.itemId;
    const item = this.document.items.get(itemId);

    let existingDesc = entry.nextElementSibling;
    if (existingDesc?.classList.contains("entry-description-dropdown")) {
      existingDesc.remove();
      return;
    }

    const templateData = {
      description: await TextEditor.enrichHTML(item.system.description, {
        async: true,
      }),
      item: item,
    };

    const html = await renderTemplate(
      "systems/degenesisnext/templates/shared/item/dropdown.hbs",
      templateData,
    );

    entry.insertAdjacentHTML(
      "afterend",
      `<div class="entry entry-description-dropdown" data-item-id="${itemId}">${html}</div>`,
    );
  }

  /*  changeTab(tab, group, options) {
    super.changeTab(tab, group, options);
  } */
}
