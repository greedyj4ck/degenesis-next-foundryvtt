export default function () {
  Hooks.on("renderChatMessageHTML", async (message, html, context) => {
    /*     const color = html.style.borderColor;
    html.style.setProperty("--dgns-speaker-color", color);
    html.style.border = "none"; */

    const template = document.createElement("template");
    template.innerHTML = message.content;

    template.content.querySelectorAll(".dgns-die").forEach((host) => {
      const die = document.createElement("dgns-die");
      die.setAttribute("value", host.dataset.value);
      host.replaceWith(die);
    });

    message.content = template.innerHTML;

    console.log(template);

    console.log(message);
    console.log(html);

    if (!message.rolls || message.rolls.length === 0) return;
  });
}
