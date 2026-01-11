import { BaseItemData } from "./_base.mjs";
import LocalDocumentField from "../fields/local-document-field.mjs";
import GeneralFields from "./partials/general.mjs";

const {
  SchemaField,
  NumberField,
  StringField,
  HTMLField,
  BooleanField,
  ArrayField,
  IntegerSortField,
  DocumentIdField,
  ForeignDocumentField,
} = foundry.data.fields;

export default class TransportationData extends BaseItemData {
  static _systemType = "transportation";

  static defineSchema() {
    return {
      ...super.defineSchema(),

      mode: new NumberField({
        label: "DGNS.Mode",
        initial: 0,
        min: 0,
        integer: true,
      }),

      items: new ArrayField(
        new LocalDocumentField(foundry.documents.BaseItem, {
          idOnly: false,
        }),
        { initial: [] } // empty array
      ),
    };
  }

  prepareBaseData() {
    super.prepareBaseData();
  }

  // helper to get all items in container
  get items() {
    return this.items.map((item) => item()).filter((i) => !!i);
  }
}
