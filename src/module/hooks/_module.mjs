import sidebarApp from "./apps/sidebar.mjs";
import menu from "./apps/menu.mjs";
import pause from "./apps/pause.mjs";
import item from "./item.hooks.mjs";
import actor from "./actor.hooks.mjs";
import hotbar from "./apps/hotbar.mjs";

import chatmessages from "./apps/chat.message.mjs";

export default function () {
  // Foundry Default Applications
  menu();
  pause();
  sidebarApp();

  chatmessages();
  //hotbar();
  // Custom Apps

  // Documents
  item();
  actor();
}
