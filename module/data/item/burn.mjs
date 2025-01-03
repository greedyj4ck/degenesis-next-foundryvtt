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

/* TODO: 
 Effects should be automated modifiers! 
*/

export default class BurnData extends foundry.abstract.TypeDataModel {
  static _systemType = "burn";

  static defineSchema() {
    return {
      chakra: new StringField({
        label: "DGNS.Chakra",
      }),

      earthChakra: new StringField({
        label: "DGNS.EarthChakra",
      }),
      ...GeneralFields.description,
      ...GeneralFields.effect,
      ...GeneralFields.rules,

      cost: new SchemaField({
        weak: new NumberField({
          label: "DGNS.Weak",
          initial: 0,
          min: 0,
          integer: true,
        }),
        potent: new NumberField({
          label: "DGNS.Potent",
          initial: 0,
          min: 0,
          integer: true,
        }),
      }),
    };
  }
}
