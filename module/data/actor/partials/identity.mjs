import LocalDocumentField from "../../fields/local-document-field.mjs";

const {
  SchemaField,
  NumberField,
  StringField,
  BooleanField,
  ArrayField,
  IntegerSortField,
} = foundry.data.fields;

/** Culture / Concept / Cult / Custom Clan document fields */

export default class IdentityFields {
  static get identity() {
    return {
      culture: new LocalDocumentField(foundry.documents.BaseItem, {
        required: false,
        fallback: true,
        label: "DGNS.Culture",
      }),
      concept: new LocalDocumentField(foundry.documents.BaseItem, {
        required: false,
        fallback: true,
        label: "DGNS.Concept",
      }),
      cult: new LocalDocumentField(foundry.documents.BaseItem, {
        required: false,
        fallback: true,
        label: "DGNS.Cult",
      }),
      clan: new LocalDocumentField(foundry.documents.BaseItem, {
        required: false,
        fallback: true,
        label: "DGNS.Clan",
      }),
    };
  }
}
