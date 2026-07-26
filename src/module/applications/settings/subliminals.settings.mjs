const { HandlebarsApplicationMixin, ApplicationV2 } = foundry.applications.api;

import { SubliminalsSettingsData } from "../../data/settings/_module.mjs";

export default class DGNSSubliminalsSettings extends HandlebarsApplicationMixin(
  ApplicationV2,
) {
  constructor() {
    super({});

    this.settings = new SubliminalsSettingsData(
      game.settings
        .get(
          CONFIG.DEGENESIS.id,
          CONFIG.DEGENESIS.settings.gameConfig.subliminals,
        )
        .toObject(),
    );
  }

  get title() {
    return game.i18n.localize("SETTINGS.APP.title");
  }

  static DEFAULT_OPTIONS = {
    tag: "form",
    id: "dgns-settings-subliminals",
    classes: ["dgns-settings", "dialog", "setting"],
    position: { width: "600", height: "auto" },
    window: {
      icon: "fa-solid fa-gears",
    },
    actions: {
      reset: this.reset,
      save: this.save,
    },
    form: { handler: this.updateData, submitOnChange: true },
  };

  static PARTS = {
    sheetTitle: {
      template: "systems/degenesisnext/templates/shared/sheet/title.bar.hbs", // without input field
    },

    subliminals: {
      template: "systems/degenesisnext/templates/settings/subliminals.hbs", // without input field
    },

    /*  tabs: {
      template:
        "systems/daggerheart/templates/sheets/global/tabs/tab-navigation.hbs",
    }, */

    sheetFooter: {
      template: "systems/degenesisnext/templates/shared/sheet/footer.hbs",
    },
  };

  /** @inheritdoc */
  static TABS = {
    /* main: {
      tabs: [{ id: "general" }, { id: "deathMoves" }, { id: "roll" }],
      initial: "general",
      labelPrefix: "DAGGERHEART.GENERAL.Tabs",
    }, */
  };

  async _prepareContext(_options) {
    const context = await super._prepareContext(_options);
    context.settingFields = this.settings;

    console.log(`Settings context:`);
    console.dir(context);

    return context;
  }

  static async updateData(event, element, formData) {
    const updatedSettings = foundry.utils.expandObject(formData.object);

    await this.settings.updateSource(updatedSettings);
    this.render();
  }

  static async reset() {
    this.settings = new SubliminalsSettingsData();
    this.render();
  }

  static async save() {
    await game.settings.set(
      CONFIG.DEGENESIS.id,
      CONFIG.DEGENESIS.settings.gameConfig.subliminals,
      this.settings.toObject(),
    );
    this.close();
  }
}
