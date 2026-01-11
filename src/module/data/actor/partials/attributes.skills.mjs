const {
  SchemaField,
  NumberField,
  StringField,
  BooleanField,
  ArrayField,
  IntegerSortField,
} = foundry.data.fields;

import AttributeField from "../../fields/attribute-field.mjs";
import SkillField from "../../fields/skill-field.mjs";

/** Helper class for setting entire standar Attribute / Skills structure. */
export default class AttributesSkillsFields {
  static get attributes() {
    const bodySkills = new SchemaField({
      athletics: new SkillField("body", "DGNS.Athletics"),
      brawl: new SkillField("body", "DGNS.Brawl"),
      force: new SkillField("body", "DGNS.Force"),
      melee: new SkillField("body", "DGNS.Melee"),
      stamina: new SkillField("body", "DGNS.Stamina"),
      toughness: new SkillField("body", "DGNS.Toughness"),
    });

    const agilitySkills = new SchemaField({
      crafting: new SkillField("agility", "DGNS.Crafting"),
      dexterity: new SkillField("agility", "DGNS.Dexterity"),
      navigation: new SkillField("agility", "DGNS.Navigation"),
      mobility: new SkillField("agility", "DGNS.Mobility"),
      projectiles: new SkillField("agility", "DGNS.Projectiles"),
      stealth: new SkillField("agility", "DGNS.Stealth"),
    });

    const charismaSkills = new SchemaField({
      arts: new SkillField("charisma", "DGNS.Arts"),
      conduct: new SkillField("charisma", "DGNS.Conduct"),
      expression: new SkillField("charisma", "DGNS.Expression"),
      leadership: new SkillField("charisma", "DGNS.Leadership"),
      negotiation: new SkillField("charisma", "DGNS.Negotiation"),
      seduction: new SkillField("charisma", "DGNS.Seduction"),
    });

    const intellectSkills = new SchemaField({
      artifact: new SkillField("intellect", "DGNS.Artifact"),
      engineering: new SkillField("intellect", "DGNS.Engineering"),
      focus: new SkillField("intellect", "DGNS.Focus"),
      legends: new SkillField("intellect", "DGNS.Legends"),
      medicine: new SkillField("intellect", "DGNS.Medicine"),
      science: new SkillField("intellect", "DGNS.Science"),
    });

    const psycheSkills = new SchemaField({
      cunning: new SkillField("psyche", "DGNS.Cunning"),
      deception: new SkillField("psyche", "DGNS.Deception"),
      domination: new SkillField("psyche", "DGNS.Domination"),
      faith: new SkillField("psyche", "DGNS.Faith"),
      reaction: new SkillField("psyche", "DGNS.Reaction"),
      willpower: new SkillField("psyche", "DGNS.Willpower"),
    });

    const instinctSkills = new SchemaField({
      empathy: new SkillField("instinct", "DGNS.Empathy"),
      orienteering: new SkillField("instinct", "DGNS.Orienteering"),
      perception: new SkillField("instinct", "DGNS.Perception"),
      primal: new SkillField("instinct", "DGNS.Primal"),
      survival: new SkillField("instinct", "DGNS.Survival"),
      taming: new SkillField("instinct", "DGNS.Taming"),
    });

    return {
      attributes: new SchemaField({
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
        ),
      }),
    };
  }

  static get modes() {
    return {
      modes: new SchemaField({
        primalFocus: new StringField({
          label: "DGNS.PrimalFocus",
          initial: "primal",
          choices: ["primal", "focus"],
        }),
        faithWillpower: new StringField({
          label: "DGNS.FaithWillpower",
          initial: "faith",
          choices: ["faith", "willpower"],
        }),
      }),
    };
  }

  /** Deprecated  */
  static get skills() {
    return {
      skills: new SchemaField({
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
        taming: new SkillField("instinct", "DGNS.Taming"),
      }),
    };
  }
}
