/** @import HandlebarsApplicationMixin from '@client/applications/api/handlebars-application.mjs*/

const { api, sheets } = foundry.applications;
const { DragDrop, TextEditor } = foundry.applications.ux;

// Sorting utilities
const { performIntegerSort } = foundry.utils;

/* ---------------------------------- */
/*     Helper Functions for Mixin     */
/* ---------------------------------- */

const getSheetPrefs = (doc) => {
  const key = `${doc.type}${doc.limited ? ":limited" : ""}`;
  return game.user.getFlag(CONFIG.DEGENESIS.id, `actorSheetPrefs.${key}`) ?? {};
};

/* ---------------------------------- */
/*             Main Class             */
/* ---------------------------------- */

/**
 * Class extending HandlebarsApplicationMixin.
 * @param {*} Base
 */
export default function ActorSheetMixin(Base) {
  return class DGNSActorSheet extends api.HandlebarsApplicationMixin(Base) {
    static TABS = [];

    static MODES = {
      PLAY: 1,
      EDIT: 2,
    };

    // Default Options avaialable on all sheets.

    static DEFAULT_OPTIONS = {
      actions: {
        // General UI actions
        toggleExpanded: DGNSActorSheet.#toggleExpanded,
        showLinkedItem: DGNSActorSheet.#showLinkedItem,
        removeLinkedItem: DGNSActorSheet.#removeLinkedItem,
        // Inventory related actions
        toggleSort: DGNSActorSheet.#toggleSort,
        toggleEquipped: DGNSActorSheet.#toggleItemProp("system.equipped"),
        toggleDropped: DGNSActorSheet.#toggleItemProp("system.dropped"),
        createItem: DGNSActorSheet.#createItem,

        editItem: DGNSActorSheet.prototype._onEditItem,
        deleteItem: DGNSActorSheet.prototype._onDeleteItem,
        // Standard rolls
        rollAction: DGNSActorSheet.prototype._onActionRoll,
        rollCombination: DGNSActorSheet.prototype._onCombinationRoll,
        rollWeapon: DGNSActorSheet.prototype._onWeaponRoll,

        // Active effects
        manageEffect: DGNSActorSheet.prototype._onManageEffect,
      },

      contextMenus: [
        {
          handler: DGNSActorSheet.#getActionRollContextOptions,
          selector: "[data-action=rollAction]",
          options: {
            parentClassHooks: false,
            fixed: true,
          },
        },

        {
          handler: DGNSActorSheet.#getInventoryContextOptions,
          selector: "[data-action=openItemMenu]",
          options: {
            eventName: "click",
            parentClassHooks: false,
            fixed: true,
          },
        },
      ],

      dragDrop: [{ dragSelector: "[data-drag]", dropSelector: null }],
    };

    _mode = this.constructor.MODES.PLAY;
    _dropdownState = {};

    /* ---------------------------------- */
    /*             Constructor            */
    /* ---------------------------------- */

    constructor(object, options = {}) {
      const { width, height } = getSheetPrefs(object);

      options.width ??= width;
      options.height ??= height;

      super(object, options);
      this.#dragDrop = this.#createDragDropHandlers();
    }

    /* ---------------------------------- */
    /*    Rendering and Window Controls   */
    /* ---------------------------------- */

    /** @inheritdoc */
    async close(options) {
      options = { animate: false }; // disabling window slow animation
      await super.close(options);
    }

    /** @inheritdoc */
    async _render(force, { mode, ...options } = {}) {
      return super._render(force, ({ mode, ...options } = {}));
    }

    async _onFirstRender(context, options) {
      await super._onFirstRender(context, options);
      if (!!this.options.contextMenus.length) this._createContextMenus();
    }

    /* ---------------------------------- */

    /** @inheritdoc */
    async _renderHTML(context, options) {
      return super._renderHTML(context, options);
    }

    /* ---------------------------------- */

    async _renderFrame(options) {
      const html = await super._renderFrame(options);

      // Adding edit mode toggle slider
      const header = html.children[0];

      if (this.isEditable) {
        const modeIcon = document.createElement("i");
        modeIcon.classList.add("mode-icon");

        const toggle = document.createElement("dgns-slidetoggle");
        toggle.checked = this._mode === this.constructor.MODES.EDIT;

        modeIcon.classList.add("fa-solid");
        modeIcon.classList.add(toggle.checked ? "fa-pen" : "fa-play");

        toggle.classList.add("mode-slider");
        toggle.dataset.tooltip = "DGNS.UISHEETMODES.play";
        toggle.setAttribute(
          "aria-label",
          game.i18n.localize("DGNS.UISHEETMODES.play"),
        );

        // toggle.addEventListener("change", this._onChangeSheetMode.bind(this));
        toggle.addEventListener("change", (event) => {
          event.stopPropagation();
          event.stopImmediatePropagation();

          modeIcon.classList.toggle("fa-pen", toggle.checked);
          modeIcon.classList.toggle("fa-play", !toggle.checked);

          this._onChangeSheetMode(event);
        });
        toggle.addEventListener("dblclick", (event) => event.stopPropagation());
        header.insertAdjacentElement("afterbegin", modeIcon);
        header.insertAdjacentElement("afterbegin", toggle);
      }

      // Adding resize handler
      let resizeHandle = html.lastChild;
      resizeHandle.innerHTML = `<svg><path d="M0,11L11,0L11,11L0,11Z"/></svg>`;

      return html;
    }

    /* ---------------------------------- */

    async _prepareContext(options) {
      const context = await super._prepareContext(options);

      if (!this._dropdownState) {
        this._dropdownState = {};
      }

      context.editable =
        this.isEditable && this._mode === this.constructor.MODES.EDIT;
      context.cssClass = context.editable
        ? "editable"
        : this.isEditable
          ? "interactable"
          : "locked";
      context.isEditMode = this._mode === 2;

      return context;
    }

    /* ---------------------------------- */

    /** @inheritdoc */
    _replaceHTML(result, content, options) {
      /**
       * Function used for restoring state of collapsible containers.
       */
      for (const part of Object.values(result)) {
        for (const element of part.querySelectorAll("[data-expand-id]")) {
          const isExpanded = this.#expandedSections.get(
            element.dataset.expandId,
          );

          const collapsible = element.classList.contains("collapsible")
            ? element
            : element.querySelector(".collapsible");

          collapsible?.classList.toggle("expanded", isExpanded ?? false);
          collapsible?.classList.toggle(
            "expanded--restored",
            isExpanded ?? false,
          );
        }
      }

      super._replaceHTML(result, content, options);
    }

    /* ---------------------------------- */

    activateListeners(html) {
      // Binding dragndrop
      this.#dragDrop.forEach((d) => d.bind(this.element));
    }

    /* ---------------------------------- */

    _onRender(context, options) {
      super._onRender(context, options);
      this.activateListeners(this.element);
    }

    /* ---------------------------------- */

    _onResize(event) {
      super._onResize(event);

      const { width, height } = this.position;
      const key = `${this.actor.type}${this.actor.limited ? ":limited" : ""}`;
      game.user.setFlag("degenesis", `actorSheetPrefs.${key}`, {
        width,
        height,
      });
    }

    /* ---------------------------------- */

    async _onChangeSheetMode(event) {
      const { MODES } = this.constructor;
      const toggle = event.currentTarget;

      const label = game.i18n.localize(
        `DGNS.UI.SHEETMODES.${toggle.checked ? "edit" : "play"}`,
      );
      toggle.dataset.tooltip = label;
      toggle.setAttribute("aria-label", label);
      this._mode = toggle.checked ? MODES.EDIT : MODES.PLAY;

      this.render();
    }

    /* ---------------------------------- */

    _disableFields(form) {
      super._disableFields(form);
    }

    // Based on dnd5e implementation
    /* -------------------------------------------- */
    /*  Properties                                  */
    /* -------------------------------------------- */

    /**
     * Expanded states for collapsible sections to persist between renders.
     */
    #expandedSections = new Map();

    // Using a getter to access private property
    get expandedSections() {
      return this.#expandedSections;
    }

    /* ---------------------------------- */
    /*                 UI                 */
    /* ---------------------------------- */

    /**
     * Handling collapsible sections. Based on dnd5e implementation, but items are hidden
     * on defautl and we are toggling 'Expanded' instead 'Collapsed' to not confuse
     * future generation of programmer`s.
     *
     * .collapsible is the required class for elements
     *
     * @this {*}
     * @param {*} event
     * @param {*} target
     * @returns
     */

    static #toggleExpanded(event, target) {
      const collapsible = target.closest(".collapsible");
      if (!collapsible) return;

      const expandId = target.closest("[data-expand-id]")?.dataset.expandId;

      // magic is happening here...

      collapsible.classList.remove("expanded--restored"); // stopping animation on re-render
      collapsible.classList.toggle("expanded");

      const isExpanded = collapsible.classList.contains("expanded");

      // if the item is expanded, add it to #expandedSections
      this.#expandedSections.set(expandId, isExpanded);

      if (expandId) {
        this.actor.update(
          {
            [`flags.${CONFIG.DEGENESIS.id}.expandedSections.${expandId}`]:
              isExpanded,
          },
          { render: false },
        );
      }
    }

    /* ---------------------------------- */

    /**
     * Display linked Item, and fallback to cached one if main do not exist anymore.
     * Mainly used with Culture / Concept / Cult
     * @param {*} event
     * @param {*} target
     */
    static async #showLinkedItem(event, target) {
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

    /* ---------------------------------- */

    static async #removeLinkedItem(event, target) {
      const itemType = target.dataset.itemType;
      await this.actor.system.removeLinkedItem(itemType);
    }

    /* ---------- Context Menus --------- */

    // Switched to universal handler Daggerheart style.

    _createContextMenus() {
      for (const config of this.options.contextMenus) {
        const { handler, selector, options } = config;
        this._createContextMenu(handler.bind(this), selector, options);
      }
    }

    /* ---------------------------------- */

    /**
     * Preparing standard context menu options
     * @returns
     */

    static #getInventoryContextOptions() {
      const options = [
        {
          label: "itemEdit",
          icon: "fas fa-edit",
          callback: async (target) => {
            await this._onEditItem(null, target);
          },
          /*   condition: (element) => {
            
          }, */
        },
        {
          label: "itemDelete",
          icon: "fas fa-trash",
          callback: async (target) => {
            await this._onDeleteItem(null, target);
          },
        },
      ].map((option) => ({
        ...option,
        label: `DGNS.UI.CONTEXT.${option.label}`,
        icon: `<i class="${option.icon}"></i>`,
      }));

      return [...options];
    }

    /* ---------------------------------- */

    static #getActionRollContextOptions() {
      const options = [
        {
          label: "actionRoll",
          icon: "",
          callback: async (target) => {
            await this._onActionRoll(null, target);
          },
        },
        {
          label: "combinationRoll",
          icon: "",
          callback: async (target) => {
            await this._onCombinationRoll(null, target);
          },
        },
      ].map((option) => ({
        ...option,
        label: `DGNS.UI.CONTEXT.${option.label}`,
        icon: `<i class="${option.icon}"></i>`,
      }));

      return [...options];
    }

    /* ----------- Drag & Drop ---------- */
    /* Based on community Wiki example. */

    /* Private property. */
    #dragDrop;

    /**
     * Returns an array of DragDrop instances
     * @type {DragDrop[]}
     */
    get dragDrop() {
      return this.#dragDrop;
    }

    /* ---------------------------------- */

    /**
     * Create drag-and-drop workflow handlers for this Application
     * @returns {DragDrop[]}     An array of DragDrop handlers
     * @private
     */

    #createDragDropHandlers() {
      return this.options.dragDrop.map((d) => {
        d.permissions = {
          dragstart: this._canDragStart.bind(this),
          drop: this._canDragDrop.bind(this),
        };
        d.callbacks = {
          dragstart: this._onDragStart.bind(this),
          dragover: this._onDragOver.bind(this),
          drop: this._onDrop.bind(this),
        };
        return new DragDrop(d);
      });
    }

    /* ---------------------------------- */

    /**
     * Define whether a user is able to begin a dragstart workflow for a given drag selector
     * @param {string} selector       The candidate HTML selector for dragging
     * @returns {boolean}             Can the current user drag this selector?
     * @protected
     */
    _canDragStart(selector) {
      // game.user fetches the current user

      return this.isEditable;
    }

    /* ---------------------------------- */

    /**
     * Define whether a user is able to conclude a drag-and-drop workflow for a given drop selector
     * @param {string} selector       The candidate HTML selector for the drop target
     * @returns {boolean}             Can the current user drop on this selector?
     * @protected
     */
    _canDragDrop(selector) {
      // game.user fetches the current user

      return this.isEditable;
    }

    /* ---------------------------------- */

    /**
     * Callback actions which occur at the beginning of a drag start workflow.
     * @param {DragEvent} event       The originating DragEvent
     * @protected
     */

    _onDragStart(event) {
      const el = event.currentTarget;

      if ("link" in event.target.dataset) return;

      const itemId = el.dataset.itemId;
      const item = this.actor.items.get(itemId);

      if (!item) return;

      const dragData = item.toDragData();
      event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
    }

    /* ---------------------------------- */

    /**
     * Callback actions which occur when a dragged element is over a drop target.
     * @param {DragEvent} event       The originating DragEvent
     * @protected
     */
    _onDragOver(event) {}

    /* ---------------------------------- */

    /**
     * Callback actions which occur when a dragged element is dropped on a target.
     * It will call different method based on data type beeing dragged onto sheet.
     * @param {DragEvent} event       The originating DragEvent
     * @protected
     */

    async _onDrop(event) {
      event.preventDefault();

      const data = TextEditor.getDragEventData(event);

      if (!data.type) return super._onDrop(event);

      const handlerName = `_onDrop${data.type}`;

      // This will call _onDropActor and _onDropItem methods in parent sheet
      // eg. Character Sheet, Group Sheet etc.
      if (typeof this[handlerName] === "function") {
        return this[handlerName](event, data);
      }

      return super._onDrop(event);
    }

    /* ---------------------------------- */

    //todo: cleanup, move ccc related stuff to other functions ?
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
            this.actor.getFlag(CONFIG.DEGENESIS.id, "inventorySortModes") || {};
          const sortMode = sortModes[targetItem.type] || "manual";

          if (sortMode === "manual") {
            return this._handleInventorySort(item, targetItem);
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

    /* ---------------------------------- */
    /*       FUNCIONALITY: INVENTORY      */
    /* ---------------------------------- */

    // #region Inventory

    static async #createItem(event, target) {
      const itemType = target.closest("[data-item-type")?.dataset.itemType;
      await this.actor._createItem(itemType);
    }

    /* ---------------------------------- */

    static async #onCreateItem() {}

    /* ---------------------------------- */

    async _onEditItem(event, target) {
      const itemId = target.closest("[data-item-id]")?.dataset.itemId;
      const item = this.actor.items.get(itemId);
      if (item) item.sheet.render(true);
    }

    /* ---------------------------------- */

    async _onDeleteItem(event, target) {
      const itemId = target.closest("[data-item-id]")?.dataset.itemId;
      const item = this.actor.items.get(itemId);
      if (item) item.delete();
    }

    /* ---------------------------------- */

    static #toggleItemProp(propPath) {
      return async function (event, target) {
        const itemId = target.closest("[data-item-id]").dataset.itemId;
        const item = this.document.items.get(itemId);

        const currentValue = foundry.utils.getProperty(item, propPath);

        await item.update({ [propPath]: !currentValue });
      };
    }

    /* ---------------------------------- */

    static async #toggleSort(event, target) {
      const group = target.dataset.group;
      const currentMode =
        this.actor.getFlag(
          CONFIG.DEGENESIS.id,
          `inventorySortModes.${group}`,
        ) || "manual";
      const newMode = currentMode === "manual" ? "alpha" : "manual";
      await this.actor.setFlag(
        "degenesisnext",
        `inventorySortModes.${group}`,
        newMode,
      );
    }

    /* ---------------------------------- */

    async _handleInventorySort(source, target) {
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

    //#endregion

    /* --------------------------------------- */
    /*       FUNCIONALITY: STANDARD ROLLS      */
    /* --------------------------------------- */
    // #region Standard Roll

    async _onCombinationRoll(event, target) {
      if (event) event.preventDefault();
      const skill = target.dataset.skill;
      const attribute = target.dataset.attribute;
      await this.actor.combinationRoll(attribute, skill);
    }

    /* ---------------------------------- */

    async _onActionRoll(event, target) {
      if (event) event.preventDefault();
      const skill = target.dataset.skill;
      const attribute = target.dataset.attribute;
      await this.actor.actionRoll(attribute, skill);
    }

    /* ---------------------------------- */

    async _onWeaponRoll(event, target) {
      if (event) event.preventDefault();
      const weapon = this.document.items.get(
        target.closest("[data-item-id]").dataset.itemId,
      );
      await this.document.weaponRoll(weapon);
    }

    /* ---------------------------------- */

    static #groupRoll(event, target) {
      return this.document.rollCombat({});
    }

    /* ---------------------------------- */

    static #weaponRoll(event, target) {
      const item = this.document.items.get(
        target.closest("[data-item-id]").dataset.itemId,
      );

      return this.document.rollCombat({
        options: item.system.rollOptions,
        skill: item.system.skill,
        definition: { itemUuid: item.uuid },
      });
    }

    /* ---------------------------------- */
    /*               Effects              */
    /* ---------------------------------- */

    /**
     * Manage effect on Actor's side.
     * @param {*} event
     * @param {*} target
     * @returns
     */
    async _onManageEffect(event, target) {
      if (event) event.preventDefault();
      const action = target.dataset.type;
      const effectId = target.closest(".effect")?.dataset.effectId;
      return await this.actor._manageEffect(action, effectId);
    }

    /* ---------------------------------- */

    /**
     * todo: effects sorting need to be implemented yet
     * @param {*} source
     * @param {*} target
     * @returns
     */
    async _handleEffectsSort(source, target) {
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

      return this.actor.updateEmbeddedDocuments("Effect", updates);
    }

    /* ---------------------------------- */
    /*               Events               */
    /* ---------------------------------- */

    /** Events handling */
  };
}
