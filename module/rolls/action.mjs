import DGNSRoll from "./base.mjs";

// standard action roll
export default class ActionRoll extends DGNSRoll {
  constructor(formula, data, options) {
    super(formula, data, options);
  }

  // default action chat template
  // static CHAT_TEMPLATE = systemPath("templates/rolls/action.hbs");
}
