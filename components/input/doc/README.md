# `<app-input>` Web Component

A production-ready, accessible, and customizable input component built with native Web Components and TypeScript.

## Features

✅ **Framework-agnostic** - Works with vanilla JS, React, Vue, Angular, etc.  
✅ **Fully accessible** - ARIA attributes, keyboard navigation, form participation  
✅ **Shadow DOM** - Encapsulated styles, no CSS conflicts  
✅ **TypeScript** - Full type safety and IntelliSense  
✅ **Themeable** - 25+ CSS custom properties  
✅ **Form-associated** - Native form integration with validation  
✅ **Multiple input types** - Text, password, email, number, search  
✅ **Slots** - Prefix/suffix for icons, helper text support  

---

## Installation

### Option 1: Direct Import (ES Modules)

```typescript
import './components/app-input/index.js';
```

### Option 2: Manual Registration

```typescript
import { AppInput } from './components/app-input/app-input.js';

// Component auto-registers, but you can also do it manually:
customElements.define('app-input', AppInput);
```

---

## Basic Usage

### HTML

```html
<!-- Basic text input -->
<app-input 
  label="Username" 
  placeholder="Enter your username"
></app-input>

<!-- Email input with validation -->
<app-input 
  label="Email" 
  type="email" 
  placeholder="you@example.com"
  required
></app-input>

<!-- Password input -->
<app-input 
  label="Password" 
  type="password"
  required
>
  <span slot="">Must be at least 8 characters</span>
</app-input>

<!-- Input with error state -->
<app-input 
  label="Username" 
  value="ab"
  error
>
  <span slot="">Username must be at least 3 characters</span>
</app-input>

<!-- Disabled input -->
<app-input 
  label="Email" 
  value="locked@example.com"
  disabled
></app-input>

<!-- Read-only input -->
<app-input 
  label="ID" 
  value="12345"
  readonly
></app-input>
```

### JavaScript / TypeScript

```typescript
// Get reference to input
const input = document.querySelector('app-input');

// Listen to input events
input?.addEventListener('input', (event) => {
  console.log('Value changed:', event.detail.value);
});

// Listen to change events
input?.addEventListener('change', (event) => {
  console.log('Input changed:', event.detail.value);
});

// Get/set value
console.log(input?.value); // getter
input.value = 'new value'; // setter

// Programmatic focus
input?.focus();

// Validate input
const isValid = input?.checkValidity();
```

---

## Attributes

| Attribute     | Type      | Default  | Description                          |
|---------------|-----------|----------|--------------------------------------|
| `type`        | `string`  | `"text"` | Input type: text, password, email, number, search |
| `value`       | `string`  | `""`     | Input value (two-way bound)          |
| `placeholder` | `string`  | `""`     | Placeholder text                     |
| `label`       | `string`  | `""`     | Label text above input               |
| `name`        | `string`  | `""`     | Input name for form submission       |
| `disabled`    | `boolean` | `false`  | Disables the input                   |
| `readonly`    | `boolean` | `false`  | Makes input read-only                |
| `required`    | `boolean` | `false`  | Marks input as required (shows *)    |
| `error`       | `boolean` | `false`  | Shows error state (red border/text)  |

### Setting Attributes

```html
<!-- HTML -->
<app-input 
  type="email" 
  label="Email"
  required
  error
></app-input>
```

```javascript
// JavaScript
const input = document.querySelector('app-input');
input.setAttribute('type', 'password');
input.setAttribute('value', 'secret');
input.setAttribute('error', '');
input.removeAttribute('disabled');
```

---

## Properties

### `value` (get/set)

Get or set the input value programmatically.

```typescript
const input = document.querySelector('app-input');

// Get value
const currentValue = input.value;

// Set value
input.value = 'new value';
```

---

## Methods

| Method                    | Returns   | Description                          |
|---------------------------|-----------|--------------------------------------|
| `focus()`                 | `void`    | Focus the input                      |
| `blur()`                  | `void`    | Remove focus from input              |
| `select()`                | `void`    | Select all input text                |
| `checkValidity()`         | `boolean` | Check if input is valid              |
| `reportValidity()`        | `boolean` | Check validity and show message      |
| `setCustomValidity(msg)`  | `void`    | Set custom validation message        |

### Usage Examples

```typescript
const input = document.querySelector('app-input') as AppInput;

// Focus the input
input.focus();

// Select all text
input.select();

// Check validity
if (!input.checkValidity()) {
  console.log('Input is invalid');
}

// Set custom validation
input.setCustomValidity('This username is already taken');
```

---

## Events

### `input`

Fired when the input value changes (on every keystroke).

**Event Detail:**
```typescript
{
  value: string;      // Current input value
  inputType: string;  // Type of input event
}
```

**Example:**
```javascript
input.addEventListener('input', (event) => {
  console.log('New value:', event.detail.value);
  console.log('Input type:', event.detail.inputType);
});
```

### `change`

Fired when the input loses focus after the value has changed.

