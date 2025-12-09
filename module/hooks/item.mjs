/** import Hooks from @common/as */
export default function RegisterItemHooks() {
  /** Sync changes to actors  */
  // todo: move it to ItemDocument module ?

  Hooks.on("updateItem", async (item, changed, options, userId) => {
    // Checking if document can sync
    if (item.system.isSyncable) {
      // Synced item update loop
      for (const actor of game.actors) {
        const usesItem = actor.system[item.type]?.id === item.id;
        if (usesItem) {
          actor.prepareData(); // resolve() uses fresh world item
          actor.render(false);
        }
      }
    }
  });
}
