# Advanced Usage Examples

This document contains real-world usage patterns and advanced examples for the App Button component.

## Table of Contents

1. [Basic Patterns](#basic-patterns)
2. [Form Integration](#form-integration)
3. [Async Operations](#async-operations)
4. [State Management](#state-management)
5. [Custom Styling](#custom-styling)
6. [Framework Integration](#framework-integration)
7. [Real-World Scenarios](#real-world-scenarios)

---

## Basic Patterns

### Simple Click Handler

```html
<app-button id="simple-btn">Click Me</app-button>

<script type="module">
  const btn = document.getElementById('simple-btn');
  
  btn.addEventListener('button-click', (event) => {
    console.log('Button clicked!', event.detail);
    alert('Hello World!');
  });
</script>
```

### Icon Button

```html
<app-button aria-label="Delete item">
  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
    <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
  </svg>
</app-button>
```

### Button with Text and Icon

```html
<app-button>
  <svg width="16" height="16" style="margin-right: 6px;" fill="currentColor">
    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z"/>
  </svg>
  Add New Item
</app-button>
```

---

## Form Integration

### Basic Form Submit

```html
<form id="user-form">
  <div>
    <label>Username:</label>
    <input type="text" name="username" required>
  </div>
  
  <div>
    <label>Email:</label>
    <input type="email" name="email" required>
  </div>
  
  <app-button type="submit">Create Account</app-button>
</form>

<script type="module">
  const form = document.getElementById('user-form');
  const submitBtn = form.querySelector('app-button');
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Show loading state
    submitBtn.setAttribute('loading', '');
    
    try {
      const formData = new FormData(form);
      const response = await fetch('/api/users', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        alert('Account created successfully!');
        form.reset();
      } else {
        throw new Error('Failed to create account');
      }
    } catch (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } finally {
      submitBtn.removeAttribute('loading');
    }
  });
</script>
```

### Form with Validation

```html
<form id="validated-form">
  <input type="email" id="email-input" required>
  <span id="error-msg" style="color: red; display: none;">Invalid email</span>
  
  <div style="margin-top: 16px;">
    <app-button id="submit-btn" type="submit" disabled>Submit</app-button>
  </div>
</form>

<script type="module">
  const form = document.getElementById('validated-form');
  const input = document.getElementById('email-input');
  const submitBtn = document.getElementById('submit-btn');
  const errorMsg = document.getElementById('error-msg');
  
  // Enable button only when input is valid
  input.addEventListener('input', () => {
    const isValid = input.validity.valid && input.value.length > 0;
    
    if (isValid) {
      submitBtn.removeAttribute('disabled');
      errorMsg.style.display = 'none';
    } else {
      submitBtn.setAttribute('disabled', '');
      if (input.value.length > 0) {
        errorMsg.style.display = 'block';
      }
    }
  });
  
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitBtn.setAttribute('loading', '');
    
    // Process form...
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    submitBtn.removeAttribute('loading');
    alert('Form submitted!');
  });
</script>
```

---

## Async Operations

### API Call with Loading State

```javascript
async function saveData(data) {
  const saveBtn = document.getElementById('save-btn');
  
  // Show loading
  saveBtn.setAttribute('loading', '');
  saveBtn.textContent = 'Saving...';
  
  try {
    const response = await fetch('/api/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) throw new Error('Save failed');
    
    // Success state
    saveBtn.setAttribute('variant', 'primary');
    saveBtn.textContent = 'Saved!';
    
    // Reset after 2 seconds
    setTimeout(() => {
      saveBtn.textContent = 'Save';
    }, 2000);
    
  } catch (error) {
    // Error state
    saveBtn.setAttribute('variant', 'danger');
    saveBtn.textContent = 'Save Failed';
    
    setTimeout(() => {
      saveBtn.setAttribute('variant', 'primary');
      saveBtn.textContent = 'Save';
    }, 2000);
    
  } finally {
    saveBtn.removeAttribute('loading');
  }
}
```

### Debounced Action

```html
<app-button id="search-btn">Search</app-button>

<script type="module">
  let debounceTimer;
  const searchBtn = document.getElementById('search-btn');
  
  searchBtn.addEventListener('button-click', () => {
    // Clear previous timer
    clearTimeout(debounceTimer);
    
    // Set loading state
    searchBtn.setAttribute('loading', '');
    
    // Debounce the actual search
    debounceTimer = setTimeout(async () => {
      try {
        await performSearch();
      } finally {
        searchBtn.removeAttribute('loading');
      }
    }, 500);
  });
  
  async function performSearch() {
    // Search logic here
    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('Search completed');
  }
</script>
```

### Retry Pattern

```html
<app-button id="retry-btn" variant="danger">Retry</app-button>

<script type="module">
  const retryBtn = document.getElementById('retry-btn');
  let retryCount = 0;
  const maxRetries = 3;
  
  retryBtn.addEventListener('button-click', async () => {
    retryBtn.setAttribute('loading', '');
    
    try {
      await attemptOperation();
      
      // Success
      retryBtn.setAttribute('variant', 'primary');
      retryBtn.textContent = 'Success!';
      retryCount = 0;
      
    } catch (error) {
      retryCount++;
      
      if (retryCount >= maxRetries) {
        retryBtn.setAttribute('disabled', '');
        retryBtn.textContent = 'Failed - Max Retries Reached';
      } else {
        retryBtn.textContent = `Retry (${retryCount}/${maxRetries})`;
      }
    } finally {
      retryBtn.removeAttribute('loading');
    }
  });
  
  async function attemptOperation() {
    // Simulated operation that might fail
    const success = Math.random() > 0.5;
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (!success) {
      throw new Error('Operation failed');
    }
  }
</script>
```

---

## State Management

### Toggle Button

```html
<app-button id="toggle-btn">Enable Feature</app-button>

<script type="module">
  const toggleBtn = document.getElementById('toggle-btn');
  let isEnabled = false;
  
  toggleBtn.addEventListener('button-click', () => {
    isEnabled = !isEnabled;
    
    if (isEnabled) {
      toggleBtn.setAttribute('variant', 'primary');
      toggleBtn.textContent = 'Disable Feature';
    } else {
      toggleBtn.setAttribute('variant', 'secondary');
      toggleBtn.textContent = 'Enable Feature';
    }
  });
</script>
```

### Multi-Step Process

```html
<div id="wizard">
  <div id="step-1" class="step">
    <h3>Step 1: Personal Info</h3>
    <app-button id="next-1">Next</app-button>
  </div>
  
  <div id="step-2" class="step" style="display: none;">
    <h3>Step 2: Address</h3>
    <app-button id="back-2" variant="secondary">Back</app-button>
    <app-button id="next-2">Next</app-button>
  </div>
  
  <div id="step-3" class="step" style="display: none;">
    <h3>Step 3: Review</h3>
    <app-button id="back-3" variant="secondary">Back</app-button>
    <app-button id="submit-3" variant="primary">Submit</app-button>
  </div>
</div>

<script type="module">
  let currentStep = 1;
  
  function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.step').forEach(el => {
      el.style.display = 'none';
    });
    
    // Show current step
    document.getElementById(`step-${step}`).style.display = 'block';
    currentStep = step;
  }
  
  // Next buttons
  document.getElementById('next-1').addEventListener('button-click', () => {
    showStep(2);
  });
  
  document.getElementById('next-2').addEventListener('button-click', () => {
    showStep(3);
  });
  
  // Back buttons
  document.getElementById('back-2').addEventListener('button-click', () => {
    showStep(1);
  });
  
  document.getElementById('back-3').addEventListener('button-click', () => {
    showStep(2);
  });
  
  // Submit
  document.getElementById('submit-3').addEventListener('button-click', async () => {
    const btn = document.getElementById('submit-3');
    btn.setAttribute('loading', '');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    alert('Form submitted!');
    showStep(1);
    btn.removeAttribute('loading');
  });
</script>
```

---

## Custom Styling

### Themed Buttons

```html
<style>
  /* Dark theme */
  .dark-theme {
    --button-primary-bg: #1e40af;
    --button-primary-hover: #1e3a8a;
    --button-primary-text: #e0e7ff;
  }
  
  /* Success theme */
  .success-theme {
    --button-primary-bg: #10b981;
    --button-primary-hover: #059669;
    --button-border-radius: 20px;
  }
  
  /* Large button */
  .btn-large {
    --button-padding: 16px 32px;
    --button-font-size: 18px;
  }
  
  /* Small button */
  .btn-small {
    --button-padding: 6px 12px;
    --button-font-size: 12px;
    --button-border-radius: 4px;
  }
</style>

<app-button class="dark-theme">Dark Button</app-button>
<app-button class="success-theme">Success Button</app-button>
<app-button class="btn-large">Large Button</app-button>
<app-button class="btn-small">Small Button</app-button>
```

### Gradient Button

```html
<style>
  .gradient-btn {
    --button-primary-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    --button-primary-hover: linear-gradient(135deg, #5568d3 0%, #63428a 100%);
    --button-font-weight: 700;
    --button-border-radius: 25px;
  }
</style>

<app-button class="gradient-btn">Gradient Button</app-button>
```

### Outline Button (using CSS Parts)

```html
<style>
  .outline-btn::part(button) {
    background: transparent;
    border: 2px solid var(--button-primary-bg);
    color: var(--button-primary-bg);
  }
  
  .outline-btn::part(button):hover {
    background: var(--button-primary-bg);
    color: white;
  }
</style>

<app-button class="outline-btn">Outline Button</app-button>
```

---

## Framework Integration

### React

```jsx
import { useRef, useEffect } from 'react';
import '@components/app-button';

function MyComponent() {
  const buttonRef = useRef(null);
  
  useEffect(() => {
    const handleClick = (event) => {
      console.log('Button clicked:', event.detail);
    };
    
    const btn = buttonRef.current;
    btn?.addEventListener('button-click', handleClick);
    
    return () => {
      btn?.removeEventListener('button-click', handleClick);
    };
  }, []);
  
  return (
    <app-button 
      ref={buttonRef}
      variant="primary"
    >
      Click Me
    </app-button>
  );
}
```

### Vue 3

```vue
<template>
  <app-button
    :variant="variant"
    :loading="isLoading"
    @button-click="handleClick"
  >
    {{ buttonText }}
  </app-button>
</template>

<script setup>
import { ref } from 'vue';
import '@components/app-button';

const variant = ref('primary');
const isLoading = ref(false);
const buttonText = ref('Click Me');

const handleClick = (event) => {
  console.log('Button clicked:', event.detail);
  
  isLoading.value = true;
  
  setTimeout(() => {
    isLoading.value = false;
  }, 2000);
};
</script>
```

### Angular

```typescript
// app.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import '@components/app-button';

@Component({
  selector: 'app-root',
  template: `
    <app-button 
      #myButton
      [attr.variant]="variant"
      [attr.loading]="isLoading ? '' : null"
      (button-click)="handleClick($event)"
    >
      {{ buttonText }}
    </app-button>
  `
})
export class AppComponent implements OnInit {
  @ViewChild('myButton') button!: ElementRef;
  
  variant = 'primary';
  isLoading = false;
  buttonText = 'Click Me';
  
  ngOnInit() {
    // Component is ready
  }
  
  handleClick(event: CustomEvent) {
    console.log('Button clicked:', event.detail);
    
    this.isLoading = true;
    
    setTimeout(() => {
      this.isLoading = false;
    }, 2000);
  }
}
```

---

## Real-World Scenarios

### Delete Confirmation

```html
<app-button id="delete-btn" variant="danger">Delete Item</app-button>

<script type="module">
  const deleteBtn = document.getElementById('delete-btn');
  let confirmationState = 'initial'; // initial, confirming
  
  deleteBtn.addEventListener('button-click', async () => {
    if (confirmationState === 'initial') {
      // First click: ask for confirmation
      deleteBtn.textContent = 'Click again to confirm';
      deleteBtn.setAttribute('variant', 'danger');
      confirmationState = 'confirming';
      
      // Reset after 3 seconds
      setTimeout(() => {
        deleteBtn.textContent = 'Delete Item';
        confirmationState = 'initial';
      }, 3000);
      
    } else if (confirmationState === 'confirming') {
      // Second click: actually delete
      deleteBtn.setAttribute('loading', '');
      
      try {
        await deleteItem();
        alert('Item deleted!');
      } catch (error) {
        alert('Failed to delete item');
      } finally {
        deleteBtn.removeAttribute('loading');
        deleteBtn.textContent = 'Delete Item';
        confirmationState = 'initial';
      }
    }
  });
  
  async function deleteItem() {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
</script>
```

### File Upload

```html
<input type="file" id="file-input" style="display: none;">
<app-button id="upload-btn" variant="secondary">Choose File</app-button>
<app-button id="submit-btn" disabled>Upload</app-button>

<script type="module">
  const fileInput = document.getElementById('file-input');
  const uploadBtn = document.getElementById('upload-btn');
  const submitBtn = document.getElementById('submit-btn');
  let selectedFile = null;
  
  uploadBtn.addEventListener('button-click', () => {
    fileInput.click();
  });
  
  fileInput.addEventListener('change', (e) => {
    selectedFile = e.target.files[0];
    if (selectedFile) {
      uploadBtn.textContent = `Selected: ${selectedFile.name}`;
      submitBtn.removeAttribute('disabled');
    }
  });
  
  submitBtn.addEventListener('button-click', async () => {
    if (!selectedFile) return;
    
    submitBtn.setAttribute('loading', '');
    submitBtn.textContent = 'Uploading...';
    
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      alert('File uploaded successfully!');
      uploadBtn.textContent = 'Choose File';
      selectedFile = null;
      
    } catch (error) {
      alert('Upload failed');
    } finally {
      submitBtn.removeAttribute('loading');
      submitBtn.textContent = 'Upload';
      submitBtn.setAttribute('disabled', '');
    }
  });
</script>
```

### Countdown Timer

```html
<app-button id="countdown-btn" disabled>Wait 5s</app-button>

<script type="module">
  const btn = document.getElementById('countdown-btn');
  let countdown = 5;
  
  const timer = setInterval(() => {
    countdown--;
    btn.textContent = `Wait ${countdown}s`;
    
    if (countdown <= 0) {
      clearInterval(timer);
      btn.removeAttribute('disabled');
      btn.textContent = 'Ready!';
      btn.setAttribute('variant', 'primary');
    }
  }, 1000);
</script>
```

### Infinite Scroll Load More

```html
<div id="items-container">
  <!-- Items loaded here -->
</div>

<app-button id="load-more" variant="secondary">Load More</app-button>

<script type="module">
  const container = document.getElementById('items-container');
  const loadMoreBtn = document.getElementById('load-more');
  let page = 1;
  
  loadMoreBtn.addEventListener('button-click', async () => {
    loadMoreBtn.setAttribute('loading', '');
    
    try {
      const items = await fetchItems(page);
      
      items.forEach(item => {
        const div = document.createElement('div');
        div.textContent = item.name;
        container.appendChild(div);
      });
      
      page++;
      
      if (items.length === 0) {
        loadMoreBtn.setAttribute('disabled', '');
        loadMoreBtn.textContent = 'No More Items';
      }
      
    } catch (error) {
      loadMoreBtn.setAttribute('variant', 'danger');
      loadMoreBtn.textContent = 'Load Failed - Try Again';
      
      setTimeout(() => {
        loadMoreBtn.setAttribute('variant', 'secondary');
        loadMoreBtn.textContent = 'Load More';
      }, 2000);
      
    } finally {
      loadMoreBtn.removeAttribute('loading');
    }
  });
  
  async function fetchItems(page) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return page < 5 ? [
      { name: `Item ${page * 10 + 1}` },
      { name: `Item ${page * 10 + 2}` },
      { name: `Item ${page * 10 + 3}` }
    ] : [];
  }
</script>
```

---

## Tips & Best Practices

1. **Always handle errors** - Use try/catch blocks with loading states
2. **Provide feedback** - Change button text/variant to show success/error
3. **Disable during async** - Use `loading` attribute to prevent double-clicks
4. **Reset state** - Return button to original state after operations
5. **Accessibility** - Add `aria-label` for icon-only buttons
6. **Progressive enhancement** - Ensure forms work without JavaScript
7. **Debounce expensive operations** - Prevent rapid repeated clicks
8. **Clear loading states** - Always remove `loading` in `finally` blocks
