/** @import HandlebarsApplicationMixin from '@client/applications/api/handlebars-application.mjs*/

import { DicePool } from "../../logic/dicepool.logic.mjs";

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
const { FormDataExtended } = foundry.applications.ux;
const { deepClone } = foundry.utils;

/**
 * Application: Action roll dialog
 * Used for setting up data for rolls. Main execution still lies within
 * Actor document - need to be set up this way due to future data inheritance
 * and automation systems.
 */

/** @inheritdoc */
export default class DGNSActionRollDialog extends HandlebarsApplicationMixin(
  ApplicationV2,
) {
  constructor(rollConfig, options = {}) {
    super(rollConfig, options);
    this._actor = rollConfig.actor;
    this._rollDefinition = foundry.utils.mergeObject(
      this._rollDefinition,
      rollConfig.definition,
    );
    /* ---------------------------------- */
    // incorporating possibility of building action dialogs with options for attack, defense, parrying etc.
    /* ---------------------------------- */
    this._actions = rollConfig.actions ?? [];
    this._action = this._actions[0]?.key;
    /* ---------------------------------- */
  }

  // Template for roll definition
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
      /* ---------------------------------- */
      selectAction: this.#onSelectAction,
    },

    form: {
      //handler: DGNSActionRollDialog.#submitHandler,
      submitOnChange: false,
      closeOnSubmit: false,
    },

    position: {
      width: 450,
      height: "auto",
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
        "systems/degenesisnext/templates/rolls/partials/roll.actions.hbs",
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

    // Preparing options
    // todo: move to helper function to clean up the code ?
    /* ---------------------------------- */
    context.actions = this._actions.map((a) => {
      const { actionNumber, modifiers } = a.definition.primary ?? a.definition; // a combination uses its primary part
      return {
        key: a.key,
        label: a.label,
        active: a.key === this._action,
        dice: DicePool.resolve(actionNumber, modifiers).rolledDice,
      };
    });
    /* ---------------------------------- */

    /** Universal structure for all type of rolls (passing  prefix
     * to differentiatie in case of multiple roll).
     */

    context.roll = {
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

  /* ---------------------------------- */

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
        12,
      );
    }
    this.render();
  }

  /* ---------------------------------- */
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

  /**
   * Handling selecting the actino o
   * @param {*} event
   * @param {*} target
   */
  static #onSelectAction(event, target) {
    const action = this._actions.find((a) => a.key === target.dataset.key);
    this._action = action.key;
    foundry.utils.mergeObject(
      this._rollDefinition,
      foundry.utils.deepClone(action.definition),
    );
    this.render();
  }

  /* --- Option Rolls implementation -- */

  _applyOption(key) {
    const option = this._options.find((o) => o.key === key);
    if (!option) return;
    this._selected = key;
    foundry.utils.mergeObject(this._rollDefinition, option.definition);
  }

  /* ---------------------------------- */

  // *----- Helpers Functions ----*

  _getRollData(prefix) {
    if (prefix === "roll" || !this._rollDefinition.primary) {
      return this._rollDefinition;
    }
    return this._rollDefinition[prefix];
  }

  getTotalDice(prefix = "roll") {
    const data = this._getRollData(prefix);
    return DicePool.resolve(data.actionNumber, data.modifiers).rolledDice;
  }

  getAutoSuccesses(prefix = "roll") {
    const data = this._getRollData(prefix);
    return DicePool.resolve(data.actionNumber, data.modifiers).autoSuccesses;
  }

  getTotalSuccesses(prefix = "roll") {
    const data = this._getRollData(prefix);
    const { autoSuccesses } = DicePool.resolve(
      data.actionNumber,
      data.modifiers,
    );
    return autoSuccesses + (Number(data.modifiers?.s) || 0);
  }

  getTotalTriggers(prefix = "roll") {
    const data = this._getRollData(prefix);
    return (Number(data.triggers) || 0) + (Number(data.modifiers?.t) || 0);
  }

  /* ---------------------------------- */
  /*           Roll execution           */
  /* ---------------------------------- */

  async preformRoll() {
    this.config = deepClone(this._rollDefinition);
    this.close();
  }

  static async #submitHandler(event, form, formData) {
    this.preformRoll();
  }
}
