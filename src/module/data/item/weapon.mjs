import { BaseItemData } from "./_base.mjs";

import { Combat } from "../../logic/combat.logic.mjs";
import { Items } from "../../logic/item.logic.mjs";

import GeneralFields from "./partials/general.mjs";
import CombatFields from "./partials/combat.mjs";

export default class WeaponData extends BaseItemData {
  static _systemType = "weapon";

  static defineSchema() {
    return {
      ...super.defineSchema(), // all base items fields
      ...GeneralFields.equipped,
      ...GeneralFields.qualities,
      ...GeneralFields.modifications,
      //...GeneralFields.slots, // moved to modifications structure
      ...GeneralFields.resources,
      ...GeneralFields.cult,
      ...GeneralFields.weaponGroup, // group field with weaponOptions

      ...CombatFields.damage,
      ...CombatFields.handling,
      ...CombatFields.distance,
      ...CombatFields.ammunition,
      ...CombatFields.skills,
    };
  }

  prepareDerivedData() {
    const def = Items.weapons[this.group];
    if (def?.skills) {
      this.skills = {
        primary: def.skills.primary ?? "",
        secondary: def.skills.secondary ?? "",
      };
    }
  }

  /* ---------------------------------- */

  /**
   * Helper to resolve skills for weapon.
   * @param {*} group
   * @param {*} stored
   * @param {*} groups
   * @returns
   */

  /* ------------- Getters ------------ */
  get rollOptions() {
    return Combat.Actions[this.category];
  }

  /* ------- Custom weapon group ------ */
  get isCustom() {
    return this.group === "custom";
  }

  get resolvedSkills() {
    return this.resolveSkills(this.group, this.skills);
  }
}
