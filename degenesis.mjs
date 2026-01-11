async function preloadHandlebarsTemplates() {
  const partials = [
    // Shared partials
    "systems/degenesisnext/templates/partials/group.header.hbs"
  ];
  const paths = {};
  for (const path of partials) {
    paths[`dgns.${path.split("/").pop().replace(".hbs", "")}`] = path;
  }
  return await foundry.applications.handlebars.loadTemplates(paths);
}
async function registerHandlebarsHelpers() {
  Handlebars.registerHelper("sheetEditMode", function(mode) {
    return mode === 2 ? true : false;
  });
  Handlebars.registerHelper("isGM", function(options) {
    return game.user.isGM;
  });
  Handlebars.registerHelper("isSkillDisabled", function(skill, modes) {
    if (skill === "primal" && modes.primalFocus === "focus") {
      return true;
    }
    if (skill === "focus" && modes.primalFocus === "primal") {
      return true;
    }
    if (skill === "faith" && modes.faithWillpower === "willpower") {
      return true;
    }
    if (skill === "willpower" && modes.faithWillpower === "faith") {
      return true;
    }
    return false;
  });
  Handlebars.registerHelper("json", function(context) {
    return JSON.stringify(context);
  });
  Handlebars.registerHelper("prettyJson", function(context) {
    return JSON.stringify(context, null, 2);
  });
}
const WEAPON_GROUPS = {
  brawl: "DGNS.WEAPON.brawl",
  armedMelee: "DGNS.WEAPON.armedMelee",
  thrown: "DGNS.WEAPON.thrown",
  projectiles: "DGNS.WEAPON.projectiles",
  handguns: "DGNS.WEAPON.handguns",
  rifles: "DGNS.WEAPON.rifles",
  heavy: "DGNS.WEAPON.heavy",
  explosives: "DGNS.WEAPON.explosives",
  sonic: "DGNS.WEAPON.sonic",
  custom: "DGNS.WEAPON.custom"
};
const WEAPON_GROUPS_SKILLS = {
  brawl: "brawl",
  armedMelee: "melee",
  thrown: "projectiles",
  projectiles: "projectiles",
  handguns: "projectiles",
  rifles: "projectiles",
  heavy: "projectiles",
  explosives: "projectiles",
  sonic: "engineering",
  custom: ""
};
const CALIBERS = {
  "50gl": "DGNS.CALIBER.50gl",
  357: "DGNS.CALIBER.357",
  44: "DGNS.CALIBER.44",
  "410sh": "DGNS.CALIBER.410sh",
  "410sl": "DGNS.CALIBER.410sl",
  556: "DGNS.CALIBER.556",
  jacket: "DGNS.CALIBER.jacket",
  hollowPoint: "DGNS.CALIBER.hollowPoint",
  flechette: "DGNS.CALIBER.flechette",
  "46x30": "DGNS.CALIBER.46x30",
  "9mm": "DGNS.CALIBER.9mm",
  "5x30": "DGNS.CALIBER.5x30",
  762: "DGNS.CALIBER.762",
  14: "DGNS.CALIBER.14",
  buckshot: "DGNS.CALIBER.buckshot",
  rifleBarrel: "DGNS.CALIBER.rifleBarrel",
  cartridge: "DGNS.CALIBER.cartridge",
  grenade: "DGNS.CALIBER.grenade",
  missile: "DGNS.CALIBER.missile",
  fragger: "DGNS.CALIBER.fragger",
  blackpowder: "DGNS.CALIBER.blackpowder",
  leadbullet: "DGNS.CALIBER.leadbullet",
  Ecube: "DGNS.CALIBER.Ecube",
  arrow: "DGNS.CALIBER.arrow",
  bolt: "DGNS.CALIBER.bolt",
  petro: "DGNS.CALIBER.petro",
  harpoon: "DGNS.CALIBER.harpoon",
  nail: "DGNS.CALIBER.nail",
  coal: "DGNS.CALIBER.coal",
  boltcoal: "DGNS.CALIBER.boltcoal",
  special: "DGNS.CALIBER.special",
  custom: "DGNS.CALIBER.custom"
};
const Damage = {
  /**
   * Default damage modifiers for items.
   */
  modifiers: {
    T: { blueprint: "+T", calculate: (force, triggers) => triggers },
    F: { blueprint: "+F", calculate: (force, triggers) => force },
    F2: {
      blueprint: "+F/2",
      calculate: (force, triggers) => Math.ceil(force / 2)
    },
    F3: {
      blueprint: "+F/3",
      calculate: (force, triggers) => Math.ceil(force / 3)
    },
    F4: {
      blueprint: "+F/4",
      calculate: (force, triggers) => Math.ceil(force / 4)
    },
    D: {
      blueprint: "+1D",
      calculate: (force, triggers) => new Die({ faces: 6, number: 1 }).evaluate().total
    },
    "2D": {
      blueprint: "+2D",
      calculate: (force, triggers) => new Die({ faces: 6, number: 2 }).evaluate().total
    },
    D2: {
      blueprint: "+1D/2",
      calculate: (force, triggers) => Math.ceil(new Die({ faces: 6, number: 1 }).evaluate().total / 2)
    }
  },
  get standardModifiers() {
    return this.modifiers;
  },
  get fromHellModifiers() {
    return {};
  }
};
const InputDifficulty = {
  name: "difficulty",
  label: "DGNS.Difficulty",
  type: "Number",
  default: 1
};
const InputAngle = {
  name: "angle",
  label: "DGNS.Angle",
  type: "Number",
  default: 45
};
const InputRadius = {
  name: "radius",
  label: "DGNS.Radius",
  type: "Number",
  default: 2
};
const InputTime = {
  name: "time",
  label: "DGNS.Time",
  type: "Number",
  default: 1
};
const InputDamage = {
  name: "damage",
  label: "DGNS.Damage",
  type: "Number",
  default: 1
};
const QUALITY_DEFINITIONS = {
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
    activeEffects: null
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
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE
        }
      ];
    }
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
    activeEffects: null
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
          mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE
        }
      ];
    }
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
    activeEffects: null
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
    activeEffects: null
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
    activeEffects: null
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
      const finalDistance = isSuccess ? Math.max(0, baseDistance - rollResult.triggers) : baseDistance;
      return { distance: finalDistance };
    },
    activeEffects: null
  }
};
const Qualities = {
  forItemType: (itemType) => {
    return Object.entries(QUALITY_DEFINITIONS).filter(([key, def]) => def.itemTypes.includes(itemType)).map(([key, def]) => ({ key, ...def }));
  },
  get weapon() {
    return Object.entries(QUALITY_DEFINITIONS).filter(([key, def]) => def.itemTypes.includes("weapon")).map(([key, def]) => ({ key, ...def }));
  },
  get armor() {
    return Object.entries(QUALITY_DEFINITIONS).filter(([key, def]) => def.itemTypes.includes("armor")).map(([key, def]) => ({ key, ...def }));
  },
  get agent() {
    return Object.entries(QUALITY_DEFINITIONS).filter(([key, def]) => def.itemTypes.includes("agent")).map(([key, def]) => ({ key, ...def }));
  }
  // todo: fix map method
  /* get all() {
    return QUALITY_DEFINITIONS.map(([key, def]) => ({ key, ...def }));
  }, */
};
const Condition = {
  calculateMaxTrauma: (actor) => {
  },
  calculateMaxFleshwounds: (actor) => {
  },
  calculateMaxEgo: (actor) => {
  },
  calculateMaxSpore: (actor) => {
  },
  calculateMovement: (actor) => {
  }
};
const DEGENESIS = {};
DEGENESIS.Damage = Damage;
DEGENESIS.Qualities = Qualities;
DEGENESIS.Condition = Condition;
DEGENESIS.alignments = {
  ambition: {
    label: "DGNS.Ambition",
    description: "DGNS.AmbitionDescription",
    affinity: [],
    aversion: [],
    constellation: []
  }
};
DEGENESIS.raptures = {
  biokinetics: "DGNS.Biokinetics",
  dushani: "DGNS.Dushani",
  leviathans: "DGNS.Leviathans",
  pheromancers: "DGNS.Pheromancers",
  pregnoctics: "DGNS.Pregnoctics",
  psychokinetics: "DGNS.Psychokinetics"
};
DEGENESIS.itemRaptures = {
  generic: "DGNS.Generic",
  biokinetics: "DGNS.Biokinetics",
  dushani: "DGNS.Dushani",
  leviathans: "DGNS.Leviathans",
  pheromancers: "DGNS.Pheromancers",
  pregnoctics: "DGNS.Pregnoctics",
  psychokinetics: "DGNS.Psychokinetics"
};
DEGENESIS.aberrantPhases = {
  primal: "DGNS.PrimalPhase",
  focus: "DGNS.FocusPhase"
};
DEGENESIS.attributes = {
  body: "DGNS.Body",
  agility: "DGNS.Agility",
  charisma: "DGNS.Charisma",
  intellect: "DGNS.Intellect",
  psyche: "DGNS.Psyche",
  instinct: "DGNS.Instinct"
};
DEGENESIS.attributeAbbrev = {
  body: "DGNS.BodyAbbrev",
  agility: "DGNS.AgilityAbbrev",
  charisma: "DGNS.CharismaAbbrev",
  intellect: "DGNS.IntellectAbbrev",
  psyche: "DGNS.PsycheAbbrev",
  instinct: "DGNS.InstinctAbbrev"
};
DEGENESIS.attributeType = {
  body: "primal",
  agility: "focus",
  charisma: "primal",
  intellect: "focus",
  psyche: "focus",
  instinct: "primal"
};
DEGENESIS.skills = {
  athletics: "DGNS.Athletics",
  brawl: "DGNS.Brawl",
  force: "DGNS.Force",
  melee: "DGNS.Melee",
  stamina: "DGNS.Stamina",
  toughness: "DGNS.Toughness",
  crafting: "DGNS.Crafting",
  dexterity: "DGNS.Dexterity",
  navigation: "DGNS.Navigation",
  mobility: "DGNS.Mobility",
  projectiles: "DGNS.Projectiles",
  stealth: "DGNS.Stealth",
  arts: "DGNS.Arts",
  conduct: "DGNS.Conduct",
  expression: "DGNS.Expression",
  leadership: "DGNS.Leadership",
  negotiation: "DGNS.Negotiation",
  seduction: "DGNS.Seduction",
  artifact: "DGNS.ArtifactLore",
  engineering: "DGNS.Engineering",
  focus: "DGNS.Focus",
  legends: "DGNS.Legends",
  medicine: "DGNS.Medicine",
  science: "DGNS.Science",
  cunning: "DGNS.Cunning",
  deception: "DGNS.Deception",
  domination: "DGNS.Domination",
  faith: "DGNS.Faith",
  reaction: "DGNS.Reaction",
  willpower: "DGNS.Willpower",
  empathy: "DGNS.Empathy",
  orienteering: "DGNS.Orienteering",
  perception: "DGNS.Perception",
  primal: "DGNS.Primal",
  survival: "DGNS.Survival",
  taming: "DGNS.Taming"
};
DEGENESIS.skillAttributes = {
  athletics: "body",
  brawl: "body",
  force: "body",
  melee: "body",
  stamina: "body",
  toughness: "body",
  crafting: "agility",
  dexterity: "agility",
  navigation: "agility",
  mobility: "agility",
  projectiles: "agility",
  stealth: "agility",
  arts: "charisma",
  conduct: "charisma",
  expression: "charisma",
  leadership: "charisma",
  negotiation: "charisma",
  seduction: "charisma",
  artifact: "intellect",
  engineering: "intellect",
  focus: "intellect",
  legends: "intellect",
  medicine: "intellect",
  science: "intellect",
  cunning: "psyche",
  deception: "psyche",
  domination: "psyche",
  faith: "psyche",
  reaction: "psyche",
  willpower: "psyche",
  empathy: "instinct",
  orienteering: "instinct",
  perception: "instinct",
  primal: "instinct",
  survival: "instinct",
  taming: "instinct"
};
DEGENESIS.fightRolls = {
  dodge: "mobility",
  initiative: "reaction",
  mentalDefenseWill: "willpower",
  mentalDefenseFaith: "faith"
};
DEGENESIS.diceRolls = {
  initiative: "DGNS.Initiative"
};
DEGENESIS.modifyTypes = {
  D: "D",
  S: "S",
  T: "T"
};
DEGENESIS.modifyActions = {
  initiative: "DGNS.Initiative",
  dodge: "DGNS.Dodge",
  movement: "DGNS.Movement",
  armor: "DGNS.Armor",
  action: "DGNS.Action",
  attack: "DGNS.Attack",
  damage: "DGNS.Damage",
  a_defense: "DGNS.ActiveDefense",
  p_defense: "DGNS.PassiveDefense",
  mentalDefense: "DGNS.MentalDef"
};
DEGENESIS.noType = ["movement", "armor", "damage", "p_defense"];
DEGENESIS.weaponGroups = WEAPON_GROUPS;
DEGENESIS.attackGroups = {
  closeQuarter: "DGNS.CloseQuarter",
  ranged: "DGNS.Ranged"
};
DEGENESIS.defenseGroups = {
  passive: "DGNS.DefensePassive",
  meleeActive: "DGNS.DefenseMeleeActive",
  rangedActive: "DGNS.DefenseRangedActive",
  mental: "DGNS.DefenseMental"
};
DEGENESIS.equipmentGroups = {
  "getting food": "DGNS.GettingFood",
  traps: "DGNS.Traps",
  sourcesOfLight: "DGNS.SourceOfLightFire",
  orienteeringTracking: "DGNS.OrienteeringTracking",
  climbing: "DGNS.Climbing",
  overnight: "DGNS.Overnight",
  inTheShadows: "DGNS.InTheShadows",
  gasMasks: "DGNS.GazMasks",
  survivalGear: "DGNS.SurvivalGear",
  technology: "DGNS.Technology",
  sunDiscs: "DGNS.SunDiscs",
  chroniclerSuitModules: "DGNS.ChroniclerSuitModules",
  heavyDutyModules: "DGNS.HeavyDutyModules",
  communication: "DGNS.Communication",
  energyManagement: "DGNS.EnergyManagement",
  medicalEquipment: "DGNS.MedicalEquipment",
  pharmaceutics: "DGNS.Pharmaceutics",
  elysianOils: "DGNS.ElysianOils",
  psychonauticRemains: "DGNS.PsychonauticRemains",
  huntingPsychonauts: "DGNS.HuntingPsychonauts",
  commonPrimalism: "DGNS.CommonPrimalism",
  talismansInsignia: "DGNS.TalismansInsignia",
  scrap: "DGNS.Scrap",
  other: "DGNS.Other",
  transportation: "DGNS.Transportation"
};
DEGENESIS.weaponGroupSkill = WEAPON_GROUPS_SKILLS;
DEGENESIS.weaponQualities = {
  areaDamage: "DGNS.AreaDamage",
  armorPiercing: "DGNS.Armorpiercing",
  biometricallyEncoded: "DGNS.BiometricallyEncoded",
  blunt: "DGNS.Blunt",
  camo: "DGNS.WeaponCamo",
  cutting: "DGNS.Cutting",
  cloud: "DGNS.Cloud",
  dazed: "DGNS.Dazed",
  deviation: "DGNS.Deviation",
  doubleBarreled: "DGNS.DoubleBarreled",
  entangled: "DGNS.Entangled",
  explosive: "DGNS.Explosive",
  fatal: "DGNS.Fatal",
  fireHazardous: "DGNS.FireHazardous",
  fragile: "DGNS.Fragile",
  impact: "DGNS.Impact",
  jamming: "DGNS.Jamming",
  muzzleLoader: "DGNS.MuzzleLoader",
  outOfControl: "DGNS.OutOfControl",
  piercing: "DGNS.Piercing",
  salvoes: "DGNS.Salvoes",
  scatter: "DGNS.Scatter",
  sensitive: "DGNS.Sensitive",
  smoothRunning: "DGNS.SmoothRunning",
  special: "DGNS.Special",
  specialDamage: "DGNS.SpecialDamage",
  standard: "DGNS.Standard",
  talisman: "DGNS.Talisman",
  terrifying: "DGNS.WeaponTerrifying",
  thunderStrike: "DGNS.ThunderStrike",
  extendedReload: "DGNS.ExtendedReload",
  gruesome: "DGNS.Gruesome",
  stun: "DGNS.Stun",
  panic: "DGNS.Panic",
  singleLoader: "DGNS.SingleLoader"
}, DEGENESIS.agentQualities = {
  poisoned: "POISONED",
  attractant: "ATTRACTANT",
  narcotic: "NARCOTIC",
  pseudoDesporeing: "PSEUDO DESPOREING"
}, DEGENESIS.armorQualities = {
  respected: "DGNS.Respected",
  firstImpression: "DGNS.FirstImpression",
  fireResistant: "DGNS.FireResistant",
  terrifying: "DGNS.ArmorTerrifying",
  camo: "DGNS.ArmorCamo",
  unstable: "DGNS.Unstable",
  insulated: "DGNS.Insulated",
  bulletproof: "DGNS.Bulletproof",
  massive: "DGNS.Massive",
  brittle: "DGNS.Brittle",
  sealed: "DGNS.Sealed",
  special: "DGNS.ArmorSpecial"
}, DEGENESIS.shieldQualities = { special: "DGNS.Special" }, DEGENESIS.attackQualities = {
  areaDamage: "DGNS.AreaDamage",
  armorPiercing: "DGNS.Armorpiercing",
  biometricallyEncoded: "DGNS.BiometricallyEncoded",
  blunt: "DGNS.Blunt",
  camo: "DGNS.WeaponCamo",
  cutting: "DGNS.Cutting",
  cloud: "DGNS.Cloud",
  dazed: "DGNS.Dazed",
  deviation: "DGNS.Deviation",
  doubleBarreled: "DGNS.DoubleBarreled",
  entangled: "DGNS.Entangled",
  explosive: "DGNS.Explosive",
  fatal: "DGNS.Fatal",
  fireHazardous: "DGNS.FireHazardous",
  fragile: "DGNS.Fragile",
  impact: "DGNS.Impact",
  jamming: "DGNS.Jamming",
  muzzleLoader: "DGNS.MuzzleLoader",
  outOfControl: "DGNS.OutOfControl",
  piercing: "DGNS.Piercing",
  salvoes: "DGNS.Salvoes",
  scatter: "DGNS.Scatter",
  sensitive: "DGNS.Sensitive",
  smoothRunning: "DGNS.SmoothRunning",
  special: "DGNS.Special",
  specialDamage: "DGNS.SpecialDamage",
  standard: "DGNS.Standard",
  talisman: "DGNS.Talisman",
  terrifying: "DGNS.WeaponTerrifying",
  thunderStrike: "DGNS.ThunderStrike",
  extendedReload: "DGNS.ExtendedReload",
  gruesome: "DGNS.Gruesome",
  stun: "DGNS.Stun",
  panic: "DGNS.Panic",
  singleLoader: "DGNS.SingleLoader"
}, DEGENESIS.defenseQualities = { special: "DGNS.Special" }, DEGENESIS.weaponQualitiesValues = {
  areaDamage: ["angle"],
  armorPiercing: [],
  biometricallyEncoded: ["difficulty"],
  blunt: [],
  camo: ["difficulty"],
  cloud: ["radius", "amountOfTime"],
  cutting: ["trigger", "damage"],
  dazed: ["egoDamage"],
  deviation: [],
  doubleBarreled: [],
  entangled: ["movementPenalty"],
  explosive: [],
  fatal: [],
  fireHazardous: [],
  fragile: [],
  impact: ["trigger"],
  jamming: [],
  muzzleLoader: [],
  outOfControl: ["difficulty"],
  piercing: ["armorRating"],
  salvoes: ["rounds"],
  scatter: [],
  sensitive: [],
  smoothRunning: ["trigger"],
  special: [],
  specialDamage: ["enemyType", "damage"],
  standard: ["bonus"],
  talisman: ["bonus"],
  terrifying: ["difficulty"],
  thunderStrike: [],
  extendedReload: ["time"],
  gruesome: ["rating"],
  stun: ["rating"],
  panic: ["rating"],
  singleLoader: ["rounds"]
}, DEGENESIS.agentQualitiesValues = {
  poisoned: ["potency", "effect", "duration"],
  attractant: ["target"],
  narcotic: ["potency", "damage"],
  pseudoDesporeing: ["desporeing", "duration"]
}, DEGENESIS.armorQualitiesValues = {
  respected: ["targetGroup", "bonusDice"],
  firstImpression: ["bonus"],
  fireResistant: ["armor"],
  terrifying: ["difficulty"],
  camo: ["difficulty"],
  unstable: ["criticalDamageRating"],
  insulated: [],
  bulletproof: ["armor"],
  massive: ["armor"],
  brittle: ["criticalDamageRating"],
  sealed: ["bonusSuccesses"],
  special: []
}, DEGENESIS.shieldQualitiesValues = { special: [] }, DEGENESIS.attackQualitiesValues = {
  areaDamage: ["angle"],
  armorPiercing: [],
  biometricallyEncoded: ["difficulty"],
  blunt: [],
  camo: ["difficulty"],
  cloud: ["radius", "amountOfTime"],
  cutting: ["trigger", "damage"],
  dazed: ["egoDamage"],
  deviation: [],
  doubleBarreled: [],
  entangled: ["movementPenalty"],
  explosive: [],
  fatal: [],
  fireHazardous: [],
  fragile: [],
  impact: ["trigger"],
  jamming: [],
  muzzleLoader: [],
  outOfControl: ["difficulty"],
  piercing: ["armorRating"],
  salvoes: ["rounds"],
  scatter: [],
  sensitive: [],
  smoothRunning: ["trigger"],
  special: [],
  specialDamage: ["enemyType", "damage"],
  standard: ["bonus"],
  talisman: ["bonus"],
  terrifying: ["difficulty"],
  thunderStrike: [],
  extendedReload: ["time"],
  gruesome: ["rating"],
  stun: ["rating"],
  panic: ["rating"],
  singleLoader: ["rounds"]
}, DEGENESIS.defenseQualitiesValues = { special: [] }, DEGENESIS.qualityValues = {
  angle: "DGNS.Angle",
  difficulty: "DGNS.Difficulty",
  time: "DGNS.Time",
  damage: "DGNS.QualityDamage",
  amountOfTime: "DGNS.AmountOfTime",
  movementPenalty: "DGNS.MovementPenalty",
  egoDamage: "DGNS.EgoDamage",
  radius: "DGNS.Radius",
  penalty: "DGNS.Penalty",
  trigger: "DGNS.Trigger",
  bonus: "DGNS.Bonus",
  enemyType: "DGNS.EnemyType",
  rating: "DGNS.Rating",
  armorRating: "DGNS.ArmorRating",
  rounds: "DGNS.NumberOfRounds",
  potency: "DGNS.Potency",
  effect: "DGNS.QualityEffect",
  target: "DGNS.Target",
  desporeing: "DGNS.Desporeing",
  duration: "DGNS.Duration",
  targetGroup: "DGNS.TargetGroup",
  bonusDice: "DGNS.BonusDice",
  armor: "DGNS.QualityArmor",
  criticalDamageRating: "DGNS.CriticalDamageRating",
  bonusSuccesses: "DGNS.BonusSuccesses"
};
DEGENESIS.weaponQualityDescription = {
  areaDamage: "DGNS.AreaDamageDescription",
  armorPiercing: "DGNS.ArmorpiercingDescription",
  biometricallyEncoded: "DGNS.BiometricallyEncodedDescription",
  blunt: "DGNS.BluntDescription",
  camo: "DGNS.WeaponCamoDescription",
  cloud: "DGNS.CloudDescription",
  dazed: "DGNS.DazedDescription",
  deviation: "DGNS.DeviationDescription",
  doubleBarreled: "DGNS.DoubleBarreledDescription",
  entangled: "DGNS.EntangledDescription",
  explosive: "DGNS.ExplosiveDescription",
  fatal: "DGNS.FatalDescription",
  fireHazardous: "DGNS.FireHazardousDescription",
  fragile: "DGNS.FragileDescription",
  impact: "DGNS.ImpactDescription",
  jamming: "DGNS.JammingDescription",
  muzzleLoader: "DGNS.MuzzleLoaderDescription",
  outOfControl: "DGNS.OutOfControlDescription",
  piercing: "DGNS.PiercingDescription",
  salvoes: "DGNS.SalvoesDescription",
  scatter: "DGNS.ScatterDescription",
  sensitive: "DGNS.SensitiveDescription",
  smoothRunning: "DGNS.SmoothRunningDescription",
  special: "DGNS.SpecialDescription",
  specialDamage: "DGNS.SpecialDamageDescription",
  standard: "DGNS.StandardDescription",
  talisman: "DGNS.TalismanDescription",
  terrifying: "DGNS.WeaponTerrifyingDescription",
  thunderStrike: "DGNS.ThunderStrikeDescription",
  extendedReload: "DGNS.ExtendedReloadDescription",
  gruesome: "DGNS.GruesomeDescription",
  stun: "DGNS.StunDescription",
  panic: "DGNS.PanicDescription",
  singleLoader: "DGNS.SingleLoaderDescription",
  cutting: "DGNS.CuttingDescription"
}, DEGENESIS.agentQualityDescription = {
  poisoned: "DGNS.PoisonedDescription",
  attractant: "DGNS.AttractantDescription",
  narcotic: "DGNS.NarcoticDescription",
  pseudoDesporeing: "DGNS.PseudodesporeingDescription"
}, DEGENESIS.armorQualityDescription = {
  respected: "DGNS.RespectedDescription",
  firstImpression: "DGNS.FirstImpressionDescription",
  fireResistant: "DGNS.FireResistantDescription",
  terrifying: "DGNS.ArmorTerrifyingDescription",
  camo: "DGNS.ArmorCamoDescription",
  unstable: "DGNS.UnstableDescription",
  insulated: "DGNS.InsulatedDescription",
  bulletproof: "DGNS.BulletProofDescription",
  massive: "DGNS.MassiveDescription",
  brittle: "DGNS.BrittleDescription",
  sealed: "DGNS.SealedDescription",
  special: "DGNS.SpecialDescription"
}, DEGENESIS.shieldQualityDescription = {
  special: "DGNS.SpecialDescription"
}, DEGENESIS.attackQualityDescription = {
  areaDamage: "DGNS.AreaDamageDescription",
  armorPiercing: "DGNS.ArmorpiercingDescription",
  biometricallyEncoded: "DGNS.BiometricallyEncodedDescription",
  blunt: "DGNS.BluntDescription",
  camo: "DGNS.WeaponCamoDescription",
  cloud: "DGNS.CloudDescription",
  dazed: "DGNS.DazedDescription",
  deviation: "DGNS.DeviationDescription",
  doubleBarreled: "DGNS.DoubleBarreledDescription",
  entangled: "DGNS.EntangledDescription",
  explosive: "DGNS.ExplosiveDescription",
  fatal: "DGNS.FatalDescription",
  fireHazardous: "DGNS.FireHazardousDescription",
  fragile: "DGNS.FragileDescription",
  impact: "DGNS.ImpactDescription",
  jamming: "DGNS.JammingDescription",
  muzzleLoader: "DGNS.MuzzleLoaderDescription",
  outOfControl: "DGNS.OutOfControlDescription",
  piercing: "DGNS.PiercingDescription",
  salvoes: "DGNS.SalvoesDescription",
  scatter: "DGNS.ScatterDescription",
  sensitive: "DGNS.SensitiveDescription",
  smoothRunning: "DGNS.SmoothRunningDescription",
  special: "DGNS.SpecialDescription",
  specialDamage: "DGNS.SpecialDamageDescription",
  standard: "DGNS.StandardDescription",
  talisman: "DGNS.TalismanDescription",
  terrifying: "DGNS.WeaponTerrifyingDescription",
  thunderStrike: "DGNS.ThunderStrikeDescription",
  extendedReload: "DGNS.ExtendedReloadDescription",
  gruesome: "DGNS.GruesomeDescription",
  stun: "DGNS.StunDescription",
  panic: "DGNS.PanicDescription",
  singleLoader: "DGNS.SingleLoaderDescription",
  cutting: "DGNS.CuttingDescription"
}, DEGENESIS.defenseQualityDescription = {
  special: "DGNS.SpecialDescription"
}, DEGENESIS.damageTypes = {
  fleshwounds: "DGNS.Fleshwounds",
  ego: "DGNS.Ego",
  trauma: "DGNS.Trauma"
};
DEGENESIS.standardDamageModifiers = Damage.standardModifiers;
DEGENESIS.formHellDamageModifiers = Damage.fromHellModifiers;
DEGENESIS.damageModifiers = {
  F: { blueprint: "+F", calculate: (force, triggers) => force },
  F2: {
    blueprint: "+F/2",
    calculate: (force, triggers) => Math.ceil(force / 2)
  },
  F3: {
    blueprint: "+F/3",
    calculate: (force, triggers) => Math.ceil(force / 3)
  },
  F4: {
    blueprint: "+F/4",
    calculate: (force, triggers) => Math.ceil(force / 4)
  },
  T: { blueprint: "+T", calculate: (force, triggers) => triggers },
  D2: {
    blueprint: "+1D/2",
    calculate: (force, triggers) => Math.ceil(new Die({ faces: 6, number: 1 }).evaluate().total / 2)
  },
  D: {
    blueprint: "+1D",
    calculate: (force, triggers) => new Die({ faces: 6, number: 1 }).evaluate().total
  },
  "2D": {
    blueprint: "+2D",
    calculate: (force, triggers) => new Die({ faces: 6, number: 2 }).evaluate().total
  }
};
DEGENESIS.damageModifiersFromHell = {
  T: { blueprint: "+T", calculate: (triggers) => triggers },
  D2: {
    blueprint: "+1D/2",
    calculate: (triggers) => Math.ceil(new Die({ faces: 6, number: 1 }).evaluate().total / 2)
  },
  D: {
    blueprint: "+1D",
    calculate: (triggers) => new Die({ faces: 6, number: 1 }).evaluate().total
  },
  "2D": {
    blueprint: "+2D",
    calculate: (triggers) => new Die({ faces: 6, number: 2 }).evaluate().total
  }
};
DEGENESIS.modTypes = {
  weapon: "DGNS.Weapon",
  armor: "DGNS.Armor"
};
DEGENESIS.modChangeModes = {
  add: "DGNS.ModAdd",
  override: "DGNS.ModOverride"
};
DEGENESIS.techValues = {
  1: "I",
  2: "II",
  3: "III",
  4: "IV",
  5: "V",
  6: "VI"
};
DEGENESIS.rollResults = {
  success: "DGNS.Success",
  failure: "DGNS.Failure",
  botch: "DGNS.Botch"
};
DEGENESIS.calibers = {
  "50gl": "TYPES.Ammo.50gl",
  357: "TYPES.Ammo.357",
  44: "TYPES.Ammo.44",
  "410sh": "TYPES.Ammo.410sh",
  "410sl": "TYPES.Ammo.410sl",
  556: "TYPES.Ammo.556",
  jacket: "TYPES.Ammo.jacket",
  hollowPoint: "TYPES.Ammo.hollowPoint",
  flechette: "TYPES.Ammo.flechette",
  "46x30": "TYPES.Ammo.46x30",
  "9mm": "TYPES.Ammo.9mm",
  "5x30": "TYPES.Ammo.5x30",
  762: "TYPES.Ammo.762",
  14: "TYPES.Ammo.14",
  buckshot: "TYPES.Ammo.buckshot",
  rifleBarrel: "TYPES.Ammo.rifleBarrel",
  cartridge: "TYPES.Ammo.cartridge",
  grenade: "TYPES.Ammo.grenade",
  missile: "TYPES.Ammo.missile",
  fragger: "TYPES.Ammo.fragger",
  blackpowder: "TYPES.Ammo.blackpowder",
  leadbullet: "TYPES.Ammo.leadbullet",
  Ecube: "TYPES.Ammo.Ecube",
  arrow: "TYPES.Ammo.arrow",
  bolt: "TYPES.Ammo.bolt",
  petro: "TYPES.Ammo.petro",
  harpoon: "TYPES.Ammo.harpoon",
  nail: "TYPES.Ammo.nail",
  coal: "TYPES.Ammo.coal",
  boltcoal: "TYPES.Ammo.boltcoal",
  special: "TYPES.Ammo.special",
  custom: "TYPES.Ammo.custom"
};
DEGENESIS.systemItems = {
  spentEgoActionModifier: {
    type: "modifier",
    system: {
      action: "action",
      type: "D"
    }
  },
  spentSporeActionModifier: {
    type: "modifier",
    system: {
      action: "action",
      type: "D"
    }
  }
};
DEGENESIS.transportationEncumbranceCalculation = {
  wholeReduction: (items, reductionValue) => {
    let totalEnc = items.reduce((a, b) => a + (b.encumbrance || 0), 0);
    totalEnc -= reductionValue;
    if (totalEnc < 0) totalEnc = 0;
    return totalEnc;
  },
  eachReduction: (items, reductionValue) => {
    let totalEnc = items.reduce((a, b) => {
      let enc = (b.encumbrance * b.quantity || 0) - reductionValue * b.quantity;
      if (enc < 0) enc = 0;
      return a + enc;
    }, 0);
    if (totalEnc < 0) totalEnc = 0;
    return totalEnc;
  }
};
DEGENESIS.transportationEncumbranceModes = {
  wholeReduction: "DGNS.WholeReduction",
  eachReduction: "DGNS.EachReduction"
};
function sidebarApp() {
  Hooks.on("renderSidebar", async (app, html) => {
    console.log("hooks.js renderSidebar", { app, html });
    const content = html.querySelector("#sidebar-content");
    for (let section of content.childNodes) {
      section.classList.remove("themed", "theme-light", "theme-dark");
    }
  });
  Hooks.on("renderSettings", async (app, html) => {
    console.log("hooks.js renderSettings", { app, html });
    const theme = html.ownerDocument.body.classList.contains("theme-dark") ? "dark" : "light";
    const info = html.querySelector(".info");
    const badge = document.createElement("section");
    badge.classList.add("dgns", "flexcol");
    badge.innerHTML = `<img src="systems/degenesisnext/ui/degenesis-logo-${theme}.svg" data-tooltip="${game.system.title}" alt="${game.system.title}"> `;
    if (info) {
      info.insertAdjacentElement("beforeBegin", badge);
    }
  });
  Hooks.on("renderChatLog", async (app, html) => {
    console.log("hooks.js renderChat", { app, html });
  });
}
function menu() {
  Hooks.on("renderMainMenu", async (app, html) => {
    console.log(`Hooks.js renderMainMenu`, { app, html });
    html.classList.remove("themed", "theme-dark", "theme-light");
  });
}
function pause() {
  Hooks.on("renderGamePause", async (app, html, settings) => {
    console.log(app);
    settings.icon = "systems/degenesisnext/ui/marauders.svg";
  });
}
function RegisterItemHooks() {
  Hooks.on("updateItem", async (item, changed, options, userId) => {
    if (item.system.isSyncable) {
      for (const actor of game.actors) {
        const usesItem = actor.system[item.type]?.id === item.id;
        if (usesItem) {
          actor.prepareData();
          actor.render(false);
        }
      }
    }
  });
}
function RegisterActorHooks() {
  Hooks.on("preUpdateActor", (actor, changes, options, userId) => {
    console.log("Actor update triggered:", changes);
  });
}
function RegisterHandlebars() {
  Hooks.on("init", () => {
    Handlebars.registerHelper("eq", (a, b) => a == b);
  });
}
function chatmessages() {
  Hooks.on("renderChatMessageHTML ", async (message, html, context) => {
    console.log(`RenderChatMessage Fired`);
    console.log(message);
    if (!message.rolls || message.rolls.length === 0) return;
    message.rolls.forEach((roll) => {
      roll.dice.forEach((die) => {
        die.results.forEach((r) => {
          if (!r.img) {
            r.img = `systems/degenesisnext/ui/dice-faces/d${r.result}.svg`;
          }
        });
      });
    });
    html.addClass("degenesis-roll");
  });
}
function hooks() {
  menu();
  pause();
  sidebarApp();
  RegisterHandlebars();
  chatmessages();
  RegisterItemHooks();
  RegisterActorHooks();
}
const { api: api$7, sheets: sheets$7 } = foundry.applications;
function ActorSheetMixin(Base) {
  return class DegenesisActorSheet extends api$7.HandlebarsApplicationMixin(
    Base
  ) {
    static TABS = [];
    static MODES = {
      PLAY: 1,
      EDIT: 2
    };
    _mode = this.constructor.MODES.PLAY;
    _dropdownState = {};
    /** Constructor  */
    constructor(object, options = {}) {
      const key = `${object.type}${object.limited ? ":limited" : ""}`;
      const { width, height } = game.user.getFlag("degenesisnext", `actorSheetPrefs.${key}`) ?? {};
      if (width && !("width" in options)) options.width = width;
      if (height && !("height" in options)) options.height = height;
      super(object, options);
    }
    /** @inheritdoc */
    async close(options) {
      options = { animate: false };
      await super.close(options);
    }
    /** @inheritdoc */
    async _render(force, { mode, ...options } = {}) {
      return super._render(force, { mode, ...options } = {});
    }
    /** @inheritdoc */
    async _renderHTML(context, options) {
      return super._renderHTML(context, options);
    }
    async _renderFrame(options) {
      const html = await super._renderFrame(options);
      const header = html.children[0];
      if (this.isEditable) {
        const toggle = document.createElement("dgns-slidetoggle");
        toggle.checked = this._mode === this.constructor.MODES.EDIT;
        toggle.classList.add("mode-slider");
        toggle.dataset.tooltip = "DGNS.SheetModeEdit";
        toggle.setAttribute(
          "aria-label",
          game.i18n.localize("DGNS.SheetModeEdit")
        );
        toggle.addEventListener("change", (event) => {
          event.stopPropagation();
          event.stopImmediatePropagation();
          this._onChangeSheetMode(event);
        });
        toggle.addEventListener("dblclick", (event) => event.stopPropagation());
        header.insertAdjacentElement("afterbegin", toggle);
      }
      let resizeHandle = html.lastChild;
      resizeHandle.innerHTML = `<svg><path d="M0,11L11,0L11,11L0,11Z"/></svg>`;
      return html;
    }
    /** Data preparation */
    /** DEPRECATED  */
    async getData(options) {
    }
    async _prepareContext(options) {
      const context = await super._prepareContext(options);
      if (!this._dropdownState) {
        this._dropdownState = {};
      }
      context.editable = this.isEditable && this._mode === this.constructor.MODES.EDIT;
      context.cssClass = context.editable ? "editable" : this.isEditable ? "interactable" : "locked";
      return context;
    }
    /** Event listeners and handlers */
    activateListeners(html) {
      html.querySelectorAll(".section-dropdown").forEach((sectionEl) => {
        const sectionId = sectionEl.dataset.section;
        const body = sectionEl.querySelector(".section-body");
        const toggleBtn = sectionEl.querySelector(".dropdown-toggle");
        if (!(sectionId in this._dropdownState)) {
          this._dropdownState[sectionId] = sectionEl.dataset.collapsed === "true" ? true : false;
        }
        if (this._dropdownState[sectionId]) {
          body.classList.add("collapsed");
        }
        toggleBtn?.addEventListener("click", (event) => {
          const isCollapsed = body.classList.contains("collapsed");
          body.classList.toggle("collapsed");
          this._dropdownState[sectionId] = !isCollapsed;
        });
      });
    }
    async _onChangeSheetMode(event) {
      const { MODES } = this.constructor;
      const toggle = event.currentTarget;
      const label = game.i18n.localize(
        `DGNS.SheetMode${toggle.checked ? "Play" : "Edit"}`
      );
      toggle.dataset.tooltip = label;
      toggle.setAttribute("aria-label", label);
      this._mode = toggle.checked ? MODES.EDIT : MODES.PLAY;
      this.render();
    }
    _disableFields(form) {
      super._disableFields(form);
    }
    /** Events handling */
    _onRender(context, options) {
      super._onRender(context, options);
      this.activateListeners(this.element);
    }
    _onResize(event) {
      super._onResize(event);
      const { width, height } = this.position;
      const key = `${this.actor.type}${this.actor.limited ? ":limited" : ""}`;
      game.user.setFlag("degenesis", `actorSheetPrefs.${key}`, {
        width,
        height
      });
    }
    /** Dropdown sections handling  */
    _onDropdownToggle(event) {
      try {
        let target = event.currentTarget;
        let dropdown = target.dataset.dropdown;
        console.log(target.attributes);
      } catch (err) {
        console.log(err);
      }
    }
  };
}
const { api: api$6, sheets: sheets$6 } = foundry.applications;
const { DialogV2: DialogV2$1 } = foundry.applications.api;
const { TextEditor: TextEditor$5 } = foundry.applications.ux;
class DGNSCharacterSheet extends ActorSheetMixin(
  sheets$6.ActorSheetV2
) {
  static DEFAULT_OPTIONS = {
    actions: {
      // data actions
      showLinkedItem: this.showLinkedItem,
      removeLinkedItem: this.removeLinkedItem,
      //
      unsetGroup: this.unsetGroup,
      // roll actions
      rollAction: this.#onActionRoll,
      rollCombination: this.#onCombinationRoll,
      // effects
      manageEffect: this.#onManageEffect
    },
    form: {
      submitOnChange: true
    },
    window: {
      resizable: true,
      frame: true
    },
    position: {
      width: 700,
      height: 800
    },
    classes: ["dgns-character"]
  };
  static PARTS = {
    sheetHeader: {
      template: "systems/degenesisnext/templates/partials/sheet.title.hbs"
    },
    actorHeader: {
      template: "systems/degenesisnext/templates/actors/character.sheet/cs.header.hbs",
      templates: [
        "systems/degenesisnext/templates/actors/character.sheet/header.partials/details.hbs",
        "systems/degenesisnext/templates/actors/character.sheet/header.partials/modes.hbs",
        "systems/degenesisnext/templates/actors/character.sheet/header.partials/currency.hbs",
        "systems/degenesisnext/templates/actors/character.sheet/header.partials/xp.hbs"
      ]
    },
    tabs: {
      template: "systems/degenesisnext/templates/actors/character.sheet/cs.tabs.hbs",
      scrollable: [""]
    },
    general: {
      template: "systems/degenesisnext/templates/actors/character.sheet/cs.general.hbs",
      scrollable: [""]
    },
    stats: {
      template: "systems/degenesisnext/templates/actors/character.sheet/cs.stats.hbs",
      scrollable: [""]
    },
    effects: {
      template: "systems/degenesisnext/templates/actors/character.sheet/cs.effects.hbs",
      scrollable: [".container-scrollable"]
    },
    combat: {
      template: "systems/degenesisnext/templates/actors/character.sheet/cs.combat.hbs",
      scrollable: [""]
    },
    inventory: {
      template: "systems/degenesisnext/templates/actors/character.sheet/cs.inventory.hbs",
      scrollable: [""]
    },
    history: {
      template: "systems/degenesisnext/templates/actors/character.sheet/cs.history.hbs",
      templates: [
        "systems/degenesisnext/templates/actors/character.sheet/history.partials/group.hbs",
        "systems/degenesisnext/templates/actors/character.sheet/history.partials/biography.hbs",
        "systems/degenesisnext/templates/actors/character.sheet/history.partials/notes.hbs",
        "systems/degenesisnext/templates/actors/character.sheet/history.partials/gmnotes.hbs"
      ],
      scrollable: [".container-scrollable"]
    },
    sheetFooter: {
      template: "systems/degenesisnext/templates/partials/sheet.footer.hbs"
    }
  };
  /** @type {Record<string, foundry.applications.types.ApplicationTabsConfiguration>} */
  static TABS = {
    main: {
      initial: "general",
      // Set the initial tab
      tabs: [
        { id: "general", label: "DGNS.General" },
        { id: "stats", label: "DGNS.Stats" },
        { id: "effects", label: "DGNS.Effects" },
        { id: "combat", label: "DGNS.Combat" },
        { id: "inventory", label: "DGNS.Inventory" },
        { id: "history", label: "DGNS.History" }
      ]
    },
    header: {
      initial: "details",
      tabs: [
        { id: "details", label: "DGNS.Details", icon: "" },
        { id: "modes", label: "DGNS.Modes", icon: "" },
        { id: "currency", label: "DGNS.Currency", icon: "" },
        { id: "xp", label: "DGNS.Experience", icon: "" }
      ]
    },
    history: {
      initial: "group",
      tabs: [
        { id: "group", label: "DGNS.Group" },
        { id: "biography", label: "DGNS.Biography" },
        { id: "notes", label: "DGNS.Notes" },
        { id: "gmnotes", label: "DGNS.Gmnotes" }
      ]
    }
  };
  /** Preparing sheet context */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    Object.assign(context, {
      mode: this._mode,
      owner: this.document.isOwner,
      limited: this.document.limited,
      isEditable: this.isEditable,
      actor: this.actor,
      system: this.actor.system,
      flags: this.actor.flags,
      actorFields: this.actor.schema.fields,
      // Simplified Data Access
      culture: this.actor.system.culture,
      concept: this.actor.system.concept,
      cult: this.actor.system.cult,
      group: this.actor.system.group,
      inventory: this.actor._prepareInventory(),
      effects: await this.actor._prepareEffects(),
      tabGroups: this.tabGroups,
      mainTabs: this._prepareTabs("main"),
      // main navigation groups
      headerTabs: this._prepareTabs("header"),
      // header display groups
      historyTabs: this._prepareTabs("history"),
      // history subtabs
      // Enriched fields
      enriched: {
        biography: await TextEditor$5.enrichHTML(this.document.system.biography, {
          secrets: this.document.isOwner
        }),
        ownerNotes: await TextEditor$5.enrichHTML(
          this.document.system.ownerNotes,
          {
            secrets: this.document.isOwner
          }
        ),
        gmNotes: await TextEditor$5.enrichHTML(this.document.system.gmNotes, {
          secrets: this.document.isOwner
        })
      }
    });
    console.log(`context: `);
    console.dir(context);
    return context;
  }
  async _preparePartContext(partId, context, options) {
    if (context.mainTabs?.[partId]) {
      context.tab = context.mainTabs[partId];
      if (partId === "history") {
        context.subtabs = context.historyTabs;
      }
    }
    return context;
  }
  /*   _configureRenderOptions(options) {
    super._configureRenderOptions(options);
  } */
  /**
   * Creating initial context menus for permanent objects
   */
  createContextMenus() {
    function _actionRollContextOptions() {
      return [
        {
          name: "Action roll",
          callback: async (target) => {
            await this._onActionRoll(null, target);
          }
        },
        {
          name: "Combination roll",
          callback: async (target) => {
            await this._onCombinationRoll(null, target);
          }
        }
      ];
    }
    this._createContextMenu(
      _actionRollContextOptions.bind(this),
      `[data-action=rollAction]`,
      {
        hookName: "getActionRollContextOptions",
        fixed: true,
        parentClassHooks: false
      }
    );
  }
  /** @inheritdoc */
  async _onFirstRender(context, options) {
    await super._onFirstRender(context, options);
    this.createContextMenus();
  }
  activateListeners(html) {
    console.log(`Activate listeners`);
    super.activateListeners(html);
  }
  /** @inheritdoc */
  _onRender(context, options) {
    super._onRender(context, options);
    console.log(this);
  }
  async _renderFrame(options) {
    const html = await super._renderFrame(options);
    return html;
  }
  _onResize(event) {
    super._onResize(event);
  }
  async _onDrop(event) {
    event.preventDefault();
    const data = TextEditor$5.getDragEventData(event);
    if (data.type === "Actor") {
      const actor = await Actor.implementation.fromDropData(data);
      if (actor.type === "group") {
        await this.actor.setGroup(actor);
      }
    }
    if (data.type === "Item") {
      const item = await Item.implementation.fromDropData(data);
      if (item.type === "culture" && !item.actor) {
        await this.actor.system.setCulture(item.id);
        return false;
      }
      if (item.type === "cult" && !item.actor) {
        await this.actor.system.setCult(item.id);
        return false;
      }
      if (item.type === "concept" && !item.actor) {
        await this.actor.system.setConcept(item.id);
        return false;
      }
    }
    return super._onDrop(event);
  }
  //#region Effects
  /** Static wrapper for logic. */
  static async #onManageEffect(event, target) {
    await this._onManageEffect(event, target);
  }
  /**
   * Manage effect on Actor's side.
   * @param {*} event
   * @param {*} target
   * @returns
   */
  async _onManageEffect(event, target) {
    if (event) event.preventDefault();
    const action = target.dataset.type;
    const effectId = target.closest(".effect")?.dataset.effectId;
    return await this.actor._manageEffect(action, effectId);
  }
  //#endregion
  //#region Rolls
  // static wrappers
  static async #onActionRoll(event, target) {
    await this._onActionRoll(event, target);
  }
  static async #onCombinationRoll(event, target) {
    await this._onCombinationRoll(event, target);
  }
  async _onCombinationRoll(event, target) {
    if (event) event.preventDefault();
    const skill = target.dataset.skill;
    const attribute = target.dataset.attribute;
    await this.actor.combinationRoll(attribute, skill);
  }
  // Main method to be used by click and context menu
  async _onActionRoll(event, target) {
    if (event) event.preventDefault();
    const skill = target.dataset.skill;
    const attribute = target.dataset.attribute;
    await this.actor.actionRoll(attribute, skill);
  }
  //#endregion
  /**
   * Display linked Item, and fallback to cached one if main do not exist anymore.
   * Mainly used with Culture / Concept / Cult
   * @param {*} event
   * @param {*} target
   */
  static async showLinkedItem(event, target) {
    const itemType = target.dataset.itemType;
    const itemId = this.actor.system[itemType].id;
    const item = itemId === this.actor.system[`${itemType}Item`].linked.id ? game.items.get(itemId) : this.actor.items.get(itemId);
    if (item) {
      item.sheet.render(true);
    }
  }
  static async removeLinkedItem(event, target) {
    const itemType = target.dataset.itemType;
    await this.actor.system.removeLinkedItem(itemType);
  }
  static async unsetGroup() {
    await this.actor.unsetGroup();
  }
  /*  changeTab(tab, group, options) {
    super.changeTab(tab, group, options);
  } */
}
const { api: api$5, sheets: sheets$5 } = foundry.applications;
const { DialogV2 } = foundry.applications.api;
const { TextEditor: TextEditor$4 } = foundry.applications.ux;
class DGNSGroupSheet extends ActorSheetMixin(
  sheets$5.ActorSheetV2
) {
  static DEFAULT_OPTIONS = {
    actions: {},
    form: {
      submitOnChange: true
    },
    window: {
      resizable: true,
      frame: true
    },
    position: {
      width: 700,
      height: 800
    },
    classes: ["dgns-group"]
  };
  static PARTS = {
    sheetHeader: {
      template: "systems/degenesisnext/templates/partials/sheet.title.hbs"
    },
    groupHeader: {
      template: "systems/degenesisnext/templates/actors/group.sheet/header.hbs"
    },
    /*  tabs: {
         template:
           "systems/degenesisnext/templates/actors/character.sheet/cs.tabs.hbs",
         scrollable: [""],
       },
       general: {
         template:
           "systems/degenesisnext/templates/actors/character.sheet/cs.general.hbs",
         scrollable: [""],
       },
    */
    sheetFooter: {
      template: "systems/degenesisnext/templates/partials/sheet.footer.hbs"
    }
  };
  static TABS = [];
  /** Preparing sheet context */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.document = this.document;
    context.system = this.document.system;
    context.fields = this.document.schema.fields;
    context.systemFields = this.document.system.schema.fields;
    context.mode = this._mode;
    context.isEditable = this.isEditable;
    context.members = this.actor.system.members;
    return context;
  }
  /*  async _preparePartContext(partId, context) {
    switch (partId) {
      case "general":
        context.tab = context.tabs[partId];
      case "stats":
        context.tab = context.tabs[partId];
      case "effects":
        context.tab = context.tabs[partId];
      case "combat":
        context.tab = context.tabs[partId];
      case "inventory":
        context.tab = context.tabs[partId];
      case "history":
        context.tab = context.tabs[partId];
        break;
      default:
    }
    return context;
  } */
  getTabs() {
    let tabs = [];
    return tabs;
  }
  /** @inheritdoc */
  async _onFirstRender(context, options) {
    await super._onFirstRender(context, options);
  }
  activateListeners(html) {
    super.activateListeners(html);
  }
  /** @inheritdoc */
  _onRender(context, options) {
    console.log(this);
    super._onRender(context, options);
  }
  async _renderFrame(options) {
    const html = await super._renderFrame(options);
    return html;
  }
  _onResize(event) {
    super._onResize(event);
  }
  async _onDrop(event) {
    event.preventDefault();
    return super._onDrop(event);
  }
}
const _module$3 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ActorSheetMixin,
  DGNSCharacterSheet,
  DGNSGroupSheet
}, Symbol.toStringTag, { value: "Module" }));
const { api: api$4, sheets: sheets$4 } = foundry.applications;
function ItemSheetMixin(Base) {
  return class DGNSItemSheet extends api$4.HandlebarsApplicationMixin(Base) {
    static TABS = [];
    static MODES = {
      PLAY: 1,
      EDIT: 2
    };
    _mode = this.constructor.MODES.PLAY;
    _dropdownState = {};
    constructor(object, options = {}) {
      super(object, options);
    }
    /** @inheritdoc */
    async close(options) {
      options = { animate: false };
      await super.close(options);
    }
    /** @inheritdoc */
    async _render(force, { mode, ...options } = {}) {
      console.log(`ItemSheetMixin _render`);
      return super._render(force, { mode, ...options } = {});
    }
    /** @inheritdoc */
    async _renderHTML(context, options) {
      console.log(`ItemSheetMixin _renderHTML`);
      return super._renderHTML(context, options);
    }
    async _renderFrame(options) {
      console.log(`ItemSheetMixin _renderFrame`);
      const html = await super._renderFrame(options);
      const header = html.children[0];
      if (this.isEditable) {
        const toggle = document.createElement("dgns-slidetoggle");
        toggle.checked = this._mode === this.constructor.MODES.EDIT;
        toggle.classList.add("mode-slider");
        toggle.dataset.tooltip = "DGNS.SheetModeEdit";
        toggle.setAttribute(
          "aria-label",
          game.i18n.localize("DGNS.SheetModeEdit")
        );
        toggle.addEventListener("change", this._onChangeSheetMode.bind(this));
        toggle.addEventListener("dblclick", (event) => event.stopPropagation());
        header.insertAdjacentElement("afterbegin", toggle);
      }
      return html;
    }
    async _prepareContext(options) {
      const context = await super._prepareContext(options);
      if (!this._dropdownState) {
        this._dropdownState = {};
      }
      context.editable = this.isEditable && this._mode === this.constructor.MODES.EDIT;
      context.cssClass = context.editable ? "editable" : this.isEditable ? "interactable" : "locked";
      return context;
    }
    activateListeners(html) {
      console.log(`ItemSheetMixin activateListeners.`);
      console.log(this._dropdownState);
      html.querySelectorAll(".section-dropdown").forEach((sectionEl) => {
        const sectionId = sectionEl.dataset.section;
        const body = sectionEl.querySelector(".section-body");
        const toggleBtn = sectionEl.querySelector(".dropdown-toggle");
        if (!(sectionId in this._dropdownState)) {
          this._dropdownState[sectionId] = sectionEl.dataset.collapsed === "true" ? true : false;
        }
        if (this._dropdownState[sectionId]) {
          body.classList.add("collapsed");
        }
        toggleBtn?.addEventListener("click", (event) => {
          const isCollapsed = body.classList.contains("collapsed");
          body.classList.toggle("collapsed");
          this._dropdownState[sectionId] = !isCollapsed;
        });
      });
    }
    async _onChangeSheetMode(event) {
      const { MODES } = this.constructor;
      const toggle = event.currentTarget;
      const label = game.i18n.localize(
        `DGNS.SheetMode${toggle.checked ? "Play" : "Edit"}`
      );
      toggle.dataset.tooltip = label;
      toggle.setAttribute("aria-label", label);
      this._mode = toggle.checked ? MODES.EDIT : MODES.PLAY;
      await this.submit();
      console.log(`Current mode`, this._mode);
      this.render();
    }
    _onChangeTab(event, tabs, active) {
      super._onChangeTab(event, tabs, active);
      console.log(`Tab Change fired`);
      this.form.className = this.form.className.replace(/tab-\w+/g, "");
      this.form.classList.add(`tab-${active}`);
    }
    /** Events handling */
    _onRender(context, options) {
      super._onRender(context, options);
      this.activateListeners(this.element);
    }
    _onResize(event) {
      super._onResize(event);
    }
    /** Dropdown sections handling  */
    _onDropdownToggle(event) {
      try {
        let target = event.currentTarget;
        let dropdown = target.dataset.dropdown;
        console.log(target.attributes);
      } catch (err) {
        console.log(err);
      }
    }
  };
}
function BackgroundSheetMixin(Base) {
  return class extends Base {
    static DEFAULT_OPTIONS = {
      actions: {
        changeSheetBackground: this._onChangeSheetBackground,
        clearSheetBackground: this._onClearSheetBackground
      },
      window: {
        controls: [
          {
            action: "changeSheetBackground",
            icon: "fa-solid fa-user-circle",
            label: "SHEET.ChangeBackground",
            ownership: "OWNER"
          },
          {
            action: "clearSheetBackground",
            icon: "fa-solid fa-user-circle",
            label: "SHEET.ClearBackground",
            ownership: "OWNER"
          }
        ]
      }
    };
    static async _onChangeSheetBackground(event, target) {
      const document2 = this.document;
      const filePicker = new FilePicker({
        type: "image",
        current: document2.system.backgroundImage || "",
        callback: async (path) => {
          if (path) {
            try {
              await document2.update({
                "system.backgroundImage": path
              });
              ui.notifications.info(
                game.i18n.format("DGNS.Notifications.BackgroundUpdated", {
                  path
                })
              );
            } catch (error) {
              console.error("Degenesis | Background Update Error:", error);
              ui.notifications.error("Failed to update background image.");
            }
          }
        }
      });
      return filePicker.browse();
    }
    static async _onClearSheetBackground(event, target) {
      try {
        await this.document.update({
          "system.backgroundImage": null
        });
      } catch (err) {
        console.error("Degenesis | Background Clear Error:", err);
      }
    }
    async _prepareContext(options) {
      const context = await super._prepareContext(options);
      context.backgroundImage = this.document.system.backgroundImage;
      context.bgStyle = context.backgroundImage ? `background-image: url('${context.backgroundImage}');` : "";
      return context;
    }
  };
}
const { api: api$3, sheets: sheets$3 } = foundry.applications;
const { TextEditor: TextEditor$3 } = foundry.applications.ux;
const { FilePicker: FilePicker$4 } = foundry.applications.apps;
class DegenesisWeaponSheet extends ItemSheetMixin(
  sheets$3.ItemSheetV2
) {
  static DEFAULT_OPTIONS = {
    actions: {},
    form: {
      submitOnChange: true
    },
    window: {
      controls: [],
      resizable: true,
      frame: true
    },
    position: {
      width: 600,
      height: 600
    },
    classes: ["dgns-weapon", "dgns-item", "sheet-customizable"]
  };
  static PARTS = {
    sheetTitle: {
      template: "systems/degenesisnext/templates/partials/sheet.title.bar.hbs"
      // without input field
    },
    itemHeader: {
      template: "systems/degenesisnext/templates/partials/item.header.hbs"
    },
    tabs: {
      template: "systems/degenesisnext/templates/partials/item.tabs.hbs",
      scrollable: [""]
    },
    description: {
      template: "systems/degenesisnext/templates/partials/item.tab.description.hbs",
      scrollable: [""]
    },
    details: {
      template: "systems/degenesisnext/templates/items/weapon.sheet/ws.details.hbs",
      scrollable: [""]
    },
    qualities: {
      template: "systems/degenesisnext/templates/items/weapon.sheet/ws.qualities.hbs",
      scrollable: [""]
    },
    sheetFooter: {
      template: "systems/degenesisnext/templates/partials/sheet.footer.hbs"
    }
  };
  static TABS = {
    main: {
      initial: "description",
      // Set the initial tab
      tabs: [
        { id: "description", label: "DGNS.Description" },
        { id: "details", label: "DGNS.Details" },
        { id: "qualities", label: "DGNS.Qualities" },
        { id: "effects", label: "DGNS.Effects" }
      ]
    }
  };
  /* -------------------------------------------------------------------------- */
  /*                                   Context                                  */
  /* -------------------------------------------------------------------------- */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    Object.assign(context, {
      mode: this._mode,
      document: this.document,
      system: this.document.system,
      fields: this.document.schema.fields,
      systemFields: this.document.system.schema.fields,
      isEditable: this.isEditable,
      // System data
      qualities: Qualities.weapon,
      qualities2: Qualities.agent,
      // Tabs
      tabGroups: this.tabGroups,
      mainTabs: this._prepareTabs("main"),
      // main navigation groups
      enriched: {
        description: await TextEditor$3.enrichHTML(
          this.document.system.description
        )
      }
    });
    console.log(`WeaponSheet | Context`);
    console.log(context);
    return context;
  }
  async _preparePartContext(partId, context, options) {
    if (context.mainTabs?.[partId]) {
      context.tab = context.mainTabs[partId];
    }
    return context;
  }
  /**
   * Format window title.
   */
  get title() {
    return `${this.document.name}`;
  }
}
const { api: api$2, sheets: sheets$2 } = foundry.applications;
const { TextEditor: TextEditor$2 } = foundry.applications.ux;
const { FilePicker: FilePicker$3 } = foundry.applications.apps;
class DegenesisCultureSheet extends BackgroundSheetMixin(
  ItemSheetMixin(sheets$2.ItemSheetV2)
) {
  static DEFAULT_OPTIONS = {
    actions: {
      addCommonCult: this.#addCommonCult,
      removeCommonCult: this.#removeCommonCult
    },
    form: {
      submitOnChange: true
    },
    window: {
      controls: [
        {
          action: "changeSheetBackground",
          icon: "fa-solid fa-user-circle",
          label: "SHEET.ChangeBackground",
          ownership: "OWNER"
        }
      ],
      resizable: true,
      frame: true
    },
    position: {
      width: 700,
      height: 800
    },
    classes: ["dgns-culture", "sheet-customizable"]
  };
  static PARTS = {
    sheetHeader: {
      template: "systems/degenesisnext/templates/partials/sheet.title.hbs"
    },
    cultureHeader: {
      template: "systems/degenesisnext/templates/items/culture.sheet/header.hbs"
    },
    cultureData: {
      template: "systems/degenesisnext/templates/items/culture.sheet/data.hbs"
    },
    cultureLore: {
      template: "systems/degenesisnext/templates/items/culture.sheet/lore.hbs"
    }
    /* actorHeader: {
          template:
            "systems/degenesisnext/templates/actors/character.sheet/cs.header.hbs",
        },
        tabs: {
          template:
            "systems/degenesisnext/templates/actors/character.sheet/cs.tabs.hbs",
          scrollable: [""],
        },
        general: {
          template:
            "systems/degenesisnext/templates/actors/character.sheet/cs.general.hbs",
          scrollable: [""],
        },
        stats: {
          template:
            "systems/degenesisnext/templates/actors/character.sheet/cs.stats.hbs",
          scrollable: [""],
        },
        effects: {
          template:
            "systems/degenesisnext/templates/actors/character.sheet/cs.effects.hbs",
          scrollable: [""],
        },
        combat: {
          template:
            "systems/degenesisnext/templates/actors/character.sheet/cs.combat.hbs",
          scrollable: [""],
        },
    
        inventory: {
          template:
            "systems/degenesisnext/templates/actors/character.sheet/cs.inventory.hbs",
          scrollable: [""],
        },
        history: {
          template:
            "systems/degenesisnext/templates/actors/character.sheet/cs.history.hbs",
          scrollable: [".container-scrollable"],
        },
    
        sheetFooter: {
          template: "systems/degenesisnext/templates/partials/sheet.footer.hbs",
        }, */
  };
  static TABS = [];
  /** Preparing sheet context */
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.document = this.document;
    context.system = this.document.system;
    context.fields = this.document.schema.fields;
    context.systemFields = this.document.system.schema.fields;
    context.isEditable = this.isEditable;
    context.tabGroups = this.tabGroups;
    context.tabs = this.getTabs();
    context.mode = this._mode;
    context.enriched = {
      description: await TextEditor$2.enrichHTML(
        this.document.system.description
      )
      /*  biography: await TextEditor.enrichHTML(this.document.system.biography, {
        secrets: this.document.isOwner,
      }),
      ownerNotes: await TextEditor.enrichHTML(this.document.system.ownerNotes, {
        secrets: this.document.isOwner,
      }),
      gmNotes: await TextEditor.enrichHTML(this.document.system.gmNotes, {
        secrets: this.document.isOwner,
      }), */
    };
    console.log(`Sheet context:`);
    console.log(context);
    return context;
  }
  async _preparePartContext(partId, context) {
    return context;
  }
  getTabs() {
    let tabGroup = "primary";
    if (!this.tabGroups[tabGroup]) this.tabGroups[tabGroup] = "general";
    let tabs = {
      /*
      general: {
        id: "general",
        label: "archetype",
        group: tabGroup,
        cssClass: this.tabGroups.primary === this.id ? "active" : "",
      },
      stats: {
        id: "stats",
        label: "statistics",
        group: tabGroup,
        cssClass: this.tabGroups.primary === this.id ? "active" : "",
      },
      effects: {
        id: "effects",
        label: "effects",
        group: tabGroup,
        cssClass: this.tabGroups.primary === this.id ? "active" : "",
      },
      combat: {
        id: "combat",
        label: "combat",
        group: tabGroup,
        cssClass: this.tabGroups.primary === this.id ? "active" : "",
      },
      inventory: {
        id: "inventory",
        label: "inventory",
        group: tabGroup,
        cssClass: this.tabGroups.primary === this.id ? "active" : "",
      },
      history: {
        id: "history",
        label: "history",
        group: tabGroup,
        cssClass: this.tabGroups.primary === this.id ? "active" : "",
      },*/
    };
    for (let tab in tabs) {
      if (this.tabGroups[tabGroup] === tabs[tab].id) {
        tabs[tab].cssClass = "active";
        tabs[tab].active = true;
      }
    }
    return tabs;
  }
  /**
   * Creating initial context menus for permanent objects
   */
  createContextMenus() {
  }
  /** @inheritdoc */
  async _onFirstRender(context, options) {
    await super._onFirstRender(context, options);
  }
  /** @inheritdoc */
  _onRender(context, options) {
    super._onRender(context, options);
  }
  activateListeners(html) {
    super.activateListeners(html);
  }
  _onResize(event) {
    super._onResize(event);
  }
  // UI Actions
  static async #changeSheetBackground() {
    await super.changeSheetBackground();
  }
  /*   static async #changeSheetBackground() {
      const filePicker = new FilePicker({
        type: "image",
        wildcard: true,
        callback: async (path) => {
          if (path) {
            try {
              await this.document.update({
                ["system.backgroundImage"]: path,
              });
              ui.notifications.info(
                `Updated ${this.document.name} backgroundImage to: ${path}`
              );
            } catch (error) {
              console.error("Error updating document:", error);
              ui.notifications.error("Failed to update document");
            }
          } else {
            console.log("No path received in callback");
          }
        },
      });
  
      await filePicker.browse();
    } */
  // Data Actions
  /**
   * Add new Common Cult to system.commonCults array
   */
  static async #addCommonCult(event, target) {
    const cults = this.document.system.commonCults;
    cults.push("");
    await this.document.update({ "system.commonCults": cults });
  }
  /**
   * Remove Common Cult from system.commonCults array
   * @param {*} event
   * @param {*} target
   */
  static async #removeCommonCult(event, target) {
    const cults = this.document.system.commonCults;
    const index = target.dataset.index;
    cults.splice(index, 1);
    await this.document.update({ "system.commonCults": cults });
  }
}
const { api: api$1, sheets: sheets$1 } = foundry.applications;
const { TextEditor: TextEditor$1 } = foundry.applications.ux;
const { FilePicker: FilePicker$2 } = foundry.applications.apps;
class DegenesisConceptSheet extends BackgroundSheetMixin(
  ItemSheetMixin(sheets$1.ItemSheetV2)
) {
  static DEFAULT_OPTIONS = {
    actions: {},
    form: {
      submitOnChange: true
    },
    window: {
      controls: [],
      resizable: true,
      frame: true
    },
    position: {
      width: 700,
      height: 800
    },
    classes: ["dgns-concept", "sheet-customizable"]
  };
  static PARTS = {
    sheetHeader: {
      template: "systems/degenesisnext/templates/partials/sheet.title.hbs"
    },
    conceptHeader: {
      template: "systems/degenesisnext/templates/items/concept.sheet/header.hbs"
    },
    conceptData: {
      template: "systems/degenesisnext/templates/items/concept.sheet/data.hbs"
    },
    conceptLore: {
      template: "systems/degenesisnext/templates/items/concept.sheet/lore.hbs"
    }
  };
  static TABS = [];
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.document = this.document;
    context.system = this.document.system;
    context.fields = this.document.schema.fields;
    context.systemFields = this.document.system.schema.fields;
    context.isEditable = this.isEditable;
    context.mode = this._mode;
    context.enriched = {
      description: await TextEditor$1.enrichHTML(
        this.document.system.description
      )
    };
    return context;
  }
  // Data Actions
  /**
   * Add new Common Cult to system.commonCults array
   */
  static async #addCommonCult(event, target) {
    const cults = this.document.system.commonCults;
    cults.push("");
    await this.document.update({ "system.commonCults": cults });
  }
  /**
   * Remove Common Cult from system.commonCults array
   * @param {*} event
   * @param {*} target
   */
  static async #removeCommonCult(event, target) {
    const cults = this.document.system.commonCults;
    const index = target.dataset.index;
    cults.splice(index, 1);
    await this.document.update({ "system.commonCults": cults });
  }
}
const { api, sheets } = foundry.applications;
const { TextEditor } = foundry.applications.ux;
const { FilePicker: FilePicker$1 } = foundry.applications.apps;
class DegenesisCultSheet extends BackgroundSheetMixin(
  ItemSheetMixin(sheets.ItemSheetV2)
) {
  static DEFAULT_OPTIONS = {
    actions: {},
    form: {
      submitOnChange: true
    },
    window: {
      resizable: true,
      frame: true
    },
    position: {
      width: 700,
      height: 800
    },
    classes: ["dgns-cult", "sheet-customizable"]
  };
  static PARTS = {
    sheetHeader: {
      template: "systems/degenesisnext/templates/partials/sheet.title.hbs"
    },
    conceptHeader: {
      template: "systems/degenesisnext/templates/items/cult.sheet/header.hbs"
    },
    conceptData: {
      template: "systems/degenesisnext/templates/items/cult.sheet/data.hbs"
    },
    conceptLore: {
      template: "systems/degenesisnext/templates/items/cult.sheet/lore.hbs"
    }
  };
  static TABS = [];
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.document = this.document;
    context.system = this.document.system;
    context.fields = this.document.schema.fields;
    context.systemFields = this.document.system.schema.fields;
    context.isEditable = this.isEditable;
    context.mode = this._mode;
    context.enriched = {
      description: await TextEditor.enrichHTML(
        this.document.system.description
      )
    };
    console.log(`CultSheet | Context`);
    console.log(context);
    return context;
  }
  // Data Actions
  /**
   * Add new Common Cult to system.commonCults array
   */
  /*   static async #addCommonCult(event, target) {
    const cults = this.document.system.commonCults;
    cults.push("");
    await this.document.update({ "system.commonCults": cults });
  } */
  /**
   * Remove Common Cult from system.commonCults array
   * @param {*} event
   * @param {*} target
   */
  /*  static async #removeCommonCult(event, target) {
    const cults = this.document.system.commonCults;
    const index = target.dataset.index;
    cults.splice(index, 1);
    await this.document.update({ "system.commonCults": cults });
  } */
}
const _module$2 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  BackgroundSheetMixin,
  DGNSConceptSheet: DegenesisConceptSheet,
  DGNSCultSheet: DegenesisCultSheet,
  DGNSCultureSheet: DegenesisCultureSheet,
  DGNSWeaponSheet: DegenesisWeaponSheet,
  ItemSheetMixin
}, Symbol.toStringTag, { value: "Module" }));
function StyleSheetMixin(Base) {
  return class StyleSheetElement extends Base {
    /**
     * A map of cached stylesheets per Document root.
     * @type {WeakMap<WeakKey<Document>, CSSStyleSheet>}
     * @protected
     */
    static _stylesheets = /* @__PURE__ */ new WeakMap();
    /**
     * The CSS content for this element.
     * @type {string}
     */
    static CSS = "";
    /* -------------------------------------------- */
    /** @inheritDoc */
    adoptedCallback() {
      const sheet = this._getStyleSheet();
      if (sheet) this._adoptStyleSheet(this._getStyleSheet());
    }
    /* -------------------------------------------- */
    /**
     * Retrieves the cached stylesheet, or generates a new one.
     * @returns {CSSStyleSheet}
     * @protected
     */
    _getStyleSheet() {
      let sheet = this.constructor._stylesheets.get(this.ownerDocument);
      if (!sheet && this.ownerDocument.defaultView) {
        sheet = new this.ownerDocument.defaultView.CSSStyleSheet();
        sheet.replaceSync(this.constructor.CSS);
        this.constructor._stylesheets.set(this.ownerDocument, sheet);
      }
      return sheet;
    }
    /* -------------------------------------------- */
    /**
     * Adopt the stylesheet into the Shadow DOM.
     * @param {CSSStyleSheet} sheet  The sheet to adopt.
     * @abstract
     */
    _adoptStyleSheet(sheet) {
    }
  };
}
class CheckboxElement extends StyleSheetMixin(
  foundry.applications.elements.AbstractFormInputElement
) {
  constructor(...args) {
    super(...args);
    this._internals.role = "checkbox";
    this._value = this.getAttribute("value");
    this.#defaultValue = this._value;
    if (this.constructor.useShadowRoot)
      this.#shadowRoot = this.attachShadow({ mode: "closed" });
  }
  /* -------------------------------------------- */
  /** @override */
  static tagName = "dgns-checkbox";
  /* -------------------------------------------- */
  /**
   * Should a show root be created for this element?
   */
  static useShadowRoot = true;
  /* -------------------------------------------- */
  /** @override */
  static CSS = `
        :host {
          cursor: pointer;
          display: inline-block;
          width: var(--checkbox-size, 18px);
          height: var(--checkbox-size, 18px);
          aspect-ratio: 1;
        }
    
        :host(:disabled) { cursor: default; }
    
        :host > div {
          width: 100%;
          height: 100%;
          border-radius: var(--checkbox-border-radius, 3px);
          border: var(--checkbox-border-width, 2px) solid var(--checkbox-border-color, var(--dnd5e-color-gold));
          background: var(--checkbox-empty-color, transparent);
          box-sizing: border-box;
          position: relative;
        }
    
        :host :is(.checked, .disabled, .indeterminate) {
          display: none;
          height: 100%;
          width: 100%;
          align-items: center;
          justify-content: center;
          position: absolute;
          inset: 0;
        }
    
        :host([checked]) :is(.checked, .disabled, .indeterminate) {
          background: var(--checkbox-fill-color, var(--dnd5e-color-gold));
        }
    
        :host([checked]) .checked { display: flex; }
        :host([indeterminate]) .indeterminate { display: flex; }
        :host([indeterminate]) .checked { display: none; }
        :host(:disabled) .disabled { display: flex; }
        :host(:disabled) .checked { display: none; }
        :host(:disabled) .indeterminate { display: none; }
      `;
  /* -------------------------------------------- */
  /**
   * Controller for removing listeners automatically.
   * @type {AbortController}
   */
  _controller;
  /* -------------------------------------------- */
  /**
   * The shadow root that contains the checkbox elements.
   * @type {ShadowRoot}
   */
  #shadowRoot;
  /* -------------------------------------------- */
  /*  Element Properties                          */
  /* -------------------------------------------- */
  /**
   * The default value as originally specified in the HTML that created this object.
   * @type {string}
   */
  get defaultValue() {
    return this.#defaultValue;
  }
  #defaultValue;
  /* -------------------------------------------- */
  /**
   * The indeterminate state of the checkbox.
   * @type {boolean}
   */
  get indeterminate() {
    return this.hasAttribute("indeterminate");
  }
  set indeterminate(indeterminate) {
    this.toggleAttribute("indeterminate", indeterminate);
  }
  /* -------------------------------------------- */
  /**
   * The checked state of the checkbox.
   * @type {boolean}
   */
  get checked() {
    return this.hasAttribute("checked");
  }
  set checked(checked) {
    this.toggleAttribute("checked", checked);
    this._refresh();
  }
  /* -------------------------------------------- */
  /** @override */
  get value() {
    return super.value;
  }
  /**
   * Override AbstractFormInputElement#value setter because we want to emit input/change events when the checked state
   * changes, and not when the value changes.
   * @override
   */
  set value(value) {
    this._setValue(value);
  }
  /** @override */
  _getValue() {
    if (typeof this._value === "string") return this._value;
    return this.checked;
  }
  /* -------------------------------------------- */
  /*  Element Lifecycle                           */
  /* -------------------------------------------- */
  /** @override */
  connectedCallback() {
    this._adoptStyleSheet(this._getStyleSheet());
    const elements = this._buildElements();
    this.#shadowRoot.replaceChildren(...elements);
    this._refresh();
    this._activateListeners();
    if (!this.hasAttribute("tabindex")) this.tabIndex = 0;
  }
  /* -------------------------------------------- */
  /** @override */
  disconnectedCallback() {
    this._controller.abort();
  }
  /* -------------------------------------------- */
  /** @override */
  _adoptStyleSheet(sheet) {
    this.#shadowRoot.adoptedStyleSheets = [sheet];
  }
  /* -------------------------------------------- */
  /** @override */
  _buildElements() {
    const container = document.createElement("div");
    container.innerHTML = `
          <div class="checked">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                 style="fill: var(--checkbox-icon-color, #000); width: var(--checkbox-icon-size, 68%);">
              <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path d="M438.6 105.4c12.5 12.5 12.5 32.8 0 45.3l-256 256c-12.5 12.5-32.8 12.5-45.3 0l-128-128c-12.5-12.5-12.5-32.8 0-45.3s32.8-12.5 45.3 0L160 338.7 393.4 105.4c12.5-12.5 32.8-12.5 45.3 0z"/>
            </svg>
          </div>
          <div class="disabled">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                 style="fill: var(--checkbox-icon-color, #000); width: var(--checkbox-icon-size, 68%);">
              <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"/>
            </svg>
          </div>
          <div class="indeterminate">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"
                 style="fill: var(--checkbox-icon-color, #000); width: var(--checkbox-icon-size, 68%);">
              <!--!Font Awesome Free 6.5.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2024 Fonticons, Inc.-->
              <path d="M432 256c0 17.7-14.3 32-32 32L48 288c-17.7 0-32-14.3-32-32s14.3-32 32-32l352 0c17.7 0 32 14.3 32 32z"/>
            </svg>
          </div>
        `;
    return [container];
  }
  /* -------------------------------------------- */
  /** @override */
  _activateListeners() {
    const { signal } = this._controller = new AbortController();
    this.addEventListener("click", this._onClick.bind(this), { signal });
    this.addEventListener(
      "keydown",
      (event) => event.key === " " ? this._onClick(event) : null,
      { signal }
    );
  }
  /* -------------------------------------------- */
  /** @override */
  _refresh() {
    super._refresh();
    this._internals.ariaChecked = `${this.hasAttribute("checked")}`;
  }
  /* -------------------------------------------- */
  /** @override */
  _onClick(event) {
    event.preventDefault();
    this.checked = !this.checked;
    this.dispatchEvent(new Event("input", { bubbles: true, cancelable: true }));
    this.dispatchEvent(
      new Event("change", { bubbles: true, cancelable: true })
    );
  }
}
const icons$1 = {
  0: `<svg width="48" height="48" viewBox="0 0 512 512">
    <g style="display:inline">
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#fff;stroke-width:6.36819;stroke-opacity:1" d="M94.244 262.83s-7.901 7.176 0 15.219c0 0 64 60.292 130.927 76.878 0 0 49.212 15.117 104.78-13.073 0 0 45.464-17.952 93.659-61.074 0 0 12.292-8.585.39-19.902 0 0-48.39-48-105.17-67.707 0 0-56.976-21.073-111.22-2.147 0 0-50.537 13.464-113.366 71.805z"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M124.098 262.049s-11.903 8.39-.196 15.22c0 0 38.244 34.146 76.098 48.194 0 0 51.122 25.561 117.268.78 0 0 43.903-16.194 77.269-47.414 0 0 15.22-4.878-.196-19.512 0 0-37.853-29.854-73.17-44.878 0 0-62.83-25.56-112.586-3.122 0 0-46.244 15.024-84.487 50.732z"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M325.205 266.32a64.683 64.683 0 0 1-61.742 67.47 64.683 64.683 0 0 1-67.495-61.715 64.683 64.683 0 0 1 61.687-67.52 64.683 64.683 0 0 1 67.546 61.659"/>
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M284.465 268.711a23.707 23.707 0 0 1-22.63 24.729 23.707 23.707 0 0 1-24.738-22.62 23.707 23.707 0 0 1 22.61-24.747 23.707 23.707 0 0 1 24.756 22.6"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.923;stroke-opacity:1" d="M213.284 249.497s1.626 9.164 5.912 2.66c0 0 5.026-13.894 16.555-20.988 0 0 7.094-7.39-3.843-5.765 0 0-18.033 10.938-18.624 24.093zM305.656 292.36s-1.1-9.242-5.75-2.994c0 0-5.812 13.584-17.728 20.008 0 0-7.505 6.973 3.508 5.975 0 0 18.628-9.89 19.97-22.989z"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M121.325 270.135s127.374 143.321 277.754.008"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M104.126 284.547s145.29-183.174 312.17 1.145"/>
    </g>
</svg>`,
  1: `<svg width="48" height="48" viewBox="0 0 512 512">
    <g style="display:inline">
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#fff;stroke-width:6.36819;stroke-opacity:1" d="M93.858 262.383s-7.901 7.176 0 15.22c0 0 64 60.292 130.927 76.877 0 0 49.212 15.117 104.78-13.073 0 0 45.463-17.951 93.659-61.073 0 0 12.292-8.586.39-19.903 0 0-48.39-48-105.17-67.707 0 0-56.977-21.073-111.22-2.146 0 0-50.537 13.463-113.366 71.805z" transform="translate(.592 -.32)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:5.51662;stroke-opacity:1" d="M123.69 263.292s-11.938 6.278-.196 11.387c0 0 38.359 25.548 76.326 36.06 0 0 51.275 19.124 117.62.584 0 0 44.034-12.118 77.5-35.476 0 0 15.265-3.65-.195-14.599 0 0-37.968-22.336-73.39-33.577 0 0-63.018-19.124-112.924-2.336 0 0-46.382 11.241-84.74 37.957z" transform="translate(.592 -.32)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M325.205 266.32a64.683 64.683 0 0 1-61.742 67.47 64.683 64.683 0 0 1-67.495-61.715 64.683 64.683 0 0 1 61.687-67.52 64.683 64.683 0 0 1 67.546 61.659" transform="translate(.592 -.32)"/>
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M284.465 268.711a23.707 23.707 0 0 1-22.63 24.729 23.707 23.707 0 0 1-24.738-22.62 23.707 23.707 0 0 1 22.61-24.747 23.707 23.707 0 0 1 24.756 22.6" transform="translate(.592 -.32)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.923;stroke-opacity:1" d="M213.284 249.497s1.626 9.164 5.912 2.66c0 0 5.026-13.894 16.555-20.988 0 0 7.094-7.39-3.843-5.765 0 0-18.033 10.938-18.624 24.093zM305.656 292.36s-1.1-9.242-5.75-2.994c0 0-5.812 13.584-17.728 20.008 0 0-7.505 6.973 3.508 5.975 0 0 18.628-9.89 19.97-22.989z" transform="translate(.592 -.32)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.54415;stroke-opacity:1" d="M196.971 225.62s75.049-9.364 128.155-.204l-8.904-25.85-59.784-5.088-51.835 12.212z" transform="translate(.592 -.32)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.54172;stroke-opacity:1" d="M197.187 310.905s52.157 11.767 127.21-.406l-14.947 21.708-75.372 5.073z" transform="translate(.592 -.32)"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M120.933 269.35s131.926 104.049 277.987.392"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M101.977 281.578s145.93-137.177 316.89 1.446"/>
    </g>
</svg>
`,
  2: `<svg width="48" height="48" viewBox="0 0 512 512">
    <g style="display:inline">
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#fff;stroke-width:6.36819;stroke-opacity:1" d="M94.037 263.131s-7.9 7.177 0 15.22c0 0 64 60.292 130.927 76.878 0 0 49.212 15.117 104.78-13.073 0 0 45.464-17.952 93.66-61.073 0 0 12.292-8.586.39-19.903 0 0-48.39-48-105.171-67.707 0 0-56.976-21.073-111.22-2.147 0 0-50.536 13.464-113.366 71.805z" transform="translate(4.964 -3.906)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:4.84134;stroke-opacity:1" d="M123.367 264.59s-11.966 4.823-.196 8.749c0 0 38.45 19.63 76.507 27.706 0 0 51.396 14.694 117.898.449 0 0 44.139-9.31 77.684-27.258 0 0 15.301-2.804-.196-11.217 0 0-38.057-17.162-73.564-25.799 0 0-63.167-14.694-113.19-1.794 0 0-46.493 8.637-84.943 29.164z" transform="translate(4.964 -3.906)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M325.205 266.32a64.683 64.683 0 0 1-61.742 67.47 64.683 64.683 0 0 1-67.495-61.715 64.683 64.683 0 0 1 61.687-67.52 64.683 64.683 0 0 1 67.546 61.659" transform="translate(4.964 -3.906)"/>
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M284.465 268.711a23.707 23.707 0 0 1-22.63 24.729 23.707 23.707 0 0 1-24.738-22.62 23.707 23.707 0 0 1 22.61-24.747 23.707 23.707 0 0 1 24.756 22.6" transform="translate(4.964 -3.906)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.923;stroke-opacity:1" d="M213.284 249.497s1.626 9.164 5.912 2.66c0 0 5.026-13.894 16.555-20.988 0 0 7.094-7.39-3.843-5.765 0 0-18.033 10.938-18.624 24.093zM305.656 292.36s-1.1-9.242-5.75-2.994c0 0-5.812 13.584-17.728 20.008 0 0-7.505 6.973 3.508 5.975 0 0 18.628-9.89 19.97-22.989z" transform="translate(4.964 -3.906)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.76492;stroke-opacity:1" d="M197.15 237.421s74.88-12.259 127.867-.266l-8.884-33.845-59.65-6.663-51.718 15.99z" transform="translate(4.964 -3.906)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.8381;stroke-opacity:1" d="M197.378 299.572s52.001 16.776 126.832-.579l-14.902 30.95-75.148 7.231z" transform="translate(4.964 -3.906)"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M125.644 264.245s125.303 85.038 280.002-.164"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M103.142 276.68s138.829-110.156 325.01-.9"/>
    </g>
</svg>
`,
  3: `<svg width="48" height="48" viewBox="0 0 512 512" >
    <g style="display:inline">
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#fff;stroke-width:6.36819;stroke-opacity:1" d="M95.418 262.37s-7.9 7.177 0 15.22c0 0 64 60.292 130.927 76.877 0 0 49.212 15.117 104.78-13.073 0 0 45.464-17.951 93.659-61.073 0 0 12.293-8.585.39-19.903 0 0-48.39-48-105.17-67.707 0 0-56.976-21.073-111.22-2.146 0 0-50.537 13.463-113.366 71.805z" transform="translate(5.44 -1.314)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:3.91754;stroke-opacity:1" d="M122.924 263.87s-12.006 3.147-.197 5.71c0 0 38.574 12.81 76.755 18.082 0 0 51.563 9.59 118.281.293 0 0 44.282-6.077 77.936-17.79 0 0 15.351-1.83-.197-7.32 0 0-38.18-11.202-73.803-16.839 0 0-63.372-8.63-113.558-.21 0 0-46.643 4.676-85.217 18.073z" transform="translate(5.44 -1.314)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M325.205 266.32a64.683 64.683 0 0 1-61.742 67.47 64.683 64.683 0 0 1-67.495-61.715 64.683 64.683 0 0 1 61.687-67.52 64.683 64.683 0 0 1 67.546 61.659" transform="translate(5.44 -1.314)"/>
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M284.465 268.711a23.707 23.707 0 0 1-22.63 24.729 23.707 23.707 0 0 1-24.738-22.62 23.707 23.707 0 0 1 22.61-24.747 23.707 23.707 0 0 1 24.756 22.6" transform="translate(5.44 -1.314)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.923;stroke-opacity:1" d="M213.284 249.497s1.626 9.164 5.912 2.66c0 0 5.026-13.894 16.555-20.988 0 0 7.094-7.39-3.843-5.765 0 0-18.033 10.938-18.624 24.093zM305.656 292.36s-1.1-9.242-5.75-2.994c0 0-5.812 13.584-17.728 20.008 0 0-7.505 6.973 3.508 5.975 0 0 18.628-9.89 19.97-22.989z" transform="translate(5.44 -1.314)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.97234;stroke-opacity:1" d="M193.117 251.639s74.727-15.341 127.606-.334l-8.866-42.355-59.529-8.337-51.612 20.01z" transform="translate(5.44 -1.314)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:2.11782;stroke-opacity:1" d="M197.555 287.007s51.857 22.333 126.482-.77l-14.862 41.2-74.94 9.626z" transform="translate(5.44 -1.314)"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M125.836 265.215s126.836 60.898 279.066.082"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M99.84 273.103s165.076-60.739 333.46 1.562"/>
    </g>
</svg>
`,
  4: `<svg width="48" height="48" viewBox="0 0 512 512">
    <g style="display:inline">
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#fff;stroke-width:6.36819;stroke-opacity:1" d="M92.782 263.395s-7.901 7.177 0 15.22c0 0 64 60.292 130.927 76.878 0 0 49.212 15.117 104.78-13.073 0 0 45.464-17.952 93.659-61.073 0 0 12.292-8.586.39-19.903 0 0-48.39-48-105.17-67.707 0 0-56.976-21.073-111.22-2.147 0 0-50.537 13.464-113.366 71.805z" transform="translate(4.337 -2.81)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:2.39967;stroke-opacity:1" d="M122.197 267.061s-12.069 1.175-.198 2.132c0 0 38.78 4.781 77.162 6.749 0 0 51.837 3.58 118.908.109 0 0 44.517-2.268 78.35-6.64 0 0 15.432-.683-.199-2.732 0 0-38.383-4.18-74.194-6.285 0 0-63.708-3.579-114.16-.437 0 0-46.89 2.104-85.669 7.104z" transform="translate(4.337 -2.81)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M325.205 266.32a64.683 64.683 0 0 1-61.742 67.47 64.683 64.683 0 0 1-67.495-61.715 64.683 64.683 0 0 1 61.687-67.52 64.683 64.683 0 0 1 67.546 61.659" transform="translate(4.337 -2.81)"/>
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M284.465 268.711a23.707 23.707 0 0 1-22.63 24.729 23.707 23.707 0 0 1-24.738-22.62 23.707 23.707 0 0 1 22.61-24.747 23.707 23.707 0 0 1 24.756 22.6" transform="translate(4.337 -2.81)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.923;stroke-opacity:1" d="M213.284 249.497s1.626 9.164 5.912 2.66c0 0 5.026-13.894 16.555-20.988 0 0 7.094-7.39-3.843-5.765 0 0-18.033 10.938-18.624 24.093zM305.656 292.36s-1.1-9.242-5.75-2.994c0 0-5.812 13.584-17.728 20.008 0 0-7.505 6.973 3.508 5.975 0 0 18.628-9.89 19.97-22.989z" transform="translate(4.337 -2.81)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:2.19714;stroke-opacity:1" d="M196.972 260.607s72.663-4.505 127.327 1.486l-8.846-52.675-59.398-10.37-51.5 24.887z" transform="translate(4.337 -2.81)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:2.33045;stroke-opacity:1" d="M196.154 275.927s56.458 5.26 127.695-.619l-14.818 50.035-87.394 13.592z" transform="translate(4.337 -2.81)"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M125.654 264.442s132.244 25.842 278.077-.286"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19508;stroke-opacity:1" d="M95.552 269.959s126.156-31.722 335.132-2.245"/>
    </g>
</svg>
`
};
const discomfort = [
  { value: 0, icon: icons$1[0] },
  { value: 1, icon: icons$1[1] },
  { value: 2, icon: icons$1[2] },
  { value: 3, icon: icons$1[3] },
  { value: 4, icon: icons$1[4] }
];
class DiscomfortElement extends StyleSheetMixin(
  foundry.applications.elements.AbstractFormInputElement
) {
  constructor(...args) {
    super(...args);
    this._internals.role = "select";
    this._value = this.getAttribute("value");
    this.#defaultValue = this._value;
    if (this.constructor.useShadowRoot)
      this.#shadowRoot = this.attachShadow({ mode: "open" });
  }
  /* -------------------------------------------- */
  /** @override */
  static tagName = "dgns-discomfort";
  /* -------------------------------------------- */
  /**
   * Should a show root be created for this element?
   */
  static useShadowRoot = false;
  /* -------------------------------------------- */
  /** @override */
  static CSS = ``;
  /* -------------------------------------------- */
  /**
   * Controller for removing listeners automatically.
   * @type {AbortController}
   */
  _controller;
  /* -------------------------------------------- */
  /**
   * The shadow root that contains the checkbox elements.
   * @type {ShadowRoot}
   */
  #shadowRoot;
  /* -------------------------------------------- */
  /*  Element Properties                          */
  /* -------------------------------------------- */
  /**
   * The default value as originally specified in the HTML that created this object.
   * @type {string}
   */
  get defaultValue() {
    return this.#defaultValue;
  }
  #defaultValue;
  get value() {
    return super.value;
  }
  set value(value) {
    this._setValue(value);
  }
  /* -------------------------------------------- */
  /*  Element Lifecycle                           */
  /* -------------------------------------------- */
  /** @override */
  connectedCallback() {
    this._adoptStyleSheet(this._getStyleSheet());
    const elements = this._buildElements();
    if (this.useShadowRoot) {
      this.#shadowRoot.replaceChildren(...elements);
    } else {
      this.replaceChildren(...elements);
    }
    this._refresh();
    this._activateListeners();
    if (!this.hasAttribute("tabindex")) this.tabIndex = 0;
  }
  /* -------------------------------------------- */
  /** @override */
  disconnectedCallback() {
    this._controller.abort();
  }
  /* -------------------------------------------- */
  /** @override */
  _adoptStyleSheet(sheet) {
    if (this.useShadowRoot) {
      this.#shadowRoot.adoptedStyleSheets = [sheet];
    } else this.adoptedStyleSheets = [sheet];
  }
  /* -------------------------------------------- */
  /** @override */
  _buildElements() {
    const container = document.createElement("div");
    const button = document.createElement("button");
    button.setAttribute("id", "discomfortButton");
    button.innerHTML = icons$1[this.value];
    const dropdown = document.createElement("div");
    dropdown.setAttribute("id", "discomfortDropdown");
    dropdown.classList.add("discomfort-dropdown");
    discomfort.forEach((discomfort2) => {
      const item = document.createElement("div");
      item.className = "discomfort-dropdown-item";
      item.setAttribute("data-value", discomfort2.value);
      item.innerHTML = discomfort2.icon;
      item.addEventListener("click", (ev) => {
        let selection = ev.target.closest("div");
        let newValue = selection.getAttribute("data-value");
        this.value = newValue;
        this.dispatchEvent(
          new Event("change", { bubbles: true, cancelable: true })
        );
      });
      dropdown.appendChild(item);
    });
    container.appendChild(button);
    container.appendChild(dropdown);
    return [container];
  }
  /* -------------------------------------------- */
  /** @override */
  _activateListeners() {
    const { signal } = this._controller = new AbortController();
    this.addEventListener("click", this._onClick.bind(this), { signal });
    this.addEventListener(
      "keydown",
      (event) => event.key === " " ? this._onClick(event) : null,
      { signal }
    );
  }
  /* -------------------------------------------- */
  /** @override */
  _refresh() {
    super._refresh();
  }
  /* -------------------------------------------- */
  /** @override */
  _onClick(event) {
    event.preventDefault();
    let dropdown = {};
    if (this.useShadowRoot) {
      dropdown = this.shadowRoot.getElementById("discomfortDropdown");
    } else {
      dropdown = this.firstChild.lastChild;
    }
    dropdown.style.display = dropdown.style.display === "block" ? "none" : "block";
  }
}
class SlideToggleElement extends CheckboxElement {
  /** @inheritDoc */
  constructor() {
    super();
    this._internals.role = "switch";
  }
  /* -------------------------------------------- */
  /** @override */
  static tagName = "dgns-slidetoggle";
  /* -------------------------------------------- */
  /** @override */
  static useShadowRoot = false;
  /* -------------------------------------------- */
  /*  Element Lifecycle                           */
  /* -------------------------------------------- */
  /**
   * Activate the element when it is attached to the DOM.
   * @inheritDoc
   */
  connectedCallback() {
    this.replaceChildren(...this._buildElements());
    this._refresh();
    this._activateListeners();
  }
  /* -------------------------------------------- */
  /**
   * Create the constituent components of this element.
   * @returns {HTMLElement[]}
   * @protected
   */
  _buildElements() {
    const track = document.createElement("div");
    track.classList.add("slide-toggle-track");
    const thumb = document.createElement("div");
    thumb.classList.add("slide-toggle-thumb");
    track.append(thumb);
    return [track];
  }
}
const icons = {
  0: `<svg width="48" height="48" viewBox="0 0 512 512">
    <g style="display:inline">
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#fff;stroke-width:6.36819;stroke-opacity:1" d="M94.244 262.83s-7.901 7.176 0 15.219c0 0 64 60.292 130.927 76.878 0 0 49.212 15.117 104.78-13.073 0 0 45.464-17.952 93.659-61.074 0 0 12.292-8.585.39-19.902 0 0-48.39-48-105.17-67.707 0 0-56.976-21.073-111.22-2.147 0 0-50.537 13.464-113.366 71.805z"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M124.098 262.049s-11.903 8.39-.196 15.22c0 0 38.244 34.146 76.098 48.194 0 0 51.122 25.561 117.268.78 0 0 43.903-16.194 77.269-47.414 0 0 15.22-4.878-.196-19.512 0 0-37.853-29.854-73.17-44.878 0 0-62.83-25.56-112.586-3.122 0 0-46.244 15.024-84.487 50.732z"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M325.205 266.32a64.683 64.683 0 0 1-61.742 67.47 64.683 64.683 0 0 1-67.495-61.715 64.683 64.683 0 0 1 61.687-67.52 64.683 64.683 0 0 1 67.546 61.659"/>
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M284.465 268.711a23.707 23.707 0 0 1-22.63 24.729 23.707 23.707 0 0 1-24.738-22.62 23.707 23.707 0 0 1 22.61-24.747 23.707 23.707 0 0 1 24.756 22.6"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.923;stroke-opacity:1" d="M213.284 249.497s1.626 9.164 5.912 2.66c0 0 5.026-13.894 16.555-20.988 0 0 7.094-7.39-3.843-5.765 0 0-18.033 10.938-18.624 24.093zM305.656 292.36s-1.1-9.242-5.75-2.994c0 0-5.812 13.584-17.728 20.008 0 0-7.505 6.973 3.508 5.975 0 0 18.628-9.89 19.97-22.989z"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M121.325 270.135s127.374 143.321 277.754.008"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M104.126 284.547s145.29-183.174 312.17 1.145"/>
    </g>
</svg>`,
  1: `<svg width="48" height="48" viewBox="0 0 512 512">
    <g style="display:inline">
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#fff;stroke-width:6.36819;stroke-opacity:1" d="M93.858 262.383s-7.901 7.176 0 15.22c0 0 64 60.292 130.927 76.877 0 0 49.212 15.117 104.78-13.073 0 0 45.463-17.951 93.659-61.073 0 0 12.292-8.586.39-19.903 0 0-48.39-48-105.17-67.707 0 0-56.977-21.073-111.22-2.146 0 0-50.537 13.463-113.366 71.805z" transform="translate(.592 -.32)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:5.51662;stroke-opacity:1" d="M123.69 263.292s-11.938 6.278-.196 11.387c0 0 38.359 25.548 76.326 36.06 0 0 51.275 19.124 117.62.584 0 0 44.034-12.118 77.5-35.476 0 0 15.265-3.65-.195-14.599 0 0-37.968-22.336-73.39-33.577 0 0-63.018-19.124-112.924-2.336 0 0-46.382 11.241-84.74 37.957z" transform="translate(.592 -.32)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M325.205 266.32a64.683 64.683 0 0 1-61.742 67.47 64.683 64.683 0 0 1-67.495-61.715 64.683 64.683 0 0 1 61.687-67.52 64.683 64.683 0 0 1 67.546 61.659" transform="translate(.592 -.32)"/>
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M284.465 268.711a23.707 23.707 0 0 1-22.63 24.729 23.707 23.707 0 0 1-24.738-22.62 23.707 23.707 0 0 1 22.61-24.747 23.707 23.707 0 0 1 24.756 22.6" transform="translate(.592 -.32)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.923;stroke-opacity:1" d="M213.284 249.497s1.626 9.164 5.912 2.66c0 0 5.026-13.894 16.555-20.988 0 0 7.094-7.39-3.843-5.765 0 0-18.033 10.938-18.624 24.093zM305.656 292.36s-1.1-9.242-5.75-2.994c0 0-5.812 13.584-17.728 20.008 0 0-7.505 6.973 3.508 5.975 0 0 18.628-9.89 19.97-22.989z" transform="translate(.592 -.32)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.54415;stroke-opacity:1" d="M196.971 225.62s75.049-9.364 128.155-.204l-8.904-25.85-59.784-5.088-51.835 12.212z" transform="translate(.592 -.32)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.54172;stroke-opacity:1" d="M197.187 310.905s52.157 11.767 127.21-.406l-14.947 21.708-75.372 5.073z" transform="translate(.592 -.32)"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M120.933 269.35s131.926 104.049 277.987.392"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M101.977 281.578s145.93-137.177 316.89 1.446"/>
    </g>
</svg>
`,
  2: `<svg width="48" height="48" viewBox="0 0 512 512">
    <g style="display:inline">
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#fff;stroke-width:6.36819;stroke-opacity:1" d="M94.037 263.131s-7.9 7.177 0 15.22c0 0 64 60.292 130.927 76.878 0 0 49.212 15.117 104.78-13.073 0 0 45.464-17.952 93.66-61.073 0 0 12.292-8.586.39-19.903 0 0-48.39-48-105.171-67.707 0 0-56.976-21.073-111.22-2.147 0 0-50.536 13.464-113.366 71.805z" transform="translate(4.964 -3.906)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:4.84134;stroke-opacity:1" d="M123.367 264.59s-11.966 4.823-.196 8.749c0 0 38.45 19.63 76.507 27.706 0 0 51.396 14.694 117.898.449 0 0 44.139-9.31 77.684-27.258 0 0 15.301-2.804-.196-11.217 0 0-38.057-17.162-73.564-25.799 0 0-63.167-14.694-113.19-1.794 0 0-46.493 8.637-84.943 29.164z" transform="translate(4.964 -3.906)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M325.205 266.32a64.683 64.683 0 0 1-61.742 67.47 64.683 64.683 0 0 1-67.495-61.715 64.683 64.683 0 0 1 61.687-67.52 64.683 64.683 0 0 1 67.546 61.659" transform="translate(4.964 -3.906)"/>
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M284.465 268.711a23.707 23.707 0 0 1-22.63 24.729 23.707 23.707 0 0 1-24.738-22.62 23.707 23.707 0 0 1 22.61-24.747 23.707 23.707 0 0 1 24.756 22.6" transform="translate(4.964 -3.906)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.923;stroke-opacity:1" d="M213.284 249.497s1.626 9.164 5.912 2.66c0 0 5.026-13.894 16.555-20.988 0 0 7.094-7.39-3.843-5.765 0 0-18.033 10.938-18.624 24.093zM305.656 292.36s-1.1-9.242-5.75-2.994c0 0-5.812 13.584-17.728 20.008 0 0-7.505 6.973 3.508 5.975 0 0 18.628-9.89 19.97-22.989z" transform="translate(4.964 -3.906)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.76492;stroke-opacity:1" d="M197.15 237.421s74.88-12.259 127.867-.266l-8.884-33.845-59.65-6.663-51.718 15.99z" transform="translate(4.964 -3.906)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.8381;stroke-opacity:1" d="M197.378 299.572s52.001 16.776 126.832-.579l-14.902 30.95-75.148 7.231z" transform="translate(4.964 -3.906)"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M125.644 264.245s125.303 85.038 280.002-.164"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M103.142 276.68s138.829-110.156 325.01-.9"/>
    </g>
</svg>
`,
  3: `<svg width="48" height="48" viewBox="0 0 512 512" >
    <g style="display:inline">
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#fff;stroke-width:6.36819;stroke-opacity:1" d="M95.418 262.37s-7.9 7.177 0 15.22c0 0 64 60.292 130.927 76.877 0 0 49.212 15.117 104.78-13.073 0 0 45.464-17.951 93.659-61.073 0 0 12.293-8.585.39-19.903 0 0-48.39-48-105.17-67.707 0 0-56.976-21.073-111.22-2.146 0 0-50.537 13.463-113.366 71.805z" transform="translate(5.44 -1.314)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:3.91754;stroke-opacity:1" d="M122.924 263.87s-12.006 3.147-.197 5.71c0 0 38.574 12.81 76.755 18.082 0 0 51.563 9.59 118.281.293 0 0 44.282-6.077 77.936-17.79 0 0 15.351-1.83-.197-7.32 0 0-38.18-11.202-73.803-16.839 0 0-63.372-8.63-113.558-.21 0 0-46.643 4.676-85.217 18.073z" transform="translate(5.44 -1.314)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M325.205 266.32a64.683 64.683 0 0 1-61.742 67.47 64.683 64.683 0 0 1-67.495-61.715 64.683 64.683 0 0 1 61.687-67.52 64.683 64.683 0 0 1 67.546 61.659" transform="translate(5.44 -1.314)"/>
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M284.465 268.711a23.707 23.707 0 0 1-22.63 24.729 23.707 23.707 0 0 1-24.738-22.62 23.707 23.707 0 0 1 22.61-24.747 23.707 23.707 0 0 1 24.756 22.6" transform="translate(5.44 -1.314)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.923;stroke-opacity:1" d="M213.284 249.497s1.626 9.164 5.912 2.66c0 0 5.026-13.894 16.555-20.988 0 0 7.094-7.39-3.843-5.765 0 0-18.033 10.938-18.624 24.093zM305.656 292.36s-1.1-9.242-5.75-2.994c0 0-5.812 13.584-17.728 20.008 0 0-7.505 6.973 3.508 5.975 0 0 18.628-9.89 19.97-22.989z" transform="translate(5.44 -1.314)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.97234;stroke-opacity:1" d="M193.117 251.639s74.727-15.341 127.606-.334l-8.866-42.355-59.529-8.337-51.612 20.01z" transform="translate(5.44 -1.314)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:2.11782;stroke-opacity:1" d="M197.555 287.007s51.857 22.333 126.482-.77l-14.862 41.2-74.94 9.626z" transform="translate(5.44 -1.314)"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M125.836 265.215s126.836 60.898 279.066.082"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M99.84 273.103s165.076-60.739 333.46 1.562"/>
    </g>
</svg>
`,
  4: `<svg width="48" height="48" viewBox="0 0 512 512">
    <g style="display:inline">
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#fff;stroke-width:6.36819;stroke-opacity:1" d="M92.782 263.395s-7.901 7.177 0 15.22c0 0 64 60.292 130.927 76.878 0 0 49.212 15.117 104.78-13.073 0 0 45.464-17.952 93.659-61.073 0 0 12.292-8.586.39-19.903 0 0-48.39-48-105.17-67.707 0 0-56.976-21.073-111.22-2.147 0 0-50.537 13.464-113.366 71.805z" transform="translate(4.337 -2.81)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:2.39967;stroke-opacity:1" d="M122.197 267.061s-12.069 1.175-.198 2.132c0 0 38.78 4.781 77.162 6.749 0 0 51.837 3.58 118.908.109 0 0 44.517-2.268 78.35-6.64 0 0 15.432-.683-.199-2.732 0 0-38.383-4.18-74.194-6.285 0 0-63.708-3.579-114.16-.437 0 0-46.89 2.104-85.669 7.104z" transform="translate(4.337 -2.81)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M325.205 266.32a64.683 64.683 0 0 1-61.742 67.47 64.683 64.683 0 0 1-67.495-61.715 64.683 64.683 0 0 1 61.687-67.52 64.683 64.683 0 0 1 67.546 61.659" transform="translate(4.337 -2.81)"/>
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M284.465 268.711a23.707 23.707 0 0 1-22.63 24.729 23.707 23.707 0 0 1-24.738-22.62 23.707 23.707 0 0 1 22.61-24.747 23.707 23.707 0 0 1 24.756 22.6" transform="translate(4.337 -2.81)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.923;stroke-opacity:1" d="M213.284 249.497s1.626 9.164 5.912 2.66c0 0 5.026-13.894 16.555-20.988 0 0 7.094-7.39-3.843-5.765 0 0-18.033 10.938-18.624 24.093zM305.656 292.36s-1.1-9.242-5.75-2.994c0 0-5.812 13.584-17.728 20.008 0 0-7.505 6.973 3.508 5.975 0 0 18.628-9.89 19.97-22.989z" transform="translate(4.337 -2.81)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:2.19714;stroke-opacity:1" d="M196.972 260.607s72.663-4.505 127.327 1.486l-8.846-52.675-59.398-10.37-51.5 24.887z" transform="translate(4.337 -2.81)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:2.33045;stroke-opacity:1" d="M196.154 275.927s56.458 5.26 127.695-.619l-14.818 50.035-87.394 13.592z" transform="translate(4.337 -2.81)"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M125.654 264.442s132.244 25.842 278.077-.286"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19508;stroke-opacity:1" d="M95.552 269.959s126.156-31.722 335.132-2.245"/>
    </g>
</svg>
`
};
const vision = [
  { value: 0, icon: icons[0], tooltip: "0" },
  { value: 1, icon: icons[1], tooltip: "-1" },
  { value: 2, icon: icons[2], tooltip: "-2" },
  { value: 3, icon: icons[3], tooltip: "-3" },
  { value: 4, icon: icons[4], tooltip: "-4" }
];
class VisionElement extends StyleSheetMixin(
  foundry.applications.elements.AbstractFormInputElement
) {
  constructor(...args) {
    super(...args);
    this._internals.role = "select";
    this._value = this.getAttribute("value");
    this.#defaultValue = this._value;
    if (this.constructor.useShadowRoot)
      this.#shadowRoot = this.attachShadow({ mode: "open" });
  }
  /* -------------------------------------------- */
  /** @override */
  static tagName = "dgns-vision";
  /* -------------------------------------------- */
  /**
   * Should a show root be created for this element?
   */
  static useShadowRoot = false;
  /* -------------------------------------------- */
  /** @override */
  static CSS = ``;
  /* -------------------------------------------- */
  /**
   * Controller for removing listeners automatically.
   * @type {AbortController}
   */
  _controller;
  /* -------------------------------------------- */
  /**
   * The shadow root that contains the checkbox elements.
   * @type {ShadowRoot}
   */
  #shadowRoot;
  /* -------------------------------------------- */
  /*  Element Properties                          */
  /* -------------------------------------------- */
  /**
   * The default value as originally specified in the HTML that created this object.
   * @type {string}
   */
  get defaultValue() {
    return this.#defaultValue;
  }
  #defaultValue;
  get value() {
    return super.value;
  }
  set value(value) {
    this._setValue(value);
  }
  /* -------------------------------------------- */
  /*  Element Lifecycle                           */
  /* -------------------------------------------- */
  /** @override */
  connectedCallback() {
    this._adoptStyleSheet(this._getStyleSheet());
    const elements = this._buildElements();
    if (this.useShadowRoot) {
      this.#shadowRoot.replaceChildren(...elements);
    } else {
      this.replaceChildren(...elements);
    }
    this._refresh();
    this._activateListeners();
    if (!this.hasAttribute("tabindex")) this.tabIndex = 0;
  }
  /* -------------------------------------------- */
  /** @override */
  disconnectedCallback() {
    this._controller.abort();
  }
  /* -------------------------------------------- */
  /** @override */
  _adoptStyleSheet(sheet) {
    if (this.useShadowRoot) {
      this.#shadowRoot.adoptedStyleSheets = [sheet];
    } else this.adoptedStyleSheets = [sheet];
  }
  /* -------------------------------------------- */
  /** @override */
  _buildElements() {
    const container = document.createElement("div");
    const button = document.createElement("button");
    button.setAttribute("id", "visionButton");
    button.innerHTML = icons[this.value];
    const dropdown = document.createElement("div");
    dropdown.setAttribute("id", "visionDropdown");
    dropdown.classList.add("vision-dropdown");
    vision.forEach((vision2) => {
      const item = document.createElement("div");
      item.className = "vision-dropdown-item";
      item.setAttribute("data-value", vision2.value);
      const malus = document.createElement("label");
      malus.className = "vision-malus";
      malus.textContent = vision2.tooltip;
      item.innerHTML = vision2.icon;
      item.appendChild(malus);
      item.addEventListener("click", (ev) => {
        let selection = ev.target.closest("div");
        let newValue = selection.getAttribute("data-value");
        this.value = newValue;
        this.dispatchEvent(
          new Event("change", { bubbles: true, cancelable: true })
        );
      });
      dropdown.appendChild(item);
    });
    container.appendChild(button);
    container.appendChild(dropdown);
    return [container];
  }
  /* -------------------------------------------- */
  /** @override */
  _activateListeners() {
    const { signal } = this._controller = new AbortController();
    this.addEventListener("click", this._onClick.bind(this), { signal });
    this.addEventListener(
      "keydown",
      (event) => event.key === " " ? this._onClick(event) : null,
      { signal }
    );
  }
  /* -------------------------------------------- */
  /** @override */
  _refresh() {
    super._refresh();
  }
  /* -------------------------------------------- */
  /** @override */
  _onClick(event) {
    event.preventDefault();
    let dropdown = {};
    if (this.useShadowRoot) {
      dropdown = this.shadowRoot.getElementById("visionDropdown");
    } else {
      dropdown = this.firstChild.lastChild;
    }
    dropdown.classList.toggle("active");
  }
}
window.customElements.define("dgns-checkbox", CheckboxElement);
window.customElements.define("dgns-slidetoggle", SlideToggleElement);
window.customElements.define("dgns-vision", VisionElement);
window.customElements.define("dgns-discomfort", DiscomfortElement);
const _module$1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  CheckboxElement,
  DiscomfortElement,
  SlideToggleElement,
  VisionElement
}, Symbol.toStringTag, { value: "Module" }));
class DGNSGamePause extends foundry.applications.ui.GamePause {
  async _prepareContext(_options) {
    return {
      cssClass: game.paused ? "paused" : "",
      icon: "systems/degenesisnext/ui/marauders.svg",
      text: game.i18n.localize("GAME.Paused"),
      spin: false
    };
  }
  async _renderHTML(context, options) {
    const img = document.createElement("div");
    img.innerHTML = `
    <svg  x="0px" y="0px" viewBox="0 0 150 129.9">
    <path d="M75,129.9L0,0h150L75,129.9z M10,5.8l65,112.6L140,5.8H10z"/>
    <polygon points="104.3,10.7 106.9,15.3 109.8,20.2 108.2,23 102.4,23 96.4,23 99.4,28.2 102.3,33.2 100.6,36.2 94.8,36.2 88.8,36.2 
	91.8,41.4 94.7,46.4 92.9,49.5 87.3,49.5 81.3,49.5 84.3,54.7 87.1,59.5 75.1,80.4 63,59.5 65.8,54.7 68.8,49.5 62.8,49.5 
	57.2,49.5 55.4,46.4 58.3,41.4 61.3,36.2 55.3,36.2 49.5,36.2 47.8,33.2 50.7,28.2 53.7,23 47.7,23 41.9,23 40.3,20.2 43.2,15.3 
	45.8,10.7 18.4,10.7 75.1,108.9 131.7,10.7 "/>
    </svg>`;
    if (context.spin) img.classList.add("fa-spin");
    const caption = document.createElement("figcaption");
    caption.innerText = context.text;
    return [img, caption];
  }
}
const _module = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  DGNSGamePause
}, Symbol.toStringTag, { value: "Module" }));
const applications = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  actor: _module$3,
  components: _module$1,
  item: _module$2,
  ui: _module
}, Symbol.toStringTag, { value: "Module" }));
class LocalDocumentField extends foundry.data.fields.DocumentIdField {
  constructor(model, options = {}) {
    if (!foundry.utils.isSubclass(model, foundry.abstract.DataModel)) {
      throw new Error(
        "A ForeignDocumentField must specify a DataModel subclass as its type"
      );
    }
    super(options);
    this.model = model;
  }
  /* -------------------------------------------- */
  /**
   * A reference to the model class which is stored in this field.
   * @type {typeof Document}
   */
  model;
  /* -------------------------------------------- */
  /** @inheritDoc */
  static get _defaults() {
    return foundry.utils.mergeObject(super._defaults, {
      nullable: true,
      readonly: false,
      idOnly: false,
      fallback: false
    });
  }
  /* -------------------------------------------- */
  /** @override */
  _cast(value) {
    if (value === null || value === void 0 || value === "") return null;
    if (typeof value === "string") return value;
    if (value instanceof this.model) return value._id;
    throw new Error(
      `The value provided to a LocalDocumentField must be a ${this.model.name} instance.`
    );
  }
  /* -------------------------------------------- */
  /** @inheritDoc */
  _validateType(value) {
    if (!this.options.fallback) super._validateType(value);
  }
  /* -------------------------------------------- */
  /** @override */
  initialize(value, model, options = {}) {
    if (value === null || value === void 0 || value === "") {
      return null;
    }
    if (this.idOnly)
      return this.options.fallback || foundry.data.validators.isValidId(value) ? value : null;
    const collection = model.parent?.[this.model.metadata.collection];
    return () => {
      const document2 = collection?.get(value);
      if (!document2) return this.options.fallback ? value : null;
      if (this.options.fallback)
        Object.defineProperty(document2, "toString", {
          value: () => document2.name,
          configurable: true,
          enumerable: false
        });
      return document2;
    };
  }
  clean(value, options) {
    if (value === "") {
      value = null;
    }
    return super.clean(value, options);
  }
  /* -------------------------------------------- */
  /** @inheritDoc */
  toObject(value) {
    return value?._id ?? value;
  }
}
const { SchemaField: SchemaField$s, ForeignDocumentField: ForeignDocumentField$5 } = foundry.data.fields;
class CachedReferenceField extends SchemaField$s {
  /**
   *
   * @param {typeof Item} model
   * @param {*} options
   */
  constructor(model, options = {}) {
    if (!foundry.utils.isSubclass(model, foundry.abstract.DataModel)) {
      throw new Error("CachedReferenceField must specify a DataModel subclass");
    }
    super(
      {
        linked: new ForeignDocumentField$5(model, {
          nullable: true,
          idOnly: false
        }),
        cached: new LocalDocumentField(model, {
          nullable: true,
          idOnly: false
        })
      },
      options
    );
    this.model = model;
  }
  /**
   * Helper getter for grabbing refrenced ID. Returns linked || cached || null.
   * @param {*} value current value
   */
  static resolve(value) {
    if (!value) return null;
    return value.linked || value.cached || null;
  }
  /**
   *
   * @param {*} value
   * @returns
   */
  static isCached(value) {
    return !value?.linked && value?.cached !== null;
  }
  /**
   * Checking if cached item is newest version of linked one.
   * @param {*} value
   * @returns
   */
  static isSynced(value) {
    if (!value?.linked || !value?.cached) return false;
    return value.cached._stats?.modifiedTime > value.linked._stats?.modifiedTime;
  }
  //todo: move methods to Actor document
  /**
   * Remove cache reference and embedded document inside parent's collection.
   * @param {*} path
   * @param {*} parent
   * @returns
   */
  static async removeLinked(path, parent) {
    if (!parent || !path) return;
    const value = foundry.utils.getProperty(parent.system, path);
    if (!value) return;
    const cached = value.cached;
    if (cached) {
      await cached.delete();
      await parent.update(
        { [`system.${path}.linked`]: null },
        { [`system.${path}.cached`]: null }
      );
    }
  }
  /**
   * Remove cache reference and embedded document inside parent's collection.
   * @param {*} path
   * @param {*} parent
   * @returns
   */
  static async removeCache(path, parent) {
    if (!parent || !path) return;
    const value = foundry.utils.getProperty(parent.system, path);
    if (!value) return;
    const cached = value.cached;
    if (cached) {
      await cached.delete();
      await parent.update({ [`system.${path}.cached`]: null });
    }
  }
}
const { Roll: Roll$1 } = foundry.dice;
const { renderTemplate: renderTemplate$1 } = foundry.applications.handlebars;
class DGNSRoll extends Roll$1 {
  //----- STATIC -----//
  static CHAT_TEMPLATE = "systems/degenesisnext/templates/chat/action.roll.hbs";
  /** Parsing options  */
  constructor(rollDefinition, data, options = {}) {
    const { actionNumber = 0, difficulty = 0, modifiers = {} } = rollDefinition;
    const diceMod = modifiers.d || 0;
    const totalActionNumber = Math.max(0, actionNumber + diceMod);
    const rolledDice = Math.min(totalActionNumber, 12);
    const autoSuccesses = Math.max(0, totalActionNumber - 12);
    const formula = `${rolledDice}d6`;
    super(formula, data, options);
    this.definition = rollDefinition;
    this.actionNumber = totalActionNumber;
    this.rolledDice = rolledDice;
    this.autoSuccesses = autoSuccesses;
    this.difficulty = Number(difficulty);
    this.modifiers = rollDefinition.modifiers;
    this._outcome = null;
  }
  /* -------------------------------------------- */
  /**
   * Is the result of this roll a success? Returns `undefined` if roll isn't evaluated.
   * @type {boolean|void}
   */
  get sucess() {
    if (!this._evaluated) return;
    if (!Number.isNumeric(this.difficulty)) return false;
    return this.total >= this.difficulty;
  }
  /* -------------------------------------------- */
  /**
   * Is the result of this roll a failure? Returns `undefined` if roll isn't evaluated.
   * @type {boolean|void}
   */
  get failure() {
    if (!this._evaluated) return;
    if (!Number.isNumeric(this.options.difficulty)) return false;
    return this.total < this.difficulty;
  }
  /* -------------------------------------------- */
  /**
   * Is the result of this roll a botch? Returns `undefined` if roll isn't evaluated.
   * @type {boolean|void}
   */
  get botch() {
    if (!this._evaluated) return;
    if (!Number.isNumeric(this.options.difficulty)) return false;
    return this.total < this.difficulty;
  }
  /* -------------------------------------------- */
  /** @inheritDoc */
  async evaluate(options = {}) {
    await super.evaluate(options);
    this._evaluateSuccess();
    return this;
  }
  /* -------------------------------------------- */
  /** @inheritDoc */
  evaluateSync(options = {}) {
    return super.evaluateSync(options);
  }
  _evaluateSuccess() {
    this.successes = this.dice[0].results.filter((r) => r.result >= 4).length + this.modifiers.s + this.autoSuccesses;
    this.ones = this.dice[0].results.filter((r) => r.result === 1).length;
    this.triggers = this.dice[0].results.filter((r) => r.result === 6).length + this.modifiers.t;
    if (this.difficulty) {
      if (this.successes < this.ones) {
        this._outcome = "botch";
      } else if (this.successes >= this.difficulty) {
        this._outcome = "success";
      } else {
        this._outcome = "failure";
      }
    } else {
      this._outcome = null;
    }
  }
  /** Display result to chat  */
  async toMessage(messageData = {}, { rollMode = null, create = true } = {}) {
    rollMode = rollMode || game.settings.get("core", "rollMode");
    console.log(rollMode);
    const speaker = ChatMessage.getSpeaker();
    const chatData = {
      title: game.i18n.localize(`DGNS.ROLL.actionRoll`),
      attribute: game.i18n.localize(
        `DGNS.ATTRIBUTE.${this.definition.attribute}`
      ),
      skill: game.i18n.localize(`DGNS.SKILL.${this.definition.skill}`),
      difficulty: this.difficulty,
      successes: this.successes,
      triggers: this.triggers,
      ones: this.ones,
      dice: this.dice[0].results,
      result: this.result,
      resultLabel: game.i18n.localize(`DGNS.ROLL.${this.result}`)
    };
    const template = this.constructor.CHAT_TEMPLATE;
    const content = await renderTemplate$1(template, chatData);
    const messageOptions = foundry.utils.mergeObject(
      {
        user: game.user.id,
        style: CONST.CHAT_MESSAGE_STYLES ? CONST.CHAT_MESSAGE_STYLES.ROLL : void 0,
        content,
        rolls: [this],
        speaker,
        flags: {
          "core.rollMode": rollMode
        }
      },
      messageData
    );
    ChatMessage.applyRollMode(messageOptions, rollMode);
    return create ? ChatMessage.create(messageOptions) : messageOptions;
  }
  get result() {
    return this._outcome;
  }
  static buildFormula() {
  }
}
const { HandlebarsApplicationMixin: HandlebarsApplicationMixin$1, ApplicationV2: ApplicationV2$1 } = foundry.applications.api;
const { FormDataExtended: FormDataExtended$1 } = foundry.applications.ux;
class DGNSActionRollDialog extends HandlebarsApplicationMixin$1(
  ApplicationV2$1
) {
  constructor(rollConfig, options = {}) {
    super(rollConfig, options);
    this._actor = rollConfig.actor;
    this._rollDefinition = foundry.utils.mergeObject(
      this._rollDefinition,
      rollConfig.definiton
    );
  }
  _rollDefinition = {
    attribute: null,
    skill: null,
    actionNumber: null,
    difficulty: 0,
    modifiers: {
      d: 0,
      s: 0,
      t: 0
    }
  };
  static DEFAULT_OPTIONS = {
    tag: "form",
    classes: ["dgns-roll"],
    actions: {
      manageDifficulty: this.#onManageDifficulty,
      execute: this.#submitHandler
    },
    form: {
      //handler: DGNSActionRollDialog.#submitHandler,
      submitOnChange: false,
      closeOnSubmit: false
    },
    position: {
      width: 450,
      height: 550
    },
    timeout: null,
    window: {
      resizable: true,
      frame: true
    }
  };
  static PARTS = {
    rollDialog: {
      template: "systems/degenesisnext/templates/rolls/roll.action.dialog.hbs",
      templates: [
        "systems/degenesisnext/templates/rolls/partials/roll.action.hbs",
        "systems/degenesisnext/templates/rolls/partials/roll.configuration.hbs",
        "systems/degenesisnext/templates/rolls/partials/roll.effects.hbs",
        "systems/degenesisnext/templates/rolls/partials/roll.summary.hbs",
        "systems/degenesisnext/templates/rolls/partials/roll.buttons.hbs"
      ]
    }
  };
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    context.attribute = this._rollDefinition.attribute;
    context.skill = this._rollDefinition.skill;
    context.roll = context.roll = {
      ...this._rollDefinition,
      prefix: "roll",
      totals: {
        dice: this.getTotalDice("roll"),
        successes: this.getTotalSuccesses("roll"),
        triggers: this.getTotalTriggers("roll")
      }
    };
    return context;
  }
  get title() {
    return game.i18n.localize(`DGNS.ROLL.action`);
  }
  /**
   * Factory method for asynchronous behavior.
   * @param {object} options            Application rendering options.
   * @returns {Promise<object|null>}    A promise that resolves to the form data, or `null`
   *                                    if the application was closed without submitting.
   */
  static async create(rollConfig, options) {
    const { promise, resolve } = Promise.withResolvers();
    const application = new this(rollConfig, options);
    application.addEventListener("close", () => resolve(application.config), {
      once: true
    });
    application.render({ force: true, zIndex: 5e8 });
    return promise;
  }
  _onChangeForm(formConfig, event) {
    super._onChangeForm(formConfig, event);
    const formElement = event.target.form;
    const formData = new FormDataExtended$1(formElement).object;
    const expanded = foundry.utils.expandObject(formData);
    foundry.utils.mergeObject(this._rollDefinition, expanded.roll);
    if (this._rollDefinition.difficulty !== void 0) {
      this._rollDefinition.difficulty = Math.clamp(
        this._rollDefinition.difficulty,
        1,
        12
      );
    }
    this.render();
  }
  static #onManageDifficulty(event, target) {
    const prefix = target.dataset.prefix;
    const method = target.dataset.method;
    const targetData = prefix === "roll" ? this._rollDefinition : this._rollDefinition[prefix];
    if (method === "increaseDifficulty" && targetData.difficulty < 12) {
      targetData.difficulty++;
    } else if (method === "decreaseDifficulty" && targetData.difficulty > 0) {
      targetData.difficulty--;
    } else {
      return;
    }
    this.render();
  }
  // *----- Helpers Functions ----*
  _getRollData(prefix) {
    if (prefix === "roll" || !this._rollDefinition.primary) {
      return this._rollDefinition;
    }
    return this._rollDefinition[prefix];
  }
  getTotalDice(prefix = "roll") {
    const data = this._getRollData(prefix);
    return (Number(data.actionNumber) || 0) + (Number(data.modifiers?.d) || 0);
  }
  getTotalSuccesses(prefix = "roll") {
    const data = this._getRollData(prefix);
    return (Number(data.successes) || 0) + (Number(data.modifiers?.s) || 0);
  }
  getTotalTriggers(prefix = "roll") {
    const data = this._getRollData(prefix);
    return (Number(data.triggers) || 0) + (Number(data.modifiers?.t) || 0);
  }
  // *----- Main Methods -----*
  async preformRoll() {
    const roll = new DGNSRoll(this._rollDefinition);
    await roll.evaluate();
    roll.toMessage();
    this.close();
  }
  /** Submit Handler  */
  static async #submitHandler(event, form, formData) {
    this.preformRoll(this.roll);
  }
}
const { renderTemplate } = foundry.applications.handlebars;
class DGNSCombinationRoll {
  constructor(data) {
    this.primary = new DGNSRoll(data.primary);
    this.secondary = new DGNSRoll(data.secondary);
    this.transferTriggers = data.transferTriggers ?? true;
  }
  async evaluate() {
    await this.primary.evaluate();
    if (this.primary.result === "failure") ;
    if (this.transferTriggers && this.primary.triggers > 0) {
      this.secondary.modifiers.t += this.primary.triggers;
    }
    await this.secondary.evaluate();
    return this;
  }
  async toMessage(messageData = {}) {
    const template = "systems/degenesisnext/templates/chat/combination.roll.hbs";
    const content = await renderTemplate(template, {
      primary: this.primary,
      secondary: this.secondary,
      totalTriggers: this.primary.triggers + this.secondary.triggers
      // inne dane podsumowujące
    });
    return ChatMessage.create({
      user: game.user.id,
      content,
      rolls: [this.primary, this.secondary],
      // Foundry widzi obie kości dla 3D Dice
      speaker: ChatMessage.getSpeaker(),
      ...messageData
    });
  }
}
const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
const { FormDataExtended } = foundry.applications.ux;
class DGNSCombinationRollDialog extends HandlebarsApplicationMixin(
  ApplicationV2
) {
  constructor(rollConfig, options = {}) {
    super(rollConfig, options);
    console.log(rollConfig);
    this._actor = rollConfig.actor;
    this._rollDefinition = foundry.utils.mergeObject(
      this._rollDefinition,
      rollConfig.definiton
    );
  }
  _rollDefinition = {
    primary: {
      attribute: null,
      skill: null,
      actionNumber: null,
      difficulty: 0,
      modifiers: { d: 0, s: 0, t: 0 }
    },
    secondary: {
      attribute: null,
      skill: null,
      actionNumber: null,
      difficulty: 0,
      modifiers: { d: 0, s: 0, t: 0 }
    }
  };
  static DEFAULT_OPTIONS = {
    tag: "form",
    classes: ["dgns-roll", "combination-roll"],
    actions: {
      manageDifficulty: this.#onManageDifficulty,
      execute: this.#submitHandler
    },
    form: {
      //handler: DGNSActionRollDialog.#submitHandler,
      submitOnChange: false,
      closeOnSubmit: false
    },
    position: {
      width: 700,
      height: 550
    },
    timeout: null,
    window: {
      resizable: true,
      frame: true
    }
  };
  static PARTS = {
    rollDialog: {
      template: "systems/degenesisnext/templates/rolls/roll.combination.dialog.hbs",
      templates: [
        "systems/degenesisnext/templates/rolls/partials/roll.combination.hbs",
        "systems/degenesisnext/templates/rolls/partials/roll.configuration.hbs",
        "systems/degenesisnext/templates/rolls/partials/roll.effects.hbs",
        "systems/degenesisnext/templates/rolls/partials/roll.summary.hbs",
        "systems/degenesisnext/templates/rolls/partials/roll.buttons.hbs"
      ]
    }
  };
  async _prepareContext(options) {
    const context = await super._prepareContext(options);
    const skills = this._prepareSkills();
    const skillMap = {};
    skills.forEach((s) => {
      skillMap[s.id] = s.label;
    });
    context.primary = {
      ...this._rollDefinition.primary,
      skills: skillMap,
      totals: {
        dice: this.getTotalDice("primary"),
        successes: this.getTotalSuccesses("primary"),
        triggers: this.getTotalTriggers("primary")
      }
    }, context.secondary = {
      ...this._rollDefinition.secondary,
      skills: skillMap,
      totals: {
        dice: this.getTotalDice("secondary"),
        successes: this.getTotalSuccesses("secondary"),
        triggers: this.getTotalTriggers("secondary")
      }
    };
    context.roll = this._rollDefinition;
    console.log(context);
    return context;
  }
  _onChangeForm(formConfig, event) {
    super._onChangeForm(formConfig, event);
    const formElement = event.target.form;
    const formData = new FormDataExtended(formElement).object;
    const expanded = foundry.utils.expandObject(formData);
    for (let prefix of ["primary", "secondary", "roll"]) {
      const skillKey = formData[`${prefix}.skill`];
      const target = prefix === "roll" ? this._rollDefinition : this._rollDefinition[prefix];
      if (target && skillKey) {
        const actorSystem = this._actor.system;
        let foundAttrKey = null;
        let skillValue = 0;
        let attrValue = 0;
        for (let [aKey, aData] of Object.entries(actorSystem.attributes)) {
          if (aData.skills && aData.skills[skillKey]) {
            foundAttrKey = aKey;
            attrValue = aData.value || 0;
            skillValue = aData.skills[skillKey].value || 0;
            break;
          }
        }
        if (foundAttrKey) {
          target.skill = skillKey;
          target.attribute = foundAttrKey;
          target.actionNumber = attrValue + skillValue;
        }
      } else if (target && skillKey === "") {
        target.actionNumber = 0;
        target.skill = "";
      }
    }
    foundry.utils.mergeObject(this._rollDefinition, expanded, {
      insertKeys: true,
      overwrite: true
    });
    if (this._rollDefinition.primary.difficulty !== void 0) {
      this._rollDefinition.primary.difficulty = Math.clamp(
        this._rollDefinition.primary.difficulty,
        0,
        12
      );
    }
    if (this._rollDefinition.secondary.difficulty !== void 0) {
      this._rollDefinition.secondary.difficulty = Math.clamp(
        this._rollDefinition.secondary.difficulty,
        0,
        12
      );
    }
    this.render();
  }
  static async create(rollConfig, options) {
    const { promise, resolve } = Promise.withResolvers();
    const application = new this(rollConfig, options);
    application.addEventListener("close", () => resolve(application.config), {
      once: true
    });
    application.render({ force: true, zIndex: 5e8 });
    return promise;
  }
  get title() {
    return game.i18n.localize(`DGNS.ROLL.combination`);
  }
  static #onManageDifficulty(event, target) {
    console.log(target);
    const prefix = target.dataset.prefix;
    const method = target.dataset.method;
    console.log(prefix);
    const targetData = prefix === "roll" ? this._rollDefinition : this._rollDefinition[prefix];
    console.log(targetData);
    if (method === "increaseDifficulty" && targetData.difficulty < 12) {
      targetData.difficulty++;
    } else if (method === "decreaseDifficulty" && targetData.difficulty > 1) {
      targetData.difficulty--;
    } else {
      return;
    }
    this.render();
  }
  // *----- Helpers Functions ----*
  /**
   * Preparing skills array for select controls.
   * @returns
   */
  _prepareSkills() {
    const actorSystem = this._actor.system;
    const skills = [];
    for (let [attrKey, attrData] of Object.entries(actorSystem.attributes)) {
      if (attrData.skills) {
        for (let [skillKey, skillData] of Object.entries(attrData.skills)) {
          skills.push({
            id: skillKey,
            label: `${game.i18n.localize(
              `DGNS.ATTRIBUTE.${attrKey}`
            )} + ${game.i18n.localize(`DGNS.SKILL.${skillKey}`)}`,
            attribute: attrKey
          });
        }
      }
    }
    return skills;
  }
  _getRollData(prefix) {
    if (prefix === "roll" || !this._rollDefinition.primary) {
      return this._rollDefinition;
    }
    return this._rollDefinition[prefix];
  }
  getTotalDice(prefix = "roll") {
    const data = this._getRollData(prefix);
    return (Number(data.actionNumber) || 0) + (Number(data.modifiers?.d) || 0);
  }
  getTotalSuccesses(prefix = "roll") {
    const data = this._getRollData(prefix);
    return (Number(data.successes) || 0) + (Number(data.modifiers?.s) || 0);
  }
  getTotalTriggers(prefix = "roll") {
    const data = this._getRollData(prefix);
    return (Number(data.triggers) || 0) + (Number(data.modifiers?.t) || 0);
  }
  async preformRoll() {
    const roll = new DGNSCombinationRoll(this._rollDefinition);
    await roll.evaluate();
    roll.toMessage();
    this.close();
  }
  /** Submit Handler  */
  static async #submitHandler(event, form, formData) {
    this.preformRoll(this.roll);
  }
}
class DGNSActor extends Actor {
  static DEFAULT_ICON = "systems/degenesisnext/assets/tokens/default.png";
  /* -------------------------------------------------------------------------- */
  /*                              Data Preparation                              */
  /* -------------------------------------------------------------------------- */
  // #region Data Preparation
  prepareData() {
    super.prepareData();
  }
  /* -------------------------------------------------------------------------- */
  prepareEmbeddedDocuments() {
    super.prepareEmbeddedDocuments();
  }
  // #endregion
  /* -------------------------------------------------------------------------- */
  /*                                 Data Events                                */
  /* -------------------------------------------------------------------------- */
  // #region Data Events
  async _preCreate(data, options, user) {
    if (await super._preCreate(data, options, user) === false) {
      return false;
    }
  }
  /* -------------------------------------------------------------------------- */
  async _preUpdate(changed, options, user) {
    if (await super._preUpdate(changed, options, user) === false)
      return false;
  }
  /* -------------------------------------------------------------------------- */
  _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
  }
  /* -------------------------------------------------------------------------- */
  _onUpdate(data, options, userId) {
    super._onUpdate(data, options, userId);
    if (this.type === "group") this._propagateGroup();
  }
  /* -------------------------------------------------------------------------- */
  async update(data, options = {}) {
    console.log(`Actor update.`);
    console.log("Data:", data);
    console.log("Options:", options);
    const fieldsToSync = this._getCachedReferenceFields();
    if (fieldsToSync.length > 0) {
      const cacheUpdates = await this._prepareCacheUpdates(data, fieldsToSync);
      if (cacheUpdates) {
        foundry.utils.mergeObject(data, cacheUpdates);
      }
    }
    return super.update(data, options);
  }
  // #endregion
  /* -------------------------------------------------------------------------- */
  /*                                Data Helpers                                */
  /* -------------------------------------------------------------------------- */
  // #region Data  helpers
  /**
   * Set actor's group (ForeignField link) and reverse link
   * @param {*} groupId
   */
  async setGroup(groupActor = null) {
    await groupActor.update({
      ["system.members"]: [...groupActor.system.members, { actor: this.id }]
    });
    await this.update({ ["system.group"]: groupActor.id });
  }
  /**
   * Remove reference to group.
   */
  async unsetGroup() {
    let group = this.system.group;
    await this.system.group.update({
      ["system.members"]: group.system.members.filter(
        (member) => member.actor.id !== this.id
      )
    });
    await this.update({ ["system.group"]: null });
  }
  /**
   * Force members to prepareData after Group information been changed.
   */
  async _propagateGroup() {
    for (const schema of this.system.members) {
      schema.actor.prepareData();
      schema.actor.render(false);
    }
  }
  // #endregion
  /* -------------------------------------------------------------------------- */
  /*                            Custom Data Handlers                            */
  /* -------------------------------------------------------------------------- */
  // #region Custom data handlers
  /**
   * Discover any CachedReferenceFields from schema.
   * @returns {string[]} Array of keys.
   */
  _getCachedReferenceFields() {
    const fields2 = [];
    for (const [key, field] of Object.entries(this.system.schema.fields)) {
      if (field instanceof CachedReferenceField) {
        fields2.push(key);
      }
    }
    return fields2;
  }
  /* -------------------------------------------------------------------------- */
  /**
   * Preparing cached fields information.
   * @param {object} data Data from linked item
   * @param {object} fieldsToSync All the fields that can be cached and linked item changed.
   * @returns {object} Data for update cycle || null if there are not any changes.
   */
  async _prepareCacheUpdates(data, fieldsToSync) {
    const updates = {};
    let hasUpdates = false;
    for (const field of fieldsToSync) {
      const itemChange = foundry.utils.getProperty(
        data,
        `system.${field}.linked`
      );
      if (itemChange === void 0) continue;
      const currentCachedId = this.system[field]?.cached?.id;
      if (currentCachedId) {
        const oldCache = this.items.get(currentCachedId);
        if (oldCache) {
          await oldCache.delete();
        }
      }
      if (!itemChange) {
        updates[`system.${field}.cached`] = null;
        hasUpdates = true;
        continue;
      }
      const worldDoc = game.items.get(itemChange);
      if (worldDoc) {
        const [created] = await this.createEmbeddedDocuments("Item", [
          worldDoc.toObject()
        ]);
        updates[`system.${field}.cached`] = created.id;
        hasUpdates = true;
      }
    }
    return hasUpdates ? updates : null;
  }
  //#endregion
  //#region Sheet Methods
  /* -------------------------------------------------------------------------- */
  /*                               Sheets Methods                               */
  /* -------------------------------------------------------------------------- */
  /* ------------------------------ ActiveEffects ----------------------------- */
  /**
   * Preparing ActiveEffects for sheet.
   * @returns
   */
  async _prepareEffects() {
    const effects = this.effects;
    const categories = {
      temporary: { label: "Temporary", effects: [] },
      passive: { label: "Active", effects: [] },
      inactive: { label: "Disabled", effects: [] }
    };
    for (let effect of effects) {
      effect.source = await this._getEffectSource(effect);
      if (effect.disabled) categories.inactive.effects.push(effect);
      else if (effect.isTemporary) categories.temporary.effects.push(effect);
      else categories.passive.effects.push(effect);
    }
    for (const category of Object.values(categories)) {
      category.effects.sort((a, b) => {
        const sourceSort = (a.source || "").localeCompare(b.source || "", "pl");
        if (sourceSort !== 0) return sourceSort;
        return (a.name || "").localeCompare(b.name || "", "pl");
      });
    }
    return categories;
  }
  /* -------------------------------------------------------------------------- */
  /**
   * Handling effects for actor.
   * @param {*} action
   * @param {*} effectId
   * @returns
   */
  async _manageEffect(action, effectId = null) {
    switch (action) {
      case "create":
        return this._onCreateEffect();
      case "edit":
        return this.effects.get(effectId)?.sheet.render(true);
      case "delete":
        return this.effects.get(effectId)?.delete();
      case "toggle":
        const effect = this.effects.get(effectId);
        return effect?.update({ disabled: !effect.disabled });
    }
  }
  /* -------------------------------------------------------------------------- */
  /**
   * Helper function for mapping source of effect.
   * @param {*} effect
   * @returns
   */
  async _getEffectSource(effect) {
    if (!effect.origin) return "Własny (Actor)";
    const source = await fromUuid(effect.origin);
    if (!source) return "Nieznane źródło";
    if (source.type === "potential") return `Potencjał: ${source.name}`;
    if (source.type === "legacy") return `Legenda: ${source.name}`;
    return source.name;
  }
  /* -------------------------------------------------------------------------- */
  /**
   * Helper function for creating new effect.
   * @returns
   */
  async _onCreateEffect() {
    const effectData = {
      name: "New Effect",
      img: "icons/svg/aura.svg",
      origin: this.uuid,
      disabled: false
    };
    return this.createEmbeddedDocuments("ActiveEffect", [effectData]);
  }
  /* -------------------------------- Inventory ------------------------------- */
  /**
   * Prepare inventory for beeing displayed on actor's sheet.
   * @returns
   */
  _prepareInventory() {
    const items = this.items;
    const excluded = /* @__PURE__ */ new Set([
      "cult",
      "culture",
      "concept",
      "potential",
      "legacy"
    ]);
    const inventory = {
      weapon: [],
      shield: [],
      armor: [],
      ammunition: [],
      transportation: [],
      equipment: [],
      other: []
    };
    const categories = new Set(Object.keys(inventory));
    const transportationItems = items.filter(
      (i) => i.type === "transportation"
    );
    const hiddenItemIds = /* @__PURE__ */ new Set();
    for (const transportation in transportationItems) {
      const items2 = transportation.system.items;
      items2.forEach((item) => hiddenItemIds.add(item.id));
      inventory.transportation.push({
        item: transportation,
        items: items2
      });
    }
    for (const item of items) {
      if (excluded.has(item.type) || // skip excluded types
      item.type === "transportation" || // skip transportation types
      hiddenItemIds.has(item.id)) {
        continue;
      }
      const category = categories.has(item.type) ? item.type : "other";
      inventory[category].push(item);
    }
    return inventory;
  }
  /* -------------------------------------------------------------------------- */
  //#endregion
  // #region Rolls
  /* -------------------------------------------------------------------------- */
  /*                                    Rolls                                   */
  /* -------------------------------------------------------------------------- */
  /**
   *
   * @param {*} attribute
   * @param {*} skill
   */
  async actionRoll(attribute, skill) {
    let actionNumber = this.system.actionNumbers[skill];
    let rollConfig = {
      actor: this,
      definiton: {
        attribute,
        skill,
        actionNumber
      }
    };
    await DGNSActionRollDialog.create(rollConfig);
  }
  /**
   *
   * @param {*} attribute
   * @param {*} skill
   */
  async combinationRoll(attribute, skill) {
    let actionNumber = this.system.actionNumbers[skill];
    let rollConfig = {
      actor: this,
      definiton: {
        primary: {
          attribute,
          skill,
          actionNumber
        }
      }
    };
    await DGNSCombinationRollDialog.create(rollConfig);
  }
  // #endregion
  /* -------------------------------------------------------------------------- */
  /*                              Getters / Setters                             */
  /* -------------------------------------------------------------------------- */
}
class DGNSItem extends Item {
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
      return WEAPON_GROUPS_SKILLS[this.system.group] == "projectiles" || this.system.group == "sonic" ? false : true;
    }
  }
  get isRanged() {
    if (this.type === "weapon")
      return WEAPON_GROUPS_SKILLS[this.system.group] == "projectiles" && this.group != "sonic";
  }
  get isSonic() {
    if (this.type = "weapon") return this.system.group == "sonic";
  }
}
class DegenesisActiveEffect extends ActiveEffect {
}
const {
  SchemaField: SchemaField$r,
  NumberField: NumberField$s,
  StringField: StringField$t,
  BooleanField: BooleanField$p,
  ArrayField: ArrayField$p,
  IntegerSortField: IntegerSortField$p
} = foundry.data.fields;
class AttributeField extends SchemaField$r {
  constructor(label, schemaOptions = {}, skills) {
    const fields2 = {
      value: new NumberField$s({
        nullable: false,
        integer: true,
        initial: 1,
        min: 1,
        label
      }),
      limit: new NumberField$s({
        nullable: false,
        integer: true,
        initial: 2,
        min: 0
      }),
      preffered: new BooleanField$p({ initial: false }),
      skills: skills || new SchemaField$r({})
    };
    super(fields2, schemaOptions, skills);
  }
}
const {
  SchemaField: SchemaField$q,
  NumberField: NumberField$r,
  StringField: StringField$s,
  BooleanField: BooleanField$o,
  ArrayField: ArrayField$o,
  IntegerSortField: IntegerSortField$o
} = foundry.data.fields;
class SkillField extends SchemaField$q {
  constructor(attribute, label, schemaOptions = {}) {
    const fields2 = {
      // Link to attribute
      attribute: new StringField$s({ initial: attribute }),
      //Current value
      value: new NumberField$r({
        nullable: false,
        integer: true,
        initial: 0,
        min: 0,
        label
      }),
      // Limit during creation
      limit: new NumberField$r({
        nullable: false,
        integer: true,
        initial: 2,
        min: 0
      })
    };
    super(fields2, schemaOptions);
  }
}
const {
  SchemaField: SchemaField$p,
  NumberField: NumberField$q,
  StringField: StringField$r,
  BooleanField: BooleanField$n,
  ArrayField: ArrayField$n,
  IntegerSortField: IntegerSortField$n
} = foundry.data.fields;
class AttributesSkillsFields {
  static get attributes() {
    const bodySkills = new SchemaField$p({
      athletics: new SkillField("body", "DGNS.Athletics"),
      brawl: new SkillField("body", "DGNS.Brawl"),
      force: new SkillField("body", "DGNS.Force"),
      melee: new SkillField("body", "DGNS.Melee"),
      stamina: new SkillField("body", "DGNS.Stamina"),
      toughness: new SkillField("body", "DGNS.Toughness")
    });
    const agilitySkills = new SchemaField$p({
      crafting: new SkillField("agility", "DGNS.Crafting"),
      dexterity: new SkillField("agility", "DGNS.Dexterity"),
      navigation: new SkillField("agility", "DGNS.Navigation"),
      mobility: new SkillField("agility", "DGNS.Mobility"),
      projectiles: new SkillField("agility", "DGNS.Projectiles"),
      stealth: new SkillField("agility", "DGNS.Stealth")
    });
    const charismaSkills = new SchemaField$p({
      arts: new SkillField("charisma", "DGNS.Arts"),
      conduct: new SkillField("charisma", "DGNS.Conduct"),
      expression: new SkillField("charisma", "DGNS.Expression"),
      leadership: new SkillField("charisma", "DGNS.Leadership"),
      negotiation: new SkillField("charisma", "DGNS.Negotiation"),
      seduction: new SkillField("charisma", "DGNS.Seduction")
    });
    const intellectSkills = new SchemaField$p({
      artifact: new SkillField("intellect", "DGNS.Artifact"),
      engineering: new SkillField("intellect", "DGNS.Engineering"),
      focus: new SkillField("intellect", "DGNS.Focus"),
      legends: new SkillField("intellect", "DGNS.Legends"),
      medicine: new SkillField("intellect", "DGNS.Medicine"),
      science: new SkillField("intellect", "DGNS.Science")
    });
    const psycheSkills = new SchemaField$p({
      cunning: new SkillField("psyche", "DGNS.Cunning"),
      deception: new SkillField("psyche", "DGNS.Deception"),
      domination: new SkillField("psyche", "DGNS.Domination"),
      faith: new SkillField("psyche", "DGNS.Faith"),
      reaction: new SkillField("psyche", "DGNS.Reaction"),
      willpower: new SkillField("psyche", "DGNS.Willpower")
    });
    const instinctSkills = new SchemaField$p({
      empathy: new SkillField("instinct", "DGNS.Empathy"),
      orienteering: new SkillField("instinct", "DGNS.Orienteering"),
      perception: new SkillField("instinct", "DGNS.Perception"),
      primal: new SkillField("instinct", "DGNS.Primal"),
      survival: new SkillField("instinct", "DGNS.Survival"),
      taming: new SkillField("instinct", "DGNS.Taming")
    });
    return {
      attributes: new SchemaField$p({
        body: new AttributeField({ label: "DGNS.Body" }, {}, bodySkills),
        agility: new AttributeField(
          { label: "DGNS.Agility" },
          {},
          agilitySkills
        ),
        charisma: new AttributeField(
          { label: "DGNS.Charisma" },
          {},
          charismaSkills
        ),
        intellect: new AttributeField(
          { label: "DGNS.Intellect" },
          {},
          intellectSkills
        ),
        psyche: new AttributeField({ label: "DGNS.Psyche" }, {}, psycheSkills),
        instinct: new AttributeField(
          { label: "DGNS.Instinct" },
          {},
          instinctSkills
        )
      })
    };
  }
  static get modes() {
    return {
      modes: new SchemaField$p({
        primalFocus: new StringField$r({
          label: "DGNS.PrimalFocus",
          initial: "primal",
          choices: ["primal", "focus"]
        }),
        faithWillpower: new StringField$r({
          label: "DGNS.FaithWillpower",
          initial: "faith",
          choices: ["faith", "willpower"]
        })
      })
    };
  }
  /** Deprecated  */
  static get skills() {
    return {
      skills: new SchemaField$p({
        // Body group
        athletics: new SkillField("body", "DGNS.Athletics"),
        brawl: new SkillField("body", "DGNS.Brawl"),
        force: new SkillField("body", "DGNS.Force"),
        melee: new SkillField("body", "DGNS.Melee"),
        stamina: new SkillField("body", "DGNS.Stamina"),
        toughness: new SkillField("body", "DGNS.Toughness"),
        // Agility group
        crafting: new SkillField("agility", "DGNS.Crafting"),
        dexterity: new SkillField("agility", "DGNS.Dexterity"),
        navigation: new SkillField("agility", "DGNS.Navigation"),
        mobility: new SkillField("agility", "DGNS.Mobility"),
        projectiles: new SkillField("agility", "DGNS.Projectiles"),
        stealth: new SkillField("agility", "DGNS.Stealth"),
        // Charisma group
        arts: new SkillField("charisma", "DGNS.Arts"),
        conduct: new SkillField("charisma", "DGNS.Conduct"),
        expression: new SkillField("charisma", "DGNS.Expression"),
        leadership: new SkillField("charisma", "DGNS.Leadership"),
        negotiation: new SkillField("charisma", "DGNS.Negotiation"),
        seduction: new SkillField("charisma", "DGNS.Seduction"),
        // Intellect group
        artifact: new SkillField("intellect", "DGNS.Artifact"),
        engineering: new SkillField("intellect", "DGNS.Engineering"),
        focus: new SkillField("intellect", "DGNS.Focus"),
        legends: new SkillField("intellect", "DGNS.Legends"),
        medicine: new SkillField("intellect", "DGNS.Medicine"),
        science: new SkillField("intellect", "DGNS.Science"),
        // Psyche group
        cunning: new SkillField("psyche", "DGNS.Cunning"),
        deception: new SkillField("psyche", "DGNS.Deception"),
        domination: new SkillField("psyche", "DGNS.Domination"),
        faith: new SkillField("psyche", "DGNS.Faith"),
        reaction: new SkillField("psyche", "DGNS.Reaction"),
        willpower: new SkillField("psyche", "DGNS.Willpower"),
        // Instinct group
        empathy: new SkillField("instinct", "DGNS.Empathy"),
        orienteering: new SkillField("instinct", "DGNS.Orienteering"),
        perception: new SkillField("instinct", "DGNS.Perception"),
        primal: new SkillField("instinct", "DGNS.Primal"),
        survival: new SkillField("instinct", "DGNS.Survival"),
        taming: new SkillField("instinct", "DGNS.Taming")
      })
    };
  }
}
const {
  SchemaField: SchemaField$o,
  NumberField: NumberField$p,
  StringField: StringField$q,
  BooleanField: BooleanField$m,
  ArrayField: ArrayField$m,
  IntegerSortField: IntegerSortField$m
} = foundry.data.fields;
class ConditionFields {
  static get condition() {
    return {
      condition: new SchemaField$o({
        ego: new SchemaField$o({
          value: new NumberField$p({ integer: true, initial: 0 }),
          max: new NumberField$p({ integer: true, initial: 0 })
        }),
        spore: new SchemaField$o({
          value: new NumberField$p({ integer: true, initial: 0 }),
          max: new NumberField$p({ integer: true, initial: 0 }),
          permanent: new NumberField$p({ integer: true, initial: 0 })
        }),
        fleshwounds: new SchemaField$o({
          value: new NumberField$p({ integer: true, initial: 0 }),
          max: new NumberField$p({ integer: true, initial: 0 })
        }),
        trauma: new SchemaField$o({
          value: new NumberField$p({ integer: true, initial: 0 }),
          max: new NumberField$p({ integer: true, initial: 0 })
        })
      })
    };
  }
}
const {
  SchemaField: SchemaField$n,
  NumberField: NumberField$o,
  StringField: StringField$p,
  HTMLField: HTMLField$f,
  BooleanField: BooleanField$l,
  ArrayField: ArrayField$l,
  IntegerSortField: IntegerSortField$l
} = foundry.data.fields;
let GeneralFields$1 = class GeneralFields {
  static get general() {
    return {
      general: new SchemaField$n({
        movement: new NumberField$o({ initial: 0, integer: true }),
        encumbrance: new SchemaField$n({
          max: new NumberField$o({ initial: 0, integer: true }),
          current: new NumberField$o({ initial: 0, integer: true })
        }),
        armor: new NumberField$o({ initial: 0, integer: true }),
        actionModifier: new NumberField$o({ initial: 0, integer: true })
      })
    };
  }
  static get fighting() {
    return {
      fighting: new SchemaField$n({
        initiative: new NumberField$o({ initial: 0, integer: true }),
        dodge: new NumberField$o({ initial: 0, integer: true }),
        mentalDefense: new NumberField$o({ initial: 0, integer: true }),
        passiveDefense: new NumberField$o({ initial: 0, integer: true })
      })
    };
  }
  static get state() {
    return {
      state: new SchemaField$n({
        motion: new BooleanField$l({ initial: false }),
        active: new BooleanField$l({ initial: false }),
        cover: new NumberField$o({ initial: 0, min: 0, integer: true }),
        vision: new SchemaField$n({
          mallus: new NumberField$o({ initial: 0 })
        }),
        discomfort: new SchemaField$n({
          mallus: new NumberField$o({ initial: 0 }),
          negateUsed: new BooleanField$l({})
        }),
        initiative: new SchemaField$n({
          value: new NumberField$o({ initial: 0, min: 0, integer: true }),
          actions: new NumberField$o({ initial: 1, min: 1, integer: true })
        }),
        spentEgo: new SchemaField$n({
          value: new NumberField$o({ initial: 0, min: 0, max: 3, integer: true }),
          actionBonus: new NumberField$o({
            initial: 0,
            min: 0,
            max: 3,
            integer: true
          })
        }),
        spentSpore: new SchemaField$n({
          value: new NumberField$o({ initial: 0, min: 0, max: 3, integer: true }),
          actionBonus: new NumberField$o({
            initial: 0,
            min: 0,
            max: 3,
            integer: true
          })
        })
      })
    };
  }
};
const {
  SchemaField: SchemaField$m,
  NumberField: NumberField$n,
  StringField: StringField$o,
  HTMLField: HTMLField$e,
  BooleanField: BooleanField$k,
  ArrayField: ArrayField$k,
  IntegerSortField: IntegerSortField$k
} = foundry.data.fields;
class DetailsFields {
  static get details() {
    return {
      details: new SchemaField$m({
        age: new StringField$o({ label: "DGNS.Age" }),
        sex: new StringField$o({ label: "DGNS.Sex" }),
        height: new StringField$o({ label: "DGNS.Height" }),
        weight: new StringField$o({ label: "DGNS.Weight" }),
        experience: new SchemaField$m({
          current: new NumberField$n({
            integer: true,
            nullable: false,
            initial: 0
          }),
          spent: new NumberField$n({
            integer: true,
            nullable: false,
            initial: 0
          }),
          total: new NumberField$n({
            integer: true,
            nullable: false,
            initial: 0
          })
        })
      })
    };
  }
  static get backrounds() {
    return {
      backgrounds: new SchemaField$m({
        allies: new NumberField$n({
          integer: true,
          nullable: false,
          initial: 0,
          min: 0,
          max: 6,
          label: "DGNS.Allies"
        }),
        authority: new NumberField$n({
          integer: true,
          nullable: false,
          initial: 0,
          min: 0,
          max: 6,
          label: "DGNS.Authority"
        }),
        network: new NumberField$n({
          integer: true,
          nullable: false,
          initial: 0,
          min: 0,
          max: 6,
          label: "DGNS.Network"
        }),
        renown: new NumberField$n({
          integer: true,
          nullable: false,
          initial: 0,
          min: 0,
          max: 6,
          label: "DGNS.Renown"
        }),
        resources: new NumberField$n({
          integer: true,
          nullable: false,
          initial: 0,
          min: 0,
          max: 6,
          label: "DGNS.Resources"
        }),
        secrets: new NumberField$n({
          integer: true,
          nullable: false,
          initial: 0,
          min: 0,
          max: 6,
          label: "DGNS.Secrets"
        })
      })
    };
  }
  static get biography() {
    return {
      biography: new HTMLField$e({ label: "DGNS.Biography" }),
      ownerNotes: new HTMLField$e({ label: "DGNS.OwnerNotes" }),
      gmNotes: new HTMLField$e({ label: "DGNS.GMNotes" })
    };
  }
}
const { StringField: StringField$n, ForeignDocumentField: ForeignDocumentField$4 } = foundry.data.fields;
const { BaseItem: BaseItem$3, BaseActor: BaseActor$2 } = foundry.documents;
class IdentityFields {
  static get identity() {
    return {
      // CachedReferenceFields for storing information about linked items
      cultureItem: new CachedReferenceField(BaseItem$3),
      conceptItem: new CachedReferenceField(BaseItem$3),
      cultItem: new CachedReferenceField(BaseItem$3),
      group: new ForeignDocumentField$4(BaseActor$2),
      rank: new StringField$n({ label: "DGNS.Rank" })
    };
  }
}
const {
  SchemaField: SchemaField$l,
  NumberField: NumberField$m,
  StringField: StringField$m,
  BooleanField: BooleanField$j,
  ArrayField: ArrayField$j,
  IntegerSortField: IntegerSortField$j
} = foundry.data.fields;
class CharacterData extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static _systemType = "character";
  // *------------------------*
  static defineSchema() {
    return {
      ...AttributesSkillsFields.attributes,
      // Basic attributes and skills
      ...AttributesSkillsFields.modes,
      // Primal / Focus and Faith / Willpower Flags
      //...AttributesSkillsFields.skills,
      ...GeneralFields$1.general,
      ...GeneralFields$1.state,
      ...GeneralFields$1.fighting,
      ...ConditionFields.condition,
      ...DetailsFields.details,
      ...DetailsFields.backrounds,
      ...DetailsFields.biography,
      ...IdentityFields.identity
      // Culture, concept, class items UUID reference
    };
  }
  // *------------------------*
  /** @inheritdoc */
  prepareBaseData() {
    this.culture = CachedReferenceField.resolve(this.cultureItem);
    this.concept = CachedReferenceField.resolve(this.conceptItem);
    this.cult = CachedReferenceField.resolve(this.cultItem);
    this.actionNumbers = this.prepareActionNumbers();
  }
  // *------------------------*
  /** @inheritdoc */
  /*   prepareDerivedData() {
    console.log(`Character | DataModel | prepareDerivedData`);
  } */
  // async _preUpdate(changes, options, user) { }
  //#endergion
  //#region Preparing data helpers
  // *========================================*
  /**
   * Sum attribute value with skill value. Base action number.
   * @returns {object} Object with skill names as properties.
   */
  prepareActionNumbers() {
    let actionNumbers = {};
    for (let attribute in this.attributes) {
      for (let skill in this.attributes[attribute].skills) {
        actionNumbers[skill] = this.attributes[attribute].value + this.attributes[attribute].skills[skill].value;
      }
    }
    return actionNumbers;
  }
  // *------------------------*
  //#region Helper methods
  // *------------------------*
  /** Getter for primary chracter mode.  */
  get PrimalOrFocus() {
    return this.modes.primalFocus;
  }
  // *------------------------*
  /** Getter for secondary chracter mode.  */
  get FaithOrWillpower() {
    return this.modes.faithWillpower;
  }
  //todo: move methods to Actor document
  async removeLinkedItem(itemType) {
    await CachedReferenceField.removeLinked(`${itemType}Item`, this.parent);
  }
  /**
   * Combine saving linked reference and creating cached document.
   * @param {*} path
   * @param {*} itemId
   */
  async setLinkedItem(path, itemId) {
    await this.parent.update({ [`system.${path}.linked`]: itemId });
  }
  async setCulture(itemId) {
    await this.setLinkedItem("cultureItem", itemId);
  }
  async setConcept(itemId) {
    await this.setLinkedItem("conceptItem", itemId);
  }
  async setCult(itemId) {
    await this.setLinkedItem("cultItem", itemId);
  }
  //#endregion
}
const {
  SchemaField: SchemaField$k,
  NumberField: NumberField$l,
  StringField: StringField$l,
  BooleanField: BooleanField$i,
  ArrayField: ArrayField$i,
  IntegerSortField: IntegerSortField$i
} = foundry.data.fields;
class ArmorField extends SchemaField$k {
  constructor(options = {}, schemaOptions = {}) {
    const fields2 = {
      name: new StringField$l({}),
      rating: new NumberField$l({ integer: true, min: 0, initial: 0 })
    };
    super(fields2, schemaOptions);
  }
}
const {
  SchemaField: SchemaField$j,
  NumberField: NumberField$k,
  StringField: StringField$k,
  BooleanField: BooleanField$h,
  ArrayField: ArrayField$h,
  IntegerSortField: IntegerSortField$h,
  HTMLField: HTMLField$d
} = foundry.data.fields;
class NPCData extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static _systemType = "npc";
  static defineSchema() {
    console.log(`Defining schema for NPC...`);
    return {
      ...AttributesSkillsFields.attributes,
      //...AttributesSkillsFields.skills,
      ...GeneralFields$1.general,
      ...GeneralFields$1.state,
      ...GeneralFields$1.fighting,
      ...ConditionFields.condition,
      ...DetailsFields.details,
      ...DetailsFields.backrounds,
      ...DetailsFields.biography,
      armor: new ArmorField(),
      tactics: new HTMLField$d({})
    };
  }
  prepareBaseData() {
  }
}
const { SchemaField: SchemaField$i, StringField: StringField$j, HTMLField: HTMLField$c, NumberField: NumberField$j } = foundry.data.fields;
class FromHellData extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static _systemType = "fromHell";
  static defineSchema() {
    return {
      ...GeneralFields$1.general,
      ...GeneralFields$1.state,
      ...GeneralFields$1.fighting,
      ...ConditionFields.condition,
      armor: new ArmorField(),
      tactics: new HTMLField$c({}),
      about: new HTMLField$c({})
    };
  }
  prepareBaseData() {
  }
}
const { SchemaField: SchemaField$h, StringField: StringField$i, HTMLField: HTMLField$b, NumberField: NumberField$i } = foundry.data.fields;
class AberrantData extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static _systemType = "aberrant";
  static defineSchema() {
    return {
      ...AttributesSkillsFields.attributes,
      //...AttributesSkillsFields.skills,
      ...GeneralFields$1.general,
      ...GeneralFields$1.state,
      ...GeneralFields$1.fighting,
      ...ConditionFields.condition,
      ...DetailsFields.details,
      ...DetailsFields.backrounds,
      ...DetailsFields.biography,
      armor: new ArmorField(),
      variant: new StringField$i({}),
      tactics: new HTMLField$b({}),
      rapture: new StringField$i({}),
      skinbags: new NumberField$i({ integer: true, min: 0, initial: 0 }),
      phase: new StringField$i({ initial: "primal" })
    };
  }
  // ? prepareBaseData() {}
}
const {
  SchemaField: SchemaField$g,
  NumberField: NumberField$h,
  StringField: StringField$h,
  BooleanField: BooleanField$g,
  ArrayField: ArrayField$g,
  IntegerSortField: IntegerSortField$g,
  HTMLField: HTMLField$a
} = foundry.data.fields;
class SleeperData extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static _systemType = "sleeper";
  static defineSchema() {
    return {
      ...AttributesSkillsFields.attributes,
      //...AttributesSkillsFields.skills,
      ...GeneralFields$1.general,
      ...GeneralFields$1.state,
      ...GeneralFields$1.fighting,
      ...ConditionFields.condition,
      ...DetailsFields.details,
      ...DetailsFields.backrounds,
      ...DetailsFields.biography,
      armor: new ArmorField(),
      tactics: new HTMLField$a({})
    };
  }
  prepareBaseData() {
  }
}
const {
  SchemaField: SchemaField$f,
  NumberField: NumberField$g,
  StringField: StringField$g,
  BooleanField: BooleanField$f,
  ArrayField: ArrayField$f,
  IntegerSortField: IntegerSortField$f,
  HTMLField: HTMLField$9
} = foundry.data.fields;
class MarauderData extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static _systemType = "marauder";
  static defineSchema() {
    return {
      ...AttributesSkillsFields.attributes,
      //...AttributesSkillsFields.skills,
      ...GeneralFields$1.general,
      ...GeneralFields$1.state,
      ...GeneralFields$1.fighting,
      ...ConditionFields.condition,
      ...DetailsFields.details,
      ...DetailsFields.backrounds,
      ...DetailsFields.biography,
      armor: new ArmorField(),
      tactics: new HTMLField$9({})
    };
  }
  prepareBaseData() {
  }
}
const {
  SchemaField: SchemaField$e,
  NumberField: NumberField$f,
  StringField: StringField$f,
  BooleanField: BooleanField$e,
  ArrayField: ArrayField$e,
  SetField,
  ForeignDocumentField: ForeignDocumentField$3,
  IntegerSortField: IntegerSortField$e
} = foundry.data.fields;
const { BaseItem: BaseItem$2, BaseActor: BaseActor$1 } = foundry.documents;
class GroupData extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static _systemType = "group";
  static defineSchema() {
    return {
      name: new StringField$f({}),
      members: new ArrayField$e(
        new SchemaField$e({
          actor: new ForeignDocumentField$3(BaseActor$1, {
            nullable: true,
            idOnly: false
            // Returns full Item document
          })
        })
      ),
      alignment: new StringField$f({})
    };
  }
  prepareBaseData() {
  }
}
const config$1 = {
  character: CharacterData,
  npc: NPCData,
  fromhell: FromHellData,
  aberrant: AberrantData,
  sleeper: SleeperData,
  marauder: MarauderData,
  group: GroupData
};
const {
  SchemaField: SchemaField$d,
  NumberField: NumberField$e,
  StringField: StringField$e,
  HTMLField: HTMLField$8,
  BooleanField: BooleanField$d,
  ObjectField,
  ArrayField: ArrayField$d,
  ForeignDocumentField: ForeignDocumentField$2,
  IntegerSortField: IntegerSortField$d,
  DocumentIdField: DocumentIdField$8,
  FilePathField
} = foundry.data.fields;
const { BaseItem: BaseItem$1 } = foundry.documents;
class GeneralFields2 {
  static get subtitle() {
    return {
      subtitle: new StringField$e({ label: "DGNS.Subtitle" })
    };
  }
  static get description() {
    return {
      description: new HTMLField$8({ label: "DGNS.Description" })
    };
  }
  static get textSections() {
    return {
      textSections: new ArrayField$d(
        new fields.HTMLField({
          required: false,
          blank: true,
          label: "DGNS.TextSection"
        })
      )
    };
  }
  static get backgroundImage() {
    return {
      backgroundImage: new FilePathField({
        categories: ["IMAGE"],
        blank: true,
        default: null,
        label: "DGNS.BackgroundImage"
      })
    };
  }
  static get group() {
    return {
      group: new StringField$e({ label: "DGNS.Group" })
    };
  }
  static get weaponGroup() {
    return {
      group: new StringField$e({
        label: "DGNS.Group",
        choices: WEAPON_GROUPS,
        required: false,
        blank: true
      })
    };
  }
  static get rules() {
    return {
      rules: new StringField$e({ label: "DGNS.Rules" })
    };
  }
  static get effect() {
    return {
      effect: new StringField$e({ label: "DGNS.Effect" })
    };
  }
  static get equipped() {
    return {
      equipped: new BooleanField$d({ default: false })
    };
  }
  static get dropped() {
    return {
      equipped: new BooleanField$d({ default: false })
    };
  }
  static get prerequisite() {
    return {
      prerequisite: new StringField$e({ label: "DGNS.Prerequisite" })
    };
  }
  static get slots() {
    return {
      slots: new SchemaField$d({
        total: new NumberField$e({}),
        used: new NumberField$e({})
      })
    };
  }
  static get qualities() {
    return {
      qualities: new ArrayField$d(
        new SchemaField$d({
          key: new StringField$e({ required: true }),
          //quality object key
          enabled: new BooleanField$d({ initial: true }),
          // toggling state
          def: new ObjectField({ initial: {} })
          //entire quality definition
        })
      )
    };
  }
  static get quantity() {
    return {
      quantity: new NumberField$e({
        label: "DGNS.Quantity",
        initial: 1,
        integer: true,
        min: 0
      })
    };
  }
  static get value() {
    return {
      value: new NumberField$e({
        label: "DGNS.Value",
        initial: 0,
        integer: true,
        min: 0
      })
    };
  }
  static get encumbrance() {
    return {
      encumbrance: new NumberField$e({
        label: "DGNS.Encumbrance",
        initial: 0,
        integer: true,
        min: 0
      })
    };
  }
  static get tech() {
    return {
      tech: new NumberField$e({
        label: "DGNS.Tech",
        initial: 1,
        min: 0
      })
    };
  }
  static get resources() {
    return {
      resources: new NumberField$e({
        label: "DGNS.Resources",
        initial: 0,
        min: 0,
        integer: true
      })
    };
  }
  static get cult() {
    return {
      cult: new StringField$e({
        label: "DGNS.Cult"
      })
    };
  }
  /** Containers / location reference  */
  static get location() {
    return {
      location: new ForeignDocumentField$2(BaseItem$1, {
        idOnly: true,
        required: false,
        nullable: true,
        initial: null
      })
    };
  }
}
const {
  SchemaField: SchemaField$c,
  NumberField: NumberField$d,
  StringField: StringField$d,
  BooleanField: BooleanField$c,
  ArrayField: ArrayField$c,
  IntegerSortField: IntegerSortField$c
} = foundry.data.fields;
class IdentityBonusFields {
  static get attributeBonus() {
    return {
      attrBonus: new ArrayField$c(
        new SchemaField$c({
          attribute: new StringField$d({
            label: "DGNS.Attribute",
            choices: DEGENESIS.attributes
          }),
          max: new NumberField$d({
            nullable: true,
            integer: true,
            positive: true
          })
        })
      )
    };
  }
  static get skillBonus() {
    return {
      skillBonus: new ArrayField$c(
        new SchemaField$c({
          skill: new StringField$d({
            label: "DGNS.Skill",
            choices: DEGENESIS.skills
          }),
          max: new NumberField$d({
            nullable: true,
            integer: true,
            positive: true
          })
        })
      )
    };
  }
  // Consider changing this later to links to items - this will complicates multilangual compendiums,
  // but maybe worth the effort
  static get commonCults() {
    return {
      commonCults: new ArrayField$c(
        new StringField$d({
          label: "DGNS.Cult"
        })
      )
    };
  }
}
const {
  SchemaField: SchemaField$b,
  NumberField: NumberField$c,
  StringField: StringField$c,
  BooleanField: BooleanField$b,
  ArrayField: ArrayField$b,
  IntegerSortField: IntegerSortField$b
} = foundry.data.fields;
class CultureData extends foundry.abstract.TypeDataModel {
  static _sync = true;
  static _systemType = "culture";
  static defineSchema() {
    return {
      ...GeneralFields2.subtitle,
      ...GeneralFields2.description,
      ...GeneralFields2.backgroundImage,
      ...IdentityBonusFields.commonCults,
      ...IdentityBonusFields.attributeBonus,
      ...IdentityBonusFields.skillBonus
    };
  }
  get isSyncable() {
    return this.constructor._sync;
  }
}
const {
  SchemaField: SchemaField$a,
  NumberField: NumberField$b,
  StringField: StringField$b,
  BooleanField: BooleanField$a,
  ArrayField: ArrayField$a,
  IntegerSortField: IntegerSortField$a
} = foundry.data.fields;
class ConceptData extends foundry.abstract.TypeDataModel {
  static _sync = true;
  static _systemType = "concept";
  static defineSchema() {
    return {
      ...GeneralFields2.description,
      ...GeneralFields2.backgroundImage,
      ...IdentityBonusFields.attributeBonus,
      ...IdentityBonusFields.skillBonus
    };
  }
  get isSyncable() {
    return this.constructor._sync;
  }
}
const {
  SchemaField: SchemaField$9,
  NumberField: NumberField$a,
  StringField: StringField$a,
  BooleanField: BooleanField$9,
  ArrayField: ArrayField$9,
  IntegerSortField: IntegerSortField$9
} = foundry.data.fields;
class CultData extends foundry.abstract.TypeDataModel {
  static _sync = true;
  static _systemType = "cult";
  static defineSchema() {
    return {
      isClan: new BooleanField$9({ initial: false }),
      // added instead another character field
      ...GeneralFields2.description,
      ...GeneralFields2.backgroundImage,
      ...IdentityBonusFields.skillBonus
    };
  }
  get isSyncable() {
    return this.constructor._sync;
  }
}
const {
  SchemaField: SchemaField$8,
  NumberField: NumberField$9,
  StringField: StringField$9,
  HTMLField: HTMLField$7,
  BooleanField: BooleanField$8,
  ArrayField: ArrayField$8,
  IntegerSortField: IntegerSortField$8,
  DocumentIdField: DocumentIdField$7
} = foundry.data.fields;
class LegacyData extends foundry.abstract.TypeDataModel {
  static _systemType = "legacy";
  static defineSchema() {
    return {
      ...GeneralFields2.prerequisite,
      legacy: new StringField$9({
        label: "DGNS.Legacy"
      }),
      drawback: new StringField$9({
        label: "DGNS.Drawback"
      }),
      bonus: new StringField$9({
        label: "DGNS.Bonus"
      })
    };
  }
}
const {
  SchemaField: SchemaField$7,
  NumberField: NumberField$8,
  StringField: StringField$8,
  BooleanField: BooleanField$7,
  ArrayField: ArrayField$7,
  IntegerSortField: IntegerSortField$7
} = foundry.data.fields;
class FormulaField extends StringField$8 {
}
const {
  SchemaField: SchemaField$6,
  NumberField: NumberField$7,
  StringField: StringField$7,
  HTMLField: HTMLField$6,
  BooleanField: BooleanField$6,
  ArrayField: ArrayField$6,
  ForeignDocumentField: ForeignDocumentField$1,
  IntegerSortField: IntegerSortField$6,
  DocumentIdField: DocumentIdField$6
} = foundry.data.fields;
const { BaseItem, BaseActor } = foundry.documents;
class CombatFields {
  static get damage() {
    return {
      damage: new SchemaField$6({
        value: new NumberField$7({
          label: "DGNS.DamageValue",
          initial: 0,
          integer: true
        }),
        type: new StringField$7({ label: "DGNS.DamageType" }),
        bonus: new StringField$7({ label: "DGNS.DamageBonus" })
      })
    };
  }
  /**
   * Do not use!
   * @deprecated
   */
  static get damageBonus() {
    return {
      damageBonus: new SchemaField$6({
        formula: new FormulaField({
          label: "DGNS.DamageBonusFormula"
        })
      })
    };
  }
  static get armorPoints() {
    return {
      armorPoints: new NumberField$7({
        label: "DGNS.ArmorPoints",
        initial: 0,
        min: 0,
        integer: true
      })
    };
  }
  static get handling() {
    return {
      handling: new NumberField$7({
        label: "DGNS.Handling",
        initial: 0,
        integer: true
      })
    };
  }
  static get distance() {
    return {
      distance: new SchemaField$6({
        melee: new NumberField$7({
          label: "DGNS.MeleeDistance",
          integer: true,
          min: 0,
          initial: 1
        }),
        short: new NumberField$7({
          label: "DGNS.ShortDistance",
          integer: true,
          min: 0,
          initial: 0
        }),
        far: new NumberField$7({
          label: "DGNS.FarDistance",
          integer: true,
          min: 0,
          initial: 0
        })
      })
    };
  }
  static get skills() {
    return {
      skills: new SchemaField$6({
        primary: new StringField$7({ label: "DGNS.PrimarySkill" }),
        secondary: new StringField$7({ label: "DGNS.SecondarySkill" })
      })
    };
  }
  static get ammunition() {
    return {
      ammunition: new SchemaField$6({
        caliber: new StringField$7({
          label: "DGNS.Caliber",
          choices: CALIBERS,
          blank: true,
          initial: ""
        }),
        magazine: new SchemaField$6({
          size: new NumberField$7({}),
          belt: new BooleanField$6({ default: false })
        }),
        // Ammo item link.
        loaded: new ForeignDocumentField$1(BaseItem, {
          nullable: true,
          idOnly: false
        }),
        current: new NumberField$7({})
      })
    };
  }
}
class AmmunitionData extends foundry.abstract.TypeDataModel {
  static _systemType = "ammunition";
  static defineSchema() {
    return {
      ...GeneralFields2.description,
      ...GeneralFields2.quantity,
      ...GeneralFields2.equipped,
      ...GeneralFields2.dropped,
      ...GeneralFields2.tech,
      ...GeneralFields2.value,
      ...CombatFields.damage
    };
  }
}
class ArmorData extends foundry.abstract.TypeDataModel {
  static _systemType = "armor";
  static defineSchema() {
    return {
      ...GeneralFields2.description,
      ...GeneralFields2.quantity,
      ...GeneralFields2.encumbrance,
      ...GeneralFields2.equipped,
      ...GeneralFields2.dropped,
      ...GeneralFields2.qualities,
      ...GeneralFields2.slots,
      ...GeneralFields2.tech,
      ...GeneralFields2.resources,
      ...GeneralFields2.value,
      ...GeneralFields2.cult,
      ...CombatFields.armorPoints
    };
  }
}
const {
  SchemaField: SchemaField$5,
  NumberField: NumberField$6,
  StringField: StringField$6,
  HTMLField: HTMLField$5,
  BooleanField: BooleanField$5,
  ArrayField: ArrayField$5,
  IntegerSortField: IntegerSortField$5,
  DocumentIdField: DocumentIdField$5
} = foundry.data.fields;
class BurnData extends foundry.abstract.TypeDataModel {
  static _systemType = "burn";
  static defineSchema() {
    return {
      chakra: new StringField$6({
        label: "DGNS.Chakra"
      }),
      earthChakra: new StringField$6({
        label: "DGNS.EarthChakra"
      }),
      ...GeneralFields2.description,
      ...GeneralFields2.effect,
      ...GeneralFields2.rules,
      cost: new SchemaField$5({
        weak: new NumberField$6({
          label: "DGNS.Weak",
          initial: 0,
          min: 0,
          integer: true
        }),
        potent: new NumberField$6({
          label: "DGNS.Potent",
          initial: 0,
          min: 0,
          integer: true
        })
      })
    };
  }
}
const { NumberField: NumberField$5, StringField: StringField$5 } = foundry.data.fields;
class ComplicationData extends foundry.abstract.TypeDataModel {
  static _systemType = "complication";
  static defineSchema() {
    return {
      ...GeneralFields2.description,
      cost: new StringField$5({
        label: "DGNS.ComplicationCost"
      }),
      rating: new NumberField$5({
        label: "DGNS.Level",
        initial: 1,
        min: 1,
        integer: true
      })
    };
  }
}
class EquipmentData extends foundry.abstract.TypeDataModel {
  static _systemType = "equipment";
  static defineSchema() {
    return {
      ...GeneralFields2.description,
      ...GeneralFields2.quantity,
      ...GeneralFields2.encumbrance,
      ...GeneralFields2.tech,
      ...GeneralFields2.value,
      ...GeneralFields2.resources,
      ...GeneralFields2.cult,
      ...GeneralFields2.effect,
      ...GeneralFields2.group,
      ...GeneralFields2.dropped
    };
  }
}
const {
  SchemaField: SchemaField$4,
  NumberField: NumberField$4,
  StringField: StringField$4,
  HTMLField: HTMLField$4,
  BooleanField: BooleanField$4,
  ArrayField: ArrayField$4,
  IntegerSortField: IntegerSortField$4,
  DocumentIdField: DocumentIdField$4
} = foundry.data.fields;
class ModData extends foundry.abstract.TypeDataModel {
  static _systemType = "mod";
  static defineSchema() {
    return {
      ...GeneralFields2.description,
      ...GeneralFields2.effect,
      ...GeneralFields2.qualities,
      type: new StringField$4({
        label: "DGNS.ModType",
        initial: "weapon"
      }),
      slotCost: new NumberField$4({
        label: "DGNS.Slot",
        initial: 1,
        min: 0,
        integer: true
      })
    };
  }
}
const {
  SchemaField: SchemaField$3,
  NumberField: NumberField$3,
  StringField: StringField$3,
  HTMLField: HTMLField$3,
  BooleanField: BooleanField$3,
  ArrayField: ArrayField$3,
  IntegerSortField: IntegerSortField$3,
  DocumentIdField: DocumentIdField$3
} = foundry.data.fields;
class PhenomenonData extends foundry.abstract.TypeDataModel {
  static _systemType = "phenomenon";
  static defineSchema() {
    return {
      ...GeneralFields2.description,
      ...GeneralFields2.rules,
      rapture: new StringField$3({
        label: "DGNS.Rapture"
      }),
      level: new NumberField$3({
        label: "DGNS.Level",
        initial: 1,
        min: 0,
        integer: true
      })
    };
  }
}
const {
  SchemaField: SchemaField$2,
  NumberField: NumberField$2,
  StringField: StringField$2,
  HTMLField: HTMLField$2,
  BooleanField: BooleanField$2,
  ArrayField: ArrayField$2,
  IntegerSortField: IntegerSortField$2,
  DocumentIdField: DocumentIdField$2
} = foundry.data.fields;
class PotentialData extends foundry.abstract.TypeDataModel {
  static _systemType = "potential";
  static defineSchema() {
    return {
      ...GeneralFields2.prerequisite,
      ...GeneralFields2.rules,
      ...GeneralFields2.effect,
      level: new NumberField$2({
        label: "DGNS.Level",
        initial: 1,
        min: 1,
        integer: true
      })
    };
  }
}
const {
  SchemaField: SchemaField$1,
  NumberField: NumberField$1,
  StringField: StringField$1,
  HTMLField: HTMLField$1,
  BooleanField: BooleanField$1,
  ArrayField: ArrayField$1,
  IntegerSortField: IntegerSortField$1,
  DocumentIdField: DocumentIdField$1
} = foundry.data.fields;
class ShieldData extends foundry.abstract.TypeDataModel {
  static _systemType = "shield";
  static defineSchema() {
    return {
      ...GeneralFields2.description,
      ...GeneralFields2.equipped,
      ...GeneralFields2.dropped,
      ...GeneralFields2.quantity,
      ...GeneralFields2.qualities,
      ...GeneralFields2.encumbrance,
      ...GeneralFields2.tech,
      ...GeneralFields2.slots,
      ...GeneralFields2.value,
      ...GeneralFields2.resources,
      ...GeneralFields2.cult,
      attack: new SchemaField$1({
        diceMod: new NumberField$1({ integer: true, initial: 0 })
      }),
      defense: new SchemaField$1({
        diceMod: new NumberField$1({ integer: true, initial: 0 }),
        passive: new NumberField$1({ integer: true, initial: 0 })
      })
    };
  }
}
class BaseItemData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...GeneralFields2.location,
      // containers
      ...GeneralFields2.description,
      ...GeneralFields2.dropped,
      ...GeneralFields2.quantity,
      ...GeneralFields2.tech,
      ...GeneralFields2.resources,
      ...GeneralFields2.cult,
      ...GeneralFields2.encumbrance,
      ...GeneralFields2.value
    };
  }
  /** Generic handling for dropping equipped items.  */
  _preUpdate(changed, options, user) {
    const res = super._preUpdate(changed, options, user);
    if (res === false) return false;
    if ("equipped" in this) {
      if (changed.system?.dropped === true) {
        changed.system.equipped = false;
      }
      if (changed.system?.equipped === true) {
        changed.system.dropped = false;
      }
    }
    return true;
  }
}
const {
  SchemaField,
  NumberField,
  StringField,
  HTMLField,
  BooleanField,
  ArrayField,
  IntegerSortField,
  DocumentIdField,
  ForeignDocumentField
} = foundry.data.fields;
class TransportationData extends BaseItemData {
  static _systemType = "transportation";
  static defineSchema() {
    return {
      ...super.defineSchema(),
      mode: new NumberField({
        label: "DGNS.Mode",
        initial: 0,
        min: 0,
        integer: true
      }),
      items: new ArrayField(
        new LocalDocumentField(foundry.documents.BaseItem, {
          idOnly: false
        }),
        { initial: [] }
        // empty array
      )
    };
  }
  prepareBaseData() {
    super.prepareBaseData();
  }
  // helper to get all items in container
  get items() {
    return this.items.map((item) => item()).filter((i) => !!i);
  }
}
class WeaponData extends BaseItemData {
  static _systemType = "weapon";
  static defineSchema() {
    return {
      ...super.defineSchema(),
      // all base items fields
      ...GeneralFields2.equipped,
      ...GeneralFields2.qualities,
      ...GeneralFields2.slots,
      ...GeneralFields2.resources,
      ...GeneralFields2.cult,
      ...GeneralFields2.weaponGroup,
      // group field with weaponOptions
      ...CombatFields.damage,
      //...CombatFields.damageBonus,
      ...CombatFields.handling,
      ...CombatFields.distance,
      //...CombatFields.magazine,
      ...CombatFields.ammunition,
      //...CombatFields.caliber,
      ...CombatFields.skills
    };
  }
}
const config = {
  culture: CultureData,
  concept: ConceptData,
  cult: CultData,
  legacy: LegacyData,
  ammunition: AmmunitionData,
  armor: ArmorData,
  burn: BurnData,
  complication: ComplicationData,
  equipment: EquipmentData,
  mod: ModData,
  phenomenon: PhenomenonData,
  potential: PotentialData,
  shield: ShieldData,
  transportation: TransportationData,
  weapon: WeaponData
};
const { Actors, Items } = foundry.documents.collections;
const { ActorSheet, ItemSheet } = foundry.appv1.sheets;
globalThis.degenesis = {
  applications
};
CONFIG.DEGENESIS = DEGENESIS;
CONFIG.Dice.rolls = [DGNSRoll];
CONFIG.Dice.DGNSRoll = DGNSRoll;
CONFIG.Actor.documentClass = DGNSActor;
CONFIG.Item.documentClass = DGNSItem;
CONFIG.Actor.dataModels = config$1;
CONFIG.Item.dataModels = config;
CONFIG.ui.pause = DGNSGamePause;
CONFIG.ActiveEffect.phases = {
  initial: { label: "Init" },
  final: { label: "Final" }
};
Hooks.once("init", async function() {
  globalThis.degenesis = game.degenesis = Object.assign(
    game.system,
    globalThis.degenesis
  );
  console.log(
    `%cDEGENESIS%c | Initializing`,
    "color: #ed1d27",
    "color: unset"
  );
  document.onkeydown = function(e) {
    if (e.keyCode == 123)
      console.log(
        `%cDEGENESIS%c | Welcome, Chronicler`,
        "color: #ed1d27",
        "color: unset"
      );
  };
  _setCompendiumBanners();
  preloadHandlebarsTemplates();
  registerHandlebarsHelpers();
  _configureFonts();
  CONFIG.Combat.initiative = {
    formula: "0",
    decimals: 0
  };
  _unregisterCoreSheets();
  Actors.registerSheet("degenesis", DGNSCharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "TYPES.Actor.TypeCharacterSheet",
    themes: {
      dark: "SETTINGS.UI.FIELDS.colorScheme.dark",
      light: "SETTINGS.UI.FIELDS.colorScheme.light"
      // artifacts: "SETTINGS.UI.FIELDS.colorScheme.artifacts",
      // darkBlood: "SETTINGS.UI.FIELDS.colorScheme.darkBlood",
      // lightBlood: "SETTINGS.UI.FIELDS.colorScheme.lightBlood",
    }
  });
  Actors.registerSheet("degenesis", DGNSGroupSheet, {
    types: ["group"],
    makeDefault: true,
    label: "TYPES.Actor.TypeGroupSheet",
    themes: {
      dark: "SETTINGS.UI.FIELDS.colorScheme.dark",
      light: "SETTINGS.UI.FIELDS.colorScheme.light"
    }
  });
  Items.registerSheet("degenesis", DegenesisCultureSheet, {
    types: ["culture"],
    makeDefault: true,
    label: "TYPES.Item.TypeCultureSheet",
    themes: {
      dark: "SETTINGS.UI.FIELDS.colorScheme.dark",
      light: "SETTINGS.UI.FIELDS.colorScheme.light"
      // darkBlood: "SETTINGS.UI.FIELDS.colorScheme.darkBlood",
      //lightBlood: "SETTINGS.UI.FIELDS.colorScheme.lightBlood",
    }
  });
  Items.registerSheet("degenesis", DegenesisConceptSheet, {
    types: ["concept"],
    makeDefault: true,
    label: "TYPES.Item.TypeConceptSheet",
    themes: {
      dark: "SETTINGS.UI.FIELDS.colorScheme.dark",
      light: "SETTINGS.UI.FIELDS.colorScheme.light"
      //  artifacts: "SETTINGS.UI.FIELDS.colorScheme.artifacts",
      // darkBlood: "SETTINGS.UI.FIELDS.colorScheme.darkBlood",
      // lightBlood: "SETTINGS.UI.FIELDS.colorScheme.lightBlood",
    }
  });
  Items.registerSheet("degenesis", DegenesisCultSheet, {
    types: ["cult"],
    makeDefault: true,
    label: "TYPES.Item.TypeCultSheet",
    themes: {
      dark: "SETTINGS.UI.FIELDS.colorScheme.dark",
      light: "SETTINGS.UI.FIELDS.colorScheme.light"
      //artifacts: "SETTINGS.UI.FIELDS.colorScheme.artifacts",
      // darkBlood: "SETTINGS.UI.FIELDS.colorScheme.darkBlood",
      // lightBlood: "SETTINGS.UI.FIELDS.colorScheme.lightBlood",
    }
  });
  Items.registerSheet("degenesis", DegenesisWeaponSheet, {
    types: ["weapon"],
    makeDefault: true,
    label: "TYPES.Item.TypeWeaponSheet",
    themes: {
      dark: "SETTINGS.UI.FIELDS.colorScheme.dark",
      light: "SETTINGS.UI.FIELDS.colorScheme.light"
      //artifacts: "SETTINGS.UI.FIELDS.colorScheme.artifacts",
      // darkBlood: "SETTINGS.UI.FIELDS.colorScheme.darkBlood",
      // lightBlood: "SETTINGS.UI.FIELDS.colorScheme.lightBlood",
    }
  });
  hooks();
  CONFIG.canvasTextStyle = new PIXI.TextStyle({
    fontFamily: "Calluna",
    fontSize: 36,
    fill: "#FFFFFF",
    stroke: "#111111",
    strokeThickness: 1,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: 0,
    dropShadowDistance: 0,
    align: "center",
    wordWrap: false
  });
});
Hooks.on("setup", () => {
  for (let group in DEGENESIS) {
    for (let key in DEGENESIS[group])
      if (typeof DEGENESIS[group][key] == "string")
        DEGENESIS[group][key] = game.i18n.localize(DEGENESIS[group][key]);
  }
});
function _unregisterCoreSheets() {
  Actors.unregisterSheet("core", ActorSheet);
  Items.unregisterSheet("core", ItemSheet);
}
function _setCompendiumBanners() {
  CONFIG.Actor.compendiumBanner = "/systems/degenesisnext/ui/packs/actors-comp.webp";
  CONFIG.Adventure.compendiumBanner = "/systems/degenesisnext/ui/packs/adventures-comp.webp";
  CONFIG.Cards.compendiumBanner = "/systems/degenesisnext/ui/packs/cards-comp.webp";
  CONFIG.Item.compendiumBanner = "/systems/degenesisnext/ui/packs/items-comp.webp";
  CONFIG.JournalEntry.compendiumBanner = "/systems/degenesisnext/ui/packs/journals-comp.webp";
  CONFIG.Macro.compendiumBanner = "/systems/degenesisnext/ui/packs/macros-comp.webp";
  CONFIG.Playlist.compendiumBanner = "/systems/degenesisnext/ui/packs/playlists-comp.webp";
  CONFIG.RollTable.compendiumBanner = "/systems/degenesisnext/ui/packs/rolltables-comp.webp";
  CONFIG.Scene.compendiumBanner = "/systems/degenesisnext/ui/packs/scenes-comp.webp";
}
function _configureFonts() {
  CONFIG.fontDefinitions = {
    "Crimson Pro": {
      editor: true,
      fonts: [
        {
          urls: [
            "systems/degenesisnext/fonts/CrimsonPro-Variable.ttf",
            "systems/degenesisnext/fonts/-Italic-Variable.ttf"
          ]
        }
      ]
    },
    Montserrat: {
      editor: true,
      fonts: [
        {
          urls: [
            "systems/degenesisnext/fonts/Montserrat-Variable.ttf",
            "systems/degenesisnext/fonts/Montserrat-Italic-Variable.ttf"
          ]
        }
      ]
    }
  };
}
