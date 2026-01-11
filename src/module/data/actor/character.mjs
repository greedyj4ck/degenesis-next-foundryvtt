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

  // *------------------------*

  static defineSchema() {
    return {
      ...AttributesSkillsFields.attributes, // Basic attributes and skills
      ...AttributesSkillsFields.modes, // Primal / Focus and Faith / Willpower Flags
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

  // *------------------------*

  /** @inheritdoc */
  prepareBaseData() {
    // Resolving CacheReferenceFields into properties.
    this.culture = CachedReferenceField.resolve(this.cultureItem);
    this.concept = CachedReferenceField.resolve(this.conceptItem);
    this.cult = CachedReferenceField.resolve(this.cultItem);
    this.actionNumbers = this.prepareActionNumbers();
  }

  // *------------------------*

  /** @inheritdoc */
  /*   prepareDerivedData() {
    console.log(`Character | DataModel | prepareDerivedData`);
  } */
  // async _preUpdate(changes, options, user) { }

  //#endergion

  //#region Preparing data helpers
  // *========================================*

  /**
   * Sum attribute value with skill value. Base action number.
   * @returns {object} Object with skill names as properties.
   */
  prepareActionNumbers() {
    let actionNumbers = {};

    for (let attribute in this.attributes) {
      for (let skill in this.attributes[attribute].skills) {
        actionNumbers[skill] =
          this.attributes[attribute].value +
          this.attributes[attribute].skills[skill].value;
      }
    }
    return actionNumbers;
  }
  // *------------------------*

  //#region Helper methods
  // *------------------------*

  /** Getter for primary chracter mode.  */
  get PrimalOrFocus() {
    return this.modes.primalFocus;
  }

  // *------------------------*

  /** Getter for secondary chracter mode.  */
  get FaithOrWillpower() {
    return this.modes.faithWillpower;
  }

  //todo: move methods to Actor document
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
