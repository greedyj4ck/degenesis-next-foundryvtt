/**
 * Custom HTML Elements based on DND5E Implementation
 */

import CheckboxElement from "./checkbox.mjs";
import DiscomfortElement from "./discomfort.mjs";
import SlideToggleElement from "./slide-toggle.mjs";
import VisionElement from "./vision.mjs";

window.customElements.define("dgns-checkbox", CheckboxElement);
window.customElements.define("dgns-slidetoggle", SlideToggleElement);
window.customElements.define("dgns-vision", VisionElement);
window.customElements.define("dgns-discomfort", DiscomfortElement);

export {
  CheckboxElement,
  SlideToggleElement,
  VisionElement,
  DiscomfortElement,
};
