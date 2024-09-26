const {
  SchemaField,
  NumberField,
  StringField,
  HTMLField,
  BooleanField,
  ArrayField,
  IntegerSortField,
} = foundry.data.fields;

export default class GeneralFields {
  static get description() {
    return {
      description: new StringField({ label: "DGNS.Description" }),
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

  static get physicalItem() {
    return {
      origin: new StringField({ label: "DGNS.Origin" }),
      cult: new StringField({ label: "DGNS.Cult" }),
      quantity: new NumberField({ label: "DGNS.Quantity" }),
      value: new NumberField({ label: "DGNS.Value" }),
      tech: new NumberField({ label: "DGNS.Tech" }),
      resources: new NumberField({ label: "DGNS.Resources" }),
    };
  }
}
