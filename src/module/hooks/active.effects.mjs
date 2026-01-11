export default function RegisterActiveEffectsHooks() {
  /** Syncing Active Effects between Group Actor and Linked Actors */
  Hooks.on("updateActiveEffect", (effect, changes, options, userId) => {
    const actor = effect.parent;
    if (actor?.type === "group") {
      // Refresh all linked members
      const memberIds = actor.system.memberIds || [];
      memberIds.forEach((id) => {
        const member = game.actors.get(id);
        member?.prepareData(); // Force recalculation
      });
    }
  });
}
