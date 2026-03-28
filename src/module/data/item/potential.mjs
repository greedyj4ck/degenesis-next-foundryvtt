import GeneralFields from "./partials/general.mjs";

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

export default class PotentialData extends foundry.abstract.TypeDataModel {
  static _systemType = "potential";

  static defineSchema() {
    return {
      ...GeneralFields.prerequisite,
      ...GeneralFields.rules,
      ...GeneralFields.effect,

      origin: new StringField({ initial: "None" }),

      isAction: new BooleanField({ initial: false }),
      level: new NumberField({
        label: "DGNS.Level",
        initial: 1,
        min: 1,
        integer: true,
      }),
    };
  }
}
