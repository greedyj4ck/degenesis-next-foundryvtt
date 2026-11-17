export const Damage = {
  /**
   * Default damage modifiers for items.
   */
  modifiers: {
    T: { blueprint: "+T", calculate: (force, triggers) => triggers },
    F: { blueprint: "+F", calculate: (force, triggers) => force },
    F2: {
      blueprint: "+F/2",
      calculate: (force, triggers) => Math.ceil(force / 2),
    },
    F3: {
      blueprint: "+F/3",
      calculate: (force, triggers) => Math.ceil(force / 3),
    },
    F4: {
      blueprint: "+F/4",
      calculate: (force, triggers) => Math.ceil(force / 4),
    },
    D: {
      blueprint: "+1D",
      calculate: (force, triggers) =>
        new Die({ faces: 6, number: 1 }).evaluate().total,
    },
    "2D": {
      blueprint: "+2D",
      calculate: (force, triggers) =>
        new Die({ faces: 6, number: 2 }).evaluate().total,
    },
    D2: {
      blueprint: "+1D/2",
      calculate: (force, triggers) =>
        Math.ceil(new Die({ faces: 6, number: 1 }).evaluate().total / 2),
    },
  },

  get standardModifiers() {
    return this.modifiers;
  },

  get fromHellModifiers() {
    return {};
  },
};
