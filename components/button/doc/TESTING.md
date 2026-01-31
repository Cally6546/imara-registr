# Testing Guide for App Button Component

## Manual Testing Checklist

### Visual Testing

- [ ] **Variants render correctly**
  - Primary button has blue background
  - Secondary button has gray background
  - Danger button has red background

- [ ] **States work as expected**
  - Disabled buttons appear grayed out and cannot be clicked
  - Loading buttons show spinner animation
  - Hover states change background color
  - Active/pressed state shows visual feedback

- [ ] **Responsive behavior**
  - Button text wraps appropriately
  - Button maintains minimum width
  - Content slots work with various content types

### Functional Testing

- [ ] **Click events**
  - `button-click` event fires when clicked
  - Event does NOT fire when disabled
  - Event does NOT fire when loading
  - Event detail contains correct variant and type

- [ ] **Attributes**
  - `variant` attribute changes button appearance
  - `disabled` attribute prevents interaction
  - `loading` attribute shows spinner and prevents interaction
  - `type` attribute sets correct button type (submit/button)

- [ ] **Dynamic updates**
  - Changing attributes via JavaScript updates the component
  - Multiple attribute changes work correctly
  - Component re-renders when needed

### Accessibility Testing

- [ ] **Keyboard navigation**
  - Tab key focuses the button
  - Enter key activates the button
  - Space key activates the button
  - Shift+Tab moves focus backwards

- [ ] **Screen reader**
  - Button announces its role correctly
  - Disabled state is announced
  - Loading state is announced (aria-busy)
  - aria-label is respected when present

- [ ] **Focus management**
  - Focus indicator is clearly visible
  - Focus can be programmatically set via `.focus()`
  - Focus can be removed via `.blur()`

## Automated Testing Examples

### Unit Test Template (using Web Test Runner)

```typescript
import { expect, fixture, html } from '@open-wc/testing';
import { AppButton } from '../app-button.js';

describe('AppButton', () => {
  it('is defined', () => {
    const el = document.createElement('app-button');
    expect(el).to.be.instanceOf(AppButton);
  });

  it('renders with default slot content', async () => {
    const el = await fixture(html`<app-button>Click me</app-button>`);
    const shadowContent = el.shadowRoot?.querySelector('.button-content');
    expect(shadowContent?.textContent?.trim()).to.equal('Click me');
  });

  it('applies variant attribute', async () => {
    const el = await fixture(html`<app-button variant="danger">Delete</app-button>`);
    expect(el.getAttribute('variant')).to.equal('danger');
  });

  it('disables button when disabled attribute is set', async () => {
    const el = await fixture(html`<app-button disabled>Disabled</app-button>`);
    const button = el.shadowRoot?.querySelector('button');
    expect(button?.hasAttribute('disabled')).to.be.true;
  });

  it('shows loading state', async () => {
    const el = await fixture(html`<app-button loading>Loading</app-button>`);
    const button = el.shadowRoot?.querySelector('button');
    expect(button?.getAttribute('aria-busy')).to.equal('true');
  });

  it('emits button-click event when clicked', async () => {
    const el = await fixture(html`<app-button>Click</app-button>`);
    let eventFired = false;
    
    el.addEventListener('button-click', (e: Event) => {
      eventFired = true;
      expect((e as CustomEvent).detail).to.have.property('variant');
    });

    const button = el.shadowRoot?.querySelector('button');
    button?.click();
    
    expect(eventFired).to.be.true;
  });

  it('does not emit event when disabled', async () => {
    const el = await fixture(html`<app-button disabled>Disabled</app-button>`);
    let eventFired = false;
    
    el.addEventListener('button-click', () => {
      eventFired = true;
    });

    const button = el.shadowRoot?.querySelector('button');
    button?.click();
    
    expect(eventFired).to.be.false;
  });

  it('updates when attributes change', async () => {
    const el = await fixture(html`<app-button>Test</app-button>`);
    
    el.setAttribute('variant', 'danger');
    await el.updateComplete; // If using LitElement, otherwise use custom update mechanism
    
    expect(el.getAttribute('variant')).to.equal('danger');
  });
});
```

### Integration Test Example

