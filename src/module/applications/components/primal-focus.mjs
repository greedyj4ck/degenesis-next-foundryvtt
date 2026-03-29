import StyleSheetMixin from "./stylesheet-mixin.mjs";

const MODES = {
  primal: {
    value: "primal",
    icon: "di di-primal",
    label: "DGNS.Primal",
    tooltip: "DGNS.PrimalFocusSwitch",
  },
  focus: {
    value: "focus",
    icon: "di di-focus",
    label: "DGNS.Focus",
    tooltip: "DGNS.PrimalFocusSwitch",
  },
};

export default class PrimalFocusSwitch extends StyleSheetMixin(
  foundry.applications.elements.AbstractFormInputElement,
) {
  constructor(...args) {
    super(...args);
    this._internals.role = "switch";
    this._value = this.getAttribute("value") ?? "primal";
    this.#defaultValue = this._value;

    if (this.constructor.useShadowRoot)
      this.#shadowRoot = this.attachShadow({ mode: "open" });
  }

  static tagName = "dgns-primal-focus-switch";

  static useShadowRoot = false;

  static CSS = ``;

  _controller;
  #shadowRoot;
  #defaultValue;

  get defaultValue() {
    return this.#defaultValue;
  }

  get value() {
    return super.value;
  }

  set value(value) {
    if (!MODES[value]) return;
    this._setValue(value);
  }

  get locked() {
    return this.hasAttribute("locked");
  }

  set locked(value) {
    this.toggleAttribute("locked", !!value);
    this._refresh();
  }

  connectedCallback() {
    this._adoptStyleSheet(this._getStyleSheet());
    const elements = this._buildElements();

    if (this.constructor.useShadowRoot) {
      this.#shadowRoot.replaceChildren(...elements);
    } else {
      this.replaceChildren(...elements);
    }

    this._refresh();
    this._activateListeners();
    if (!this.hasAttribute("tabindex")) this.tabIndex = 0;
  }

  disconnectedCallback() {
    this._controller?.abort();
  }

  _adoptStyleSheet(sheet) {
    if (this.constructor.useShadowRoot) {
      this.#shadowRoot.adoptedStyleSheets = [sheet];
    } else {
      this.adoptedStyleSheets = [sheet];
    }
  }

  _buildElements() {
    const title = document.createElement("div");
    title.className = "mode-title";

    title.innerHTML = game.i18n.localize("UI.TITLES.primalFocus");

    const container = document.createElement("div");
    container.className = "mode-switch";

    for (const mode of Object.values(MODES)) {
      const btnContainer = document.createElement("div");
      btnContainer.className = "button-container";

      const btn = document.createElement("button");
      btn.type = "button";
      btn.dataset.mode = mode.value;
      btn.title = mode.tooltip;
      btn.setAttribute("aria-pressed", mode.value === this._value);

      const icon = document.createElement("i");
      icon.className = mode.icon;

      btn.appendChild(icon);
      container.appendChild(btn);

      btn.addEventListener("click", (ev) => {
        ev.preventDefault();
        if (this.locked) return;
        this.value = mode.value;
        this.dispatchEvent(
          new Event("change", { bubbles: true, cancelable: true }),
        );
      });
    }

    return [title, container];
  }

  _activateListeners() {
    const { signal } = (this._controller = new AbortController());

    // Keyboard: left/right arrows toggle between modes
    this.addEventListener(
      "keydown",
      (ev) => {
        if (this.locked) return;
        if (!["ArrowLeft", "ArrowRight"].includes(ev.key)) return;

        ev.preventDefault();
        const modes = Object.keys(MODES);
        const current = modes.indexOf(this._value);
        const next =
          (current + (ev.key === "ArrowRight" ? 1 : -1) + modes.length) %
          modes.length;

        this.value = modes[next];
        this.dispatchEvent(
          new Event("change", { bubbles: true, cancelable: true }),
        );
      },
      { signal },
    );
  }

  _refresh() {
    const root = this.constructor.useShadowRoot ? this.#shadowRoot : this;
    const container = root?.querySelector(".mode-switch");
    if (!container) return;

    // Toggle locked visual state on the container
    container.classList.toggle("locked", this.locked);

    // Update aria + active class on each button
    for (const btn of container.querySelectorAll("button[data-mode]")) {
      const isActive = btn.dataset.mode === this._value;
      btn.classList.toggle("active", isActive);
      btn.setAttribute("aria-pressed", isActive);
      btn.disabled = this.locked;
    }
  }
}
