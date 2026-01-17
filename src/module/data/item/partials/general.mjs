import { WEAPON_GROUPS } from "../../../logic/config/items.mjs";

const {
  SchemaField,
  NumberField,
  StringField,
  HTMLField,
  BooleanField,
  ObjectField,
  ArrayField,
  ForeignDocumentField,
  IntegerSortField,
  DocumentIdField,
  FilePathField,
} = foundry.data.fields;

const { BaseItem } = foundry.documents;

export default class GeneralFields {
  static get subtitle() {
    return {
      subtitle: new StringField({ label: "DGNS.Subtitle" }),
    };
  }

  static get description() {
    return {
      description: new HTMLField({ label: "DGNS.Description" }),
    };
  }

  static get textSections() {
    return {
      textSections: new ArrayField(
        new fields.HTMLField({
          required: false,
          blank: true,
          label: "DGNS.TextSection",
        }),
      ),
    };
  }

  static get backgroundImage() {
    return {
      backgroundImage: new FilePathField({
        categories: ["IMAGE"],
        blank: true,
        default: null,
        label: "DGNS.BackgroundImage",
      }),
    };
  }

  static get group() {
    return {
      group: new StringField({ label: "DGNS.Group" }),
    };
  }

  static get weaponGroup() {
    return {
      group: new StringField({
        label: "DGNS.Group",
        choices: WEAPON_GROUPS,
        required: false,
        blank: true,
      }),
    };
  }

  static get rules() {
    return {
      rules: new StringField({ label: "DGNS.Rules" }),
    };
  }

  static get effect() {
    return {
      effect: new HTMLField({ label: "DGNS.Effect" }),
    };
  }

  static get equipped() {
    return {
      equipped: new BooleanField({ default: false }),
    };
  }

  static get dropped() {
    return {
      equipped: new BooleanField({ default: false }),
    };
  }

  static get prerequisite() {
    return {
      prerequisite: new StringField({ label: "DGNS.Prerequisite" }),
    };
  }

  /** Deprected - do not use.  */
  static get slots() {
    return {
      slots: new SchemaField({
        total: new NumberField({}),
        used: new NumberField({}),
      }),
    };
  }

  static get qualities() {
    return {
      qualities: new ArrayField(
        new SchemaField({
          key: new StringField({ required: true }), //quality object key
          enabled: new BooleanField({ initial: true }), // toggling state
          values: new ObjectField({ initial: {} }),
        }),
      ),
    };
  }

  static get quantity() {
    return {
      quantity: new NumberField({
        label: "DGNS.Quantity",
        initial: 1,
        integer: true,
        min: 0,
      }),
    };
  }

  static get value() {
    return {
      value: new NumberField({
        label: "DGNS.Value",
        initial: 0,
        integer: true,
        min: 0,
      }),
    };
  }

  static get encumbrance() {
    return {
      encumbrance: new NumberField({
        label: "DGNS.Encumbrance",
        initial: 0,
        integer: true,
        min: 0,
      }),
    };
  }

  static get tech() {
    return {
      tech: new NumberField({
        label: "DGNS.Tech",
        initial: 1,
        min: 0,
      }),
    };
  }

  static get resources() {
    return {
      resources: new NumberField({
        label: "DGNS.Resources",
        initial: 0,
        min: 0,
        integer: true,
      }),
    };
  }

  static get cult() {
    return {
      cult: new StringField({
        label: "DGNS.Cult",
      }),
    };
  }

  /** Containers / location reference  */
  static get location() {
    return {
      location: new ForeignDocumentField(BaseItem, {
        idOnly: true,
        required: false,
        nullable: true,
        initial: null,
      }),
    };
  }

  static get modifications() {
    return {
      modifications: new SchemaField({
        slots: new NumberField({ min: 0, integer: true, initial: 0 }), // amount of slots for an object
        installed: new ArrayField(
          new ForeignDocumentField(BaseItem, {
            idOnly: false,
            required: false,
            nullable: true,
          }),
          { initial: [] },
        ),
      }),
    };
  }
}
