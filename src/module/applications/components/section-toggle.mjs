export default class SectionToggleElement extends HTMLElement {
  static tagName = "dgns-section-toggle";
  static useShadowRoot = false;

  // valid configuration for positioning
  static POSITIONS = ["bottom", "top", "left", "right"];

  get storageKey() {
    return this.dataset.expandId || this.dataset.key || this.id || null;
  }

  get position() {
    const value = this.dataset.position;

    if (!value) {
      this.dataset.position = "bottom";
    }

    return SectionToggleElement.POSITIONS.includes(value)
      ? value
      : SectionToggleElement.POSITIONS[0];
  }

  get sheet() {
    const appId = this.closest(".application[id]")?.id;
    return appId ? foundry.applications.instances.get(appId) : null;
  }

  get document() {
    return this.sheet?.document ?? null;
  }

  get target() {
    return this.parentElement;
  }

  connectedCallback() {
    this.replaceChildren(...this._buildElements());
    const stored = this._readState();
    if (stored !== null) this.target?.toggleAttribute("collapsed", stored);

    this.toggleAttribute(
      "collapsed",
      this.target?.hasAttribute("collapsed") ?? false,
    );
    this._activateListeners();
  }

  _buildElements() {
    const template = document.createElement("template");
    template.innerHTML = `
      <div class="section-toggle-dropdown section-toggle-dropdown--${this.position}">
        <svg class="section-toggle-dropdown__shape" width="81" height="16" viewBox="0 0 81 16">
          <g transform="matrix(0.64178,0,0,0.651064,-264.123201,-288.971909)">
            <path d="M412.327,444.613L435.366,467.653L514.209,467.653L536.98,444.882" />
          </g>
        </svg>
        <a class="section-toggle-dropdown__handle"><i class="fa-solid fa-caret-up"></i></a>
      </div>
    `.trim();
    return Array.from(template.content.childNodes);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this._onToggle);
  }

  _activateListeners() {
    this._onToggle = this._onToggle.bind(this);
    this.addEventListener("click", this._onToggle);
  }

  async _onToggle(event) {
    event.preventDefault();
    if (!this.target) return;
    const collapsed = !this.target.hasAttribute("collapsed");
    this._applyState(collapsed);
    await this._persistState(collapsed);
    this.dispatchEvent(
      new CustomEvent("toggle", { bubbles: true, detail: { collapsed } }),
    );
  }

  _applyState(collapsed) {
    this.target?.toggleAttribute("collapsed", collapsed);
    this.toggleAttribute("collapsed", collapsed);
  }

  _readState() {
    const key = this.storageKey;
    const doc = this.document;
    if (!key || !doc) return null;
    const expanded = doc.getFlag(
      CONFIG.DEGENESIS.id,
      `expandedSections.${key}`,
    );
    return expanded === undefined ? null : !expanded;
  }

  async _persistState(collapsed) {
    const key = this.storageKey;
    const doc = this.document;
    if (!key || !doc) return;
    await doc.update(
      { [`flags.${CONFIG.DEGENESIS.id}.expandedSections.${key}`]: !collapsed },
      { render: false },
    );
  }
}
