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

export default class TransportationData extends foundry.abstract.TypeDataModel {
  static _systemType = "transportation";

  static defineSchema() {
    return {
      ...GeneralFields.description,
      ...GeneralFields.encumbrance,
      ...GeneralFields.tech,
      ...GeneralFields.value,
      ...GeneralFields.resources,
      ...GeneralFields.cult,

      mode: new NumberField({
        label: "DGNS.Mode",
        initial: 0,
        min: 0,
        integer: true,
      }),

      droppable: new BooleanField({ default: false }),
      dropped: new BooleanField({ default: false }),

      container: new ArrayField(new DocumentIdField({})),
    };
  }
}
