import BasePopover from "./base/base.popover.mjs";

const icons = {};

export default class MovementPopover extends BasePopover {
  static tagName = "dgns-movement";

  _buttonContent() {
    return `<i class="di di-movement"></i><span>${this.system.general.movement}</span>`;
  }

  _panelContent() {
    //todo: finish the panel content
    return [this._row(`Movement:  ${this.system.general.movement}`)];
  }
}
