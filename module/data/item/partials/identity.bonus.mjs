import DEGENESIS from "../../../config.mjs";

const {
  SchemaField,
  NumberField,
  StringField,
  BooleanField,
  ArrayField,
  IntegerSortField,
} = foundry.data.fields;

export default class IdentityBonusFields {
  static get attributeBonus() {
    return {
      attrBonus: new ArrayField(
        new SchemaField({
          attribute: new StringField({
            label: "DGNS.Attribute",
            choices: DEGENESIS.attributes,
          }),
          max: new NumberField({
            nullable: true,
            integer: true,
            positive: true,
          }),
        })
      ),
    };
  }

  static get skillBonus() {
    return {
      skillBonus: new ArrayField(
        new SchemaField({
          skill: new StringField({
            label: "DGNS.Skill",
            choices: DEGENESIS.skills,
          }),
          max: new NumberField({
            nullable: true,
            integer: true,
            positive: true,
          }),
        })
      ),
    };
  }
}
