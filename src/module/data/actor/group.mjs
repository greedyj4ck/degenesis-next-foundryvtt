const {
  SchemaField,
  NumberField,
  StringField,
  BooleanField,
  ArrayField,
  SetField,
  ForeignDocumentField,
  IntegerSortField,
  HTMLField,
} = foundry.data.fields;

const { BaseItem, BaseActor } = foundry.documents;

import { Scars } from "../../logic/scars.logic.mjs";

export default class GroupData extends foundry.abstract.TypeDataModel {
  /** @inheritdoc */
  static _systemType = "group";

  static defineSchema() {
    return {
      description: new HTMLField({ initial: "" }),
      members: new ArrayField(
        new SchemaField({
          actor: new ForeignDocumentField(
            BaseActor,
            {
              nullable: true,
              idOnly: false, // Returns full Item document
            },
            { label: "DGNS.GENERAL.members" },
          ),
          isNew: new BooleanField({ initial: true }),
        }),
      ),

      // Storing Alignment
      alignment: new StringField({
        required: false,
        blank: true,
        initial: "",
        choices: Scars.AlignmentsOptions,
        label: "DGNS.ALIGNMENT.alignment",
      }),

      infamy: new NumberField({
        label: "DGNS.ALIGNMENT.infamy",
        min: 0,
        max: 6,
        initial: 0,
        integer: true,
      }),

      scars: new SchemaField(
        {
          current: new NumberField({
            integer: true,
            min: 0,
          }),
          spent: new NumberField({
            integer: true,
            min: 0,
          }),
        },
        { label: "DGNS.ALIGNMENT.scars" },
      ),

      milestones: new ArrayField(
        new SchemaField({
          id: new StringField({
            required: true,
            initial: () => foundry.utils.randomID(),
          }),
          label: new StringField({
            required: true,
            initial: "Milestone",
          }),
          description: new HTMLField({ label: "DGNS.GENERAL.description" }),
          achieved: new BooleanField({ initial: false }),
          awardedEgo: new BooleanField({ initial: false }),
          awardedScar: new BooleanField({ initial: false }),
        }),
        { initial: [] },
      ),

      // For specific alignment
      revengeTarget: new StringField({
        required: false,
        blank: true,
        initial: "",
        label: "DGNS.GENERAL.revengeTarget",
      }),
    };
  }

  /* ---------------------------------- */
  /*          Data Preparation          */
  /* ---------------------------------- */

  prepareDerivedData() {
    this.modifiersByActor = {};

    if (!this.alignment) {
      for (const actor of this.memberActors) {
        this.modifiersByActor[actor.id] = [];
      }
      return;
    }

    const concepts = this.memberConcepts; // grab all concepts from group members

    for (const entry of this.members) {
      const actor = entry.actor;
      if (!actor) continue;

      const concept = actor.system.concept?.id ?? "";
      const isNew = entry.isNew;

      this.modifiersByActor[actor.id] = Scars.prepareAligmentModifiers(
        concept,
        this.alignment,
        concepts,
        isNew,
      );
    }
  }

  /* ---------------------------------- */
  /*          Getters & Helpers         */
  /* ---------------------------------- */

  get hasAlignment() {
    return !!this.alignment;
  }
  /* ---------------------------------- */

  get memberActors() {
    return this.members.map((entry) => entry.actor).filter(Boolean);
  }
  /* ---------------------------------- */
  get memberConcepts() {
    return this.memberActors
      .map((actor) => actor.system.concept ?? "")
      .filter(Boolean);
  }

  getModifiersForActor(actorId) {
    return this.modifiersByActor?.[actorId] ?? [];
  }
}
