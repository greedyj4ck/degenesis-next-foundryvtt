/*
FOUNDRY VTT SYSTEM IMPLEMENTATION
AUTHOR: GREEDYJ4CK
OG CREW: MOOMAN, DARKHAN, CLEMEVILZZ, KRISTJANLAANE, PABRUVA
*/

import {
  registerSystemKeybindings,
  registerSystemSettings,
} from "./module/settings.mjs";

import {
  preloadHandlebarsTemplates,
  registerHandlebarsHelpers,
} from "./module/templates.mjs";

import { DEGENESIS } from "./module/config.mjs";

import hooks from "./module/hooks/_module.mjs";

// Module Imports
import * as applications from "./module/applications/_module.mjs";
import * as documents from "./module/documents/_module.mjs";
import * as dataModels from "./module/data/_module.mjs";

// documents

// rolls
import * as rolls from "./module/rolls/_module.mjs";

// V13 Compatibility layer
const { Actors, Items } = foundry.documents.collections;
const { ActorSheet, ItemSheet } = foundry.appv1.sheets;

/* import { DEG_Utility } from "./module/utility.js";
import { DegenesisItemSheet } from "./module/item/item-sheet.js";
import { DegenesisItem } from "./module/item/item-degenesis.js";
import { DegenesisCharacterSheet } from "./module/actor/character-sheet.js";
import { DegenesisNPCSheet } from "./module/actor/npc-sheet.js";
import { DegenesisFromHellSheet } from "./module/actor/fromHell-sheet.js";
import { DegenesisAberrantSheet } from "./module/actor/aberrant-sheet.js";
import { DegenesisActor } from "./module/actor/actor-degenesis.js";
import { DegenesisCombat } from "./module/combat-degenesis.js";
import { DegenesisDice } from "./module/dice.js";
import { DegenesisChat } from "./module/chat.js";
import { DegenesisSystemSettings } from "./module/settings.js";
import { DegenesisChatMessage } from "./module/chat-message.js"; // FOR FUTURE CHATMESSAGE FUNCTIONALITY
import ActorConfigure from "./module/apps/actor-configure.js";
import hooks from "./module/hooks/hooks.js";
import { DegenesisCombatTracker } from "./module/apps/combat-tracker.js"; */

/* -------------------------------------------- */
/*  FOUNDRY VTT INITIALIZATION                  */
/* -------------------------------------------- */

// TODO: Add objects later.

globalThis.degenesis = {
  applications,
};

//CONFIG.debug.hooks = true;

CONFIG.Dice.rolls = [rolls.DGNSRoll, rolls.DGNSActionRoll];

// Configuring document class
CONFIG.Actor.documentClass = documents.DegenesisActor;
CONFIG.Item.documentClass = documents.DegenesisItem;

// Configuring data models
CONFIG.Actor.dataModels = dataModels.actor.config;
CONFIG.Item.dataModels = dataModels.item.config;

