/**
 * Dice resolution logic.
 */

export class DicePool {
  static MAX_DICE = 12;

  /* ---------------------------------- */

  /**
   *
   * @param {*} actionNumber
   * @param {*} modifiers
   */
  static resolve(actionNumber = 0, modifiers = {}) {
    const diceMod = modifiers.d || 0;
    const totalActionNumber = Math.max(0, Number(actionNumber) || 0) + diceMod;

    return {
      totalActionNumber,
      rolledDice: Math.min(totalActionNumber, this.MAX_DICE),
      autoSuccesses: Math.max(0, totalActionNumber - this.MAX_DICE),
    };
  }
}
