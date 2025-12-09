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
  static _sync = true;
  static _systemType = "cult";

  static defineSchema() {
    return {
      isClan: new BooleanField({ initial: false }), // added instead another character field
      ...GeneralFields.description,
      ...GeneralFields.backgroundImage,
      ...IdentityBonusFields.skillBonus,
    };
  }

  get isSyncable() {
    return this.constructor._sync;
  }
}
