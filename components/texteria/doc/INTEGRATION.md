# Integration Guide for Texteria

This guide shows how to integrate Texteria into various frameworks and build setups.

## 📦 Vanilla JavaScript / HTML

### Direct Script Import

```html
<!DOCTYPE html>
<html>
<head>
  <script type="module" src="./texteria.js"></script>
</head>
<body>
  <text-eria placeholder="Type here..."></text-eria>
  
  <script type="module">
    const textarea = document.querySelector('text-eria');
    textarea.addEventListener('texteria-input', (e) => {
      console.log(e.detail.value);
    });
  </script>
</body>
</html>
```

## ⚛️ React Integration

### Create a React Wrapper

```typescript
// TexteriaReact.tsx
import React, { useEffect, useRef, forwardRef, useImperativeHandle } from 'react';
import '../texteria.js'; // Import the web component

interface TexteriaProps {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  cols?: number;
  maxlength?: number;
  minlength?: number;
  required?: boolean;
  autoResize?: boolean;
  pattern?: string;
  label?: string;
  name?: string;
  validationMessage?: string;
  showCounter?: boolean;
  onInput?: (value: string, characterCount: number) => void;
  onChange?: (value: string, characterCount: number) => void;
  onFocus?: (value: string, characterCount: number) => void;
  onBlur?: (value: string, characterCount: number) => void;
}

export interface TexteriaRef {
  getValue: () => string;
  setValue: (value: string) => void;
  clear: () => void;
  focus: () => void;
  blur: () => void;
  isValid: () => boolean;
}

const TexteriaReact = forwardRef<TexteriaRef, TexteriaProps>((props, ref) => {
  const elementRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    getValue: () => elementRef.current?.getValue() || '',
    setValue: (value: string) => elementRef.current?.setValue(value),
    clear: () => elementRef.current?.clear(),
    focus: () => elementRef.current?.focus(),
    blur: () => elementRef.current?.blur(),
    isValid: () => elementRef.current?.isValid() || false,
  }));

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const handleInput = (e: CustomEvent) => {
      props.onInput?.(e.detail.value, e.detail.characterCount);
    };
    const handleChange = (e: CustomEvent) => {
      props.onChange?.(e.detail.value, e.detail.characterCount);
    };
    const handleFocus = (e: CustomEvent) => {
      props.onFocus?.(e.detail.value, e.detail.characterCount);
    };
    const handleBlur = (e: CustomEvent) => {
      props.onBlur?.(e.detail.value, e.detail.characterCount);
    };

    element.addEventListener('texteria-input', handleInput);
    element.addEventListener('texteria-change', handleChange);
    element.addEventListener('texteria-focus', handleFocus);
    element.addEventListener('texteria-blur', handleBlur);

    return () => {
      element.removeEventListener('texteria-input', handleInput);
      element.removeEventListener('texteria-change', handleChange);
      element.removeEventListener('texteria-focus', handleFocus);
      element.removeEventListener('texteria-blur', handleBlur);
    };
  }, [props.onInput, props.onChange, props.onFocus, props.onBlur]);

  return (
    <text-eria
      ref={elementRef}
      value={props.value}
      placeholder={props.placeholder}
      disabled={props.disabled}
      rows={props.rows}
      cols={props.cols}
      maxlength={props.maxlength}
      minlength={props.minlength}
      required={props.required}
      auto-resize={props.autoResize}
      pattern={props.pattern}
      label={props.label}
      name={props.name}
      validation-message={props.validationMessage}
      show-counter={props.showCounter}
    />
  );
});

export default TexteriaReact;
```

### Usage in React

```tsx
import TexteriaReact from './TexteriaReact';

function App() {
  const [value, setValue] = useState('');
  const textareaRef = useRef<TexteriaRef>(null);

  const handleInput = (value: string, count: number) => {
    setValue(value);
    console.log(`Value: ${value}, Characters: ${count}`);
  };

  const handleSubmit = () => {
    if (textareaRef.current?.isValid()) {
      console.log('Valid:', textareaRef.current.getValue());
    }
  };

  return (
    <div>
      <TexteriaReact
        ref={textareaRef}
        label="Your Message"
        placeholder="Type here..."
        maxlength={500}
        required
        autoResize
        showCounter
        onInput={handleInput}
      />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

### TypeScript Declaration for React

```typescript
// global.d.ts
declare namespace JSX {
  interface IntrinsicElements {
    'text-eria': any;
  }
}
```

## 🎯 Vue 3 Integration

### Direct Usage

```vue
<template>
  <text-eria
    :value="value"
    placeholder="Type here..."
    :maxlength="500"
    required
    auto-resize
    show-counter
    @texteria-input="handleInput"
    @texteria-change="handleChange"
  />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import '../texteria.js';

const value = ref('');

const handleInput = (e: CustomEvent) => {
  value.value = e.detail.value;
  console.log('Input:', e.detail.value);
};

const handleChange = (e: CustomEvent) => {
  console.log('Changed:', e.detail.value);
};
</script>
```

### Vue Wrapper Component

```vue
<!-- TexteriaVue.vue -->
<template>
  <text-eria
    ref="textareaRef"
    :value="modelValue"
    :placeholder="placeholder"
    :disabled="disabled"
    :rows="rows"
    :cols="cols"
    :maxlength="maxlength"
    :minlength="minlength"
    :required="required"
    :auto-resize="autoResize"
    :pattern="pattern"
    :label="label"
    :name="name"
    :validation-message="validationMessage"
    :show-counter="showCounter"
    @texteria-input="handleInput"
    @texteria-change="handleChange"
    @texteria-focus="handleFocus"
    @texteria-blur="handleBlur"
  />
</template>

