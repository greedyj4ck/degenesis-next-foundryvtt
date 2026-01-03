import DGNSRoll from "../../dice/base.roll.mjs";
import DGNSCombinationRoll from "../../dice/combination.roll.mjs";

const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
const { FormDataExtended } = foundry.applications.ux;

// default action roll dialog
/** @inheritdoc */

export default class DGNSCombinationRollDialog extends HandlebarsApplicationMixin(
  ApplicationV2
) {
  constructor(rollConfig, options = {}) {
    super(rollConfig, options);

    console.log(rollConfig);

    this._actor = rollConfig.actor;

    this._rollDefinition = foundry.utils.mergeObject(
      this._rollDefinition,
      rollConfig.definiton
    );
  }

  _rollDefinition = {
    primary: {
      attribute: null,
      skill: null,
      actionNumber: null,
      difficulty: 1,
      modifiers: { d: 0, s: 0, t: 0 },
    },
    secondary: {
      attribute: null,
      skill: null,
      actionNumber: null,
      difficulty: 1,
      modifiers: { d: 0, s: 0, t: 0 },
    },
  };

  static DEFAULT_OPTIONS = {
    tag: "form",

    classes: ["dgns-roll", "combination-roll"],
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
      width: 700,
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
      template:
        "systems/degenesisnext/templates/rolls/roll.combination.dialog.hbs",
      templates: [
        "systems/degenesisnext/templates/rolls/partials/roll.combination.hbs",
        "systems/degenesisnext/templates/rolls/partials/roll.configuration.hbs",
        "systems/degenesisnext/templates/rolls/partials/roll.effects.hbs",
        "systems/degenesisnext/templates/rolls/partials/roll.summary.hbs",
        "systems/degenesisnext/templates/rolls/partials/roll.buttons.hbs",
      ],
    },
  };

  async _prepareContext(options) {
    const context = await super._prepareContext(options);

    const skills = this._prepareSkills();
    const skillMap = {};
    skills.forEach((s) => {
      skillMap[s.id] = s.label;
    });

    (context.primary = {
      ...this._rollDefinition.primary,
      skills: skillMap,
      totals: {
        dice: this.getTotalDice("primary"),
        successes: this.getTotalSuccesses("primary"),
        triggers: this.getTotalTriggers("primary"),
      },
    }),
      (context.secondary = {
        ...this._rollDefinition.secondary,
        skills: skillMap,
        totals: {
          dice: this.getTotalDice("secondary"),
          successes: this.getTotalSuccesses("secondary"),
          triggers: this.getTotalTriggers("secondary"),
        },
      });

    context.roll = this._rollDefinition;

    console.log(context);
    return context;
  }

  _onChangeForm(formConfig, event) {
    super._onChangeForm(formConfig, event);

    const formElement = event.target.form;
    const formData = new FormDataExtended(formElement).object;
    const expanded = foundry.utils.expandObject(formData);

    for (let prefix of ["primary", "secondary", "roll"]) {
      const skillKey = formData[`${prefix}.skill`];
      const target =
        prefix === "roll" ? this._rollDefinition : this._rollDefinition[prefix];

      // Jeśli w tej kolumnie wybrano umiejętność
      if (target && skillKey) {
        const actorSystem = this._actor.system;
        let foundAttrKey = null;
        let skillValue = 0;
        let attrValue = 0;

        // Szukamy w którym atrybucie siedzi ten skill (zagnieżdżona struktura)
        for (let [aKey, aData] of Object.entries(actorSystem.attributes)) {
          if (aData.skills && aData.skills[skillKey]) {
            foundAttrKey = aKey;
            attrValue = aData.value || 0;
            skillValue = aData.skills[skillKey].value || 0;
            break;
          }
        }

        if (foundAttrKey) {
          // Zapisujemy zmiany w pamięci Dialogu
          target.skill = skillKey;
          target.attribute = foundAttrKey;
          target.actionNumber = attrValue + skillValue;
        }
      } else if (target && skillKey === "") {
        // Jeśli gracz zresetował wybór na "—"
        target.actionNumber = 0;
        target.skill = "";
      }
    }

    foundry.utils.mergeObject(this._rollDefinition, expanded, {
      insertKeys: true,
      overwrite: true,
    });

    if (this._rollDefinition.primary.difficulty !== undefined) {
      this._rollDefinition.primary.difficulty = Math.clamp(
        this._rollDefinition.primary.difficulty,
        1,
        12
      );
    }

    if (this._rollDefinition.secondary.difficulty !== undefined) {
      this._rollDefinition.secondary.difficulty = Math.clamp(
        this._rollDefinition.secondary.difficulty,
        1,
        12
      );
    }

    this.render();
  }

  static async create(rollConfig, options) {
    const { promise, resolve } = Promise.withResolvers();
    const application = new this(rollConfig, options);
    application.addEventListener("close", () => resolve(application.config), {
      once: true,
    });
    application.render({ force: true, zIndex: 500000000 });
    return promise;
  }

  get title() {
    return game.i18n.localize(`DGNS.ROLL.combination`);
  }

  static #onManageDifficulty(event, target) {
    console.log(target);
    const prefix = target.dataset.prefix;
    const method = target.dataset.method;
    console.log(prefix);

    const targetData =
      prefix === "roll" ? this._rollDefinition : this._rollDefinition[prefix];

    console.log(targetData);

    if (method === "increaseDifficulty" && targetData.difficulty < 12) {
      targetData.difficulty++;
    } else if (method === "decreaseDifficulty" && targetData.difficulty > 1) {
      targetData.difficulty--;
    } else {
      return;
    }
    this.render();
  }

  // *----- Helpers Functions ----*

  /**
   * Preparing skills array for select controls.
   * @returns
   */
  _prepareSkills() {
    const actorSystem = this._actor.system;
    const PrimalFocus = actorSystem.PrimalOrFocus;
    const FaithWillpower = actorSystem.FaithOrWillpower;

    const skills = [];
    for (let [attrKey, attrData] of Object.entries(actorSystem.attributes)) {
      // 2. Iterujemy po skillach zagnieżdżonych w danym atrybucie
      if (attrData.skills) {
        for (let [skillKey, skillData] of Object.entries(attrData.skills)) {
          // 3. Filtrowanie na podstawie Twoich helperów
          if (
            ["primal", "focus"].includes(skillKey) &&
            skillKey !== PrimalFocus
          )
            continue;
          if (
            ["faith", "willpower"].includes(skillKey) &&
            skillKey !== FaithWillpower
          )
            continue;

          skills.push({
            id: skillKey,
            label: `${game.i18n.localize(
              `DGNS.ATTRIBUTE.${attrKey}`
            )} + ${game.i18n.localize(`DGNS.SKILL.${skillKey}`)}`,
            attribute: attrKey,
          });
        }
      }
    }
    return skills;
  }

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

  async preformRoll() {
    const roll = new DGNSCombinationRoll(this._rollDefinition);
    await roll.evaluate();
    roll.toMessage();
    this.close();
  }

  /** Submit Handler  */
  static async #submitHandler(event, form, formData) {
    this.preformRoll(this.roll);
  }
}
