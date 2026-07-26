/** @import ChatMessage from '@common/documents/chat-message.mjs*/

const { renderTemplate } = foundry.applications.handlebars;

export default class DGNSChatMessage extends ChatMessage {
  // Template map for using different structures based on action
  static TEMPLATES = {
    default: "systems/degenesisnext/templates/chat/default.hbs",
  };

  // Getter for grabbing the custom chat messages types
  get customType() {
    return this.getFlag(CONFIG.DEGENESIS.id, "type") ?? "default";
  }

  /**
   * Build the template context.
   */
  async _getTemplateData() {
    return {
      message: this,
      speaker: this.speaker,
      isGM: game.user.isGM,
      isAuthor: this.isAuthor,
      ...(this.getFlag(CONFIG.DEGENESIS.id, "actionData") ?? {}),
    };
  }

  /** Using base Foundry message and inserting proper template  */
  async renderHTML() {
    const el = await super.renderHTML();

    const template =
      DGNSChatMessage.TEMPLATES[this.customType] ??
      DGNSChatMessage.TEMPLATES.default;

    const data = await this._getTemplateData();
    const content = await renderTemplate(template, data);

    el.querySelector(".message-content").innerHTML = content;

    return el;
  }

  /**
   *
   * Creating actions for chat rows.
   * @param {*} type matching key in TEMPLATES
   * @param {*} actionData payload
   * @param {*} data extra fields
   * @returns
   */
  static async createAction(type, actionData, data = {}) {
    return this.create({
      content: `[${type}]`, // fallback plaintext if rendering fails
      flags: {
        degenesisnext: { type, actionData },
      },
      ...data,
    });
  }
}
