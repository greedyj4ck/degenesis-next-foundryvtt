/** @import Item from '@common/documents/item.mjs*/

import DGNSActiveEffect from "./active.effect.mjs";

import { WEAPON_GROUPS_SKILLS } from "../logic/config/items.mjs";
import { Qualities, QUALITY_DEFINITIONS } from "../logic/quality.mjs";

import { EffectHelper } from "../utils/effect.helper.mjs";

export default class DGNSItem extends Item {
  /* ---------------------------------- */
  /*        Main Data Preparation       */
  /* ---------------------------------- */

  /**
   * Main data preparation loop. Do not override without specific purpose.
   */
  prepareData() {
    super.prepareData();
  }

  /**
   * Base data peparation.
   */
  prepareBaseData() {
    super.prepareBaseData();
  }

  /**
   * Preparing embedded documents.
   * We are injecting ActiveEffects from mods into main AE document collection.
   */

  prepareEmbeddedDocuments() {
    super.prepareEmbeddedDocuments();
    if (this.type === "weapon" || this.type === "armor") {
      this._handleModifications();
    }
  }

  /**
   * Devied data preparation - this should be mostly used for presenting finished data.
   */
  prepareDerivedData() {
    super.prepareDerivedData();
  }

  /* ---------------------------------- */
  /*               Updates              */
  /* ---------------------------------- */

  /**
   * When a modification is updated, notify its parent weapon/armor
   * so it re-prepares and picks up the new mod data immediately.
   * @override
   */
  _onUpdate(data, options, userId) {
    super._onUpdate(data, options, userId);

    // Display edited Item sheet, todo: move to helper
    if (this.type !== "modification") return;
    if (!this.system.mounted) return;

    if (
      foundry.utils.hasProperty(data, "effects") ||
      foundry.utils.hasProperty(data, "system.modifications")
    ) {
      this.sheet?.render(false);
    }

    const parent = fromUuidSync(this.system.mounted);
    parent?.sheet?.render(false);
  }

  /**
   * Preparing data format for displaying in chat messages and dropdowns
   * Just basic implementation for now, can be extended with arguments that takes the item.type
   * todo: seperate methods for different item types ?
   */

  async _getChatData() {
    const data = this.system;
    return {
      description: await TextEditor.enrichHTML(data.description),
      qualities: data.qualities,
    };
  }

  /* -------------------------------------------------------------------------- */
  /*                                  Qualities                                 */
  /* -------------------------------------------------------------------------- */

  async _manageQualities(
    action,
    qualityKey = null,
    field = null,
    value = null,
  ) {
    console.log(
      `Manage quality fired. ${action} | ${qualityKey} | ${field} | ${value}|`,
    );

    if (!qualityKey) return;

    switch (action) {
      case "toggle":
        return this._toggleQuality(qualityKey);
      case "update":
        return this._updateQuality(qualityKey, field, value);
    }
  }

  async _toggleQuality(qualityKey) {
    if (!qualityKey) return;

    // find current qualities
    const quality = this.system.qualities.find((q) => q.key === qualityKey);

    let qualities = {};

    // create new one if do not exist
    if (quality) {
      const newState = !quality.enabled;
      qualities = this.system.qualities.map((q) =>
        q.key === qualityKey ? { ...q, enabled: newState } : q,
      );
    } else {
      const defaultValues = {};

      const definition = QUALITY_DEFINITIONS[qualityKey];
      definition.inputs?.forEach((i) => (defaultValues[i.name] = i.default));
      qualities = [
        ...this.system.qualities,
        {
          key: qualityKey,
          enabled: true,
          values: defaultValues,
        },
      ];
    }

    await this.update({ "system.qualities": qualities });

    /*     if (definition?.activeEffects) {
      if (newState) await this._applyQualityEffects(definition, qualityKey);
      else await this._removeQualityEffects(qualityKey);
    } */
  }

  async _updateQuality(qualityKey, field, value) {
    if (!qualityKey || !field || !value) return;

    const qualities = this.system.qualities.map((q) => {
      if (q.key !== qualityKey) return q;

      return {
        ...q,
        values: { ...q.values, [field]: value },
      };
    });

    return this.update({ "system.qualities": qualities });
  }

  /* ---------------------------------- */
  /*            Modifications           */
  /* ---------------------------------- */

  /**
   * Passing the AE from linked modificiation items into linked parent.
   * Passing and overriding qualities from linked modification items into linked parent.
   */

