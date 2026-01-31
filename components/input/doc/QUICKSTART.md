# Quick Start Guide - App Input Component

## 🚀 Get Started in 60 Seconds

### Step 1: Copy the Component

Copy the entire `app-input` folder into your project:

```
your-project/
└── components/
    └── app-input/
        ├── app-input.ts
        ├── index.ts
        ├── README.md
        └── ...
```

### Step 2: Install Dependencies

```bash
cd components/app-input
npm install
```

### Step 3: Build the Component

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` folder.

### Step 4: Import and Use

```html
<!DOCTYPE html>
<html>
<head>
  <title>My App</title>
</head>
<body>
  <!-- Use the component -->
  <app-input 
    label="Email" 
    type="email"
    placeholder="you@example.com"
    required
  >
    <span slot="">Enter a valid email address</span>
  </app-input>
  
  <!-- Import as ES Module -->
  <script type="module">
    import './components/app-input/dist/index.js';
    
    const input = document.querySelector('app-input');
    
    input.addEventListener('input', (e) => {
      console.log('Value:', e.detail.value);
    });
  </script>
</body>
</html>
```

## 📦 What's Included

```
app-input/
├── app-input.ts          # Main component logic
├── index.ts              # Entry point
├── package.json          # NPM config
├── tsconfig.json         # TypeScript config
├── README.md             # Full documentation
├── EXAMPLES.md           # Advanced usage
├── demo.html             # Live demo
└── .gitignore
```

## 🎯 Common Use Cases

### Basic Input
```html
<app-input 
  label="Name" 
  placeholder="Enter your name"
></app-input>
```

### Email with Validation
```html
<app-input 
  label="Email" 
  type="email"
  required
>
  <span slot="">We'll never share your email</span>
</app-input>
```

### Password with Toggle
```html
<app-input 
  label="Password" 
  type="password"
  id="pwd"
  required
>
  <button slot="suffix" onclick="togglePassword()">👁️</button>
</app-input>
```

### Search with Icon
```html
<app-input 
  type="search"
  placeholder="Search..."
>
  <svg slot="prefix" width="16" height="16">
    <!-- search icon -->
  </svg>
</app-input>
```

### With Prefix/Suffix
```html
<app-input 
  label="Website" 
  placeholder="example.com"
>
  <span slot="prefix">https://</span>
  <span slot="suffix">.com</span>
</app-input>
```

## 🎨 Customization

Override CSS variables to customize appearance:

```css
app-input {
  --input-border-color-focus: #10b981;
  --input-border-radius: 8px;
  --input-padding: 12px 16px;
  --input-font-size: 16px;
}
```

## 📖 Full Documentation

- **README.md** - Complete API reference
- **EXAMPLES.md** - Real-world usage patterns
- **demo.html** - Interactive examples

## 🔧 Development Commands

```bash
# Build the component
npm run build

# Watch mode (auto-rebuild)
npm run watch

# Type check
npm run lint

# Start dev server
npm run dev
```

## 🌐 Browser Support

✅ Chrome/Edge 77+  
✅ Firefox 93+  
✅ Safari 16.4+  
✅ Opera 64+  

## ⚡ Pro Tips

1. **Always provide labels** for accessibility
2. **Use helper text** to guide users
3. **Validate on blur** not on every keystroke
4. **Use prefix/suffix** for icons and units
5. **Set error attribute** to show error state
6. **Use name attribute** for form submission

## 🎉 You're Ready!

Open `demo.html` in a browser to see the component in action!

### Need Help?

- Check **README.md** for API docs
- See **EXAMPLES.md** for patterns
- Look at **demo.html** for live examples
