/*
 * Design:
 * Mods should be items with ActiveEffects and then linked to Weapons by ForeignDocumentField.
 */
import GeneralFields from "./partials/general.mjs";
import { Modification } from "../../logic/modification.mjs";

const {
  SchemaField,
  NumberField,
  StringField,
  HTMLField,
  BooleanField,
  ArrayField,
  IntegerSortField,
  DocumentIdField,
  DocumentUUIDField,
  ForeignDocumentField,
} = foundry.data.fields;

const { BaseItem } = foundry.documents;

export default class ModData extends foundry.abstract.TypeDataModel {
  static _systemType = "modification";

  static defineSchema() {
    return {
      ...GeneralFields.description,
      ...GeneralFields.effect,
      ...GeneralFields.value,
      ...GeneralFields.qualities,

      type: new StringField({
        label: "DGNS.ModType",
        initial: "melee",
        choices: Modification.type,
      }),

      requirement: new StringField({
        label: "DGNS.requirement",
      }),

      // ItemId of document where mod is beeing used.
      // !deprecated, due to compendiums link should be severed?
      mounted: new DocumentUUIDField({
        nullable: true,
      }),

      slotCost: new NumberField({
        label: "DGNS.SlotCost",
        initial: 1,
        min: 0,
        integer: true,
      }),
    };
  }
}
