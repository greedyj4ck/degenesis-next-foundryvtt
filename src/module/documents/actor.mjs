/** @import Actor from '@common/documents/actor.mjs*/

/** Required field Classes */
import CachedReferenceField from "../data/fields/cached-reference-field.mjs";

/** Dialogs  */
import DGNSActionRollDialog from "../applications/roll/action.dialog.mjs";
import DGNSCombinationRollDialog from "../applications/roll/combination.dialog.mjs";

/** Roll logic and helper functions  */
import DGNSRoll from "../dice/base.roll.mjs";
import DGNSCombinationRoll from "../dice/combination.roll.mjs";

import { ItemHelper } from "../utils/item.helper.mjs";
import { EffectHelper } from "../utils/effect.helper.mjs";
import { Condition } from "../logic/condition.mjs";
import { Penalty } from "../logic/penalties.mjs";

/**
 *
 * Custom Actor class for Degenesis system.
 * @extends Actor
 * @inheritdoc
 *
 */

export default class DGNSActor extends Actor {
  static DEFAULT_ICON = "systems/degenesisnext/assets/tokens/default.png";

  static ROLL_CLASSES = {
    action: DGNSRoll,
    combination: DGNSCombinationRoll,
    complex: null, // todo: DGNSComplexRoll - not yet implemented
  };

  /* -------------------------------------------------------------------------- */
  /*                              Data Preparation                              */
  /* -------------------------------------------------------------------------- */

  // #region Data Preparation

  /**
   * Basic data preparation for actor document.
   * @inheritdoc
   */
  prepareData() {
    super.prepareData();
  }

  /**
   * Dervied data preparation - all the values that are need to be calcualted
   * and are not stored since they base on other values.
   */
  prepareDerivedData() {
    // Common logic

    // Actor type specific logic

    try {
      const type = this.type.charAt(0).toUpperCase() + this.type.slice(1);
      this[`_prepare${type}DerivedData`]?.(); //fire only if method is found...
    } catch (e) {
      console.error(`DGNS | prepareDerivedData failed for "${this.type}":`, e);
    }
  }

  /**
   * Data preparation for Character type.
   */
  _prepareCharacterDerivedData() {
    console.log(`Character derived data preparations...`);
    this._prepareConditionMaxima();
    this._prepareEncumbrance();
    this._prepareMovement();

    // experimental
    this._applyPenalties();
  }

  /* -------------------------------------------------------------------------- */

  prepareEmbeddedDocuments() {
    super.prepareEmbeddedDocuments();
  }
  // #endregion

  /* -------------------------------------------------------------------------- */
  /*                                 Data Events                                */
  /* -------------------------------------------------------------------------- */
  // #region Data Events
  async _preCreate(data, options, user) {
    if ((await super._preCreate(data, options, user)) === false) {
      return false;
    }
  }
  /* -------------------------------------------------------------------------- */

  async _preUpdate(changed, options, user) {
    if ((await super._preUpdate(changed, options, user)) === false)
      return false;
  }

  /* -------------------------------------------------------------------------- */

