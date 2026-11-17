import BasePopover from "./base/base.popover.mjs";

const icons = {};

export default class EncumbrancePopover extends BasePopover {
  static tagName = "dgns-encumbrance";

  _buttonContent() {
    return `<i class="di di-movement"></i><span>${this.system.general.encumbrance.current} / ${this.system.general.encumbrance.max}</span>`;
  }

  _panelContent() {
    //todo: finish the panel content
    return [this._row(`Enc:  ${this.system.general.encumbrance.current}`)];
  }
}
