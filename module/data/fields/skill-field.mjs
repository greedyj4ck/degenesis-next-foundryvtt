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
      // Link to attribute
      attribute: new StringField({ initial: attribute }),
      //Current value
      value: new NumberField({
        nullable: false,
        integer: true,
        initial: 0,
        min: 0,
        label: label,
      }),
      // Limit during creation
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
