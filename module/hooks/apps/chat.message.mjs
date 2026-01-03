export default function () {
  Hooks.on("renderChatMessageHTML ", async (message, html, context) => {
    console.log(`RenderChatMessage Fired`);
    console.log(message);

    if (!message.rolls || message.rolls.length === 0) return;

    message.rolls.forEach((roll) => {
      roll.dice.forEach((die) => {
        die.results.forEach((r) => {
          // Dodajemy r.img tylko jeśli jeszcze go nie ma
          if (!r.img) {
            r.img = `systems/degenesisnext/ui/dice-faces/d${r.result}.svg`;
          }
        });
      });
    });
    html.addClass("degenesis-roll");
  });
}
