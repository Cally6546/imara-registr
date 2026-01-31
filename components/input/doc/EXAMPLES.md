# Advanced Usage Examples

Real-world patterns and advanced implementations for the App Input component.

## Table of Contents

1. [Form Validation Patterns](#form-validation-patterns)
2. [Real-time Validation](#real-time-validation)
3. [Custom Validators](#custom-validators)
4. [Integration Patterns](#integration-patterns)
5. [Accessibility Enhancements](#accessibility-enhancements)
6. [Framework Integration](#framework-integration)

---

## Form Validation Patterns

### Complete Registration Form

```html
<form id="registration-form">
  <app-input 
    name="username"
    label="Username" 
    placeholder="johndoe"
    required
    id="username-input"
  >
    <span slot="" id="username-help">3-20 characters, letters and numbers only</span>
  </app-input>

  <app-input 
    name="email"
    label="Email Address" 
    type="email"
    placeholder="john@example.com"
    required
    id="email-input"
  >
    <span slot="" id="email-help"></span>
  </app-input>

  <app-input 
    name="password"
    label="Password" 
    type="password"
    required
    id="password-input"
  >
    <span slot="" id="password-help">At least 8 characters</span>
  </app-input>

  <app-input 
    name="confirm-password"
    label="Confirm Password" 
    type="password"
    required
    id="confirm-password-input"
  >
    <span slot="" id="confirm-help"></span>
  </app-input>

  <button type="submit">Create Account</button>
</form>

<script type="module">
  const form = document.getElementById('registration-form');
  const inputs = {
    username: document.getElementById('username-input'),
    email: document.getElementById('email-input'),
    password: document.getElementById('password-input'),
    confirmPassword: document.getElementById('confirm-password-input')
  };

  const helpers = {
    username: document.getElementById('username-help'),
    email: document.getElementById('email-help'),
    password: document.getElementById('password-help'),
    confirm: document.getElementById('confirm-help')
  };

  // Username validation
  inputs.username.addEventListener('input', (e) => {
    const value = e.detail.value;
    const regex = /^[a-zA-Z0-9]{3,20}$/;
    
    if (!value) {
      inputs.username.removeAttribute('error');
      helpers.username.textContent = '3-20 characters, letters and numbers only';
    } else if (!regex.test(value)) {
      inputs.username.setAttribute('error', '');
      helpers.username.textContent = '❌ Invalid username format';
    } else {
      inputs.username.removeAttribute('error');
      helpers.username.textContent = '✅ Valid username';
    }
  });

  // Email validation
  inputs.email.addEventListener('blur', async (e) => {
    const value = e.detail.value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(value)) {
      inputs.email.setAttribute('error', '');
      helpers.email.textContent = '❌ Invalid email format';
      return;
    }

    // Check if email is already taken (API call)
    const isTaken = await checkEmailAvailability(value);
    if (isTaken) {
      inputs.email.setAttribute('error', '');
      helpers.email.textContent = '❌ This email is already registered';
    } else {
      inputs.email.removeAttribute('error');
      helpers.email.textContent = '✅ Email is available';
    }
  });

  // Password strength
  inputs.password.addEventListener('input', (e) => {
    const pwd = e.detail.value;
    const strength = calculatePasswordStrength(pwd);
    
    if (pwd.length < 8) {
      inputs.password.setAttribute('error', '');
      helpers.password.textContent = '❌ Password must be at least 8 characters';
    } else {
      inputs.password.removeAttribute('error');
      helpers.password.textContent = `Strength: ${strength}`;
    }
  });

  // Confirm password match
  inputs.confirmPassword.addEventListener('input', (e) => {
    const password = inputs.password.value;
    const confirm = e.detail.value;
    
    if (confirm && confirm !== password) {
      inputs.confirmPassword.setAttribute('error', '');
      helpers.confirm.textContent = '❌ Passwords do not match';
    } else if (confirm) {
      inputs.confirmPassword.removeAttribute('error');
      helpers.confirm.textContent = '✅ Passwords match';
    } else {
      inputs.confirmPassword.removeAttribute('error');
      helpers.confirm.textContent = '';
    }
  });

  // Form submission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Validate all fields
    const isValid = Object.values(inputs).every(input => {
      return input.checkValidity() && !input.hasAttribute('error');
    });

    if (!isValid) {
      alert('Please fix all errors before submitting');
      return;
    }

    const formData = new FormData(form);
    try {
      await submitRegistration(formData);
      alert('Registration successful!');
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  });

  // Helper functions
  async function checkEmailAvailability(email) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    return email === 'taken@example.com';
  }

  function calculatePasswordStrength(pwd) {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^a-zA-Z0-9]/.test(pwd)) score++;
    
    const levels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return levels[score] || 'Very Weak';
  }

  async function submitRegistration(formData) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
</script>
```

---

## Real-time Validation

### Debounced API Validation

```html
<app-input 
  id="username-check"
  label="Username" 
  placeholder="Choose a username"
>
  <span slot="" id="availability"></span>
</app-input>

<script type="module">
  const input = document.getElementById('username-check');
  const availability = document.getElementById('availability');
  let debounceTimer;

  input.addEventListener('input', (e) => {
    const username = e.detail.value;
    
    // Clear previous timer
    clearTimeout(debounceTimer);
    
    // Don't check empty values
    if (!username) {
      availability.textContent = '';
      input.removeAttribute('error');
      return;
    }

    // Show checking status
    availability.textContent = '⏳ Checking availability...';
    availability.style.color = '#6b7280';
    
    // Debounce API call
    debounceTimer = setTimeout(async () => {
      try {
        const isAvailable = await checkUsernameAvailability(username);
        
        if (isAvailable) {
          input.removeAttribute('error');
          availability.textContent = '✅ Username is available';
          availability.style.color = '#10b981';
        } else {
          input.setAttribute('error', '');
          availability.textContent = '❌ Username is already taken';
          availability.style.color = '#dc2626';
        }
      } catch (error) {
        availability.textContent = '⚠️ Could not check availability';
        availability.style.color = '#f59e0b';
      }
    }, 500);
  });

  async function checkUsernameAvailability(username) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    return !['admin', 'root', 'user'].includes(username.toLowerCase());
  }
</script>
```

---

## Custom Validators

### Credit Card Number Validation

```html
<app-input 
  id="credit-card"
  label="Credit Card Number" 
  type="text"
  placeholder="1234 5678 9012 3456"
>
  <span slot="prefix">💳</span>
  <span slot="" id="card-type"></span>
</app-input>

<script type="module">
  const cardInput = document.getElementById('credit-card');
  const cardType = document.getElementById('card-type');

  cardInput.addEventListener('input', (e) => {
    let value = e.detail.value.replace(/\s/g, '');
    
    // Format with spaces every 4 digits
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    if (formatted !== e.detail.value) {
      cardInput.value = formatted;
    }

    // Detect card type
    const type = detectCardType(value);
    
    // Validate using Luhn algorithm
    const isValid = value.length >= 13 && luhnCheck(value);
    
    if (value.length === 0) {
      cardInput.removeAttribute('error');
      cardType.textContent = '';
    } else if (isValid) {
      cardInput.removeAttribute('error');
      cardType.textContent = `✅ Valid ${type} card`;
    } else if (value.length >= 13) {
      cardInput.setAttribute('error', '');
      cardType.textContent = '❌ Invalid card number';
    } else {
      cardInput.removeAttribute('error');
      cardType.textContent = `${type} (${value.length}/16)`;
    }
  });

  function detectCardType(number) {
    if (number.startsWith('4')) return 'Visa';
    if (number.startsWith('5')) return 'Mastercard';
    if (number.startsWith('3')) return 'Amex';
    return 'Unknown';
  }

  function luhnCheck(cardNumber) {
    let sum = 0;
    let isEven = false;
    
    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);
      
      if (isEven) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      
      sum += digit;
      isEven = !isEven;
    }
    
    return sum % 10 === 0;
  }
</script>
```

---

## Integration Patterns

### Search with Autocomplete

```html
<div style="position: relative;">
  <app-input 
    id="search-autocomplete"
    label="Search" 
    type="search"
    placeholder="Type to search..."
  >
    <svg slot="prefix" width="16" height="16" fill="currentColor">
      <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z"/>
    </svg>
  </app-input>

  <div id="autocomplete-results" style="
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    margin-top: 4px;
    max-height: 200px;
    overflow-y: auto;
    display: none;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  "></div>
</div>

<script type="module">
  const searchInput = document.getElementById('search-autocomplete');
  const resultsDiv = document.getElementById('autocomplete-results');
  let debounceTimer;

  searchInput.addEventListener('input', (e) => {
    const query = e.detail.value;
    
    clearTimeout(debounceTimer);
    
    if (!query) {
      resultsDiv.style.display = 'none';
      return;
    }

    debounceTimer = setTimeout(async () => {
      const results = await searchItems(query);
      displayResults(results);
    }, 300);
  });

  searchInput.addEventListener('blur', () => {
    // Delay to allow clicking on results
    setTimeout(() => {
      resultsDiv.style.display = 'none';
    }, 200);
  });

  async function searchItems(query) {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 200));
    const items = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++',
      'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin'
    ];
    return items.filter(item => 
      item.toLowerCase().includes(query.toLowerCase())
    );
  }

  function displayResults(results) {
    if (results.length === 0) {
      resultsDiv.innerHTML = '<div style="padding: 12px; color: #6b7280;">No results found</div>';
      resultsDiv.style.display = 'block';
      return;
    }

    resultsDiv.innerHTML = results.map(item => `
      <div 
        onclick="selectResult('${item}')"
        style="
          padding: 12px;
          cursor: pointer;
          border-bottom: 1px solid #f3f4f6;
        "
        onmouseover="this.style.background='#f9fafb'"
        onmouseout="this.style.background='white'"
      >
        ${item}
      </div>
    `).join('');
    
    resultsDiv.style.display = 'block';
  }

  window.selectResult = function(value) {
    searchInput.value = value;
    resultsDiv.style.display = 'none';
  };
</script>
```

---

## Accessibility Enhancements

### Screen Reader Announcements

```html
<app-input 
  id="accessible-input"
  label="Email Address" 
  type="email"
  placeholder="you@example.com"
  required
>
  <span slot="" id="email-announce" role="status" aria-live="polite"></span>
</app-input>

<script type="module">
  const input = document.getElementById('accessible-input');
  const announce = document.getElementById('email-announce');

  input.addEventListener('blur', (e) => {
    const email = e.detail.value;
    
    if (!email) {
      announce.textContent = 'Email is required';
      input.setAttribute('error', '');
    } else if (!isValidEmail(email)) {
      announce.textContent = 'Email format is invalid';
      input.setAttribute('error', '');
    } else {
      announce.textContent = 'Email is valid';
      input.removeAttribute('error');
    }
  });

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
</script>
```

---

## Framework Integration

### React

```jsx
import { useRef, useEffect, useState } from 'react';
import '@components/app-input';

function EmailInput() {
  const inputRef = useRef(null);
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const input = inputRef.current;
    
    const handleInput = (e) => {
      setEmail(e.detail.value);
      validateEmail(e.detail.value);
    };

    input?.addEventListener('input', handleInput);
    
    return () => {
      input?.removeEventListener('input', handleInput);
    };
  }, []);

  const validateEmail = (value) => {
    if (!value) {
      setError('');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError('Invalid email format');
    } else {
      setError('');
    }
  };

  return (
    <app-input
      ref={inputRef}
      label="Email"
      type="email"
      placeholder="you@example.com"
      error={error ? '' : null}
    >
      {error && <span slot="">{error}</span>}
    </app-input>
  );
}
```

### Vue 3

```vue
<template>
  <app-input
    ref="inputRef"
    :label="label"
    :type="type"
    :value="modelValue"
    :error="hasError ? '' : null"
    @input="handleInput"
    @blur="handleBlur"
  >
    <span v-if="errorMessage" slot="">{{ errorMessage }}</span>
  </app-input>
</template>

<script setup>
import { ref, computed } from 'vue';
import '@components/app-input';

const props = defineProps({
  modelValue: String,
  label: String,
  type: { type: String, default: 'text' },
  validator: Function
});

const emit = defineEmits(['update:modelValue']);

const inputRef = ref(null);
const errorMessage = ref('');

const hasError = computed(() => !!errorMessage.value);

const handleInput = (event) => {
  const value = event.detail.value;
  emit('update:modelValue', value);
  
  if (props.validator) {
    const error = props.validator(value);
    errorMessage.value = error || '';
  }
};

const handleBlur = (event) => {
  if (props.validator) {
    const error = props.validator(event.detail.value);
    errorMessage.value = error || '';
  }
};
</script>
```

### Angular

```typescript
import { Component, Input, Output, EventEmitter, ViewChild, ElementRef, AfterViewInit } from '@angular/core';
import '@components/app-input';

@Component({
  selector: 'app-email-input',
  template: `
    <app-input
      #inputElement
      [attr.label]="label"
      [attr.type]="type"
      [attr.value]="value"
      [attr.error]="error ? '' : null"
      (input)="onInput($event)"
      (blur)="onBlur($event)"
    >
      <span *ngIf="errorMessage" slot="">{{ errorMessage }}</span>
    </app-input>
  `
})
export class EmailInputComponent implements AfterViewInit {
  @Input() label = 'Email';
  @Input() type = 'email';
  @Input() value = '';
  @Output() valueChange = new EventEmitter<string>();
  
  @ViewChild('inputElement') inputElement!: ElementRef;
  
  error = false;
  errorMessage = '';

  ngAfterViewInit() {
    const input = this.inputElement.nativeElement;
    
    input.addEventListener('input', (e: CustomEvent) => {
      this.value = e.detail.value;
      this.valueChange.emit(this.value);
      this.validate(this.value);
    });
  }

  onInput(event: CustomEvent) {
    this.value = event.detail.value;
    this.valueChange.emit(this.value);
    this.validate(this.value);
  }

  onBlur(event: CustomEvent) {
    this.validate(event.detail.value);
  }

  validate(email: string) {
    if (!email) {
      this.error = false;
      this.errorMessage = '';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      this.error = true;
      this.errorMessage = 'Invalid email format';
    } else {
      this.error = false;
      this.errorMessage = '';
    }
  }
}
```

---

## Best Practices

1. **Always provide labels** - Essential for accessibility
2. **Use helper text** - Guide users on input requirements
3. **Validate on blur** - Don't interrupt typing with errors
4. **Debounce API calls** - Prevent excessive network requests
5. **Clear error states** - Remove errors when input becomes valid
6. **Provide visual feedback** - Use colors and icons appropriately
7. **Test with screen readers** - Ensure announcements work correctly
8. **Handle edge cases** - Empty values, special characters, etc.
