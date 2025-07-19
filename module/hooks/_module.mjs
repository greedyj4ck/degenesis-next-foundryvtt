import sidebarApp from "./apps/sidebar.mjs";
import menu from "./apps/menu.mjs";
import pause from "./apps/pause.mjs";

export default function () {
  menu();
  pause();
  sidebarApp();
}
