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

export default class RankField extends SchemaField {
  constructor(options = {}, schemaOptions = {}) {
    const fields = {
      uniqueKey: new StringField({}),
      name: new StringField({}),
      description: new StringField({}),
      level: new NumberField({}),
      // prerequisiste: new ArrayField({}),
      // result: new ArrayField({}),
      // equipment: new ArrayField({}),
      nextRankKeys: new ArrayField(new StringField({})),
    };

    super(fields, schemaOptions);
  }
}
