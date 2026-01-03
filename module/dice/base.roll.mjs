/** @import Roll from '@client/dice/roll.mjs*/

const { Roll } = foundry.dice;
const { renderTemplate } = foundry.applications.handlebars;

/**
 * Default roll class. Use it for building variations (like action roll,
 * complex roll etc.)
 */

/** @inheritdoc */
export default class DGNSRoll extends Roll {
  //----- STATIC -----//
  static CHAT_TEMPLATE = "systems/degenesisnext/templates/chat/action.roll.hbs";

  /** Parsing options  */
  constructor(rollDefinition, data, options = {}) {
    const { actionNumber = 0, difficulty = 0, modifiers = {} } = rollDefinition;
    const diceMod = modifiers.d || 0;
    const totalActionNumber = Math.max(0, actionNumber + diceMod);
    const rolledDice = Math.min(totalActionNumber, 12);
    const autoSuccesses = Math.max(0, totalActionNumber - 12);
    const formula = `${rolledDice}d6`;

    super(formula, data, options);

    this.definition = rollDefinition;
    this.actionNumber = totalActionNumber;
    this.rolledDice = rolledDice;
    this.autoSuccesses = autoSuccesses;
    this.difficulty = Number(difficulty);
    this.modifiers = rollDefinition.modifiers;
    this._outcome = null;
  }

  /* -------------------------------------------- */

  /**
   * Is the result of this roll a success? Returns `undefined` if roll isn't evaluated.
   * @type {boolean|void}
   */
  get sucess() {
    if (!this._evaluated) return;
    if (!Number.isNumeric(this.difficulty)) return false;
    return this.total >= this.difficulty;
  }

  /* -------------------------------------------- */

  /**
   * Is the result of this roll a failure? Returns `undefined` if roll isn't evaluated.
   * @type {boolean|void}
   */
  get failure() {
    if (!this._evaluated) return;
    if (!Number.isNumeric(this.options.difficulty)) return false;
    return this.total < this.difficulty;
  }

  /* -------------------------------------------- */

  /**
   * Is the result of this roll a botch? Returns `undefined` if roll isn't evaluated.
   * @type {boolean|void}
   */
  get botch() {
    if (!this._evaluated) return;
    if (!Number.isNumeric(this.options.difficulty)) return false;
    return this.total < this.difficulty;
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  async evaluate(options = {}) {
    //console.log(this);
    //console.log(options);
    await super.evaluate(options);
    this._evaluateSuccess();
    return this;
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  evaluateSync(options = {}) {
    return super.evaluateSync(options);
  }

  _evaluateSuccess() {
    this.successes =
      this.dice[0].results.filter((r) => r.result >= 4).length +
      this.modifiers.s +
      this.autoSuccesses;
    this.ones = this.dice[0].results.filter((r) => r.result === 1).length;
    this.triggers =
      this.dice[0].results.filter((r) => r.result === 6).length +
      this.modifiers.t;

    // Determine result state
    if (this.successes < this.ones) {
      this._outcome = "botch";
    } else if (this.successes >= this.difficulty) {
      this._outcome = "success";
    } else {
      this._outcome = "failure";
    }
  }

  /** Display result to chat  */
  async toMessage(messageData = {}, { rollMode = null, create = true } = {}) {
    rollMode = rollMode || game.settings.get("core", "rollMode");
    console.log(rollMode);
    const speaker = ChatMessage.getSpeaker();
    const chatData = {
      title: game.i18n.localize(`DGNS.ROLL.actionRoll`),
      attribute: game.i18n.localize(
        `DGNS.ATTRIBUTE.${this.definition.attribute}`
      ),
      skill: game.i18n.localize(`DGNS.SKILL.${this.definition.skill}`),
      difficulty: this.difficulty,
      successes: this.successes,
      triggers: this.triggers,
      ones: this.ones,
      dice: this.dice[0].results,
      result: this.result,
      resultLabel: game.i18n.localize(`DGNS.ROLL.${this.result}`),
    };

    const template = this.constructor.CHAT_TEMPLATE;
    const content = await renderTemplate(template, chatData);

    const messageOptions = foundry.utils.mergeObject(
      {
        user: game.user.id,
        style: CONST.CHAT_MESSAGE_STYLES
          ? CONST.CHAT_MESSAGE_STYLES.ROLL
          : undefined,
        content: content,
        rolls: [this],
        speaker: speaker,
        flags: {
          "core.rollMode": rollMode,
        },
      },
      messageData
    );

    ChatMessage.applyRollMode(messageOptions, rollMode);
    return create ? ChatMessage.create(messageOptions) : messageOptions;
  }

  //depracted
  // Override result getter
  get result() {
    return this._outcome || super.result;
  }

  static buildFormula() {}
}
