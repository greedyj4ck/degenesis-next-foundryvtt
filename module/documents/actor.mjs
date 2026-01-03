/** @import Actor from '@common/documents/actor.mjs*/

/** Required field Classes */
import CachedReferenceField from "../data/fields/cached-reference-field.mjs";

/** Dialogs  */
import DGNSActionRollDialog from "../applications/roll/action.dialog.mjs";
import DGNSCombinationRollDialog from "../applications/roll/combination.dialog.mjs";

/** Roll logic and helper functions  */

/**
 *
 * Custom Actor class for Degenesis system.
 * @extends Actor
 * @inheritdoc
 *
 */
export default class DGNSActor extends Actor {
  static DEFAULT_ICON = "systems/degenesisnext/assets/tokens/default.png";

  // #region Data Preparation

  prepareData() {
    super.prepareData();
  }

  prepareEmbeddedDocuments() {
    super.prepareEmbeddedDocuments();
  }

  // #endregion

  // #region Data Events
  async _preCreate(data, options, user) {
    if ((await super._preCreate(data, options, user)) === false) {
      return false;
    }
  }

  async _preUpdate(changed, options, user) {
    if ((await super._preUpdate(changed, options, user)) === false)
      return false;
  }

  _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
  }

  _onUpdate(data, options, userId) {
    super._onUpdate(data, options, userId);
    if (this.type === "group") this._propagateGroup();
  }

  async update(data, options = {}) {
    console.log(`Actor update.`);
    console.log("Data:", data);
    console.log("Options:", options);
    // console.log("Stack:", new Error().stack);

    // Checking for fields to sync.
    const fieldsToSync = this._getCachedReferenceFields();
    if (fieldsToSync.length > 0) {
      // console.log(`Syncing caches for ${this.type} actor:`, fieldsToSync);
      const cacheUpdates = await this._prepareCacheUpdates(data, fieldsToSync);
      if (cacheUpdates) {
        foundry.utils.mergeObject(data, cacheUpdates);
      }
    }
    return super.update(data, options);
  }
  // #endregion

  // #region Data  helpers

  /**
   * Set actor's group (ForeignField link) and reverse link
   * @param {*} groupId
   */
  async setGroup(groupActor = null) {
    await groupActor.update({
      ["system.members"]: [...groupActor.system.members, { actor: this.id }],
    });
    await this.update({ ["system.group"]: groupActor.id });
  }

  /**
   * Remove reference to group.
   */
  async unsetGroup() {
    let group = this.system.group;

    await this.system.group.update({
      ["system.members"]: group.system.members.filter(
        (member) => member.actor.id !== this.id
      ),
    });
    await this.update({ ["system.group"]: null });
  }

  /**
   * Force members to prepareData after Group information been changed.
   */
  async _propagateGroup() {
    for (const schema of this.system.members) {
      schema.actor.prepareData();
      schema.actor.render(false);
    }
  }
  // #endregion

  // #region Custom data handlers
  /**
   * Discover any CachedReferenceFields from schema.
   * @returns {string[]} Array of keys.
   */
  _getCachedReferenceFields() {
    const fields = [];
    // Iterate through this actor's DataModel schema
    for (const [key, field] of Object.entries(this.system.schema.fields)) {
      if (field instanceof CachedReferenceField) {
        fields.push(key);
      }
    }
    return fields;
  }

  /**
   * Preparing cached fields information.
   * @param {object} data Data from linked item
   * @param {object} fieldsToSync All the fields that can be cached and linked item changed.
   * @returns {object} Data for update cycle || null if there are not any changes.
   */
  async _prepareCacheUpdates(data, fieldsToSync) {
    const updates = {};
    let hasUpdates = false;

    for (const field of fieldsToSync) {
      const itemChange = foundry.utils.getProperty(
        data,
        `system.${field}.linked`
      );

      if (itemChange === undefined) continue;
      const currentCachedId = this.system[field]?.cached?.id;

      if (currentCachedId) {
        const oldCache = this.items.get(currentCachedId);
        if (oldCache) {
          await oldCache.delete();
        }
      }

      // Item cleared
      if (!itemChange) {
        updates[`system.${field}.cached`] = null;
        hasUpdates = true;
        continue;
      }

      // Item set - create new cache
      const worldDoc = game.items.get(itemChange);

      if (worldDoc) {
        const [created] = await this.createEmbeddedDocuments("Item", [
          worldDoc.toObject(),
        ]);

        updates[`system.${field}.cached`] = created.id;
        hasUpdates = true;
      }
    }

    return hasUpdates ? updates : null;
  }

  // #region Rolls and rolls data preparation
  // *========================================*

  /**
   * Setup roll data for skill check.
   * @param {*} attribute
   * @param {*} skill
   */
  setupSkill(attribute, skill) {
    return { dialogData, cardData, rollData };
  }

  // *----------------------------------*

  async actionRoll(attribute, skill) {
    let actionNumber = this.system.actionNumbers[skill];

    let rollConfig = {
      actor: this,
      definiton: {
        attribute: attribute,
        skill: skill,
        actionNumber: actionNumber,
      },
    };

    console.log(`Setting action roll for: ${attribute}+${skill}`);
    console.log(`Action number: ${actionNumber}`);

    await DGNSActionRollDialog.create(rollConfig);
  }

  // *----------------------------------*

  async combinationRoll(attribute, skill) {
    let actionNumber = this.system.actionNumbers[skill];
    let rollConfig = {
      actor: this,
      definiton: {
        primary: {
          attribute: attribute,
          skill: skill,
          actionNumber: actionNumber,
        },
      },
    };

    console.log(`Setting action roll for: ${attribute}+${skill}`);
    console.log(`Action number: ${actionNumber}`);

    await DGNSCombinationRollDialog.create(rollConfig);
  }

  // #endregion
}
