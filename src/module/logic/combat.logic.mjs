/**
 * rollTypes:
 * - weaponAttack: attack that utilizes weapon
 * - attack
 */

export const Combat = {
  weaponActions: {
    melee: [
      {
        key: "attack",
        label: "DGNS.COMBAT.action.attack",
        rollType: "attack",
      },
      { key: "parry", label: "DGNS.COMBAT.action.parry", rollType: "parry" },
      { key: "disarm", label: "DGNS.COMBAT.action.disarm", rollType: "disarm" },
    ],
    ranged: [
      {
        key: "effectiveShot",
        label: "DGNS.COMBAT.action.effective",
        rollType: "attack",
        modifiers: { d: 0 },
      },
      {
        key: "farShot",
        label: "DGNS.COMBAT.action.far",
        rollType: "attack",
        modifiers: { d: -2 },
      },
      {
        key: "extremeShot",
        label: "DGNS.COMBAT.action.extreme",
        rollType: "attack",
        modifiers: { d: -4 },
      },
      { key: "disarm", label: "DGNS.COMBAT.action.disarm", rollType: "disarm" },
    ],

    sonic: [],
  },

  combatActions: {
    general: [
      {
        key: "initiative",
        label: "DGNS.COMBAT.action.initiative",
        rollType: "initiative",
        skill: "reaction",
      },
    ],
    attack: [
      {
        key: "bite",
        skill: "brawl",
        label: "DGNS.COMBAT.action.bite",
        rollType: "brawl",
      },
      {
        key: "kick",
        skill: "brawl",
        label: "DGNS.COMBAT.action.kick",
        rollType: "brawl",
      },
      {
        key: "blow",
        skill: "brawl",
        label: "DGNS.COMBAT.action.blow",
        rollType: "brawl",
      },
      {
        key: "sneak",
        skill: "stealth",
        label: "DGNS.COMBAT.action.sneak",
        rollType: "sneak",
      },
      {
        key: "feint",
        skill: "cunning",
        label: "DGNS.COMBAT.action.feint",
        rollType: "feint",
      },
    ],
    defense: [
      {
        key: "dodge",
        skill: "mobility",
        label: "DGNS.COMBAT.action.dodge",
        rollType: "activeDefense",
      },
      {
        key: "parry",
        skill: "brawl",
        label: "DGNS.COMBAT.action.parry",
        rollType: "parry",
      },
      {
        key: "mental",
        skill: "mobility",
        label: "DGNS.COMBAT.action.mental",
        rollType: "mentalDefense",
      },
    ],
  },
};
