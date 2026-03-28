/**
 * Helper for managing effects in streamliend way.
 */

export const EffectHelper = {
  async _prepareEffects(doc) {
    const effects = doc.effects;
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
   * @param {*} action
   * @param {*} effectId
   * @returns
   */
  async _manageEffect(doc, action, effectId = null) {
    const effect = doc.effects.get(effectId);
    switch (action) {
      case "create":
        return this._onCreateEffect(doc);
      case "edit":
        return effect?.sheet.render(true);
      case "delete":
        //todo: wrap in prompt
        return effect?.delete();
      case "toggle":
        //todo: verify effect structure
        return effect?.update({ disabled: !effect.disabled });
    }
  },

  async _getEffectSource(doc, effect) {
    if (!effect.origin) return doc.name || doc.documentName;
    if (effect.origin === doc.uuid) return doc.name;

    const source = await fromUuid(effect.origin);

    if (!source) return "unknown";
    if (source.type === "potential") return `${source.name} (potential)`;
    if (source.type === "legacy") return `${source.name} (legacy)`;
    return source.name;
  },

  async _onCreateEffect(doc) {
    const effectData = {
      name: "New Effect",
      img: "icons/svg/aura.svg",
      origin: this.uuid,
      disabled: false,
    };
    return doc.createEmbeddedDocuments("ActiveEffect", [effectData]);
  },
};
