import AttributesSkillsFields from "./partials/attributes.skills.mjs";
import ConditionFields from "./partials/condition.mjs";
import DetailsFields from "./partials/details.mjs";
import GeneralFields from "./partials/general.mjs";
import ArmorField from "../fields/armor-field.mjs";

const {
  SchemaField,
  NumberField,
  StringField,
  BooleanField,
  ArrayField,
  IntegerSortField,
  HTMLField,
} = foundry.data.fields;

export default class MarauderData extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static _systemType = "marauder";

  static defineSchema() {
    return {
      ...AttributesSkillsFields.attributes,
      ...AttributesSkillsFields.skills,
      ...GeneralFields.general,
      ...GeneralFields.state,
      ...GeneralFields.fighting,
      ...ConditionFields.condition,
      ...DetailsFields.details,
      ...DetailsFields.backrounds,
      ...DetailsFields.biography,
      armor: new ArmorField(),
      tactics: new HTMLField({}),
    };
  }

  prepareBaseData() {}
}
