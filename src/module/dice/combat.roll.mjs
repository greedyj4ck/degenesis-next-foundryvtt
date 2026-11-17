import DGNSRoll from "./base.roll.mjs";

/**
 * Logic related to specific Combat Rolls.
 */
export default class DGNSCombatRoll extends DGNSRoll {
  _prepareChatData() {
    return {
      ...super._prepareChatData(),
      title: game.i18n.localize(this.definition.label),
    };
  }
}
