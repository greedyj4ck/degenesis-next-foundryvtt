import { CALIBERS } from "../../../logic/config/items.mjs";
import FormulaField from "../../fields/formula-field.mjs";

const {
  SchemaField,
  NumberField,
  StringField,
  HTMLField,
  BooleanField,
  ArrayField,
  ForeignDocumentField,
  IntegerSortField,
  DocumentIdField,
} = foundry.data.fields;

const { BaseItem, BaseActor } = foundry.documents;

export default class CombatFields {
  static get damage() {
    return {
      damage: new SchemaField({
        value: new NumberField({
          label: "DGNS.DamageValue",
          initial: 0,
          integer: true,
        }),
        type: new StringField({ label: "DGNS.DamageType" }),
        bonus: new StringField({ label: "DGNS.DamageBonus" }),
      }),
    };
  }

  /**
   * Do not use!
   * @deprecated
   */
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

  static get skills() {
    return {
      skills: new SchemaField({
        primary: new StringField({ label: "DGNS.PrimarySkill" }),
        secondary: new StringField({ label: "DGNS.SecondarySkill" }),
      }),
    };
  }

  static get ammunition() {
    return {
      ammunition: new SchemaField({
        caliber: new StringField({
          label: "DGNS.Caliber",
          choices: CALIBERS,
          blank: true,
          initial: "",
        }),
        magazine: new SchemaField({
          size: new NumberField({}),
          belt: new BooleanField({ default: false }),
        }),
        // Ammo item link.
        loaded: new ForeignDocumentField(BaseItem, {
          nullable: true,
          idOnly: false,
        }),
        current: new NumberField({}),
      }),
    };
  }
}
