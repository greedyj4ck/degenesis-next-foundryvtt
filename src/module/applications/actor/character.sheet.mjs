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
      unsetGroup: DGNSCharacterSheet.prototype.unsetGroup,
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

    /* 
    Switched to universal effects page for now. 
    
    effects: {
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
        "systems/degenesisnext/templates/actor/character/group.hbs",
        "systems/degenesisnext/templates/actor/character/legacies.hbs",
        "systems/degenesisnext/templates/actor/character/biography.hbs",

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
        { id: "general", label: "DGNS.UI.TABS.general" },
        { id: "stats", label: "DGNS.UI.TABS.stats" },
        { id: "effects", label: "DGNS.UI.TABS.effects" },
        { id: "combat", label: "DGNS.UI.TABS.combat" },
        { id: "inventory", label: "DGNS.UI.TABS.inventory" },
        { id: "history", label: "DGNS.UI.TABS.history" },
      ],
    },
    header: {
      initial: "details",
      tabs: [
        {
          id: "details",
          label: "DGNS.UI.TABS.details",
          icon: "fa-solid fa-circle-info",
        },
        { id: "modes", label: "DGNS.UI.TABS.modes", icon: "fa-solid fa-brain" },
        {
          id: "currency",
          label: "DGNS.UI.TABS.currency",
          icon: "fa-solid fa-coins",
        },
        { id: "xp", label: "DGNS.UI.TABS.xp", icon: "fa-solid fa-timeline" },
      ],
    },
    history: {
      initial: "group",
      tabs: [
        { id: "group", label: "DGNS.UI.TABS.group" },
        { id: "biography", label: "DGNS.UI.TABS.biography" },
        { id: "legacies", label: "DGNS.UI.TABS.legacies" },

        { id: "notes", label: "DGNS.UI.TABS.notes" },
        { id: "gmnotes", label: "DGNS.UI.TABS.gmnotes" },
      ],
    },
  };

  /** Preparing sheet context
   * @this {DGNSCharacterSheet}
   */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    Object.assign(context, {
      mode: this._mode,
      owner: this.document.isOwner,
      limited: this.document.limited,
      isEditMode: this._mode === 2,
      isEditable: this.isEditable,
      actor: this.actor,
      system: this.actor.system,
      flags: this.actor.flags,
      sortMode:
        this.actor.getFlag(CONFIG.DEGENESIS.id, "inventorySortMode") ||
        "manual",
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
      /* ---------------------------------- */
      combatActions: this.actor.combatActions,
      /* ---------------------------------- */
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

    // Preparing expanded sections.

    if (context.inventory?.groups) {
      for (const group of context.inventory.groups) {
        for (const item of group.items) {
          item.expanded = await item._getChatData({ secrets: item.isOwner });
          if (!this.expandedSections.has(item.id)) continue;

          // clean up deleted items
          if (!this.document.items.has(item.id)) {
            this.expandedSections.delete(item.id);
            continue;
          }
          // Grabbing state and data for expanded views
          item.isExpanded = true;
        }
      }
    }

    console.log(`Context for: ${this.actor.name}`);
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

  /** @inheritdoc */
  _onRender(context, options) {
    super._onRender(context, options);
    // You may want to add other special handling here
    // Foundry comes with a large number of utility classes, e.g. SearchFilter
    // That you may want to implement yourself.
  }

  async _renderFrame(options) {
    const html = await super._renderFrame(options);
    return html;
  }

  _onResize(event) {
    super._onResize(event);
  }

  async _onDropActor(event, data) {
    const actor = await Actor.implementation.fromDropData(data);

    if (actor.type === "group") {
      await this.actor.setGroup(actor);
    }
  }

  async unsetGroup() {
    await this.actor.unsetGroup();
  }

  /*  changeTab(tab, group, options) {
    super.changeTab(tab, group, options);
  } */
}
