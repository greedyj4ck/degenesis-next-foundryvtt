/** @import HandlebarsApplicationMixin from '@client/applications/api/handlebars-application.mjs*/

const { api, sheets } = foundry.applications;

/** Class extending HandlebarsApplicationMixin */
export default function ActorSheetMixin(Base) {
  return class DegenesisActorSheet extends api.HandlebarsApplicationMixin(
    Base
  ) {
    static TABS = [];

    static MODES = {
      PLAY: 1,
      EDIT: 2,
    };

    _mode = this.constructor.MODES.PLAY;
    _dropdownState = {};

    /** Constructor  */

    constructor(object, options = {}) {
      const key = `${object.type}${object.limited ? ":limited" : ""}`;
      const { width, height } =
        game.user.getFlag("degenesisnext", `actorSheetPrefs.${key}`) ?? {};
      if (width && !("width" in options)) options.width = width;
      if (height && !("height" in options)) options.height = height;

      super(object, options);
    }

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
          game.i18n.localize("DGNS.SheetModeEdit")
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

    /** Data preparation */
    /** DEPRECATED  */
    async getData(options) {}

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

    /** Event listeners and handlers */

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
    }

    async _onChangeSheetMode(event) {
      const { MODES } = this.constructor;
      const toggle = event.currentTarget;

      // TODO: Change the localization strings
      const label = game.i18n.localize(
        `DGNS.SheetMode${toggle.checked ? "Play" : "Edit"}`
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

    /** Events handling */

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
