const { ActiveEffectTypeDataModel } = foundry.data;

const { StringField } = foundry.data.fields;

/**
 *
 */

export class DGNSBaseEffectData extends ActiveEffectTypeDataModel {
  static defineSchema() {
    const schema = super.defineSchema();

    // !moved to separate data model
    /*  schema.target = new StringField({
      required: true,
      initial: "actor",
      choices: ["actor", "item"],
    }); */

    return schema;
  }
}
