export default class DegenesisGamePause extends foundry.applications.ui
  .GamePause {
  async _prepareContext(_options) {
    return {
      cssClass: game.paused ? "paused" : "",
      icon: "systems/degenesisnext/ui/marauders.svg",
      text: game.i18n.localize("GAME.Paused"),
      spin: false,
    };
  }

  async _renderHTML(context, options) {
    const img = document.createElement("div");
    img.innerHTML = `
    <svg  x="0px" y="0px" viewBox="0 0 150 129.9">
    <path d="M75,129.9L0,0h150L75,129.9z M10,5.8l65,112.6L140,5.8H10z"/>
    <polygon points="104.3,10.7 106.9,15.3 109.8,20.2 108.2,23 102.4,23 96.4,23 99.4,28.2 102.3,33.2 100.6,36.2 94.8,36.2 88.8,36.2 
	91.8,41.4 94.7,46.4 92.9,49.5 87.3,49.5 81.3,49.5 84.3,54.7 87.1,59.5 75.1,80.4 63,59.5 65.8,54.7 68.8,49.5 62.8,49.5 
	57.2,49.5 55.4,46.4 58.3,41.4 61.3,36.2 55.3,36.2 49.5,36.2 47.8,33.2 50.7,28.2 53.7,23 47.7,23 41.9,23 40.3,20.2 43.2,15.3 
	45.8,10.7 18.4,10.7 75.1,108.9 131.7,10.7 "/>
    </svg>`;

    if (context.spin) img.classList.add("fa-spin");
    const caption = document.createElement("figcaption");
    caption.innerText = context.text;
    return [img, caption];
  }
}
