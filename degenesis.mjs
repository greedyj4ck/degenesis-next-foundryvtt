//#region \0rolldown/runtime.js
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
//#endregion
//#region src/module/templates.mjs
/** Function that preload necessary templates */
async function preloadHandlebarsTemplates() {
	const partials = [
		"systems/degenesisnext/templates/shared/group/header.hbs",
		"systems/degenesisnext/templates/shared/actor/culture.hbs",
		"systems/degenesisnext/templates/shared/actor/concept.hbs",
		"systems/degenesisnext/templates/shared/actor/cult.hbs"
	];
	const paths = {};
	for (const path of partials) {
		const parts = path.split("/");
		const fileName = parts.pop().replace(".hbs", "");
		const folderName = parts.pop();
		paths[`dgns.${folderName}.${fileName}`] = path;
	}
	return await foundry.applications.handlebars.loadTemplates(paths);
}
//#endregion
//#region src/module/handlebars.mjs
async function registerHandlebarsHelpers() {
	Handlebars.registerHelper("sheetEditMode", function(mode) {
		return mode === 2 ? true : false;
	});
	Handlebars.registerHelper("isGM", function(options) {
		return game.user.isGM;
	});
	Handlebars.registerHelper("titleCase", (str) => {
		if (!str) return "";
		return str.charAt(0).toUpperCase() + str.slice(1);
	});
	/**
	* Checking if skill should be disabled based on primal / focus and
	* fait / willpower choices.
	*/
	Handlebars.registerHelper("isSkillDisabled", function(skill, modes) {
		if (skill === "primal" && modes.primalFocus === "focus") return true;
		if (skill === "focus" && modes.primalFocus === "primal") return true;
		if (skill === "faith" && modes.faithWillpower === "willpower") return true;
		if (skill === "willpower" && modes.faithWillpower === "faith") return true;
		return false;
	});
	Handlebars.registerHelper("json", function(context) {
		return JSON.stringify(context);
	});
	Handlebars.registerHelper("prettyJson", function(context) {
		return JSON.stringify(context, null, 2);
	});
}
//#endregion
//#region src/module/logic/config/items.mjs
var WEAPON_GROUPS = {
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
var WEAPON_GROUPS_SKILLS = {
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
var CALIBERS = {
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
//#endregion
//#region src/module/logic/damage.mjs
var Damage = {
	modifiers: {
		T: {
			blueprint: "+T",
			calculate: (force, triggers) => triggers
		},
		F: {
			blueprint: "+F",
			calculate: (force, triggers) => force
		},
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
			calculate: (force, triggers) => new Die({
				faces: 6,
				number: 1
			}).evaluate().total
		},
		"2D": {
			blueprint: "+2D",
			calculate: (force, triggers) => new Die({
				faces: 6,
				number: 2
			}).evaluate().total
		},
		D2: {
			blueprint: "+1D/2",
			calculate: (force, triggers) => Math.ceil(new Die({
				faces: 6,
				number: 1
			}).evaluate().total / 2)
		}
	},
	get standardModifiers() {
		return this.modifiers;
	},
	get fromHellModifiers() {
		return {};
	}
};
//#endregion
//#region src/module/logic/config/inputs.mjs
var InputDifficulty = {
	name: "difficulty",
	label: "DGNS.Difficulty",
	type: "number",
	default: 1
};
var InputAngle = {
	name: "angle",
	label: "DGNS.Angle",
	type: "number",
	default: 45
};
var InputRadius = {
	name: "radius",
	label: "DGNS.Radius",
	type: "number",
	default: 2
};
var InputTime = {
	name: "time",
	label: "DGNS.Time",
	type: "number",
	default: 1
};
var InputDamage = {
	name: "damage",
	label: "DGNS.Damage",
	type: "number",
	default: 1
};
var InputTrigger = {
	name: "trigger",
	label: "DGNS.Trigger",
	type: "number",
	default: 1
};
var InputArmorRating = {
	name: "armorRating",
	label: "DGNS.ArmorRating",
	type: "number",
	default: 1
};
var InputRounds = {
	name: "rounds",
	label: "DGNS.Rounds",
	type: "number",
	default: 1
};
var InputPenalty = {
	name: "penalty",
	label: "DGNS.Penalty",
	type: "number",
	default: 1
};
var InputBonus = {
	name: "bonus",
	label: "DGNS.Bonus",
	type: "number",
	default: 1
};
var InputEnemyType = {
	name: "enemyType",
	label: "DGNS.EnemyType",
	type: "text",
	default: 1
};
var InputPotency = {
	name: "potency",
	label: "DGNS.Potency",
	type: "number",
	default: 1
};
var InputEffect = {
	name: "effect",
	label: "DGNS.Effect",
	type: "text",
	default: ""
};
var InputDuration = {
	name: "duration",
	label: "DGNS.Duration",
	type: "text",
	default: ""
};
var InputTarget = {
	name: "target",
	label: "DGNS.Target",
	type: "text",
	default: ""
};
var InputDesporeing = {
	name: "desporeing",
	label: "DGNS.Desporeing",
	type: "text",
	default: ""
};
var InputTargetGroup = {
	name: "targetGroup",
	label: "DGNS.TargetGroup",
	type: "text",
	default: ""
};
var InputArmor = {
	name: "armor",
	label: "DGNS.Armor",
	type: "number",
	default: 1
};
var InputCriticalDamage = {
	name: "criticalDamage",
	label: "DGNS.CriticalDamageRating",
	type: "number",
	default: 1
};
var InputBonusSuccesses = {
	name: "bonusSuccesses",
	label: "DGNS.BonusSuccesses",
	type: "number",
	default: 1
};
var InputRating = {
	name: "rating",
	label: "DGNS.Rating",
	type: "number",
	default: 1
};
//#endregion
//#region src/module/logic/quality.mjs
/**
* List of all qualities
*/
var QUALITY_DEFINITIONS = {
	areaDamage: {
		label: "DGNS.QUALITY.areaDamage.name",
		description: "DGNS.QUALITY.areaDamage.description",
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
			return [{
				label: "DGNS.QUALITY.armorPiercing.name",
				key: "system.flags.armorPiercing",
				value: true,
				mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE
			}];
		}
	},
	biometricallyEncoded: {
		label: "DGNS.QUALITY.biometricallyEncoded.name",
		description: "DGNS.QUALITY.biometricallyEncoded.description",
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
		label: "DGNS.QUALITY.blunt.name",
		description: "DGNS.QUALITY.blunt.description",
		category: "passive",
		itemTypes: ["weapon", "modification"],
		inputs: [],
		chatButtons: null,
		onItemUse: null,
		onPreRoll: null,
		onPostRoll: null,
		activeEffects: () => {
			return [{
				label: "DGNS.QUALITY.blunt.name",
				key: "system.flags.blunt",
				value: true,
				mode: CONST.ACTIVE_EFFECT_MODES.OVERRIDE
			}];
		}
	},
	camo: {
		label: "DGNS.QUALITY.camo.name",
		description: "DGNS.QUALITY.camo.description",
		category: "passive",
		itemTypes: [
			"weapon",
			"armor",
			"modification"
		],
		inputs: [InputDifficulty],
		chatButtons: null,
		onItemUse: null,
		onPreRoll: null,
		onPostRoll: null,
		activeEffects: null
	},
	cloud: {
		label: "DGNS.QUALITY.cloud.name",
		description: "DGNS.QUALITY.cloud.description",
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
		label: "DGNS.QUALITY.dazed.name",
		description: "DGNS.QUALITY.dazed.description",
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
			const baseDistance = (await new Roll(formula).evaluate()).total;
			return { distance: isSuccess ? Math.max(0, baseDistance - rollResult.triggers) : baseDistance };
		},
		activeEffects: null
	},
	doubleBarreled: {
		label: "DGNS.QUALITY.doubleBarreled.name",
		description: "DGNS.QUALITY.doubleBarreled.description",
		category: "passive",
		itemTypes: ["weapon", "modification"],
		inputs: []
	},
	entangled: {
		label: "DGNS.QUALITY.entangled.name",
		description: "DGNS.QUALITY.entangled.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: [InputPenalty]
	},
	explosive: {
		label: "DGNS.QUALITY.explosive.name",
		description: "DGNS.QUALITY.explosive.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: []
	},
	fatal: {
		label: "DGNS.QUALITY.fatal.name",
		description: "DGNS.QUALITY.fatal.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: []
	},
	fireHazardous: {
		label: "DGNS.QUALITY.fireHazardous.name",
		description: "DGNS.QUALITY.fireHazardous.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: []
	},
	fragile: {
		label: "DGNS.QUALITY.fragile.name",
		description: "DGNS.QUALITY.fragile.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: []
	},
	impact: {
		label: "DGNS.QUALITY.impact.name",
		description: "DGNS.QUALITY.impact.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: [InputTrigger]
	},
	jamming: {
		label: "DGNS.QUALITY.jamming.name",
		description: "DGNS.QUALITY.jamming.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: []
	},
	muzzleLoader: {
		label: "DGNS.QUALITY.muzzleLoader.name",
		description: "DGNS.QUALITY.muzzleLoader.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: []
	},
	outOfControl: {
		label: "DGNS.QUALITY.outOfControl.name",
		description: "DGNS.QUALITY.outOfControl.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: [InputDifficulty]
	},
	piercing: {
		label: "DGNS.QUALITY.piercing.name",
		description: "DGNS.QUALITY.piercing.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: [InputArmorRating]
	},
	salvoes: {
		label: "DGNS.QUALITY.salvoes.name",
		description: "DGNS.QUALITY.salvoes.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: [InputRounds]
	},
	scatter: {
		label: "DGNS.QUALITY.scatter.name",
		description: "DGNS.QUALITY.scatter.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: []
	},
	sensitive: {
		label: "DGNS.QUALITY.sensitive.name",
		description: "DGNS.QUALITY.sensitive.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: []
	},
	smoothRunning: {
		label: "DGNS.QUALITY.smoothRunning.name",
		description: "DGNS.QUALITY.smoothRunning.description",
		category: "passive",
		itemTypes: ["weapon", "modification"],
		inputs: [InputTrigger]
	},
	special: {
		label: "DGNS.QUALITY.special.name",
		description: "DGNS.QUALITY.special.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: []
	},
	specialDamage: {
		label: "DGNS.QUALITY.specialDamage.name",
		description: "DGNS.QUALITY.specialDamage.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: [InputEnemyType, InputDamage]
	},
	standard: {
		label: "DGNS.QUALITY.standard.name",
		description: "DGNS.QUALITY.standard.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: [InputBonus]
	},
	talisman: {
		label: "DGNS.QUALITY.talisman.name",
		description: "DGNS.QUALITY.talisman.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: [InputBonus]
	},
	terrifying: {
		label: "DGNS.QUALITY.terrifying.name",
		description: "DGNS.QUALITY.terrifying.description",
		category: "passive",
		itemTypes: [
			"weapon",
			"armor",
			"modification"
		],
		inputs: [InputDifficulty]
	},
	thunderStrike: {
		label: "DGNS.QUALITY.thunderStrike.name",
		description: "DGNS.QUALITY.thunderStrike.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: []
	},
	extendedReload: {
		label: "DGNS.QUALITY.extendedReload.name",
		description: "DGNS.QUALITY.extendedReload.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: [InputTime]
	},
	gruesome: {
		label: "DGNS.QUALITY.gruesome.name",
		description: "DGNS.QUALITY.gruesome.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: [InputRating]
	},
	stun: {
		label: "DGNS.QUALITY.stun.name",
		description: "DGNS.QUALITY.stun.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: [InputRating]
	},
	panic: {
		label: "DGNS.QUALITY.panic.name",
		description: "DGNS.QUALITY.panic.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: [InputRating]
	},
	singleLoader: {
		label: "DGNS.QUALITY.singleLoader.name",
		description: "DGNS.QUALITY.singleLoader.description",
		category: "passive",
		itemTypes: ["weapon"],
		inputs: [InputRounds]
	},
	poisoned: {
		label: "DGNS.QUALITY.poisoned.name",
		description: "DGNS.QUALITY.poisoned.description",
		category: "passive",
		itemTypes: ["agent"],
		inputs: [
			InputPotency,
			InputEffect,
			InputDuration
		]
	},
	attractant: {
		label: "DGNS.QUALITY.attractant.name",
		description: "DGNS.QUALITY.attractant.description",
		category: "passive",
		itemTypes: ["agent"],
		inputs: [InputTarget]
	},
	narcotic: {
		label: "DGNS.QUALITY.narcotic.name",
		description: "DGNS.QUALITY.narcotic.description",
		category: "passive",
		itemTypes: ["agent"],
		inputs: [InputPotency, InputDamage]
	},
	pseudoDesporeing: {
		label: "DGNS.QUALITY.pseudoDesporeing.name",
		description: "DGNS.QUALITY.pseudoDesporeing.description",
		category: "passive",
		itemTypes: ["agent"],
		inputs: [InputDesporeing, InputDuration]
	},
	respected: {
		label: "DGNS.QUALITY.respected.name",
		description: "DGNS.QUALITY.respected.description",
		category: "passive",
		itemTypes: ["armor"],
		inputs: [InputTargetGroup, InputBonus]
	},
	firstImpression: {
		label: "DGNS.QUALITY.firstImpression.name",
		description: "DGNS.QUALITY.firstImpression.description",
		category: "passive",
		itemTypes: ["armor"],
		inputs: [InputBonus]
	},
	fireResistant: {
		label: "DGNS.QUALITY.fireResistant.name",
		description: "DGNS.QUALITY.fireResistant.description",
		category: "passive",
		itemTypes: ["armor", "modification"],
		inputs: [InputArmor]
	},
	unstable: {
		label: "DGNS.QUALITY.unstable.name",
		description: "DGNS.QUALITY.unstable.description",
		category: "passive",
		itemTypes: ["armor"],
		inputs: [InputCriticalDamage]
	},
	insulated: {
		label: "DGNS.QUALITY.insulated.name",
		description: "DGNS.QUALITY.insulated.description",
		category: "passive",
		itemTypes: ["armor", "modification"],
		inputs: []
	},
	bulletproof: {
		label: "DGNS.QUALITY.bulletproof.name",
		description: "DGNS.QUALITY.bulletproof.description",
		category: "passive",
		itemTypes: ["armor", "modification"],
		inputs: [InputArmor]
	},
	massive: {
		label: "DGNS.QUALITY.massive.name",
		description: "DGNS.QUALITY.massive.description",
		category: "passive",
		itemTypes: ["armor", "modification"],
		inputs: [InputArmor]
	},
	brittle: {
		label: "DGNS.QUALITY.brittle.name",
		description: "DGNS.QUALITY.brittle.description",
		category: "passive",
		itemTypes: ["armor"],
		inputs: [InputCriticalDamage]
	},
	sealed: {
		label: "DGNS.QUALITY.sealed.name",
		description: "DGNS.QUALITY.sealed.description",
		category: "passive",
		itemTypes: ["armor", "modification"],
		inputs: [InputBonusSuccesses]
	}
};
var Qualities = {
	forItemType: (itemType) => {
		return Object.entries(QUALITY_DEFINITIONS).filter(([key, def]) => def.itemTypes.includes(itemType)).map(([key, def]) => ({
			key,
			...def
		}));
	},
	get weapon() {
		return Object.entries(QUALITY_DEFINITIONS).filter(([key, def]) => def.itemTypes.includes("weapon")).map(([key, def]) => ({
			key,
			...def
		})).sort((a, b) => a.key.localeCompare(b.key));
	},
	get armor() {
		return Object.entries(QUALITY_DEFINITIONS).filter(([key, def]) => def.itemTypes.includes("armor")).map(([key, def]) => ({
			key,
			...def
		})).sort((a, b) => a.key.localeCompare(b.key));
	},
	get agent() {
		return Object.entries(QUALITY_DEFINITIONS).filter(([key, def]) => def.itemTypes.includes("agent")).map(([key, def]) => ({
			key,
			...def
		})).sort((a, b) => a.key.localeCompare(b.key));
	},
	get modification() {
		return Object.entries(QUALITY_DEFINITIONS).filter(([key, def]) => def.itemTypes.includes("modification")).map(([key, def]) => ({
			key,
			...def
		})).sort((a, b) => a.key.localeCompare(b.key));
	},
	get all() {
		return Object.entries(QUALITY_DEFINITIONS).map(([key, def]) => ({
			key,
			...def
		})).sort((a, b) => a.key.localeCompare(b.key));
	}
};
//#endregion
//#region src/module/logic/condition.mjs
/** @import DegenesisActor from '../documents/actor.mjs'  */
var Condition = {
	calculateMaxTrauma: (actor) => {},
	calculateMaxFleshwounds: (actor) => {},
	calculateMaxEgo: (actor) => {},
	calculateMaxSpore: (actor) => {},
	calculateMovement: (actor) => {}
};
//#endregion
//#region src/module/logic/modification.mjs
var Modification = { type: {
	melee: "DGNS.MOD.melee",
	archaicProjectiles: "DGNS.MOD.archaicProjectiles",
	modernEnergyWeapons: "DGNS.MOD.modernEnergyWeapons",
	modernGuns: "DGNS.MOD.modernGuns",
	armor: "DGNS.MOD.armor"
} };
//#endregion
//#region src/module/config.mjs
var DEGENESIS = {};
DEGENESIS.Damage = Damage;
DEGENESIS.Condition = Condition;
DEGENESIS.Qualities = Qualities;
DEGENESIS.Modification = Modification;
DEGENESIS.alignments = { ambition: {
	label: "DGNS.Ambition",
	description: "DGNS.AmbitionDescription",
	affinity: [],
	aversion: [],
	constellation: []
} };
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
DEGENESIS.diceRolls = { initiative: "DGNS.Initiative" };
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
DEGENESIS.noType = [
	"movement",
	"armor",
	"damage",
	"p_defense"
];
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
	poisoned: [
		"potency",
		"effect",
		"duration"
	],
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
}, DEGENESIS.shieldQualityDescription = { special: "DGNS.SpecialDescription" }, DEGENESIS.attackQualityDescription = {
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
}, DEGENESIS.defenseQualityDescription = { special: "DGNS.SpecialDescription" }, DEGENESIS.damageTypes = {
	fleshwounds: "DGNS.Fleshwounds",
	ego: "DGNS.Ego",
	trauma: "DGNS.Trauma"
};
DEGENESIS.standardDamageModifiers = Damage.standardModifiers;
DEGENESIS.formHellDamageModifiers = Damage.fromHellModifiers;
DEGENESIS.damageModifiers = {
	F: {
		blueprint: "+F",
		calculate: (force, triggers) => force
	},
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
	T: {
		blueprint: "+T",
		calculate: (force, triggers) => triggers
	},
	D2: {
		blueprint: "+1D/2",
		calculate: (force, triggers) => Math.ceil(new Die({
			faces: 6,
			number: 1
		}).evaluate().total / 2)
	},
	D: {
		blueprint: "+1D",
		calculate: (force, triggers) => new Die({
			faces: 6,
			number: 1
		}).evaluate().total
	},
	"2D": {
		blueprint: "+2D",
		calculate: (force, triggers) => new Die({
			faces: 6,
			number: 2
		}).evaluate().total
	}
};
DEGENESIS.damageModifiersFromHell = {
	T: {
		blueprint: "+T",
		calculate: (triggers) => triggers
	},
	D2: {
		blueprint: "+1D/2",
		calculate: (triggers) => Math.ceil(new Die({
			faces: 6,
			number: 1
		}).evaluate().total / 2)
	},
	D: {
		blueprint: "+1D",
		calculate: (triggers) => new Die({
			faces: 6,
			number: 1
		}).evaluate().total
	},
	"2D": {
		blueprint: "+2D",
		calculate: (triggers) => new Die({
			faces: 6,
			number: 2
		}).evaluate().total
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
/**
* Calibers are used for validating weapons compatibilities with specific ammo item.
*/
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
//#endregion
//#region src/module/hooks/apps/sidebar.mjs
function sidebar_default() {
	Hooks.on("renderSidebar", async (app, html) => {
		console.log("hooks.js renderSidebar", {
			app,
			html
		});
		/** Disable forced theming for V12 compatibility layer */
		const content = html.querySelector("#sidebar-content");
		for (let section of content.childNodes) section.classList.remove("themed", "theme-light", "theme-dark");
	});
	Hooks.on("renderSettings", async (app, html) => {
		console.log("hooks.js renderSettings", {
			app,
			html
		});
		const theme = html.ownerDocument.body.classList.contains("theme-dark") ? "dark" : "light";
		const info = html.querySelector(".info");
		const badge = document.createElement("section");
		badge.classList.add("dgns", "flexcol");
		badge.innerHTML = `<img src="systems/degenesisnext/ui/logotypes/degenesis-logo-${theme}.svg" data-tooltip="${game.system.title}" alt="${game.system.title}"> `;
		if (info) info.insertAdjacentElement("beforeBegin", badge);
	});
	Hooks.on("renderChatLog", async (app, html) => {
		console.log("hooks.js renderChat", {
			app,
			html
		});
	});
}
//#endregion
//#region src/module/hooks/apps/menu.mjs
function menu_default() {
	Hooks.on("renderMainMenu", async (app, html) => {
		console.log(`Hooks.js renderMainMenu`, {
			app,
			html
		});
		html.classList.remove("themed", "theme-dark", "theme-light");
	});
}
//#endregion
//#region src/module/hooks/apps/pause.mjs
function pause_default() {
	Hooks.on("renderGamePause", async (app, html, settings) => {
		console.log(app);
		settings.icon = "systems/degenesisnext/ui/marauders.svg";
	});
}
//#endregion
//#region src/module/hooks/item.mjs
/** import Hooks from @common/as */
function RegisterItemHooks() {
	/** Sync changes to actors  */
	Hooks.on("updateItem", async (item, changed, options, userId) => {
		if (item.system.isSyncable) {
			for (const actor of game.actors) if (actor.system[item.type]?.id === item.id) {
				actor.prepareData();
				actor.render(false);
			}
		}
	});
}
//#endregion
//#region src/module/hooks/actor.mjs
function RegisterActorHooks() {
	Hooks.on("preUpdateActor", (actor, changes, options, userId) => {
		console.log("Actor update triggered:", changes);
	});
}
//#endregion
//#region src/module/hooks/handlebars.mjs
function RegisterHandlebars() {
	Hooks.on("init", () => {
		Handlebars.registerHelper("eq", (a, b) => a == b);
	});
}
//#endregion
//#region src/module/hooks/apps/chat.message.mjs
function chat_message_default() {
	Hooks.on("renderChatMessageHTML ", async (message, html, context) => {
		console.log(`RenderChatMessage Fired`);
		console.log(message);
		if (!message.rolls || message.rolls.length === 0) return;
		message.rolls.forEach((roll) => {
			roll.dice.forEach((die) => {
				die.results.forEach((r) => {
					if (!r.img) r.img = `systems/degenesisnext/ui/dice-faces/d${r.result}.svg`;
				});
			});
		});
		html.addClass("degenesis-roll");
	});
}
//#endregion
//#region src/module/hooks/_module.mjs
function _module_default() {
	menu_default();
	pause_default();
	sidebar_default();
	RegisterHandlebars();
	chat_message_default();
	RegisterItemHooks();
	RegisterActorHooks();
}
//#endregion
//#region src/module/applications/actor/actor.sheet.mixin.mjs
/** @import HandlebarsApplicationMixin from '@client/applications/api/handlebars-application.mjs*/
var { api: api$10, sheets: sheets$10 } = foundry.applications;
var { DragDrop, TextEditor: TextEditor$9 } = foundry.applications.ux;
var getSheetPrefs = (doc) => {
	const key = `${doc.type}${doc.limited ? ":limited" : ""}`;
	return game.user.getFlag("degenesisnext", `actorSheetPrefs.${key}`) ?? {};
};
/** Class extending HandlebarsApplicationMixin */
function ActorSheetMixin(Base) {
	return class DegenesisActorSheet extends api$10.HandlebarsApplicationMixin(Base) {
		static TABS = [];
		static MODES = {
			PLAY: 1,
			EDIT: 2
		};
		static DEFAULT_OPTIONS = { dragDrop: [{
			dragSelector: "[data-drag]",
			dropSelector: null
		}] };
		_mode = this.constructor.MODES.PLAY;
		_dropdownState = {};
		constructor(object, options = {}) {
			const { width, height } = getSheetPrefs(object);
			options.width ??= width;
			options.height ??= height;
			super(object, options);
			this.#dragDrop = this.#createDragDropHandlers();
		}
		#dragDrop;
		/**
		* Returns an array of DragDrop instances
		* @type {DragDrop[]}
		*/
		get dragDrop() {
			return this.#dragDrop;
		}
		/**
		* Create drag-and-drop workflow handlers for this Application
		* @returns {DragDrop[]}     An array of DragDrop handlers
		* @private
		*/
		#createDragDropHandlers() {
			return this.options.dragDrop.map((d) => {
				d.permissions = {
					dragstart: this._canDragStart.bind(this),
					drop: this._canDragDrop.bind(this)
				};
				d.callbacks = {
					dragstart: this._onDragStart.bind(this),
					dragover: this._onDragOver.bind(this),
					drop: this._onDrop.bind(this)
				};
				return new DragDrop(d);
			});
		}
		/**
		* Returns an array of DragDrop instances
		* @type {DragDrop[]}
		*/
		/**
		* Define whether a user is able to begin a dragstart workflow for a given drag selector
		* @param {string} selector       The candidate HTML selector for dragging
		* @returns {boolean}             Can the current user drag this selector?
		* @protected
		*/
		_canDragStart(selector) {
			console.log(`canDragStart`);
			return this.isEditable;
		}
		/**
		* Define whether a user is able to conclude a drag-and-drop workflow for a given drop selector
		* @param {string} selector       The candidate HTML selector for the drop target
		* @returns {boolean}             Can the current user drop on this selector?
		* @protected
		*/
		_canDragDrop(selector) {
			console.log(`canDragDrop`);
			return this.isEditable;
		}
		/**
		* Callback actions which occur at the beginning of a drag start workflow.
		* @param {DragEvent} event       The originating DragEvent
		* @protected
		*/
		_onDragStart(event) {
			const el = event.currentTarget;
			console.log(`Element`);
			console.log(el);
			if ("link" in event.target.dataset) return;
			const itemId = el.dataset.itemId;
			const item = this.actor.items.get(itemId);
			if (!item) return;
			const dragData = item.toDragData();
			event.dataTransfer.setData("text/plain", JSON.stringify(dragData));
		}
		/**
		* Callback actions which occur when a dragged element is over a drop target.
		* @param {DragEvent} event       The originating DragEvent
		* @protected
		*/
		_onDragOver(event) {}
		/**
		* Callback actions which occur when a dragged element is dropped on a target.
		* It will call different method based on data type beeing dragged onto sheet.
		* @param {DragEvent} event       The originating DragEvent
		* @protected
		*/
		async _onDrop(event) {
			event.preventDefault();
			const data = TextEditor$9.getDragEventData(event);
			console.log(`onDropData`);
			console.log(data);
			if (!data.type) return super._onDrop(event);
			const handlerName = `_onDrop${data.type}`;
			if (typeof this[handlerName] === "function") return this[handlerName](event, data);
			return super._onDrop(event);
		}
		/** @inheritdoc */
		async close(options) {
			options = { animate: false };
			await super.close(options);
		}
		/** @inheritdoc */
		async _render(force, { mode, ...options } = {}) {
			return super._render(force, {mode, ...options} = {});
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
				toggle.setAttribute("aria-label", game.i18n.localize("DGNS.SheetModeEdit"));
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
		async _prepareContext(options) {
			const context = await super._prepareContext(options);
			if (!this._dropdownState) this._dropdownState = {};
			context.editable = this.isEditable && this._mode === this.constructor.MODES.EDIT;
			context.cssClass = context.editable ? "editable" : this.isEditable ? "interactable" : "locked";
			return context;
		}
		activateListeners(html) {
			html.querySelectorAll(".section-dropdown").forEach((sectionEl) => {
				const sectionId = sectionEl.dataset.section;
				const body = sectionEl.querySelector(".section-body");
				const toggleBtn = sectionEl.querySelector(".dropdown-toggle");
				if (!(sectionId in this._dropdownState)) this._dropdownState[sectionId] = sectionEl.dataset.collapsed === "true" ? true : false;
				if (this._dropdownState[sectionId]) body.classList.add("collapsed");
				toggleBtn?.addEventListener("click", (event) => {
					const isCollapsed = body.classList.contains("collapsed");
					body.classList.toggle("collapsed");
					this._dropdownState[sectionId] = !isCollapsed;
				});
			});
			this.#dragDrop.forEach((d) => d.bind(this.element));
		}
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
		async _onChangeSheetMode(event) {
			const { MODES } = this.constructor;
			const toggle = event.currentTarget;
			const label = game.i18n.localize(`DGNS.SheetMode${toggle.checked ? "Play" : "Edit"}`);
			toggle.dataset.tooltip = label;
			toggle.setAttribute("aria-label", label);
			this._mode = toggle.checked ? MODES.EDIT : MODES.PLAY;
			this.render();
		}
		_disableFields(form) {
			super._disableFields(form);
		}
		/** Events handling */
		/** Dropdown sections handling  */
		_onDropdownToggle(event) {
			try {
				let target = event.currentTarget;
				target.dataset.dropdown;
				console.log(target.attributes);
			} catch (err) {
				console.log(err);
			}
		}
	};
}
//#endregion
//#region src/module/applications/actor/character.sheet.mjs
/** @import ActorSheetV2 from '@client/applications/sheets/actor-sheet.mjs*/
/**
* Extend the basic ActorSheet class to suppose system-specific logic and functionality.
* @abstract
*/
var { renderTemplate: renderTemplate$2 } = foundry.applications.handlebars;
var { api: api$9, sheets: sheets$9 } = foundry.applications;
var { DialogV2: DialogV2$1 } = foundry.applications.api;
var { TextEditor: TextEditor$8 } = foundry.applications.ux;
var { performIntegerSort } = foundry.utils;
var DGNSCharacterSheet = class DGNSCharacterSheet extends ActorSheetMixin(sheets$9.ActorSheetV2) {
	static DEFAULT_OPTIONS = {
		actions: {
			showLinkedItem: DGNSCharacterSheet.prototype.showLinkedItem,
			removeLinkedItem: DGNSCharacterSheet.prototype.removeLinkedItem,
			toggleEquipped: DGNSCharacterSheet.prototype.toggleItemProp("system.equipped"),
			toggleDropped: DGNSCharacterSheet.prototype.toggleItemProp("system.dropped"),
			toggleDescription: DGNSCharacterSheet.prototype.toggleDescription,
			createItem: DGNSCharacterSheet.prototype.createItem,
			editItem: DGNSCharacterSheet.prototype.onEditItem,
			toggleSort: DGNSCharacterSheet.prototype.toggleSort,
			unsetGroup: DGNSCharacterSheet.prototype.unsetGroup,
			rollAction: DGNSCharacterSheet.prototype.onActionRoll,
			rollCombination: DGNSCharacterSheet.prototype.onCombinationRoll,
			manageEffect: DGNSCharacterSheet.prototype.onManageEffect
		},
		form: { submitOnChange: true },
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
		sheetHeader: { template: "systems/degenesisnext/templates/shared/sheet/title.hbs" },
		actorHeader: {
			template: "systems/degenesisnext/templates/actor/character/header.hbs",
			templates: [
				"systems/degenesisnext/templates/actor/character/details.hbs",
				"systems/degenesisnext/templates/actor/character/modes.hbs",
				"systems/degenesisnext/templates/actor/character/currency.hbs",
				"systems/degenesisnext/templates/actor/character/xp.hbs"
			]
		},
		tabs: {
			template: "systems/degenesisnext/templates/actor/character/tabs.hbs",
			scrollable: [""]
		},
		general: {
			template: "systems/degenesisnext/templates/actor/character/general.hbs",
			scrollable: [""]
		},
		stats: {
			template: "systems/degenesisnext/templates/actor/character/stats.hbs",
			scrollable: [""]
		},
		effects: {
			template: "systems/degenesisnext/templates/shared/general/effects.hbs",
			scrollable: [".container-scrollable"]
		},
		combat: {
			template: "systems/degenesisnext/templates/actor/character/combat.hbs",
			scrollable: [""]
		},
		inventory: {
			template: "systems/degenesisnext/templates/actor/character/inventory.hbs",
			scrollable: [""]
		},
		history: {
			template: "systems/degenesisnext/templates/actor/character/history.hbs",
			templates: [
				"systems/degenesisnext/templates/actor/character/legacies.hbs",
				"systems/degenesisnext/templates/actor/character/biography.hbs",
				"systems/degenesisnext/templates/actor/character/group.hbs",
				"systems/degenesisnext/templates/actor/character/notes.hbs",
				"systems/degenesisnext/templates/actor/character/gmnotes.hbs"
			],
			scrollable: [".container-scrollable"]
		},
		sheetFooter: { template: "systems/degenesisnext/templates/shared/sheet/footer.hbs" }
	};
	/** @type {Record<string, foundry.applications.types.ApplicationTabsConfiguration>} */
	static TABS = {
		main: {
			initial: "general",
			tabs: [
				{
					id: "general",
					label: "UI.TABS.general"
				},
				{
					id: "stats",
					label: "UI.TABS.stats"
				},
				{
					id: "effects",
					label: "UI.TABS.effects"
				},
				{
					id: "combat",
					label: "UI.TABS.combat"
				},
				{
					id: "inventory",
					label: "UI.TABS.inventory"
				},
				{
					id: "history",
					label: "UI.TABS.history"
				}
			]
		},
		header: {
			initial: "details",
			tabs: [
				{
					id: "details",
					label: "UI.TABS.details",
					icon: "fa-solid fa-circle-info"
				},
				{
					id: "modes",
					label: "UI.TABS.modes",
					icon: "fa-solid fa-brain"
				},
				{
					id: "currency",
					label: "UI.TABS.currency",
					icon: "fa-solid fa-coins"
				},
				{
					id: "xp",
					label: "UI.TABS.xp",
					icon: "fa-solid fa-timeline"
				}
			]
		},
		history: {
			initial: "group",
			tabs: [
				{
					id: "biography",
					label: "UI.TABS.biography"
				},
				{
					id: "legacies",
					label: "UI.TABS.legacies"
				},
				{
					id: "group",
					label: "UI.TABS.group"
				},
				{
					id: "notes",
					label: "UI.TABS.notes"
				},
				{
					id: "gmnotes",
					label: "UI.TABS.gmnotes"
				}
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
			isEditMode: this._mode === 2,
			isEditable: this.isEditable,
			actor: this.actor,
			system: this.actor.system,
			flags: this.actor.flags,
			sortMode: this.actor.getFlag("degenesisnext", "inventorySortMode") || "manual",
			actorFields: this.actor.schema.fields,
			culture: this.actor.system.culture,
			concept: this.actor.system.concept,
			cult: this.actor.system.cult,
			group: this.actor.system.group,
			potentials: this.actor._preparePotentials(),
			legacies: this.actor._prepareLegacies(),
			inventory: this.actor._prepareInventory(),
			effects: await this.actor._prepareEffects(),
			tabGroups: this.tabGroups,
			mainTabs: this._prepareTabs("main"),
			headerTabs: this._prepareTabs("header"),
			historyTabs: this._prepareTabs("history"),
			enriched: {
				biography: await TextEditor$8.enrichHTML(this.document.system.biography, { secrets: this.document.isOwner }),
				ownerNotes: await TextEditor$8.enrichHTML(this.document.system.ownerNotes, { secrets: this.document.isOwner }),
				gmNotes: await TextEditor$8.enrichHTML(this.document.system.gmNotes, { secrets: this.document.isOwner })
			}
		});
		console.log(`context: `);
		console.dir(context);
		return context;
	}
	async _preparePartContext(partId, context, options) {
		if (context.mainTabs?.[partId]) {
			context.tab = context.mainTabs[partId];
			if (partId === "history") context.subtabs = context.historyTabs;
		}
		return context;
	}
	/**
	* Creating initial context menus for permanent objects
	*/
	createContextMenus() {
		function _actionRollContextOptions() {
			return [{
				name: "Action roll",
				callback: async (target) => {
					await this.onActionRoll(null, target);
				}
			}, {
				name: "Combination roll",
				callback: async (target) => {
					await this.onCombinationRoll(null, target);
				}
			}];
		}
		function _itemContextOptions() {
			return [{
				name: "Edit",
				icon: "<i class=\"fas fa-edit\"></i>",
				callback: async (target) => {
					await this.onEditItem(null, target);
				}
			}, {
				name: "Delete",
				icon: "<i class=\"fas fa-trash\"></i>",
				callback: async (target) => {
					await this.onDeleteItem(null, target);
				}
			}];
		}
		this._createContextMenu(_actionRollContextOptions.bind(this), `[data-action=rollAction]`, {
			hookName: "getActionRollContextOptions",
			fixed: true,
			parentClassHooks: false
		});
		this._createContextMenu(_itemContextOptions.bind(this), `[data-action=openItemMenu]`, {
			eventName: "click",
			hookName: "getItemContextOptions",
			fixed: true,
			parentClassHooks: false
		});
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
		return await super._renderFrame(options);
	}
	_onResize(event) {
		super._onResize(event);
	}
	async _onDropActor(data) {
		const actor = await Actor.implementation.fromDropData(data);
		if (actor.type === "group") await this.actor.setGroup(actor);
	}
	async _onDropItem(event, data) {
		const item = await Item.implementation.fromDropData(data);
		if (!item) return false;
		const targetId = event.target.closest(".entry")?.dataset.itemId;
		const targetItem = targetId ? this.actor.items.get(targetId) : null;
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
		const isSameActor = item.actor?.id === this.actor.id;
		const isFromSidebar = !item.actor;
		item.actor && (item.actor.id, this.actor.id);
		if (isSameActor) {
			if (targetItem) {
				if (item.id === targetItem.id) return false;
				const sortMode = (this.actor.getFlag("degenesisnext", "inventorySortModes") || {})[targetItem.type] || "manual";
				console.log(sortMode);
				if (sortMode === "manual") return this._handleSort(item, targetItem);
				else {
					ui.notifications.warn("Disable alphabetical sorting first. ");
					return false;
				}
			}
		}
		if (isFromSidebar) return super._onDropItem(event, item);
	}
	async _handleSort(source, target) {
		const updates = performIntegerSort(source, {
			target,
			siblings: this.actor.items.filter((i) => i.type === target.type && i.id !== source.id)
		}).map((u) => ({
			_id: u.target.id,
			sort: u.update.sort
		}));
		return this.actor.updateEmbeddedDocuments("Item", updates);
	}
	/**
	* Manage effect on Actor's side.
	* @param {*} event
	* @param {*} target
	* @returns
	*/
	async onManageEffect(event, target) {
		if (event) event.preventDefault();
		const action = target.dataset.type;
		const effectId = target.closest(".effect")?.dataset.effectId;
		return await this.actor._manageEffect(action, effectId);
	}
	async onCombinationRoll(event, target) {
		if (event) event.preventDefault();
		const skill = target.dataset.skill;
		const attribute = target.dataset.attribute;
		await this.actor.combinationRoll(attribute, skill);
	}
	async onActionRoll(event, target) {
		if (event) event.preventDefault();
		const skill = target.dataset.skill;
		const attribute = target.dataset.attribute;
		await this.actor.actionRoll(attribute, skill);
	}
	async createItem(event, target) {
		const itemType = target.closest("[data-item-type")?.dataset.itemType;
		await this.actor._createItem(itemType);
	}
	/**
	* Display linked Item, and fallback to cached one if main do not exist anymore.
	* Mainly used with Culture / Concept / Cult
	* @param {*} event
	* @param {*} target
	*/
	async showLinkedItem(event, target) {
		const itemType = target.dataset.itemType;
		const itemId = this.actor.system[itemType].id;
		const item = itemId === this.actor.system[`${itemType}Item`].linked.id ? game.items.get(itemId) : this.actor.items.get(itemId);
		if (item) item.sheet.render(true);
	}
	async onCreateItem() {}
	async onEditItem(event, target) {
		const itemId = target.closest("[data-item-id]")?.dataset.itemId;
		const item = this.actor.items.get(itemId);
		if (item) item.sheet.render(true);
	}
	async onDeleteItem(event, target) {
		const itemId = target.closest("[data-item-id]")?.dataset.itemId;
		const item = this.actor.items.get(itemId);
		if (item) item.delete();
	}
	async removeLinkedItem(event, target) {
		const itemType = target.dataset.itemType;
		await this.actor.system.removeLinkedItem(itemType);
	}
	async unsetGroup() {
		await this.actor.unsetGroup();
	}
	async toggleSort(event, target) {
		const group = target.dataset.group;
		const newMode = (this.actor.getFlag("degenesisnext", `inventorySortModes.${group}`) || "manual") === "manual" ? "alpha" : "manual";
		await this.actor.setFlag("degenesisnext", `inventorySortModes.${group}`, newMode);
	}
	toggleItemProp(propPath) {
		return async function(event, target) {
			const itemId = target.closest("[data-item-id]").dataset.itemId;
			const item = this.document.items.get(itemId);
			console.log(`Toggle item prop`);
			console.log(item);
			console.log(propPath);
			const currentValue = foundry.utils.getProperty(item, propPath);
			console.log(currentValue);
			await item.update({ [propPath]: !currentValue });
		};
	}
	async toggleDescription(event, target) {
		const entry = target.closest(".entry.item");
		const itemId = entry.dataset.itemId;
		const item = this.document.items.get(itemId);
		let existingDesc = entry.nextElementSibling;
		if (existingDesc?.classList.contains("entry-description-dropdown")) {
			existingDesc.remove();
			return;
		}
		const html = await renderTemplate$2("systems/degenesisnext/templates/shared/item/dropdown.hbs", {
			description: await TextEditor$8.enrichHTML(item.system.description, { async: true }),
			item
		});
		entry.insertAdjacentHTML("afterend", `<div class="entry entry-description-dropdown" data-item-id="${itemId}">${html}</div>`);
	}
};
//#endregion
//#region src/module/applications/actor/group.sheet.mjs
/**
* Extend the basic ActorSheet class to suppose system-specific logic and functionality.
* @abstract
*/
var { api: api$8, sheets: sheets$8 } = foundry.applications;
var { DialogV2 } = foundry.applications.api;
var { TextEditor: TextEditor$7 } = foundry.applications.ux;
var DGNSGroupSheet = class extends ActorSheetMixin(sheets$8.ActorSheetV2) {
	static DEFAULT_OPTIONS = {
		actions: {},
		form: { submitOnChange: true },
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
		sheetHeader: { template: "systems/degenesisnext/templates/shared/sheet/title.hbs" },
		groupHeader: { template: "systems/degenesisnext/templates/actor/group/header.hbs" },
		sheetFooter: { template: "systems/degenesisnext/templates/shared/sheet/footer.hbs" }
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
	getTabs() {
		return [];
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
		return await super._renderFrame(options);
	}
	_onResize(event) {
		super._onResize(event);
	}
	async _onDrop(event) {
		event.preventDefault();
		return super._onDrop(event);
	}
};
//#endregion
//#region src/module/applications/actor/_module.mjs
var _module_exports$4 = /* @__PURE__ */ __exportAll({
	ActorSheetMixin: () => ActorSheetMixin,
	DGNSCharacterSheet: () => DGNSCharacterSheet,
	DGNSGroupSheet: () => DGNSGroupSheet
});
//#endregion
//#region src/module/applications/item/mixins/item.sheet.mixin.mjs
var { api: api$7, sheets: sheets$7 } = foundry.applications;
function ItemSheetMixin(Base) {
	return class DGNSItemSheet extends api$7.HandlebarsApplicationMixin(Base) {
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
			return super._render(force, {mode, ...options} = {});
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
				toggle.setAttribute("aria-label", game.i18n.localize("DGNS.SheetModeEdit"));
				toggle.addEventListener("change", this._onChangeSheetMode.bind(this));
				toggle.addEventListener("dblclick", (event) => event.stopPropagation());
				header.insertAdjacentElement("afterbegin", toggle);
			}
			return html;
		}
		async _prepareContext(options) {
			const context = await super._prepareContext(options);
			if (!this._dropdownState) this._dropdownState = {};
			context.editable = this.isEditable && this._mode === this.constructor.MODES.EDIT;
			context.cssClass = context.editable ? "editable" : this.isEditable ? "interactable" : "locked";
			return context;
		}
		activateListeners(html) {
			html.querySelectorAll(".section-dropdown").forEach((sectionEl) => {
				const sectionId = sectionEl.dataset.section;
				const body = sectionEl.querySelector(".section-body");
				const toggleBtn = sectionEl.querySelector(".dropdown-toggle");
				if (!(sectionId in this._dropdownState)) this._dropdownState[sectionId] = sectionEl.dataset.collapsed === "true" ? true : false;
				if (this._dropdownState[sectionId]) body.classList.add("collapsed");
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
			const label = game.i18n.localize(`DGNS.SheetMode${toggle.checked ? "Play" : "Edit"}`);
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
				target.dataset.dropdown;
				console.log(target.attributes);
			} catch (err) {
				console.log(err);
			}
		}
	};
}
//#endregion
//#region src/module/applications/item/mixins/background.sheet.mixin.mjs
/**
* Mixin obsługujący dynamiczne tło arkusza dla systemu Degenesis.
* @param {Function} Base - Klasa bazowa (np. ItemSheetV2)
*/
function BackgroundSheetMixin(Base) {
	return class extends Base {
		static DEFAULT_OPTIONS = {
			actions: {
				changeSheetBackground: this._onChangeSheetBackground,
				clearSheetBackground: this._onClearSheetBackground
			},
			window: { controls: [{
				action: "changeSheetBackground",
				icon: "fa-solid fa-user-circle",
				label: "SHEET.ChangeBackground",
				ownership: "OWNER"
			}, {
				action: "clearSheetBackground",
				icon: "fa-solid fa-user-circle",
				label: "SHEET.ClearBackground",
				ownership: "OWNER"
			}] }
		};
		static async _onChangeSheetBackground(event, target) {
			const document = this.document;
			return new FilePicker({
				type: "image",
				current: document.system.backgroundImage || "",
				callback: async (path) => {
					if (path) try {
						await document.update({ "system.backgroundImage": path });
						ui.notifications.info(game.i18n.format("DGNS.Notifications.BackgroundUpdated", { path }));
					} catch (error) {
						console.error("Degenesis | Background Update Error:", error);
						ui.notifications.error("Failed to update background image.");
					}
				}
			}).browse();
		}
		static async _onClearSheetBackground(event, target) {
			try {
				await this.document.update({ "system.backgroundImage": null });
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
//#endregion
//#region src/module/applications/item/weapon.sheet.mjs
var { api: api$6, sheets: sheets$6 } = foundry.applications;
var { TextEditor: TextEditor$6 } = foundry.applications.ux;
var { FilePicker: FilePicker$4 } = foundry.applications.apps;
var DegenesisWeaponSheet = class extends ItemSheetMixin(sheets$6.ItemSheetV2) {
	static DEFAULT_OPTIONS = {
		actions: { manageQuality: this.#onManageQuality },
		form: { submitOnChange: true },
		window: {
			controls: [],
			resizable: true,
			frame: true
		},
		position: {
			width: 600,
			height: 600
		},
		classes: [
			"dgns-weapon",
			"dgns-item",
			"sheet-customizable"
		]
	};
	static PARTS = {
		sheetTitle: { template: "systems/degenesisnext/templates/shared/sheet/title.bar.hbs" },
		itemHeader: { template: "systems/degenesisnext/templates/shared/item/header.hbs" },
		tabs: {
			template: "systems/degenesisnext/templates/shared/item/tabs.hbs",
			scrollable: [""]
		},
		description: {
			template: "systems/degenesisnext/templates/shared/item/tab.description.hbs",
			scrollable: [""]
		},
		details: {
			template: "systems/degenesisnext/templates/item/weapon/details.hbs",
			scrollable: [""]
		},
		qualities: {
			template: "systems/degenesisnext/templates/item/weapon/qualities.hbs",
			scrollable: [""]
		},
		modifications: {
			template: "systems/degenesisnext/templates/item/weapon/modifications.hbs",
			scrollable: [""]
		},
		effects: {
			template: "systems/degenesisnext/templates/shared/item/tab.effects.hbs",
			scrollable: [""]
		},
		sheetFooter: { template: "systems/degenesisnext/templates/shared/sheet/footer.hbs" }
	};
	static TABS = { main: {
		initial: "description",
		tabs: [
			{
				id: "description",
				label: "DGNS.Description"
			},
			{
				id: "details",
				label: "DGNS.Details"
			},
			{
				id: "effects",
				label: "DGNS.Effects"
			},
			{
				id: "qualities",
				label: "DGNS.Qualities"
			},
			{
				id: "modifications",
				label: "DGNS.Mods"
			}
		]
	} };
	async _prepareContext(options) {
		const context = await super._prepareContext(options);
		const availableQualities = Qualities.weapon;
		Object.assign(context, {
			mode: this._mode,
			document: this.document,
			system: this.document.system,
			fields: this.document.schema.fields,
			systemFields: this.document.system.schema.fields,
			isEditable: this.isEditable,
			qualities: availableQualities.map((def) => {
				const data = this.document.system.qualities.find((q) => q.key === def.key);
				return {
					key: def.key,
					label: def.label,
					description: def.description,
					enabled: data ? data.enabled : false,
					inputs: (def.inputs || []).map((input) => ({
						...input,
						value: data?.values?.[input.name] ?? input.default
					}))
				};
			}),
			effects: await this.item._prepareEffects(),
			modifications: this.document.system.modifications,
			tabGroups: this.tabGroups,
			mainTabs: this._prepareTabs("main"),
			enriched: { description: await TextEditor$6.enrichHTML(this.document.system.description) }
		});
		console.log(`WeaponSheet | Context`);
		console.log(context);
		console.log(`WeaponSheet | Qualities`);
		console.log(context.system.qualities);
		return context;
	}
	async _preparePartContext(partId, context, options) {
		if (context.mainTabs?.[partId]) context.tab = context.mainTabs[partId];
		return context;
	}
	/**
	* Format window title.
	*/
	get title() {
		return `${this.document.name}`;
	}
	activateListeners(html) {
		super.activateListeners(this.element);
		html.querySelectorAll(".quality-input").forEach((input) => {
			input.addEventListener("change", (event) => {
				this._onManageQuality(event, event.currentTarget);
			});
		});
	}
	/** Static wrapper for logic. */
	static async #onManageQuality(event, target) {
		await this._onManageQuality(event, target);
	}
	async _onManageQuality(event, target) {
		if (event) event.preventDefault();
		let { field = null, value = null } = {};
		const action = target.dataset.type;
		const qualityKey = target.closest(".quality")?.dataset.qualityKey;
		if (action === "update") {
			field = target.dataset.field;
			value = target.value;
		}
		return await this.document._manageQualities(action, qualityKey, field, value);
	}
};
//#endregion
//#region src/module/applications/item/modification.sheet.mjs
var { api: api$5, sheets: sheets$5 } = foundry.applications;
var { TextEditor: TextEditor$5 } = foundry.applications.ux;
var DegenesisModificationSheet = class extends ItemSheetMixin(sheets$5.ItemSheetV2) {
	static DEFAULT_OPTIONS = {
		actions: {},
		form: { submitOnChange: true },
		window: {
			controls: [],
			resizable: true,
			frame: true
		},
		position: {
			width: 600,
			height: 600
		},
		classes: ["dgns-modification", "dgns-item"]
	};
	static PARTS = {
		sheetTitle: { template: "systems/degenesisnext/templates/shared/sheet/title.bar.hbs" },
		header: { template: "systems/degenesisnext/templates/item/modification/header.hbs" },
		tabs: {
			template: "systems/degenesisnext/templates/shared/item/tabs.hbs",
			scrollable: [""]
		},
		description: {
			template: "systems/degenesisnext/templates/shared/item/tab.description.hbs",
			scrollable: [""]
		},
		effects: {
			template: "systems/degenesisnext/templates/shared/item/tab.effects.hbs",
			scrollable: [""]
		},
		qualities: {
			template: "systems/degenesisnext/templates/item/modification/qualities.hbs",
			scrollable: [""]
		},
		sheetFooter: { template: "systems/degenesisnext/templates/shared/sheet/footer.hbs" }
	};
	static TABS = { main: {
		initial: "description",
		tabs: [
			{
				id: "description",
				label: "DGNS.Description"
			},
			{
				id: "effects",
				label: "DGNS.Effects"
			},
			{
				id: "qualities",
				label: "DGNS.Qualities"
			}
		]
	} };
	async _prepareContext(options) {
		const context = await super._prepareContext(options);
		const availableQualities = Qualities.modification;
		Object.assign(context, {
			mode: this._mode,
			document: this.document,
			system: this.document.system,
			fields: this.document.schema.fields,
			systemFields: this.document.system.schema.fields,
			isEditable: this.isEditable,
			qualities: availableQualities.map((def) => {
				const data = this.document.system.qualities.find((q) => q.key === def.key);
				return {
					key: def.key,
					label: def.label,
					description: def.description,
					enabled: data ? data.enabled : false,
					inputs: (def.inputs || []).map((input) => ({
						...input,
						value: data?.values?.[input.name] ?? input.default
					}))
				};
			}),
			effects: await this.item._prepareEffects(),
			tabGroups: this.tabGroups,
			mainTabs: this._prepareTabs("main"),
			enriched: { description: await TextEditor$5.enrichHTML(this.document.system.description) }
		});
		console.log(`Modification Sheet | Context`);
		console.log(context);
		console.log(`Modification Sheet | Qualities`);
		console.log(context.system.qualities);
		return context;
	}
	async _preparePartContext(partId, context, options) {
		if (context.mainTabs?.[partId]) context.tab = context.mainTabs[partId];
		return context;
	}
	/**
	* Format window title.
	*/
	get title() {
		return `${this.document.name}`;
	}
};
//#endregion
//#region src/module/applications/item/potential.sheet.mjs
var { api: api$4, sheets: sheets$4 } = foundry.applications;
var { TextEditor: TextEditor$4 } = foundry.applications.ux;
var DegenesisPotentialSheet = class extends ItemSheetMixin(sheets$4.ItemSheetV2) {
	static DEFAULT_OPTIONS = {
		actions: {},
		form: { submitOnChange: true },
		window: {
			controls: [],
			resizable: true,
			frame: true
		},
		position: {
			width: 600,
			height: 600
		},
		classes: ["dgns-legacy", "dgns-item"]
	};
	static PARTS = {
		sheetTitle: { template: "systems/degenesisnext/templates/shared/sheet/title.hbs" },
		sheetFooter: { template: "systems/degenesisnext/templates/shared/sheet/footer.hbs" }
	};
	static TABS = { main: {
		initial: "description",
		tabs: [
			{
				id: "description",
				label: "DGNS.Description"
			},
			{
				id: "effects",
				label: "DGNS.Effects"
			},
			{
				id: "qualities",
				label: "DGNS.Qualities"
			}
		]
	} };
	async _prepareContext(options) {
		const context = await super._prepareContext(options);
		Object.assign(context, {
			mode: this._mode,
			document: this.document,
			system: this.document.system,
			fields: this.document.schema.fields,
			systemFields: this.document.system.schema.fields,
			isEditable: this.isEditable,
			effects: await this.item._prepareEffects(),
			tabGroups: this.tabGroups,
			mainTabs: this._prepareTabs("main"),
			enriched: { description: await TextEditor$4.enrichHTML(this.document.system.description) }
		});
		return context;
	}
	async _preparePartContext(partId, context, options) {
		if (context.mainTabs?.[partId]) context.tab = context.mainTabs[partId];
		return context;
	}
	/**
	* Format window title.
	*/
	get title() {
		return `${game.i18n.localize(this.document.type)}: ${this.document.name}`;
	}
};
//#endregion
//#region src/module/applications/item/legacy.sheet.mjs
var { api: api$3, sheets: sheets$3 } = foundry.applications;
var { TextEditor: TextEditor$3 } = foundry.applications.ux;
var DegenesisLegacySheet = class extends ItemSheetMixin(sheets$3.ItemSheetV2) {
	static DEFAULT_OPTIONS = {
		actions: {},
		form: { submitOnChange: true },
		window: {
			controls: [],
			resizable: true,
			frame: true
		},
		position: {
			width: 600,
			height: 600
		},
		classes: ["dgns-legacy", "dgns-item"]
	};
	static PARTS = {
		sheetTitle: { template: "systems/degenesisnext/templates/shared/sheet/title.hbs" },
		sheetFooter: { template: "systems/degenesisnext/templates/shared/sheet/footer.hbs" }
	};
	static TABS = { main: {
		initial: "description",
		tabs: [
			{
				id: "description",
				label: "DGNS.Description"
			},
			{
				id: "effects",
				label: "DGNS.Effects"
			},
			{
				id: "qualities",
				label: "DGNS.Qualities"
			}
		]
	} };
	async _prepareContext(options) {
		const context = await super._prepareContext(options);
		Object.assign(context, {
			mode: this._mode,
			document: this.document,
			system: this.document.system,
			fields: this.document.schema.fields,
			systemFields: this.document.system.schema.fields,
			isEditable: this.isEditable,
			effects: await this.item._prepareEffects(),
			tabGroups: this.tabGroups,
			mainTabs: this._prepareTabs("main"),
			enriched: { description: await TextEditor$3.enrichHTML(this.document.system.description) }
		});
		return context;
	}
	async _preparePartContext(partId, context, options) {
		if (context.mainTabs?.[partId]) context.tab = context.mainTabs[partId];
		return context;
	}
	/**
	* Format window title.
	*/
	get title() {
		return `${game.i18n.localize(this.document.type)}: ${this.document.name}`;
	}
};
//#endregion
//#region src/module/applications/item/culture.sheet.mjs
/**
* Extend the basic ItemSheet class to suppose system-specific logic and functionality.
* @abstract
*/
var { api: api$2, sheets: sheets$2 } = foundry.applications;
var { TextEditor: TextEditor$2 } = foundry.applications.ux;
var { FilePicker: FilePicker$3 } = foundry.applications.apps;
var DegenesisCultureSheet = class extends BackgroundSheetMixin(ItemSheetMixin(sheets$2.ItemSheetV2)) {
	static DEFAULT_OPTIONS = {
		actions: {
			addCommonCult: this.#addCommonCult,
			removeCommonCult: this.#removeCommonCult
		},
		form: { submitOnChange: true },
		window: {
			controls: [{
				action: "changeSheetBackground",
				icon: "fa-solid fa-user-circle",
				label: "SHEET.ChangeBackground",
				ownership: "OWNER"
			}],
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
		sheetHeader: { template: "systems/degenesisnext/templates/shared/sheet/title.hbs" },
		cultureHeader: { template: "systems/degenesisnext/templates/item/culture/header.hbs" },
		cultureData: { template: "systems/degenesisnext/templates/item/culture/data.hbs" },
		cultureLore: { template: "systems/degenesisnext/templates/item/culture/lore.hbs" }
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
		context.enriched = { description: await TextEditor$2.enrichHTML(this.document.system.description) };
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
		let tabs = {};
		for (let tab in tabs) if (this.tabGroups[tabGroup] === tabs[tab].id) {
			tabs[tab].cssClass = "active";
			tabs[tab].active = true;
		}
		return tabs;
	}
	/**
	* Creating initial context menus for permanent objects
	*/
	createContextMenus() {}
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
	static async #changeSheetBackground() {
		await super.changeSheetBackground();
	}
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
};
//#endregion
//#region src/module/applications/item/concept.sheet.mjs
var { api: api$1, sheets: sheets$1 } = foundry.applications;
var { TextEditor: TextEditor$1 } = foundry.applications.ux;
var { FilePicker: FilePicker$2 } = foundry.applications.apps;
var DegenesisConceptSheet = class extends BackgroundSheetMixin(ItemSheetMixin(sheets$1.ItemSheetV2)) {
	static DEFAULT_OPTIONS = {
		actions: {},
		form: { submitOnChange: true },
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
		sheetHeader: { template: "systems/degenesisnext/templates/shared/sheet/title.hbs" },
		conceptHeader: { template: "systems/degenesisnext/templates/item/concept/header.hbs" },
		conceptData: { template: "systems/degenesisnext/templates/item/concept/data.hbs" },
		conceptLore: { template: "systems/degenesisnext/templates/item/concept/lore.hbs" }
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
		context.enriched = { description: await TextEditor$1.enrichHTML(this.document.system.description) };
		return context;
	}
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
};
//#endregion
//#region src/module/applications/item/cult.sheet.mjs
var { api, sheets } = foundry.applications;
var { TextEditor } = foundry.applications.ux;
var { FilePicker: FilePicker$1 } = foundry.applications.apps;
var DegenesisCultSheet = class extends BackgroundSheetMixin(ItemSheetMixin(sheets.ItemSheetV2)) {
	static DEFAULT_OPTIONS = {
		actions: {},
		form: { submitOnChange: true },
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
		sheetHeader: { template: "systems/degenesisnext/templates/shared/sheet/title.hbs" },
		conceptHeader: { template: "systems/degenesisnext/templates/item/cult/header.hbs" },
		conceptData: { template: "systems/degenesisnext/templates/item/cult/data.hbs" },
		conceptLore: { template: "systems/degenesisnext/templates/item/cult/lore.hbs" }
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
		context.enriched = { description: await TextEditor.enrichHTML(this.document.system.description) };
		console.log(`CultSheet | Context`);
		console.log(context);
		return context;
	}
};
//#endregion
//#region src/module/applications/item/_module.mjs
var _module_exports$3 = /* @__PURE__ */ __exportAll({
	BackgroundSheetMixin: () => BackgroundSheetMixin,
	DGNSConceptSheet: () => DegenesisConceptSheet,
	DGNSCultSheet: () => DegenesisCultSheet,
	DGNSCultureSheet: () => DegenesisCultureSheet,
	DGNSLegacySheet: () => DegenesisLegacySheet,
	DGNSModificationSheet: () => DegenesisModificationSheet,
	DGNSPotentialSheet: () => DegenesisPotentialSheet,
	DGNSWeaponSheet: () => DegenesisWeaponSheet,
	ItemSheetMixin: () => ItemSheetMixin
});
//#endregion
//#region src/module/applications/components/stylesheet-mixin.mjs
/**
* DND5E Implementation of custom elements
*
* Adds functionality to a custom HTML element for caching its stylesheet
* and adopting it into its Shadow DOM,
* rather than having each stylesheet duplicated per element.
*
* @param {typeof HTMLElement} Base  The base class being mixed.
* @returns {typeof AdoptedStyleSheetElement}
*/
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
		/** @inheritDoc */
		adoptedCallback() {
			if (this._getStyleSheet()) this._adoptStyleSheet(this._getStyleSheet());
		}
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
		/**
		* Adopt the stylesheet into the Shadow DOM.
		* @param {CSSStyleSheet} sheet  The sheet to adopt.
		* @abstract
		*/
		_adoptStyleSheet(sheet) {}
	};
}
//#endregion
//#region src/module/applications/components/checkbox.mjs
var CheckboxElement = class extends StyleSheetMixin(foundry.applications.elements.AbstractFormInputElement) {
	constructor(...args) {
		super(...args);
		this._internals.role = "checkbox";
		this._value = this.getAttribute("value");
		this.#defaultValue = this._value;
		if (this.constructor.useShadowRoot) this.#shadowRoot = this.attachShadow({ mode: "closed" });
	}
	/** @override */
	static tagName = "dgns-checkbox";
	/**
	* Should a show root be created for this element?
	*/
	static useShadowRoot = true;
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
	/**
	* Controller for removing listeners automatically.
	* @type {AbortController}
	*/
	_controller;
	/**
	* The shadow root that contains the checkbox elements.
	* @type {ShadowRoot}
	*/
	#shadowRoot;
	/**
	* The default value as originally specified in the HTML that created this object.
	* @type {string}
	*/
	get defaultValue() {
		return this.#defaultValue;
	}
	#defaultValue;
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
	/** @override */
	connectedCallback() {
		this._adoptStyleSheet(this._getStyleSheet());
		const elements = this._buildElements();
		this.#shadowRoot.replaceChildren(...elements);
		this._refresh();
		this._activateListeners();
		if (!this.hasAttribute("tabindex")) this.tabIndex = 0;
	}
	/** @override */
	disconnectedCallback() {
		this._controller.abort();
	}
	/** @override */
	_adoptStyleSheet(sheet) {
		this.#shadowRoot.adoptedStyleSheets = [sheet];
	}
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
	/** @override */
	_activateListeners() {
		const { signal } = this._controller = new AbortController();
		this.addEventListener("click", this._onClick.bind(this), { signal });
		this.addEventListener("keydown", (event) => event.key === " " ? this._onClick(event) : null, { signal });
	}
	/** @override */
	_refresh() {
		super._refresh();
		this._internals.ariaChecked = `${this.hasAttribute("checked")}`;
	}
	/** @override */
	_onClick(event) {
		event.preventDefault();
		this.checked = !this.checked;
		this.dispatchEvent(new Event("input", {
			bubbles: true,
			cancelable: true
		}));
		this.dispatchEvent(new Event("change", {
			bubbles: true,
			cancelable: true
		}));
	}
};
//#endregion
//#region src/module/applications/components/slide-toggle.mjs
/**
* A custom HTML element that represents a checkbox-like input that is displayed as a slide toggle.
* @fires change
*/
var SlideToggleElement = class extends CheckboxElement {
	/** @inheritDoc */
	constructor() {
		super();
		this._internals.role = "switch";
	}
	/** @override */
	static tagName = "dgns-slidetoggle";
	/** @override */
	static useShadowRoot = false;
	/**
	* Activate the element when it is attached to the DOM.
	* @inheritDoc
	*/
	connectedCallback() {
		this.replaceChildren(...this._buildElements());
		this._refresh();
		this._activateListeners();
	}
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
};
//#endregion
//#region src/module/applications/components/discomfort.mjs
var icons$1 = {
	0: "di di-discomfort0",
	1: "di di-discomfort1",
	2: "di di-discomfort2",
	3: "di di-discomfort3",
	4: "di di-discomfort4"
};
var discomfort = [
	{
		value: 0,
		icon: icons$1[0],
		tooltip: "0"
	},
	{
		value: 1,
		icon: icons$1[1],
		tooltip: "-1"
	},
	{
		value: 2,
		icon: icons$1[2],
		tooltip: "-2"
	},
	{
		value: 3,
		icon: icons$1[3],
		tooltip: "-3"
	},
	{
		value: 4,
		icon: icons$1[4],
		tooltip: "-4"
	}
];
var DiscomfortElement = class extends StyleSheetMixin(foundry.applications.elements.AbstractFormInputElement) {
	constructor(...args) {
		super(...args);
		this._internals.role = "select";
		this._value = this.getAttribute("value");
		this.#defaultValue = this._value;
		if (this.constructor.useShadowRoot) this.#shadowRoot = this.attachShadow({ mode: "open" });
	}
	/** @override */
	static tagName = "dgns-discomfort";
	/**
	* Should a show root be created for this element?
	*/
	static useShadowRoot = false;
	/** @override */
	static CSS = ``;
	/**
	* Controller for removing listeners automatically.
	* @type {AbortController}
	*/
	_controller;
	/**
	* The shadow root that contains the checkbox elements.
	* @type {ShadowRoot}
	*/
	#shadowRoot;
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
	/** @override */
	connectedCallback() {
		this._adoptStyleSheet(this._getStyleSheet());
		const elements = this._buildElements();
		if (this.useShadowRoot) this.#shadowRoot.replaceChildren(...elements);
		else this.replaceChildren(...elements);
		this._refresh();
		this._activateListeners();
		if (!this.hasAttribute("tabindex")) this.tabIndex = 0;
	}
	/** @override */
	disconnectedCallback() {
		this._controller.abort();
	}
	/** @override */
	_adoptStyleSheet(sheet) {
		if (this.useShadowRoot) this.#shadowRoot.adoptedStyleSheets = [sheet];
		else this.adoptedStyleSheets = [sheet];
	}
	/** @override */
	_buildElements() {
		const container = document.createElement("div");
		const button = document.createElement("button");
		button.setAttribute("id", "discomfortButton");
		button.innerHTML = `<i class="${icons$1[this.value]}"></i>`;
		const dropdown = document.createElement("div");
		dropdown.setAttribute("id", "discomfortDropdown");
		dropdown.classList.add("discomfort-dropdown");
		discomfort.forEach((discomfort) => {
			const item = document.createElement("div");
			item.className = "discomfort-dropdown-item";
			item.setAttribute("data-value", discomfort.value);
			const malus = document.createElement("label");
			malus.className = "discomfort-malus";
			malus.textContent = discomfort.tooltip;
			item.innerHTML = `<i class="${discomfort.icon}"></i>`;
			item.appendChild(malus);
			item.addEventListener("click", (ev) => {
				this.value = ev.target.closest("div").getAttribute("data-value");
				this.dispatchEvent(new Event("change", {
					bubbles: true,
					cancelable: true
				}));
			});
			dropdown.appendChild(item);
		});
		container.appendChild(button);
		container.appendChild(dropdown);
		return [container];
	}
	/** @override */
	_activateListeners() {
		const { signal } = this._controller = new AbortController();
		this.addEventListener("click", this._onClick.bind(this), { signal });
		this.addEventListener("keydown", (event) => event.key === " " ? this._onClick(event) : null, { signal });
	}
	/** @override */
	_refresh() {
		super._refresh();
	}
	/** @override */
	_onClick(event) {
		event.preventDefault();
		let dropdown = {};
		if (this.useShadowRoot) dropdown = this.shadowRoot.getElementById("discomfortDropdown");
		else dropdown = this.firstChild.lastChild;
		dropdown.classList.toggle("active");
	}
};
//#endregion
//#region src/module/applications/components/vision.mjs
var icons = {
	0: "di di-vision0",
	1: "di di-vision1",
	2: "di di-vision2",
	3: "di di-vision3",
	4: "di di-vision4"
};
var vision = [
	{
		value: 0,
		icon: icons[0],
		tooltip: "0"
	},
	{
		value: 1,
		icon: icons[1],
		tooltip: "-1"
	},
	{
		value: 2,
		icon: icons[2],
		tooltip: "-2"
	},
	{
		value: 3,
		icon: icons[3],
		tooltip: "-3"
	},
	{
		value: 4,
		icon: icons[4],
		tooltip: "-4"
	}
];
var VisionElement = class extends StyleSheetMixin(foundry.applications.elements.AbstractFormInputElement) {
	constructor(...args) {
		super(...args);
		this._internals.role = "select";
		this._value = this.getAttribute("value");
		this.#defaultValue = this._value;
		if (this.constructor.useShadowRoot) this.#shadowRoot = this.attachShadow({ mode: "open" });
	}
	/** @override */
	static tagName = "dgns-vision";
	/**
	* Should a show root be created for this element?
	*/
	static useShadowRoot = false;
	/** @override */
	static CSS = ``;
	/**
	* Controller for removing listeners automatically.
	* @type {AbortController}
	*/
	_controller;
	/**
	* The shadow root that contains the checkbox elements.
	* @type {ShadowRoot}
	*/
	#shadowRoot;
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
	/** @override */
	connectedCallback() {
		this._adoptStyleSheet(this._getStyleSheet());
		const elements = this._buildElements();
		if (this.useShadowRoot) this.#shadowRoot.replaceChildren(...elements);
		else this.replaceChildren(...elements);
		this._refresh();
		this._activateListeners();
		if (!this.hasAttribute("tabindex")) this.tabIndex = 0;
	}
	/** @override */
	disconnectedCallback() {
		this._controller.abort();
	}
	/** @override */
	_adoptStyleSheet(sheet) {
		if (this.useShadowRoot) this.#shadowRoot.adoptedStyleSheets = [sheet];
		else this.adoptedStyleSheets = [sheet];
	}
	/** @override */
	_buildElements() {
		const container = document.createElement("div");
		const button = document.createElement("button");
		button.setAttribute("id", "visionButton");
		button.innerHTML = `<i class="${icons[this.value]}"></i>`;
		const dropdown = document.createElement("div");
		dropdown.setAttribute("id", "visionDropdown");
		dropdown.classList.add("vision-dropdown");
		vision.forEach((vision) => {
			const item = document.createElement("div");
			item.className = "vision-dropdown-item";
			item.setAttribute("data-value", vision.value);
			const malus = document.createElement("label");
			malus.className = "vision-malus";
			malus.textContent = vision.tooltip;
			item.innerHTML = `<i class="${vision.icon}"></i>`;
			item.appendChild(malus);
			item.addEventListener("click", (ev) => {
				this.value = ev.target.closest("div").getAttribute("data-value");
				this.dispatchEvent(new Event("change", {
					bubbles: true,
					cancelable: true
				}));
			});
			dropdown.appendChild(item);
		});
		container.appendChild(button);
		container.appendChild(dropdown);
		return [container];
	}
	/** @override */
	_activateListeners() {
		const { signal } = this._controller = new AbortController();
		this.addEventListener("click", this._onClick.bind(this), { signal });
		this.addEventListener("keydown", (event) => event.key === " " ? this._onClick(event) : null, { signal });
	}
	/** @override */
	_refresh() {
		super._refresh();
	}
	/** @override */
	_onClick(event) {
		event.preventDefault();
		let dropdown = {};
		if (this.useShadowRoot) dropdown = this.shadowRoot.getElementById("visionDropdown");
		else dropdown = this.firstChild.lastChild;
		dropdown.classList.toggle("active");
	}
};
//#endregion
//#region src/module/applications/components/primal-focus.mjs
var MODES$1 = {
	primal: {
		value: "primal",
		icon: "di di-primal",
		label: "DGNS.Primal",
		tooltip: "DGNS.PrimalFocusSwitch"
	},
	focus: {
		value: "focus",
		icon: "di di-focus",
		label: "DGNS.Focus",
		tooltip: "DGNS.PrimalFocusSwitch"
	}
};
var PrimalFocusSwitch = class extends StyleSheetMixin(foundry.applications.elements.AbstractFormInputElement) {
	constructor(...args) {
		super(...args);
		this._internals.role = "switch";
		this._value = this.getAttribute("value") ?? "primal";
		this.#defaultValue = this._value;
		if (this.constructor.useShadowRoot) this.#shadowRoot = this.attachShadow({ mode: "open" });
	}
	static tagName = "dgns-primal-focus-switch";
	static useShadowRoot = false;
	static CSS = ``;
	_controller;
	#shadowRoot;
	#defaultValue;
	get defaultValue() {
		return this.#defaultValue;
	}
	get value() {
		return super.value;
	}
	set value(value) {
		if (!MODES$1[value]) return;
		this._setValue(value);
	}
	get locked() {
		return this.hasAttribute("locked");
	}
	set locked(value) {
		this.toggleAttribute("locked", !!value);
		this._refresh();
	}
	connectedCallback() {
		this._adoptStyleSheet(this._getStyleSheet());
		const elements = this._buildElements();
		if (this.constructor.useShadowRoot) this.#shadowRoot.replaceChildren(...elements);
		else this.replaceChildren(...elements);
		this._refresh();
		this._activateListeners();
		if (!this.hasAttribute("tabindex")) this.tabIndex = 0;
	}
	disconnectedCallback() {
		this._controller?.abort();
	}
	_adoptStyleSheet(sheet) {
		if (this.constructor.useShadowRoot) this.#shadowRoot.adoptedStyleSheets = [sheet];
		else this.adoptedStyleSheets = [sheet];
	}
	_buildElements() {
		const title = document.createElement("div");
		title.className = "mode-title";
		title.innerHTML = game.i18n.localize("UI.TITLES.primalFocus");
		const container = document.createElement("div");
		container.className = "mode-switch";
		for (const mode of Object.values(MODES$1)) {
			const btnContainer = document.createElement("div");
			btnContainer.className = "button-container";
			const btn = document.createElement("button");
			btn.type = "button";
			btn.dataset.mode = mode.value;
			btn.title = mode.tooltip;
			btn.setAttribute("aria-pressed", mode.value === this._value);
			const icon = document.createElement("i");
			icon.className = mode.icon;
			btn.appendChild(icon);
			container.appendChild(btn);
			btn.addEventListener("click", (ev) => {
				ev.preventDefault();
				if (this.locked) return;
				this.value = mode.value;
				this.dispatchEvent(new Event("change", {
					bubbles: true,
					cancelable: true
				}));
			});
		}
		return [title, container];
	}
	_activateListeners() {
		const { signal } = this._controller = new AbortController();
		this.addEventListener("keydown", (ev) => {
			if (this.locked) return;
			if (!["ArrowLeft", "ArrowRight"].includes(ev.key)) return;
			ev.preventDefault();
			const modes = Object.keys(MODES$1);
			this.value = modes[(modes.indexOf(this._value) + (ev.key === "ArrowRight" ? 1 : -1) + modes.length) % modes.length];
			this.dispatchEvent(new Event("change", {
				bubbles: true,
				cancelable: true
			}));
		}, { signal });
	}
	_refresh() {
		const container = (this.constructor.useShadowRoot ? this.#shadowRoot : this)?.querySelector(".mode-switch");
		if (!container) return;
		container.classList.toggle("locked", this.locked);
		for (const btn of container.querySelectorAll("button[data-mode]")) {
			const isActive = btn.dataset.mode === this._value;
			btn.classList.toggle("active", isActive);
			btn.setAttribute("aria-pressed", isActive);
			btn.disabled = this.locked;
		}
	}
};
//#endregion
//#region src/module/applications/components/faith-willpower.mjs
var MODES = {
	faith: {
		value: "faith",
		icon: "di di-faith",
		label: "DGNS.Faith",
		tooltip: "DGNS.FaithWillpowerSwitch"
	},
	willpower: {
		value: "willpower",
		icon: "di di-willpower",
		label: "DGNS.Willpower",
		tooltip: "DGNS.FaithWillpowerSwitch"
	}
};
var FaithWillSwitch = class extends StyleSheetMixin(foundry.applications.elements.AbstractFormInputElement) {
	constructor(...args) {
		super(...args);
		this._internals.role = "switch";
		this._value = this.getAttribute("value") ?? "faith";
		this.#defaultValue = this._value;
		if (this.constructor.useShadowRoot) this.#shadowRoot = this.attachShadow({ mode: "open" });
	}
	static tagName = "dgns-faith-will-switch";
	static useShadowRoot = false;
	static CSS = ``;
	_controller;
	#shadowRoot;
	#defaultValue;
	get defaultValue() {
		return this.#defaultValue;
	}
	get value() {
		return super.value;
	}
	set value(value) {
		if (!MODES[value]) return;
		this._setValue(value);
	}
	get locked() {
		return this.hasAttribute("locked");
	}
	set locked(value) {
		this.toggleAttribute("locked", !!value);
		this._refresh();
	}
	connectedCallback() {
		this._adoptStyleSheet(this._getStyleSheet());
		const elements = this._buildElements();
		if (this.constructor.useShadowRoot) this.#shadowRoot.replaceChildren(...elements);
		else this.replaceChildren(...elements);
		this._refresh();
		this._activateListeners();
		if (!this.hasAttribute("tabindex")) this.tabIndex = 0;
	}
	disconnectedCallback() {
		this._controller?.abort();
	}
	_adoptStyleSheet(sheet) {
		if (this.constructor.useShadowRoot) this.#shadowRoot.adoptedStyleSheets = [sheet];
		else this.adoptedStyleSheets = [sheet];
	}
	_buildElements() {
		const title = document.createElement("div");
		title.className = "mode-title";
		title.innerHTML = game.i18n.localize("UI.TITLES.faithWill");
		const container = document.createElement("div");
		container.className = "mode-switch";
		for (const mode of Object.values(MODES)) {
			const btn = document.createElement("button");
			btn.type = "button";
			btn.dataset.mode = mode.value;
			btn.title = mode.tooltip;
			btn.setAttribute("aria-pressed", mode.value === this._value);
			const icon = document.createElement("i");
			icon.className = mode.icon;
			btn.appendChild(icon);
			container.appendChild(btn);
			btn.addEventListener("click", (ev) => {
				ev.preventDefault();
				if (this.locked) return;
				this.value = mode.value;
				this.dispatchEvent(new Event("change", {
					bubbles: true,
					cancelable: true
				}));
			});
		}
		return [title, container];
	}
	_activateListeners() {
		const { signal } = this._controller = new AbortController();
		this.addEventListener("keydown", (ev) => {
			if (this.locked) return;
			if (!["ArrowLeft", "ArrowRight"].includes(ev.key)) return;
			ev.preventDefault();
			const modes = Object.keys(MODES);
			this.value = modes[(modes.indexOf(this._value) + (ev.key === "ArrowRight" ? 1 : -1) + modes.length) % modes.length];
			this.dispatchEvent(new Event("change", {
				bubbles: true,
				cancelable: true
			}));
		}, { signal });
	}
	_refresh() {
		const container = (this.constructor.useShadowRoot ? this.#shadowRoot : this)?.querySelector(".mode-switch");
		if (!container) return;
		container.classList.toggle("locked", this.locked);
		for (const btn of container.querySelectorAll("button[data-mode]")) {
			const isActive = btn.dataset.mode === this._value;
			btn.classList.toggle("active", isActive);
			btn.setAttribute("aria-pressed", isActive);
			btn.disabled = this.locked;
		}
	}
};
//#endregion
//#region src/module/applications/components/_module.mjs
/**
* Custom HTML Elements based on DND5E Implementation
*/
var _module_exports$2 = /* @__PURE__ */ __exportAll({
	CheckboxElement: () => CheckboxElement,
	DiscomfortElement: () => DiscomfortElement,
	FaithWillSwitch: () => FaithWillSwitch,
	PrimalFocusSwitch: () => PrimalFocusSwitch,
	SlideToggleElement: () => SlideToggleElement,
	VisionElement: () => VisionElement
});
window.customElements.define("dgns-checkbox", CheckboxElement);
window.customElements.define("dgns-slidetoggle", SlideToggleElement);
window.customElements.define("dgns-vision", VisionElement);
window.customElements.define("dgns-discomfort", DiscomfortElement);
window.customElements.define("dgns-primal-focus", PrimalFocusSwitch);
window.customElements.define("dgns-faith-will", FaithWillSwitch);
//#endregion
//#region src/module/applications/ui/gamePause.mjs
var DGNSGamePause = class extends foundry.applications.ui.GamePause {
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
};
//#endregion
//#region src/module/applications/ui/_module.mjs
var _module_exports$1 = /* @__PURE__ */ __exportAll({ DGNSGamePause: () => DGNSGamePause });
//#endregion
//#region src/module/applications/_module.mjs
var _module_exports = /* @__PURE__ */ __exportAll({
	actor: () => _module_exports$4,
	components: () => _module_exports$2,
	item: () => _module_exports$3,
	ui: () => _module_exports$1
});
//#endregion
//#region src/module/data/fields/local-document-field.mjs
/**
* @typedef {StringFieldOptions} LocalDocumentFieldOptions
* @property {boolean} [fallback=false]  Display the string value if no matching item is found.
*/
/**
* A mirror of ForeignDocumentField that references a Document embedded within this Document.
* This is epic stuff. Guys from dnd5e did a splendid job.
*
* @param {typeof Document} model              The local DataModel class definition which this field should link to.
* @param {LocalDocumentFieldOptions} options  Options which configure the behavior of the field.
*/
var LocalDocumentField = class extends foundry.data.fields.DocumentIdField {
	constructor(model, options = {}) {
		if (!foundry.utils.isSubclass(model, foundry.abstract.DataModel)) throw new Error("A ForeignDocumentField must specify a DataModel subclass as its type");
		super(options);
		this.model = model;
	}
	/**
	* A reference to the model class which is stored in this field.
	* @type {typeof Document}
	*/
	model;
	/** @inheritDoc */
	static get _defaults() {
		return foundry.utils.mergeObject(super._defaults, {
			nullable: true,
			readonly: false,
			idOnly: false,
			fallback: false
		});
	}
	/** @override */
	_cast(value) {
		if (value === null || value === void 0 || value === "") return null;
		if (typeof value === "string") return value;
		if (value instanceof this.model) return value._id;
		throw new Error(`The value provided to a LocalDocumentField must be a ${this.model.name} instance.`);
	}
	/** @inheritDoc */
	_validateType(value) {
		if (!this.options.fallback) super._validateType(value);
	}
	/** @override */
	initialize(value, model, options = {}) {
		if (value === null || value === void 0 || value === "") return null;
		if (this.idOnly) return this.options.fallback || foundry.data.validators.isValidId(value) ? value : null;
		const collection = model.parent?.[this.model.metadata.collection];
		return () => {
			const document = collection?.get(value);
			if (!document) return this.options.fallback ? value : null;
			if (this.options.fallback) Object.defineProperty(document, "toString", {
				value: () => document.name,
				configurable: true,
				enumerable: false
			});
			return document;
		};
	}
	clean(value, options) {
		if (value === "") value = null;
		return super.clean(value, options);
	}
	/** @inheritDoc */
	toObject(value) {
		return value?._id ?? value;
	}
};
//#endregion
//#region src/module/data/fields/cached-reference-field.mjs
/** @import {SchemaField, ForeignDocumentField} from "@client/data/fields.mjs" */
/** @import Document from "@common/abstract/document.mjs"; */
/** @import Item from "@common/documents/item.mjs"; */
var { SchemaField: SchemaField$28, ForeignDocumentField: ForeignDocumentField$6 } = foundry.data.fields;
/**
* Special field type for storing both link to foreign document (world item)
* and local document (embedded item). If item link is severed, it will fallback to cache.
* @extends {SchemaField}
*/
var CachedReferenceField = class extends SchemaField$28 {
	/**
	*
	* @param {typeof Item} model
	* @param {*} options
	*/
	constructor(model, options = {}) {
		if (!foundry.utils.isSubclass(model, foundry.abstract.DataModel)) throw new Error("CachedReferenceField must specify a DataModel subclass");
		super({
			linked: new ForeignDocumentField$6(model, {
				nullable: true,
				idOnly: false
			}),
			cached: new LocalDocumentField(model, {
				nullable: true,
				idOnly: false
			})
		}, options);
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
			await parent.update({ [`system.${path}.linked`]: null }, { [`system.${path}.cached`]: null });
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
};
//#endregion
//#region src/module/dice/base.roll.mjs
/** @import Roll from '@client/dice/roll.mjs*/
var { Roll: Roll$1 } = foundry.dice;
var { renderTemplate: renderTemplate$1 } = foundry.applications.handlebars;
/**
* Default roll class. Use it for building variations (like action roll,
* complex roll etc.)
*/
/** @inheritdoc */
var DGNSRoll = class extends Roll$1 {
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
	/**
	* Is the result of this roll a success? Returns `undefined` if roll isn't evaluated.
	* @type {boolean|void}
	*/
	get sucess() {
		if (!this._evaluated) return;
		if (!Number.isNumeric(this.difficulty)) return false;
		return this.total >= this.difficulty;
	}
	/**
	* Is the result of this roll a failure? Returns `undefined` if roll isn't evaluated.
	* @type {boolean|void}
	*/
	get failure() {
		if (!this._evaluated) return;
		if (!Number.isNumeric(this.options.difficulty)) return false;
		return this.total < this.difficulty;
	}
	/**
	* Is the result of this roll a botch? Returns `undefined` if roll isn't evaluated.
	* @type {boolean|void}
	*/
	get botch() {
		if (!this._evaluated) return;
		if (!Number.isNumeric(this.options.difficulty)) return false;
		return this.total < this.difficulty;
	}
	/** @inheritDoc */
	async evaluate(options = {}) {
		await super.evaluate(options);
		this._evaluateSuccess();
		return this;
	}
	/** @inheritDoc */
	evaluateSync(options = {}) {
		return super.evaluateSync(options);
	}
	_evaluateSuccess() {
		this.successes = this.dice[0].results.filter((r) => r.result >= 4).length + this.modifiers.s + this.autoSuccesses;
		this.ones = this.dice[0].results.filter((r) => r.result === 1).length;
		this.triggers = this.dice[0].results.filter((r) => r.result === 6).length + this.modifiers.t;
		if (this.difficulty) if (this.successes < this.ones) this._outcome = "botch";
		else if (this.successes >= this.difficulty) this._outcome = "success";
		else this._outcome = "failure";
		else this._outcome = null;
	}
	/** Display result to chat  */
	async toMessage(messageData = {}, { rollMode = null, create = true } = {}) {
		rollMode = rollMode || game.settings.get("core", "rollMode");
		console.log(rollMode);
		const speaker = ChatMessage.getSpeaker();
		const chatData = {
			title: game.i18n.localize(`DGNS.ROLL.actionRoll`),
			attribute: game.i18n.localize(`DGNS.ATTRIBUTE.${this.definition.attribute}`),
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
		const messageOptions = foundry.utils.mergeObject({
			user: game.user.id,
			style: CONST.CHAT_MESSAGE_STYLES ? CONST.CHAT_MESSAGE_STYLES.ROLL : void 0,
			content,
			rolls: [this],
			speaker,
			flags: { "core.rollMode": rollMode }
		}, messageData);
		ChatMessage.applyRollMode(messageOptions, rollMode);
		return create ? ChatMessage.create(messageOptions) : messageOptions;
	}
	get result() {
		return this._outcome;
	}
};
//#endregion
//#region src/module/applications/roll/action.dialog.mjs
/** @import HandlebarsApplicationMixin from '@client/applications/api/handlebars-application.mjs*/
var { HandlebarsApplicationMixin: HandlebarsApplicationMixin$1, ApplicationV2: ApplicationV2$1 } = foundry.applications.api;
var { FormDataExtended: FormDataExtended$1 } = foundry.applications.ux;
/** @inheritdoc */
var DGNSActionRollDialog = class extends HandlebarsApplicationMixin$1(ApplicationV2$1) {
	constructor(rollConfig, options = {}) {
		super(rollConfig, options);
		this._actor = rollConfig.actor;
		this._rollDefinition = foundry.utils.mergeObject(this._rollDefinition, rollConfig.definiton);
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
	static PARTS = { rollDialog: {
		template: "systems/degenesisnext/templates/rolls/roll.action.dialog.hbs",
		templates: [
			"systems/degenesisnext/templates/rolls/partials/roll.action.hbs",
			"systems/degenesisnext/templates/rolls/partials/roll.configuration.hbs",
			"systems/degenesisnext/templates/rolls/partials/roll.effects.hbs",
			"systems/degenesisnext/templates/rolls/partials/roll.summary.hbs",
			"systems/degenesisnext/templates/rolls/partials/roll.buttons.hbs"
		]
	} };
	async _prepareContext(options) {
		const context = await super._prepareContext(options);
		context.attribute = this._rollDefinition.attribute;
		context.skill = this._rollDefinition.skill;
		/** Universal structure for all type of rolls (passing  prefix
		* to differentiatie in case of multiple roll).
		*/
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
		application.addEventListener("close", () => resolve(application.config), { once: true });
		application.render({
			force: true,
			zIndex: 5e8
		});
		return promise;
	}
	_onChangeForm(formConfig, event) {
		super._onChangeForm(formConfig, event);
		const formElement = event.target.form;
		const formData = new FormDataExtended$1(formElement).object;
		const expanded = foundry.utils.expandObject(formData);
		foundry.utils.mergeObject(this._rollDefinition, expanded.roll);
		if (this._rollDefinition.difficulty !== void 0) this._rollDefinition.difficulty = Math.clamp(this._rollDefinition.difficulty, 1, 12);
		this.render();
	}
	static #onManageDifficulty(event, target) {
		const prefix = target.dataset.prefix;
		const method = target.dataset.method;
		const targetData = prefix === "roll" ? this._rollDefinition : this._rollDefinition[prefix];
		if (method === "increaseDifficulty" && targetData.difficulty < 12) targetData.difficulty++;
		else if (method === "decreaseDifficulty" && targetData.difficulty > 0) targetData.difficulty--;
		else return;
		this.render();
	}
	_getRollData(prefix) {
		if (prefix === "roll" || !this._rollDefinition.primary) return this._rollDefinition;
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
		const roll = new DGNSRoll(this._rollDefinition);
		await roll.evaluate();
		roll.toMessage();
		this.close();
	}
	/** Submit Handler  */
	static async #submitHandler(event, form, formData) {
		this.preformRoll(this.roll);
	}
};
//#endregion
//#region src/module/dice/combination.roll.mjs
var { renderTemplate } = foundry.applications.handlebars;
/**
* Combination roll class - using two instances of basic rolls.
*/
var DGNSCombinationRoll = class {
	constructor(data) {
		this.primary = new DGNSRoll(data.primary);
		this.secondary = new DGNSRoll(data.secondary);
		this.transferTriggers = data.transferTriggers ?? true;
	}
	async evaluate() {
		await this.primary.evaluate();
		if (this.primary.result === "failure") {}
		if (this.transferTriggers && this.primary.triggers > 0) this.secondary.modifiers.t += this.primary.triggers;
		await this.secondary.evaluate();
		return this;
	}
	async toMessage(messageData = {}) {
		const content = await renderTemplate("systems/degenesisnext/templates/chat/combination.roll.hbs", {
			primary: this.primary,
			secondary: this.secondary,
			totalTriggers: this.primary.triggers + this.secondary.triggers
		});
		return ChatMessage.create({
			user: game.user.id,
			content,
			rolls: [this.primary, this.secondary],
			speaker: ChatMessage.getSpeaker(),
			...messageData
		});
	}
};
//#endregion
//#region src/module/applications/roll/combination.dialog.mjs
var { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;
var { FormDataExtended } = foundry.applications.ux;
/** @inheritdoc */
var DGNSCombinationRollDialog = class extends HandlebarsApplicationMixin(ApplicationV2) {
	constructor(rollConfig, options = {}) {
		super(rollConfig, options);
		console.log(rollConfig);
		this._actor = rollConfig.actor;
		this._rollDefinition = foundry.utils.mergeObject(this._rollDefinition, rollConfig.definiton);
	}
	_rollDefinition = {
		primary: {
			attribute: null,
			skill: null,
			actionNumber: null,
			difficulty: 0,
			modifiers: {
				d: 0,
				s: 0,
				t: 0
			}
		},
		secondary: {
			attribute: null,
			skill: null,
			actionNumber: null,
			difficulty: 0,
			modifiers: {
				d: 0,
				s: 0,
				t: 0
			}
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
	static PARTS = { rollDialog: {
		template: "systems/degenesisnext/templates/rolls/roll.combination.dialog.hbs",
		templates: [
			"systems/degenesisnext/templates/rolls/partials/roll.combination.hbs",
			"systems/degenesisnext/templates/rolls/partials/roll.configuration.hbs",
			"systems/degenesisnext/templates/rolls/partials/roll.effects.hbs",
			"systems/degenesisnext/templates/rolls/partials/roll.summary.hbs",
			"systems/degenesisnext/templates/rolls/partials/roll.buttons.hbs"
		]
	} };
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
		for (let prefix of [
			"primary",
			"secondary",
			"roll"
		]) {
			const skillKey = formData[`${prefix}.skill`];
			const target = prefix === "roll" ? this._rollDefinition : this._rollDefinition[prefix];
			if (target && skillKey) {
				const actorSystem = this._actor.system;
				let foundAttrKey = null;
				let skillValue = 0;
				let attrValue = 0;
				for (let [aKey, aData] of Object.entries(actorSystem.attributes)) if (aData.skills && aData.skills[skillKey]) {
					foundAttrKey = aKey;
					attrValue = aData.value || 0;
					skillValue = aData.skills[skillKey].value || 0;
					break;
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
		if (this._rollDefinition.primary.difficulty !== void 0) this._rollDefinition.primary.difficulty = Math.clamp(this._rollDefinition.primary.difficulty, 0, 12);
		if (this._rollDefinition.secondary.difficulty !== void 0) this._rollDefinition.secondary.difficulty = Math.clamp(this._rollDefinition.secondary.difficulty, 0, 12);
		this.render();
	}
	static async create(rollConfig, options) {
		const { promise, resolve } = Promise.withResolvers();
		const application = new this(rollConfig, options);
		application.addEventListener("close", () => resolve(application.config), { once: true });
		application.render({
			force: true,
			zIndex: 5e8
		});
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
		if (method === "increaseDifficulty" && targetData.difficulty < 12) targetData.difficulty++;
		else if (method === "decreaseDifficulty" && targetData.difficulty > 1) targetData.difficulty--;
		else return;
		this.render();
	}
	/**
	* Preparing skills array for select controls.
	* @returns
	*/
	_prepareSkills() {
		const actorSystem = this._actor.system;
		const skills = [];
		for (let [attrKey, attrData] of Object.entries(actorSystem.attributes)) if (attrData.skills) for (let [skillKey, skillData] of Object.entries(attrData.skills)) skills.push({
			id: skillKey,
			label: `${game.i18n.localize(`DGNS.ATTRIBUTE.${attrKey}`)} + ${game.i18n.localize(`DGNS.SKILL.${skillKey}`)}`,
			attribute: attrKey
		});
		return skills;
	}
	_getRollData(prefix) {
		if (prefix === "roll" || !this._rollDefinition.primary) return this._rollDefinition;
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
};
//#endregion
//#region src/module/utils/item.helper.mjs
var ICONS_PATH = "systems/degenesisnext/assets/icons/items";
/**
* Todo: add all item definitions later.
*/
var ITEM_TEMPLATES = {
	potential: {
		img: `${ICONS_PATH}/potentials/common.svg`,
		system: { origin: "common" }
	},
	default: { img: `${ICONS_PATH}/default.svg` }
};
var ItemHelper = {
	prepareItemData(name, type, customData = {}) {
		const template = ITEM_TEMPLATES[type] || ITEM_TEMPLATES.default;
		const defaultName = game.i18n.format("DOCUMENT.New", { type: game.i18n.localize(`TYPES.Item.${type}`) });
		return {
			name: name || defaultName,
			type,
			img: template.img,
			system: {
				...template.system,
				...customData
			}
		};
	},
	async createActorItem(actor, itemName, itemType, customData = {}) {
		if (!actor) return;
		const item = this.prepareItemData(itemName, itemType, customData);
		return await actor.createEmbeddedDocuments("Item", [item]);
	}
};
//#endregion
//#region src/module/utils/effect.helper.mjs
/**
* Helper for managing effects in streamliend way.
*/
var EffectHelper = {
	async _prepareEffects(doc) {
		const effects = doc.effects;
		const categories = {
			temporary: {
				label: "Temporary",
				effects: []
			},
			passive: {
				label: "Active",
				effects: []
			},
			inactive: {
				label: "Disabled",
				effects: []
			}
		};
		const localSourceCache = /* @__PURE__ */ new Map();
		for (let effect of effects) {
			const origin = effect.origin;
			if (origin && localSourceCache.has(origin)) effect.source = localSourceCache.get(origin);
			else {
				effect.source = await this._getEffectSource(doc, effect);
				if (origin) localSourceCache.set(origin, effect.source);
			}
			if (effect.disabled) categories.inactive.effects.push(effect);
			else if (effect.isTemporary) categories.temporary.effects.push(effect);
			else categories.passive.effects.push(effect);
		}
		for (const category of Object.values(categories)) category.effects.sort((a, b) => {
			const sourceSort = (a.source || "").localeCompare(b.source || "", "pl");
			if (sourceSort !== 0) return sourceSort;
			return (a.name || "").localeCompare(b.name || "", "pl");
		});
		return categories;
	},
	async _manageEffect(doc, action, effectId = null) {
		const effect = doc.effects.get(effectId);
		switch (action) {
			case "create": return this._onCreateEffect(doc);
			case "edit": return effect?.sheet.render(true);
			case "delete": return effect?.delete();
			case "toggle": return effect?.update({ disabled: !effect.disabled });
		}
	},
	async _getEffectSource(doc, effect) {
		if (!effect.origin) return doc.name || doc.documentName;
		if (effect.origin === doc.uuid) return doc.name;
		const source = await fromUuid(effect.origin);
		if (!source) return "unknown";
		if (source.type === "potential") return `${source.name} (potential)`;
		if (source.type === "legacy") return `${source.name} (legacy)`;
		return source.name;
	},
	async _onCreateEffect(doc) {
		const effectData = {
			name: "New Effect",
			img: "icons/svg/aura.svg",
			origin: this.uuid,
			disabled: false
		};
		return doc.createEmbeddedDocuments("ActiveEffect", [effectData]);
	}
};
//#endregion
//#region src/module/documents/actor.mjs
/** @import Actor from '@common/documents/actor.mjs*/
/** Required field Classes */
/** Dialogs  */
/** Roll logic and helper functions  */
/**
*
* Custom Actor class for Degenesis system.
* @extends Actor
* @inheritdoc
*
*/
var DGNSActor = class extends Actor {
	static DEFAULT_ICON = "systems/degenesisnext/assets/tokens/default.png";
	prepareData() {
		super.prepareData();
	}
	prepareEmbeddedDocuments() {
		super.prepareEmbeddedDocuments();
	}
	async _preCreate(data, options, user) {
		if (await super._preCreate(data, options, user) === false) return false;
	}
	async _preUpdate(changed, options, user) {
		if (await super._preUpdate(changed, options, user) === false) return false;
	}
	_onCreate(data, options, userId) {
		super._onCreate(data, options, userId);
	}
	_onUpdate(data, options, userId) {
		super._onUpdate(data, options, userId);
		if (this.type === "group") this._propagateGroup();
	}
	async update(data, options = {}) {
		console.log(`Actor update.`);
		console.log("Data:", data);
		console.log("Options:", options);
		const fieldsToSync = this._getCachedReferenceFields();
		if (fieldsToSync.length > 0) {
			const cacheUpdates = await this._prepareCacheUpdates(data, fieldsToSync);
			if (cacheUpdates) foundry.utils.mergeObject(data, cacheUpdates);
		}
		return super.update(data, options);
	}
	/**
	* Set actor's group (ForeignField link) and reverse link
	* @param {*} groupId
	*/
	async setGroup(groupActor = null) {
		await groupActor.update({ ["system.members"]: [...groupActor.system.members, { actor: this.id }] });
		await this.update({ ["system.group"]: groupActor.id });
	}
	/**
	* Remove reference to group.
	*/
	async unsetGroup() {
		if (this.system?.group) {
			let group = this.system.group;
			await this.system.group.update({ ["system.members"]: group.system.members.filter((member) => member.actor.id !== this.id) });
			await this.update({ ["system.group"]: null });
		}
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
	/**
	* Discover any CachedReferenceFields from schema.
	* @returns {string[]} Array of keys.
	*/
	_getCachedReferenceFields() {
		const fields = [];
		for (const [key, field] of Object.entries(this.system.schema.fields)) if (field instanceof CachedReferenceField) fields.push(key);
		return fields;
	}
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
			const itemChange = foundry.utils.getProperty(data, `system.${field}.linked`);
			if (itemChange === void 0) continue;
			const currentCachedId = this.system[field]?.cached?.id;
			if (currentCachedId) {
				const oldCache = this.items.get(currentCachedId);
				if (oldCache) await oldCache.delete();
			}
			if (!itemChange) {
				updates[`system.${field}.cached`] = null;
				hasUpdates = true;
				continue;
			}
			const worldDoc = game.items.get(itemChange);
			if (worldDoc) {
				const [created] = await this.createEmbeddedDocuments("Item", [worldDoc.toObject()]);
				updates[`system.${field}.cached`] = created.id;
				hasUpdates = true;
			}
		}
		return hasUpdates ? updates : null;
	}
	/**
	* Preparing ActiveEffects for sheet.
	* @returns
	*/
	async _prepareEffects() {
		return await EffectHelper._prepareEffects(this);
	}
	/**
	* Handling effects for actor.
	* @param {*} action
	* @param {*} effectId
	* @returns
	*/
	async _manageEffect(action, effectId = null) {
		return await EffectHelper._manageEffect(this, action, effectId);
	}
	/**
	* Helper function for creating new effect.
	* @returns
	*/
	async _onCreateEffect() {
		return await EffectHelper._onCreateEffect(this);
	}
	/**
	* Prepare potentials collection for actor sheet.
	* todo: still to improve.
	* @returns
	*/
	_preparePotentials() {
		return this.items.filter((item) => item.type === "potential").sort((a, b) => a.name.localeCompare(b.name));
	}
	/**
	* Prepare potentials collection for actor sheet.
	* todo: still to improve.
	* @returns
	*/
	_prepareLegacies() {
		return this.items.filter((item) => item.type === "legacy").sort((a, b) => a.name.localeCompare(b.name));
	}
	/**
	* Prepare inventory for beeing displayed on actor's sheet.
	* @returns
	*/
	_prepareInventory() {
		const sortModes = this.getFlag("degenesisnext", "inventorySortModes") || {};
		const groups = [
			"weapon",
			"armor",
			"modification",
			"transportation",
			"equipment"
		];
		const excludedTypes = [
			"cult",
			"culture",
			"concept",
			"potential",
			"legacy"
		];
		const inventoryMap = [...groups, "other"].reduce((acc, g) => (acc[g] = [], acc), {});
		for (const item of this.items) {
			if (excludedTypes.includes(item.type)) continue;
			if (groups.includes(item.type)) inventoryMap[item.type].push(item);
			else inventoryMap["other"].push(item);
		}
		return [...groups, "other"].map((group) => {
			const mode = sortModes[group] || "manual";
			const items = inventoryMap[group];
			items.sort((a, b) => {
				return mode === "alpha" ? a.name.localeCompare(b.name) : (a.sort || 0) - (b.sort || 0);
			});
			const labelKey = group === "other" ? "DEGENESIS.Other" : `TYPES.Item.${group}`;
			return {
				id: group,
				label: game.i18n.localize(labelKey),
				items,
				isAlpha: mode === "alpha",
				sortIcon: mode === "alpha" ? "fa-arrow-down-a-z" : "fa-sort"
			};
		});
	}
	/**
	* Create embedded item in actor.
	* @param {*} itemType
	* @returns
	*/
	async _createItem(itemType) {
		return ItemHelper.createActorItem(this, "", itemType, {});
	}
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
			definiton: { primary: {
				attribute,
				skill,
				actionNumber
			} }
		};
		await DGNSCombinationRollDialog.create(rollConfig);
	}
};
//#endregion
//#region src/module/documents/item.mjs
/** @import Item from '@common/documents/item.mjs*/
var DGNSItem = class extends Item {
	/**
	* Main data preparation loop. Do not override without specific purpose.
	*/
	prepareData() {
		super.prepareData();
	}
	/**
	* Base data peparation.
	*/
	prepareBaseData() {
		super.prepareBaseData();
	}
	/**
	* Preparing embedded documents.
	*/
	prepareEmbeddedDocuments() {
		super.prepareEmbeddedDocuments();
	}
	/**
	* Devied data preparation - this should be mostly used for presenting finished data.
	*/
	prepareDerivedData() {
		super.prepareDerivedData();
		if (this.system?.qualities) {}
		if (this.system?.modifications) this.system.modifications.used = 0;
	}
	async _manageQualities(action, qualityKey = null, field = null, value = null) {
		console.log(`Manage quality fired. ${action} | ${qualityKey} | ${field} | ${value}|`);
		if (!qualityKey) return;
		switch (action) {
			case "toggle": return this._toggleQuality(qualityKey);
			case "update": return this._updateQuality(qualityKey, field, value);
		}
	}
	async _toggleQuality(qualityKey) {
		if (!qualityKey) return;
		const quality = this.system.qualities.find((q) => q.key === qualityKey);
		let qualities = {};
		if (quality) {
			const newState = !quality.enabled;
			qualities = this.system.qualities.map((q) => q.key === qualityKey ? {
				...q,
				enabled: newState
			} : q);
		} else {
			const defaultValues = {};
			QUALITY_DEFINITIONS[qualityKey].inputs?.forEach((i) => defaultValues[i.name] = i.default);
			qualities = [...this.system.qualities, {
				key: qualityKey,
				enabled: true,
				values: defaultValues
			}];
		}
		await this.update({ "system.qualities": qualities });
	}
	async _updateQuality(qualityKey, field, value) {
		if (!qualityKey || !field || !value) return;
		const qualities = this.system.qualities.map((q) => {
			if (q.key !== qualityKey) return q;
			return {
				...q,
				values: {
					...q.values,
					[field]: value
				}
			};
		});
		return this.update({ "system.qualities": qualities });
	}
	/**
	* Preparing ActiveEffects for sheet.
	* @returns
	*/
	async _prepareEffects() {
		return await EffectHelper._prepareEffects(this);
	}
	/**
	* Handling effects for Item.
	* @param {*} action
	* @param {*} effectId
	* @returns
	*/
	async _manageEffect(action, effectId = null) {
		return await EffectHelper._manageEffect(this, action, effectId);
	}
	/**
	* Helper function for creating new effect.
	* @returns
	*/
	async _onCreateEffect() {
		return await EffectHelper._onCreateEffect(this);
	}
	/**
	* Return true if it is a weapon within melee range.
	*/
	get isMelee() {
		if (this.type === "weapon") return WEAPON_GROUPS_SKILLS[this.system.group] == "projectiles" || this.system.group == "sonic" ? false : true;
	}
	get isRanged() {
		if (this.type === "weapon") return WEAPON_GROUPS_SKILLS[this.system.group] == "projectiles" && this.group != "sonic";
	}
	get isSonic() {
		if (this.type = "weapon") return this.system.group == "sonic";
	}
};
ActiveEffect;
//#endregion
//#region src/module/data/fields/attribute-field.mjs
var { SchemaField: SchemaField$27, NumberField: NumberField$28, StringField: StringField$29, BooleanField: BooleanField$25, ArrayField: ArrayField$25, IntegerSortField: IntegerSortField$25 } = foundry.data.fields;
/** Default Rank field
*
* TODO: Think about requirements, items etc....
* TODO: Connections between ranks?
*
*/
var AttributeField = class extends SchemaField$27 {
	constructor(label, schemaOptions = {}, skills) {
		const fields = {
			value: new NumberField$28({
				nullable: false,
				integer: true,
				initial: 1,
				min: 1,
				label
			}),
			limit: new NumberField$28({
				nullable: false,
				integer: true,
				initial: 2,
				min: 0
			}),
			preffered: new BooleanField$25({ initial: false }),
			skills: skills || new SchemaField$27({})
		};
		super(fields, schemaOptions, skills);
	}
};
//#endregion
//#region src/module/data/fields/skill-field.mjs
var { SchemaField: SchemaField$26, NumberField: NumberField$27, StringField: StringField$28, BooleanField: BooleanField$24, ArrayField: ArrayField$24, IntegerSortField: IntegerSortField$24 } = foundry.data.fields;
/**
* Default Skill field
*/
var SkillField = class extends SchemaField$26 {
	constructor(attribute, label, schemaOptions = {}) {
		const fields = {
			attribute: new StringField$28({ initial: attribute }),
			value: new NumberField$27({
				nullable: false,
				integer: true,
				initial: 0,
				min: 0,
				label
			}),
			limit: new NumberField$27({
				nullable: false,
				integer: true,
				initial: 2,
				min: 0
			})
		};
		super(fields, schemaOptions);
	}
};
//#endregion
//#region src/module/data/actor/partials/attributes.skills.mjs
var { SchemaField: SchemaField$25, NumberField: NumberField$26, StringField: StringField$27, BooleanField: BooleanField$23, ArrayField: ArrayField$23, IntegerSortField: IntegerSortField$23 } = foundry.data.fields;
/** Helper class for setting entire standar Attribute / Skills structure. */
var AttributesSkillsFields = class {
	static get attributes() {
		const bodySkills = new SchemaField$25({
			athletics: new SkillField("body", "DGNS.Athletics"),
			brawl: new SkillField("body", "DGNS.Brawl"),
			force: new SkillField("body", "DGNS.Force"),
			melee: new SkillField("body", "DGNS.Melee"),
			stamina: new SkillField("body", "DGNS.Stamina"),
			toughness: new SkillField("body", "DGNS.Toughness")
		});
		const agilitySkills = new SchemaField$25({
			crafting: new SkillField("agility", "DGNS.Crafting"),
			dexterity: new SkillField("agility", "DGNS.Dexterity"),
			navigation: new SkillField("agility", "DGNS.Navigation"),
			mobility: new SkillField("agility", "DGNS.Mobility"),
			projectiles: new SkillField("agility", "DGNS.Projectiles"),
			stealth: new SkillField("agility", "DGNS.Stealth")
		});
		const charismaSkills = new SchemaField$25({
			arts: new SkillField("charisma", "DGNS.Arts"),
			conduct: new SkillField("charisma", "DGNS.Conduct"),
			expression: new SkillField("charisma", "DGNS.Expression"),
			leadership: new SkillField("charisma", "DGNS.Leadership"),
			negotiation: new SkillField("charisma", "DGNS.Negotiation"),
			seduction: new SkillField("charisma", "DGNS.Seduction")
		});
		const intellectSkills = new SchemaField$25({
			artifact: new SkillField("intellect", "DGNS.Artifact"),
			engineering: new SkillField("intellect", "DGNS.Engineering"),
			focus: new SkillField("intellect", "DGNS.Focus"),
			legends: new SkillField("intellect", "DGNS.Legends"),
			medicine: new SkillField("intellect", "DGNS.Medicine"),
			science: new SkillField("intellect", "DGNS.Science")
		});
		const psycheSkills = new SchemaField$25({
			cunning: new SkillField("psyche", "DGNS.Cunning"),
			deception: new SkillField("psyche", "DGNS.Deception"),
			domination: new SkillField("psyche", "DGNS.Domination"),
			faith: new SkillField("psyche", "DGNS.Faith"),
			reaction: new SkillField("psyche", "DGNS.Reaction"),
			willpower: new SkillField("psyche", "DGNS.Willpower")
		});
		const instinctSkills = new SchemaField$25({
			empathy: new SkillField("instinct", "DGNS.Empathy"),
			orienteering: new SkillField("instinct", "DGNS.Orienteering"),
			perception: new SkillField("instinct", "DGNS.Perception"),
			primal: new SkillField("instinct", "DGNS.Primal"),
			survival: new SkillField("instinct", "DGNS.Survival"),
			taming: new SkillField("instinct", "DGNS.Taming")
		});
		return { attributes: new SchemaField$25({
			body: new AttributeField({ label: "DGNS.Body" }, {}, bodySkills),
			agility: new AttributeField({ label: "DGNS.Agility" }, {}, agilitySkills),
			charisma: new AttributeField({ label: "DGNS.Charisma" }, {}, charismaSkills),
			intellect: new AttributeField({ label: "DGNS.Intellect" }, {}, intellectSkills),
			psyche: new AttributeField({ label: "DGNS.Psyche" }, {}, psycheSkills),
			instinct: new AttributeField({ label: "DGNS.Instinct" }, {}, instinctSkills)
		}) };
	}
	static get modes() {
		return { modes: new SchemaField$25({
			primalFocus: new StringField$27({
				label: "DGNS.PrimalFocus",
				initial: "primal",
				choices: ["primal", "focus"]
			}),
			faithWillpower: new StringField$27({
				label: "DGNS.FaithWillpower",
				initial: "faith",
				choices: ["faith", "willpower"]
			})
		}) };
	}
	/** Deprecated  */
	static get skills() {
		return { skills: new SchemaField$25({
			athletics: new SkillField("body", "DGNS.Athletics"),
			brawl: new SkillField("body", "DGNS.Brawl"),
			force: new SkillField("body", "DGNS.Force"),
			melee: new SkillField("body", "DGNS.Melee"),
			stamina: new SkillField("body", "DGNS.Stamina"),
			toughness: new SkillField("body", "DGNS.Toughness"),
			crafting: new SkillField("agility", "DGNS.Crafting"),
			dexterity: new SkillField("agility", "DGNS.Dexterity"),
			navigation: new SkillField("agility", "DGNS.Navigation"),
			mobility: new SkillField("agility", "DGNS.Mobility"),
			projectiles: new SkillField("agility", "DGNS.Projectiles"),
			stealth: new SkillField("agility", "DGNS.Stealth"),
			arts: new SkillField("charisma", "DGNS.Arts"),
			conduct: new SkillField("charisma", "DGNS.Conduct"),
			expression: new SkillField("charisma", "DGNS.Expression"),
			leadership: new SkillField("charisma", "DGNS.Leadership"),
			negotiation: new SkillField("charisma", "DGNS.Negotiation"),
			seduction: new SkillField("charisma", "DGNS.Seduction"),
			artifact: new SkillField("intellect", "DGNS.Artifact"),
			engineering: new SkillField("intellect", "DGNS.Engineering"),
			focus: new SkillField("intellect", "DGNS.Focus"),
			legends: new SkillField("intellect", "DGNS.Legends"),
			medicine: new SkillField("intellect", "DGNS.Medicine"),
			science: new SkillField("intellect", "DGNS.Science"),
			cunning: new SkillField("psyche", "DGNS.Cunning"),
			deception: new SkillField("psyche", "DGNS.Deception"),
			domination: new SkillField("psyche", "DGNS.Domination"),
			faith: new SkillField("psyche", "DGNS.Faith"),
			reaction: new SkillField("psyche", "DGNS.Reaction"),
			willpower: new SkillField("psyche", "DGNS.Willpower"),
			empathy: new SkillField("instinct", "DGNS.Empathy"),
			orienteering: new SkillField("instinct", "DGNS.Orienteering"),
			perception: new SkillField("instinct", "DGNS.Perception"),
			primal: new SkillField("instinct", "DGNS.Primal"),
			survival: new SkillField("instinct", "DGNS.Survival"),
			taming: new SkillField("instinct", "DGNS.Taming")
		}) };
	}
};
//#endregion
//#region src/module/data/actor/partials/condition.mjs
var { SchemaField: SchemaField$24, NumberField: NumberField$25, StringField: StringField$26, BooleanField: BooleanField$22, ArrayField: ArrayField$22, IntegerSortField: IntegerSortField$22 } = foundry.data.fields;
var ConditionFields = class {
	static get condition() {
		return { condition: new SchemaField$24({
			ego: new SchemaField$24({
				value: new NumberField$25({
					integer: true,
					initial: 0
				}),
				max: new NumberField$25({
					integer: true,
					initial: 0
				})
			}),
			spore: new SchemaField$24({
				value: new NumberField$25({
					integer: true,
					initial: 0
				}),
				max: new NumberField$25({
					integer: true,
					initial: 0
				}),
				permanent: new NumberField$25({
					integer: true,
					initial: 0
				})
			}),
			fleshwounds: new SchemaField$24({
				value: new NumberField$25({
					integer: true,
					initial: 0
				}),
				max: new NumberField$25({
					integer: true,
					initial: 0
				})
			}),
			trauma: new SchemaField$24({
				value: new NumberField$25({
					integer: true,
					initial: 0
				}),
				max: new NumberField$25({
					integer: true,
					initial: 0
				})
			})
		}) };
	}
};
//#endregion
//#region src/module/data/actor/partials/general.mjs
var { SchemaField: SchemaField$23, NumberField: NumberField$24, StringField: StringField$25, HTMLField: HTMLField$15, BooleanField: BooleanField$21, ArrayField: ArrayField$21, IntegerSortField: IntegerSortField$21 } = foundry.data.fields;
var GeneralFields$1 = class {
	static get general() {
		return { general: new SchemaField$23({
			movement: new NumberField$24({
				initial: 0,
				integer: true
			}),
			encumbrance: new SchemaField$23({
				max: new NumberField$24({
					initial: 0,
					integer: true
				}),
				current: new NumberField$24({
					initial: 0,
					integer: true
				})
			}),
			armor: new NumberField$24({
				initial: 0,
				integer: true
			}),
			actionModifier: new NumberField$24({
				initial: 0,
				integer: true
			})
		}) };
	}
	static get fighting() {
		return { fighting: new SchemaField$23({
			initiative: new NumberField$24({
				initial: 0,
				integer: true
			}),
			dodge: new NumberField$24({
				initial: 0,
				integer: true
			}),
			mentalDefense: new NumberField$24({
				initial: 0,
				integer: true
			}),
			passiveDefense: new NumberField$24({
				initial: 0,
				integer: true
			})
		}) };
	}
	static get state() {
		return { state: new SchemaField$23({
			motion: new BooleanField$21({ initial: false }),
			active: new BooleanField$21({ initial: false }),
			cover: new NumberField$24({
				initial: 0,
				min: 0,
				integer: true
			}),
			vision: new SchemaField$23({ mallus: new NumberField$24({ initial: 0 }) }),
			discomfort: new SchemaField$23({
				mallus: new NumberField$24({ initial: 0 }),
				negateUsed: new BooleanField$21({})
			}),
			initiative: new SchemaField$23({
				value: new NumberField$24({
					initial: 0,
					min: 0,
					integer: true
				}),
				actions: new NumberField$24({
					initial: 1,
					min: 1,
					integer: true
				})
			}),
			spentEgo: new SchemaField$23({
				value: new NumberField$24({
					initial: 0,
					min: 0,
					max: 3,
					integer: true
				}),
				actionBonus: new NumberField$24({
					initial: 0,
					min: 0,
					max: 3,
					integer: true
				})
			}),
			spentSpore: new SchemaField$23({
				value: new NumberField$24({
					initial: 0,
					min: 0,
					max: 3,
					integer: true
				}),
				actionBonus: new NumberField$24({
					initial: 0,
					min: 0,
					max: 3,
					integer: true
				})
			})
		}) };
	}
};
//#endregion
//#region src/module/data/actor/partials/details.mjs
var { SchemaField: SchemaField$22, NumberField: NumberField$23, StringField: StringField$24, HTMLField: HTMLField$14, BooleanField: BooleanField$20, ArrayField: ArrayField$20, IntegerSortField: IntegerSortField$20 } = foundry.data.fields;
/**
*
*
*
*
*/
var DetailsFields = class {
	static get details() {
		return { details: new SchemaField$22({
			age: new StringField$24({ label: "DGNS.Age" }),
			sex: new StringField$24({ label: "DGNS.Sex" }),
			height: new StringField$24({ label: "DGNS.Height" }),
			weight: new StringField$24({ label: "DGNS.Weight" }),
			experience: new SchemaField$22({
				current: new NumberField$23({
					integer: true,
					nullable: false,
					initial: 0
				}),
				spent: new NumberField$23({
					integer: true,
					nullable: false,
					initial: 0
				}),
				total: new NumberField$23({
					integer: true,
					nullable: false,
					initial: 0
				})
			})
		}) };
	}
	static get backrounds() {
		return { backgrounds: new SchemaField$22({
			allies: new NumberField$23({
				integer: true,
				nullable: false,
				initial: 0,
				min: 0,
				max: 6,
				label: "DGNS.Allies"
			}),
			authority: new NumberField$23({
				integer: true,
				nullable: false,
				initial: 0,
				min: 0,
				max: 6,
				label: "DGNS.Authority"
			}),
			network: new NumberField$23({
				integer: true,
				nullable: false,
				initial: 0,
				min: 0,
				max: 6,
				label: "DGNS.Network"
			}),
			renown: new NumberField$23({
				integer: true,
				nullable: false,
				initial: 0,
				min: 0,
				max: 6,
				label: "DGNS.Renown"
			}),
			resources: new NumberField$23({
				integer: true,
				nullable: false,
				initial: 0,
				min: 0,
				max: 6,
				label: "DGNS.Resources"
			}),
			secrets: new NumberField$23({
				integer: true,
				nullable: false,
				initial: 0,
				min: 0,
				max: 6,
				label: "DGNS.Secrets"
			})
		}) };
	}
	static get biography() {
		return {
			biography: new HTMLField$14({ label: "DGNS.Biography" }),
			ownerNotes: new HTMLField$14({ label: "DGNS.OwnerNotes" }),
			gmNotes: new HTMLField$14({ label: "DGNS.GMNotes" })
		};
	}
};
//#endregion
//#region src/module/data/actor/partials/identity.mjs
/** @import {SchemaField, ForeignDocumentField} from "@client/data/fields.mjs" */
/** @import { BaseItem } from "@client/documents/item.mjs"  */
/** @import { BaseActor } from "@client/documents/actor.mjs"  */
var { StringField: StringField$23, ForeignDocumentField: ForeignDocumentField$5 } = foundry.data.fields;
var { BaseItem: BaseItem$4, BaseActor: BaseActor$2 } = foundry.documents;
/** Culture / Concept / Cult / Custom Clan document fields */
var IdentityFields = class {
	static get identity() {
		return {
			cultureItem: new CachedReferenceField(BaseItem$4),
			conceptItem: new CachedReferenceField(BaseItem$4),
			cultItem: new CachedReferenceField(BaseItem$4),
			group: new ForeignDocumentField$5(BaseActor$2),
			rank: new StringField$23({ label: "DGNS.Rank" })
		};
	}
};
//#endregion
//#region src/module/data/actor/character.mjs
var { SchemaField: SchemaField$21, NumberField: NumberField$22, StringField: StringField$22, BooleanField: BooleanField$19, ArrayField: ArrayField$19, IntegerSortField: IntegerSortField$19 } = foundry.data.fields;
var CharacterData = class extends foundry.abstract.TypeDataModel {
	/** @inheritdoc */
	static _systemType = "character";
	static defineSchema() {
		return {
			...AttributesSkillsFields.attributes,
			...AttributesSkillsFields.modes,
			...GeneralFields$1.general,
			...GeneralFields$1.state,
			...GeneralFields$1.fighting,
			...ConditionFields.condition,
			...DetailsFields.details,
			...DetailsFields.backrounds,
			...DetailsFields.biography,
			...IdentityFields.identity
		};
	}
	/** @inheritdoc */
	prepareBaseData() {
		this.culture = CachedReferenceField.resolve(this.cultureItem);
		this.concept = CachedReferenceField.resolve(this.conceptItem);
		this.cult = CachedReferenceField.resolve(this.cultItem);
		this.actionNumbers = this.prepareActionNumbers();
	}
	/** @inheritdoc */
	/**
	* Sum attribute value with skill value. Base action number.
	* @returns {object} Object with skill names as properties.
	*/
	prepareActionNumbers() {
		let actionNumbers = {};
		for (let attribute in this.attributes) for (let skill in this.attributes[attribute].skills) actionNumbers[skill] = this.attributes[attribute].value + this.attributes[attribute].skills[skill].value;
		return actionNumbers;
	}
	/** Getter for primary chracter mode.  */
	get PrimalOrFocus() {
		return this.modes.primalFocus;
	}
	/** Getter for secondary chracter mode.  */
	get FaithOrWillpower() {
		return this.modes.faithWillpower;
	}
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
};
//#endregion
//#region src/module/data/fields/armor-field.mjs
var { SchemaField: SchemaField$20, NumberField: NumberField$21, StringField: StringField$21, BooleanField: BooleanField$18, ArrayField: ArrayField$18, IntegerSortField: IntegerSortField$18 } = foundry.data.fields;
var ArmorField = class extends SchemaField$20 {
	constructor(options = {}, schemaOptions = {}) {
		const fields = {
			name: new StringField$21({}),
			rating: new NumberField$21({
				integer: true,
				min: 0,
				initial: 0
			})
		};
		super(fields, schemaOptions);
	}
};
//#endregion
//#region src/module/data/actor/npc.mjs
var { SchemaField: SchemaField$19, NumberField: NumberField$20, StringField: StringField$20, BooleanField: BooleanField$17, ArrayField: ArrayField$17, IntegerSortField: IntegerSortField$17, HTMLField: HTMLField$13 } = foundry.data.fields;
var NPCData = class extends foundry.abstract.TypeDataModel {
	/** @inheritdoc */
	static _systemType = "npc";
	static defineSchema() {
		console.log(`Defining schema for NPC...`);
		return {
			...AttributesSkillsFields.attributes,
			...GeneralFields$1.general,
			...GeneralFields$1.state,
			...GeneralFields$1.fighting,
			...ConditionFields.condition,
			...DetailsFields.details,
			...DetailsFields.backrounds,
			...DetailsFields.biography,
			armor: new ArmorField(),
			tactics: new HTMLField$13({})
		};
	}
	prepareBaseData() {}
};
//#endregion
//#region src/module/data/actor/fromhell.mjs
var { SchemaField: SchemaField$18, StringField: StringField$19, HTMLField: HTMLField$12, NumberField: NumberField$19 } = foundry.data.fields;
var FromHellData = class extends foundry.abstract.TypeDataModel {
	/** @inheritdoc */
	static _systemType = "fromHell";
	static defineSchema() {
		return {
			...GeneralFields$1.general,
			...GeneralFields$1.state,
			...GeneralFields$1.fighting,
			...ConditionFields.condition,
			armor: new ArmorField(),
			tactics: new HTMLField$12({}),
			about: new HTMLField$12({})
		};
	}
	prepareBaseData() {}
};
//#endregion
//#region src/module/data/actor/aberrant.mjs
var { SchemaField: SchemaField$17, StringField: StringField$18, HTMLField: HTMLField$11, NumberField: NumberField$18 } = foundry.data.fields;
var AberrantData = class extends foundry.abstract.TypeDataModel {
	/** @inheritdoc */
	static _systemType = "aberrant";
	static defineSchema() {
		return {
			...AttributesSkillsFields.attributes,
			...GeneralFields$1.general,
			...GeneralFields$1.state,
			...GeneralFields$1.fighting,
			...ConditionFields.condition,
			...DetailsFields.details,
			...DetailsFields.backrounds,
			...DetailsFields.biography,
			armor: new ArmorField(),
			variant: new StringField$18({}),
			tactics: new HTMLField$11({}),
			rapture: new StringField$18({}),
			skinbags: new NumberField$18({
				integer: true,
				min: 0,
				initial: 0
			}),
			phase: new StringField$18({ initial: "primal" })
		};
	}
};
//#endregion
//#region src/module/data/actor/sleeper.mjs
var { SchemaField: SchemaField$16, NumberField: NumberField$17, StringField: StringField$17, BooleanField: BooleanField$16, ArrayField: ArrayField$16, IntegerSortField: IntegerSortField$16, HTMLField: HTMLField$10 } = foundry.data.fields;
var SleeperData = class extends foundry.abstract.TypeDataModel {
	/** @inheritdoc */
	static _systemType = "sleeper";
	static defineSchema() {
		return {
			...AttributesSkillsFields.attributes,
			...GeneralFields$1.general,
			...GeneralFields$1.state,
			...GeneralFields$1.fighting,
			...ConditionFields.condition,
			...DetailsFields.details,
			...DetailsFields.backrounds,
			...DetailsFields.biography,
			armor: new ArmorField(),
			tactics: new HTMLField$10({})
		};
	}
	prepareBaseData() {}
};
//#endregion
//#region src/module/data/actor/marauder.mjs
var { SchemaField: SchemaField$15, NumberField: NumberField$16, StringField: StringField$16, BooleanField: BooleanField$15, ArrayField: ArrayField$15, IntegerSortField: IntegerSortField$15, HTMLField: HTMLField$9 } = foundry.data.fields;
var MarauderData = class extends foundry.abstract.TypeDataModel {
	/** @inheritdoc */
	static _systemType = "marauder";
	static defineSchema() {
		return {
			...AttributesSkillsFields.attributes,
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
	prepareBaseData() {}
};
//#endregion
//#region src/module/data/actor/group.mjs
var { SchemaField: SchemaField$14, NumberField: NumberField$15, StringField: StringField$15, BooleanField: BooleanField$14, ArrayField: ArrayField$14, SetField, ForeignDocumentField: ForeignDocumentField$4, IntegerSortField: IntegerSortField$14 } = foundry.data.fields;
var { BaseItem: BaseItem$3, BaseActor: BaseActor$1 } = foundry.documents;
var GroupData = class extends foundry.abstract.TypeDataModel {
	/** @inheritdoc */
	static _systemType = "group";
	static defineSchema() {
		return {
			name: new StringField$15({}),
			members: new ArrayField$14(new SchemaField$14({ actor: new ForeignDocumentField$4(BaseActor$1, {
				nullable: true,
				idOnly: false
			}) })),
			alignment: new StringField$15({})
		};
	}
	prepareBaseData() {}
};
//#endregion
//#region src/module/data/actor/_module.mjs
var config$1 = {
	character: CharacterData,
	npc: NPCData,
	fromhell: FromHellData,
	aberrant: AberrantData,
	sleeper: SleeperData,
	marauder: MarauderData,
	group: GroupData
};
//#endregion
//#region src/module/data/item/partials/general.mjs
var { SchemaField: SchemaField$13, NumberField: NumberField$14, StringField: StringField$14, HTMLField: HTMLField$8, BooleanField: BooleanField$13, ObjectField, ArrayField: ArrayField$13, ForeignDocumentField: ForeignDocumentField$3, IntegerSortField: IntegerSortField$13, DocumentIdField: DocumentIdField$8, FilePathField } = foundry.data.fields;
var { BaseItem: BaseItem$2 } = foundry.documents;
var GeneralFields = class {
	static get subtitle() {
		return { subtitle: new StringField$14({ label: "DGNS.Subtitle" }) };
	}
	static get description() {
		return { description: new HTMLField$8({ label: "DGNS.Description" }) };
	}
	static get textSections() {
		return { textSections: new ArrayField$13(new fields.HTMLField({
			required: false,
			blank: true,
			label: "DGNS.TextSection"
		})) };
	}
	static get backgroundImage() {
		return { backgroundImage: new FilePathField({
			categories: ["IMAGE"],
			blank: true,
			default: null,
			label: "DGNS.BackgroundImage"
		}) };
	}
	static get group() {
		return { group: new StringField$14({ label: "DGNS.Group" }) };
	}
	static get weaponGroup() {
		return { group: new StringField$14({
			label: "DGNS.Group",
			choices: WEAPON_GROUPS,
			required: false,
			blank: true
		}) };
	}
	static get rules() {
		return { rules: new StringField$14({ label: "DGNS.Rules" }) };
	}
	static get effect() {
		return { effect: new HTMLField$8({ label: "DGNS.Effect" }) };
	}
	static get equipped() {
		return { equipped: new BooleanField$13({ default: false }) };
	}
	static get dropped() {
		return { dropped: new BooleanField$13({ default: false }) };
	}
	static get prerequisite() {
		return { prerequisite: new StringField$14({ label: "DGNS.Prerequisite" }) };
	}
	/** Deprected - do not use.  */
	static get slots() {
		return { slots: new SchemaField$13({
			total: new NumberField$14({}),
			used: new NumberField$14({})
		}) };
	}
	static get qualities() {
		return { qualities: new ArrayField$13(new SchemaField$13({
			key: new StringField$14({ required: true }),
			enabled: new BooleanField$13({ initial: true }),
			values: new ObjectField({ initial: {} })
		}), { initial: [] }) };
	}
	static get quantity() {
		return { quantity: new NumberField$14({
			label: "DGNS.Quantity",
			initial: 1,
			integer: true,
			min: 0
		}) };
	}
	static get value() {
		return { value: new NumberField$14({
			label: "DGNS.Value",
			initial: 0,
			integer: true,
			min: 0
		}) };
	}
	static get encumbrance() {
		return { encumbrance: new NumberField$14({
			label: "DGNS.Encumbrance",
			initial: 0,
			integer: true,
			min: 0
		}) };
	}
	static get tech() {
		return { tech: new NumberField$14({
			label: "DGNS.Tech",
			initial: 1,
			min: 0
		}) };
	}
	static get resources() {
		return { resources: new NumberField$14({
			label: "DGNS.Resources",
			initial: 0,
			min: 0,
			integer: true
		}) };
	}
	static get cult() {
		return { cult: new StringField$14({ label: "DGNS.Cult" }) };
	}
	/** Containers / location reference  */
	static get location() {
		return { location: new ForeignDocumentField$3(BaseItem$2, {
			idOnly: true,
			required: false,
			nullable: true,
			initial: null
		}) };
	}
	static get modifications() {
		return { modifications: new SchemaField$13({
			slots: new NumberField$14({
				min: 0,
				integer: true,
				initial: 0
			}),
			installed: new ArrayField$13(new ForeignDocumentField$3(BaseItem$2, {
				idOnly: false,
				required: false,
				nullable: true
			}), { initial: [] })
		}) };
	}
};
//#endregion
//#region src/module/data/item/partials/identity.bonus.mjs
var { SchemaField: SchemaField$12, NumberField: NumberField$13, StringField: StringField$13, BooleanField: BooleanField$12, ArrayField: ArrayField$12, IntegerSortField: IntegerSortField$12 } = foundry.data.fields;
var IdentityBonusFields = class {
	static get attributeBonus() {
		return { attrBonus: new ArrayField$12(new SchemaField$12({
			attribute: new StringField$13({
				label: "DGNS.Attribute",
				choices: DEGENESIS.attributes
			}),
			max: new NumberField$13({
				nullable: true,
				integer: true,
				positive: true
			})
		})) };
	}
	static get skillBonus() {
		return { skillBonus: new ArrayField$12(new SchemaField$12({
			skill: new StringField$13({
				label: "DGNS.Skill",
				choices: DEGENESIS.skills
			}),
			max: new NumberField$13({
				nullable: true,
				integer: true,
				positive: true
			})
		})) };
	}
	static get commonCults() {
		return { commonCults: new ArrayField$12(new StringField$13({ label: "DGNS.Cult" })) };
	}
};
//#endregion
//#region src/module/data/item/culture.mjs
var { SchemaField: SchemaField$11, NumberField: NumberField$12, StringField: StringField$12, BooleanField: BooleanField$11, ArrayField: ArrayField$11, IntegerSortField: IntegerSortField$11 } = foundry.data.fields;
var CultureData = class extends foundry.abstract.TypeDataModel {
	static _sync = true;
	static _systemType = "culture";
	static defineSchema() {
		return {
			...GeneralFields.subtitle,
			...GeneralFields.description,
			...GeneralFields.backgroundImage,
			...IdentityBonusFields.commonCults,
			...IdentityBonusFields.attributeBonus,
			...IdentityBonusFields.skillBonus
		};
	}
	get isSyncable() {
		return this.constructor._sync;
	}
};
//#endregion
//#region src/module/data/item/concept.mjs
var { SchemaField: SchemaField$10, NumberField: NumberField$11, StringField: StringField$11, BooleanField: BooleanField$10, ArrayField: ArrayField$10, IntegerSortField: IntegerSortField$10 } = foundry.data.fields;
var ConceptData = class extends foundry.abstract.TypeDataModel {
	static _sync = true;
	static _systemType = "concept";
	static defineSchema() {
		return {
			...GeneralFields.description,
			...GeneralFields.backgroundImage,
			...IdentityBonusFields.attributeBonus,
			...IdentityBonusFields.skillBonus
		};
	}
	get isSyncable() {
		return this.constructor._sync;
	}
};
//#endregion
//#region src/module/data/item/cult.mjs
var { SchemaField: SchemaField$9, NumberField: NumberField$10, StringField: StringField$10, BooleanField: BooleanField$9, ArrayField: ArrayField$9, IntegerSortField: IntegerSortField$9 } = foundry.data.fields;
var CultData = class extends foundry.abstract.TypeDataModel {
	static _sync = true;
	static _systemType = "cult";
	static defineSchema() {
		return {
			isClan: new BooleanField$9({ initial: false }),
			...GeneralFields.description,
			...GeneralFields.backgroundImage,
			...IdentityBonusFields.skillBonus
		};
	}
	get isSyncable() {
		return this.constructor._sync;
	}
};
//#endregion
//#region src/module/data/item/legacy.mjs
var { SchemaField: SchemaField$8, NumberField: NumberField$9, StringField: StringField$9, HTMLField: HTMLField$7, BooleanField: BooleanField$8, ArrayField: ArrayField$8, IntegerSortField: IntegerSortField$8, DocumentIdField: DocumentIdField$7 } = foundry.data.fields;
var LegacyData = class extends foundry.abstract.TypeDataModel {
	static _systemType = "legacy";
	static defineSchema() {
		return {
			...GeneralFields.prerequisite,
			legacy: new StringField$9({ label: "DGNS.Legacy" }),
			drawback: new StringField$9({ label: "DGNS.Drawback" }),
			bonus: new StringField$9({ label: "DGNS.Bonus" })
		};
	}
};
//#endregion
//#region src/module/data/fields/formula-field.mjs
var { SchemaField: SchemaField$7, NumberField: NumberField$8, StringField: StringField$8, BooleanField: BooleanField$7, ArrayField: ArrayField$7, IntegerSortField: IntegerSortField$7 } = foundry.data.fields;
var FormulaField = class extends StringField$8 {};
//#endregion
//#region src/module/data/item/partials/combat.mjs
var { SchemaField: SchemaField$6, NumberField: NumberField$7, StringField: StringField$7, HTMLField: HTMLField$6, BooleanField: BooleanField$6, ArrayField: ArrayField$6, ForeignDocumentField: ForeignDocumentField$2, IntegerSortField: IntegerSortField$6, DocumentIdField: DocumentIdField$6 } = foundry.data.fields;
var { BaseItem: BaseItem$1, BaseActor } = foundry.documents;
var CombatFields = class {
	static get damage() {
		return { damage: new SchemaField$6({
			value: new NumberField$7({
				label: "DGNS.DamageValue",
				initial: 0,
				integer: true
			}),
			type: new StringField$7({ label: "DGNS.DamageType" }),
			bonus: new StringField$7({ label: "DGNS.DamageBonus" })
		}) };
	}
	/**
	* Do not use!
	* @deprecated
	*/
	static get damageBonus() {
		return { damageBonus: new SchemaField$6({ formula: new FormulaField({ label: "DGNS.DamageBonusFormula" }) }) };
	}
	static get armorPoints() {
		return { armorPoints: new NumberField$7({
			label: "DGNS.ArmorPoints",
			initial: 0,
			min: 0,
			integer: true
		}) };
	}
	static get handling() {
		return { handling: new NumberField$7({
			label: "DGNS.Handling",
			initial: 0,
			integer: true
		}) };
	}
	static get distance() {
		return { distance: new SchemaField$6({
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
		}) };
	}
	static get skills() {
		return { skills: new SchemaField$6({
			primary: new StringField$7({ label: "DGNS.PrimarySkill" }),
			secondary: new StringField$7({ label: "DGNS.SecondarySkill" })
		}) };
	}
	static get ammunition() {
		return { ammunition: new SchemaField$6({
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
			loaded: new ForeignDocumentField$2(BaseItem$1, {
				nullable: true,
				idOnly: false
			}),
			current: new NumberField$7({})
		}) };
	}
};
//#endregion
//#region src/module/data/item/ammunition.mjs
var AmmunitionData = class extends foundry.abstract.TypeDataModel {
	static _systemType = "ammunition";
	static defineSchema() {
		return {
			...GeneralFields.description,
			...GeneralFields.quantity,
			...GeneralFields.equipped,
			...GeneralFields.dropped,
			...GeneralFields.tech,
			...GeneralFields.value,
			...CombatFields.damage
		};
	}
};
//#endregion
//#region src/module/data/item/armor.mjs
var ArmorData = class extends foundry.abstract.TypeDataModel {
	static _systemType = "armor";
	static defineSchema() {
		return {
			...GeneralFields.description,
			...GeneralFields.quantity,
			...GeneralFields.encumbrance,
			...GeneralFields.equipped,
			...GeneralFields.dropped,
			...GeneralFields.qualities,
			...GeneralFields.slots,
			...GeneralFields.tech,
			...GeneralFields.resources,
			...GeneralFields.value,
			...GeneralFields.cult,
			...CombatFields.armorPoints
		};
	}
};
//#endregion
//#region src/module/data/item/burn.mjs
var { SchemaField: SchemaField$5, NumberField: NumberField$6, StringField: StringField$6, HTMLField: HTMLField$5, BooleanField: BooleanField$5, ArrayField: ArrayField$5, IntegerSortField: IntegerSortField$5, DocumentIdField: DocumentIdField$5 } = foundry.data.fields;
var BurnData = class extends foundry.abstract.TypeDataModel {
	static _systemType = "burn";
	static defineSchema() {
		return {
			chakra: new StringField$6({ label: "DGNS.Chakra" }),
			earthChakra: new StringField$6({ label: "DGNS.EarthChakra" }),
			...GeneralFields.description,
			...GeneralFields.effect,
			...GeneralFields.rules,
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
};
//#endregion
//#region src/module/data/item/complication.mjs
var { NumberField: NumberField$5, StringField: StringField$5 } = foundry.data.fields;
var ComplicationData = class extends foundry.abstract.TypeDataModel {
	static _systemType = "complication";
	static defineSchema() {
		return {
			...GeneralFields.description,
			cost: new StringField$5({ label: "DGNS.ComplicationCost" }),
			rating: new NumberField$5({
				label: "DGNS.Level",
				initial: 1,
				min: 1,
				integer: true
			})
		};
	}
};
//#endregion
//#region src/module/data/item/equipment.mjs
var EquipmentData = class extends foundry.abstract.TypeDataModel {
	static _systemType = "equipment";
	static defineSchema() {
		return {
			...GeneralFields.description,
			...GeneralFields.quantity,
			...GeneralFields.encumbrance,
			...GeneralFields.tech,
			...GeneralFields.value,
			...GeneralFields.resources,
			...GeneralFields.cult,
			...GeneralFields.effect,
			...GeneralFields.group,
			...GeneralFields.dropped
		};
	}
};
//#endregion
//#region src/module/data/item/modification.mjs
var { SchemaField: SchemaField$4, NumberField: NumberField$4, StringField: StringField$4, HTMLField: HTMLField$4, BooleanField: BooleanField$4, ArrayField: ArrayField$4, IntegerSortField: IntegerSortField$4, DocumentIdField: DocumentIdField$4, ForeignDocumentField: ForeignDocumentField$1 } = foundry.data.fields;
var { BaseItem } = foundry.documents;
var ModData = class extends foundry.abstract.TypeDataModel {
	static _systemType = "modification";
	static defineSchema() {
		return {
			...GeneralFields.description,
			...GeneralFields.effect,
			...GeneralFields.value,
			...GeneralFields.qualities,
			type: new StringField$4({
				label: "DGNS.ModType",
				initial: "melee",
				choices: Modification.type
			}),
			requirement: new StringField$4({ label: "DGNS.requirement" }),
			mounted: new ForeignDocumentField$1(BaseItem, {
				idOnly: false,
				required: false,
				nullable: true
			}),
			slotcost: new NumberField$4({
				label: "DGNS.SlotCost",
				initial: 1,
				min: 0,
				integer: true
			})
		};
	}
};
//#endregion
//#region src/module/data/item/phenomenon.mjs
var { SchemaField: SchemaField$3, NumberField: NumberField$3, StringField: StringField$3, HTMLField: HTMLField$3, BooleanField: BooleanField$3, ArrayField: ArrayField$3, IntegerSortField: IntegerSortField$3, DocumentIdField: DocumentIdField$3 } = foundry.data.fields;
var PhenomenonData = class extends foundry.abstract.TypeDataModel {
	static _systemType = "phenomenon";
	static defineSchema() {
		return {
			...GeneralFields.description,
			...GeneralFields.rules,
			rapture: new StringField$3({ label: "DGNS.Rapture" }),
			level: new NumberField$3({
				label: "DGNS.Level",
				initial: 1,
				min: 0,
				integer: true
			})
		};
	}
};
//#endregion
//#region src/module/data/item/potential.mjs
var { SchemaField: SchemaField$2, NumberField: NumberField$2, StringField: StringField$2, HTMLField: HTMLField$2, BooleanField: BooleanField$2, ArrayField: ArrayField$2, IntegerSortField: IntegerSortField$2, DocumentIdField: DocumentIdField$2 } = foundry.data.fields;
var PotentialData = class extends foundry.abstract.TypeDataModel {
	static _systemType = "potential";
	static defineSchema() {
		return {
			...GeneralFields.prerequisite,
			...GeneralFields.rules,
			...GeneralFields.effect,
			origin: new StringField$2({ initial: "None" }),
			isAction: new BooleanField$2({ initial: false }),
			level: new NumberField$2({
				label: "DGNS.Level",
				initial: 1,
				min: 1,
				integer: true
			})
		};
	}
};
//#endregion
//#region src/module/data/item/shield.mjs
var { SchemaField: SchemaField$1, NumberField: NumberField$1, StringField: StringField$1, HTMLField: HTMLField$1, BooleanField: BooleanField$1, ArrayField: ArrayField$1, IntegerSortField: IntegerSortField$1, DocumentIdField: DocumentIdField$1 } = foundry.data.fields;
var ShieldData = class extends foundry.abstract.TypeDataModel {
	static _systemType = "shield";
	static defineSchema() {
		return {
			...GeneralFields.description,
			...GeneralFields.equipped,
			...GeneralFields.dropped,
			...GeneralFields.quantity,
			...GeneralFields.qualities,
			...GeneralFields.encumbrance,
			...GeneralFields.tech,
			...GeneralFields.slots,
			...GeneralFields.value,
			...GeneralFields.resources,
			...GeneralFields.cult,
			attack: new SchemaField$1({ diceMod: new NumberField$1({
				integer: true,
				initial: 0
			}) }),
			defense: new SchemaField$1({
				diceMod: new NumberField$1({
					integer: true,
					initial: 0
				}),
				passive: new NumberField$1({
					integer: true,
					initial: 0
				})
			})
		};
	}
};
//#endregion
//#region src/module/data/item/_base.mjs
/**
* Base item mixin for physical equipment.
*/
var BaseItemData = class extends foundry.abstract.TypeDataModel {
	static defineSchema() {
		return {
			...GeneralFields.location,
			...GeneralFields.description,
			...GeneralFields.dropped,
			...GeneralFields.quantity,
			...GeneralFields.tech,
			...GeneralFields.resources,
			...GeneralFields.cult,
			...GeneralFields.encumbrance,
			...GeneralFields.value
		};
	}
	/** Generic handling for dropping equipped items.  */
	_preUpdate(changed, options, user) {
		if (super._preUpdate(changed, options, user) === false) return false;
		if ("equipped" in this) {
			if (changed.system?.dropped === true) changed.system.equipped = false;
			if (changed.system?.equipped === true) changed.system.dropped = false;
		}
		return true;
	}
};
//#endregion
//#region src/module/data/item/transportation.mjs
var { SchemaField, NumberField, StringField, HTMLField, BooleanField, ArrayField, IntegerSortField, DocumentIdField, ForeignDocumentField } = foundry.data.fields;
var TransportationData = class extends BaseItemData {
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
			items: new ArrayField(new LocalDocumentField(foundry.documents.BaseItem, { idOnly: false }), { initial: [] })
		};
	}
	prepareBaseData() {
		super.prepareBaseData();
	}
	get items() {
		return this.items.map((item) => item()).filter((i) => !!i);
	}
};
//#endregion
//#region src/module/data/item/weapon.mjs
var WeaponData = class extends BaseItemData {
	static _systemType = "weapon";
	static defineSchema() {
		return {
			...super.defineSchema(),
			...GeneralFields.equipped,
			...GeneralFields.qualities,
			...GeneralFields.modifications,
			...GeneralFields.resources,
			...GeneralFields.cult,
			...GeneralFields.weaponGroup,
			...CombatFields.damage,
			...CombatFields.handling,
			...CombatFields.distance,
			...CombatFields.ammunition,
			...CombatFields.skills
		};
	}
};
//#endregion
//#region src/module/data/item/_module.mjs
var config = {
	culture: CultureData,
	concept: ConceptData,
	cult: CultData,
	legacy: LegacyData,
	ammunition: AmmunitionData,
	armor: ArmorData,
	burn: BurnData,
	complication: ComplicationData,
	equipment: EquipmentData,
	modification: ModData,
	phenomenon: PhenomenonData,
	potential: PotentialData,
	shield: ShieldData,
	transportation: TransportationData,
	weapon: WeaponData
};
//#endregion
//#region src/degenesis.mjs
var { Actors, Items } = foundry.documents.collections;
var { ActorSheet, ItemSheet } = foundry.appv1.sheets;
globalThis.degenesis = { applications: _module_exports };
CONFIG.DEGENESIS = DEGENESIS;
CONFIG.Dice.rolls = [Roll, DGNSRoll];
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
	globalThis.degenesis = game.degenesis = Object.assign(game.system, globalThis.degenesis);
	console.log("%cDEGENESIS%c | Initializing", "color: #ed1d27", "color: unset");
	document.onkeydown = function(e) {
		if (e.keyCode == 123) console.log("%cDEGENESIS%c | Welcome, Chronicler", "color: #ed1d27", "color: unset");
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
		}
	});
	Items.registerSheet("degenesis", DegenesisConceptSheet, {
		types: ["concept"],
		makeDefault: true,
		label: "TYPES.Item.TypeConceptSheet",
		themes: {
			dark: "SETTINGS.UI.FIELDS.colorScheme.dark",
			light: "SETTINGS.UI.FIELDS.colorScheme.light"
		}
	});
	Items.registerSheet("degenesis", DegenesisCultSheet, {
		types: ["cult"],
		makeDefault: true,
		label: "TYPES.Item.TypeCultSheet",
		themes: {
			dark: "SETTINGS.UI.FIELDS.colorScheme.dark",
			light: "SETTINGS.UI.FIELDS.colorScheme.light"
		}
	});
	Items.registerSheet("degenesis", DegenesisWeaponSheet, {
		types: ["weapon"],
		makeDefault: true,
		label: "TYPES.Item.TypeWeaponSheet",
		themes: {
			dark: "SETTINGS.UI.FIELDS.colorScheme.dark",
			light: "SETTINGS.UI.FIELDS.colorScheme.light"
		}
	});
	Items.registerSheet("degenesis", DegenesisModificationSheet, {
		types: ["modification"],
		makeDefault: true,
		label: "TYPES.Item.TypeModificationSheet",
		themes: {
			dark: "SETTINGS.UI.FIELDS.colorScheme.dark",
			light: "SETTINGS.UI.FIELDS.colorScheme.light"
		}
	});
	Items.registerSheet("degenesis", DegenesisPotentialSheet, {
		types: ["potential"],
		makeDefault: true,
		label: "TYPES.Item.TypePotentialSheet",
		themes: {
			dark: "SETTINGS.UI.FIELDS.colorScheme.dark",
			light: "SETTINGS.UI.FIELDS.colorScheme.light"
		}
	});
	Items.registerSheet("degenesis", DegenesisLegacySheet, {
		types: ["legacy"],
		makeDefault: true,
		label: "TYPES.Item.TypeLegacySheet",
		themes: {
			dark: "SETTINGS.UI.FIELDS.colorScheme.dark",
			light: "SETTINGS.UI.FIELDS.colorScheme.light"
		}
	});
	_module_default();
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
	for (let group in DEGENESIS) for (let key in DEGENESIS[group]) if (typeof DEGENESIS[group][key] == "string") DEGENESIS[group][key] = game.i18n.localize(DEGENESIS[group][key]);
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
			fonts: [{ urls: ["systems/degenesisnext/fonts/CrimsonPro-Variable.ttf", "systems/degenesisnext/fonts/-Italic-Variable.ttf"] }]
		},
		Montserrat: {
			editor: true,
			fonts: [{ urls: ["systems/degenesisnext/fonts/Montserrat-Variable.ttf", "systems/degenesisnext/fonts/Montserrat-Italic-Variable.ttf"] }]
		}
	};
}
//#endregion
