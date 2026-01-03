/*
FOUNDRY VTT SYSTEM IMPLEMENTATION
AUTHOR: GREEDYJ4CK
OG CREW: MOOMAN, DARKHAN, CLEMEVILZZ, KRISTJANLAANE, PABRUVA
*/

import {
  registerSystemKeybindings,
  registerSystemSettings,
} from "./module/settings.mjs";

import { preloadHandlebarsTemplates } from "./module/templates.mjs";
import { registerHandlebarsHelpers } from "./module/handlebars.mjs";

import { DEGENESIS } from "./module/config.mjs";

import hooks from "./module/hooks/_module.mjs";

// Module Imports
import * as applications from "./module/applications/_module.mjs";
import * as documents from "./module/documents/_module.mjs";
import * as dataModels from "./module/data/_module.mjs";

// documents

// rolls
import { DGNSRoll, DGNSCombinationRoll } from "./module/dice/_module.mjs";

// V13 Compatibility layer
const { Actors, Items } = foundry.documents.collections;
const { ActorSheet, ItemSheet } = foundry.appv1.sheets;

/* -------------------------------------------- */
/*  FOUNDRY VTT INITIALIZATION                  */
/* -------------------------------------------- */

// TODO: Add objects later.

globalThis.degenesis = {
  applications,
};

//CONFIG.debug.hooks = true;

CONFIG.Dice.rolls = [DGNSRoll];
CONFIG.Dice.DGNSRoll = DGNSRoll;

// Configuring document class
CONFIG.Actor.documentClass = documents.DGNSActor;
CONFIG.Item.documentClass = documents.DGNSItem;

// Configuring data models
CONFIG.Actor.dataModels = dataModels.actor.config;
CONFIG.Item.dataModels = dataModels.item.config;

// Overriding foundry applications with custom ones
CONFIG.ui.pause = applications.ui.DGNSGamePause;

// Temporary V14 fix
CONFIG.ActiveEffect.phases = {
  initial: { label: "Init" },
  final: { label: "Final" },
};

Hooks.once("init", async function () {
  globalThis.degenesis = game.degenesis = Object.assign(
    game.system,
    globalThis.degenesis
  );

  console.log(
    `%cDEGENESIS` + `%c | Initializing`,
    "color: #ed1d27",
    "color: unset"
  );

  document.onkeydown = function (e) {
    if (e.keyCode == 123)
      console.log(
        `%cDEGENESIS` + `%c | Welcome, Chronicler`,
        "color: #ed1d27",
        "color: unset"
      );
  };

  // Register system settings and keybindings
  //registerSystemSettings();
  //registerSystemKeybindings();

  // Handling compendiums
  _setCompendiumBanners();

  // UI related

  preloadHandlebarsTemplates(); // load all the necessary partials
  registerHandlebarsHelpers(); // load handlebar helpers
  _configureFonts(); // setup global fonts

  CONFIG.Combat.initiative = {
    formula: "0",
    decimals: 0,
  };

  _unregisterCoreSheets();

  Actors.registerSheet("degenesis", applications.actor.DGNSCharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "TYPES.Actor.TypeCharacterSheet",
    themes: {
      dark: "SETTINGS.UI.FIELDS.colorScheme.dark",
      light: "SETTINGS.UI.FIELDS.colorScheme.light",
      // artifacts: "SETTINGS.UI.FIELDS.colorScheme.artifacts",
      // darkBlood: "SETTINGS.UI.FIELDS.colorScheme.darkBlood",
      // lightBlood: "SETTINGS.UI.FIELDS.colorScheme.lightBlood",
    },
  });

  Actors.registerSheet("degenesis", applications.actor.DGNSGroupSheet, {
    types: ["group"],
    makeDefault: true,
    label: "TYPES.Actor.TypeGroupSheet",
    themes: {
      dark: "SETTINGS.UI.FIELDS.colorScheme.dark",
      light: "SETTINGS.UI.FIELDS.colorScheme.light",
    },
  });

  Items.registerSheet("degenesis", applications.item.DGNSCultureSheet, {
    types: ["culture"],
    makeDefault: true,
    label: "TYPES.Item.TypeCultureSheet",
    themes: {
      dark: "SETTINGS.UI.FIELDS.colorScheme.dark",
      light: "SETTINGS.UI.FIELDS.colorScheme.light",
      // darkBlood: "SETTINGS.UI.FIELDS.colorScheme.darkBlood",
      //lightBlood: "SETTINGS.UI.FIELDS.colorScheme.lightBlood",
    },
  });

  Items.registerSheet("degenesis", applications.item.DGNSConceptSheet, {
    types: ["concept"],
    makeDefault: true,
    label: "TYPES.Item.TypeConceptSheet",
    themes: {
      dark: "SETTINGS.UI.FIELDS.colorScheme.dark",
      light: "SETTINGS.UI.FIELDS.colorScheme.light",
      //  artifacts: "SETTINGS.UI.FIELDS.colorScheme.artifacts",
      // darkBlood: "SETTINGS.UI.FIELDS.colorScheme.darkBlood",
      // lightBlood: "SETTINGS.UI.FIELDS.colorScheme.lightBlood",
    },
  });

  Items.registerSheet("degenesis", applications.item.DGNSCultSheet, {
    types: ["cult"],
    makeDefault: true,
    label: "TYPES.Item.TypeCultSheet",
    themes: {
      dark: "SETTINGS.UI.FIELDS.colorScheme.dark",
      light: "SETTINGS.UI.FIELDS.colorScheme.light",
      //artifacts: "SETTINGS.UI.FIELDS.colorScheme.artifacts",
      // darkBlood: "SETTINGS.UI.FIELDS.colorScheme.darkBlood",
      // lightBlood: "SETTINGS.UI.FIELDS.colorScheme.lightBlood",
    },
  });

  hooks();

  // SETTING FONTS FOR USAGE (COULD BE REPLACED WITH CSS?)

  CONFIG.canvasTextStyle = new PIXI.TextStyle({
    fontFamily: "Calluna",
    fontSize: 36,
    fill: "#FFFFFF",
    stroke: "#111111",
    strokeThickness: 1,
    dropShadow: true,
    dropShadowColor: "#000000",
    dropShadowBlur: 4,
    dropShadowAngle: 0,
    dropShadowDistance: 0,
    align: "center",
    wordWrap: false,
  });
});

