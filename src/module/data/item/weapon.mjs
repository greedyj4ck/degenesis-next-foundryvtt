import { BaseItemData } from "./_base.mjs";

import GeneralFields from "./partials/general.mjs";
import CombatFields from "./partials/combat.mjs";

export default class WeaponData extends BaseItemData {
  static _systemType = "weapon";

  static defineSchema() {
    return {
      ...super.defineSchema(), // all base items fields
      ...GeneralFields.equipped,
      ...GeneralFields.qualities,

      ...GeneralFields.slots,
      ...GeneralFields.resources,
      ...GeneralFields.cult,
      ...GeneralFields.weaponGroup, // group field with weaponOptions

      ...CombatFields.damage,
      //...CombatFields.damageBonus,
      ...CombatFields.handling,
      ...CombatFields.distance,
      //...CombatFields.magazine,
      ...CombatFields.ammunition,
      //...CombatFields.caliber,
      ...CombatFields.skills,
    };
  }
}
