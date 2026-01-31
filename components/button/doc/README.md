# `<app-button>` Web Component

A production-ready, accessible, and customizable button component built with native Web Components and TypeScript.

## Features

✅ **Framework-agnostic** - Works with vanilla JS, React, Vue, Angular, etc.  
✅ **Fully accessible** - ARIA attributes, keyboard navigation, focus management  
✅ **Shadow DOM** - Encapsulated styles, no CSS conflicts  
✅ **TypeScript** - Full type safety and IntelliSense  
✅ **Themeable** - CSS custom properties for easy customization  
✅ **Loading states** - Built-in spinner animation  
✅ **Multiple variants** - Primary, Secondary, Danger styles  

---

## Installation

### Option 1: Direct Import (ES Modules)

```typescript
import './components/app-button/index.js';
```

### Option 2: Manual Registration

```typescript
import { AppButton } from './components/app-button/app-button.js';

// Component auto-registers, but you can also do it manually:
customElements.define('app-button', AppButton);
```

---

## Basic Usage

### HTML

```html
<!-- Primary button (default) -->
<app-button>Click me</app-button>

<!-- Secondary variant -->
<app-button variant="secondary">Cancel</app-button>

<!-- Danger variant -->
<app-button variant="danger">Delete</app-button>

<!-- Disabled state -->
<app-button disabled>Can't click</app-button>

<!-- Loading state -->
<app-button loading>Saving...</app-button>

<!-- Submit button in a form -->
<app-button type="submit">Submit Form</app-button>
```

### JavaScript / TypeScript

```typescript
// Get reference to button
const button = document.querySelector('app-button');

// Listen to click events
button?.addEventListener('button-click', (event) => {
  console.log('Button clicked!', event.detail);
});

// Programmatically trigger click
button?.click();

// Focus the button
button?.focus();

// Change attributes dynamically
button?.setAttribute('loading', '');
button?.setAttribute('variant', 'danger');
```

---

## Attributes

| Attribute  | Type                                | Default     | Description                          |
|------------|-------------------------------------|-------------|--------------------------------------|
| `variant`  | `"primary"` \| `"secondary"` \| `"danger"` | `"primary"` | Visual style variant                 |
| `disabled` | `boolean`                           | `false`     | Disables the button                  |
| `loading`  | `boolean`                           | `false`     | Shows loading spinner, disables button |
| `type`     | `"button"` \| `"submit"`            | `"button"`  | HTML button type                     |

### Setting Attributes

```html
<!-- HTML -->
<app-button variant="secondary" disabled></app-button>
```

```javascript
// JavaScript
const btn = document.querySelector('app-button');
btn.setAttribute('variant', 'danger');
btn.setAttribute('loading', '');
btn.removeAttribute('disabled');
```

---

## Events

### `button-click`

Fired when the button is clicked (not fired when disabled or loading).

**Event Detail:**
```typescript
{
  variant: string;  // Current variant
  type: string;     // Button type
}
```

**Example:**
```javascript
button.addEventListener('button-click', (event) => {
  console.log('Variant:', event.detail.variant);
  console.log('Type:', event.detail.type);
});
```

---

## Slots

### Default Slot

The button supports a default slot for content (text, icons, HTML).

```html
<!-- Text only -->
<app-button>Save Changes</app-button>

<!-- With icon (using any icon library or emoji) -->
<app-button>
  <svg>...</svg>
  Delete
</app-button>

<!-- Just an icon -->
<app-button aria-label="Settings">
  ⚙️
</app-button>
```

---

## CSS Customization

### CSS Custom Properties (CSS Variables)

The component exposes CSS variables for theming:

| Variable                        | Default      | Description                     |
|---------------------------------|--------------|---------------------------------|
| `--button-primary-bg`           | `#2563eb`    | Primary background color        |
| `--button-primary-hover`        | `#1d4ed8`    | Primary hover color             |
| `--button-primary-active`       | `#1e40af`    | Primary active/pressed color    |
| `--button-primary-text`         | `#ffffff`    | Primary text color              |
| `--button-secondary-bg`         | `#6b7280`    | Secondary background color      |
| `--button-secondary-hover`      | `#4b5563`    | Secondary hover color           |
| `--button-secondary-active`     | `#374151`    | Secondary active color          |
| `--button-secondary-text`       | `#ffffff`    | Secondary text color            |
| `--button-danger-bg`            | `#dc2626`    | Danger background color         |
| `--button-danger-hover`         | `#b91c1c`    | Danger hover color              |
| `--button-danger-active`        | `#991b1b`    | Danger active color             |
| `--button-danger-text`          | `#ffffff`    | Danger text color               |
| `--button-disabled-bg`          | `#e5e7eb`    | Disabled background color       |
| `--button-disabled-text`        | `#9ca3af`    | Disabled text color             |
| `--button-border-radius`        | `6px`        | Border radius                   |
| `--button-padding`              | `10px 20px`  | Internal padding                |
| `--button-font-size`            | `14px`       | Font size                       |
| `--button-font-weight`          | `500`        | Font weight                     |
| `--button-transition`           | `all 0.2s ease` | Transition timing            |
| `--button-focus-ring`           | `0 0 0 3px rgba(37, 99, 235, 0.2)` | Focus ring |

