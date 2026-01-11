import StyleSheetMixin from "./stylesheet-mixin.mjs";

const icons = {
  0: `<svg width="48" height="48" viewBox="0 0 512 512">
    <g style="display:inline">
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#fff;stroke-width:6.36819;stroke-opacity:1" d="M94.244 262.83s-7.901 7.176 0 15.219c0 0 64 60.292 130.927 76.878 0 0 49.212 15.117 104.78-13.073 0 0 45.464-17.952 93.659-61.074 0 0 12.292-8.585.39-19.902 0 0-48.39-48-105.17-67.707 0 0-56.976-21.073-111.22-2.147 0 0-50.537 13.464-113.366 71.805z"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M124.098 262.049s-11.903 8.39-.196 15.22c0 0 38.244 34.146 76.098 48.194 0 0 51.122 25.561 117.268.78 0 0 43.903-16.194 77.269-47.414 0 0 15.22-4.878-.196-19.512 0 0-37.853-29.854-73.17-44.878 0 0-62.83-25.56-112.586-3.122 0 0-46.244 15.024-84.487 50.732z"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M325.205 266.32a64.683 64.683 0 0 1-61.742 67.47 64.683 64.683 0 0 1-67.495-61.715 64.683 64.683 0 0 1 61.687-67.52 64.683 64.683 0 0 1 67.546 61.659"/>
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M284.465 268.711a23.707 23.707 0 0 1-22.63 24.729 23.707 23.707 0 0 1-24.738-22.62 23.707 23.707 0 0 1 22.61-24.747 23.707 23.707 0 0 1 24.756 22.6"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.923;stroke-opacity:1" d="M213.284 249.497s1.626 9.164 5.912 2.66c0 0 5.026-13.894 16.555-20.988 0 0 7.094-7.39-3.843-5.765 0 0-18.033 10.938-18.624 24.093zM305.656 292.36s-1.1-9.242-5.75-2.994c0 0-5.812 13.584-17.728 20.008 0 0-7.505 6.973 3.508 5.975 0 0 18.628-9.89 19.97-22.989z"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M121.325 270.135s127.374 143.321 277.754.008"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M104.126 284.547s145.29-183.174 312.17 1.145"/>
    </g>
</svg>`,
  1: `<svg width="48" height="48" viewBox="0 0 512 512">
    <g style="display:inline">
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#fff;stroke-width:6.36819;stroke-opacity:1" d="M93.858 262.383s-7.901 7.176 0 15.22c0 0 64 60.292 130.927 76.877 0 0 49.212 15.117 104.78-13.073 0 0 45.463-17.951 93.659-61.073 0 0 12.292-8.586.39-19.903 0 0-48.39-48-105.17-67.707 0 0-56.977-21.073-111.22-2.146 0 0-50.537 13.463-113.366 71.805z" transform="translate(.592 -.32)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:5.51662;stroke-opacity:1" d="M123.69 263.292s-11.938 6.278-.196 11.387c0 0 38.359 25.548 76.326 36.06 0 0 51.275 19.124 117.62.584 0 0 44.034-12.118 77.5-35.476 0 0 15.265-3.65-.195-14.599 0 0-37.968-22.336-73.39-33.577 0 0-63.018-19.124-112.924-2.336 0 0-46.382 11.241-84.74 37.957z" transform="translate(.592 -.32)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M325.205 266.32a64.683 64.683 0 0 1-61.742 67.47 64.683 64.683 0 0 1-67.495-61.715 64.683 64.683 0 0 1 61.687-67.52 64.683 64.683 0 0 1 67.546 61.659" transform="translate(.592 -.32)"/>
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M284.465 268.711a23.707 23.707 0 0 1-22.63 24.729 23.707 23.707 0 0 1-24.738-22.62 23.707 23.707 0 0 1 22.61-24.747 23.707 23.707 0 0 1 24.756 22.6" transform="translate(.592 -.32)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.923;stroke-opacity:1" d="M213.284 249.497s1.626 9.164 5.912 2.66c0 0 5.026-13.894 16.555-20.988 0 0 7.094-7.39-3.843-5.765 0 0-18.033 10.938-18.624 24.093zM305.656 292.36s-1.1-9.242-5.75-2.994c0 0-5.812 13.584-17.728 20.008 0 0-7.505 6.973 3.508 5.975 0 0 18.628-9.89 19.97-22.989z" transform="translate(.592 -.32)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.54415;stroke-opacity:1" d="M196.971 225.62s75.049-9.364 128.155-.204l-8.904-25.85-59.784-5.088-51.835 12.212z" transform="translate(.592 -.32)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.54172;stroke-opacity:1" d="M197.187 310.905s52.157 11.767 127.21-.406l-14.947 21.708-75.372 5.073z" transform="translate(.592 -.32)"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M120.933 269.35s131.926 104.049 277.987.392"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M101.977 281.578s145.93-137.177 316.89 1.446"/>
    </g>
</svg>
`,
  2: `<svg width="48" height="48" viewBox="0 0 512 512">
    <g style="display:inline">
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#fff;stroke-width:6.36819;stroke-opacity:1" d="M94.037 263.131s-7.9 7.177 0 15.22c0 0 64 60.292 130.927 76.878 0 0 49.212 15.117 104.78-13.073 0 0 45.464-17.952 93.66-61.073 0 0 12.292-8.586.39-19.903 0 0-48.39-48-105.171-67.707 0 0-56.976-21.073-111.22-2.147 0 0-50.536 13.464-113.366 71.805z" transform="translate(4.964 -3.906)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:4.84134;stroke-opacity:1" d="M123.367 264.59s-11.966 4.823-.196 8.749c0 0 38.45 19.63 76.507 27.706 0 0 51.396 14.694 117.898.449 0 0 44.139-9.31 77.684-27.258 0 0 15.301-2.804-.196-11.217 0 0-38.057-17.162-73.564-25.799 0 0-63.167-14.694-113.19-1.794 0 0-46.493 8.637-84.943 29.164z" transform="translate(4.964 -3.906)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M325.205 266.32a64.683 64.683 0 0 1-61.742 67.47 64.683 64.683 0 0 1-67.495-61.715 64.683 64.683 0 0 1 61.687-67.52 64.683 64.683 0 0 1 67.546 61.659" transform="translate(4.964 -3.906)"/>
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M284.465 268.711a23.707 23.707 0 0 1-22.63 24.729 23.707 23.707 0 0 1-24.738-22.62 23.707 23.707 0 0 1 22.61-24.747 23.707 23.707 0 0 1 24.756 22.6" transform="translate(4.964 -3.906)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.923;stroke-opacity:1" d="M213.284 249.497s1.626 9.164 5.912 2.66c0 0 5.026-13.894 16.555-20.988 0 0 7.094-7.39-3.843-5.765 0 0-18.033 10.938-18.624 24.093zM305.656 292.36s-1.1-9.242-5.75-2.994c0 0-5.812 13.584-17.728 20.008 0 0-7.505 6.973 3.508 5.975 0 0 18.628-9.89 19.97-22.989z" transform="translate(4.964 -3.906)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.76492;stroke-opacity:1" d="M197.15 237.421s74.88-12.259 127.867-.266l-8.884-33.845-59.65-6.663-51.718 15.99z" transform="translate(4.964 -3.906)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.8381;stroke-opacity:1" d="M197.378 299.572s52.001 16.776 126.832-.579l-14.902 30.95-75.148 7.231z" transform="translate(4.964 -3.906)"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M125.644 264.245s125.303 85.038 280.002-.164"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M103.142 276.68s138.829-110.156 325.01-.9"/>
    </g>
</svg>
`,
  3: `<svg width="48" height="48" viewBox="0 0 512 512" >
    <g style="display:inline">
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#fff;stroke-width:6.36819;stroke-opacity:1" d="M95.418 262.37s-7.9 7.177 0 15.22c0 0 64 60.292 130.927 76.877 0 0 49.212 15.117 104.78-13.073 0 0 45.464-17.951 93.659-61.073 0 0 12.293-8.585.39-19.903 0 0-48.39-48-105.17-67.707 0 0-56.976-21.073-111.22-2.146 0 0-50.537 13.463-113.366 71.805z" transform="translate(5.44 -1.314)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:3.91754;stroke-opacity:1" d="M122.924 263.87s-12.006 3.147-.197 5.71c0 0 38.574 12.81 76.755 18.082 0 0 51.563 9.59 118.281.293 0 0 44.282-6.077 77.936-17.79 0 0 15.351-1.83-.197-7.32 0 0-38.18-11.202-73.803-16.839 0 0-63.372-8.63-113.558-.21 0 0-46.643 4.676-85.217 18.073z" transform="translate(5.44 -1.314)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M325.205 266.32a64.683 64.683 0 0 1-61.742 67.47 64.683 64.683 0 0 1-67.495-61.715 64.683 64.683 0 0 1 61.687-67.52 64.683 64.683 0 0 1 67.546 61.659" transform="translate(5.44 -1.314)"/>
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M284.465 268.711a23.707 23.707 0 0 1-22.63 24.729 23.707 23.707 0 0 1-24.738-22.62 23.707 23.707 0 0 1 22.61-24.747 23.707 23.707 0 0 1 24.756 22.6" transform="translate(5.44 -1.314)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.923;stroke-opacity:1" d="M213.284 249.497s1.626 9.164 5.912 2.66c0 0 5.026-13.894 16.555-20.988 0 0 7.094-7.39-3.843-5.765 0 0-18.033 10.938-18.624 24.093zM305.656 292.36s-1.1-9.242-5.75-2.994c0 0-5.812 13.584-17.728 20.008 0 0-7.505 6.973 3.508 5.975 0 0 18.628-9.89 19.97-22.989z" transform="translate(5.44 -1.314)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.97234;stroke-opacity:1" d="M193.117 251.639s74.727-15.341 127.606-.334l-8.866-42.355-59.529-8.337-51.612 20.01z" transform="translate(5.44 -1.314)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:2.11782;stroke-opacity:1" d="M197.555 287.007s51.857 22.333 126.482-.77l-14.862 41.2-74.94 9.626z" transform="translate(5.44 -1.314)"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M125.836 265.215s126.836 60.898 279.066.082"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M99.84 273.103s165.076-60.739 333.46 1.562"/>
    </g>
</svg>
`,
  4: `<svg width="48" height="48" viewBox="0 0 512 512">
    <g style="display:inline">
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#fff;stroke-width:6.36819;stroke-opacity:1" d="M92.782 263.395s-7.901 7.177 0 15.22c0 0 64 60.292 130.927 76.878 0 0 49.212 15.117 104.78-13.073 0 0 45.464-17.952 93.659-61.073 0 0 12.292-8.586.39-19.903 0 0-48.39-48-105.17-67.707 0 0-56.976-21.073-111.22-2.147 0 0-50.537 13.464-113.366 71.805z" transform="translate(4.337 -2.81)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:2.39967;stroke-opacity:1" d="M122.197 267.061s-12.069 1.175-.198 2.132c0 0 38.78 4.781 77.162 6.749 0 0 51.837 3.58 118.908.109 0 0 44.517-2.268 78.35-6.64 0 0 15.432-.683-.199-2.732 0 0-38.383-4.18-74.194-6.285 0 0-63.708-3.579-114.16-.437 0 0-46.89 2.104-85.669 7.104z" transform="translate(4.337 -2.81)"/>
        <path style="display:inline;fill:#fff;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M325.205 266.32a64.683 64.683 0 0 1-61.742 67.47 64.683 64.683 0 0 1-67.495-61.715 64.683 64.683 0 0 1 61.687-67.52 64.683 64.683 0 0 1 67.546 61.659" transform="translate(4.337 -2.81)"/>
        <path style="display:inline;fill:#000;fill-opacity:1;stroke:#000;stroke-width:6.36819;stroke-opacity:1" d="M284.465 268.711a23.707 23.707 0 0 1-22.63 24.729 23.707 23.707 0 0 1-24.738-22.62 23.707 23.707 0 0 1 22.61-24.747 23.707 23.707 0 0 1 24.756 22.6" transform="translate(4.337 -2.81)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:1.923;stroke-opacity:1" d="M213.284 249.497s1.626 9.164 5.912 2.66c0 0 5.026-13.894 16.555-20.988 0 0 7.094-7.39-3.843-5.765 0 0-18.033 10.938-18.624 24.093zM305.656 292.36s-1.1-9.242-5.75-2.994c0 0-5.812 13.584-17.728 20.008 0 0-7.505 6.973 3.508 5.975 0 0 18.628-9.89 19.97-22.989z" transform="translate(4.337 -2.81)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:2.19714;stroke-opacity:1" d="M196.972 260.607s72.663-4.505 127.327 1.486l-8.846-52.675-59.398-10.37-51.5 24.887z" transform="translate(4.337 -2.81)"/>
        <path style="fill:#000;fill-opacity:1;stroke:#000;stroke-width:2.33045;stroke-opacity:1" d="M196.154 275.927s56.458 5.26 127.695-.619l-14.818 50.035-87.394 13.592z" transform="translate(4.337 -2.81)"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19509;stroke-opacity:1" d="M125.654 264.442s132.244 25.842 278.077-.286"/>
        <path style="display:inline;fill:none;stroke:#fff;stroke-width:6.19508;stroke-opacity:1" d="M95.552 269.959s126.156-31.722 335.132-2.245"/>
    </g>
</svg>
`,
};

