/**
 * UIContainer Web Component
 *
 * Layout-only container component using Web Components + TypeScript.
 * Safe for older TS targets (ES5+).
 */
export class ImaraContainer extends HTMLElement {
    static get observedAttributes() {
        return [
            'layout',
            'direction',
            'align',
            'justify',
            'gap',
            'columns',
            'min-column-width',
            'padding',
            'margin',
            'width',
            'height',
            'max-width',
            'center',
            'full-height',
            'scroll'
        ];
    }
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.render();
    }
    connectedCallback() {
        this.sync();
    }
    attributeChangedCallback() {
        this.sync();
    }
    // ----------------------------
    // Render
    // ----------------------------
    render() {
        if (!this.shadowRoot)
            return;
        this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          box-sizing: border-box;
        }

        *,
        *::before,
        *::after {
          box-sizing: inherit;
        }

        .container {
          display: block;

          /* Flex defaults */
          flex-direction: row;
          align-items: stretch;
          justify-content: flex-start;

          /* Grid defaults */
          grid-template-columns: 1fr;

          /* Spacing */
          gap: var(--gap, 0);
          padding: var(--padding, 0);
          margin: var(--margin, 0);

          /* Sizing */
          width: var(--width, auto);
          height: var(--height, auto);
          max-width: var(--max-width, none);

          /* Overflow */
          overflow: var(--overflow, visible);
        }

        /* Layout modes */
        :host([layout="flex"]) .container {
          display: flex;
        }

        :host([layout="grid"]) .container {
          display: grid;
          grid-template-columns: var(--grid-template-columns, 1fr);
        }

        /* Utilities */
        :host([center]) .container {
          margin-inline: auto;
        }

        :host([full-height]) .container {
          height: 100vh;
        }

        :host([scroll]) .container {
          overflow: auto;
        }

        ::slotted(*) {
          box-sizing: border-box;
        }
      </style>

      <div class="container">
        <slot></slot>
      </div>
    `;
        this.container = this.shadowRoot.querySelector('.container');
    }
    // ----------------------------
    // Sync
    // ----------------------------
    sync() {
        if (!this.container)
            return;
        this.applyLayout();
        this.applyFlex();
        this.applyGrid();
        this.applySpacing();
        this.applySizing();
    }
    // ----------------------------
    // Layout
    // ----------------------------
    applyLayout() {
        const layout = this.getAttribute('layout');
        if (!layout ||
            (layout !== 'block' && layout !== 'flex' && layout !== 'grid')) {
            this.removeAttribute('layout');
        }
    }
    // ----------------------------
    // Flex
    // ----------------------------
    applyFlex() {
        if (this.getAttribute('layout') !== 'flex')
            return;
        this.container.style.flexDirection =
            this.getAttribute('direction') || 'row';
        this.container.style.alignItems =
            this.mapAlign(this.getAttribute('align'));
        this.container.style.justifyContent =
            this.mapJustify(this.getAttribute('justify'));
    }
    mapAlign(value) {
        if (value === 'start')
            return 'flex-start';
        if (value === 'end')
            return 'flex-end';
        if (value === 'center' ||
            value === 'stretch' ||
            value === 'baseline') {
            return value;
        }
        return 'stretch';
    }
    mapJustify(value) {
        if (value === 'start')
            return 'flex-start';
        if (value === 'end')
            return 'flex-end';
        if (value === 'center' ||
            value === 'space-between' ||
            value === 'space-around' ||
            value === 'space-evenly') {
            return value;
        }
        return 'flex-start';
    }
    // ----------------------------
    // Grid
    // ----------------------------
    applyGrid() {
        if (this.getAttribute('layout') !== 'grid') {
            this.container.style.removeProperty('--grid-template-columns');
            return;
        }
        const columns = this.getAttribute('columns');
        const minWidth = this.normalizeUnit(this.getAttribute('min-column-width') || '250px');
        if (columns && /^\d+$/.test(columns)) {
            this.container.style.setProperty('--grid-template-columns', 'repeat(' + columns + ', 1fr)');
        }
        else {
            this.container.style.setProperty('--grid-template-columns', 'repeat(auto-fit, minmax(' + minWidth + ', 1fr))');
        }
    }
    // ----------------------------
    // Spacing
    // ----------------------------
    applySpacing() {
        this.setVar('--gap', this.normalizeUnit(this.getAttribute('gap')));
        this.setVar('--padding', this.resolvePadding(this.getAttribute('padding')));
        this.setVar('--margin', this.normalizeUnit(this.getAttribute('margin')));
    }
    resolvePadding(value) {
        if (!value)
            return '0';
        if (ImaraContainer.PADDING_SCALE[value]) {
            return ImaraContainer.PADDING_SCALE[value];
        }
        return this.normalizeUnit(value);
    }
    // ----------------------------
    // Sizing
    // ----------------------------
    applySizing() {
        this.setVar('--width', this.normalizeUnit(this.getAttribute('width')));
        this.setVar('--height', this.normalizeUnit(this.getAttribute('height')));
        this.setVar('--max-width', this.normalizeUnit(this.getAttribute('max-width')));
    }
    // ----------------------------
    // Helpers
    // ----------------------------
    normalizeUnit(value) {
        if (!value)
            return 'auto';
        return /^\d+$/.test(value) ? value + 'px' : value;
    }
    setVar(name, value) {
        if (value === 'auto') {
            this.container.style.removeProperty(name);
        }
        else {
            this.container.style.setProperty(name, value);
        }
    }
}
ImaraContainer.PADDING_SCALE = {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem'
};
// Register
if (!customElements.get('imara-container')) {
    customElements.define('imara-container', ImaraContainer);
}
export default ImaraContainer;
//# sourceMappingURL=imara-container.js.map