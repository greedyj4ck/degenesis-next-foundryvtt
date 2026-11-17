export const SKILLS_DEFINITION = {
  athletics: { label: "DGNS.SKILL.athletics" },
  brawl: { label: "DGNS.SKILL.brawl" },
  force: { label: "DGNS.SKILL.force" },
  melee: { label: "DGNS.SKILL.melee" },
  stamina: { label: "DGNS.SKILL.stamina" },
  toughness: { label: "DGNS.SKILL.toughness" },
  crafting: { label: "DGNS.SKILL.crafting" },
  dexterity: { label: "DGNS.SKILL.dexterity" },
  navigation: { label: "DGNS.SKILL.navigation" },
  mobility: { label: "DGNS.SKILL.mobility" },
  projectiles: { label: "DGNS.SKILL.projectiles" },
  leadership: { label: "DGNS.SKILL.leadership" },
  negotiation: { label: "DGNS.SKILL.negotiation" },
  seduction: { label: "DGNS.SKILL.seduction" },
  artifact: { label: "DGNS.SKILL.artifact" },
  engineering: { label: "DGNS.SKILL.engineering" },
  focus: { label: "DGNS.SKILL.focus" },
  legends: { label: "DGNS.SKILL.legends" },
  medicine: { label: "DGNS.SKILL.medicine" },
  science: { label: "DGNS.SKILL.science" },
  cunning: { label: "DGNS.SKILL.cunning" },
  deception: { label: "DGNS.SKILL.deception" },
  domination: { label: "DGNS.SKILL.domination" },
  faith: { label: "DGNS.SKILL.faith" },
  reaction: { label: "DGNS.SKILL.reaction" },
  willpower: { label: "DGNS.SKILL.willpower" },
  empathy: { label: "DGNS.SKILL.empathy" },
  orienteering: { label: "DGNS.SKILL.orienteering" },
  perception: { label: "DGNS.SKILL.perception" },
  primal: { label: "DGNS.SKILL.primal" },
  survival: { label: "DGNS.SKILL.survival" },
  taming: { label: "DGNS.SKILL.taming" },
};

let cache = null;

export const Skills = {
  get list() {
    cache ??= Object.entries(SKILLS_DEFINITION)
      .map(([key, def]) => ({ key, value: key, ...def })) // value = selectOptions default attr
      .sort((a, b) =>
        game.i18n.localize(a.label).localeCompare(game.i18n.localize(b.label)),
      );
    return cache;
  },
};
