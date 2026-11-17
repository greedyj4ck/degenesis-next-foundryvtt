export const CharacterActorHandlers = {
  /* ---------------------------------- */
  /*           Foundry methods          */
  /* ---------------------------------- */

  /**
   *
   * @param {*} groupActor
   * @param {*} operation
   * @param {*} user
   */

  async _onUpdateOperation(character, operation, user) {
    const diff = operation.updates?.find((u) => u._id === actor.id) ?? {};
    const conceptChanged = foundry.utils.hasProperty(
      diff,
      "system.conceptItem",
    );

    const group = character.system.group;
    if (!group) return;

    if (conceptChanged) {
      group.reset(); //force to recalculate modifiers

      //recalculate characters linked to group
      for (const member of group.system.memberActors) {
        if (member.id === actor.id) continue;
        member.reset();
        member.sheet?.render({ force: true });
      }
    }

    group.sheet?.render({ force: true });
  },

  /* ---------------------------------- */
};
