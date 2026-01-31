# Quick Start Guide - App Button Component

## 🚀 Get Started in 60 Seconds

### Step 1: Copy the Component

Copy the entire `app-button` folder into your project's components directory.

```
your-project/
└── components/
    └── app-button/
        ├── app-button.ts
        ├── index.ts
        ├── README.md
        └── ...
```

### Step 2: Install TypeScript (if needed)

```bash
cd components/app-button
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
  <app-button variant="primary">Click Me!</app-button>
  
  <!-- Import as ES Module -->
  <script type="module">
    import './components/app-button/dist/index.js';
    
    const btn = document.querySelector('app-button');
    btn.addEventListener('button-click', () => {
      alert('Hello World!');
    });
  </script>
</body>
</html>
```

## 📦 What's Included

```
app-button/
├── app-button.ts          # Main component logic
├── index.ts               # Entry point
├── package.json           # NPM config
├── tsconfig.json          # TypeScript config
├── README.md              # Full documentation
├── EXAMPLES.md            # Advanced usage examples
├── TESTING.md             # Testing guide
├── CHANGELOG.md           # Version history
├── demo.html              # Live demo page
└── .gitignore
```

## 🎯 Common Use Cases

### Basic Button
```html
<app-button>Click Me</app-button>
```

### With Variants
```html
<app-button variant="primary">Save</app-button>
<app-button variant="secondary">Cancel</app-button>
<app-button variant="danger">Delete</app-button>
```

### With Loading State
```html
<app-button id="save-btn">Save</app-button>

<script type="module">
  const btn = document.getElementById('save-btn');
  
  btn.addEventListener('button-click', async () => {
    btn.setAttribute('loading', '');
    
    await saveData(); // Your async function
    
    btn.removeAttribute('loading');
  });
</script>
```

### Disabled State
```html
<app-button disabled>Can't Click</app-button>
```

### In a Form
```html
<form>
  <input type="text" required>
  <app-button type="submit">Submit</app-button>
</form>
```

## 🎨 Customization

Override CSS variables to customize appearance:

```css
app-button {
  --button-primary-bg: #10b981;
  --button-border-radius: 12px;
  --button-padding: 12px 24px;
}
```

## 📖 Full Documentation

- **README.md** - Complete API reference
- **EXAMPLES.md** - Real-world usage patterns
- **TESTING.md** - How to test the component
- **demo.html** - Interactive examples

## 🔧 Development Commands

```bash
# Build the component
npm run build

# Watch mode (auto-rebuild on changes)
npm run watch

# Type check
npm run lint

# Start dev server with demo
npm run dev
```

## 🌐 Browser Support

✅ Chrome/Edge 67+  
✅ Firefox 63+  
✅ Safari 13.1+  
✅ Opera 54+  

## 🤝 Need Help?

1. Check **README.md** for API documentation
2. See **EXAMPLES.md** for usage patterns
3. Look at **demo.html** for live examples
4. Review **TESTING.md** for testing strategies

## ⚡ Pro Tips

1. **Always use loading state** for async operations
2. **Add aria-label** for icon-only buttons
3. **Use CSS variables** for consistent theming
4. **Listen to button-click** not native click event
5. **Disable during processing** to prevent double-clicks

## 🎉 You're Ready!

Open `demo.html` in a browser to see the component in action, or jump straight into using it in your project!
