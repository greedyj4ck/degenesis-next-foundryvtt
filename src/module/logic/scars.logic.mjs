/**
 * Based on Articfacts extended shared destiny rules
 */

export const Alignments = {
  ambition: {
    label: "DGNS.ALIGNMENT.ambition.label",
    description: "DGNS.ALIGNMENT.ambition.description",
    affinity: {
      key: "background.bonus",
      value: 1,
      label: "DGNS.ALIGNMENT.ambition.affinity",
      concepts: ["creator", "conqueror", "visionary", "ruler"],
    },
    aversion: {
      key: "background.bonus",
      value: -1,
      label: "DGNS.ALIGNMENT.ambition.aversion",
      concepts: ["defiler", "traditionalist"],
    },
    constellation: {
      key: "special.xpCostMultiplier",
      value: -1,
      label: "DGNS.ALIGNMENT.ambition.constellation",
    },
  },
  loyalty: {
    label: "DGNS.ALIGNMENT.loyalty.label",
    description: "DGNS.ALIGNMENT.loyalty.description",
    affinity: {
      key: "ego.max",
      value: 1,
      label: "DGNS.ALIGNMENT.loyalty.affinity",
      concepts: ["mentor", "protector", "martyr", "healer"],
    },
    aversion: {
      key: "ego.max",
      value: -1,
      label: "DGNS.ALIGNMENT.loyalty.aversion",
      concepts: ["abomination", "ruler"],
    },
    constellation: {
      key: "special.egoSuccessConvert",
      value: 1,
      label: "DGNS.ALIGNMENT.loyalty.constellation",
    },
  },
  chance: {
    label: "DGNS.ALIGNMENT.chance.label",
    description: "DGNS.ALIGNMENT.chance.description",
    affinity: {
      key: "assist.dicebonus",
      value: 1,
      label: "DGNS.ALIGNMENT.chance.affinity",
      concepts: ["adventurer", "traveler", "disciple", "mediator"],
    },
    aversion: {
      key: "assist.dicebonus",
      value: -1,
      label: "DGNS.ALIGNMENT.chance.aversion",
      concepts: ["hermit", "destroyer"],
    },
    constellation: {
      key: "special.groupSkillHalfXP",
      value: 1, //boolean: true
      label: "DGNS.ALIGNMENT.chance.constellation",
    },
  },
  destiny: {
    label: "DGNS.ALIGNMENT.destiny.label",
    description: "DGNS.ALIGNMENT.destiny.description",
    affinity: {
      key: "fleshwounds.max",
      value: 1,
      label: "DGNS.ALIGNMENT.destiny.affinity",
      concepts: ["seeker", "chosen", "zealot", "martyr"],
    },
    aversion: {
      key: "fleshwounds.max",
      value: -1,
      label: "DGNS.ALIGNMENT.destiny.aversion",
      concepts: ["traveler", "adventurer"],
    },
    constellation: {
      key: "trauma.max",
      value: 1,
      label: "DGNS.ALIGNMENT.destiny.constellation",
    },
  },
  dogma: {
    label: "DGNS.ALIGNMENT.dogma.label",
    description: "DGNS.ALIGNMENT.dogma.description",
    affinity: {
      key: "mentalDefence.dicebonus",
      value: 1,
      label: "DGNS.ALIGNMENT.dogma.affinity",
      concepts: ["traditionalist", "zealot", "righteous", "protector"],
    },
    aversion: {
      key: "mentalDefence.dicebonus",
      value: -1,
      label: "DGNS.ALIGNMENT.dogma.aversion",
      concepts: ["heretic", "visionary"],
    },
    constellation: {
      key: "special.rerollFailedMentalDefence",
      value: 1,
      label: "DGNS.ALIGNMENT.dogma.constellation",
    },
  },
  revenge: {
    label: "DGNS.ALIGNMENT.revenge.label",
    description: "DGNS.ALIGNMENT.revenge.description",
    affinity: {
      key: "revenge.dicebonus",
      value: 1,
      label: "DGNS.ALIGNMENT.revenge.affinity",
      concepts: ["defiler", "abomination", "heretic", "destroyer"],
    },

    aversion: {
      key: "revenge.dicebonus",
      value: -1,
      label: "DGNS.ALIGNMENT.revenge.aversion",
      concepts: ["healer", "mediator"],
    },

    constellation: {
      key: "special.rerollRevengeAttempts",
      value: 1,
      label: "DGNS.ALIGNMENT.revenge.constellation",
    },
  },
};

/* ---------------------------------- */

export const Scars = {
  // Generate options for group sheet
  get AlignmentsOptions() {
    const choices = {};
    for (const [k, v] of Object.entries(Alignments)) {
      choices[k] = v.label;
    }
    return choices;
  },

  get Alignments() {
    return Alignments;
  },

  /**
   * Calculates the modifiers based on Actor's data.
   * @param {*} concept
   * @param {*} alignment
   * @param {*} groupConcepts
   * @param {*} isNewMember
   * @returns
   */

  prepareAligmentModifiers(
    concept,
    alignment,
    groupConcepts,
    isNewMember = false,
  ) {
    if (!alignment || concept) return [];

    const base = Alignments[alignment]; // load data from
    if (!base) return [];

    const modifiers = [];
    const inAffinity = base.affinity.concepts.includes(concept);
    const inAversion = base.aversion.concepts.includes(concept);

    if (inAffinity) {
      modifiers.push({
        key: base.affinity.key,
        value: base.affinity.value,
        label: base.affinity.label,
        source: "alignment.affinity",
        tripled: false,
      });
    }

    if (inAversion) {
      modifiers.push({
        key: base.aversion.key,
        value: isNewMember ? base.aversion.value * 3 : base.aversion.value,
        label: base.aversion.label,
        source: "alignment.aversion",
        tripled: isNewMember,
      });
    }

    if (this.isConstellation(base, groupConcepts)) {
      modifiers.push({
        key: base.constellation.key,
        value: base.constellation.value,
        label: base.constellation.label,
        source: "alignment.constellation",
        tripled: false,
      });
    }
    return modifiers;
  },

  /* ------------- Helpers ------------ */

  /**
   * Checking if all of the group members unlocks the constellation feature
   * @param {*} alignment - base alignment data (not just name)
   * @param {*} groupConcepts - array of all group member concepts
   */
  isConstellation(alignment, groupConcepts) {
    const defined = groupConcepts.filter(Boolean); // filtering the array out of false values
    if (defined.length === 0) return false;
    return defined.every((c) => alignment.affinity.concepts.includes(c));
  },

  /* ---------------------------------- */

  /**
   * Sum numeric modifiers matching specific key.
   * @param {*} modifiers
   * @param {*} key
   * @returns
   */
  sumModifier(modifiers, key) {
    return modifiers
      .filter((m) => m.key === key && typeof m.value === "number")
      .reduce((total, m) => total + m.value, 0);
  },

  /* ---------------------------------- */

  /**
   * Checks for a boolean/special flag modifier in modifiers array.
   * @param {*} modifiers
   * @param {*} key
   * @returns
   */
  hasModifierFlag(modifiers, key) {
    return modifiers.some((m) => m.key === key && m.value === true);
  },
};
