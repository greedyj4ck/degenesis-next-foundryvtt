// system/module/scene-flash.mjs

const SCENE_FLASH_DEFAULTS = {
  enabled: true,
  chance: 0.4,
  duration: 3000,
  fadeIn: 400,
  fadeOut: 600,
};

function getConfig() {
  return {
    enabled: game.settings.get("your-system-id", "sceneFlash.enabled"),
    chance: game.settings.get("your-system-id", "sceneFlash.chance"),
    duration: game.settings.get("your-system-id", "sceneFlash.duration"),
    fadeIn: SCENE_FLASH_DEFAULTS.fadeIn,
    fadeOut: SCENE_FLASH_DEFAULTS.fadeOut,
  };
}

function getImages() {
  try {
    return JSON.parse(game.settings.get("your-system-id", "sceneFlash.images"));
  } catch {
    return [];
  }
}

function showFlashOverlay(imageSrc, config) {
  // Remove any existing overlay (e.g. rapid scene switches)
  document.getElementById("system-scene-flash")?.remove();

  const overlay = document.createElement("div");
  overlay.id = "system-scene-flash";
  overlay.style.cssText = `
    position: fixed;
    inset: 0;
    z-index: 9999;
    background: #000 url("${imageSrc}") center/cover no-repeat;
    opacity: 0;
    transition: opacity ${config.fadeIn}ms ease-in;
    pointer-events: none;
  `;

  document.body.appendChild(overlay);

  requestAnimationFrame(() =>
    requestAnimationFrame(() => {
      overlay.style.opacity = "1";
    }),
  );

  setTimeout(() => {
    overlay.style.transition = `opacity ${config.fadeOut}ms ease-out`;
    overlay.style.opacity = "0";
    overlay.addEventListener("transitionend", () => overlay.remove(), {
      once: true,
    });
  }, config.duration);
}

export function maybeShowSceneFlash() {
  const config = getConfig();
  if (!config.enabled) return;

  const images = getImages();
  if (!images.length) return;

  if (Math.random() >= config.chance) return;

  const src = images[Math.floor(Math.random() * images.length)];
  showFlashOverlay(src, config);
}

export function registerSceneFlashSettings(systemId) {
  const register = (key, setting) =>
    game.settings.register(systemId, `sceneFlash.${key}`, setting);

  register("enabled", {
    name: "SCENE_FLASH.SettingEnabled",
    hint: "SCENE_FLASH.SettingEnabledHint",
    scope: "world",
    config: true,
    type: Boolean,
    default: SCENE_FLASH_DEFAULTS.enabled,
  });

  register("chance", {
    name: "SCENE_FLASH.SettingChance",
    hint: "SCENE_FLASH.SettingChanceHint",
    scope: "world",
    config: true,
    type: Number,
    range: { min: 0, max: 1, step: 0.05 },
    default: SCENE_FLASH_DEFAULTS.chance,
  });

  register("duration", {
    name: "SCENE_FLASH.SettingDuration",
    hint: "SCENE_FLASH.SettingDurationHint",
    scope: "world",
    config: true,
    type: Number,
    range: { min: 500, max: 10000, step: 500 },
    default: SCENE_FLASH_DEFAULTS.duration,
  });

  register("images", {
    name: "SCENE_FLASH.SettingImages",
    hint: "SCENE_FLASH.SettingImagesHint",
    scope: "world",
    config: true,
    type: String,
    default: "[]",
  });
}