### Customization Example

```css
/* Global theme override */
app-button {
  --button-primary-bg: #10b981;
  --button-primary-hover: #059669;
  --button-border-radius: 12px;
  --button-padding: 12px 24px;
}

/* Specific button override */
#my-special-button {
  --button-primary-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  --button-font-weight: 700;
}
```

### Shadow Parts

The component exposes shadow parts for advanced styling:

```css
app-button::part(button) {
  /* Style the internal button element */
}

app-button::part(content) {
  /* Style the content wrapper */
}

app-button::part(spinner) {
  /* Style the loading spinner */
}
```

---

## Accessibility

The component follows WAI-ARIA best practices:

- ✅ Fully keyboard accessible (Tab, Enter, Space)
- ✅ Proper ARIA attributes (`aria-disabled`, `aria-busy`, `aria-label`)
- ✅ Clear focus indicators (`:focus-visible`)
- ✅ Screen reader friendly
- ✅ Semantic HTML (`<button>` element)

### Accessibility Tips

```html
<!-- Add aria-label for icon-only buttons -->
<app-button aria-label="Delete item">🗑️</app-button>

<!-- Loading state is automatically announced -->
<app-button loading>Processing...</app-button>
<!-- Screen readers announce: "primary button, loading, Processing..." -->
```

---

## Advanced Examples

### Form Integration

```html
<form id="myForm">
  <input type="text" name="username" required>
  
  <app-button type="submit">
    Submit
  </app-button>
</form>

<script>
  const form = document.getElementById('myForm');
  const button = form.querySelector('app-button');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading state
    button.setAttribute('loading', '');
    
    try {
      await submitForm(new FormData(form));
      // Success!
    } catch (error) {
      // Handle error
    } finally {
      button.removeAttribute('loading');
    }
  });
</script>
```

### Dynamic Variant Switching

```html
<app-button id="toggle-btn">Toggle Variant</app-button>

<script>
  const btn = document.getElementById('toggle-btn');
  const variants = ['primary', 'secondary', 'danger'];
  let index = 0;
  
  btn.addEventListener('button-click', () => {
    index = (index + 1) % variants.length;
    btn.setAttribute('variant', variants[index]);
  });
</script>
```

### With Icons (Using SVG)

```html
<app-button variant="primary">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0a1 1 0 0 1 1 1v6h6a1 1 0 1 1 0 2H9v6a1 1 0 1 1-2 0V9H1a1 1 0 0 1 0-2h6V1a1 1 0 0 1 1-1z"/>
  </svg>
  Add Item
</app-button>
```

---

## Browser Support

- ✅ Chrome/Edge 67+
- ✅ Firefox 63+
- ✅ Safari 13.1+
- ✅ Opera 54+

Requires support for:
- Custom Elements v1
- Shadow DOM v1
- ES Modules

---

## TypeScript Support

The component is written in TypeScript and provides full type definitions:

```typescript
import { AppButton } from './components/app-button/app-button.js';

const button = document.querySelector('app-button') as AppButton;

// Type-safe methods
button.click();
button.focus();
button.blur();

// Type-safe event listening
button.addEventListener('button-click', (event: CustomEvent) => {
  console.log(event.detail.variant); // TypeScript knows the shape
});
```

---

## Common Patterns

### Async Button Actions

```typescript
async function handleClick() {
  const btn = document.querySelector('#save-btn') as AppButton;
  
  btn.setAttribute('loading', '');
  
  try {
    await saveData();
    btn.setAttribute('variant', 'primary');
  } catch (error) {
    btn.setAttribute('variant', 'danger');
  } finally {
    btn.removeAttribute('loading');
  }
}
```

### Confirmation Pattern

```html
<app-button id="delete-btn" variant="danger">Delete</app-button>

<script>
  const btn = document.getElementById('delete-btn');
  let confirmed = false;
  
  btn.addEventListener('button-click', () => {
    if (!confirmed) {
      btn.textContent = 'Click again to confirm';
      confirmed = true;
      
      setTimeout(() => {
        btn.textContent = 'Delete';
        confirmed = false;
      }, 3000);
    } else {
      // Actually delete
      performDelete();
    }
  });
</script>
```

---

## Troubleshooting

### Component not rendering?

Make sure you've imported the component before using it:
```typescript
import './components/app-button/index.js';
```

### Styles not applying?

The component uses Shadow DOM, so external styles won't penetrate. Use CSS custom properties instead:
```css
app-button {
  --button-primary-bg: red;
}
```

### Events not firing?

Use the custom `button-click` event, not the native `click` event:
```javascript
// ✅ Correct
button.addEventListener('button-click', handler);

// ❌ Won't work as expected with the custom element
button.addEventListener('click', handler);
```

---

## License

MIT

## Contributing

Contributions welcome! This is a standard Web Component that can be extended and customized for your needs.
