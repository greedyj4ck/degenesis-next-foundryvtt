/** @import Actor from '@common/documents/actor.mjs*/

/** Required field Classes */
import CachedReferenceField from "../data/fields/cached-reference-field.mjs";

/** Custom ActiveEffect document  */
import DGNSActiveEffect from "./active.effect.mjs";

/** Dialogs  */
import DGNSActionRollDialog from "../applications/roll/action.dialog.mjs";
import DGNSCombinationRollDialog from "../applications/roll/combination.dialog.mjs";
import DGNSWeaponRollDialog from "../applications/roll/weapon.dialog.mjs";

/** Roll logic and helper functions  */
import DGNSRoll from "../dice/base.roll.mjs";
import DGNSCombinationRoll from "../dice/combination.roll.mjs";

import { ItemHelper } from "../utils/item.helper.mjs";
import { EffectHelper } from "../utils/effect.helper.mjs";
import { Condition } from "../logic/condition.logic.mjs";
import { Penalty } from "../logic/penalties.logic.mjs";
import { Scars } from "../logic/scars.logic.mjs";

/** Routine handlers  */
import { GroupActorHandlers } from "../handlers/group.actor.handlers.mjs";

const HANDLERS = {
  group: GroupActorHandlers,
};

/**
 *
 * Custom Actor document class for Degenesis system.
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

  /* ---------------------------------- */
  /*          Data preparation          */
  /* ---------------------------------- */

  /**
   * Basic data preparation for actor document.
   * @inheritdoc
   */
  prepareData() {
    super.prepareData();
  }

  /* ---------------------------------- */

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

  /* ---------------------------------- */

  /**
   * Data preparation for Character type.
   */

  _prepareCharacterDerivedData() {
    this._prepareConditionMaxima();
    this._prepareEncumbrance();
    this._prepareMovement();

    this._prepareGroupModifiers();
    // experimental
    this._applyPenalties();

    this._prepareActionNumbers();
    this._prepareCombatActions();
    //
    this._prepareWeapons();
  }

  /* ---------------------------------- */

  /**
   * Data preparation for Group type.
   */
  _prepareGroupDerivedData() {
    // preparing alignment modifiers
  }

  /* ---------------------------------- */

  prepareEmbeddedDocuments() {
    super.prepareEmbeddedDocuments();
  }

  /* ---------------------------------- */
  /*             Data Events            */
  /* ---------------------------------- */

  /**
   * For now just the handlers i needed for the development,
   * but all methods will be exposed here in a future.
   */

  /**
   * @inheritdoc
   * @param {*} data
   * @param {*} options
   * @param {*} user
   * @returns
   */

  async _preCreate(data, options, user) {
    if ((await super._preCreate(data, options, user)) === false) {
      return false;
    }
    // run the proper subtype handlers if defined
    await HANDLERS[this.type]?._preCreate?.(this, data, options, user);
  }

  /* ---------------------------------- */

  /**
   * @inheritdoc
   * @param {*} changed
   * @param {*} options
   * @param {*} user
   * @returns
   */

  async _preUpdate(changed, options, userId) {
    if ((await super._preUpdate(changed, options, userId)) === false) {
      return false;
    }
    await HANDLERS[this.type]?._preUpdate?.(this, data, options, userId);
  }

  /* ---------------------------------- */

  /**
   * @inheritdoc
   * @param {*} data
   * @param {*} options
   * @param {*} userId
   */

  _onCreate(data, options, userId) {
    super._onCreate(data, options, userId);
    HANDLERS[this.type]?._onCreate?.(this, data, options, userId);
  }

  /* ---------------------------------- */

  /**
   * @inheritdoc
   * @param {*} changed
   * @param {*} options
   * @param {*} userId
   */
  _onUpdate(changed, options, userId) {
    super._onUpdate(changed, options, userId);
    HANDLERS[this.type]?._onUpdate?.(this, changed, options, userId);
  }

  /* ---------------------------------- */

  /**
   * @inheritdoc
   * @param {*} data
   * @param {*} options
   * @returns
   */

  async update(data, options = {}) {
    //todo: add helper method to remove clutter
    // Checking for fields to sync
    const fieldsToSync = this._getCachedReferenceFields();
    if (fieldsToSync.length > 0) {
      //
      const cacheUpdates = await this._prepareCacheUpdates(data, fieldsToSync);
      if (cacheUpdates) {
        foundry.utils.mergeObject(data, cacheUpdates);
      }
    }

    const result = await super.update(data, options);
    await HANDLERS[this.type]?.update?.(this, data, options);

    //todo: move to character handler later
    this._syncGroup();
    return result;
  }
  /* ---------------------------------- */

  /**
   * @inheritdoc
   * @param {*} documents
   * @param {*} operation
   * @param {*} user
   */

  static async _onUpdateOperation(documents, operation, user) {
    await super._onUpdateOperation(documents, operation, user);
    for (const actor of documents) {
      await HANDLERS[actor.type]?._onUpdateOpereation?.(actor, operation, user);
    }
  }

  /* ---------------------------------- */

  /**
   * Main event for syncing stuff with group actor.
   */
  async _syncGroup() {
    if (this.isGroupMember) {
      this.group.sheet?.render();
    }
  }

  /* ---- Data preparation helpers ---- */

  /**
   * Calculate basic condition maximas for standard properties.
   * todo: add override mode.
   * !remember to use base attributes / skills values for calculations, since action number
   * !can be influenced by other modifiers
   */

  _prepareConditionMaxima() {
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

    // Manually apply any AEs targeting condition maxima
    DGNSActiveEffect.applyToTargets(this, DGNSActiveEffect.CONDITION_KEYS);
  }

  _prepareEncumbrance() {
    const { general, attributes, actionNumbers } = this.system;

    const enc = general.encumbrance; // shortcut

    enc.current = 0; // reset to default state
    enc.max = Condition.calculateMaxEncumbrance(
      attributes.body.value,
      attributes.body.skills.force.value,
    );

    DGNSActiveEffect.applyToTargets(this, DGNSActiveEffect.ENCUMBRANCE_KEYS);

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

    DGNSActiveEffect.applyToTargets(this, DGNSActiveEffect.MOVEMENT_KEYS);
  }

  /* ---------------------------------- */

  /**
   * Get and apply group modifiers to actor entity.
   */

  _prepareGroupModifiers() {
    const { group, condition, special } = this.system;
    const modifiers = group ? group.system.getModifiersForActor(this.id) : [];

    condition.ego.max += Scars.sumModifier(modifiers, "ego.max");
    condition.fleshwounds.max += Scars.sumModifier(
      modifiers,
      "fleshwounds.max",
    );

    //todo: add handling of all of the methods and modifiers form Scars.

    // special modifiers flags, used in rolls and additional funcionality
    special.modifiers = {
      egoSuccessConvert: Scars.hasModifierFlag(
        modifiers,
        "special.egoSuccessConvert",
      ),
      groupSkillHalfXP: Scars.hasModifierFlag(
        modifiers,
        "special.groupSkillHalfXP",
      ),
      rerollFailedMentalDefence: Scars.hasModifierFlag(
        modifiers,
        "special.rerollFailedMentalDefence",
      ),
      rerollRevengeAttempts: Scars.hasModifierFlag(
        modifiers,
        "special.rerollRevengeAttempts",
      ),
    };

    //reference / display only
    this.groupModifiers = modifiers;
  }

  /* ---------------------------------- */

  /**
   * Prepare action numbers for actor entity. Should be called as a last step since
   * it heavily relies on modifiers and active effects calculations prior to final result.
   * @returns
   */
  _prepareActionNumbers() {
    let actionNumbers = {};
    const { attributes, modes } = this.system;

    for (let attribute in attributes) {
      for (let skill in attributes[attribute].skills) {
        actionNumbers[skill] =
          attributes[attribute].value +
          attributes[attribute].skills[skill].value;
      }
    }

    // Mental Defense skill number
    actionNumbers.activeDefense = actionNumbers["mobility"];
    actionNumbers.mentalDefense = actionNumbers[modes.faithWillpower];

    this.system.actionNumbers = actionNumbers;
  }

  /* ---------------------------------- */

  _prepareCombatActions() {
    const actions = {};
    const { actionNumbers } = this.system;

    for (const [key, { group, skill, mod = 0 }] of Object.entries(
      CONFIG.DEGENESIS.combat.actions,
    )) {
      (actions[group] ??= []).push({
        key,
        label: `DGNS.COMBAT.action.${key}`,
        pool: Math.max(0, (actionNumbers[skill] ?? 0) + mod),
      });
    }
    this.combatActions = actions;
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
  }

  /* -- Items / weapons preparations -- */

  /**
   * Prepare data for all the weapon items.
   */
  _prepareWeapons() {
    //todo: full loop, change to already filtered weapon group
    //for (const weapon of this.items.filter((i) => i.type === "weapon")) {
    //   weapon.prepareAttackPool(this.system.actionNumbers);
    // }
  }

  /* ---------------------------------- */

  // #endregion

  /* ---------------------------------- */
  /*            Data helpers            */
  /* ---------------------------------- */

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

  /**
   * Helper function for grabiing skill definition
   * todo: fix the mental shit and stuff
   * @param {*} skill
   */

  getSkillDefinition(skill) {
    const { attributes, actionNumbers } = this.system;
    const attribute = Object.keys(attributes).find(
      (a) => skill in attributes[a].skills,
    );
    return { attribute, skill, actionNumber: actionNumbers[skill] };
  }

  // #endregion

  /* ---------------------------------- */
  /*        Custom Data Handlers        */
  /* ---------------------------------- */

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

  /* ---------------------------------- */

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

  /* ---------------------------------- */
  /*        Sheet Helper Methods        */
  /* ---------------------------------- */

  /* ---------- ActiveEffects --------- */

  /**
   * Preparing ActiveEffects for sheet.
   * @returns
   */
  async _prepareEffects() {
    return await EffectHelper._prepareEffects(this);
  }
  /* ---------------------------------- */

  /**
   * Handling effects for actor.
   * @param {*} action
   * @param {*} effectId
   * @returns
   */

  async _manageEffect(action, effectId = null) {
    return await EffectHelper._manageEffect(this, action, effectId);
  }

  /* ---------------------------------- */
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
    const sortModes =
      this.getFlag(CONFIG.DEGENESIS.id, "inventorySortModes") || {};

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

  /* ---------------------------------- */
  //#endregion

  /* ---------------------------------- */
  /*                Rolls               */
  /* ---------------------------------- */

  // #region Rolls

  /**
   * Data for rolls is beeing prepared inside Roll Dialog epplications, and move back
   * to actor entity. Main execution lies here.
   */

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

    await roll.toMessage(this);
    return roll;
  }

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

  /* ---------------------------------- */

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

  // Preparing combat roll datas for all
  // Early W.I.P

  /**
   *
   * @param {*} weapon weapon item
   * @param {*} action weapon action string
   * @returns
   */

  async weaponRoll(weapon) {
    const actions = this._prepareWeaponActions(weapon);
    if (!actions.length) return null;

    const combined = Boolean(weapon.system.skills.secondary);
    const Dialog = combined ? DGNSCombinationRollDialog : DGNSWeaponRollDialog;

    const definition = await Dialog.create({
      actor: this,
      weapon,
      actions,
      definition: foundry.utils.deepClone(actions[0].definition),
    });

    if (!definition) return; // Roll was cancelled

    return this._executeRoll({
      type: combined ? "combination" : "action",
      definition,
    });
  }

  _prepareWeaponActions(weapon) {
    const { primary, secondary } = weapon.system.skills;
    if (!primary) return [];
    const zero = () => ({ d: 0, s: 0, t: 0 });

    return weapon.combatActions.map(({ key, label, rollType, modifiers }) => {
      const main = {
        ...this.getSkillDefinition(primary),
        rollType,
        modifiers: { ...zero(), ...modifiers },
        itemUuid: weapon.uuid,
      };
      return {
        key,
        label,
        definition: secondary
          ? {
              primary: main,
              secondary: {
                ...this.getSkillDefinition(secondary),
                modifiers: zero(),
              },
            }
          : main,
      };
    });
  }

  /**
   * Handling common combat  action rolls.
   * @param {*} action
   */
  async combatActionRoll(action) {}

  _prepareCombatActions() {}

  /**
   * Post roll pipeline. Handling all side effects for actor entity.
   * For now its basic deduct action number and overload for psychonauts.
   */

  async _postRollEffects(type, roll) {
    const updates = {};

    // todo: add combat state detection
    if (type !== "initiative" && this.system.state.initiative.actions >= 1) {
      updates["system.state.initiative.actions"] =
        this.system.state.initiative.actions - 1;
    }

    // todo: check if overloading for psychonauts is working
    // future shit
    if (roll?.overload > 0) {
      updates["system.condition.spore.value"] =
        this.system.condition.spore.value - roll.overload;
    }

    if (Object.keys(updates).length > 0) {
      await this.update(updates);
    }
  }

  // #endregion

  /* ---------------------------------- */
  /*          Getters / Setters         */
  /* ---------------------------------- */

  // todo: check if returning empty string is correct, or null is better
  get concept() {
    return this.system.concept ?? null;
  }

  /* ---------------------------------- */

  get culture() {
    return this.system.culture ?? null;
  }

  /* ---------------------------------- */

  get cult() {
    return this.system.cult ?? null;
  }

  /* ---------------------------------- */

  get group() {
    return this.system?.group ?? null;
  }

  /* ---------------------------------- */

  /**
   * Returning true if there is a linked
   * group actor.
   */
  get isGroupMember() {
    return this.system?.group ? true : false;
  }

  /* ---------------------------------- */
  /*                Utils               */
  /* ---------------------------------- */

  /**
   * !deprecated
   * Manually apply AE for the system keys that cannot be changed
   * during initial method call, like trauma.max.
   * @param {*} targetMap
   * @param {*} property
   * @returns
   * @deprecated
   */
  _applyEffectsToTargets(targetMap, property) {
    if (!property || !targetMap) return null;

    for (const effect of this.appliedEffects) {
      if (effect.disabled) continue;

      for (const change of effect.changes) {
        const target = targetMap[change.key];
        if (!target) continue;

        const value = Number(change.value);

        switch (change.mode) {
          case "add":
            target[property] += value;
            break;
          case "subtract":
            target[property] -= value;
            break;
          case "multiply":
            target[property] *= value;
            break;
          case "override":
            target[property] = value;
            break;
          case "upgrade":
            target[property] = Math.max(target[property], value);
            break;
          case "downgrade":
            target[property] = Math.min(target[property], value);
            break;
        }
      }
    }
  }
}
