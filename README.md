# pip-it-up

The ultimate toolkit for the **Document Picture-in-Picture API**.

Pop any UI component — editors, dashboards, video players, chat widgets — into a floating **Picture-in-Picture** window with zero config. Auto-sizing. Full style sync. Framework-agnostic core with official React bindings.

## 🆕 New in 0.2.0

- **Route-Persistent PiP** — `<PipProvider>` hosts content above your router and `<PipAnchor>` docks it into whichever route is on screen. The floating window survives navigation.
- **Zero Remounts** — `<PipWrapper>` no longer rebuilds its subtree when the window opens or closes. Video playheads, canvas bitmaps, WebGL contexts, WebRTC streams and component state all keep running. The node is *moved*, not recreated.
- **Automatic PiP** — `useAutoPip` / `createAutoPip` pop out the moment the tab is hidden, and report whether a user gesture or the browser authorised the attempt.
- **Dormancy Hooks** — `useDormancy`, `useActiveEffect`, `useRevealEffect` and `useAdaptiveInterval` throttle work in hosted subtrees while they are backgrounded or parked. Zero timers when frozen.
- **Zero Layout Shift** — Anchors reserve the exact box the content left behind in the first painted frame, so nothing jumps on the way out or back.
- **Synchronous Teardown** — `registerTeardown` runs before the PiP document dies, for DOM repatriation that cannot wait for an async callback.

> Upgrading from 0.1.x? Two behaviour changes are worth reading first — see [Upgrading to 0.2.0](https://pip-it-up.vercel.app/docs#upgrading).

## ✨ Features

- **Magic Auto-Sizing** — Automatically detects and matches your component's dimensions via `ResizeObserver`. No manual width/height needed.
- **Persistent State** — Physically moves your DOM element into the PiP window, preserving internal state, event listeners, and cursor position.
- **Dynamic Style Sync** — Mirrors all CSS rules (Tailwind, CSS-in-JS, etc.) and syncs changes in real-time using `MutationObserver`.
- **Responsive Placeholders** — Leaves a stable placeholder in the main window to prevent layout jumps.
- **Smart Fallbacks** — Gracefully degrades to a popup or custom fallback UI when the API isn't supported.
- **Keyboard Forwarding** — `Cmd+S`, `Cmd+K` and your other shortcuts keep working while focus is inside the floating window.
- **SSR-Safe** — Works in Next.js, Remix and Vite with no hydration mismatches.
- **Zero Runtime Dependencies** — `@pip-it-up/core` ships none; `@pip-it-up/react` depends only on core, with React as a peer.
- **TypeScript-First** — Full type safety across every package.

## 📦 Packages

| Package | Description |
| :------ | :---------- |
| [`@pip-it-up/core`](https://www.npmjs.com/package/@pip-it-up/core) | Framework-agnostic JavaScript library |
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

### Surviving route changes

Host the content above your router and let each route dock it. The DOM node is moved
between anchors, so nothing unmounts and nothing reloads:

```tsx
import { PipProvider, PipAnchor } from '@pip-it-up/react';

function App() {
  return (
    <PipProvider registry={{ player: <VideoPlayer /> }}>
      <Routes />
    </PipProvider>
  );
}

// in any route
function Dashboard() {
  return <PipAnchor id="player" className="w-full aspect-video" />;
}
```

### Popping out automatically

```tsx
import { useVideoPip, useAutoPip } from '@pip-it-up/react';

const { enter } = useVideoPip(videoRef);
useAutoPip(enter, { when: () => !videoRef.current?.paused });
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
- **Library source**: [github.com/Shakya47/pip-it-up](https://github.com/Shakya47/pip-it-up)
- **npm**: [@pip-it-up/react](https://www.npmjs.com/package/@pip-it-up/react) · [@pip-it-up/core](https://www.npmjs.com/package/@pip-it-up/core)

## 🛠 About this repository

This repo holds the **marketing site and documentation** for pip-it-up — the library
itself lives in [Shakya47/pip-it-up](https://github.com/Shakya47/pip-it-up).

Built with Astro, React islands and Tailwind. The site ships in light and dark, with a
hand-drawn "zine" theme in both: dark ink on cream paper, or chalk on dark card stock. It
follows your system preference until you pick a side with the toggle in the navbar.

```bash
pnpm install
pnpm dev      # http://localhost:4321
pnpm build
```

The live demos on the landing page use the published packages, so they exercise the same
code a consumer installs.

## 📄 License

MIT
