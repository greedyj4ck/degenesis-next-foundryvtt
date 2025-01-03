import GeneralFields from "./partials/general.mjs";
import CombatFields from "./partials/combat.mjs";
export default class WeaponData extends foundry.abstract.TypeDataModel {
  static _systemType = "weapon";

  static defineSchema() {
    return {
      ...GeneralFields.description,
      ...GeneralFields.equipped,
      ...GeneralFields.quantity,
      ...GeneralFields.qualities,
      ...GeneralFields.encumbrance,
      ...GeneralFields.tech,
      ...GeneralFields.slots,
      ...GeneralFields.value,
      ...GeneralFields.resources,
      ...GeneralFields.cult,
      ...GeneralFields.group,

      ...CombatFields.damage,
      ...CombatFields.damageBonus,
      ...CombatFields.handling,
      ...CombatFields.distance,
      ...CombatFields.magazine,
      ...CombatFields.skills,
    };
  }
}
