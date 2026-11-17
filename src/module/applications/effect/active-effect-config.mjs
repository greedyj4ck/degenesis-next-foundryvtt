/**
 * This is default Foundry VTT file.
 */

import {
  ACTIVE_EFFECT_DURATION_UNITS as DURATION_UNITS,
  ACTIVE_EFFECT_TIME_DURATION_UNITS as TIME_DURATION_UNITS,
} from "@common/constants.mjs";
import {
  DocumentSheetV2,
  HandlebarsApplicationMixin,
} from "../api/_module.mjs";
import FormDataExtended from "../ux/form-data-extended.mjs";
import ActiveEffect from "@client/documents/active-effect.mjs";
import { renderTemplate } from "../handlebars.mjs";

/**
 * @import {ApplicationClickAction} from "../_types.mjs";
 * @import {DataSchema} from "@common/abstract/_types.mjs";
 * @import {DataField} from "@common/data/fields.mjs";
 * @import {EffectChangeData, EffectStartData} from "@common/documents/_types.mjs";
 */

/**
 * The Application responsible for configuring a single ActiveEffect document within a parent Actor or Item.
 * @extends DocumentSheetV2
 * @mixes HandlebarsApplication
 */
export default class ActiveEffectConfig extends HandlebarsApplicationMixin(
  DocumentSheetV2,
) {
  /** @inheritDoc */
  static DEFAULT_OPTIONS = {
    classes: ["active-effect-config"],
    window: {
      contentClasses: ["standard-form"],
      icon: "fa-solid fa-person-rays",
    },
    position: { width: 560 },
    form: { closeOnSubmit: true },
    actions: {
      addChange: ActiveEffectConfig.#onAddChange,
      deleteChange: ActiveEffectConfig.#onDeleteChange,
    },
  };

  /** @override */
  static PARTS = {
    header: { template: "templates/sheets/active-effect/header.hbs" },
    tabs: { template: "templates/generic/tab-navigation.hbs" },
    details: {
      template: "templates/sheets/active-effect/details.hbs",
      scrollable: [""],
    },
    duration: { template: "templates/sheets/active-effect/duration.hbs" },
    changes: {
      template: "templates/sheets/active-effect/changes.hbs",
      templates: ["templates/sheets/active-effect/change.hbs"],
      scrollable: ["ol[data-changes]"],
    },
    footer: { template: "templates/generic/form-footer.hbs" },
  };

  /** @override */
  static TABS = {
    sheet: {
      tabs: [
        { id: "details", icon: "fa-solid fa-book" },
        { id: "duration", icon: "fa-solid fa-clock" },
        { id: "changes", icon: "fa-solid fa-gears" },
      ],
      initial: "details",
      labelPrefix: "EFFECT.TABS",
    },
  };

  /* ----------------------------------------- */

  /** @inheritDoc */
  async _preparePartContext(partId, context) {
    const partContext = await super._preparePartContext(partId, context);
    if (partId in partContext.tabs) partContext.tab = partContext.tabs[partId];
    const effect = this.document;
    switch (partId) {
      case "details":
        partContext.isActorEffect = effect.parent?.documentName === "Actor";
        partContext.isItemEffect = effect.parent?.documentName === "Item";
        partContext.statuses = Object.values(CONFIG.statusEffects).map((s) => ({
          value: s.id,
          label: _loc(s.name),
        }));
        partContext.showIconOptions = Object.entries(
          CONST.ACTIVE_EFFECT_SHOW_ICON,
        )
          .map(([k, value]) => ({
            value,
            label: _loc(`EFFECT.SHOW_ICON.${k.toLowerCase()}`),
          }))
          .reverse();
        break;
      case "duration": {
        partContext.start = await this._prepareStartContext();
        partContext.hasDuration =
          typeof context.source.duration.value === "number";
        const groups = {
          time: _loc("EFFECT.DURATION.UNITS.GROUPS.time"),
          combat: _loc("EFFECT.DURATION.UNITS.GROUPS.combat"),
        };
        partContext.durationUnits = DURATION_UNITS.map((value) => ({
          value,
          label: _loc(`EFFECT.DURATION.UNITS.${value}`),
          group: TIME_DURATION_UNITS.includes(value)
            ? groups.time
            : groups.combat,
        }));
        partContext.expiryEvents = Object.entries(ActiveEffect.EXPIRY_EVENTS)
          .map(([value, label]) => ({ value, label: _loc(label) }))
          .sort((a, b) => a.label.localeCompare(b.label, game.i18n.lang))
          .reduce((events, { value, label }) => {
            events[value] = label;
            return events;
          }, {});
        break;
      }
      case "changes": {
        const fields = effect.system.schema.fields.changes.element.fields;
        const changeTypes = Object.entries(ActiveEffect.CHANGE_TYPES)
          .map(([type, { label }]) => ({ type, label: _loc(label) }))
          .sort((a, b) => a.label.localeCompare(b.label, game.i18n.lang))
          .reduce((types, { type, label }) => {
            types[type] = label;
            return types;
          }, {});
        partContext.changes = await Promise.all(
          foundry.utils
            .deepClone(context.source.changes)
            .map((change, index) => {
              const defaultPriority =
                ActiveEffect.CHANGE_TYPES[change.type]?.defaultPriority;
              return this._renderChange({
                change,
                index,
                fields,
                defaultPriority,
                changeTypes,
              });
            }),
        );
        break;
      }
      case "footer":
        partContext.buttons = [
          {
            type: "submit",
            icon: "fa-solid fa-floppy-disk",
            label: "EFFECT.Submit",
          },
        ];
        break;
      case "tabs":
        partContext.tabClasses = "top-tabs";
        break;
    }
    return partContext;
  }

  /* ----------------------------------------- */

  /**
   * Prepare render context for a single change object.
   * @param {object} context                   Data for rendering the change row
   * @param {EffectChangeData} context.change  A copy of the change from the Effect's source array
   * @param {number} context.index             The change object's index in the array
   * @param {DataSchema} context.fields        The defined fields of the change data
   * @param {number} context.defaultPriority   The change type's default priority
   * @param {Record<string, string>} context.changeTypes All change types and their localized labels
   * @returns {Promise<string>}
   * @protected
   */
  async _renderChange(context) {
    const { change, index } = context;
    if (typeof change.value !== "string")
      change.value = JSON.stringify(change.value);
    Object.assign(
      change,
      ["key", "type", "value", "priority"].reduce((paths, fieldName) => {
        paths[`${fieldName}Path`] = `system.changes.${index}.${fieldName}`;
        return paths;
      }, {}),
    );
    return (
      ActiveEffect.CHANGE_TYPES[change.type].render?.(context) ??
      renderTemplate("templates/sheets/active-effect/change.hbs", context)
    );
  }

  /* ----------------------------------------- */

  /**
   * Prepare display context for {@link EffectStartData}.
   * @returns {object}
   * @protected
   */
  async _prepareStartContext() {
    const effect = this.document;
    const start = effect._source.start;
    if (!start) return null;
    const time = game.time.calendar.format(
      game.time.worldTime - start.time,
      "ago",
    );
    const combat = effect.start.combat ?? null;
    const combatant = combat?.combatants.get(start.combatant) ?? null;
    const combatantName = combatant?.visible ? combatant.name : "???";
    const combatantInitiative =
      combatant?.visible === false
        ? "???"
        : typeof combatant?.initiative === "number"
          ? combatant.initiative
          : _loc("EFFECT.START.NoInitiative");
    return {
      ...start,
      time,
      combat,
      combatant,
      combatantName,
      combatantInitiative,
    };
  }

  /* -------------------------------------------- */

  /** @inheritDoc */
  _processFormData(event, form, formData) {
    const submitData = super._processFormData(event, form, formData);
    if (!foundry.utils.isPlainObject(submitData.system?.changes))
      return submitData;
    for (const [index, change] of Object.values(
      submitData.system.changes,
    ).entries()) {
      this._processChangeSubmission(change, index);
    }
    return submitData;
  }

  /* -------------------------------------------- */

  /**
   * Process submission data for a single change object.
   * @param {EffectChangeData} change The submitted change object with the value deserialized
   * @param {number} index            The object's index in the submitted array
   * @protected
   */
  _processChangeSubmission(change, index) {
    try {
      if (typeof change.value === "string")
        change.value &&= JSON.parse(change.value);
    } catch {}
  }

  /* -------------------------------------------- */
  /*  Life-Cycle Handlers                         */
  /* -------------------------------------------- */

  /** @inheritDoc */
  _onChangeForm(formConfig, event) {
    super._onChangeForm(formConfig, event);

    // Update the priority placeholder to match the mode selection
    if (
      foundry.utils.isElementInstanceOf(event.target, "select") &&
      event.target.name.endsWith(".type")
    ) {
      const typeSelect = event.target;
      const selector = `input[name="${typeSelect.name.replace(/\.type$/, ".priority")}"]`;
      const priorityInput = typeSelect.closest("li").querySelector(selector);
      priorityInput.placeholder =
        ActiveEffect.CHANGE_TYPES[typeSelect.value]?.defaultPriority ?? "";
    }
  }

  /**
   * Add a new change to the Effect's changes array.
   * @this {ActiveEffectConfig}
   * @type {ApplicationClickAction}
   */
  static async #onAddChange() {
    const submitData = this._processFormData(
      null,
      this.form,
      new FormDataExtended(this.form),
    );
    const changes = Object.values(submitData.system?.changes ?? {});
    changes.push(
      this.document.system.schema.fields.changes.element.getInitialValue(),
    );
    return this.submit({ updateData: { system: { changes } } });
  }

  /* ----------------------------------------- */

  /**
   * Delete a change from the effect's changes array.
   * @this {ActiveEffectConfig}
   * @type {ApplicationClickAction}
   */
  static async #onDeleteChange(event) {
    const submitData = this._processFormData(
      null,
      this.form,
      new FormDataExtended(this.form),
    );
    const changes = Object.values(submitData.system.changes);
    const row = event.target.closest("li");
    const index = Number(row.dataset.index) || 0;
    changes.splice(index, 1);
    return this.submit({ updateData: { system: { changes } } });
  }
}
