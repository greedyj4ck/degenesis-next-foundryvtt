import * as Inputs from "./config/inputs.mjs";

/**
 * List of all qualities.
 * @type {Object<string, QUALITY>}
 */
export const QUALITY_DEFINITIONS = {
  // Weapon Qualities
  areaDamage: {
    label: "DGNS.QUALITY.areaDamage.name",
    description: "DGNS.QUALITY.areaDamage.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [Inputs.InputAngle],
    chatButtons: null,
    onItemUse: null,
    onPreRoll: null,
    onPostRoll: null,
    activeEffects: null,
  },
  armorPiercing: {
    label: "DGNS.QUALITY.armorPiercing.name",
    description: "DGNS.QUALITY.armorPiercing.description",
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
          label: "DGNS.QUALITY.armorPiercing.name",
          key: "system.flags.armorPiercing",
          value: true,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
        },
      ];
    },
  },
  biometricallyEncoded: {
    label: "DGNS.QUALITY.biometricallyEncoded.name",
    description: "DGNS.QUALITY.biometricallyEncoded.description",
    category: "active",
    itemTypes: ["weapon"],
    inputs: [Inputs.InputDifficulty],
    chatButtons: null,
    onItemUse: null,
    onPreRoll: null,
    onPostRoll: null,
    activeEffects: null,
  },
  blunt: {
    label: "DGNS.QUALITY.blunt.name",
    description: "DGNS.QUALITY.blunt.description",
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
          label: "DGNS.QUALITY.blunt.name",
          key: "system.flags.blunt",
          value: true,
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE,
        },
      ];
    },
  },
  camo: {
    label: "DGNS.QUALITY.camo.name",
    description: "DGNS.QUALITY.camo.description",
    category: "passive",
    itemTypes: ["weapon", "armor"],
    inputs: [Inputs.InputDifficulty],
    chatButtons: null,
    onItemUse: null,
    onPreRoll: null,
    onPostRoll: null,
    activeEffects: null,
  },
  cloud: {
    label: "DGNS.QUALITY.cloud.name",
    description: "DGNS.QUALITY.cloud.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [Inputs.InputRadius, Inputs.InputTime],
    chatButtons: null,
    onItemUse: null,
    onPreRoll: null,
    onPostRoll: null,
    activeEffects: null,
  },
  dazed: {
    label: "DGNS.QUALITY.dazed.name",
    description: "DGNS.QUALITY.dazed.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [Inputs.InputDamage],
    chatButtons: null,
    onItemUse: null,
    onPreRoll: null,
    onPostRoll: null,
    activeEffects: null,
  },
  deviation: {
    label: "DGNS.QUALITY.deviation.name",
    description: "DGNS.QUALITY.deviation.description",
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
  doubleBarreled: {
    label: "DGNS.QUALITY.doubleBarreled.name",
    description: "DGNS.QUALITY.doubleBarreled.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [],
  },
  entangled: {
    label: "DGNS.QUALITY.entangled.name",
    description: "DGNS.QUALITY.entangled.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [Inputs.InputPenalty],
  },
  explosive: {
    label: "DGNS.QUALITY.explosive.name",
    description: "DGNS.QUALITY.explosive.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [],
  },
  fatal: {
    label: "DGNS.QUALITY.fatal.name",
    description: "DGNS.QUALITY.fatal.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [],
  },
  fireHazardous: {
    label: "DGNS.QUALITY.fireHazardous.name",
    description: "DGNS.QUALITY.fireHazardous.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [],
  },
  fragile: {
    label: "DGNS.QUALITY.fragile.name",
    description: "DGNS.QUALITY.fragile.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [],
  },
  impact: {
    label: "DGNS.QUALITY.impact.name",
    description: "DGNS.QUALITY.impact.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [Inputs.InputTrigger],
  },
  jamming: {
    label: "DGNS.QUALITY.jamming.name",
    description: "DGNS.QUALITY.jamming.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [],
  },
  muzzleLoader: {
    label: "DGNS.QUALITY.muzzleLoader.name",
    description: "DGNS.QUALITY.muzzleLoader.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [],
  },
  outOfControl: {
    label: "DGNS.QUALITY.outOfControl.name",
    description: "DGNS.QUALITY.outOfControl.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [Inputs.InputDifficulty],
  },
  piercing: {
    label: "DGNS.QUALITY.piercing.name",
    description: "DGNS.QUALITY.piercing.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [Inputs.InputArmorRating],
  },
  salvoes: {
    label: "DGNS.QUALITY.salvoes.name",
    description: "DGNS.QUALITY.salvoes.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [Inputs.InputRounds],
  },
  scatter: {
    label: "DGNS.QUALITY.scatter.name",
    description: "DGNS.QUALITY.scatter.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [],
  },
  sensitive: {
    label: "DGNS.QUALITY.sensitive.name",
    description: "DGNS.QUALITY.sensitive.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [],
  },
  smoothRunning: {
    label: "DGNS.QUALITY.smoothRunning.name",
    description: "DGNS.QUALITY.smoothRunning.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [Inputs.InputTrigger],
  },
  special: {
    label: "DGNS.QUALITY.special.name",
    description: "DGNS.QUALITY.special.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [],
  },
  specialDamage: {
    label: "DGNS.QUALITY.specialDamage.name",
    description: "DGNS.QUALITY.specialDamage.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [Inputs.InputEnemyType, Inputs.InputDamage],
  },
  standard: {
    label: "DGNS.QUALITY.standard.name",
    description: "DGNS.QUALITY.standard.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [Inputs.InputBonus],
  },
  talisman: {
    label: "DGNS.QUALITY.talisman.name",
    description: "DGNS.QUALITY.talisman.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [Inputs.InputBonus],
  },
  terrifying: {
    label: "DGNS.QUALITY.terrifying.name",
    description: "DGNS.QUALITY.terrifying.description",
    category: "passive",
    itemTypes: ["weapon", "armor"],
    inputs: [Inputs.InputDifficulty],
  },
  thunderStrike: {
    label: "DGNS.QUALITY.thunderStrike.name",
    description: "DGNS.QUALITY.thunderStrike.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [],
  },
  extendedReload: {
    label: "DGNS.QUALITY.extendedReload.name",
    description: "DGNS.QUALITY.extendedReload.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [Inputs.InputTime],
  },
  gruesome: {
    label: "DGNS.QUALITY.gruesome.name",
    description: "DGNS.QUALITY.gruesome.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [Inputs.InputRating],
  },
  stun: {
    label: "DGNS.QUALITY.stun.name",
    description: "DGNS.QUALITY.stun.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [Inputs.InputRating],
  },
  panic: {
    label: "DGNS.QUALITY.panic.name",
    description: "DGNS.QUALITY.panic.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [Inputs.InputRating],
  },
  singleLoader: {
    label: "DGNS.QUALITY.singleLoader.name",
    description: "DGNS.QUALITY.singleLoader.description",
    category: "passive",
    itemTypes: ["weapon"],
    inputs: [Inputs.InputRounds],
  },

  // Agent qualities
  poisoned: {
    label: "DGNS.QUALITY.poisoned.name",
    description: "DGNS.QUALITY.poisoned.description",
    category: "passive",
    itemTypes: ["agent"],
    inputs: [Inputs.InputPotency, Inputs.InputEffect, Inputs.InputDuration],
  },
  attractant: {
    label: "DGNS.QUALITY.attractant.name",
    description: "DGNS.QUALITY.attractant.description",
    category: "passive",
    itemTypes: ["agent"],
    inputs: [Inputs.InputTarget],
  },
  narcotic: {
    label: "DGNS.QUALITY.narcotic.name",
    description: "DGNS.QUALITY.narcotic.description",
    category: "passive",
    itemTypes: ["agent"],
    inputs: [Inputs.InputPotency, Inputs.InputDamage],
  },
  pseudoDesporeing: {
    label: "DGNS.QUALITY.pseudoDesporeing.name",
    description: "DGNS.QUALITY.pseudoDesporeing.description",
    category: "passive",
    itemTypes: ["agent"],
    inputs: [Inputs.InputDesporeing, Inputs.InputDuration],
  },

  //Armor qualities

  respected: {
    label: "DGNS.QUALITY.respected.name",
    description: "DGNS.QUALITY.respected.description",
    category: "passive",
    itemTypes: ["armor"],
    inputs: [Inputs.InputTargetGroup, Inputs.InputBonus],
  },
  firstImpression: {
    label: "DGNS.QUALITY.firstImpression.name",
    description: "DGNS.QUALITY.firstImpression.description",
    category: "passive",
    itemTypes: ["armor"],
    inputs: [Inputs.InputBonus],
  },
  fireResistant: {
    label: "DGNS.QUALITY.fireResistant.name",
    description: "DGNS.QUALITY.fireResistant.description",
    category: "passive",
    itemTypes: ["armor"],
    inputs: [Inputs.InputArmor],
  },

  unstable: {
    label: "DGNS.QUALITY.unstable.name",
    description: "DGNS.QUALITY.unstable.description",
    category: "passive",
    itemTypes: ["armor"],
    inputs: [Inputs.InputCriticalDamage],
  },
  insulated: {
    label: "DGNS.QUALITY.insulated.name",
    description: "DGNS.QUALITY.insulated.description",
    category: "passive",
    itemTypes: ["armor"],
    inputs: [],
  },
  bulletproof: {
    label: "DGNS.QUALITY.bulletproof.name",
    description: "DGNS.QUALITY.bulletproof.description",
    category: "passive",
    itemTypes: ["armor"],
    inputs: [Inputs.InputArmor],
  },
  massive: {
    label: "DGNS.QUALITY.massive.name",
    description: "DGNS.QUALITY.massive.description",
    category: "passive",
    itemTypes: ["armor"],
    inputs: [Inputs.InputArmor],
  },
  brittle: {
    label: "DGNS.QUALITY.brittle.name",
    description: "DGNS.QUALITY.brittle.description",
    category: "passive",
    itemTypes: ["armor"],
    inputs: [Inputs.InputCriticalDamage],
  },
  sealed: {
    label: "DGNS.QUALITY.sealed.name",
    description: "DGNS.QUALITY.sealed.description",
    category: "passive",
    itemTypes: ["armor"],
    inputs: [Inputs.InputBonusSuccesses],
  },
};

