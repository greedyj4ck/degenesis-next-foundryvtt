import DocumentSheetV2Mixin from "../mixin/sheet-v2-mixin.mjs";

export default function ActorSheetV2Mixin(Base) {
  return class ActorSheetV2 extends DocumentSheetV2Mixin(Base) {
    /** Constructor  */

    constructor(object, options = {}) {
      const key = `${object.type}${object.limited ? ":limited" : ""}`;
      const { width, height } =
        game.user.getFlag("degenesis", `actorSheetPrefs.${key}`) ?? {};
      if (width && !("width" in options)) options.width = width;
      if (height && !("height" in options)) options.height = height;

      super(object, options);
    }

    /** Events handling */

    _onResize(event) {
      super._onResize(event);
      const { width, height } = this.position;
      const key = `${this.actor.type}${this.actor.limited ? ":limited" : ""}`;
      game.user.setFlag("degenesis", `actorSheetPrefs.${key}`, {
        width,
        height,
      });
    }
  };
}
