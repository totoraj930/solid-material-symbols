# Solid Material Symbols

<a href="https://www.npmjs.com/package/solid-material-symbols?activeTab=versions">
  <img src="https://badgen.net/npm/v/solid-material-symbols">
</a>
<a href="https://github.com/totoraj930/solid-material-symbols/blob/main/LICENSE">
  <img src="https://badgen.net/npm/license/solid-material-symbols">
</a>

Using Google Material Symbols as Solid.js components.

## 🚧 Incomplete

This package is currently under adjustment.

## 📦 Installation

```bash
npm install solid-material-symbols
```

## 🎨 Usage

```tsx
import { MsSettingsSuggestFill } from "solid-material-symbols/outlined/400";

<MsSettingsSuggestFill size={40} class="mx-auto" color="#0099ff" />

```

You can search for icon names on the icons page of Google Fonts.

- https://fonts.google.com/icons

## ⚙️ Configuration

The import path is:

- type: `outlined`, `rounded`, `sharp`
- weight: `200`, `400`, `600`

```typescript
import {...} from "solid-material-symbols/{type}/{weight}"
```

---

Components is accepts `SVGElement` props and additional options.

See types below.

```typescript
type IconProps = {
  color?: string; // default: "currentColor"
  size?: string | number; // default: "1em"
  title?: string; // default: undefined
} & JSX.SvgSVGAttributes<SVGSVGElement>
```



## 💙 Acknowledgments

This package was made with reference to ["solid-icons"](https://github.com/x64Bits/solid-icons).

thank you.

## 📜 License

Source code: MIT

- Please use icons according to the license(Apach License 2.0) of ["google/material-design-icons"](https://github.com/google/material-design-icons) & ["marella/material-symbols"](https://github.com/marella/material-symbols).