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

  /* -------------------------------------------------------------------------- */
  /*                              Data Preparation                              */
  /* -------------------------------------------------------------------------- */

  // #region Data Preparation
  prepareData() {
    super.prepareData();
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
    const effects = this.effects;
    const categories = {
      temporary: { label: "Temporary", effects: [] },
      passive: { label: "Active", effects: [] },
      inactive: { label: "Disabled", effects: [] },
    };

    // creating
    for (let effect of effects) {
      effect.source = await this._getEffectSource(effect);
      if (effect.disabled) categories.inactive.effects.push(effect);
      else if (effect.isTemporary) categories.temporary.effects.push(effect);
      else categories.passive.effects.push(effect);
    }

    // sorting
    for (const category of Object.values(categories)) {
      category.effects.sort((a, b) => {
        const sourceSort = (a.source || "").localeCompare(b.source || "", "pl");
        if (sourceSort !== 0) return sourceSort;
        return (a.name || "").localeCompare(b.name || "", "pl");
      });
    }
    return categories;
  }

  /* -------------------------------------------------------------------------- */

  /**
   * Handling effects for actor.
   * @param {*} action
   * @param {*} effectId
   * @returns
   */
  async _manageEffect(action, effectId = null) {
    switch (action) {
      case "create":
        return this._onCreateEffect();
      case "edit":
        return this.effects.get(effectId)?.sheet.render(true);
      case "delete":
        //todo: wrap in prompt
        return this.effects.get(effectId)?.delete();
      case "toggle":
        //todo: verify effect structure
        const effect = this.effects.get(effectId);
        return effect?.update({ disabled: !effect.disabled });
    }
  }

  /* -------------------------------------------------------------------------- */

  /**
   * Helper function for mapping source of effect.
   * @param {*} effect
   * @returns
   */
  async _getEffectSource(effect) {
    if (!effect.origin) return "Własny (Actor)";

    // Próba odnalezienia dokumentu źródłowego po UUID
    const source = await fromUuid(effect.origin);
    if (!source) return "Nieznane źródło";

    // Degenesis-specific logic: sprawdź typ przedmiotu
    if (source.type === "potential") return `Potencjał: ${source.name}`;
    if (source.type === "legacy") return `Legenda: ${source.name}`;
    return source.name; // Np. nazwa pancerza lub broni
  }

  /* -------------------------------------------------------------------------- */

  /**
   * Helper function for creating new effect.
   * @returns
   */
  async _onCreateEffect() {
    const effectData = {
      name: "New Effect",
      img: "icons/svg/aura.svg",
      origin: this.uuid,
      disabled: false,
    };
    return this.createEmbeddedDocuments("ActiveEffect", [effectData]);
  }

  /* -------------------------------- Inventory ------------------------------- */

  /**
   * Prepare inventory for beeing displayed on actor's sheet.
   * @returns
   */
  _prepareInventory() {
    const items = this.items;

    const excluded = new Set([
      "cult",
      "culture",
      "concept",
      "potential",
      "legacy",
    ]);

    // When adding new category, just create another property here.
    const inventory = {
      weapon: [],
      shield: [],
      armor: [],
      ammunition: [],
      transportation: [],
      equipment: [],
      other: [],
    };

    // mapping inventory array into categories
    const categories = new Set(Object.keys(inventory));

    // Step 1: Prepare all transportation items.
    const transportationItems = items.filter(
      (i) => i.type === "transportation"
    );

    // hide items stored in transportation
    const hiddenItemIds = new Set();

    // !important: property paths may change in future
    for (const transportation in transportationItems) {
      const items = transportation.system.items;
      items.forEach((item) => hiddenItemIds.add(item.id));
      inventory.transportation.push({
        item: transportation,
        items: items,
      });
    }
    // Step 2: Prepare inventory.
    for (const item of items) {
      if (
        excluded.has(item.type) || // skip excluded types
        item.type === "transportation" || // skip transportation types
        hiddenItemIds.has(item.id) // skip items in transportation items
      ) {
        continue;
      }
      const category = categories.has(item.type) ? item.type : "other";
      inventory[category].push(item);
    }

    return inventory;

    /* return this.items.reduce(
      (inventory, item) => {
        const type = item.type;
        if (excluded.has(type)) return inventory;

        const category = ["container", "weapon", "shield", "armor"].includes(
          type
        )
          ? type
          : "other";

        inventory[category].items.push(item);
        return inventory;
      },
      {
        weapon: { label: "DGNS.Inventory.weapons", items: [] },
        shield: { label: "DGNS.Inventory.shields", items: [] },
        armor: { label: "DGNS.Inventory.armor", items: [] },
        container: { label: "DGNS.Inventory.container", items: [] },
        other: { label: "DGNS.Inventory.other", items: [] },
      }
    ); */
  }

  /* -------------------------------------------------------------------------- */
  //#endregion

  // #region Rolls
  /* -------------------------------------------------------------------------- */
  /*                                    Rolls                                   */
  /* -------------------------------------------------------------------------- */

  /**
   *
   * @param {*} attribute
   * @param {*} skill
   */
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

    await DGNSActionRollDialog.create(rollConfig);
  }

  /**
   *
   * @param {*} attribute
   * @param {*} skill
   */
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

    await DGNSCombinationRollDialog.create(rollConfig);
  }

  // #endregion
  /* -------------------------------------------------------------------------- */
  /*                              Getters / Setters                             */
  /* -------------------------------------------------------------------------- */
}
