import GeneralFields from "./partials/general.mjs";

export default class EquipmentData extends foundry.abstract.TypeDataModel {
  static _systemType = "equipment";

  static defineSchema() {
    return {
      ...GeneralFields.description,
      ...GeneralFields.quantity,
      ...GeneralFields.encumbrance,
      ...GeneralFields.tech,
      ...GeneralFields.value,
      ...GeneralFields.resources,
      ...GeneralFields.cult,
      ...GeneralFields.effect,
      ...GeneralFields.group,
    };
  }
}