```typescript
import { expect, fixture, html } from '@open-wc/testing';

describe('AppButton Integration', () => {
  it('works in a form', async () => {
    const form = await fixture(html`
      <form>
        <input type="text" name="test" value="value">
        <app-button type="submit">Submit</app-button>
      </form>
    `);

    let formSubmitted = false;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      formSubmitted = true;
    });

    const button = form.querySelector('app-button');
    button?.click();

    expect(formSubmitted).to.be.true;
  });

  it('handles async operations', async () => {
    const el = await fixture(html`<app-button>Async</app-button>`);
    
    el.setAttribute('loading', '');
    expect(el.hasAttribute('loading')).to.be.true;
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    el.removeAttribute('loading');
    expect(el.hasAttribute('loading')).to.be.false;
  });
});
```

## Browser Testing

Test the component in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

### Browser-Specific Checks

**Chrome/Edge:**
- Shadow DOM inspector works correctly
- CSS custom properties apply correctly
- Animation performance is smooth

**Firefox:**
- Focus outline renders correctly
- Shadow parts work as expected
- Event bubbling through shadow DOM

**Safari:**
- Web Components polyfills not needed (13.1+)
- CSS variables inherit properly
- Touch events work on mobile

## Performance Testing

### Metrics to Check

1. **Rendering Performance**
   - Component should render in < 50ms
   - No layout thrashing when adding multiple buttons

2. **Memory Usage**
   - No memory leaks when adding/removing buttons
   - Shadow DOM cleanup on disconnect

3. **Bundle Size**
   - Compiled JavaScript should be < 10KB (minified)
   - No unnecessary dependencies

### Performance Test Code

```javascript
// Test rendering 100 buttons
console.time('render-100-buttons');

const container = document.createElement('div');
for (let i = 0; i < 100; i++) {
  const btn = document.createElement('app-button');
  btn.textContent = `Button ${i}`;
  container.appendChild(btn);
}

document.body.appendChild(container);

console.timeEnd('render-100-buttons');
// Expected: < 100ms

// Cleanup
document.body.removeChild(container);
```

## Common Issues & Solutions

### Issue: Component not rendering

**Solution:** Ensure the component is imported before use:
```typescript
import './components/app-button/index.js';
```

### Issue: Styles not applying

**Solution:** Remember Shadow DOM isolates styles. Use CSS custom properties:
```css
app-button {
  --button-primary-bg: red;
}
```

### Issue: Events not bubbling

**Solution:** Use `composed: true` in custom events (already implemented):
```typescript
this.dispatchEvent(new CustomEvent('button-click', {
  bubbles: true,
  composed: true // Allows event to cross shadow boundary
}));
```

## Continuous Testing

Add these scripts to your CI/CD pipeline:

```bash
# Type checking
npm run lint

# Build check
npm run build

# Unit tests (if using a test runner)
npm test

# Visual regression tests (if using Percy, Chromatic, etc.)
npm run test:visual
```

## Accessibility Testing Tools

Use these tools to verify accessibility:

1. **Lighthouse** (Chrome DevTools)
   - Accessibility score should be 100

2. **axe DevTools** (Browser extension)
   - No violations should be detected

3. **NVDA/JAWS** (Screen readers)
   - Button should announce correctly
   - States should be conveyed

4. **Keyboard Testing**
   - All functionality accessible via keyboard
   - Focus visible and logical

## Manual A11y Test Script

```
1. Navigate to button using Tab key
   ✓ Button receives focus
   ✓ Focus indicator is visible

2. Press Enter or Space
   ✓ Button activates
   ✓ Event fires

3. Test with screen reader
   ✓ Role announced as "button"
   ✓ Label/text announced
   ✓ State announced (disabled, busy, etc.)

4. Test disabled button
   ✓ Cannot be focused (or focus but can't activate)
   ✓ Announced as disabled

5. Test loading button
   ✓ Announced as busy
   ✓ Cannot be activated
```

## Ready for Production

Before deploying, ensure:

- ✅ All manual tests pass
- ✅ Automated tests pass (if implemented)
- ✅ Cross-browser testing complete
- ✅ Accessibility audit passes
- ✅ Performance benchmarks met
- ✅ Documentation is complete
- ✅ Examples work correctly
