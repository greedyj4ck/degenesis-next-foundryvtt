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

export default class ConceptData extends foundry.abstract.TypeDataModel {
  static _sync = true;
  static _systemType = "concept";

  static defineSchema() {
    return {
      ...GeneralFields.description,
      ...GeneralFields.backgroundImage,
      ...IdentityBonusFields.attributeBonus,
      ...IdentityBonusFields.skillBonus,
    };
  }

  get isSyncable() {
    return this.constructor._sync;
  }
}
