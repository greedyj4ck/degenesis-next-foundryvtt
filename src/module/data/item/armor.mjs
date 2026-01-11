import GeneralFields from "./partials/general.mjs";
import CombatFields from "./partials/combat.mjs";

export default class ArmorData extends foundry.abstract.TypeDataModel {
  static _systemType = "armor";

  static defineSchema() {
    return {
      ...GeneralFields.description,
      ...GeneralFields.quantity,
      ...GeneralFields.encumbrance,
      ...GeneralFields.equipped,
      ...GeneralFields.dropped,
      ...GeneralFields.qualities,
      ...GeneralFields.slots,
      ...GeneralFields.tech,
      ...GeneralFields.resources,
      ...GeneralFields.value,
      ...GeneralFields.cult,
      ...CombatFields.armorPoints,
    };
  }
}
