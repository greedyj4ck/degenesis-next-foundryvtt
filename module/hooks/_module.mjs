import sidebarApp from "./apps/sidebar.mjs";
import menu from "./apps/menu.mjs";
import pause from "./apps/pause.mjs";
import item from "./item.mjs";
import actor from "./actor.mjs";
import hotbar from "./apps/hotbar.mjs";
import handlebars from "./handlebars.mjs";

export default function () {
  // Foundry Default Applications
  menu();
  pause();
  sidebarApp();
  handlebars();
  //hotbar();

  // Custom Apps

  // Documents
  item();
  actor();
}
