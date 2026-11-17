const svgCache = new Map();

function loadSvgMarkup(path) {
  if (!svgCache.has(path)) {
    svgCache.set(
      path,
      fetch(path).then((r) => r.text()),
    );
  }
  return svgCache.get(path);
}

export async function preloadDieFaces(basePath = DGNSDie.BASE_PATH) {
  await Promise.all(
    [1, 2, 3, 4, 5, 6].map((value) =>
      loadSvgMarkup(`${basePath}/d${value}.min.svg`),
    ),
  );
}

export default class DieElement extends HTMLElement {
  static tagName = "dgns-die";

  static BASE_PATH = "systems/degenesisnext/ui/dice";

  static get observedAttributes() {
    return ["value"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (name === "value" && oldValue !== newValue) {
      this._render();
    }
  }

  async connectedCallback() {
    if (this._initialized) return;
    this._initialized = true;
    await this._render();
  }

  async _render() {
    const value = this.getAttribute("value");
    const markup = await loadSvgMarkup(
      `${this.constructor.BASE_PATH}/d${value}.min.svg`,
    );
    this.innerHTML = markup;
  }
}
