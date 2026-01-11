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

export default class ShieldData extends foundry.abstract.TypeDataModel {
  static _systemType = "shield";

  static defineSchema() {
    return {
      ...GeneralFields.description,
      ...GeneralFields.equipped,
      ...GeneralFields.dropped,
      ...GeneralFields.quantity,
      ...GeneralFields.qualities,
      ...GeneralFields.encumbrance,
      ...GeneralFields.tech,
      ...GeneralFields.slots,
      ...GeneralFields.value,
      ...GeneralFields.resources,
      ...GeneralFields.cult,

      attack: new SchemaField({
        diceMod: new NumberField({ integer: true, initial: 0 }),
      }),

      defense: new SchemaField({
        diceMod: new NumberField({ integer: true, initial: 0 }),
        passive: new NumberField({ integer: true, initial: 0 }),
      }),
    };
  }
}
