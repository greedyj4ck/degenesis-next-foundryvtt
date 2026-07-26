//todo: move to system config and retrieve
const ICONS_PATH = "systems/degenesisnext/assets/icons/_defaults/";

/**
 * Todo: add all item definitions later.
 */
export const ITEM_TEMPLATES = {
  default: {
    img: `item.svg`,
  },

  potential: {
    img: `potential.svg`,
    system: {
      origin: "common",
    },
  },

  culture: { img: `culture.svg` },
  concept: { img: `concept.svg` },
  cult: { img: `cult.svg` },
  modification: { img: `modification.svg` },
  weapon: { img: `weapon.svg` },
};

export const ItemHelper = {
  /**
   * Creating item data structure based on templates.
   * @param {*} name
   * @param {*} type
   * @param {*} customData
   * @returns
   */
  prepareItemData(name, type, customData = {}) {
    const template = ITEM_TEMPLATES[type] || ITEM_TEMPLATES.default;
    const defaultName = game.i18n.format("DOCUMENT.New", {
      type: game.i18n.localize(`TYPES.Item.${type}`),
    });

    return {
      name: name || defaultName,
      type: type,
      img: ICONS_PATH + template.img,
      system: { ...template.system, ...customData },
    };
  },

  /**
   * Helper for creating Items on Actor.
   * @param {*} actor
   * @param {{}} [itemName={}]
   * @param {{}} [itemType={}]
   * @param {{}} [customData={}]
   * @returns
   */

  async createActorItem(actor, itemName, itemType, customData = {}) {
    if (!actor) return;
    const item = this.prepareItemData(itemName, itemType, customData);
    return await actor.createEmbeddedDocuments("Item", [item]);
  },
};
