const {
  SchemaField,
  NumberField,
  StringField,
  BooleanField,
  ArrayField,
  IntegerSortField,
} = foundry.data.fields;

/**
 * Default Skill field
 */

export default class SkillField extends SchemaField {
  constructor(attribute, label, schemaOptions = {}) {
    const fields = {
      attribute: new StringField({ initial: attribute }),
      value: new NumberField({
        nullable: false,
        integer: true,
        initial: 0,
        min: 0,
        label: label,
      }),
      limit: new NumberField({
        nullable: false,
        integer: true,
        initial: 2,
        min: 0,
      }),
    };

    super(fields, schemaOptions);
  }
}
