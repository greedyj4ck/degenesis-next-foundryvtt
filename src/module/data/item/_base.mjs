import GeneralFields from "./partials/general.mjs";

/**
 * Base item mixin for physical equipment.
 */

export class BaseItemData extends foundry.abstract.TypeDataModel {
  static defineSchema() {
    return {
      ...GeneralFields.location, // containers
      ...GeneralFields.description,
      ...GeneralFields.dropped,
      ...GeneralFields.quantity,
      ...GeneralFields.tech,
      ...GeneralFields.resources,
      ...GeneralFields.cult,
      ...GeneralFields.encumbrance,
      ...GeneralFields.value,
    };
  }

  /** Generic handling for dropping equipped items.  */
  _preUpdate(changed, options, user) {
    const res = super._preUpdate(changed, options, user);

    if (res === false) return false;

    // Only if item is equippable
    if ("equipped" in this) {
      if (changed.system?.dropped === true) {
        changed.system.equipped = false;
      }

      if (changed.system?.equipped === true) {
        changed.system.dropped = false;
      }
    }

    return true;
  }
}