  _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
  }

  /* -------------------------------------------------------------------------- */

  _onUpdate(data, options, userId) {
    super._onUpdate(data, options, userId);
    if (this.type === "group") this._propagateGroup();
  }

  /* -------------------------------------------------------------------------- */
  async update(data, options = {}) {
    console.log(`Actor update.`);
    console.log("Data:", data);
    console.log("Options:", options);

    // Checking for fields to sync
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

  /* ---- Data preparation helpers ---- */
  /**
   * Calculate basic condition maximas for standard properties.
   * todo: add override mode.
   * !remember to use base attributes / skills values for calculations, since action number
   * !can be influenced by other modifiers
   */

  _prepareConditionMaxima() {
    console.log(`prepareConditionMaxima`);

    const { attributes, condition, modes, actionNumbers } = this.system;

    const primalFocusSkill = modes.primalFocus;
    const faithWillpowerSkill = modes.faithWillpower;

    const egoAttribute =
      primalFocusSkill === "primal" ? "instinct" : "intellect";

    condition.ego.max = Condition.calculateMaxEgo(
      attributes[egoAttribute].value,
      attributes[egoAttribute].skills[primalFocusSkill].value,
    );

    condition.spore.max = Condition.calculateMaxSpore(
      attributes.psyche.value,
      attributes.psyche.skills[faithWillpowerSkill].value,
    );

    condition.fleshwounds.max = Condition.calculateMaxFleshwounds(
      attributes.body.value,
      attributes.body.skills.toughness.value,
    );

    condition.trauma.max = Condition.calculateMaxTrauma(
      attributes.body.value,
      attributes.psyche.value,
    );
  }

  _prepareEncumbrance() {
    const { general, attributes, actionNumbers } = this.system;

    const enc = general.encumbrance; // shortcut

    enc.current = 0; // reset to default state
    enc.max = Condition.calculateMaxEncumbrance(
      attributes.body.value,
      attributes.body.skills.force.value,
    );

    for (const item of this.items) {
      if (item.system?.encumbrance && !item.system?.location) {
        enc.current += item.system.encumbrance * (item.system.quantity ?? 1);
      }
    }

    enc.over = enc.current > enc.max;
    enc.pct = Math.round(Math.min((enc.current / enc.max) * 100, 100));
  }

  /**
   * todo: consider moving this to other method
   */
  _prepareMovement() {
    const { general, attributes } = this.system;

    general.movement = Condition.calculateMovement(
      attributes.body.value,
      attributes.body.skills.athletics.value,
    );
  }

  /* ------------ Penalties ----------- */

  _applyPenalties() {
    const { condition, general } = this.system;
    let totalPenalty = 0;

    totalPenalty += Penalty.fromTrauma(condition.trauma.value);
    totalPenalty += Penalty.fromEncumbrance(
      general.encumbrance.current,
      general.encumbrance.max,
    );

    console.log(`Calculated total penalty`);
    console.log(totalPenalty);
  }

  // #endregion

  /* -------------------------------------------------------------------------- */
  /*                                Data Helpers                                */
  /* -------------------------------------------------------------------------- */

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
    if (this.system?.group) {
      let group = this.system.group;

      await this.system.group.update({
        ["system.members"]: group.system.members.filter(
          (member) => member.actor.id !== this.id,
        ),
      });
      await this.update({ ["system.group"]: null });
    }
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

  /* -------------------------------------------------------------------------- */
  /*                            Custom Data Handlers                            */
  /* -------------------------------------------------------------------------- */
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

  /* -------------------------------------------------------------------------- */

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
        `system.${field}.linked`,
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
  //#endregion

  //#region Sheet Methods

  /* -------------------------------------------------------------------------- */
  /*                               Sheets Methods                               */
  /* -------------------------------------------------------------------------- */

  /* ------------------------------ ActiveEffects ----------------------------- */

  /**
   * Preparing ActiveEffects for sheet.
   * @returns
   */
  async _prepareEffects() {
    return await EffectHelper._prepareEffects(this);
  }
  /* -------------------------------------------------------------------------- */

  /**
   * Handling effects for actor.
   * @param {*} action
   * @param {*} effectId
   * @returns
   */

  async _manageEffect(action, effectId = null) {
    return await EffectHelper._manageEffect(this, action, effectId);
  }

  /* -------------------------------------------------------------------------- */
  /**
   * Helper function for creating new effect.
   * @returns
   */
  async _onCreateEffect() {
    return await EffectHelper._onCreateEffect(this);
  }

  /* ----------- Potentials ----------- */

  /**
   * Prepare potentials collection for actor sheet.
   * todo: still to improve.
   * @returns
   */
  _preparePotentials() {
    const potentials = this.items
      .filter((item) => item.type === "potential")
      .sort((a, b) => a.name.localeCompare(b.name));

    return potentials;
  }

  /* ----------- Legacies ----------- */

  /**
   * Prepare potentials collection for actor sheet.
   * todo: still to improve.
   * @returns
   */
  _prepareLegacies() {
    const legacies = this.items
      .filter((item) => item.type === "legacy")
      .sort((a, b) => a.name.localeCompare(b.name));

    return legacies;
  }

  /* -------- Items / Inventory ------- */

  /**
   * Prepare inventory for beeing displayed on actor's sheet.
   * Added both groups / keyed structure.
   * @returns
   */
  _prepareInventory() {
    const sortModes = this.getFlag("degenesisnext", "inventorySortModes") || {};

    // When adding new category, just create another entry here.
    const groups = [
      "weapon",
      "armor",
      "modification",
      "transportation",
      "equipment",
    ];

    // Excluded item types.
    const excludedTypes = ["cult", "culture", "concept", "potential", "legacy"];

    // Preparing structure map for inventory groups.
    const inventoryMap = [...groups, "other"].reduce(
      (acc, g) => ((acc[g] = []), acc),
      {},
    );

    // Splitting embedded items into proper groups.
    for (const item of this.items) {
      if (excludedTypes.includes(item.type)) continue;

      if (groups.includes(item.type)) {
        inventoryMap[item.type].push(item);
      } else {
        inventoryMap["other"].push(item);
      }
    }

    const byGroup = [...groups, "other"].map((group) => {
      const mode = sortModes[group] || "manual";
      const items = inventoryMap[group];

      // Sorting inventory inside group
      items.sort((a, b) => {
        return mode === "alpha"
          ? a.name.localeCompare(b.name)
          : (a.sort || 0) - (b.sort || 0);
      });

      // Generating label keys.
      const labelKey =
        group === "other" ? "DEGENESIS.Other" : `TYPES.Item.${group}`;

      return {
        id: group,
        label: game.i18n.localize(labelKey),
        items: items,
        isAlpha: mode === "alpha",
        sortIcon: mode === "alpha" ? "fa-arrow-down-a-z" : "fa-sort",
      };
    });

    const byType = Object.fromEntries(byGroup.map((g) => [g.id, g]));

    return { groups: byGroup, types: byType };
  }

  /**
   * Create embedded item in actor.
   * @param {*} itemType
   * @returns
   */
  async _createItem(itemType) {
    return ItemHelper.createActorItem(this, "", itemType, {});
  }

  /* -------------------------------------------------------------------------- */
  //#endregion

  // #region Rolls
  /* -------------------------------------------------------------------------- */
  /*                                    Rolls                                   */
  /* -------------------------------------------------------------------------- */

  /**
   * Data for rolls is beeing prepared inside Roll Dialog epplications, and move back
   * to actor entity. Main execution lies here.
   */

  /* -------- Rolls preparation -------- */
  /**
   * todo: method description
   * @param {*} attribute
   * @param {*} skill
   */

  async actionRoll(attribute, skill) {
    // Preparing data inside action roll dialog
    const definition = await DGNSActionRollDialog.create({
      actor: this,
      definition: {
        attribute,
        skill,
        actionNumber: this.system.actionNumbers[skill],
      },
    });

    if (!definition) return; // Roll was cancelled
    return this._executeRoll({ type: "action", definition });
  }

  /**
   *todo: method description
   * @param {*} attribute
   * @param {*} skill
   */

  async combinationRoll(attribute, skill) {
    // Preparing data inside combination roll dialog
    const definition = await DGNSCombinationRollDialog.create({
      actor: this,
      definition: {
        primary: {
          attribute,
          skill,
          actionNumber: this.system.actionNumbers[skill],
        },
      },
    });

    if (!definition) return; // Roll was cancelled
    return this._executeRoll({ type: "combination", definition });
  }

  /**
   * Core roll pipeline. All roll types pass through here
   * after configuration dialog resolves.
   */

  async _executeRoll({ type, definition }) {
    const RollClass = this.constructor.ROLL_CLASSES[type];

    if (!RollClass) return null;

    const roll = new RollClass(definition);

    await roll.evaluate();
    await this._postRollEffects(type, roll);

    await roll.toMessage();
    return roll;
  }

  /**
   * Post roll pipeline. Handling all side effects for actor entity.
   */

  async _postRollEffects(type, roll) {
    console.log(`_postRollEffects pipline:`);
    console.dir(type, roll);
  }

  // #endregion
  /* -------------------------------------------------------------------------- */
  /*                              Getters / Setters                             */
  /* -------------------------------------------------------------------------- */
}
