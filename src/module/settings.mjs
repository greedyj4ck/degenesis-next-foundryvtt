// DEGENESIS SYSTEM SETTINGS MODULE
// USED FOR REGISTERING GAME SYSTEM SETTINGS

// Data models
import SubliminalsSettingsData from "./data/settings/subliminals.mjs";

// Applications
import DGNSRulesSettings from "./applications/settings/rules.settings.mjs";
import DGNSSubliminalsSettings from "./applications/settings/subliminals.settings.mjs";

export function registerSystemSettings() {
  // 1. Register settings, to create proper data config structure.

  game.settings.register(
    CONFIG.DEGENESIS.id,
    CONFIG.DEGENESIS.settings.gameConfig.subliminals,
    {
      scope: "world",
      type: SubliminalsSettingsData,
      config: false,
    },
  );
  // 2. Register handling application

  game.settings.registerMenu(CONFIG.DEGENESIS.id, "DGNSRulesSettings", {
    name: "Rules", //game.i18n.localize("DAGGERHEART.SETTINGS.Menu.automation.name"),
    label: "Katharsys", // game.i18n.localize("DAGGERHEART.SETTINGS.Menu.automation.label"),
    hint: "Tinker with core Katharsys settings, enable / disable basic automations.", //game.i18n.localize("DAGGERHEART.SETTINGS.Menu.automation.hint"),
    icon: "fa-cog",
    type: DGNSSubliminalsSettings,
    restricted: true,
  });

  game.settings.registerMenu(CONFIG.DEGENESIS.id, "DGNSSubliminalMessages", {
    name: "Subliminals", //game.i18n.localize("DAGGERHEART.SETTINGS.Menu.automation.name"),
    label: "Subliminals", // game.i18n.localize("DAGGERHEART.SETTINGS.Menu.automation.label"),
    hint: "Core module for displaying random subliminal messages during scene transitions.", //game.i18n.localize("DAGGERHEART.SETTINGS.Menu.automation.hint"),
    icon: "fa-cog",
    type: DGNSSubliminalsSettings,
    restricted: true,
  });

  // AUTOMATIC ENCUMBRANCE CALCULATION SWITCH FOR STANDARD ROLLS

  /*   game.settings.register(system, "AutomateEncumbrancePenalty", {
    name: "DGNS.SettingsEncumbrancePenalty",
    hint: "DGNS.SettingsEncumbrancePenaltyHelper",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
    onChange: () => {
      location.reload();
    },
  }); */

  // ALLOW ROLLS WITH MINIMUM ONE ACTION NUMBER

  /*   game.settings.register(system, "MinimumOneAN", {
    name: "DGNS.SettingsMinimumOneAN",
    hint: "DGNS.SettingsMinimumOneANHelper",
    scope: "world",
    config: true,
    type: Boolean,
    default: true,
  }); */

  /*   game.settings.register(system, "ShowInventoryHeaders", {
    name: "DGNS.SettingsShowInventoryHeaders",
    hint: "DGNS.SettingsShowInventoryHeadersHelper",
    scope: "world",
    config: true,
    type: Boolean,
    default: false,
    onChange: () => {
      location.reload();
    },
  }); */

  console.log(
    `%cDEGENESIS NEXT` + `%c | Settings registered.`,
    "color: #ed1d27",
    "color: unset",
  );
}

export function registerSystemKeybindings() {
  // AUTOMATIC ENCUMBRANCE CALCULATION SWITCH FOR STANDARD ROLLS

  game.keybindings.register(system, "skipDialogNormal", {
    name: "KEYBINDINGS.DGNS.SkipDialogNormal",
    editable: [{ key: "ShiftLeft" }, { key: "ShiftRight" }],
  });

  console.log(
    `%cDEGENESIS` + `%c | Keybindings registered.`,
    "color: #ed1d27",
    "color: unset",
  );
}

export const AutomateEncumbrancePenalty = () => {
  return game.settings.get(system, "AutomateEncumbrancePenalty");
};

export const MinimumOneAN = () => {
  return game.settings.get(system, "MinimumOneAN");
};

export const ShowInventoryHeaders = () => {
  return game.settings.get(system, "ShowInventoryHeaders");
};
