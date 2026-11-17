import { QUALITY_DEFINITIONS } from "./quality.logic.mjs";

export const RollModifiers = {
  prepareModifiers(actor, rollContext) {
    const modifiers = [];

    // * applied effects should include custom pipeline for AE
    // todo: double check that
    for (const effect of actor.appliedEffects) {
      const modifier = this.buildEffectModifier(effect, rollContext);
      if (modifier) modifiers.push(modifier);
    }

    /* 
    *  some qualities have passive effects just from wearing an item
    * like talisman - just make sure he bonus is properly calcualted
    todo!: fix the passive 
    */

    if (rollContext.item) {
      for (const quality of rollContext.item.system.qualities ?? []) {
        const mod = buildQualityModifier(
          rollContext.item,
          quality,
          rollContext,
        );
        if (mod) modifiers.push(mod);
      }
    }

    return modifiers;
  },

  /* ---------------------------------- */

  sumActiveModifiers(modifiers, activeState, rollContext) {
    const total = { d: 0, s: 0, t: 0 };
    for (const modifier of modifiers) {
      if (!activeState[modifier.id]) continue;

      const delta = modifier.getDelta(rollContext) ?? {};
      total.d += delta.d ?? 0;
      total.s += delta.s ?? 0;
      total.t += delta.t ?? 0;
    }
    return total;
  },

  /* ---------------------------------- */
  /*        Active Effects source       */
  /* ---------------------------------- */

  // veryfing scope of modification
  matchesScope(scope, rollContext) {
    if (!scope) return false;
    // skill in roll context - if not in scope, return falses
    if (scope.actionTypes && !scope.actionTypes.includes(rollContext.skill))
      return false;
    if (scope.skills && !scope.skills.includes(rollContext.skill)) return false;
    /* ---------------------------------- */
    return true;
  },

  /* ---------------------------------- */

  buildEffectModifier(effect, rollContext) {
    // Utilizing flags for active effect to check if it should be add as modifier
    //todo: look for alternatives, incorporate all ?

    const config = effect.flags?.degnesisnext?.rollModifier;
    if (!config || !this.matchesScope(config.scope, rollContext)) return null;

    return {
      id: effect.id,
      label: effect.name,
      source: "effect",
      origin: effect.uuid,
      active: !effect.disabled, // enabled AE → on by default; disabled AE → off, but selectable
      locked: config.locked ?? false,
      getDelta: () => config.modifiers ?? {},
    };
  },

  /* ---------------------------------- */
  /*           Quality source           */
  /* ---------------------------------- */

  buildQualityModifier(item, qualityEntry, rollContext) {
    const definition = QUALITY_DEFINITIONS[qualityEntry.key];
    if (!definition?.onPreRoll) return null;

    return {
      id: `${item.id}.${qualityEntry.key}`,
      label: game.i18n.localize(definition.label),
      source: "quality",
      origin: item.uuid,
      active: qualityEntry.enabled,
      locked: false,
      // called live, not cached — quality may read its own editable values (InputBonus etc.)
      getDelta: (ctx) => definition.onPreRoll(ctx, qualityEntry) ?? {},
    };
  },
};
