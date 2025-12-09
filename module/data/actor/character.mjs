/* Data fields definitions imports */
import AttributesSkillsFields from "./partials/attributes.skills.mjs";
import ConditionFields from "./partials/condition.mjs";
import GeneralFields from "./partials/general.mjs";
import DetailsFields from "./partials/details.mjs";
import IdentityFields from "./partials/identity.mjs";

import CachedReferenceField from "../fields/cached-reference-field.mjs";

const {
  SchemaField,
  NumberField,
  StringField,
  BooleanField,
  ArrayField,
  IntegerSortField,
} = foundry.data.fields;

export default class CharacterData extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static _systemType = "character";

  static defineSchema() {
    return {
      ...AttributesSkillsFields.attributes,
      //...AttributesSkillsFields.skills,
      ...GeneralFields.general,
      ...GeneralFields.state,
      ...GeneralFields.fighting,
      ...ConditionFields.condition,
      ...DetailsFields.details,
      ...DetailsFields.backrounds,
      ...DetailsFields.biography,
      ...IdentityFields.identity, // Culture, concept, class items UUID reference
    };
  }

  /** @inheritdoc */
  prepareBaseData() {
    // Resolving CacheReferenceFields into properties.
    this.culture = CachedReferenceField.resolve(this.cultureItem);
    this.concept = CachedReferenceField.resolve(this.conceptItem);
    this.cult = CachedReferenceField.resolve(this.cultItem);
  }

  /** @inheritdoc */
  /*   prepareDerivedData() {
    console.log(`Character | DataModel | prepareDerivedData`);
  } */
  // async _preUpdate(changes, options, user) { }

  //#endergion

  //todo: move methods to Actor document
  //#region Helper methods
  async removeLinkedItem(itemType) {
    await CachedReferenceField.removeLinked(`${itemType}Item`, this.parent);
  }

  /**
   * Combine saving linked reference and creating cached document.
   * @param {*} path
   * @param {*} itemId
   */
  async setLinkedItem(path, itemId) {
    await this.parent.update({ [`system.${path}.linked`]: itemId });
  }
  async setCulture(itemId) {
    await this.setLinkedItem("cultureItem", itemId);
  }
  async setConcept(itemId) {
    await this.setLinkedItem("conceptItem", itemId);
  }
  async setCult(itemId) {
    await this.setLinkedItem("cultItem", itemId);
  }

  //#endregion
}
