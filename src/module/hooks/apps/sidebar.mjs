export default function () {
  Hooks.on("renderSidebar", async (app, html) => {
    console.log("hooks.js renderSidebar", { app, html });

    /** Disable forced theming for V12 compatibility layer */

    const content = html.querySelector("#sidebar-content");

    for (let section of content.childNodes) {
      section.classList.remove("themed", "theme-light", "theme-dark");
    }

    /*
    const tabsArray = [...html.firstElementChild.children];

    console.log(tabsArray);

    tabsArray.forEach((tab) => {
      let name = tab.getAttribute("data-tab");

      if (name) {
        let icon = document.createElement("div");
        icon.classList.add("sidebar-icon");
        let svg = fetch(`systems/degenesisnext/ui/icons/sidebar/${name}.svg`)
          .then((r) => r.text())
          .then((text) => (icon.innerHTML = text));

        tab.children[0].replaceWith(icon);
      }
    });  */
  });

  Hooks.on("renderSettings", async (app, html) => {
    console.log("hooks.js renderSettings", { app, html });

    const theme = html.ownerDocument.body.classList.contains("theme-dark")
      ? "dark"
      : "light";
    const info = html.querySelector(".info");

    const badge = document.createElement("section");
    badge.classList.add("dgns", "flexcol");

    badge.innerHTML = `<img src="systems/degenesisnext/ui/logotypes/degenesis-logo-${theme}.svg" data-tooltip="${game.system.title}" alt="${game.system.title}"> `;

    if (info) {
      info.insertAdjacentElement("beforeBegin", badge);
    }
  });

  Hooks.on("renderChatLog", async (app, html) => {
    console.log("hooks.js renderChat", { app, html });
  });
}

/* const details = html.querySelector("#game-details");
const pip = details.querySelector(".system-info .update");
details.querySelector(".system").remove();

const badge = document.createElement("div");
badge.classList.add("dgns", "system-badge");

let svg = fetch("systems/degenesisnext/ui/degenesis-logo.svg")
  .then((r) => r.text())
  .then((text) => (badge.innerHTML = text));

badge.innerHTML = `


`;
if (pip)
  badge
    .querySelector(".system-info")
    .insertAdjacentElement("beforeend", pip);
details.insertAdjacentElement("beforebegin", badge);
}); 
 */
