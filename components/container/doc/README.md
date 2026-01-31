# UI Container Web Component

A lightweight, flexible `<ui-container>` Web Component built with TypeScript. Designed to act as a universal layout wrapper for modern web apps without frameworks.

## ✨ Features

* ✅ Native Web Component (no framework)
* ✅ Written in TypeScript
* ✅ Shadow DOM encapsulation
* ✅ Supports multiple layout types (block, flex, grid)
* ✅ Responsive max-width container behavior
* ✅ Attribute-based configuration
* ✅ Safe for browser ES module usage
* ✅ No external dependencies

## 📦 Use Cases

`<ui-container>` is useful for:

* Page wrappers
* Centered content areas
* Layout sections
* Responsive dashboards
* Card group containers
* App shells

It replaces patterns like:

```html
<div class="container">
<div class="wrapper">
<section class="layout">
```

with a semantic, reusable component.

## 🚀 Installation

**1️⃣ Add the compiled file**

Place the compiled JavaScript file in your project:

```
/ui-container.js
```

**2️⃣ Load it in HTML**

```html
<script type="module" src="./ui-container.js"></script>
```

⚠️ **Important:** The script must be loaded as a module.

## 🧩 Basic Usage

```html
<ui-container>
  <p>Hello world</p>
</ui-container>
```

By default:
* Content is centered
* Width is constrained
* Padding is applied

## ⚙️ Supported Attributes

### `layout`

Controls the layout behavior.

| Value | Description |
|-------|-------------|
| `block` (default) | Normal block layout |
| `flex` | Enables flexbox |
| `grid` | Enables CSS Grid |

```html
<ui-container layout="flex">
  <div>Item 1</div>
  <div>Item 2</div>
</ui-container>
```

### `max-width`

Sets the maximum width of the container.

```html
<ui-container max-width="1200px">
  Content
</ui-container>
```

**Default:** `1200px`

### `padding`

Controls inner spacing.

```html
<ui-container padding="2rem">
  Content
</ui-container>
```

**Default:** `1rem`

### `gap` (flex / grid only)

Spacing between children.

```html
<ui-container layout="grid" gap="16px">
  <div>Card</div>
  <div>Card</div>
</ui-container>
```

### `center`

Centers the container horizontally.

```html
<ui-container center>
  Content
</ui-container>
```

## 🎨 Styling Behavior

* Uses Shadow DOM
* Styles are fully encapsulated
* No CSS leakage in or out
* Layout styles are applied internally

To style child elements, style inside the slot content.

## 🧠 Design Philosophy

This component is intentionally:

* **Simple**
* **Predictable**
* **Composable**

It avoids:

* Magic behavior
* Hidden JS logic
* Framework-like abstractions

You control layout via HTML attributes, not JS APIs.

## 🛠️ TypeScript Notes

### Why no `export`?

This component is registered globally using:

```typescript
customElements.define('ui-container', UIContainer);
```

Web Components do not require exports to work in the browser. This avoids CommonJS / ES module conflicts.

## ⚠️ Browser Requirements

* Modern browsers
* ES Modules support
* Custom Elements support

Works in:
* Chrome
* Firefox
* Edge
* Safari (modern versions)

## 📁 Suggested Project Structure

```
/components
  /ui-container
    ui-container.ts
    ui-container.js
    demo.html
```

## 🧪 Demo

Example:

```html
<ui-container layout="grid" gap="1rem" max-width="900px">
  <div class="card">One</div>
  <div class="card">Two</div>
  <div class="card">Three</div>
</ui-container>
```

## 🔒 Safe Usage Checklist

* ✔ Load using `type="module"`
* ✔ Do NOT use CommonJS output
* ✔ Compile with `module: es2020`
* ✔ Define element only once

## 🧭 Future Extensions (Optional)

* `fluid` mode
* Responsive breakpoints
* Named slots
* CSS custom properties
* Container queries

## License

MIT
