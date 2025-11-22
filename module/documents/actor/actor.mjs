import DGNSActionRollDialog from "../../applications/roll/roll-action.mjs";

export default class DegenesisActor extends Actor {
  /** Test action roll function */
  async actionRoll(skill) {
    let config = await DGNSActionRollDialog.create({ skill: skill });
    return config;
  }
}