const vision = [
  { value: 0, icon: icons[0], tooltip: "0" },
  { value: 1, icon: icons[1], tooltip: "-1" },
  { value: 2, icon: icons[2], tooltip: "-2" },
  { value: 3, icon: icons[3], tooltip: "-3" },
  { value: 4, icon: icons[4], tooltip: "-4" },
];

export default class VisionElement extends StyleSheetMixin(
  foundry.applications.elements.AbstractFormInputElement
) {
  constructor(...args) {
    super(...args);
    this._internals.role = "select";
    this._value = this.getAttribute("value");
    this.#defaultValue = this._value;

    if (this.constructor.useShadowRoot)
      this.#shadowRoot = this.attachShadow({ mode: "open" });
  }

  /* -------------------------------------------- */

  /** @override */
  static tagName = "dgns-vision";

  /* -------------------------------------------- */

  /**
   * Should a show root be created for this element?
   */
  static useShadowRoot = false;

  /* -------------------------------------------- */

  /** @override */
  static CSS = ``;

  /* -------------------------------------------- */

  /**
   * Controller for removing listeners automatically.
   * @type {AbortController}
   */
  _controller;

  /* -------------------------------------------- */

  /**
   * The shadow root that contains the checkbox elements.
   * @type {ShadowRoot}
   */
  #shadowRoot;

  /* -------------------------------------------- */
  /*  Element Properties                          */
  /* -------------------------------------------- */

  /**
   * The default value as originally specified in the HTML that created this object.
   * @type {string}
   */
  get defaultValue() {
    return this.#defaultValue;
  }

  #defaultValue;

  get value() {
    return super.value;
  }

  set value(value) {
    this._setValue(value);
  }

  /* -------------------------------------------- */
  /*  Element Lifecycle                           */
  /* -------------------------------------------- */

  /** @override */
  connectedCallback() {
    this._adoptStyleSheet(this._getStyleSheet());
    const elements = this._buildElements();

    if (this.useShadowRoot) {
      this.#shadowRoot.replaceChildren(...elements);
    } else {
      this.replaceChildren(...elements);
    }

    this._refresh();
    this._activateListeners();
    if (!this.hasAttribute("tabindex")) this.tabIndex = 0;
  }

  /* -------------------------------------------- */

  /** @override */
  disconnectedCallback() {
    this._controller.abort();
  }

  /* -------------------------------------------- */

  /** @override */
  _adoptStyleSheet(sheet) {
    if (this.useShadowRoot) {
      this.#shadowRoot.adoptedStyleSheets = [sheet];
    } else this.adoptedStyleSheets = [sheet];
  }

  /* -------------------------------------------- */

  /** @override */
  _buildElements() {
    const container = document.createElement("div");
    const button = document.createElement("button");

    button.setAttribute("id", "visionButton");
    button.innerHTML = icons[this.value];

    const dropdown = document.createElement("div");
    dropdown.setAttribute("id", "visionDropdown");
    dropdown.classList.add("vision-dropdown");

    vision.forEach((vision) => {
      const item = document.createElement("div");
      item.className = "vision-dropdown-item";
      item.setAttribute("data-value", vision.value);

      const malus = document.createElement("label");
      malus.className = "vision-malus";
      malus.textContent = vision.tooltip;

      item.innerHTML = vision.icon;
      item.appendChild(malus);

      item.addEventListener("click", (ev) => {
        let selection = ev.target.closest("div");
        let newValue = selection.getAttribute("data-value");

        this.value = newValue;

        this.dispatchEvent(
          new Event("change", { bubbles: true, cancelable: true })
        );
      });

      dropdown.appendChild(item);
    });

    container.appendChild(button);
    container.appendChild(dropdown);

    return [container];
  }

  /* -------------------------------------------- */

  /** @override */
  _activateListeners() {
    const { signal } = (this._controller = new AbortController());
    this.addEventListener("click", this._onClick.bind(this), { signal });
    this.addEventListener(
      "keydown",
      (event) => (event.key === " " ? this._onClick(event) : null),
      { signal }
    );
  }

  /* -------------------------------------------- */

  /** @override */
  _refresh() {
    super._refresh();
  }

  /* -------------------------------------------- */

  /** @override */
  _onClick(event) {
    event.preventDefault();

    let dropdown = {};

    if (this.useShadowRoot) {
      dropdown = this.shadowRoot.getElementById("visionDropdown");
    } else {
      dropdown = this.firstChild.lastChild;
    }

    dropdown.classList.toggle("active");
  }
}
