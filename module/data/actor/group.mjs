const {
  SchemaField,
  NumberField,
  StringField,
  BooleanField,
  ArrayField,
  SetField,
  ForeignDocumentField,
  IntegerSortField,
} = foundry.data.fields;

const { BaseItem, BaseActor } = foundry.documents;

export default class GroupData extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static _systemType = "group";

  static defineSchema() {
    return {
      name: new StringField({}),
      members: new ArrayField(
        new SchemaField({
          actor: new ForeignDocumentField(BaseActor, {
            nullable: true,
            idOnly: false, // Returns full Item document
          }),
        })
      ),

      alignment: new StringField({}),
    };
  }

  prepareBaseData() {}
}