/* Hooks.once("init", function () {
  CONFIG.debug.hooks = true;
}); */

// HOOK IS FIRED ON SETUP STAGE
Hooks.on("setup", () => {
  for (let group in DEGENESIS) {
    for (let key in DEGENESIS[group])
      if (typeof DEGENESIS[group][key] == "string")
        DEGENESIS[group][key] = game.i18n.localize(DEGENESIS[group][key]);
  }
});

// REGISTER ALL OTHER HOOKS
// hooks();

function _unregisterCoreSheets() {
  Actors.unregisterSheet("core", ActorSheet);
  Items.unregisterSheet("core", ItemSheet);
}

function _setCompendiumBanners() {
  CONFIG.Actor.compendiumBanner =
    "/systems/degenesisnext/ui/packs/actors-comp.webp";
  CONFIG.Adventure.compendiumBanner =
    "/systems/degenesisnext/ui/packs/adventures-comp.webp";
  CONFIG.Cards.compendiumBanner =
    "/systems/degenesisnext/ui/packs/cards-comp.webp";
  CONFIG.Item.compendiumBanner =
    "/systems/degenesisnext/ui/packs/items-comp.webp";
  CONFIG.JournalEntry.compendiumBanner =
    "/systems/degenesisnext/ui/packs/journals-comp.webp";
  CONFIG.Macro.compendiumBanner =
    "/systems/degenesisnext/ui/packs/macros-comp.webp";
  CONFIG.Playlist.compendiumBanner =
    "/systems/degenesisnext/ui/packs/playlists-comp.webp";
  CONFIG.RollTable.compendiumBanner =
    "/systems/degenesisnext/ui/packs/rolltables-comp.webp";
  CONFIG.Scene.compendiumBanner =
    "/systems/degenesisnext/ui/packs/scenes-comp.webp";
}

// TODO: Recheck fonts initialization
function _configureFonts() {
  CONFIG.fontDefinitions = {
    "Crimson Pro": {
      editor: true,
      fonts: [
        {
          urls: [
            "systems/degenesisnext/fonts/CrimsonPro-Variable.ttf",
            "systems/degenesisnext/fonts/-Italic-Variable.ttf",
          ],
        },
      ],
    },
    Montserrat: {
      editor: true,
      fonts: [
        {
          urls: [
            "systems/degenesisnext/fonts/Montserrat-Variable.ttf",
            "systems/degenesisnext/fonts/Montserrat-Italic-Variable.ttf",
          ],
        },
      ],
    },
  };
}
