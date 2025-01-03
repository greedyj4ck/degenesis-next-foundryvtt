import FormulaField from "../../fields/formula-field.mjs";

const {
  SchemaField,
  NumberField,
  StringField,
  HTMLField,
  BooleanField,
  ArrayField,
  IntegerSortField,
  DocumentIdField,
} = foundry.data.fields;

export default class CombatFields {
  static get damage() {
    return {
      damage: new SchemaField({
        value: new NumberField({
          label: "DGNS.DamageValue",
          initial: 0,
          integer: true,
          positive: true,
        }),
        type: new StringField({ label: "DGNS.DamageType" }),
      }),
    };
  }

  static get damageBonus() {
    return {
      damageBonus: new SchemaField({
        formula: new FormulaField({
          label: "DGNS.DamageBonusFormula",
        }),
      }),
    };
  }

  static get armorPoints() {
    return {
      armorPoints: new NumberField({
        label: "DGNS.ArmorPoints",
        initial: 0,
        min: 0,
        integer: true,
      }),
    };
  }

  static get handling() {
    return {
      handling: new NumberField({
        label: "DGNS.Handling",
        initial: 0,
        integer: true,
      }),
    };
  }

  static get distance() {
    return {
      distance: new SchemaField({
        melee: new NumberField({
          label: "DGNS.MeleeDistance",
          integer: true,
          min: 0,
          initial: 1,
        }),
        short: new NumberField({
          label: "DGNS.ShortDistance",
          integer: true,
          min: 0,
          initial: 0,
        }),
        far: new NumberField({
          label: "DGNS.FarDistance",
          integer: true,
          min: 0,
          initial: 0,
        }),
      }),
    };
  }

  static get magazine() {
    return {
      magazine: new ArrayField(
        new SchemaField({
          ammo: new DocumentIdField({}),
          size: new NumberField({}),
          current: new NumberField({}),
          use: new NumberField({}),
          belt: new BooleanField({ default: false }),
        })
      ),
    };
  }

  static get skills() {
    return {
      skills: new SchemaField({
        primary: new StringField({ label: "DGNS.PrimarySkill" }),
        secondary: new StringField({ label: "DGNS.SecondarySkill" }),
      }),
    };
  }

  static get caliber() {
    return {
      caliber: new StringField({
        label: "DGNS.Caliber",
      }),
    };
  }
}
