/**
 * @typedef {Object} Quality
 * @property {string} label  Displayed name.
 * @property {string} description  Displayed description.
 * @property {string} category Passive / active / special.
 * todo:finish jsdoc
 */

export class Qualities {
  constructor() {}

  // *---- Getters ---- *

  get weapon() {
    return Object.entries(QUALITY_DEFINITIONS)
      .filter(([key, def]) => def.itemTypes.includes("weapon"))
      .map(([key, def]) => ({ key, ...def }));
  }

  get armor() {
    return Object.entries(QUALITY_DEFINITIONS)
      .filter(([key, def]) => def.itemTypes.includes("armor"))
      .map(([key, def]) => ({ key, ...def }));
  }

  get agent() {
    return Object.entries(QUALITY_DEFINITIONS)
      .filter(([key, def]) => def.itemTypes.includes("agent"))
      .map(([key, def]) => ({ key, ...def }));
  }

  get all() {
    return QUALITY_DEFINITIONS.map(([key, def]) => ({ key, ...def }));
  }

  // *---- Helpers ----*
  /**
   * Getting all qualities for specific item type.
   * @param {string} itemType Item document type (weapon, armor etc.)
   * @returns
   */
  forItemType(itemType) {
    return Object.entries(QUALITY_DEFINITIONS)
      .filter(([key, def]) => def.itemTypes.includes(itemType))
      .map(([key, def]) => ({ key, ...def }));
  }
}

// *---- Main Qualities definitions ---*

const InputDifficulty = {
  name: difficulty,
  label: "DGNS.Difficulty",
  type: Number,
  default: 1,
};

const InputAngle = {
  name: angle,
  label: "DGNS.Angle",
  type: Number,
  default: 45,
};

const InputRadius = {
  name: radius,
  label: "DGNS.Radius",
  type: Number,
  default: 2,
};

const InputTime = {
  name: time,
  label: "DGNS.Time",
  type: Number,
  default: 1,
};

const InputDamage = {
  name: damage,
  label: "DGNS.Damage",
  type: Number,
  default: 1,
};

/**
 * List of all qualities.
 * @type {Object<string, Quality>}
 */
export const QUALITY_DEFINITIONS = {
  areaDamage: {
    label: "DGNS.QUALITY.AreaDamage.Name",
    description: "DGNS.Quality.AreaDamage.Description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [InputAngle],
    chatButtons: null,
    onItemUse: null,
    onPreRoll: null,
    onPostRoll: null,
    activeEffects: null,
  },
  armorPiercing: {
    label: "DGNS.QUALITY.ArmorPiercing.Name",
    description: "DGNS.Quality.ArmorPiercing.Description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [],
    chatButtons: null,
    onItemUse: null,
    onPreRoll: null,
    onPostRoll: null,
    activeEffects: () => {
      return [
        {
          label: "DGNS.QUALITY.ArmorPiercing.Name",
          key: "system.flags.armorPiercing",
          value: true,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
        },
      ];
    },
  },
  biometricallyEncoded: {
    label: "DGNS.QUALITY.BiometricallyEncoded.Name",
    description: "DGNS.Quality.BiometricallyEncoded.Description",
    category: "active",
    itemTypes: ["weapon"],
    inputs: [InputDifficulty],
    chatButtons: null,
    onItemUse: null,
    onPreRoll: null,
    onPostRoll: null,
    activeEffects: null,
  },
  blunt: {
    label: "DGNS.QUALITY.Blunt.Name",
    description: "DGNS.Quality.Blunt.Description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [],
    chatButtons: null,
    onItemUse: null,
    onPreRoll: null,
    onPostRoll: null,
    activeEffects: () => {
      return [
        {
          label: "DGNS.QUALITY.Blunt.Name",
          key: "system.flags.blunt",
          value: true,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
        },
      ];
    },
  },
  camo: {
    label: "DGNS.QUALITY.Camo.Name",
    description: "DGNS.Quality.Camo.Description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [InputDifficulty],
    chatButtons: null,
    onItemUse: null,
    onPreRoll: null,
    onPostRoll: null,
    activeEffects: null,
  },
  cloud: {
    label: "DGNS.QUALITY.Cloud.Name",
    description: "DGNS.Quality.Cloud.Description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [InputRadius, InputTime],
    chatButtons: null,
    onItemUse: null,
    onPreRoll: null,
    onPostRoll: null,
    activeEffects: null,
  },
  dazed: {
    label: "DGNS.QUALITY.Dazed.Name",
    description: "DGNS.Quality.Dazed.Description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [InputDamage],
    chatButtons: null,
    onItemUse: null,
    onPreRoll: null,
    onPostRoll: null,
    activeEffects: null,
  },
  deviation: {
    label: "DGNS.QUALITY.Deviation.Name",
    description: "DGNS.Quality.Deviation.Description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [],
    chatButtons: null,
    onItemUse: null,
    onPreRoll: null,
    onPostRoll: async (rollResult) => {
      const isSuccess = rollResult.isSucess;
      const formula = isSuccess ? "1d6" : "2d6";
      const roll = await new Roll(formula).evaluate();
      const baseDistance = roll.total;
      const finalDistance = isSuccess
        ? Math.max(0, baseDistance - rollResult.triggers)
        : baseDistance;
      return { distance: finalDistance }; //todo: change to chat message later
    },
    activeEffects: null,
  },
};
