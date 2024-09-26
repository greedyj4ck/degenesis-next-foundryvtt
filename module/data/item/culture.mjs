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

export default class CultureData extends foundry.abstract.TypeDataModel {
  static _systemType = "culture";

  static defineSchema() {
    return {
      ...GeneralFields.description,
      ...IdentityBonusFields.attributeBonus,
      ...IdentityBonusFields.skillBonus,
    };
  }
}
