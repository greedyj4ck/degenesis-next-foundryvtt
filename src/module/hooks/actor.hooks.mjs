export default function RegisterActorHooks() {
  Hooks.on("preUpdateActor", (actor, changes, options, userId) => {
    console.log("Actor update triggered:", changes);
    // console.trace();
  });
}
