/**
 * AppButton - A reusable button web component
 *
 * @element app-button
 *
 * @attr {string} variant - Button style variant (primary | secondary | danger)
 * @attr {boolean} disabled - Disables the button
 * @attr {boolean} loading - Shows loading state
 * @attr {string} type - Button type (button | submit)
 *
 * @fires button-click - Dispatched when button is clicked
 *
 * @slot - Default slot for button content (text, icons, etc.)
 */
export class ImaraButton extends HTMLElement {
    // Observed attributes for reactivity
    static get observedAttributes() {
        return ['variant', 'disabled', 'loading', 'type'];
    }
    constructor() {
        super();
        this.button = null;
        this.styleElement = null;
        /**
         * Handles button click events
         */
        this.handleClick = (event) => {
            // Prevent default if button is disabled or loading
            if (this.hasAttribute('disabled') || this.hasAttribute('loading')) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
            // Dispatch custom event
            this.dispatchEvent(new CustomEvent('button-click', {
                bubbles: true,
                composed: true,
                detail: {
                    variant: this.getAttribute('variant') || 'primary',
                    type: this.getAttribute('type') || 'button'
                }
            }));
        };
        // Attach Shadow DOM
        this.attachShadow({ mode: 'open' });
    }
    /**
     * Called when element is added to the DOM
     */
    connectedCallback() {
        this.render();
        this.attachEventListeners();
    }
    /**
     * Called when element is removed from the DOM
     */
    disconnectedCallback() {
        this.removeEventListeners();
    }
    /**
     * Called when observed attributes change
     */
    attributeChangedCallback(_name, oldValue, newValue) {
        // Only update if the value actually changed
        if (oldValue !== newValue) {
            // Re-render button state when attributes change
            this.updateButton();
        }
    }
    /**
     * Renders the component template and styles
     */
    async render() {
        if (!this.shadowRoot)
            return;
        // Load template and styles
        const template = await this.getTemplate();
        const styles = await this.getStyles();
        // Clear shadow root
        this.shadowRoot.innerHTML = '';
        // Add styles
        this.styleElement = document.createElement('style');
        this.styleElement.textContent = styles;
        this.shadowRoot.appendChild(this.styleElement);
        // Add template
        const templateElement = document.createElement('template');
        templateElement.innerHTML = template;
        this.shadowRoot.appendChild(templateElement.content.cloneNode(true));
        // Get reference to button element
        this.button = this.shadowRoot.querySelector('button');
        // Initialize button state
        this.updateButton();
    }
    /**
     * Loads the HTML template
     */
    async getTemplate() {
        return `
      <button class="app-button" part="button">
        <span class="button-content" part="content">
          <slot></slot>
        </span>
        <span class="loading-spinner" part="spinner" aria-hidden="true">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <circle cx="12" cy="12" r="10" stroke-width="3" fill="none" />
          </svg>
        </span>
      </button>
    `;
    }
    /**
     * Loads the CSS styles
     */
    async getStyles() {
        return `
      :host {
        display: inline-block;

        /* CSS Custom Properties for theming */
        --button-primary-bg: #2563eb;
        --button-primary-hover: #1d4ed8;
        --button-primary-active: #1e40af;
        --button-primary-text: #ffffff;

        --button-secondary-bg: #6b7280;
        --button-secondary-hover: #4b5563;
        --button-secondary-active: #374151;
        --button-secondary-text: #ffffff;

        --button-danger-bg: #dc2626;
        --button-danger-hover: #b91c1c;
        --button-danger-active: #991b1b;
        --button-danger-text: #ffffff;

        --button-disabled-bg: #e5e7eb;
        --button-disabled-text: #9ca3af;

        --button-border-radius: 6px;
        --button-padding: 10px 20px;
        --button-font-size: 14px;
        --button-font-weight: 500;
        --button-transition: all 0.2s ease;

        --button-focus-ring: 0 0 0 3px rgba(37, 99, 235, 0.2);
      }

      /* Hidden when loading attribute is present */
      :host([loading]) .button-content {
        opacity: 0;
      }

      :host([loading]) .loading-spinner {
        opacity: 1;
      }

      /* Base button styles */
      .app-button {
        position: relative;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: var(--button-padding);
        font-size: var(--button-font-size);
        font-weight: var(--button-font-weight);
        font-family: inherit;
        line-height: 1.5;
        border: none;
        border-radius: var(--button-border-radius);
        cursor: pointer;
        transition: var(--button-transition);
        outline: none;
        white-space: nowrap;
        user-select: none;
        min-width: 80px;
      }

      /* Variant: Primary (default) */
      .app-button {
        background-color: var(--button-primary-bg);
        color: var(--button-primary-text);
      }

      .app-button:hover:not(:disabled) {
        background-color: var(--button-primary-hover);
      }

      .app-button:active:not(:disabled) {
        background-color: var(--button-primary-active);
        transform: translateY(1px);
      }

      /* Variant: Secondary */
      :host([variant="secondary"]) .app-button {
        background-color: var(--button-secondary-bg);
        color: var(--button-secondary-text);
      }

      :host([variant="secondary"]) .app-button:hover:not(:disabled) {
        background-color: var(--button-secondary-hover);
      }

      :host([variant="secondary"]) .app-button:active:not(:disabled) {
        background-color: var(--button-secondary-active);
      }

      /* Variant: Danger */
      :host([variant="danger"]) .app-button {
        background-color: var(--button-danger-bg);
        color: var(--button-danger-text);
      }

      :host([variant="danger"]) .app-button:hover:not(:disabled) {
        background-color: var(--button-danger-hover);
      }

      :host([variant="danger"]) .app-button:active:not(:disabled) {
        background-color: var(--button-danger-active);
      }

      /* Disabled state */
      .app-button:disabled {
        background-color: var(--button-disabled-bg);
        color: var(--button-disabled-text);
        cursor: not-allowed;
        opacity: 0.6;
      }

      /* Focus state for accessibility */
      .app-button:focus-visible {
        box-shadow: var(--button-focus-ring);
      }

      /* Button content */
      .button-content {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        transition: opacity 0.2s ease;
      }

      /* Loading spinner */
      .loading-spinner {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        opacity: 0;
        transition: opacity 0.2s ease;
        width: 20px;
        height: 20px;
      }

      .loading-spinner svg {
        width: 100%;
        height: 100%;
        animation: spin 1s linear infinite;
      }

      .loading-spinner circle {
        stroke: currentColor;
        stroke-linecap: round;
        stroke-dasharray: 50;
        stroke-dashoffset: 25;
      }

      @keyframes spin {
        to {
          transform: rotate(360deg);
        }
      }
    `;
    }
    /**
     * Updates button attributes and state based on component attributes
     */
    updateButton() {
        if (!this.button)
            return;
        // Update type attribute
        const type = this.getAttribute('type') || 'button';
        this.button.setAttribute('type', type);
        // Update disabled state
        const isDisabled = this.hasAttribute('disabled');
        const isLoading = this.hasAttribute('loading');
        if (isDisabled || isLoading) {
            this.button.setAttribute('disabled', '');
            this.button.setAttribute('aria-disabled', 'true');
        }
        else {
            this.button.removeAttribute('disabled');
            this.button.setAttribute('aria-disabled', 'false');
        }
        // Update loading state
        if (isLoading) {
            this.button.setAttribute('aria-busy', 'true');
        }
        else {
            this.button.setAttribute('aria-busy', 'false');
        }
        // Update variant (handled by CSS :host selector)
        const variant = this.getAttribute('variant') || 'primary';
        this.button.setAttribute('aria-label', `${variant} button${isLoading ? ', loading' : ''}`);
    }
    /**
     * Attaches event listeners
     */
    attachEventListeners() {
        if (this.button) {
            this.button.addEventListener('click', this.handleClick);
        }
    }
    /**
     * Removes event listeners
     */
    removeEventListeners() {
        if (this.button) {
            this.button.removeEventListener('click', this.handleClick);
        }
    }
    /**
     * Public API: Programmatically trigger button click
     */
    click() {
        if (this.button && !this.hasAttribute('disabled') && !this.hasAttribute('loading')) {
            this.button.click();
        }
    }
    /**
     * Public API: Focus the button
     */
    focus() {
        if (this.button) {
            this.button.focus();
        }
    }
    /**
     * Public API: Blur the button
     */
    blur() {
        if (this.button) {
            this.button.blur();
        }
    }
}
// Register the custom element
if (!customElements.get('imara-btn')) {
    customElements.define('imara-btn', ImaraButton);
}
//# sourceMappingURL=imara-button.js.map