import LocalDocumentField from "./local-document-field.mjs";

/** @import {SchemaField, ForeignDocumentField} from "@client/data/fields.mjs" */
/** @import Document from "@common/abstract/document.mjs"; */
/** @import Item from "@common/documents/item.mjs"; */

const { SchemaField, ForeignDocumentField } = foundry.data.fields;

/**
 * Special field type for storing both link to foreign document (world item)
 * and local document (embedded item). If item link is severed, it will fallback to cache.
 * @extends {SchemaField}
 */

export default class CachedReferenceField extends SchemaField {
  /**
   *
   * @param {typeof Item} model
   * @param {*} options
   */
  constructor(model, options = {}) {
    if (!foundry.utils.isSubclass(model, foundry.abstract.DataModel)) {
      throw new Error("CachedReferenceField must specify a DataModel subclass");
    }
    super(
      {
        linked: new ForeignDocumentField(model, {
          nullable: true,
          idOnly: false,
        }),
        cached: new LocalDocumentField(model, {
          nullable: true,
          idOnly: false,
        }),
      },
      options
    );

    this.model = model;
  }

  /**
   * Helper getter for grabbing refrenced ID. Returns linked || cached || null.
   * @param {*} value current value
   */
  static resolve(value) {
    if (!value) return null; // empty value prevention
    return value.linked || value.cached || null;
  }

  /**
   *
   * @param {*} value
   * @returns
   */
  static isCached(value) {
    return !value?.linked && value?.cached !== null;
  }

  /**
   * Checking if cached item is newest version of linked one.
   * @param {*} value
   * @returns
   */
  static isSynced(value) {
    if (!value?.linked || !value?.cached) return false;
    return (
      value.cached._stats?.modifiedTime > value.linked._stats?.modifiedTime
    );
  }

  //todo: move methods to Actor document
  /**
   * Remove cache reference and embedded document inside parent's collection.
   * @param {*} path
   * @param {*} parent
   * @returns
   */
  static async removeLinked(path, parent) {
    if (!parent || !path) return;
    const value = foundry.utils.getProperty(parent.system, path);
    if (!value) return;
    const cached = value.cached;
    if (cached) {
      await cached.delete();
      await parent.update(
        { [`system.${path}.linked`]: null },
        { [`system.${path}.cached`]: null }
      );
    }
  }

  /**
   * Remove cache reference and embedded document inside parent's collection.
   * @param {*} path
   * @param {*} parent
   * @returns
   */
  static async removeCache(path, parent) {
    if (!parent || !path) return;
    const value = foundry.utils.getProperty(parent.system, path);
    if (!value) return;
    const cached = value.cached;
    if (cached) {
      await cached.delete();
      await parent.update({ [`system.${path}.cached`]: null });
    }
  }
}
