const {
  SchemaField,
  NumberField,
  StringField,
  BooleanField,
  ArrayField,
  IntegerSortField,
} = foundry.data.fields;

/** Default Rank field
 *
 * TODO: Think about requirements, items etc....
 * TODO: Connections between ranks?
 *
 */

export default class AttributeField extends SchemaField {
  constructor(label, schemaOptions = {}, skills) {
    const fields = {
      value: new NumberField({
        nullable: false,
        integer: true,
        initial: 1,
        min: 1,
        label: label,
      }),
      limit: new NumberField({
        nullable: false,
        integer: true,
        initial: 2,
        min: 0,
      }),
      preffered: new BooleanField({ initial: false }),
      skills: skills || new SchemaField({}),
    };

    super(fields, schemaOptions, skills);
  }
}
