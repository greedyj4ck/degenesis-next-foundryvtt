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

export default class LegacyData extends foundry.abstract.TypeDataModel {
  static _systemType = "legacy";

  static defineSchema() {
    return {
      ...GeneralFields.prerequisite,

      legacy: new StringField({
        label: "DGNS.Legacy",
      }),

      drawback: new StringField({
        label: "DGNS.Drawback",
      }),

      bonus: new StringField({
        label: "DGNS.Bonus",
      }),
    };
  }
}