// Overriding foundry applications with custom ones
CONFIG.ui.pause = applications.ui.DegenesisGamePause;

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

  Actors.registerSheet(
    "degenesis",
    applications.actor.DegenesisCharacterSheet,
    {
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
    }
  );

  Actors.registerSheet("degenesis", applications.actor.DegenesisGroupSheet, {
    types: ["group"],
    makeDefault: true,
    label: "TYPES.Actor.TypeGroupSheet",
    themes: {
      dark: "SETTINGS.UI.FIELDS.colorScheme.dark",
      light: "SETTINGS.UI.FIELDS.colorScheme.light",
    },
  });

  Items.registerSheet("degenesis", applications.item.DegenesisCultureSheet, {
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

  Items.registerSheet("degenesis", applications.item.DegenesisConceptSheet, {
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

  Items.registerSheet("degenesis", applications.item.DegenesisCultSheet, {
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

  /*   loadTemplates([
    // ACTOR CHARACTER SHEET
    "systems/degenesisnext/templates/actor/character/character-attributes-skills-diamonds.html",
    "systems/degenesisnext/templates/actor/character/character-inventory.html",
    "systems/degenesisnext/templates/actor/character/character-advantages.html",
    "systems/degenesisnext/templates/actor/character/character-condition.html",
    "systems/degenesisnext/templates/actor/character/character-combat.html",
    "systems/degenesisnext/templates/actor/character/character-history.html",
    // NPC CHARACTER SHEET
    "systems/degenesisnext/templates/actor/npc/npc-attributes-skills.html",
    "systems/degenesisnext/templates/actor/npc/npc-inventory.html",
    "systems/degenesisnext/templates/actor/npc/npc-advantages.html",
    "systems/degenesisnext/templates/actor/npc/npc-combat.html",
    "systems/degenesisnext/templates/actor/npc/npc-history.html",
    // ABERRANT CHARACTER SHEET
    "systems/degenesisnext/templates/actor/aberrant/aberrant-attributes-skills.html",
    "systems/degenesisnext/templates/actor/aberrant/aberrant-combat.html",
    "systems/degenesisnext/templates/actor/aberrant/aberrant-phenomena.html",
    "systems/degenesisnext/templates/actor/aberrant/aberrant-inventory.html",
    "systems/degenesisnext/templates/actor/aberrant/aberrant-history.html",
    // ITEMS AND OTHER
    "systems/degenesisnext/templates/item/item-header.html",
    "systems/degenesisnext/templates/item/item-header-physical.html",
    "systems/degenesisnext/templates/item/item-header-physical-no-qty.html",
    "systems/degenesisnext/templates/item/item-header-attack.html",
    "systems/degenesisnext/templates/item/item-header-defense.html",
    "systems/degenesisnext/templates/item/item-header-phenomenon.html",
    "systems/degenesisnext/templates/chat/roll-card.html",
    "systems/degenesisnext/templates/apps/combat-tracker.html",
  ]);
 */

  /*
  CONFIG.Item.documentClass = DegenesisItem;
  CONFIG.Combat.documentClass = DegenesisCombat; */

  // ASSIGN CHATMESSAGE CLASS TO THE CONFIG - FOR NOW DEGENESISCHATMESSAGE CLASS WILL BE USED
  // INSTEAD OF DEFAULT FOUNDRY ONE
  /* CONFIG.ChatMessage.documentClass = DegenesisChatMessage;
  CONFIG.ui.combat = DegenesisCombatTracker; */

  // REGISTERING APPS

  /*   game.degenesis = {
    apps: {
      DegenesisCharacterSheet,
      DegenesisFromHellSheet,
      DegenesisNPCSheet,
      DegenesisAberrantSheet,
      DegenesisItemSheet,
      DegenesisChatMessage,
      ActorConfigure,
    },
    entities: {
      DegenesisActor,
      DegenesisItem,
    },
    utility: DEG_Utility,
    config: DEGENESIS,
    dice: DegenesisDice,
    chat: DegenesisChat,
  }; */

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

function _registerDegenesisSheets() {
  /*   Actors.registerSheet("degenesis", DegenesisCharacterSheet, {
    types: ["character"],
    makeDefault: true,
    label: "TYPES.Actor.TypeCharacterSheet",
  });
  Actors.registerSheet("degenesis", DegenesisNPCSheet, {
    types: ["npc"],
    makeDefault: true,
    label: "TYPES.Actor.TypeNpcSheet",
  });
  Actors.registerSheet("degenesis", DegenesisFromHellSheet, {
    types: ["fromhell"],
    makeDefault: true,
    label: "TYPES.Actor.TypeFromHellSheet",
  });
  Actors.registerSheet("degenesis", DegenesisAberrantSheet, {
    types: ["aberrant"],
    makeDefault: true,
    label: "TYPES.Actor.TypeAberrantSheet",
  });

  Items.registerSheet("degenesis", DegenesisItemSheet, { makeDefault: true }); */
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
