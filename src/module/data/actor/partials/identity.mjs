/** @import {SchemaField, ForeignDocumentField} from "@client/data/fields.mjs" */
/** @import { BaseItem } from "@client/documents/item.mjs"  */
/** @import { BaseActor } from "@client/documents/actor.mjs"  */

import CachedReferenceField from "../../fields/cached-reference-field.mjs";

const { StringField, ForeignDocumentField } = foundry.data.fields;

const { BaseItem, BaseActor } = foundry.documents;

/** Culture / Concept / Cult / Custom Clan document fields */
export default class IdentityFields {
  static get identity() {
    return {
      // CachedReferenceFields for storing information about linked items
      cultureItem: new CachedReferenceField(BaseItem),
      conceptItem: new CachedReferenceField(BaseItem),
      cultItem: new CachedReferenceField(BaseItem),
      group: new ForeignDocumentField(BaseActor),
      rank: new StringField({ label: "DGNS.Rank" }),
    };
  }
}
