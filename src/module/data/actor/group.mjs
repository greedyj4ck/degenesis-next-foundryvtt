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

import { Scars } from "../../logic/scars.mjs";

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

  get memberActors() {
    return this.members.map((entry) => entry.actor).filter(Boolean);
  }

  // not quite sure this is needed but, who knows
  // the foreign document fields should resolve themselves
  get memberConcepts() {
    return this.memberActors
      .map((actor) => actor.system.concept ?? "")
      .filter(Boolean);
  }
}
