import { WEAPON_GROUPS_SKILLS } from "../logic/config/items.mjs";
import { Qualities, QUALITY_DEFINITIONS } from "../logic/quality.mjs";

import { EffectHelper } from "../utils/effect.helper.mjs";

export default class DGNSItem extends Item {
  /* -------------------------------------------------------------------------- */
  /*                                  Qualities                                 */
  /* -------------------------------------------------------------------------- */

  async _manageQualities(
    action,
    qualityKey = null,
    field = null,
    value = null
  ) {
    console.log(
      `Manage quality fired. ${action} | ${qualityKey} | ${field} | ${value}|`
    );

    if (!qualityKey) return;

    switch (action) {
      case "toggle":
        return this._toggleQuality(qualityKey);
      case "update":
        return this._updateQuality(qualityKey, field, value);
    }
  }

  async _toggleQuality(qualityKey) {
    if (!qualityKey) return;

    // find current qualities
    const quality = this.system.qualities.find((q) => q.key === qualityKey);

    let qualities = {};

    // create new one if do not exist
    if (quality) {
      const newState = !quality.enabled;
      qualities = this.system.qualities.map((q) =>
        q.key === qualityKey ? { ...q, enabled: newState } : q
      );
    } else {
      const defaultValues = {};

      const definition = QUALITY_DEFINITIONS[qualityKey];
      definition.inputs?.forEach((i) => (defaultValues[i.name] = i.default));
      qualities = [
        ...this.system.qualities,
        {
          key: qualityKey,
          enabled: true,
          values: defaultValues,
        },
      ];
    }

    await this.update({ "system.qualities": qualities });

    /*     if (definition?.activeEffects) {
      if (newState) await this._applyQualityEffects(definition, qualityKey);
      else await this._removeQualityEffects(qualityKey);
    } */
  }

  async _updateQuality(qualityKey, field, value) {
    if (!qualityKey || !field || !value) return;

    const qualities = this.system.qualities.map((q) => {
      if (q.key !== qualityKey) return q;

      return {
        ...q,
        values: { ...q.values, [field]: value },
      };
    });

    return this.update({ "system.qualities": qualities });
  }

  /* ------------------------------ ActiveEffects ----------------------------- */

  /**
   * Preparing ActiveEffects for sheet.
   * @returns
   */
  async _prepareEffects() {
    return await EffectHelper._prepareEffects(this);
  }
  /* -------------------------------------------------------------------------- */

  /**
   * Handling effects for Item.
   * @param {*} action
   * @param {*} effectId
   * @returns
   */

  async _manageEffect(action, effectId = null) {
    return await EffectHelper._manageEffect(this, action, effectId);
  }

  /* -------------------------------------------------------------------------- */
  /**
   * Helper function for creating new effect.
   * @returns
   */
  async _onCreateEffect() {
    return await EffectHelper._onCreateEffect(this);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Getters                                  */
  /* -------------------------------------------------------------------------- */

  /**
   * Return true if it is a weapon within melee range.
   */
  get isMelee() {
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
