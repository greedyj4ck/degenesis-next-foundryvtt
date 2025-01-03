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
export default class PhenomenonData extends foundry.abstract.TypeDataModel {
  static _systemType = "phenomenon";

  static defineSchema() {
    return {
      ...GeneralFields.description,
      ...GeneralFields.rules,

      rapture: new StringField({
        label: "DGNS.Rapture",
      }),

      level: new NumberField({
        label: "DGNS.Level",
        initial: 1,
        min: 0,
        integer: true,
      }),
    };
  }
}
