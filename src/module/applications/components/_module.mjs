/**
 * Custom HTML Elements based on DND5E Implementation
 */
import SlideToggleElement from "./slide-toggle.mjs";
import CheckboxElement from "./checkbox.mjs";
import DiscomfortElement from "./discomfort.mjs";
import VisionElement from "./vision.mjs";
import PrimalFocusSwitch from "./primal-focus.mjs";
import FaithWillSwitch from "./faith-willpower.mjs";
import SectionToggleElement from "./section-toggle.mjs";
import DieElement from "./die.mjs";

import MovementPopover from "./movement.popover.mjs";
import EncumbrancePopover from "./encumbrance.popover.mjs";

// todo: check if they can be moved later to DEFAULT_OPTIONS of mixins.

window.customElements.define(CheckboxElement.tagName, CheckboxElement);
window.customElements.define(SlideToggleElement.tagName, SlideToggleElement);
window.customElements.define(VisionElement.tagName, VisionElement);
window.customElements.define(DiscomfortElement.tagName, DiscomfortElement);
window.customElements.define(PrimalFocusSwitch.tagName, PrimalFocusSwitch);
window.customElements.define(FaithWillSwitch.tagName, FaithWillSwitch);
window.customElements.define(
  SectionToggleElement.tagName,
  SectionToggleElement,
);

window.customElements.define(DieElement.tagName, DieElement);
/* ---------------------------------- */
window.customElements.define(MovementPopover.tagName, MovementPopover);
window.customElements.define(EncumbrancePopover.tagName, EncumbrancePopover);

export {
  CheckboxElement,
  SlideToggleElement,
  VisionElement,
  DiscomfortElement,
  PrimalFocusSwitch,
  FaithWillSwitch,
  SectionToggleElement,
  DieElement,
  /* ---------------------------------- */
  MovementPopover,
  EncumbrancePopover,
};
