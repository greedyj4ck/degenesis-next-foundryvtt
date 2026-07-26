/**
 * Helper for managing effects in streamlined way.
 */

export const EffectHelper = {
  /**
   *
   * Prepare effects for sheet display.
   * Categorises effects into temporary / passive / inactive,
   * resolves their source label, and tags injected mod effects.
   * @param {Document} doc - actor or item owning the effects
   * @returns {object} categories
   */

  async _prepareEffects(doc) {
    let effects;

    if (doc instanceof Actor) {
      const seen = new Set();
      effects = [...doc.effects, ...doc.appliedEffects].filter((e) => {
        if (seen.has(e.id)) return false;
        seen.add(e.id);
        return true;
      });
    } else {
      effects = [...doc.effects];
    }

    const categories = {
      temporary: { label: "Temporary", effects: [] },
      passive: { label: "Active", effects: [] },
      inactive: { label: "Disabled", effects: [] },
    };

    // local cache for origin
    const localSourceCache = new Map();

    // creating
    for (let effect of effects) {
      const origin = effect.origin;
      if (origin && localSourceCache.has(origin)) {
        effect.source = localSourceCache.get(origin);
      } else {
        effect.source = await this._getEffectSource(doc, effect);
        if (origin) localSourceCache.set(origin, effect.source);
      }

      // Tag injected (mod-sourced) effects so the sheet can render them as read-only
      effect.isInjected = !!effect.getFlag(CONFIG.DEGENESIS.id, "injectedFrom");
      effect.injectedFromName =
        effect.getFlag(CONFIG.DEGENESIS.id, "injectedFromName") ?? null;

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
  },

  /**
   * Handling effects for actor.
   * Blocks edit/delete/toggle on injected effects — they are owned by their mod item.
   * @param {*} action
   * @param {*} effectId
   * @returns
   */
  async _manageEffect(doc, action, effectId = null) {
    const effect = doc.effects.get(effectId);

    // Guard: injected effects are read-only — direct them to the source mod
    // todo: mark them on sheet so its easier to see which are editable

    if (effect?.getFlag(CONFIG.DEGENESIS.id, "injectedFrom")) {
      ui.notifications.warn(
        `This effect comes from "${effect.getFlag("dgns", "injectedFromName")}". Edit it on the modification item.`,
      );
      return;
    }

    switch (action) {
      case "create":
        return this._onCreateEffect(doc);
      case "edit":
        return effect?.sheet.render(true);
      case "delete":
        // todo: wrap in confirmation prompt
        return effect?.delete();
      case "toggle":
        // todo: verify effect structure
        return effect?.update({ disabled: !effect.disabled });
    }
  },

  /**
   * Resolve a human-readable source label for an effect.
   * @param {Document} doc
   * @param {ActiveEffect} effect
   * @returns {string}
   */
  async _getEffectSource(doc, effect) {
    if (!effect.origin) return effect.parent.name || doc.documentName;
    if (effect.origin === doc.uuid) return doc.name;

    const source = await fromUuid(effect.origin);

    if (!source) return "unknown";
    if (source.type === "potential") return `${source.name} (potential)`;
    if (source.type === "legacy") return `${source.name} (legacy)`;
    return source.name;
  },

  /**
   * Create a blank effect on the given document.
   * @param {Document} doc
   */

  async _onCreateEffect(doc) {
    const type = doc.type === "modification" ? "modification" : "base";
    const effectData = {
      name: "New Effect",
      img: "icons/svg/aura.svg",
      origin: this.uuid,
      disabled: false,
      type,
    };
    return doc.createEmbeddedDocuments("ActiveEffect", [effectData]);
  },
};
