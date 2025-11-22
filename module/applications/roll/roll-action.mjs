const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

// default action roll dialog
export default class DGNSActionRollDialog extends HandlebarsApplicationMixin(
  ApplicationV2
) {
  constructor(object, options = {}) {
    super(object, options);
    console.log(`Constructor for DGNSActionRollDialog`);
    console.log(options);
  }

  _rollDefinition = {
    difficulty: 1,
    addD: 0,
    addS: 0,
    addT: 0,
  };

  static DEFAULT_OPTIONS = {
    classes: ["dgns-roll"],
    actions: {
      increaseDifficulty: this.#increaseDifficulty,
      decreaseDifficulty: this.#decreaseDifficulty,
    },

    form: {
      //handler: DGNSActionRollDialog.#submitHandler,
      submitOnChange: false,
      closeOnSubmit: false,
    },

    position: {
      width: 450,
      height: 500,
    },
    timeout: null,
    tag: "form",

    window: {
      resizable: true,
      frame: true,
      /* controls: [
        {
          // font awesome icon
          icon: "fa-solid fa-triangle-exclamation",
          // string that will be run through localization
          label: "Bar",
          // string that MUST match one of your `actions`
          action: () => {
            console.log(`Window control`);
          },
        },
      ], */
    },
  };

  static PARTS = {
    /*  header: {
      template: "systems/degenesisnext/templates/rolls/roll.header.hbs",
    }, */
    roll: {
      template: "systems/degenesisnext/templates/rolls/roll.action.hbs",
    },
    configuration: {
      template: "systems/degenesisnext/templates/rolls/roll.configuration.hbs",
    },
    effects: {
      template: "systems/degenesisnext/templates/rolls/roll.effects.hbs",
    },
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    context.header = "ROLL";
    context.skill = this.options.skill;
    context.roll = this._rollDefinition;

    return context;
  }

  get title() {
    return `Action Roll`;
  }

  /**
   * Factory method for asynchronous behavior.
   * @param {object} options            Application rendering options.
   * @returns {Promise<object|null>}    A promise that resolves to the form data, or `null`
   *                                    if the application was closed without submitting.
   */

  static async create(options) {
    console.log(`create options`);
    console.log(options);

    const { promise, resolve } = Promise.withResolvers();
    const application = new this(options);
    application.addEventListener("close", () => resolve(application.config), {
      once: true,
    });
    application.render({ force: true, zIndex: 500000000 });
    return promise;
  }

  static async #submitHandler(event, form, formData) {
    console.log(event);

    console.log(event, form, formData);
  }

  static #increaseDifficulty() {
    this._rollDefinition.difficulty += 1;
  }

  static #decreaseDifficulty() {
    this._rollDefinition.difficulty += 1;
  }
}
