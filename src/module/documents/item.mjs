import { WEAPON_GROUPS_SKILLS } from "../logic/config/items.mjs";
import { Qualities } from "../logic/quality.mjs";

export default class DGNSItem extends Item {
  /* -------------------------------------------------------------------------- */
  /*                                   Getters                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Return true if it is a weapon within melee range.
   */
  get isMelee() {
    console.log(`isMelee getter`);
    console.log(this);
    if (this.type === "weapon") {
      return WEAPON_GROUPS_SKILLS[this.system.group] == "projectiles" ||
        this.system.group == "sonic"
        ? false
        : true;
    }
  }
  get isRanged() {
    if (this.type === "weapon")
      return (
        WEAPON_GROUPS_SKILLS[this.system.group] == "projectiles" &&
        this.group != "sonic"
      );
  }

  get isSonic() {
    if ((this.type = "weapon")) return this.system.group == "sonic";
  }
}
