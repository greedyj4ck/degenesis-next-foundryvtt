// REGISTERING ALL THE NECESSARY HOOKS

import actorHooks from "./hooks-actor.js";
import chatHooks from "./hooks-chat.js";
//import contextHooks from "./context.js";
import tokenOverrides from "./hooks-tokenOverrides.js";
import itemHooks from "./hooks-item.js";
import handlebars from "./hooks-handlebars.js";
import diceSoNiceHooks from "./hooks-dsn.js";
import uiHooks from "./hooks-ui.js";

export default function () {
  actorHooks();
  itemHooks();
  chatHooks();
  //contextHooks();
  tokenOverrides();
  handlebars();
  diceSoNiceHooks();
  uiHooks();
}
