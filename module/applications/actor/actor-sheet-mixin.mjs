const { api, sheets } = foundry.applications;

export default function ActorSheetMixin(Base) {
  return class DegenesisActorSheet extends api.HandlebarsApplicationMixin(
    Base
  ) {
    /** Constructor  */

    static TABS = [];

    static MODES = {
      PLAY: 1,
      EDIT: 2,
    };

    _mode = this.constructor.MODES.PLAY;

    constructor(object, options = {}) {
      const key = `${object.type}${object.limited ? ":limited" : ""}`;
      const { width, height } =
        game.user.getFlag("degenesis", `actorSheetPrefs.${key}`) ?? {};
      if (width && !("width" in options)) options.width = width;
      if (height && !("height" in options)) options.height = height;

      super(object, options);
    }

    /** Rendering  */

    async _renderOuter() {
      const html = await super._renderOuter();
      return html;
    }

    /** Data preparation */

    async getData(options) {
      const context = await super.getData(options);
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
      super.activateListeners(html);
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
      this.render();
    }

    _onChangeTab(event, tabs, active) {
      super._onChangeTab(event, tabs, active);
      // Need to figure this out.
      this.form.className = this.form.className.replace(/tab-\w+/g, "");
      this.form.classList.add(`tab-${active}`);
    }

    _disableFields(form) {
      super._disableFields(form);
    }

    /** Events handling */

    _onResize(event) {
      super._onResize(event);
      const { width, height } = this.position;
      const key = `${this.actor.type}${this.actor.limited ? ":limited" : ""}`;
      game.user.setFlag("degenesis", `actorSheetPrefs.${key}`, {
        width,
        height,
      });
    }
  };
}
