export default function RegisterActorHooks() {
  Hooks.on("preUpdateActor", (actor, changes, options, userId) => {
    // console.trace();
  });
}
