const { api, sheets } = foundry.applications;

export default function ItemSheetMixin(Base) {
  return class DegenesisItemSheet extends api.HandlebarsApplicationMixin(Base) {
    static TABS = [];

    static MODES = {
      PLAY: 1,
      EDIT: 2,
    };

    _mode = this.constructor.MODES.PLAY;
    _dropdownState = {};

    constructor(object, options = {}) {
      super(object, options);
    }

    static async changeSheetBackground() {
      const filePicker = new FilePicker({
        type: "image",
        wildcard: true,
        callback: async (path) => {
          if (path) {
            try {
              await this.document.update({
                ["system.backgroundImage"]: path,
              });
              ui.notifications.info(
                `Updated ${this.document.name} backgroundImage to: ${path}`
              );
            } catch (error) {
              console.error("Error updating document:", error);
              ui.notifications.error("Failed to update document");
            }
          } else {
            console.log("No path received in callback");
          }
        },
      });

      await filePicker.browse();
    }

    static async clearSheetBackground() {
      try {
        await this.document.update({
          ["system.backgroundImage"]: null,
        });
      } catch (err) {
        console.log(err);
        ui.notifications.error("Failed clear sheet background");
      }
    }

    /** @inheritdoc */
    async close(options) {
      options = { animate: false }; // disabling window slow animation
      await super.close(options);
    }

    /** @inheritdoc */
    async _render(force, { mode, ...options } = {}) {
      console.log(`ItemSheetMixin _render`);
      return super._render(force, ({ mode, ...options } = {}));
    }

    /** @inheritdoc */
    async _renderHTML(context, options) {
      console.log(`ItemSheetMixin _renderHTML`);
      return super._renderHTML(context, options);
    }

    async _renderFrame(options) {
      console.log(`ItemSheetMixin _renderFrame`);
      const html = await super._renderFrame(options);

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

    activateListeners(html) {
      console.log(`ItemSheetMixin activateListeners.`);

      // section dropdown containers
      console.log(this._dropdownState);

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
      await this.submit();

      console.log(`Current mode`, this._mode);

      this.render();
    }

    _onChangeTab(event, tabs, active) {
      super._onChangeTab(event, tabs, active);
      // I think this event do not exist in Foundry API. Shit.
      // Need to figure this out.

      console.log(`Tab Change fired`);

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
      console.log(`on resize fired`);

      /*  const { width, height } = this.position;
      const key = `${this.actor.type}${this.actor.limited ? ":limited" : ""}`;
      game.user.setFlag("degenesis", `actorSheetPrefs.${key}`, {
        width,
        height,
      }); */
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

  // Changeable background
}
