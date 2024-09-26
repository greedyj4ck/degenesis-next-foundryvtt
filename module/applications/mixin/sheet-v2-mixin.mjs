/**
 * Adds common V2 sheet functionality.
 * @param {typeof DocumentSheet} Base  The base class being mixed.
 * @returns {typeof DocumentSheetV2}
 */

export default function DocumentSheetV2Mixin(Base) {
  return class DocumentSheetV2 extends Base {
    /**
     * Sheet tabs.
     * @type {SheetTabDescriptor5e[]}
     */
    static TABS = [];

    /**
     * Available sheet modes.
     * @enum {number}
     */
    static MODES = {
      PLAY: 1,
      EDIT: 2,
    };
    /**
     * The mode the sheet is currently in.
     * @type {ActorSheetV2.MODES}
     * @protected
     */
    _mode = this.constructor.MODES.PLAY;

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
  };
}
