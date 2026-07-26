/**
 * Extend the basic ActorSheet class to suppose system-specific logic and functionality.
 * @abstract
 */
const { api, sheets } = foundry.applications;
const { DialogV2 } = foundry.applications.api;
const { TextEditor } = foundry.applications.ux;

import ActorSheetMixin from "./actor.sheet.mixin.mjs";

import { Scars } from "../../logic/scars.mjs";

export default class DGNSGroupSheet extends ActorSheetMixin(
  sheets.ActorSheetV2,
) {
  static DEFAULT_OPTIONS = {
    actions: {
      createMilestone: DGNSGroupSheet.prototype.onCreateMilestone,
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
    classes: ["dgns-group"],
  };

  static PARTS = {
    sheetHeader: {
      template: "systems/degenesisnext/templates/shared/sheet/title.hbs",
    },
    groupHeader: {
      template: "systems/degenesisnext/templates/actor/group/header.hbs",
    },
    tabs: {
      template: "systems/degenesisnext/templates/actor/group/tabs.hbs",
      scrollable: [""],
    },
    members: {
      template: "systems/degenesisnext/templates/actor/group/members.hbs",
      scrollable: [""],
    },
    alignment: {
      template: "systems/degenesisnext/templates/actor/group/alignment.hbs",
      scrollable: [""],
    },
    milestones: {
      template: "systems/degenesisnext/templates/actor/group/milestones.hbs",
      scrollable: [""],
    },
    history: {
      template: "systems/degenesisnext/templates/actor/group/history.hbs",
      scrollable: [""],
    },
    inventory: {
      template: "systems/degenesisnext/templates/actor/group/inventory.hbs",
      scrollable: [""],
    },

    /*
    general: {
      template:
        "systems/degenesisnext/templates/actors/character.sheet/cs.general.hbs",
      scrollable: [""],
    },
 */
    sheetFooter: {
      template: "systems/degenesisnext/templates/shared/sheet/footer.hbs",
    },
  };

  static TABS = {
    main: {
      initial: "members", // Set the initial tab
      tabs: [
        { id: "members", label: "DGNS.UI.TABS.members" },
        { id: "alignment", label: "DGNS.UI.TABS.alignment" },
        { id: "history", label: "DGNS.UI.TABS.history" },
        /*  { id: "effects", label: "DGNS.UI.TABS.effects" }, */
        { id: "milestones", label: "DGNS.UI.TABS.milestones" },
        { id: "inventory", label: "DGNS.UI.TABS.inventory" },
      ],
    },
  };

  /** Preparing sheet context */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const system = this.actor.system;

    context.document = this.document;
    context.system = this.document.system;
    context.fields = this.document.schema.fields;
    context.systemFields = this.document.system.schema.fields;
    context.mode = this._mode;
    context.isEditable = this.isEditable;

    // Saved sorting mode
    context.sortMode =
      this.actor.getFlag(CONFIG.DEGENESIS.id, "inventorySortMode") || "manual";

    // Inventory

    context.inventory = this.actor._prepareInventory();
    context.alignmentData = Scars.Alignments[system.alignment] ?? null;
    context.milestones = this.document.system.milestones;
    context.members = system.members;
    context.membersConcepts = system.membersConcepts;
    context.mainTabs = this._prepareTabs("main");

    context.enriched = {};

    console.log(`Milestone debug`);
    console.log(context.milestones[0].description);

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

    console.log(`Context for group actor: ${this.name}`);
    console.dir(context);

    return context;
  }

  async _preparePartContext(partId, context) {
    if (context.mainTabs?.[partId]) {
      context.tab = context.mainTabs[partId];

      if (partId === "history") {
        context.subtabs = context.historyTabs;
      }
    }

    return context;
  }

  getTabs() {
    let tabs = [];
    return tabs;
  }

  /** @inheritdoc */
  async _onFirstRender(context, options) {
    await super._onFirstRender(context, options);
    // this.createContextMenus();
  }

  activateListeners(html) {
    super.activateListeners(html);
  }
  /** @inheritdoc */
  _onRender(context, options) {
    // You may want to add other special handling here
    // Foundry comes with a large number of utility classes, e.g. SearchFilter
    // That you may want to implement yourself.
    console.log(this);

    super._onRender(context, options);
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
    return super._onDrop(event);
  }

  /* ---------------------------------- */
  /*            SHEET ACTIONS           */
  /* ---------------------------------- */

  async onCreateMilestone() {
    const milestones = this.document.system.milestones ?? [];

    console.log(`Adding new mielstone`);
    console.log(milestones);

    await this.document.update({
      "system.milestones": [
        ...milestones,
        {
          id: foundry.utils.randomID(),
          label: "Milestone",
          description: "description",
          achieved: false,
          awardedEgo: false,
          awardedScar: false,
        },
      ],
    });
  }
}
