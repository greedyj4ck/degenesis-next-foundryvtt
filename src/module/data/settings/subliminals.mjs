const {
  SchemaField,
  NumberField,
  StringField,
  BooleanField,
  ArrayField,
  IntegerSortField,
} = foundry.data.fields;

export default class SubliminalsSettingsData
  extends foundry.abstract.DataModel
{
  static defineSchema() {
    const fields = foundry.data.fields;
    return {
      show: new BooleanField({
        label: "Show Subliminals during scene transitions.",
        initial: false,
      }),
    };
  }
}
