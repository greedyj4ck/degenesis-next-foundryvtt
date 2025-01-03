/*
 * Mods should be items with ActiveEffects and then linked to Weapons by Foreign
 */

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

import GeneralFields from "./partials/general.mjs";

export default class ModData extends foundry.abstract.TypeDataModel {
  static _systemType = "mod";

  static defineSchema() {
    return {
      ...GeneralFields.description,
      ...GeneralFields.effect,
      ...GeneralFields.qualities,
      type: new StringField({
        label: "DGNS.ModType",
        initial: "weapon",
      }),
      slotCost: new NumberField({
        label: "DGNS.Slot",
        initial: 1,
        min: 0,
        integer: true,
      }),
    };
  }
}
