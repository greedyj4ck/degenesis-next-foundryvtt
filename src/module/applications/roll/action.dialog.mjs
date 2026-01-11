/** @import HandlebarsApplicationMixin from '@client/applications/api/handlebars-application.mjs*/

import DGNSRoll from "../../dice/base.roll.mjs";

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
const { FormDataExtended } = foundry.applications.ux;

// default action roll dialog
/** @inheritdoc */
export default class DGNSActionRollDialog extends HandlebarsApplicationMixin(
  ApplicationV2
) {
  constructor(rollConfig, options = {}) {
    super(rollConfig, options);
    this._actor = rollConfig.actor;
    this._rollDefinition = foundry.utils.mergeObject(
      this._rollDefinition,
      rollConfig.definiton
    );
  }

  _rollDefinition = {
    attribute: null,
    skill: null,
    actionNumber: null,
    difficulty: 0,
    modifiers: {
      d: 0,
      s: 0,
      t: 0,
    },
  };

  static DEFAULT_OPTIONS = {
    tag: "form",

    classes: ["dgns-roll"],
    actions: {
      manageDifficulty: this.#onManageDifficulty,
      execute: this.#submitHandler,
    },

    form: {
      //handler: DGNSActionRollDialog.#submitHandler,
      submitOnChange: false,
      closeOnSubmit: false,
    },

    position: {
      width: 450,
      height: 550,
    },
    timeout: null,

    window: {
      resizable: true,
      frame: true,
    },
  };

  static PARTS = {
    rollDialog: {
      template: "systems/degenesisnext/templates/rolls/roll.action.dialog.hbs",
      templates: [
        "systems/degenesisnext/templates/rolls/partials/roll.action.hbs",
        "systems/degenesisnext/templates/rolls/partials/roll.configuration.hbs",
        "systems/degenesisnext/templates/rolls/partials/roll.effects.hbs",
        "systems/degenesisnext/templates/rolls/partials/roll.summary.hbs",
        "systems/degenesisnext/templates/rolls/partials/roll.buttons.hbs",
      ],
    },
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    context.attribute = this._rollDefinition.attribute;
    context.skill = this._rollDefinition.skill;

    /** Universal structure for all type of rolls (passing  prefix
     * to differentiatie in case of multiple roll).
     */

    context.roll = context.roll = {
      ...this._rollDefinition,
      prefix: "roll",
      totals: {
        dice: this.getTotalDice("roll"),
        successes: this.getTotalSuccesses("roll"),
        triggers: this.getTotalTriggers("roll"),
      },
    };

    return context;
  }

  get title() {
    return game.i18n.localize(`DGNS.ROLL.action`);
  }

  /**
   * Factory method for asynchronous behavior.
   * @param {object} options            Application rendering options.
   * @returns {Promise<object|null>}    A promise that resolves to the form data, or `null`
   *                                    if the application was closed without submitting.
   */

  static async create(rollConfig, options) {
    const { promise, resolve } = Promise.withResolvers();
    const application = new this(rollConfig, options);
    application.addEventListener("close", () => resolve(application.config), {
      once: true,
    });
    application.render({ force: true, zIndex: 500000000 });
    return promise;
  }

  _onChangeForm(formConfig, event) {
    super._onChangeForm(formConfig, event);

    const formElement = event.target.form;
    const formData = new FormDataExtended(formElement).object;
    const expanded = foundry.utils.expandObject(formData);

    foundry.utils.mergeObject(this._rollDefinition, expanded.roll);

    if (this._rollDefinition.difficulty !== undefined) {
      this._rollDefinition.difficulty = Math.clamp(
        this._rollDefinition.difficulty,
        1,
        12
      );
    }
    this.render();
  }

  static #onManageDifficulty(event, target) {
    const prefix = target.dataset.prefix;
    const method = target.dataset.method;
    const targetData =
      prefix === "roll" ? this._rollDefinition : this._rollDefinition[prefix];

    if (method === "increaseDifficulty" && targetData.difficulty < 12) {
      targetData.difficulty++;
    } else if (method === "decreaseDifficulty" && targetData.difficulty > 0) {
      targetData.difficulty--;
    } else {
      return;
    }
    this.render();
  }

  // *----- Helpers Functions ----*

  _getRollData(prefix) {
    if (prefix === "roll" || !this._rollDefinition.primary) {
      return this._rollDefinition;
    }
    return this._rollDefinition[prefix];
  }

  getTotalDice(prefix = "roll") {
    const data = this._getRollData(prefix);
    return (Number(data.actionNumber) || 0) + (Number(data.modifiers?.d) || 0);
  }

  getTotalSuccesses(prefix = "roll") {
    const data = this._getRollData(prefix);
    return (Number(data.successes) || 0) + (Number(data.modifiers?.s) || 0);
  }

  getTotalTriggers(prefix = "roll") {
    const data = this._getRollData(prefix);
    return (Number(data.triggers) || 0) + (Number(data.modifiers?.t) || 0);
  }

  // *----- Main Methods -----*

  async preformRoll() {
    const roll = new DGNSRoll(this._rollDefinition);
    await roll.evaluate();
    roll.toMessage();
    this.close();
  }

  /** Submit Handler  */
  static async #submitHandler(event, form, formData) {
    this.preformRoll(this.roll);
  }
}
