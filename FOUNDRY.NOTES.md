if you're using ContextMenu in AppV2, do it in \_onFirstRender, not \_onRender, or else it might register again sometimes

```js
 /**
   * Actions performed after a first render of the Application.
   * Post-render steps are not awaited by the render process.
   * @param {ApplicationRenderContext} context      Prepared context data
   * @param {RenderOptions} options                 Provided render options
   * @protected
   */
  async _onFirstRender(context, options) {
    await super._onFirstRender(context, options);
    foundry.applications.ui.ContextMenu.create(this, this.element, "[data-document-class]", {hookName: "ItemButtonContext", jQuery: false, fixed: true});
  }

  /**
   * Get context menu entries for item buttons.
   * @returns {ContextMenuEntry[]}
   * @protected
   */
  _getItemButtonContextOptions() {
    return []
  }
```

1: context menu options
\_getContextOptions(item, element) {
const compendiumLocked = item[game.release.generation < 13 ? "compendium" : "collection"]?.locked;
// TODO: Move away from using jQuery in callbacks once V12 support is dropped

    // Standard Options
    const options = [
      {
        name: "DND5E.ItemView",
        icon: '<i class="fas fa-eye"></i>',
        callback: li => this._onAction(li[0], "view")
      },
      {
        name: "DND5E.ContextMenuActionEdit",
        icon: "<i class='fas fa-edit fa-fw'></i>",
        condition: () => item.isOwner && !compendiumLocked,
        callback: li => this._onAction(li[0], "edit")
      },
      {
        name: "DND5E.ContextMenuActionDuplicate",
        icon: "<i class='fas fa-copy fa-fw'></i>",
        condition: () => item.canDuplicate && item.isOwner && !compendiumLocked,
        callback: li => this._onAction(li[0], "duplicate")
      },
      {
        name: "DND5E.ContextMenuActionDelete",
        icon: "<i class='fas fa-trash fa-fw'></i>",
        condition: () => item.canDelete && item.isOwner && !compendiumLocked,
        callback: li => this._onAction(li[0], "delete")
      },
      {
        name: "DND5E.DisplayCard",
        icon: '<i class="fas fa-message"></i>',
        callback: () => item.displayCard()
      },
      {
        name: "DND5E.Scroll.CreateScroll",
        icon: '<i class="fa-solid fa-scroll"></i>',
        callback: async li => {
          const scroll = await Item5e.createScrollFromSpell(item);
          if ( scroll ) Item5e.create(scroll, { parent: this.actor });
        },
        condition: li => (item.type === "spell") && !item.getFlag("dnd5e", "cachedFor") && this.actor?.isOwner
          && !this.actor?.[game.release.generation < 13 ? "compendium" : "collection"]?.locked,
        group: "action"
      },
      {
        name: "DND5E.ConcentrationBreak",
        icon: '<dnd5e-icon src="systems/dnd5e/icons/svg/break-concentration.svg"></dnd5e-icon>',
        condition: () => this.actor?.concentration?.items.has(item),
        callback: () => this.actor?.endConcentration(item),
        group: "state"
      }
    ];

    if ( !this.actor || (this.actor.type === "group") ) return options;

    // Toggle Attunement State
    if ( item.system.attunement ) {
      options.push({
        name: item.system.attuned ? "DND5E.ContextMenuActionUnattune" : "DND5E.ContextMenuActionAttune",
        icon: "<i class='fas fa-sun fa-fw'></i>",
        condition: () => item.isOwner && !compendiumLocked,
        callback: li => this._onAction(li[0], "attune"),
        group: "state"
      });
    }

    // Toggle Equipped State
    if ( "equipped" in item.system ) options.push({
      name: item.system.equipped ? "DND5E.ContextMenuActionUnequip" : "DND5E.ContextMenuActionEquip",
      icon: "<i class='fas fa-shield-alt fa-fw'></i>",
      condition: () => item.isOwner && !compendiumLocked,
      callback: li => this._onAction(li[0], "equip"),
      group: "state"
    });

    // Toggle Charged State
    if ( item.hasRecharge ) options.push({
      name: item.isOnCooldown ? "DND5E.ContextMenuActionCharge" : "DND5E.ContextMenuActionExpendCharge",
      icon: '<i class="fa-solid fa-bolt"></i>',
      condition: () => item.isOwner && !compendiumLocked,
      callback: li => this._onAction(li[0], "toggleCharge"),
      group: "state"
    });

    // Toggle Prepared State
    else if ( ("preparation" in item.system) && (item.system.preparation?.mode === "prepared")
      && !item.getFlag("dnd5e", "cachedFor") ) options.push({
      name: item.system?.preparation?.prepared ? "DND5E.ContextMenuActionUnprepare" : "DND5E.ContextMenuActionPrepare",
      icon: "<i class='fas fa-sun fa-fw'></i>",
      condition: () => item.isOwner && !compendiumLocked,
      callback: li => this._onAction(li[0], "prepare"),
      group: "state"
    });

    // Identification
    if ( "identified" in item.system ) options.push({
      name: "DND5E.Identify",
      icon: '<i class="fas fa-magnifying-glass"></i>',
      condition: () => item.isOwner && !compendiumLocked && !item.system.identified,
      callback: () => item.update({ "system.identified": true }),
      group: "state"
    });

    // Toggle Favorite State
    if ( "favorites" in this.actor.system ) {
      const uuid = item.getRelativeUUID(this.actor);
      const isFavorited = this.actor.system.hasFavorite(uuid);
      options.push({
        name: isFavorited ? "DND5E.FavoriteRemove" : "DND5E.Favorite",
        icon: '<i class="fas fa-bookmark fa-fw"></i>',
        condition: () => item.isOwner && !compendiumLocked,
        callback: li => this._onAction(li[0], isFavorited ? "unfavorite" : "favorite"),
        group: "state"
      });
    }

    // Toggle Collapsed State
    if ( this.app.canExpand?.(item) ) {
      const expanded = this.app._expanded.has(item.id);
      options.push({
        name: expanded ? "Collapse" : "Expand",
        icon: `<i class="fas fa-${expanded ? "compress" : "expand"}"></i>`,
        callback: () => element.closest("[data-item-id]")?.querySelector("[data-toggle-description]")?.click(),
        group: "collapsible"
      });
    }

    return options;

}