  _handleModifications() {
    console.log(`HandleModifications for:`);
    console.log(this);

    // Mods are getting resolved as ArrayField contains documents links
    const mods = (this.system.modifications?.installed ?? [])
      .map((uuid) => fromUuidSync(uuid))
      .filter((mod) => {
        if (!mod)
          console.warn(
            "DGNS | Installed mod resolved to null — UUID may be stale.",
          );
        return !!mod;
      });

    let used = 0; // used slots counting

    for (const mod of mods) {
      // --- Slot cost ---
      used += mod.system.slotCost ?? 1;

      // --- AE injection ---
      /*   for (const effect of mod.effects) {
       
      } */

      for (const effect of mod.effects) {
        if (effect.disabled) continue;

        // Apply change directly to this item's data in-memory
        for (const change of effect.changes) {
          DGNSActiveEffect.applyChange(this, change);
        }

        // Prepare effect to display in items'sheet
        const effectData = effect.toObject();

        foundry.utils.setProperty(
          effectData,
          "flags.degenesisnext.injectedFrom",
          mod.uuid,
        );
        foundry.utils.setProperty(
          effectData,
          "flags.degenesisnext.injectedFromName",
          mod.name,
        );

        const tempEffect = new CONFIG.ActiveEffect.documentClass(effectData, {
          parent: this,
          temporary: true,
        });

        this.effects.set(tempEffect.id, tempEffect);
      }

      // Quality injection — override existing, append missing
      for (const modQuality of mod.system.qualities ?? []) {
        if (!modQuality.enabled) continue;

        const existingIndex = this.system.qualities.findIndex(
          (q) => q.key === modQuality.key,
        );

        if (existingIndex !== -1) {
          const existing = this.system.qualities[existingIndex];

          if (!existing.enabled) {
            this.system.qualities[existingIndex] = {
              ...modQuality,
              injectedFrom: mod.uuid,
              injectedFromName: mod.name,
            };
          }
        } else {
          // Weapon doesn't have it at all — append
          this.system.qualities.push({
            ...modQuality,
            injectedFrom: mod.uuid,
            injectedFromName: mod.name,
          });
        }
      }
    }

    this.system.modifications.used = used;
  }

  /**
   * Install a modification onto this weapon/armor.
   * * Three cases depending on ownership context:
   * * 1. Weapon not actor-owned — link mod directly, no copy. Mod stays where it is.
   * * 2. Weapon actor-owned, actor does not have the mod — copy mod into actor inventory.
   * * 3. Weapon actor-owned, actor already has the mod — link existing instance, no copy.
   * @param {*} mod
   * @returns
   */

  async _installMod(mod) {
    if (!["weapon", "armor"].includes(this.type)) return; // todo: move to helper or getter

    const slots = this.system.modifications.slots ?? 0;
    const used = this.system.modifications.used ?? 0;
    const incoming = mod.system.slotCost ?? 1;

    if (used + incoming > slots) {
      //todo: translations
      ui.notifications.warn(
        `Not enough modification slots. Need ${incoming}, have ${slots - used}.`,
      );
      return;
    }

    const modToLink = await this._resolveModInstance(mod);

    console.log(`modToLInk:`);
    console.log(modToLink.id);

    if (!modToLink) return; //failsafe

    // Duplicate check against already-resolved installed documents
    const alreadyInstalled = (this.system.modifications.installed ?? []).some(
      (m) => m?.uuid === modToLink.uuid,
    );

    if (alreadyInstalled) {
      ui.notifications.warn("Modification already installed.");
      return;
    }

    await this.update({
      "system.modifications.installed": [
        ...this.system.modifications.installed,
        modToLink.uuid,
      ],
    });

    // need to be checked
    await modToLink.update({ ["system.mounted"]: this.uuid });
  }

  /**
   * Uninstall / unlink modification
   * @param {*} mod
   * @param {*} param1
   */
  async _uninstallMod(mod, { updateMod = true }) {
    await this.update({
      "system.modifications.installed":
        this.system.modifications.installed.filter((uuid) => uuid !== mod.uuid),
    });

    if (updateMod) {
      await mod.update({ "system.mounted": null }); //
    }
  }

  /**
   * Resolve which mod instance to link based on ownership context.
   * Helper function.
   * @param {*} mod
   * @returns
   */

  async _resolveModInstance(mod) {
    // Item has no owner: use original mod instance.
    if (!this.actor) return mod;

    // Item has owner, check if mod also exists
    const existingOnActor = this.actor.items.get(mod.id);
    if (existingOnActor) return existingOnActor;

    // Mod do not exist, copy mod item into actor items collection
    const itemData = mod.toObject();
    itemData.system.mounted = "";
    const [created] = await this.actor.createEmbeddedDocuments("Item", [
      itemData,
    ]);
    return created ?? null;
  }

  /* ------------------------------ ActiveEffects ----------------------------- */

  /**
   * Preparing ActiveEffects for sheet display.
   * @returns
   */
  async _prepareEffects() {
    return await EffectHelper._prepareEffects(this);
  }
  /* -------------------------------------------------------------------------- */

  /**
   * Handling effects for Item.
   * @param {*} action
   * @param {*} effectId
   * @returns
   */

  async _manageEffect(action, effectId = null) {
    return await EffectHelper._manageEffect(this, action, effectId);
  }

  /* -------------------------------------------------------------------------- */
  /*                                   Getters                                  */
  /* -------------------------------------------------------------------------- */

  // Get system related ID for special items like cultures, concepts, cults, clans etc
  get dgnsid() {
    return this.system?.dgnsid || null;
  }

  /**
   * Return true if it is a weapon within melee range.
   */
  get isMelee() {
    if (this.type === "weapon") {
      return WEAPON_GROUPS_SKILLS[this.system.group] == "projectiles" ||
        this.system.group == "sonic"
        ? false
        : true;
    }
  }
  get isRanged() {
    if (this.type === "weapon")
      return (
        WEAPON_GROUPS_SKILLS[this.system.group] == "projectiles" &&
        this.group != "sonic"
      );
  }

  get isSonic() {
    if ((this.type = "weapon")) return this.system.group == "sonic";
  }
}
