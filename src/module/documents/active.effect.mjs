export default class DGNSActiveEffect extends ActiveEffect {
  /* ---------------------------------- */
  /*            Skipped Keys            */
  /* ---------------------------------- */

  /**
   * Following keys need to be skipped due to uncommon for typical Foundry usage calculations
   * patterns. Those will be skipped, and must be reapplied in different methods using
   * todo: simplify the path, or move this to some helper
   */

  static CONDITION_KEYS = {
    "system.condition.ego.max": (system) => system.condition.ego,
    "system.condition.spore.max": (system) => system.condition.spore,
    "system.condition.fleshwounds.max": (system) =>
      system.condition.fleshwounds,
    "system.condition.trauma.max": (system) => system.condition.trauma,
  };

  static ENCUMBRANCE_KEYS = {
    "system.general.encumbrance.max": (system) => system.general.encumbrance,
  };

  static MOVEMENT_KEYS = {
    "system.general.movement": (system) => system.general,
  };

  // All the keys that are gonna be suppresed during initial ActiveEffect calculations.
  static SUPPRESSED_KEYS = new Set([
    ...Object.keys(this.CONDITION_KEYS),
    ...Object.keys(this.ENCUMBRANCE_KEYS),
    ...Object.keys(this.MOVEMENT_KEYS),
  ]);

  /**
   * Override apply to support item targets.
   * Standard apply() always targets an Actor. We redirect when flagged.
   */
  static applyChange(actor, change, options) {
    const effect = change.effect ?? options?.effect;

    // Mod effects target linked item — never apply to actor
    if (effect?.type === "modification") return;

    // Suppress keys calculated manually in later prep steps
    if (DGNSActiveEffect.SUPPRESSED_KEYS.has(change.key)) return;

    return super.applyChange(actor, change, options);
  }

  /**
   * Apply a single change to an Item document's system data.
   * Mirrors what the base apply() does but targets item.system.
   * @param {DGNSItem} item
   * @param {EffectChangeData} change
   */

  _applyToItem(item, change) {
    // Resolve the key relative to item.system
    // AE changes use dot-notation keys like "system.damage.base"

    console.log(`Applying mods to items:`);
    console.log(item);
    console.log(change);

    // see if that works
    const current = foundry.utils.getProperty(item, change.key) ?? null;
    let value = change.value;

    switch (change.type) {
      case "add":
        // Numeric add
        if (typeof current === "number") {
          value = current + parseFloat(value);
        } else {
          // String concat or array push — keep simple
          value = (current ?? "") + value;
        }
        break;
      case "subtract":
        if (typeof current === "number") {
          value = current - parseFloat(value);
        } else {
          // String concat or array push — keep simple
          value = (current ?? "") - value;
        }

      case "multiply":
        if (typeof current === "number") {
          value = current * parseFloat(value);
        }
        break;

      case "override":
        // Value is already what we want
        break;

      case "upgrade":
        if (typeof current === "number") {
          value = Math.max(current, parseFloat(value));
        }
        break;

      case "downgrade":
        if (typeof current === "number") {
          value = Math.min(current, parseFloat(value));
        }
        break;

      default:
        // CUSTOM — skip for now, can be extended
        return;
    }

    // Write back to the item's data object (in-memory only, no update() call)
    foundry.utils.setProperty(item, change.key, value);
  }

  static applyToTargets(actor, effectKeys) {
    if (!actor) return null;

    console.log(`calling applyToTargets for ${actor.name}`);

    console.log(actor.appliedEffects);

    for (const effect of actor.appliedEffects) {
      if (effect.disabled) continue;

      for (const change of effect.changes) {
        const getTarget = effectKeys[change.key];
        if (!getTarget) continue;

        const target = getTarget(actor.system);
        const property = change.key.split(".").at(-1);
        const value = Number(change.value);

        switch (change.type) {
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

  /** @override */
  async _preCreate(data, options, user) {
    await super._preCreate(data, options, user);

    // Force transfer: false for modification effects at the document level
    if (this.type === "modification") {
      this.updateSource({ transfer: false });
    }
  }

  // Some ActiveEffects are designed to target the item only.
  get targetsItem() {
    return this.type === "modification";
  }
}