export const Qualities = {
  forItemType: (itemType) => {
    return Object.entries(QUALITY_DEFINITIONS)
      .filter(([key, def]) => def.itemTypes.includes(itemType))
      .map(([key, def]) => ({ key, ...def }));
  },

  get weapon() {
    return Object.entries(QUALITY_DEFINITIONS)
      .filter(([key, def]) => def.itemTypes.includes("weapon"))
      .map(([key, def]) => ({ key, ...def }))
      .sort((a, b) => a.key.localeCompare(b.key));
  },

  get armor() {
    return Object.entries(QUALITY_DEFINITIONS)
      .filter(([key, def]) => def.itemTypes.includes("armor"))
      .map(([key, def]) => ({ key, ...def }))
      .sort((a, b) => a.key.localeCompare(b.key));
  },

  get agent() {
    return Object.entries(QUALITY_DEFINITIONS)
      .filter(([key, def]) => def.itemTypes.includes("agent"))
      .map(([key, def]) => ({ key, ...def }))
      .sort((a, b) => a.key.localeCompare(b.key));
  },

  get all() {
    return Object.entries(QUALITY_DEFINITIONS)
      .map(([key, def]) => ({
        key,
        ...def,
      }))
      .sort((a, b) => a.key.localeCompare(b.key));
  },
};