**Event Detail:**
```typescript
{
  value: string;  // Current input value
}
```

**Example:**
```javascript
input.addEventListener('change', (event) => {
  console.log('Final value:', event.detail.value);
});
```

### `focus`

Fired when the input receives focus.

**Event Detail:**
```typescript
{
  value: string;  // Current input value
}
```

### `blur`

Fired when the input loses focus.

**Event Detail:**
```typescript
{
  value: string;  // Current input value
}
```

---

## Slots

### Default Slot

The default slot is used for helper text or error messages displayed below the input.

```html
<app-input label="Password" type="password">
  <span slot="">Must be at least 8 characters</span>
</app-input>

<!-- Error message example -->
<app-input label="Email" type="email" error>
  <span slot="">Please enter a valid email address</span>
</app-input>
```

### `prefix` Slot

Add icons, text, or other content before the input field.

```html
<app-input label="Website" placeholder="example.com">
  <span slot="prefix">https://</span>
</app-input>

<!-- With icon -->
<app-input label="Search" type="search">
  <svg slot="prefix" width="16" height="16" fill="currentColor">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
  </svg>
</app-input>
```

### `suffix` Slot

Add icons, buttons, or other content after the input field.

```html
<!-- Password visibility toggle example -->
<app-input label="Password" type="password">
  <button slot="suffix" type="button" onclick="togglePassword()">
    👁️
  </button>
</app-input>

<!-- Unit indicator -->
<app-input label="Width" type="number" value="100">
  <span slot="suffix">px</span>
</app-input>

<!-- Clear button -->
<app-input label="Search" type="search" value="query">
  <button slot="suffix" type="button">✕</button>
</app-input>
```

---

## CSS Customization

### CSS Custom Properties (CSS Variables)

The component exposes extensive CSS variables for theming:

| Variable                          | Default       | Description                     |
|-----------------------------------|---------------|---------------------------------|
| `--input-border-color`            | `#d1d5db`     | Default border color            |
| `--input-border-color-hover`      | `#9ca3af`     | Border color on hover           |
| `--input-border-color-focus`      | `#2563eb`     | Border color when focused       |
| `--input-border-color-error`      | `#dc2626`     | Border color in error state     |
| `--input-bg`                      | `#ffffff`     | Background color                |
| `--input-bg-disabled`             | `#f3f4f6`     | Background when disabled        |
| `--input-text-color`              | `#1f2937`     | Text color                      |
| `--input-text-color-disabled`     | `#9ca3af`     | Text color when disabled        |
| `--input-placeholder-color`       | `#9ca3af`     | Placeholder text color          |
| `--input-label-color`             | `#374151`     | Label text color                |
| `--input-label-color-required`    | `#dc2626`     | Required asterisk color         |
| `--input-helper-color`            | `#6b7280`     | Helper text color               |
| `--input-error-color`             | `#dc2626`     | Error message color             |
| `--input-border-radius`           | `6px`         | Border radius                   |
| `--input-border-width`            | `1px`         | Border width                    |
| `--input-padding`                 | `10px 12px`   | Internal padding                |
| `--input-font-size`               | `14px`        | Input text font size            |
| `--input-line-height`             | `1.5`         | Line height                     |
| `--input-label-font-size`         | `14px`        | Label font size                 |
| `--input-label-font-weight`       | `500`         | Label font weight               |
| `--input-label-margin-bottom`     | `6px`         | Space below label               |
| `--input-helper-font-size`        | `13px`        | Helper text font size           |
| `--input-helper-margin-top`       | `6px`         | Space above helper text         |
| `--input-focus-ring`              | `0 0 0 3px rgba(37, 99, 235, 0.1)` | Focus ring shadow |
| `--input-transition`              | `all 0.2s ease` | Transition timing             |

### Customization Examples

```css
/* Global theme override */
app-input {
  --input-border-color-focus: #10b981;
  --input-border-radius: 8px;
  --input-padding: 12px 16px;
  --input-font-size: 16px;
}

/* Dark theme */
.dark-theme app-input {
  --input-bg: #1f2937;
  --input-border-color: #374151;
  --input-text-color: #f9fafb;
  --input-label-color: #e5e7eb;
  --input-placeholder-color: #6b7280;
}

/* Specific input override */
#special-input {
  --input-border-color-focus: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --input-border-width: 2px;
}
```

### Shadow Parts

The component exposes shadow parts for advanced styling:

```css
/* Style the wrapper */
app-input::part(wrapper) {
  /* Custom styles */
}

/* Style the label */
app-input::part(label) {
  /* Custom styles */
}

/* Style the input container */
app-input::part(container) {
  /* Custom styles */
}

/* Style the input element */
app-input::part(input) {
  /* Custom styles */
}

/* Style prefix/suffix areas */
app-input::part(prefix) {
  /* Custom styles */
}

app-input::part(suffix) {
  /* Custom styles */
}

/* Style helper text area */
app-input::part(helper) {
  /* Custom styles */
}
```

