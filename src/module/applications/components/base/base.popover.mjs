import StyleSheetMixin from "../stylesheet-mixin.mjs";

export default class BasePopover extends StyleSheetMixin(HTMLElement) {
  /** @override */
  static CSS = ``;

  #controller;

  get document() {
    const app = foundry.applications.instances.get(
      this.closest(".application")?.id,
    );
    return app?.document ?? fromUuidSync(this.getAttribute("uuid"));
  }

  get system() {
    return this.document?.system;
  }

  /* -------------- Hooks ------------- */

  _buttonContent() {
    return "";
  }

  _panelContent() {
    return [];
  }

  connectedCallback() {
    this._adoptStyleSheet(this._getStyleSheet());

    const button = document.createElement("button");
    button.type = "button";
    button.className = "popover-button";
    button.innerHTML = this._buttonContent();

    const panel = document.createElement("div");
    panel.className = "popover-panel";
    panel.append(...this._panelContent());

    this.replaceChildren(button, panel);

    const { signal } = (this.#controller = new AbortController());
    button.addEventListener("click", () => panel.classList.toggle("active"), {
      signal,
    });

    document.addEventListener(
      "click",
      (ev) => {
        if (!this.contains(ev.target)) panel.classList.remove("active");
      },
      { signal },
    );
  }

  disconnectedCallback() {
    this.#controller?.abort();
  }

  /** Small helper for building text rows. */
  _row(text, className = "") {
    const el = document.createElement("div");
    el.className = className;
    el.textContent = text;
    return el;
  }
}
