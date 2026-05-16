# pip-it-up

The ultimate toolkit for the **Document Picture-in-Picture API**.

Pop any UI component — editors, dashboards, video players, chat widgets — into a floating **Picture-in-Picture** window with zero config. Auto-sizing. Full style sync. Framework-agnostic core with official React bindings.

## ✨ Features

- **Magic Auto-Sizing** — Automatically detects and matches your component's dimensions via `ResizeObserver`. No manual width/height needed.
- **Persistent State** — Physically moves your DOM element into the PiP window, preserving internal state, event listeners, and cursor position.
- **Dynamic Style Sync** — Mirrors all CSS rules (Tailwind, CSS-in-JS, etc.) and syncs changes in real-time using `MutationObserver`.
- **Responsive Placeholders** — Leaves a stable placeholder in the main window to prevent layout jumps.
- **Smart Fallbacks** — Gracefully degrades to a popup or custom fallback UI when the API isn't supported.
- **TypeScript-First** — Full type safety across every package.

## 📦 Packages

| Package | Description |
| :------ | :---------- |
| [`@pip-it-up/core`](https://www.npmjs.com/package/@pip-it-up/core) | Framework-agnostic JavaScript engine |
| [`@pip-it-up/react`](https://www.npmjs.com/package/@pip-it-up/react) | React components, hooks & context |

## 🚀 Quickstart

```bash
npm install @pip-it-up/react @pip-it-up/core
```

```tsx
import { PipWrapper, PipTrigger } from '@pip-it-up/react';

function App() {
  return (
    <PipWrapper>
      <div>
        <h1>My Floating Tool</h1>
        <PipTrigger>
          <button>Open Picture-in-Picture</button>
        </PipTrigger>
      </div>
    </PipWrapper>
  );
}
```

## 🌐 Browser Support

| Browser | Document PiP Support |
| :------ | :------------------- |
| Chrome  | ≥ 116 ✅             |
| Edge    | ≥ 116 ✅             |
| Safari  | Fallback mode        |
| Firefox | Fallback mode        |

## 🔗 Links

- **Website & Demos**: [pip-it-up.vercel.app](https://pip-it-up.vercel.app)
- **GitHub**: [github.com/Shakya47/pip-it-up](https://github.com/Shakya47/pip-it-up)
- **npm**: [@pip-it-up/react](https://www.npmjs.com/package/@pip-it-up/react) · [@pip-it-up/core](https://www.npmjs.com/package/@pip-it-up/core)

## 📄 License

MIT
