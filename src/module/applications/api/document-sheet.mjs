const { DocumentSheetV2, HandlebarsApplicationMixin } =
  foundry.applications.api;

export default class DocumentSheet extends HandlebarsApplicationMixin(
  DocumentSheetV2
) {
  static DEFAULT_OPTIONS = {
    classes: ["degenesis"],
  };
  /** @inheritDoc */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    return context;
  }

  /** @inheritDoc */
  async _preparePartContext(partId, context, options) {
    return { ...(await super._preparePartContext(partId, context, options)) };
  }
}
