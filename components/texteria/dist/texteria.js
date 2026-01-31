/**
 * Texteria - A Production-Ready TextArea Web Component
 *
 * A fully-featured, accessible textarea component with validation,
 * auto-resize, character counting, and extensive customization options.
 *
 * @example
 * ```html
 * <text-eria
 *   placeholder="Enter your message..."
 *   maxlength="500"
 *   auto-resize>
 * </text-eria>
 * ```
 */
/**
 * Texteria Web Component Class
 * Extends HTMLElement to create a custom textarea component
 */
export class ImaraTexteria extends HTMLElement {
    /**
     * Observable attributes for the component
     */
    static get observedAttributes() {
        return [
            'value',
            'placeholder',
            'disabled',
            'rows',
            'cols',
            'maxlength',
            'minlength',
            'required',
            'auto-resize',
            'pattern',
            'label',
            'name',
            'validation-message',
            'show-counter'
        ];
    }
    constructor() {
        super();
        this.label = null;
        // Component state
        this._value = '';
        this.isUserTyping = false;
        // Create shadow DOM for encapsulation
        this.shadow = this.attachShadow({ mode: 'open' });
        // Create component structure
        this.container = document.createElement('div');
        this.container.className = 'texteria-container';
        // Create textarea element
        this.textarea = document.createElement('textarea');
        this.textarea.className = 'texteria-input';
        this.textarea.setAttribute('aria-label', 'Text input area');
        // Create character counter
        this.charCounter = document.createElement('span');
        this.charCounter.className = 'texteria-counter';
        this.charCounter.setAttribute('aria-live', 'polite');
        this.charCounter.setAttribute('aria-atomic', 'true');
        // Create validation message container
        this.validationMessage = document.createElement('div');
        this.validationMessage.className = 'texteria-validation';
        this.validationMessage.setAttribute('role', 'alert');
        this.validationMessage.setAttribute('aria-live', 'assertive');
        // Load styles
        this.loadStyles();
        // Assemble component
        this.assembleComponent();
        // Bind event handlers
        this.bindEvents();
    }
    /**
     * Lifecycle: Called when element is added to DOM
     */
    connectedCallback() {
        this.updateCharCounter();
        this.updateValidation();
        // Initialize auto-resize if enabled
        if (this.hasAttribute('auto-resize')) {
            this.autoResize();
        }
        // Set initial ARIA attributes
        this.updateAriaAttributes();
    }
    /**
     * Lifecycle: Called when observed attribute changes
     */
    attributeChangedCallback(name, oldValue, newValue) {
        if (oldValue === newValue)
            return;
        switch (name) {
            case 'value':
                if (!this.isUserTyping) {
                    this._value = newValue || '';
                    this.textarea.value = this._value;
                    this.updateCharCounter();
                    this.updateValidation();
                    if (this.hasAttribute('auto-resize')) {
                        this.autoResize();
                    }
                }
                break;
            case 'placeholder':
                this.textarea.placeholder = newValue || '';
                break;
            case 'disabled':
                this.textarea.disabled = newValue !== null;
                this.container.classList.toggle('disabled', newValue !== null);
                break;
            case 'rows':
                this.textarea.rows = parseInt(newValue || '3', 10);
                break;
            case 'cols':
                this.textarea.cols = parseInt(newValue || '50', 10);
                break;
            case 'maxlength':
                if (newValue) {
                    this.textarea.maxLength = parseInt(newValue, 10);
                }
                else {
                    this.textarea.removeAttribute('maxlength');
                }
                this.updateCharCounter();
                break;
            case 'minlength':
                if (newValue) {
                    this.textarea.minLength = parseInt(newValue, 10);
                }
                else {
                    this.textarea.removeAttribute('minlength');
                }
                break;
            case 'required':
                this.textarea.required = newValue !== null;
                this.updateValidation();
                break;
            case 'auto-resize':
                if (newValue !== null) {
                    this.autoResize();
                }
                break;
            case 'pattern':
                this.updateValidation();
                break;
            case 'label':
                this.updateLabel(newValue);
                break;
            case 'name':
                if (newValue) {
                    this.textarea.name = newValue;
                }
                break;
            case 'show-counter':
                this.charCounter.style.display = newValue !== null ? 'block' : 'none';
                break;
        }
        this.updateAriaAttributes();
    }
    /**
     * Load CSS styles into shadow DOM
     */
    loadStyles() {
        const style = document.createElement('style');
        style.textContent = `
      :host {
        display: block;
        --texteria-font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        --texteria-font-size: 15px;
        --texteria-line-height: 1.6;
        
        --texteria-bg: #ffffff;
        --texteria-bg-disabled: #f8f9fa;
        --texteria-border: #d1d5db;
        --texteria-border-hover: #9ca3af;
        --texteria-border-focus: #3b82f6;
        --texteria-text: #1f2937;
        --texteria-text-disabled: #9ca3af;
        --texteria-placeholder: #9ca3af;
        
        --texteria-label-color: #374151;
        --texteria-counter-color: #6b7280;
        --texteria-counter-warning: #f59e0b;
        --texteria-counter-error: #ef4444;
        
        --texteria-validation-error: #ef4444;
        --texteria-validation-bg: #fef2f2;
        
        --texteria-border-radius: 8px;
        --texteria-padding: 12px 14px;
        --texteria-transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        
        --texteria-shadow-focus: 0 0 0 3px rgba(59, 130, 246, 0.1);
        --texteria-shadow-hover: 0 1px 3px 0 rgba(0, 0, 0, 0.05);
      }

      * {
        box-sizing: border-box;
      }

      .texteria-container {
        position: relative;
        font-family: var(--texteria-font-family);
      }

      .texteria-label {
        display: block;
        font-size: 14px;
        font-weight: 500;
        color: var(--texteria-label-color);
        margin-bottom: 6px;
        transition: var(--texteria-transition);
      }

      .texteria-label.required::after {
        content: '*';
        color: var(--texteria-validation-error);
        margin-left: 4px;
      }

      .texteria-input {
        width: 100%;
        font-family: var(--texteria-font-family);
        font-size: var(--texteria-font-size);
        line-height: var(--texteria-line-height);
        color: var(--texteria-text);
        background: var(--texteria-bg);
        border: 2px solid var(--texteria-border);
        border-radius: var(--texteria-border-radius);
        padding: var(--texteria-padding);
        resize: vertical;
        transition: var(--texteria-transition);
        outline: none;
      }

      .texteria-input::placeholder {
        color: var(--texteria-placeholder);
        opacity: 1;
      }

      .texteria-input:hover:not(:disabled):not(:focus) {
        border-color: var(--texteria-border-hover);
        box-shadow: var(--texteria-shadow-hover);
      }

      .texteria-input:focus {
        border-color: var(--texteria-border-focus);
        box-shadow: var(--texteria-shadow-focus);
      }

      .texteria-input:disabled {
        background: var(--texteria-bg-disabled);
        color: var(--texteria-text-disabled);
        cursor: not-allowed;
        opacity: 0.6;
      }

      .texteria-input.invalid {
        border-color: var(--texteria-validation-error);
      }

      .texteria-input.invalid:focus {
        box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.1);
      }

      .texteria-container.auto-resize .texteria-input {
        resize: none;
        overflow: hidden;
      }

      .texteria-footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-top: 6px;
        min-height: 20px;
      }

      .texteria-counter {
        font-size: 13px;
        color: var(--texteria-counter-color);
        font-weight: 500;
        transition: var(--texteria-transition);
        margin-left: auto;
      }

      .texteria-counter.warning {
        color: var(--texteria-counter-warning);
      }

      .texteria-counter.error {
        color: var(--texteria-counter-error);
        font-weight: 600;
      }

      .texteria-validation {
        font-size: 13px;
        color: var(--texteria-validation-error);
        margin-top: 6px;
        padding: 8px 12px;
        background: var(--texteria-validation-bg);
        border-radius: 6px;
        border-left: 3px solid var(--texteria-validation-error);
        display: none;
        animation: slideIn 0.2s ease-out;
      }

      .texteria-validation.visible {
        display: block;
      }

      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(-4px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Dark mode support */
      @media (prefers-color-scheme: dark) {
        :host {
          --texteria-bg: #1f2937;
          --texteria-bg-disabled: #111827;
          --texteria-border: #374151;
          --texteria-border-hover: #4b5563;
          --texteria-border-focus: #60a5fa;
          --texteria-text: #f9fafb;
          --texteria-text-disabled: #6b7280;
          --texteria-placeholder: #6b7280;
          --texteria-label-color: #e5e7eb;
          --texteria-counter-color: #9ca3af;
          --texteria-validation-bg: #7f1d1d;
        }
      }

      /* Accessibility: High contrast mode */
      @media (prefers-contrast: high) {
        .texteria-input {
          border-width: 3px;
        }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        * {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }
    `;
        this.shadow.appendChild(style);
    }
    /**
     * Assemble the component DOM structure
     */
    assembleComponent() {
        const footer = document.createElement('div');
        footer.className = 'texteria-footer';
        footer.appendChild(this.charCounter);
        this.container.appendChild(this.textarea);
        this.container.appendChild(footer);
        this.container.appendChild(this.validationMessage);
        this.shadow.appendChild(this.container);
    }
    /**
     * Bind event handlers to textarea
     */
    bindEvents() {
        // Input event - fires on every change
        this.textarea.addEventListener('input', (_e) => {
            this.isUserTyping = true;
            this._value = this.textarea.value;
            this.setAttribute('value', this._value);
            this.updateCharCounter();
            this.updateValidation();
            if (this.hasAttribute('auto-resize')) {
                this.autoResize();
            }
            // Dispatch custom input event
            this.dispatchEvent(new CustomEvent('texteria-input', {
                detail: this.getEventDetail(),
                bubbles: true,
                composed: true
            }));
            this.isUserTyping = false;
        });
        // Change event - fires on blur after value changed
        this.textarea.addEventListener('change', () => {
            this.dispatchEvent(new CustomEvent('texteria-change', {
                detail: this.getEventDetail(),
                bubbles: true,
                composed: true
            }));
        });
        // Focus event
        this.textarea.addEventListener('focus', () => {
            this.container.classList.add('focused');
            this.dispatchEvent(new CustomEvent('texteria-focus', {
                detail: this.getEventDetail(),
                bubbles: true,
                composed: true
            }));
        });
        // Blur event
        this.textarea.addEventListener('blur', () => {
            this.container.classList.remove('focused');
            this.updateValidation();
            this.dispatchEvent(new CustomEvent('texteria-blur', {
                detail: this.getEventDetail(),
                bubbles: true,
                composed: true
            }));
        });
    }
    /**
     * Get event detail object
     */
    getEventDetail() {
        return {
            value: this._value,
            characterCount: this._value.length
        };
    }
    /**
     * Update character counter display
     */
    updateCharCounter() {
        const currentLength = this._value.length;
        const maxLength = this.textarea.maxLength;
        if (maxLength > 0) {
            this.charCounter.textContent = `${currentLength} / ${maxLength}`;
            // Update counter styling based on usage
            const percentage = (currentLength / maxLength) * 100;
            this.charCounter.classList.remove('warning', 'error');
            if (percentage >= 100) {
                this.charCounter.classList.add('error');
            }
            else if (percentage >= 90) {
                this.charCounter.classList.add('warning');
            }
        }
        else {
            this.charCounter.textContent = `${currentLength}`;
        }
    }
    /**
     * Update validation state and message
     */
    updateValidation() {
        const pattern = this.getAttribute('pattern');
        const validationMsg = this.getAttribute('validation-message');
        let isValid = true;
        let message = '';
        // Required validation
        if (this.textarea.required && !this._value.trim()) {
            isValid = false;
            message = validationMsg || 'This field is required';
        }
        // Min length validation
        else if (this.textarea.minLength > 0 && this._value.length > 0 && this._value.length < this.textarea.minLength) {
            isValid = false;
            message = validationMsg || `Minimum ${this.textarea.minLength} characters required`;
        }
        // Pattern validation
        else if (pattern && this._value.length > 0) {
            const regex = new RegExp(pattern);
            if (!regex.test(this._value)) {
                isValid = false;
                message = validationMsg || 'Please match the required format';
            }
        }
        // Update UI
        this.textarea.classList.toggle('invalid', !isValid);
        this.validationMessage.textContent = message;
        this.validationMessage.classList.toggle('visible', !isValid && message.length > 0);
        // Update ARIA
        if (!isValid && message) {
            this.textarea.setAttribute('aria-invalid', 'true');
            this.textarea.setAttribute('aria-describedby', 'validation-message');
            this.validationMessage.id = 'validation-message';
        }
        else {
            this.textarea.removeAttribute('aria-invalid');
            this.textarea.removeAttribute('aria-describedby');
        }
    }
    /**
     * Auto-resize textarea based on content
     */
    autoResize() {
        this.container.classList.add('auto-resize');
        // Reset height to auto to get the correct scrollHeight
        this.textarea.style.height = 'auto';
        // Set height based on scrollHeight
        const newHeight = Math.max(this.textarea.scrollHeight, 60); // Minimum height
        this.textarea.style.height = `${newHeight}px`;
    }
    /**
     * Update label element
     */
    updateLabel(text) {
        if (text) {
            if (!this.label) {
                this.label = document.createElement('label');
                this.label.className = 'texteria-label';
                this.container.insertBefore(this.label, this.textarea);
            }
            this.label.textContent = text;
            this.label.classList.toggle('required', this.textarea.required);
        }
        else if (this.label) {
            this.label.remove();
            this.label = null;
        }
    }
    /**
     * Update ARIA attributes for accessibility
     */
    updateAriaAttributes() {
        const label = this.getAttribute('label');
        if (label) {
            this.textarea.setAttribute('aria-label', label);
        }
        if (this.textarea.required) {
            this.textarea.setAttribute('aria-required', 'true');
        }
        else {
            this.textarea.removeAttribute('aria-required');
        }
    }
    // ========== Public API Methods ==========
    /**
     * Get the current value of the textarea
     * @returns Current value as string
     */
    getValue() {
        return this._value;
    }
    /**
     * Set the value of the textarea programmatically
     * @param value - New value to set
     */
    setValue(value) {
        this._value = value;
        this.textarea.value = value;
        this.setAttribute('value', value);
        this.updateCharCounter();
        this.updateValidation();
        if (this.hasAttribute('auto-resize')) {
            this.autoResize();
        }
    }
    /**
     * Clear the textarea value
     */
    clear() {
        this.setValue('');
    }
    /**
     * Focus the textarea
     */
    focus() {
        this.textarea.focus();
    }
    /**
     * Blur the textarea
     */
    blur() {
        this.textarea.blur();
    }
    /**
     * Check if the current value is valid
     * @returns True if valid, false otherwise
     */
    isValid() {
        return !this.textarea.classList.contains('invalid');
    }
    /**
     * Get character count
     * @returns Number of characters
     */
    getCharacterCount() {
        return this._value.length;
    }
    /**
     * Get remaining characters (if maxlength is set)
     * @returns Remaining characters or -1 if no limit
     */
    getRemainingCharacters() {
        if (this.textarea.maxLength > 0) {
            return this.textarea.maxLength - this._value.length;
        }
        return -1;
    }
}
// Register the custom element
customElements.define('text-eria', ImaraTexteria);
// Export for TypeScript modules
export default ImaraTexteria;
//# sourceMappingURL=texteria.js.map