/** Special Object for handling actor related foundry methods.
 * Since Foundry do not natevily supports multiple actor types, to avoid clutter those methods are put
 * out of main actor files.
 */

import { Scars } from "../logic/scars.logic.mjs";

export const GroupActorHandlers = {
  /* ---------------------------------- */
  /*           Foundry methods          */
  /* ---------------------------------- */

  /**
   *
   * @param {*} groupActor
   * @param {*} data
   * @param {*} options
   * @param {*} userId
   */

  _onCreate(groupActor, data, options, userId) {},

  /* ---------------------------------- */

  /**
   *
   * @param {*} groupActor
   * @param {*} changed
   * @param {*} options
   * @param {*} userId
   */
  _onUpdate(groupActor, changed, options, userId) {
    this.propagateGroup(groupActor);
  },

  /* ---------------------------------- */

  /**
   *
   * @param {*} groupActor
   * @param {*} operation
   * @param {*} user
   * @returns
   */

  async _onUpdateOperation(groupActor, operation, user) {
    // find changes for group actor
    const diff = operation.updates?.find((u) => u._id === groupActor.id) ?? {};
    const newAlignment = foundry.utils.hasProperty(diff, "system.alignment");
    const newMembers = foundry.utils.hasProperty(diff, "system.members");

    if (newAlignment || newMembers) {
      groupActor.reset();

      for (const member of groupActor.system.memberActors) {
        member.reset();
        member.sheet?.render({ force: true });
      }
    }
    actor.sheet?.render({ force: true });
  },

  /* ---------------------------------- */
  /*           Custom Methods           */
  /* ---------------------------------- */

  async removeMember(groupActor, memberId) {
    // filter current group actor array
    const filtered = groupActor.system.members.filter(
      (x) => x.actor?.id !== memberId,
    );

    await groupActor.update({ "system.members": filtered });
  },

  /* ---------------------------------- */

  /**
   *
   * @param {*} groupActor
   * @param {*} newMemberIds
   */
  async applyAlignmentModifiers(groupActor, newMemberIds = new Set()) {
    const modifierMap = Scars.prepareGroupModifiers(groupActor, newMemberIds);
    const updates = [...modifierMap].map(([actorId, modifiers]) => ({
      _id: actorId,
    }));

    if (updates.length > 0) {
      await groupActor.updateDocuments(updates);
    }
  },

  /* ---------------------------------- */

  /* ---------------------------------- */
  /*           Utils / Helpers          */
  /* ---------------------------------- */

  /**
   * Run prepareData() method for all members in the group.
   * @param {*} group
   * @returns
   */

  async propagateGroup(groupActor) {
    //todo: error notification
    if (!groupActor) {
      return;
    }

    for (const schema of groupActor.system.members) {
      schema.actor.prepareData();
      schema.actor.render(false);
    }
  },
};
