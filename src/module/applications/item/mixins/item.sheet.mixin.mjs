import { Qualities } from "../../../logic/quality.logic.mjs";

const { api, sheets } = foundry.applications;

export default function ItemSheetMixin(Base) {
  return class DGNSItemSheet extends api.HandlebarsApplicationMixin(Base) {
    static TABS = [];

    static MODES = {
      PLAY: 1,
      EDIT: 2,
    };

    static DEFAULT_OPTIONS = {
      actions: {
        manageQuality: DGNSItemSheet.#onManageQuality,
        manageEffect: DGNSItemSheet.#onManageEffect,
      },
    };

    _mode = this.constructor.MODES.PLAY;
    _dropdownState = {};

    constructor(object, options = {}) {
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

      const header = html.children[0];

      if (this.isEditable) {
        const toggle = document.createElement("dgns-slidetoggle");
        toggle.checked = this._mode === this.constructor.MODES.EDIT;
        toggle.classList.add("mode-slider");
        toggle.dataset.tooltip = "DGNS.UI.SHEETMODES.play";
        toggle.setAttribute(
          "aria-label",
          game.i18n.localize("DGNS.UI.SHEETMODES.play"),
        );
        toggle.addEventListener("change", this._onChangeSheetMode.bind(this));
        toggle.addEventListener("dblclick", (event) => event.stopPropagation());
        header.insertAdjacentElement("afterbegin", toggle);
      }

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

    /**
     * @this
     * @param {} html
     */
    activateListeners(html) {
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

      html.querySelectorAll(".quality-input").forEach((input) => {
        input.addEventListener("change", (event) => {
          DGNSItemSheet.#onManageQuality.call(this, event, event.currentTarget);
        });
      });
    }

    async _onChangeSheetMode(event) {
      const { MODES } = this.constructor;
      const toggle = event.currentTarget;

      // TODO: Change the localization strings
      const label = game.i18n.localize(
        `DGNS.UI.SHEETMODES.${toggle.checked ? "edit" : "play"}`,
      );
      toggle.dataset.tooltip = label;
      toggle.setAttribute("aria-label", label);
      this._mode = toggle.checked ? MODES.EDIT : MODES.PLAY;
      await this.submit();

      this.render();
    }

    _onChangeTab(event, tabs, active) {
      super._onChangeTab(event, tabs, active);
      // I think this event do not exist in Foundry API. Shit.
      // Need to figure this out.

      this.form.className = this.form.className.replace(/tab-\w+/g, "");
      this.form.classList.add(`tab-${active}`);
    }

    /** Events handling */
    _onRender(context, options) {
      super._onRender(context, options);
      this.activateListeners(this.element);
    }
    _onResize(event) {
      super._onResize(event);
    }

    /** Dropdown sections handling  */
    _onDropdownToggle(event) {
      try {
        let target = event.currentTarget;
        let dropdown = target.dataset.dropdown;
      } catch (err) {}
    }

    /* ---------------------------------- */
    /*        Common sheet methods        */
    /* ---------------------------------- */

    static async #onManageQuality(event, target) {
      if (event) event.preventDefault();
      let { field = null, value = null } = {};

      const action = target.dataset.type;
      const qualityKey = target.closest(".quality")?.dataset.qualityKey;

      if (action === "update") {
        field = target.dataset.field;
        value = target.value;
      }

      return await this.document._manageQualities(
        action,
        qualityKey,
        field,
        value,
      );
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
    static async #onManageEffect(event, target) {
      if (event) event.preventDefault();
      const action = target.dataset.type;
      const effectId = target.closest(".effect")?.dataset.effectId;
      return await this.item._manageEffect(action, effectId);
    }
  };
}
