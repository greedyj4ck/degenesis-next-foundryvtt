import GeneralFields from "./partials/general.mjs";
import CombatFields from "./partials/combat.mjs";

export default class AmmunitionData extends foundry.abstract.TypeDataModel {
  static _systemType = "ammunition";

  static defineSchema() {
    return {
      ...GeneralFields.description,
      ...GeneralFields.quantity,
      ...GeneralFields.equipped,
      ...GeneralFields.tech,
      ...GeneralFields.value,
      ...CombatFields.damage,
    };
  }
}
