/** @import HandlebarsApplicationMixin from '@client/applications/api/handlebars-application.mjs*/

const { api, sheets } = foundry.applications;
const { DragDrop, TextEditor } = foundry.applications.ux;

/* ---------------------------------- */
/*     Helper Functions for Mixin     */
/* ---------------------------------- */

const getSheetPrefs = (doc) => {
  const key = `${doc.type}${doc.limited ? ":limited" : ""}`;
  return game.user.getFlag("degenesisnext", `actorSheetPrefs.${key}`) ?? {};
};

/* ---------------------------------- */
/*             Main Class             */
/* ---------------------------------- */

/** Class extending HandlebarsApplicationMixin */
export default function ActorSheetMixin(Base) {
  return class DegenesisActorSheet extends api.HandlebarsApplicationMixin(
    Base,
  ) {
    static TABS = [];

    static MODES = {
      PLAY: 1,
      EDIT: 2,
    };

    static DEFAULT_OPTIONS = {
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
    /*             DragAndDrop            */
    /* ---------------------------------- */

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

    /**
     * Returns an array of DragDrop instances
     * @type {DragDrop[]}
     */

    /**
     * Define whether a user is able to begin a dragstart workflow for a given drag selector
     * @param {string} selector       The candidate HTML selector for dragging
     * @returns {boolean}             Can the current user drag this selector?
     * @protected
     */
    _canDragStart(selector) {
      // game.user fetches the current user
      console.log(`canDragStart`);
      return this.isEditable;
    }

    /**
     * Define whether a user is able to conclude a drag-and-drop workflow for a given drop selector
     * @param {string} selector       The candidate HTML selector for the drop target
     * @returns {boolean}             Can the current user drop on this selector?
     * @protected
     */
    _canDragDrop(selector) {
      // game.user fetches the current user
      console.log(`canDragDrop`);
      return this.isEditable;
    }

    /**
     * Callback actions which occur at the beginning of a drag start workflow.
     * @param {DragEvent} event       The originating DragEvent
     * @protected
     */
    _onDragStart(event) {
      const el = event.currentTarget;

      console.log(`Element`);
      console.log(el);

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

      console.log(`onDropData`);
      console.log(data);

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

    /** @inheritdoc */
    async _renderHTML(context, options) {
      return super._renderHTML(context, options);
    }

    async _renderFrame(options) {
      const html = await super._renderFrame(options);

      // Adding edit mode toggle slider
      const header = html.children[0];
      if (this.isEditable) {
        const toggle = document.createElement("dgns-slidetoggle");
        toggle.checked = this._mode === this.constructor.MODES.EDIT;
        toggle.classList.add("mode-slider");
        toggle.dataset.tooltip = "DGNS.SheetModeEdit";
        toggle.setAttribute(
          "aria-label",
          game.i18n.localize("DGNS.SheetModeEdit"),
        );

        // toggle.addEventListener("change", this._onChangeSheetMode.bind(this));
        toggle.addEventListener("change", (event) => {
          event.stopPropagation();
          event.stopImmediatePropagation();
          this._onChangeSheetMode(event);
        });
        toggle.addEventListener("dblclick", (event) => event.stopPropagation());
        header.insertAdjacentElement("afterbegin", toggle);
      }

      // Adding resize handler
      let resizeHandle = html.lastChild;
      resizeHandle.innerHTML = `<svg><path d="M0,11L11,0L11,11L0,11Z"/></svg>`;

      return html;
    }

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
      return context;
    }

    activateListeners(html) {
      // section dropdown containers
      //todo: move to separate helper function
      html.querySelectorAll(".section-dropdown").forEach((sectionEl) => {
        const sectionId = sectionEl.dataset.section;
        const body = sectionEl.querySelector(".section-body");
        const toggleBtn = sectionEl.querySelector(".dropdown-toggle");

        // Domyślny stan z HTML jeśli nie był zapisany wcześniej
        if (!(sectionId in this._dropdownState)) {
          this._dropdownState[sectionId] =
            sectionEl.dataset.collapsed === "true" ? true : false;
        }

        // Ustaw klasę w zależności od stanu
        if (this._dropdownState[sectionId]) {
          body.classList.add("collapsed");
        }

        // Obsługa przycisku
        toggleBtn?.addEventListener("click", (event) => {
          const isCollapsed = body.classList.contains("collapsed");
          body.classList.toggle("collapsed");
          this._dropdownState[sectionId] = !isCollapsed;
        });
      });

      // Binding dragndrop
      this.#dragDrop.forEach((d) => d.bind(this.element));
    }

    _onRender(context, options) {
      super._onRender(context, options);
      this.activateListeners(this.element);
    }

    _onResize(event) {
      super._onResize(event);

      const { width, height } = this.position;
      const key = `${this.actor.type}${this.actor.limited ? ":limited" : ""}`;
      game.user.setFlag("degenesis", `actorSheetPrefs.${key}`, {
        width,
        height,
      });
    }

    async _onChangeSheetMode(event) {
      const { MODES } = this.constructor;
      const toggle = event.currentTarget;

      // TODO: Change the localization strings
      const label = game.i18n.localize(
        `DGNS.SheetMode${toggle.checked ? "Play" : "Edit"}`,
      );
      toggle.dataset.tooltip = label;
      toggle.setAttribute("aria-label", label);
      this._mode = toggle.checked ? MODES.EDIT : MODES.PLAY;
      // await this.submit();
      this.render();
    }

    _disableFields(form) {
      super._disableFields(form);
    }
    /* ---------------------------------- */
    /*               Events               */
    /* ---------------------------------- */

    /** Events handling */
    /** Dropdown sections handling  */

    _onDropdownToggle(event) {
      try {
        let target = event.currentTarget;
        let dropdown = target.dataset.dropdown;

        console.log(target.attributes);
      } catch (err) {
        console.log(err);
      }
    }
  };
}
