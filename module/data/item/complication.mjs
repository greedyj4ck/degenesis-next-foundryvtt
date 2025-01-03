import GeneralFields from "./partials/general.mjs";

const { NumberField, StringField } = foundry.data.fields;

export default class ComplicationData extends foundry.abstract.TypeDataModel {
  static _systemType = "complication";

  static defineSchema() {
    return {
      ...GeneralFields.description,
      cost: new StringField({
        label: "DGNS.ComplicationCost",
      }),
      rating: new NumberField({
        label: "DGNS.Level",
        initial: 1,
        min: 1,
        integer: true,
      }),
    };
  }
}