<script setup lang="ts">
import { ref, defineEmits, defineExpose } from 'vue';
import '../texteria.js';

interface Props {
  modelValue?: string;
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  cols?: number;
  maxlength?: number;
  minlength?: number;
  required?: boolean;
  autoResize?: boolean;
  pattern?: string;
  label?: string;
  name?: string;
  validationMessage?: string;
  showCounter?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  rows: 3,
  cols: 50,
});

const emit = defineEmits(['update:modelValue', 'input', 'change', 'focus', 'blur']);

const textareaRef = ref<any>(null);

const handleInput = (e: CustomEvent) => {
  emit('update:modelValue', e.detail.value);
  emit('input', e.detail);
};

const handleChange = (e: CustomEvent) => {
  emit('change', e.detail);
};

const handleFocus = (e: CustomEvent) => {
  emit('focus', e.detail);
};

const handleBlur = (e: CustomEvent) => {
  emit('blur', e.detail);
};

defineExpose({
  getValue: () => textareaRef.value?.getValue(),
  setValue: (value: string) => textareaRef.value?.setValue(value),
  clear: () => textareaRef.value?.clear(),
  focus: () => textareaRef.value?.focus(),
  blur: () => textareaRef.value?.blur(),
  isValid: () => textareaRef.value?.isValid(),
});
</script>
```

## 🅰️ Angular Integration

### Module Configuration

```typescript
// app.module.ts
import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';

// Import the web component
import '../texteria.js';

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA], // Important!
  bootstrap: [AppComponent]
})
export class AppModule { }
```

### Component Usage

```typescript
// app.component.ts
import { Component, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <text-eria
      #textarea
      label="Your Message"
      placeholder="Type here..."
      [attr.maxlength]="500"
      [attr.required]="true"
      [attr.auto-resize]="true"
      [attr.show-counter]="true"
      (texteria-input)="onInput($event)"
      (texteria-change)="onChange($event)">
    </text-eria>
    <button (click)="submit()">Submit</button>
  `
})
export class AppComponent {
  @ViewChild('textarea', { static: true }) textarea!: ElementRef;

  onInput(event: CustomEvent) {
    console.log('Input:', event.detail.value);
  }

  onChange(event: CustomEvent) {
    console.log('Changed:', event.detail.value);
  }

  submit() {
    const element = this.textarea.nativeElement;
    if (element.isValid()) {
      console.log('Valid value:', element.getValue());
    }
  }
}
```

## 🔧 Webpack Configuration

```javascript
// webpack.config.js
module.exports = {
  // ... other config
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
};
```

## 📦 Vite Configuration

```javascript
// vite.config.js
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      external: [],
    },
  },
});
```

## 🎪 Svelte Integration

```svelte
<!-- TexteriaComponent.svelte -->
<script lang="ts">
  import { onMount } from 'svelte';
  import '../texteria.js';

  export let value = '';
  export let placeholder = '';
  export let maxlength = undefined;

  let textareaElement: any;

  function handleInput(e: CustomEvent) {
    value = e.detail.value;
  }

  onMount(() => {
    textareaElement.addEventListener('texteria-input', handleInput);
    return () => {
      textareaElement?.removeEventListener('texteria-input', handleInput);
    };
  });
</script>

<text-eria
  bind:this={textareaElement}
  {value}
  {placeholder}
  maxlength={maxlength}
  show-counter
/>
```

## 🌐 Next.js Integration

```tsx
// components/Texteria.tsx
'use client';

import { useEffect, useRef } from 'react';

export default function Texteria(props: any) {
  const ref = useRef<any>(null);

  useEffect(() => {
    // Import only on client side
    import('../texteria.js');
  }, []);

  return <text-eria ref={ref} {...props} />;
}
```

## 📱 Mobile/Cordova

For mobile apps using Cordova or similar:

```html
<!-- index.html -->
<script type="module" src="js/texteria.js"></script>

<text-eria
  placeholder="Mobile input..."
  auto-resize
  show-counter>
</text-eria>
```

## 🔌 CDN Usage

If you want to host on a CDN:

```html
<script type="module" src="https://your-cdn.com/texteria@1.0.0/texteria.js"></script>

<text-eria placeholder="From CDN"></text-eria>
```

## 🧪 Testing

### Jest Configuration

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/setup-tests.js'],
};
```

```javascript
// setup-tests.js
import '../texteria.js';
```

### Example Test

```javascript
describe('Texteria', () => {
  let element;

  beforeEach(() => {
    element = document.createElement('text-eria');
    document.body.appendChild(element);
  });

  afterEach(() => {
    document.body.removeChild(element);
  });

  test('sets and gets value', () => {
    element.setValue('test value');
    expect(element.getValue()).toBe('test value');
  });

  test('validates required field', () => {
    element.setAttribute('required', '');
    expect(element.isValid()).toBe(false);
    
    element.setValue('some text');
    expect(element.isValid()).toBe(true);
  });
});
```

## 🎨 Custom Styling Examples

### Material Design Style

```css
text-eria.material {
  --texteria-border: transparent;
  --texteria-border-focus: #1976d2;
  --texteria-border-radius: 4px;
  --texteria-padding: 16px;
  --texteria-shadow-focus: 0 2px 4px rgba(0,0,0,0.2);
}
```

### Neumorphism Style

```css
text-eria.neuro {
  --texteria-bg: #e0e5ec;
  --texteria-border: transparent;
  --texteria-border-radius: 16px;
  --texteria-shadow-hover: inset 5px 5px 10px #a3b1c6, inset -5px -5px 10px #ffffff;
  --texteria-shadow-focus: inset 8px 8px 16px #a3b1c6, inset -8px -8px 16px #ffffff;
}
```

---

For more examples and detailed documentation, see the main [README.md](./README.md).
