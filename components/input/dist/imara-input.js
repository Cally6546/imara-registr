/**
 * AppInput - A reusable, accessible input web component
 * * @element app-input
 * * @attr {string} type - Input type (text | password | email | number | search)
 * @attr {string} value - Input value
 * @attr {string} placeholder - Placeholder text
 * @attr {string} label - Label text
 * @attr {boolean} disabled - Disables the input
 * @attr {boolean} readonly - Makes input read-only
 * @attr {boolean} required - Marks input as required
 * @attr {boolean} error - Shows error state
 * @attr {string} name - Input name attribute
 * * @fires input - Dispatched when input value changes
 * @fires change - Dispatched when input loses focus after value change
 * @fires focus - Dispatched when input receives focus
 * @fires blur - Dispatched when input loses focus
 * * @slot - Default slot for helper text or error message
 * @slot prefix - Slot for prefix content (icons, text)
 * @slot suffix - Slot for suffix content (icons, buttons)
 */
/**
 * AppInput - A reusable, accessible input web component
 */
export class ImaraInput extends HTMLElement {
    static get observedAttributes() {
        return [
            'type', 'value', 'placeholder', 'label',
            'disabled', 'readonly', 'required', 'error', 'name'
        ];
    }
    constructor() {
        super();
        this.inputElement = null;
        this.labelElement = null;
        // REMOVED: _helperElement to satisfy strict TS6133 checks
        this.internals = null;
        this.handleInput = (event) => {
            const inputEvent = event;
            const target = event.target;
            this.setAttribute('value', target.value);
            if (this.internals)
                this.internals.setFormValue(target.value);
            this.dispatchEvent(new CustomEvent('input', {
                bubbles: true, composed: true,
                detail: { value: target.value, inputType: inputEvent.inputType }
            }));
        };
        this.handleChange = (event) => {
            const target = event.target;
            this.dispatchEvent(new CustomEvent('change', {
                bubbles: true, composed: true, detail: { value: target.value }
            }));
        };
        this.handleFocus = (event) => {
            this.dispatchEvent(new CustomEvent('focus', {
                bubbles: true, composed: true, detail: { value: event.target.value }
            }));
        };
        this.handleBlur = (event) => {
            this.dispatchEvent(new CustomEvent('blur', {
                bubbles: true, composed: true, detail: { value: event.target.value }
            }));
        };
        this.attachShadow({ mode: 'open' });
        if ('attachInternals' in this) {
            this.internals = this.attachInternals();
        }
    }
    connectedCallback() {
        this.render();
        this.attachEventListeners();
        this.updateInputState();
    }
    disconnectedCallback() {
        this.removeEventListeners();
    }
    attributeChangedCallback(_name, oldValue, newValue) {
        if (oldValue !== newValue) {
            this.updateInputState();
        }
    }
    async render() {
        if (!this.shadowRoot)
            return;
        const template = this.getTemplate();
        const styles = this.getStyles();
        this.shadowRoot.innerHTML = '';
        const styleElement = document.createElement('style');
        styleElement.textContent = styles;
        this.shadowRoot.appendChild(styleElement);
        const templateElement = document.createElement('template');
        templateElement.innerHTML = template;
        this.shadowRoot.appendChild(templateElement.content.cloneNode(true));
        this.inputElement = this.shadowRoot.querySelector('input');
        this.labelElement = this.shadowRoot.querySelector('label');
        // REMOVED: assignment to _helperElement
    }
    getTemplate() {
        return `
      <div class="input-wrapper" part="wrapper">
        <label class="input-label" part="label">
          <span class="label-text" part="label-text"></span>
        </label>
        <div class="input-container" part="container">
          <div class="prefix-slot" part="prefix"><slot name="prefix"></slot></div>
          <input class="input-field" part="input" autocomplete="off" />
          <div class="suffix-slot" part="suffix"><slot name="suffix"></slot></div>
        </div>
        <div class="helper-text" part="helper"><slot></slot></div>
      </div>
    `;
    }
    getStyles() {
        return `
      :host {
        display: block;
        font-family: inherit;
        --input-border-color: #d1d5db;
        --input-border-color-hover: #9ca3af;
        --input-border-color-focus: #2563eb;
        --input-border-color-error: #dc2626;
        --input-bg: #ffffff;
        --input-bg-disabled: #f3f4f6;
        --input-text-color: #1f2937;
        --input-text-color-disabled: #9ca3af;
        --input-placeholder-color: #9ca3af;
        --input-label-color: #374151;
        --input-label-color-required: #dc2626;
        --input-helper-color: #6b7280;
        --input-error-color: #dc2626;
        --input-border-radius: 6px;
        --input-border-width: 1px;
        --input-padding: 10px 12px;
        --input-font-size: 14px;
        --input-line-height: 1.5;
        --input-label-font-size: 14px;
        --input-label-font-weight: 500;
        --input-label-margin-bottom: 6px;
        --input-helper-font-size: 13px;
        --input-helper-margin-top: 6px;
        --input-focus-ring: 0 0 0 3px rgba(37, 99, 235, 0.1);
        --input-transition: all 0.2s ease;
      }
      .input-wrapper { display: flex; flex-direction: column; }
      .input-label { display: block; margin-bottom: var(--input-label-margin-bottom); }
      .label-text { display: inline-block; font-size: var(--input-label-font-size); font-weight: var(--input-label-font-weight); color: var(--input-label-color); line-height: var(--input-line-height); }
      :host([required]) .label-text::after { content: ' *'; color: var(--input-label-color-required); }
      .label-text:empty { display: none; }
      .input-label:has(.label-text:empty) { margin-bottom: 0; }
      .input-container { position: relative; display: flex; align-items: center; background-color: var(--input-bg); border: var(--input-border-width) solid var(--input-border-color); border-radius: var(--input-border-radius); transition: var(--input-transition); }
      .input-field { flex: 1; width: 100%; padding: var(--input-padding); font-family: inherit; font-size: var(--input-font-size); line-height: var(--input-line-height); color: var(--input-text-color); background-color: transparent; border: none; outline: none; appearance: none; }
      .input-field::placeholder { color: var(--input-placeholder-color); opacity: 1; }
      .prefix-slot, .suffix-slot { display: flex; align-items: center; color: var(--input-placeholder-color); }
      .prefix-slot { padding-left: 12px; }
      .suffix-slot { padding-right: 12px; }
      .prefix-slot:not(:has(*)) { display: none; }
      .suffix-slot:not(:has(*)) { display: none; }
      .prefix-slot:has(*) ~ .input-field { padding-left: 8px; }
      .input-container:has(.suffix-slot *) .input-field { padding-right: 8px; }
      :host(:not([disabled])) .input-container:hover { border-color: var(--input-border-color-hover); }
      :host(:not([disabled])) .input-container:has(.input-field:focus) { border-color: var(--input-border-color-focus); box-shadow: var(--input-focus-ring); }
      :host([disabled]) .input-container { background-color: var(--input-bg-disabled); cursor: not-allowed; }
      :host([disabled]) .input-field { color: var(--input-text-color-disabled); cursor: not-allowed; }
      :host([disabled]) .label-text { color: var(--input-text-color-disabled); }
      :host([readonly]) .input-container { background-color: var(--input-bg-disabled); }
      :host([readonly]) .input-field { cursor: default; }
      :host([error]) .input-container { border-color: var(--input-border-color-error); }
      :host([error]) .input-container:has(.input-field:focus) { box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1); }
      :host([error]) .label-text { color: var(--input-error-color); }
      .helper-text { min-height: 1em; margin-top: var(--input-helper-margin-top); font-size: var(--input-helper-font-size); line-height: var(--input-line-height); color: var(--input-helper-color); }
      :host([error]) .helper-text { color: var(--input-error-color); }
      .helper-text:not(:has(*)) { display: none; margin-top: 0; }
      .input-field[type="number"]::-webkit-inner-spin-button, .input-field[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
      .input-field[type="number"] { -moz-appearance: textfield; }
      .input-field[type="search"]::-webkit-search-cancel-button { -webkit-appearance: none; }
    `;
    }
    updateInputState() {
        if (!this.inputElement || !this.labelElement)
            return;
        const type = this.getAttribute('type') || 'text';
        this.inputElement.type = type;
        const value = this.getAttribute('value') || '';
        if (this.inputElement.value !== value) {
            this.inputElement.value = value;
        }
        if (this.internals) {
            this.internals.setFormValue(value);
        }
        const placeholder = this.getAttribute('placeholder') || '';
        this.inputElement.placeholder = placeholder;
        const label = this.getAttribute('label') || '';
        const labelText = this.labelElement.querySelector('.label-text');
        if (labelText) {
            labelText.textContent = label;
        }
        const name = this.getAttribute('name') || '';
        if (name) {
            this.inputElement.name = name;
        }
        const isDisabled = this.hasAttribute('disabled');
        this.inputElement.disabled = isDisabled;
        this.toggleAttribute('aria-disabled', isDisabled);
        const isReadonly = this.hasAttribute('readonly');
        this.inputElement.readOnly = isReadonly;
        const isRequired = this.hasAttribute('required');
        this.inputElement.required = isRequired;
        this.inputElement.setAttribute('aria-required', isRequired.toString());
        const hasError = this.hasAttribute('error');
        this.inputElement.setAttribute('aria-invalid', hasError.toString());
        if (this.internals) {
            if (hasError) {
                this.internals.setValidity({ customError: true }, 'Invalid input', this.inputElement);
            }
            else if (this.inputElement.validity.valid) {
                this.internals.setValidity({});
            }
        }
    }
    attachEventListeners() {
        if (!this.inputElement)
            return;
        this.inputElement.addEventListener('input', this.handleInput);
        this.inputElement.addEventListener('change', this.handleChange);
        this.inputElement.addEventListener('focus', this.handleFocus);
        this.inputElement.addEventListener('blur', this.handleBlur);
    }
    removeEventListeners() {
        if (!this.inputElement)
            return;
        this.inputElement.removeEventListener('input', this.handleInput);
        this.inputElement.removeEventListener('change', this.handleChange);
        this.inputElement.removeEventListener('focus', this.handleFocus);
        this.inputElement.removeEventListener('blur', this.handleBlur);
    }
    get value() { return this.inputElement?.value || ''; }
    set value(val) { this.setAttribute('value', val); }
    focus() { this.inputElement?.focus(); }
    blur() { this.inputElement?.blur(); }
    select() { this.inputElement?.select(); }
    checkValidity() { return this.inputElement?.checkValidity() ?? false; }
    reportValidity() { return this.inputElement?.reportValidity() ?? false; }
    setCustomValidity(message) {
        this.inputElement?.setCustomValidity(message);
        if (this.internals) {
            if (message) {
                this.internals.setValidity({ customError: true }, message, this.inputElement ?? undefined);
            }
            else {
                this.internals.setValidity({});
            }
        }
    }
}
ImaraInput.formAssociated = true;
// Register the custom element
if (!customElements.get('imara-input')) {
    customElements.define('imara-input', ImaraInput);
}
//# sourceMappingURL=imara-input.js.map