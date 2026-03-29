/**
 * Custom HTML Elements based on DND5E Implementation
 */
import SlideToggleElement from "./slide-toggle.mjs";
import CheckboxElement from "./checkbox.mjs";
import DiscomfortElement from "./discomfort.mjs";
import VisionElement from "./vision.mjs";
import PrimalFocusSwitch from "./primal-focus.mjs";
import FaithWillSwitch from "./faith-willpower.mjs";

window.customElements.define("dgns-checkbox", CheckboxElement);
window.customElements.define("dgns-slidetoggle", SlideToggleElement);
window.customElements.define("dgns-vision", VisionElement);
window.customElements.define("dgns-discomfort", DiscomfortElement);
window.customElements.define("dgns-primal-focus", PrimalFocusSwitch);
window.customElements.define("dgns-faith-will", FaithWillSwitch);

export {
  CheckboxElement,
  SlideToggleElement,
  VisionElement,
  DiscomfortElement,
  PrimalFocusSwitch,
  FaithWillSwitch,
};
