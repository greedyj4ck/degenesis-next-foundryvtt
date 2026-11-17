import DGNSActionRollDialog from "./action.dialog.mjs";

export default class DGNSWeaponRollDialog extends DGNSActionRollDialog {
  constructor(rollConfig, options = {}) {
    super(rollConfig, options);
    this._weapon = rollConfig.weapon;

    console.log(this);
  }
  get title() {
    return this._weapon.name;
  }
}
