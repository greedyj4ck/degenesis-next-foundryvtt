const {
  SchemaField,
  NumberField,
  StringField,
  BooleanField,
  ArrayField,
  IntegerSortField,
} = foundry.data.fields;

export default class ArmorField extends SchemaField {
  constructor(options = {}, schemaOptions = {}) {
    const fields = {
      name: new StringField({}),
      rating: new NumberField({ integer: true, min: 0, initial: 0 }),
    };

    super(fields, schemaOptions);
  }
}
