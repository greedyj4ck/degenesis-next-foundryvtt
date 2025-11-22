const {
  SchemaField,
  NumberField,
  StringField,
  HTMLField,
  BooleanField,
  ArrayField,
  IntegerSortField,
  DocumentIdField,
  FilePathField,
} = foundry.data.fields;

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
        })
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

  static get rules() {
    return {
      rules: new StringField({ label: "DGNS.Rules" }),
    };
  }

  static get effect() {
    return {
      effect: new StringField({ label: "DGNS.Effect" }),
    };
  }

  static get equipped() {
    return {
      equipped: new BooleanField({ default: false }),
    };
  }

  /*   static get physicalItem() {
    return {
      origin: new StringField({ label: "DGNS.Origin" }),
      cult: new StringField({ label: "DGNS.Cult" }),
      quantity: new NumberField({ label: "DGNS.Quantity" }),
      encumbrance: new NumberField({ label: "DGNS.Encumbrance" }),
      value: new NumberField({ label: "DGNS.Value" }),
      tech: new NumberField({ label: "DGNS.Tech" }),
      resources: new NumberField({ label: "DGNS.Resources" }),
      location: new DocumentIdField({ blank: true }),
      dropped: new BooleanField({ default: false }),
    };
  } */

  static get prerequisite() {
    return {
      prerequisite: new StringField({ label: "DGNS.Prerequisite" }),
    };
  }

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
          name: new StringField({}),
          values: new ArrayField(
            new SchemaField({
              name: new StringField({}),
              value: new StringField({}),
            })
          ),
        })
      ),
    };
  }

  static get quantity() {
    return {
      quantity: new NumberField({
        label: "DGNS.Quantity",
        initial: 1,
        positive: true,
        min: 0,
      }),
    };
  }

  static get value() {
    return {
      quantity: new NumberField({
        label: "DGNS.Value",
        initial: 0,
        positive: true,
        min: 0,
      }),
    };
  }

  static get encumbrance() {
    return {
      quantity: new NumberField({
        label: "DGNS.Encumbrance",
        initial: 0,
        positive: true,
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
      tech: new NumberField({
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
}
