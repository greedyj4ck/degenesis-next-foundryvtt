import GeneralFields from "./partials/general.mjs";
import IdentityBonusFields from "./partials/identity.bonus.mjs";

const {
  SchemaField,
  NumberField,
  StringField,
  BooleanField,
  ArrayField,
  IntegerSortField,
} = foundry.data.fields;

export default class CultData extends foundry.abstract.TypeDataModel {
  static _systemType = "cult";

  static defineSchema() {
    return {
      ...GeneralFields.description,
      ...GeneralFields.backgroundImage,
      ...IdentityBonusFields.skillBonus,
    };
  }
}
