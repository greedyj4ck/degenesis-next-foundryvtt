/**
 * Function to register hook for DSN.
 */

// dice system definition
const SYSTEM = {
  id: "degenesisnext",
  name: "Degenesis (Next)",
};

// dice preset
const DICE_PRESETS = {
  rebirthBlack: {
    system: {
      id: "degenesisnext-black",
      name: "Degenesis (Next) // Black",
      default: true,
    },
    presets: [
      {
        type: "d6",
        modelFile: "systems/degenesisnext/assets/dsn/degenesix_black.gltf",
      },
    ],
    mode: "preffered",
  },
  rebirthWhite: {
    system: {
      id: "degenesisnext-white",
      name: "Degenesis (Next) // White",
    },
    presets: [
      {
        type: "d6",
        modelFile: "systems/degenesisnext/assets/dsn/degenesix_white.gltf",
      },
    ],
    mode: "default",
  },
};

export default function useDSN() {
  Hooks.once("diceSoNiceReady", (dice3d) => {
    // register all predefined themes
    for (const system in DICE_PRESETS) {
      let dice = DICE_PRESETS[system];

      dice3d.addSystem(dice.system, dice.mode);

      // register all die presets for theme

      dice.presets.forEach((die) => {
        dice3d.addDicePreset({
          type: die.type,
          modelFile: die.modelFile,
          system: dice.system.id,
        });
      });
    }
  });
}