---

## Accessibility

The component follows WAI-ARIA best practices:

- ✅ Proper label association
- ✅ Keyboard accessible (Tab, Shift+Tab)
- ✅ ARIA attributes (`aria-required`, `aria-invalid`, `aria-disabled`)
- ✅ Clear focus indicators
- ✅ Screen reader friendly
- ✅ Native form participation

### Accessibility Best Practices

```html
<!-- Always provide a label -->
<app-input label="Email" type="email"></app-input>

<!-- Use helper text for instructions -->
<app-input label="Password" type="password">
  <span slot="">Must include uppercase, lowercase, and numbers</span>
</app-input>

<!-- Mark required fields -->
<app-input label="Username" required></app-input>

<!-- Show clear error messages -->
<app-input label="Email" type="email" error>
  <span slot="">Please enter a valid email address</span>
</app-input>
```

---

## Form Integration

The component is form-associated and works seamlessly with native HTML forms.

```html
<form id="myForm">
  <app-input 
    name="username" 
    label="Username" 
    required
  ></app-input>
  
  <app-input 
    name="email" 
    label="Email" 
    type="email" 
    required
  ></app-input>
  
  <app-input 
    name="password" 
    label="Password" 
    type="password" 
    required
  >
    <span slot="">At least 8 characters</span>
  </app-input>
  
  <button type="submit">Sign Up</button>
</form>

<script type="module">
  const form = document.getElementById('myForm');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    console.log('Username:', formData.get('username'));
    console.log('Email:', formData.get('email'));
    console.log('Password:', formData.get('password'));
  });
</script>
```

---

## Advanced Examples

### Real-time Validation

```html
<app-input 
  id="email-input"
  label="Email" 
  type="email"
>
  <span slot="" id="email-error"></span>
</app-input>

<script type="module">
  const input = document.getElementById('email-input');
  const errorMsg = document.getElementById('email-error');
  
  input.addEventListener('input', (e) => {
    const email = e.detail.value;
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    
    if (email && !isValid) {
      input.setAttribute('error', '');
      errorMsg.textContent = 'Please enter a valid email';
    } else {
      input.removeAttribute('error');
      errorMsg.textContent = '';
    }
  });
</script>
```

### Password Strength Indicator

```html
<app-input 
  id="password-input"
  label="Password" 
  type="password"
>
  <span slot="" id="strength"></span>
</app-input>

<script type="module">
  const input = document.getElementById('password-input');
  const strength = document.getElementById('strength');
  
  input.addEventListener('input', (e) => {
    const pwd = e.detail.value;
    let score = 0;
    
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    
    const levels = ['Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    strength.textContent = pwd ? `Strength: ${levels[score - 1] || 'Weak'}` : '';
  });
</script>
```

### Search with Debounce

```html
<app-input 
  id="search-input"
  label="Search" 
  type="search"
  placeholder="Type to search..."
>
  <svg slot="prefix" width="16" height="16" fill="currentColor">
    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
  </svg>
</app-input>

<script type="module">
  const searchInput = document.getElementById('search-input');
  let debounceTimer;
  
  searchInput.addEventListener('input', (e) => {
    clearTimeout(debounceTimer);
    
    debounceTimer = setTimeout(() => {
      performSearch(e.detail.value);
    }, 300);
  });
  
  function performSearch(query) {
    console.log('Searching for:', query);
    // Perform search API call
  }
</script>
```

---

## Browser Support

- ✅ Chrome/Edge 77+ (for form-associated custom elements)
- ✅ Firefox 93+
- ✅ Safari 16.4+
- ✅ Opera 64+

Requires support for:
- Custom Elements v1
- Shadow DOM v1
- ES Modules
- ElementInternals API (for form association)

---

## TypeScript Support

Full TypeScript definitions included:

```typescript
import { AppInput } from './components/app-input/app-input.js';

const input = document.querySelector('app-input') as AppInput;

// Type-safe properties
input.value = 'typed value';
const val: string = input.value;

// Type-safe methods
input.focus();
input.select();
const isValid: boolean = input.checkValidity();

// Type-safe event listening
input.addEventListener('input', (event: CustomEvent) => {
  console.log(event.detail.value); // TypeScript knows the shape
});
```

---

## Troubleshooting

### Component not rendering?

Ensure the component is imported before use:
```typescript
import './components/app-input/index.js';
```

### Styles not applying?

The component uses Shadow DOM. Use CSS custom properties:
```css
app-input {
  --input-border-color-focus: red;
}
```

### Value not updating?

Use the `value` property or attribute:
```javascript
// Correct
input.value = 'new value';
input.setAttribute('value', 'new value');

// Won't work
input.querySelector('input').value = 'new value'; // Can't access shadow DOM
```

### Form not submitting values?

Ensure the `name` attribute is set:
```html
<app-input name="email" label="Email"></app-input>
```

---

## License

MIT

## Contributing

Contributions welcome! This component can be extended and customized for your needs.
