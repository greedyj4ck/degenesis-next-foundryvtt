import DGNSRoll from "./base.roll.mjs";
const { renderTemplate } = foundry.applications.handlebars;

/**
 * Combination roll class - using two instances of basic rolls.
 */
export default class DGNSCombinationRoll {
  constructor(data) {
    this.primary = new DGNSRoll(data.primary);
    this.secondary = new DGNSRoll(data.secondary);
    this.transferTriggers = data.transferTriggers ?? true;
  }

  async evaluate() {
    await this.primary.evaluate();

    if (this.primary.result === "failure") {
    }

    if (this.transferTriggers && this.primary.triggers > 0) {
      this.secondary.modifiers.t += this.primary.triggers;
    }
    await this.secondary.evaluate();
    return this;
  }

  async toMessage(messageData = {}) {
    const template =
      "systems/degenesisnext/templates/chat/combination.roll.hbs";
    const content = await renderTemplate(template, {
      primary: this.primary,
      secondary: this.secondary,
      totalTriggers: this.primary.triggers + this.secondary.triggers,
      // inne dane podsumowujące
    });

    // Używamy standardowego mechanizmu Foundry do wysłania
    return ChatMessage.create({
      user: game.user.id,
      content: content,
      rolls: [this.primary, this.secondary], // Foundry widzi obie kości dla 3D Dice
      speaker: ChatMessage.getSpeaker(),
      ...messageData,
    });
  }
}
