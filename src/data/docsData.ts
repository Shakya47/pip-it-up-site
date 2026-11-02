export interface DocSection {
  id: string;
  title: string;
  keywords: string[];
  summary: string;
  content: string; // HTML-safe formatted content
}

export interface DocCategory {
  id: string;
  title: string;
  sections: DocSection[];
}

export const docsData: DocCategory[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    sections: [
      {
        id: 'introduction',
        title: 'Introduction',
        keywords: ['pip', 'document picture-in-picture', 'floating window', 'dom moving', 'features', 'browser support', 'route persistent', 'zero remount', 'auto pip', 'real browser tested', 'e2e'],
        summary: 'Learn about pip-it-up, the ultimate Document Picture-in-Picture toolkit for the web.',
        content: `
          <p>
            <strong>pip-it-up</strong> is a framework-agnostic toolkit for the <strong>Document Picture-in-Picture API</strong>.
            It enables you to pop any arbitrary HTML content — like video players, rich text editors, chat widgets, or canvas elements — into a floating, always-on-top window.
          </p>

          <h3>Core Capabilities</h3>
          <ul>
            <li><strong>Magic Auto-Sizing:</strong> Automatically detects and matches the exact dimensions of your component using <code>ResizeObserver</code>.</li>
            <li><strong>State Preservation:</strong> Physically relocates your live DOM element, preserving internal state (scroll position, text selections, input cursor, audio/video playheads) and event listeners perfectly.</li>
            <li><strong>Dynamic Style Sync:</strong> Automatically mirrors your document's stylesheets (including Tailwind CSS and CSS-in-JS rules) and syncs additions in real-time.</li>
            <li><strong>Graceful Fallbacks:</strong> Degrades smoothly to browser popups, modal views, or classic Video PiP on unsupported browsers (Safari, Firefox, and mobile devices).</li>
            <li><strong>Zero Remounts:</strong> Content is moved, never recreated. Playheads, canvas bitmaps, WebGL contexts and component state survive every transition.</li>
            <li><strong>Route Persistence:</strong> <code>PipProvider</code> and <code>PipAnchor</code> keep a floating window alive across navigation, docking it into whichever route is on screen.</li>
            <li><strong>Real-Browser Tested:</strong> An end-to-end suite runs against Chrome, Firefox, WebKit, real Safari and Next.js SSR, and <code>open()</code> rejects honestly when a browser refuses.</li>
            <li><strong>Automatic PiP:</strong> <code>useAutoPip</code> pops out the moment the tab is hidden, reporting whether a user gesture or the browser authorised it.</li>
          </ul>

          <div class="alert alert-info">
            <strong>What makes Document PiP different?</strong> Unlike the classic HTML5 Video PiP API which only allows floating a raw video stream, the modern Document PiP API opens a lightweight window sharing the same Javascript execution heap. This means React elements continue rendering through portals, and event handlers remain fully interactive!
          </div>
        `
      },
      {
        id: 'quickstart',
        title: 'Quickstart',
        keywords: ['install', 'npm', 'yarn', 'pnpm', 'react quickstart', 'vanilla quickstart', 'elements'],
        summary: 'How to install and run pip-it-up in your project.',
        content: `
          <p>
            Get started by installing the packages for your stack (view on NPM: 
            <a href="https://www.npmjs.com/package/@pip-it-up/core" target="_blank" rel="noopener" class="text-[var(--color-accent-dark)] hover:underline font-mono">@pip-it-up/core</a> and 
            <a href="https://www.npmjs.com/package/@pip-it-up/react" target="_blank" rel="noopener" class="text-[var(--color-accent-dark)] hover:underline font-mono">@pip-it-up/react</a>). 
            We support React and Vanilla JavaScript natively.
          </p>

          <pre class="code-block font-mono text-xs p-4 mb-6"><code>npm install @pip-it-up/react @pip-it-up/core</code></pre>

          <h3>React Usage</h3>
          <p>Wrap your component in <code>&lt;PipWrapper&gt;</code> and add a <code>&lt;PipTrigger&gt;</code> button to launch the floating window:</p>

          <pre class="code-block font-mono text-xs p-4 mb-6"><code>import { PipWrapper, PipTrigger } from '@pip-it-up/react';

function MyWidget() {
  return (
    &lt;PipWrapper copyStyles="sync"&gt;
      &lt;div className="p-6 bg-slate-900 border rounded-xl"&gt;
        &lt;h2&gt;Floating Notepad&lt;/h2&gt;
        &lt;textarea placeholder="Write text..." className="w-full h-32" /&gt;
        
        &lt;PipTrigger&gt;
          &lt;button className="mt-4 px-4 py-2 bg-indigo-600 rounded"&gt;
            Pop out to PiP
          &lt;/button&gt;
        &lt;/PipTrigger&gt;
      &lt;/div&gt;
    &lt;/PipWrapper&gt;
  );
}</code></pre>

          <h3>Vanilla JavaScript Usage</h3>
          <p>Specify the target content element and a placeholder anchor in your origin layout:</p>

          <pre class="code-block font-mono text-xs p-4 mb-6"><code>import { createPip } from '@pip-it-up/core';

const contentEl = document.getElementById('my-content');
const originEl = document.getElementById('my-origin');

const pip = createPip({
  mode: 'move', // 'move', 'clone', or 'portal'
  copyStyles: 'sync',
  fallback: 'new-tab'
});

// Trigger open on click
document.getElementById('btn-open').addEventListener('click', () => {
  pip.open({ contentEl, originEl }).catch((err) => console.warn('PiP failed:', err));
});</code></pre>
        `
      },
      {
        id: 'upgrading-0-3-0',
        title: 'Upgrading to 0.3.0',
        keywords: ['upgrade', 'migration', 'breaking changes', '0.3.0', 'changelog', 'behaviour change', 'open rejects', 'catch', 'errors', 'abort', 'isSupported', 'e2e'],
        summary: 'What changed between 0.2.x and 0.3.0: open() now rejects on failure, and several quieter behaviour changes.',
        content: `
          <p>
            0.3.0 comes out of a real-browser end-to-end suite (Chrome, Firefox, WebKit, real Safari and
            Next.js SSR). It fixes a long list of bugs the suite found, and a few of those fixes change behaviour.
            The biggest one: <strong><code>open()</code> now rejects when it fails.</strong>
          </p>

          <pre class="code-block font-mono text-xs p-4 mb-6"><code>npm i @pip-it-up/core@^0.3.0 @pip-it-up/react@^0.3.0</code></pre>

          <h3>Do this first</h3>
          <div class="alert alert-warning">
            <strong>Add a <code>.catch()</code> to any <code>open()</code> or <code>toggle()</code> you call without awaiting.</strong>
            <code>onError</code> is still called first, but the promise used to resolve whenever <code>onError</code>
            was set, so <code>createAutoPip</code> and <code>useAutoPip</code> reported blocked attempts as successes.
            <code>&lt;PipTrigger&gt;</code> already handles this for you.
          </div>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>button.addEventListener('click', () => {
  pip.open().catch((err) => {
    if (err.name === 'AbortError') return; // you cancelled it
    console.error(err.code ?? err.name, err);
  });
});</code></pre>
          <p>
            <code>useVideoPip</code> follows the same rule: <code>enter()</code> and <code>leave()</code> reject when the
            browser refuses (for example <code>NotAllowedError</code> without a recent gesture), and <code>enter()</code>
            rejects when no <code>&lt;video&gt;</code> is attached. <code>toggle()</code> still never rejects.
          </p>

          <h3>More failures now reject</h3>
          <ul>
            <li>The automatic video fallback is refused by the browser (Safari <code>NotAllowedError</code>) and <code>fallback</code> is <code>'none'</code>.</li>
            <li>A custom <code>fallback</code> function throws.</li>
            <li><code>fallback: 'new-tab'</code> has no usable <code>fallbackUrl</code> (<code>ERR_INVALID_FALLBACK</code>).</li>
            <li>The window is already closed when it arrives (<code>ERR_WINDOW_CLOSED</code>).</li>
          </ul>

          <h3>Cancelling an open</h3>
          <p>
            Calling <code>close()</code> or <code>destroy()</code> while <code>open()</code> is still pending now cancels it.
            A late window is closed and <code>open()</code> rejects with an <code>AbortError</code>
            (<code>ERR_OPEN_ABORTED</code>); <code>onError</code> is not called. Previously the window opened anyway.
            A controlled <code>&lt;PipWrapper open={false}&gt;</code> set mid-open cancels it too.
          </p>

          <h3>Other behaviour changes</h3>
          <ul>
            <li><strong><code>state.isSupported</code></strong> now means "<code>open()</code> will do something for this instance": Document PiP, the automatic single-<code>&lt;video&gt;</code> fallback, or a usable <code>fallback</code>. <code>&lt;PipTrigger&gt;</code> uses it, so <code>renderUnsupported</code> finally shows in Safari-style browsers. <code>useIsPipSupported()</code> is unchanged.</li>
            <li><strong><code>&lt;PipTrigger&gt;</code></strong> with no <code>&lt;PipWrapper&gt;</code> around it and no <code>pipId</code> renders nothing (or <code>renderUnsupported</code>) instead of a dead button.</li>
            <li><strong><code>&lt;PipWrapper&gt;</code></strong> accepts no <code>mode</code> prop (it always portals). Without <code>width</code>/<code>height</code> it sizes the window to your content's own element instead of its full-width wrapper, and a custom <code>fallback</code> function receives that element as <code>contentEl</code>.</li>
            <li><strong><code>fixedSize</code></strong> keeps the size lock on the PiP document but no longer tries to <code>resizeTo()</code> the window, which browsers only allow with a user gesture.</li>
            <li>If something throws after the window opened (<code>onOpen</code>, style sync), the window is now closed and teardown hooks run. A throwing <code>onError</code> no longer replaces the original error.</li>
            <li>In development builds, <code>ERR_UNKNOWN_ID</code> now throws and <code>ERR_DUPLICATE_ANCHOR</code> plus anchor style warnings appear. These diagnostics were silently off before.</li>
          </ul>

          <h3>Fixes you get for free</h3>
          <ul>
            <li>Move mode returns content to the <code>originEl</code> passed to <code>open()</code>, restores the inline width/height it overwrote, and restores focus, selection and scroll after the content is back.</li>
            <li><code>usePip()</code> now bridges React event handlers (<code>onClick</code>, <code>onChange</code>…) inside moved content, and survives React Strict Mode.</li>
            <li><code>useAutoPip</code> honours its <code>signal</code> option.</li>
            <li><code>&lt;PipWrapper reserveSpace={false}&gt;</code> no longer reserves space.</li>
            <li><code>&lt;PipProvider&gt;</code>: the <code>frozen</code> activity level works, route changes park the hosted subtree so iframes don't reload, and Next.js anchors dock after hydration.</li>
            <li>The automatic video fallback fires <code>onOpen</code> once per open (Safari used to report it twice).</li>
          </ul>

          <p>See <a href="#errors-reference" class="text-[var(--color-accent-dark)] hover:underline">Errors &amp; Rejections</a> for the full list of error codes.</p>
        `
      },
      {
        id: 'upgrading',
        title: 'Upgrading to 0.2.0',
        keywords: ['upgrade', 'migration', 'breaking changes', '0.2.0', 'changelog', 'behaviour change'],
        summary: 'What changed between 0.1.x and 0.2.0, and the two behaviours that can bite on upgrade.',
        content: `
          <p>
            0.2.0 is additive for most codebases — existing <code>createPip</code> and
            <code>&lt;PipWrapper&gt;</code> usage keeps working. Two behaviour changes are worth checking
            before you upgrade.
          </p>

          <pre class="code-block font-mono text-xs p-4 mb-6"><code>npm i @pip-it-up/core@^0.2.0 @pip-it-up/react@^0.2.0</code></pre>

          <h3>Behaviour changes</h3>
          <div class="alert alert-warning">
            <strong>1. The origin element now generates a layout box.</strong>
            <code>&lt;PipWrapper&gt;</code>'s origin is <code>position: relative</code> instead of
            <code>display: contents</code>. This is what makes size reservation and placeholder positioning
            possible. If your layout assumed the wrapper was invisible to flex or grid, add compensating
            styles.
          </div>
          <div class="alert alert-warning">
            <strong>2. <code>undefined</code> no longer wipes an element slot.</strong>
            <code>setDefaultElements({ contentEl: undefined })</code> is now a no-op. Pass <code>null</code>
            to vacate a slot explicitly. <code>updateOptions()</code> follows the same rule, so partial
            updates are safe.
          </div>

          <h3>New in core</h3>
          <ul>
            <li><code>createAutoPip</code> and <code>registerEnterPipAction</code> — automatic PiP on tab switch.</li>
            <li><code>registerElements</code>, <code>getDefaultElements</code>, <code>subscribeElements</code> — tri-state slots with compare-and-clear handles.</li>
            <li><code>registerTeardown</code> — synchronous hooks that run before the PiP window dies.</li>
            <li><code>destroy()</code> is terminal, exposing <code>instance.signal</code> and <code>instance.destroyed</code>.</li>
            <li><code>unregisterPip(id, instance)</code> is compare-and-delete.</li>
          </ul>

          <h3>New in react</h3>
          <ul>
            <li><code>&lt;PipProvider&gt;</code> and <code>&lt;PipAnchor&gt;</code> — route-persistent PiP.</li>
            <li><code>useAutoPip</code> — automatic PiP as a hook.</li>
            <li><code>useDormancy</code>, <code>useActiveEffect</code>, <code>useRevealEffect</code>, <code>useAdaptiveInterval</code>.</li>
            <li><code>&lt;PipWrapper&gt;</code> no longer remounts its subtree on open or close.</li>
          </ul>

          <h3>Removed</h3>
          <ul>
            <li>The internal <code>PipPortal</code> component. It was never exported, so this affects nobody importing from the package entry point.</li>
          </ul>

          <div class="alert alert-info">
            <strong>Security fixes included.</strong> <code>fallbackUrl</code> now navigates to the parsed,
            validated URL rather than the raw input, closing a <code>&lt;base href&gt;</code> resolution
            differential. Bridged pointer events carry a non-enumerable <code>pipItUpBridged</code> marker.
          </div>
        `
      },
    ]
  },
  {
    id: 'core-api',
    title: 'Core API Reference',
    sections: [
      {
        id: 'create-pip-options',
        title: 'createPip Settings',
        keywords: ['createpip', 'pipoptions', 'mode', 'copystyles', 'fallback', 'fixedsize', 'forwardkeyboardevents'],
        summary: 'Configuration settings available in the vanilla JavaScript createPip function.',
        content: `
          <p>The core factory method <code>createPip(options)</code> registers and returns a controller instance for a single PiP window cycle.</p>

          <h3>PipOptions Configuration</h3>
          <p>Every option is optional.</p>
          <table>
            <thead><tr><th>Option</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>id</code></td><td><code>string</code></td><td><code>pip-instance-N</code></td><td>Instance id. Not registered automatically; see the Global Registry.</td></tr>
              <tr><td><code>mode</code></td><td><code>'move' | 'clone'</code></td><td><code>'move'</code></td><td><code>move</code> relocates the real node (state survives). <code>clone</code> puts a <code>cloneNode(true)</code> copy in the window. <code>'portal'</code> exists in the <code>DomMode</code> type for the React binding only.</td></tr>
              <tr><td><code>copyStyles</code></td><td><code>'sync' | 'once'</code></td><td><code>'sync'</code></td><td>Copy <code>&lt;link rel="stylesheet"&gt;</code> and <code>&lt;style&gt;</code> into the window; <code>sync</code> keeps watching for new styles. The <code>className</code>, inline <code>style</code> and <code>data-*</code> attributes of <code>&lt;html&gt;</code> and <code>&lt;body&gt;</code> are copied too (for example a <code>dark</code> class). Styles cannot be turned off.</td></tr>
              <tr><td><code>width</code> / <code>height</code></td><td><code>number</code></td><td>from <code>contentEl</code></td><td>Window size. Defaults to the size of <code>contentEl</code> (clamped to 300–1600 × 200–1200), or 900 × 600 if it has no size.</td></tr>
              <tr><td><code>fixedSize</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Lock the PiP document (<code>html</code>/<code>body</code>) to the requested px size with <code>overflow: hidden</code>. The user can still resize the window; it is not resized back (browsers only allow <code>resizeTo()</code> with a fresh gesture).</td></tr>
              <tr><td><code>reserveSpace</code></td><td><code>boolean</code></td><td><code>true</code></td><td><code>move</code> mode: freeze the size of <code>originEl</code> and <code>contentEl</code> while the content is away, so the page does not jump.</td></tr>
              <tr><td><code>centerInPip</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Center the content in the window with flexbox.</td></tr>
              <tr><td><code>pipBodyStyles</code></td><td><code>Partial&lt;CSSStyleDeclaration&gt; | false</code></td><td>built-in resets</td><td>Styles for the PiP <code>&lt;body&gt;</code>. An object <strong>replaces</strong> the built-in resets; <code>false</code> skips body styling entirely. Trusted values only.</td></tr>
              <tr><td><code>forwardKeyboardEvents</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Re-dispatch real <code>keydown</code>/<code>keyup</code> from the PiP window on the opener, so page shortcuts keep working. <code>preventDefault()</code> on the copy also prevents the original.</td></tr>
              <tr><td><code>forwardPointerEvents</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Re-dispatch real pointer and mouse events on the opener. Coordinates are PiP-relative.</td></tr>
              <tr><td><code>restoreScroll</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Save and restore scroll positions inside <code>contentEl</code> across the round trip.</td></tr>
              <tr><td><code>restoreFocus</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Save and restore focus and input/textarea selection across the round trip.</td></tr>
              <tr><td><code>fallback</code></td><td><code>'none' | 'new-tab' | function</code></td><td><code>'none'</code></td><td>What <code>open()</code> does when Document PiP is unavailable (or <code>forceFallback</code> is set) and the video fallback does not apply. <code>'new-tab'</code> opens <code>fallbackUrl</code>. A function <code>({ contentEl, originEl, resolvedOptions }) =&gt; cleanup | void</code> runs your own; its cleanup runs on <code>close()</code>.</td></tr>
              <tr><td><code>fallbackUrl</code></td><td><code>string</code></td><td>—</td><td>Required for <code>'new-tab'</code>. Only <code>http:</code>/<code>https:</code>; otherwise <code>open()</code> rejects with <code>ERR_INVALID_FALLBACK</code>.</td></tr>
              <tr><td><code>forceFallback</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Use the fallback path even when Document PiP exists (testing, fallback-first apps).</td></tr>
              <tr><td><code>disableVideoPip</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Turn off the automatic native video PiP fallback.</td></tr>
              <tr><td><code>preferInitialWindowPlacement</code></td><td><code>boolean</code></td><td>—</td><td>Ask the browser to open at its default position instead of where the last window was.</td></tr>
              <tr><td><code>disallowReturnToOpener</code></td><td><code>boolean</code></td><td>—</td><td>Hide the browser's "back to tab" button in the window frame.</td></tr>
            </tbody>
          </table>

          <h3>Callbacks</h3>
          <ul>
            <li><code>onBeforeOpen()</code>: runs before a Document PiP window is requested. Return (or resolve) <code>false</code> to cancel. Not called on the video or fallback path.</li>
            <li><code>onOpen(win)</code>: right after opening. <code>win</code> is the PiP window; on the video PiP and fallback paths it is the opener <code>window</code>.</li>
            <li><code>onPipWindowReady(win)</code>: Document PiP only, on the next animation frame after <code>onOpen</code>.</li>
            <li><code>onClose()</code>: after the window closed and everything was restored.</li>
            <li><code>onError(err)</code>: when opening fails. <code>open()</code> still rejects with the same error. A throwing <code>onError</code> is logged and does not replace the rejection. Not called for <code>ERR_OPEN_ABORTED</code>.</li>
          </ul>

          <h3>Instance members</h3>
          <table>
            <thead><tr><th>Member</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>open(elements?)</code></td><td>Open the window. <code>elements</code> (<code>{ contentEl?, originEl? }</code>) overrides the default slots for this session. Rejects on failure. Resolves without opening when already open or opening, when <code>onBeforeOpen</code> returns <code>false</code>, or when nothing can open and <code>fallback</code> is <code>'none'</code> (a warning is logged).</td></tr>
              <tr><td><code>close()</code></td><td>Close the window and restore the content. Also cancels a pending <code>open()</code>.</td></tr>
              <tr><td><code>toggle(elements?)</code></td><td><code>close()</code> if open, otherwise <code>open(elements)</code>. Handle its promise like <code>open()</code>.</td></tr>
              <tr><td><code>isOpen()</code></td><td><code>true</code> while a session is open.</td></tr>
              <tr><td><code>getPipWindow()</code></td><td>The PiP <code>Window</code>, or <code>null</code> (also <code>null</code> on the video and fallback paths).</td></tr>
              <tr><td><code>getState()</code></td><td><code>{ isOpen, isSupported, pipWindow }</code>. A new object on each change, so it works as a <code>useSyncExternalStore</code> snapshot.</td></tr>
              <tr><td><code>subscribe(fn)</code></td><td>Called on every state change. Returns an unsubscribe function.</td></tr>
              <tr><td><code>updateOptions(options)</code></td><td>Merge new options. <code>undefined</code> values are ignored; <code>id</code> and <code>mode</code> cannot change after creation. Recomputes <code>isSupported</code>.</td></tr>
              <tr><td><code>destroy()</code></td><td>Permanent teardown: closes, aborts <code>signal</code>, drops listeners and element references. Afterwards every method is inert.</td></tr>
              <tr><td><code>id</code>, <code>signal</code>, <code>destroyed</code></td><td>The instance id; an <code>AbortSignal</code> aborted by <code>destroy()</code> (pass it to your own <code>addEventListener</code> calls); and <code>true</code> after <code>destroy()</code>.</td></tr>
            </tbody>
          </table>

          <div class="alert alert-info">
            <strong><code>isSupported</code> is per instance.</strong> It answers "will <code>open()</code> do something
            here?", not "does this browser have Document PiP?". It is <code>true</code> when Document PiP is available
            (and <code>forceFallback</code> is off), when the video fallback applies (the content holds exactly one
            <code>&lt;video&gt;</code>, a video PiP API exists and <code>disableVideoPip</code> is not set), or when a usable
            <code>fallback</code> is set. For the browser-level check, call <code>isSupported()</code> from the package.
          </div>
        `
      },
      {
        id: 'registry-api',
        title: 'Global Registry API',
        keywords: ['registerpip', 'unregisterpip', 'getpip', 'decoupled trigger', 'keyboard shortcuts', 'navigation cleanup'],
        summary: 'Using the global registry to connect disparate triggers and control PiP state from anywhere.',
        content: `
          <p>
            The global registry lets you share and control Picture-in-Picture instances across completely separate modules of your application.
            This is extremely useful for things like nav-bar triggers, keyboard commands, or global routing cleanup.
          </p>

          <pre class="code-block font-mono text-xs p-4 mb-6"><code>import { registerPip, getPip } from '@pip-it-up/core';

// In your player code:
const pipInstance = createPip({ id: 'main-player' });
registerPip('main-player', pipInstance);

// In a completely separate Navigation component:
document.getElementById('nav-toggle-btn').addEventListener('click', () => {
  getPip('main-player')?.toggle().catch((err) =&gt; console.warn('PiP failed:', err));
});</code></pre>

          <h3>Practical Implementations</h3>
          
          <h4>1. Global Keyboard Shortcuts</h4>
          <p>Bind key codes on your opener page to trigger remote float/restore:</p>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>window.addEventListener('keydown', (e) => {
  if (e.altKey && e.key.toLowerCase() === 'p') {
    getPip('main-player')?.toggle().catch((err) =&gt; console.warn('PiP failed:', err));
  }
});</code></pre>

          <h4>2. Navigation Cleanup</h4>
          <p>Avoid orphaned floating overlays when users transition page contexts or log out:</p>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>router.onBeforeEach((to, from) => {
  getPip('main-player')?.close();
});</code></pre>
        `
      },
      {
        id: 'auto-pip',
        title: 'Automatic PiP',
        keywords: ['auto pip', 'createAutoPip', 'tab switch', 'visibilitychange', 'media session', 'transient activation', 'enterpictureinpicture'],
        summary: 'Open Picture-in-Picture automatically when the user switches tabs, and understand why an attempt can be refused.',
        content: `
          <p>
            <code>createAutoPip(enter, options?)</code> enters Picture-in-Picture when the document becomes
            hidden. It is framework-agnostic and returns a disposer. You supply <code>enter</code>, so the
            same helper drives native Video PiP or full Document PiP — the helper owns <em>when</em>, you own
            <em>what</em>.
          </p>

          <pre class="code-block font-mono text-xs p-4 mb-6"><code>import { createAutoPip } from '@pip-it-up/core';

const dispose = createAutoPip(() =&gt; instance.open(), {
  when: () =&gt; !video.paused,
  onResult: (r) =&gt; console.warn('auto-pip', r),
});

// later
dispose();</code></pre>

          <h3>Options</h3>
          <table>
            <thead><tr><th>Option</th><th>Type</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>when</code></td><td><code>() =&gt; boolean</code></td><td>Guard evaluated at attempt time. Return <code>false</code> to skip. Defaults to always attempting.</td></tr>
              <tr><td><code>onResult</code></td><td><code>(r: AutoPipResult) =&gt; void</code></td><td>Reports every attempt, including expected rejections.</td></tr>
              <tr><td><code>mediaSession</code></td><td><code>boolean</code></td><td>Also register the <code>enterpictureinpicture</code> Media Session action. Default <code>false</code>.</td></tr>
              <tr><td><code>signal</code></td><td><code>AbortSignal</code></td><td>Stop listening when aborted, instead of tracking the disposer. Chain <code>instance.signal</code> here.</td></tr>
            </tbody>
          </table>

          <h3>Reading AutoPipResult</h3>
          <p>The result separates "nothing authorised this" from a real failure:</p>
          <ul>
            <li><code>{ ok: true, grantedBy: 'gesture' }</code> — a live transient user activation paid for the call.</li>
            <li><code>{ ok: true, grantedBy: 'browser' }</code> — no activation was live; the browser granted PiP itself on an eligible origin.</li>
            <li><code>{ ok: false, error, hadActivation }</code> — refused. <code>hadActivation: false</code> with a <code>NotAllowedError</code> is the ordinary outcome on an untouched page. <code>true</code> means the gesture was accepted and the failure came from elsewhere.</li>
          </ul>

          <div class="alert alert-warning">
            <strong>One attempt per gesture.</strong> Transient activation is time-based and survives across
            tasks, but a successful call <em>consumes</em> it. If two components enable auto-PiP, a single tab
            switch carries one activation: exactly one wins and the other is rejected with
            <code>NotAllowedError</code>. Worse, the two trigger paths order themselves in opposite directions —
            <code>visibilitychange</code> fires every listener so the <em>first</em> registered wins, while
            <code>enterpictureinpicture</code> has one global handler slot so the <em>last</em> registered wins.
            That makes the outcome depend on JSX order. Arbitrate explicitly with <code>when</code> instead.
          </div>

          <h3>Gesture-free auto-PiP</h3>
          <p>Chrome can enter PiP with no gesture, but only when the origin is eligible (camera or microphone in use, an installed PWA, or the user allowed the site at <code>chrome://settings/content/autoPictureInPicture</code>) <em>and</em> the page registered the <code>enterpictureinpicture</code> Media Session action (<code>mediaSession: true</code>). That is why Google Meet always works. On an ineligible origin the browser simply never calls it.</p>
          <h3>What counts as leaving</h3>
          <p>It listens for <code>visibilitychange</code>: switching tabs or minimising the window. Switching to another app while the browser window stays visible does not hide the document, so nothing happens. It deliberately ignores <code>blur</code>, which also fires for the address bar and DevTools.</p>
          <p>Don't hand-roll a <code>visibilitychange</code> handler that calls <code>requestPictureInPicture()</code>: it works only if the user interacted in the last few seconds. A video gets its gesture from the click on play and expires after about a minute; an editor gets a fresh one with every keystroke. With more than two candidates, use <strong>one</strong> auto-PiP whose <code>enter</code> picks the target.</p>

          <h3>registerEnterPipAction(enter)</h3>
          <p>
            Registers the <code>enterpictureinpicture</code> Media Session action on its own — the page-side
            opt-in that lets Chrome trigger PiP with no user gesture on eligible origins. Only meaningful
            while media is playing, and there is one Media Session per document, so call it from a single owner.
          </p>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>import { registerEnterPipAction } from '@pip-it-up/core';

const unregister = registerEnterPipAction(() =&gt; instance.open());</code></pre>
        `
      },
      {
        id: 'errors-reference',
        title: 'Errors & Rejections',
        keywords: ['errors', 'reject', 'catch', 'abort', 'AbortError', 'PipError', 'ERR_OPEN_ABORTED', 'ERR_WINDOW_CLOSED', 'ERR_INVALID_FALLBACK', 'ERR_DESTROYED', 'ERR_UNKNOWN_ID', 'ERR_DUPLICATE_ANCHOR', 'onError', 'PipOpenErrorCode'],
        summary: 'How open() and toggle() fail, and the error codes core attaches.',
        content: `
          <p>
            <code>open()</code> and <code>toggle()</code> reject on failure. Browser errors pass through unchanged
            (for example <code>NotAllowedError</code> without a recent click, including on the video fallback).
            Errors raised by core carry a <code>code</code>, typed as <code>PipOpenErrorCode</code>.
          </p>

          <table>
            <thead>
              <tr><th>Code</th><th><code>name</code></th><th>When</th><th><code>onError</code> called?</th></tr>
            </thead>
            <tbody>
              <tr><td><code>ERR_OPEN_ABORTED</code></td><td><code>AbortError</code></td><td><code>close()</code> or <code>destroy()</code> ran while <code>open()</code> was pending. A late window is closed.</td><td>No</td></tr>
              <tr><td><code>ERR_WINDOW_CLOSED</code></td><td><code>PipError</code></td><td>The window was already closed when the browser handed it over.</td><td>Yes</td></tr>
              <tr><td><code>ERR_INVALID_FALLBACK</code></td><td><code>PipError</code></td><td><code>fallback: 'new-tab'</code> with a missing or non-<code>http(s)</code> <code>fallbackUrl</code>.</td><td>Yes</td></tr>
              <tr><td><code>ERR_DESTROYED</code></td><td>—</td><td>Not a rejection: <code>open()</code> on a destroyed instance logs a <code>console.warn</code> and resolves.</td><td>No</td></tr>
            </tbody>
          </table>

          <p>If anything throws after the window appeared (in <code>onOpen</code>, style sync, a bridge), the window is closed again and <code>open()</code> rejects with that error.</p>

          <pre class="code-block font-mono text-xs p-4 mb-6"><code>pip.open().catch((err) => {
  if (err.name === 'AbortError') return; // you cancelled it
  console.error(err.code ?? err.name, err);
});</code></pre>

          <div class="alert alert-info">
            <strong>React diagnostics.</strong> In development builds, <code>ERR_UNKNOWN_ID</code> throws (an error
            boundary will catch it) and <code>ERR_DUPLICATE_ANCHOR</code> warns, so mistakes in
            <code>&lt;PipProvider&gt;</code> / <code>&lt;PipAnchor&gt;</code> wiring surface early.
          </div>
        `
      },
      {
        id: 'element-registration',
        title: 'Element Registration',
        keywords: ['registerElements', 'tri-state', 'compare-and-clear', 'setDefaultElements', 'getDefaultElements', 'subscribeElements', 'contentEl', 'originEl'],
        summary: 'Tri-state element slots with compare-and-clear handles, for components that hand ownership to each other.',
        content: `
          <p>
            An instance holds two element slots, <code>contentEl</code> and <code>originEl</code>.
            <code>registerElements(patch)</code> claims them and returns a handle that only ever releases what
            it still owns — which is what makes a route handoff safe in either commit order.
          </p>

          <pre class="code-block font-mono text-xs p-4 mb-6"><code>const reg = instance.registerElements({ originEl: node });

reg.update({ originEl: newNode }); // re-point
reg.release();                     // vacate only slots this handle still owns
reg.released;                      // true afterwards; further update() is inert</code></pre>

          <h3>Tri-state slots</h3>
          <p>Each slot in a patch distinguishes three intents:</p>
          <table>
            <thead><tr><th>Value</th><th>Meaning</th></tr></thead>
            <tbody>
              <tr><td><code>undefined</code> (or key absent)</td><td>Leave the slot alone. Never clobbers a sibling.</td></tr>
              <tr><td><code>null</code></td><td>Vacate the slot explicitly.</td></tr>
              <tr><td><code>HTMLElement</code></td><td>Claim the slot.</td></tr>
            </tbody>
          </table>

          <div class="alert alert-warning">
            <strong>Behaviour change in 0.2.0.</strong> <code>setDefaultElements({ contentEl: undefined })</code>
            is now a no-op rather than a wipe. Pass <code>null</code> to vacate a slot. Likewise
            <code>updateOptions()</code> no longer overwrites stored options with <code>undefined</code>, so
            partial updates are safe.
          </div>

          <h3>Reading slots</h3>
          <ul>
            <li><code>getDefaultElements()</code> — referentially stable. A no-op merge returns the <em>same object</em>, so it is safe as a <code>useSyncExternalStore</code> snapshot without causing render loops.</li>
            <li><code>subscribeElements(fn)</code> — fires only on real slot changes. Narrower than <code>subscribe</code>, which fires on every state change.</li>
          </ul>

          <div class="alert alert-info">
            <strong>Clearing a slot is not a close signal.</strong> Calling
            <code>setDefaultElements({ contentEl: null, originEl: null })</code> while open leaves
            <code>isOpen === true</code>, and removing the origin node from the DOM neither throws nor
            auto-closes the window.
          </div>
        `
      },
      {
        id: 'lifecycle-teardown',
        title: 'Lifecycle & Teardown',
        keywords: ['registerTeardown', 'destroy', 'signal', 'destroyed', 'abortsignal', 'repatriation', 'pagehide'],
        summary: 'Synchronous teardown hooks and a terminal destroy(), for moving DOM out before the PiP window dies.',
        content: `
          <p>
            When a PiP window closes, its document is torn down. Anything you still have parented inside it
            must be moved out <em>synchronously</em> — an async callback runs too late, after the nodes are
            already gone. <code>registerTeardown</code> exists for exactly that window.
          </p>

          <h3>registerTeardown(fn)</h3>
          <p>
            Runs synchronously at the very top of <code>close()</code>, LIFO, before
            <code>pipWindow.close()</code> and before internal cleanup. Returns an idempotent unregister
            function.
          </p>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>const off = instance.registerTeardown((pipWindow) =&gt; {
  // still alive here - move your nodes home
  anchor.appendChild(node);
});</code></pre>
          <p>
            Hooks are error-isolated: a throwing hook is reported via <code>console.error</code>, the
            remaining hooks still run, the window still closes, and the instance is left reopenable.
          </p>

          <h3>destroy() is terminal</h3>
          <ul>
            <li>Aborts <code>instance.signal</code>, so every signal-bound listener is removed atomically.</li>
            <li>Sets <code>instance.destroyed === true</code>. Every mutating method is inert afterwards.</li>
            <li>Releases retained DOM references and clears listener sets.</li>
            <li>Closes the window if it was open, running teardown hooks first.</li>
          </ul>

          <h3>instance.signal</h3>
          <p>
            An <code>AbortSignal</code> aborted by <code>destroy()</code>. Bind listeners to it rather than
            tracking disposers by hand — the browser removes signal-bound listeners even if one of your own
            disposers throws first:
          </p>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>window.addEventListener('resize', onResize, { signal: instance.signal });

// chain it into other lifetimes too
createAutoPip(enter, { signal: instance.signal });</code></pre>

          <div class="alert alert-info">
            <strong>Registry safety.</strong> <code>unregisterPip(id, instance)</code> is now
            compare-and-delete: passing the instance means an outgoing component's cleanup can no longer
            remove an incoming component's registration.
          </div>
        `
      },
      {
        id: 'native-video-pip',
        title: 'Native Video PiP',
        keywords: ['video pip', 'enterVideoPip', 'exitVideoPip', 'isInVideoPip', 'isVideoPipSupported', 'isWebkitPipSupported', 'safari', 'ios', 'playsinline', 'disableVideoPip'],
        summary: 'Float a single video with the browser\'s own PiP API, and the caveats that apply.',
        content: `
          <p>
            Two different browser APIs exist. Use native video PiP when the content <strong>is</strong> a
            <code>&lt;video&gt;</code>; use Document PiP (<code>createPip</code>) for anything else.
          </p>
          <table>
            <thead><tr><th></th><th>Native video PiP</th><th>Document PiP</th></tr></thead>
            <tbody>
              <tr><td>What floats</td><td>the video's frames, drawn by the OS</td><td>a real window with your DOM</td></tr>
              <tr><td>Moves DOM?</td><td>no</td><td>yes</td></tr>
              <tr><td>Support</td><td>~95%, including Safari/iOS and Firefox</td><td>Chrome/Edge 116+, Firefox 151+</td></tr>
            </tbody>
          </table>

          <pre class="code-block font-mono text-xs p-4 mb-6"><code>import { enterVideoPip, exitVideoPip, isInVideoPip } from '@pip-it-up/core';

const video = document.querySelector('video')!;
button.addEventListener('click', () =&gt; {
  const action = isInVideoPip() ? exitVideoPip(video) : enterVideoPip(video);
  action.catch((err) =&gt; console.warn('Video PiP failed:', err));
});</code></pre>

          <table>
            <thead><tr><th>Function</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>isSupported()</code></td><td>The browser has Document PiP.</td></tr>
              <tr><td><code>isVideoPipSupported()</code></td><td>The standard video PiP API exists.</td></tr>
              <tr><td><code>isWebkitPipSupported()</code></td><td>Older WebKit presentation mode exists.</td></tr>
              <tr><td><code>isInVideoPip()</code></td><td>Some element on the page is in video PiP.</td></tr>
              <tr><td><code>enterVideoPip(video)</code></td><td>Adds <code>playsinline</code> if missing (needed on iOS), then tries <code>requestPictureInPicture()</code>, <code>webkitSetPresentationMode('picture-in-picture')</code>, <code>webkitEnterFullscreen()</code>. Rejects if none exists.</td></tr>
              <tr><td><code>exitVideoPip(video)</code></td><td>Exits through the same three paths.</td></tr>
            </tbody>
          </table>
          <p>
            Track state with the video's own events (<code>enterpictureinpicture</code>, <code>leavepictureinpicture</code>,
            and <code>webkitpresentationmodechanged</code> on WebKit) so your UI stays right when the user closes the overlay
            itself. React's <code>useVideoPip</code> does this for you.
          </p>
          <p>
            <strong>Automatic fallback:</strong> when Document PiP is unavailable and the content holds exactly one
            <code>&lt;video&gt;</code>, <code>createPip().open()</code> uses native video PiP instead. Opt out with
            <code>disableVideoPip: true</code>.
          </p>

          <h3>Caveats</h3>
          <ol>
            <li><strong>Needs a real user gesture.</strong> Without one: <code>NotAllowedError</code>.</li>
            <li><strong>Tab-switch PiP is limited.</strong> A <code>visibilitychange</code> handler only succeeds within the activation window after a click. See Automatic PiP.</li>
            <li><strong>One PiP element per document.</strong> Requesting a second one moves the overlay to it.</li>
            <li><strong>No audio PiP.</strong> To float an audio player's controls and artwork, use Document PiP.</li>
            <li><strong>The overlay cannot be styled.</strong> The OS draws it. Custom controls need Document PiP.</li>
            <li><strong><code>disablePictureInPicture</code> blocks it.</strong> The browser refuses when the attribute is set.</li>
            <li><strong>iOS needs <code>playsinline</code>.</strong> Without it the video plays fullscreen. <code>enterVideoPip</code> adds it for you.</li>
          </ol>
        `
      },
      {
        id: 'core-gotchas',
        title: 'Gotchas',
        keywords: ['gotchas', 'iframe', 'cross-origin', 'youtube', 'clone', 'move', 'pointer coordinates', 'pipItUpBridged', 'prosemirror', 'tiptap', 'monaco', 'style sync', 'new-tab'],
        summary: 'Known browser and library limits: iframes, cached documents, pointer coordinates, move vs clone.',
        content: `
          <ul>
            <li><strong>Cross-origin iframes do not work in the PiP window.</strong> YouTube, Vimeo, Maps and Spotify embeds get reloaded in a new document and refuse to play (YouTube shows Error 153). This is a browser limitation. For video, use a <code>&lt;video&gt;</code> with a direct source URL.</li>
            <li><strong><code>move</code> keeps state.</strong> The real node relocates, so <code>&lt;video&gt;</code> and <code>&lt;audio&gt;</code> keep playing, <code>&lt;canvas&gt;</code> keeps its buffer and WebRTC streams stay connected.</li>
            <li><strong>Libraries that cache <code>document</code> or <code>window</code>.</strong> Libraries that read <code>node.ownerDocument.defaultView</code> live (Monaco) need nothing. Libraries that cache it (ProseMirror's <code>EditorView</code>) need their own refresh: call <code>view.updateRoot()</code> in <code>onPipWindowReady</code> and again after <code>close()</code>. Prefer the refresh over rebuilding the component, which loses undo history, scroll and selection.</li>
            <li><strong>Style sync fetches external CSS twice</strong> (once per document). A stylesheet behind auth or a private CDN can fail silently in the PiP window. Use <code>copyStyles: 'once'</code> plus inlined critical CSS.</li>
            <li><strong>Bridged pointer coordinates are PiP-relative.</strong> A click at (20, 20) in the PiP window arrives at (20, 20) on the opener, which is a different element. Bridged events carry a non-enumerable <code>pipItUpBridged: true</code>; skip them in coordinate-based code, or set <code>forwardPointerEvents: false</code>. Forwarded types: <code>pointerdown</code>, <code>pointermove</code>, <code>pointerup</code>, <code>pointercancel</code>, <code>mousedown</code>, <code>mousemove</code>, <code>mouseup</code>, <code>click</code>.</li>
            <li><strong><code>'new-tab'</code> has no close signal.</strong> The instance stays open until you call <code>close()</code>.</li>
            <li><strong><code>mode: 'portal'</code></strong> is for the React binding. In vanilla <code>createPip</code> it moves nothing; use <code>move</code> or <code>clone</code>.</li>
          </ul>

          <pre class="code-block font-mono text-xs p-4 mb-6"><code>window.addEventListener('pointerdown', (e) =&gt; {
  if ((e as PointerEvent &amp; { pipItUpBridged?: boolean }).pipItUpBridged) return;
  // opener-only logic
});</code></pre>

          <h3>Move vs clone</h3>
          <table>
            <thead><tr><th>Mode</th><th>Use when</th><th>Avoid when</th></tr></thead>
            <tbody>
              <tr><td><code>move</code></td><td>The content has state: video, canvas, WebGL, WebRTC, editors, live data.</td><td>You need it visible in both windows at once (a node has one parent).</td></tr>
              <tr><td><code>clone</code></td><td>A static, read-only copy (a preview, a printable view).</td><td>The content has state. Listeners and form state are not copied, <code>&lt;script&gt;</code> does not re-run, and inline handlers (<code>onclick="…"</code>) <strong>are</strong> copied and run in the PiP window.</td></tr>
            </tbody>
          </table>
        `
      },
      {
        id: 'core-security',
        title: 'Security, CSP & Trusted Types',
        keywords: ['security', 'csp', 'content security policy', 'trusted types', 'nonce', 'same-origin', 'keyboard bridge', 'registry', 'vulnerability', 'xss', 'innerHTML'],
        summary: 'The security model, what to watch for, and compatibility with strict CSP and Trusted Types.',
        content: `
          <ul>
            <li><strong>Same-origin only.</strong> The PiP window is same-origin with the opener by design and needs a secure context (HTTPS). Opening from inside an <code>&lt;iframe&gt;</code> throws <code>NotAllowedError</code>.</li>
            <li><strong>Keyboard bridge.</strong> Only real (<code>isTrusted</code>) keystrokes are forwarded. Every opener <code>keydown</code>/<code>keyup</code> listener sees them (analytics, session replay), so set <code>forwardKeyboardEvents: false</code> when the window holds passwords, card numbers or private chat. Forwarded keys are dispatched on <code>window</code> only, so a hotkey listener scoped to a container element never sees them.</li>
            <li><strong>Pointer bridge.</strong> Only real (<code>isTrusted</code>) events are forwarded. Coordinates are PiP-relative.</li>
            <li><strong>Style sync.</strong> Inline <code>&lt;style&gt;</code> text is copied verbatim, so injected CSS on the opener reaches the PiP window too.</li>
            <li><strong><code>fallbackUrl</code>.</strong> Only <code>http:</code>/<code>https:</code> pass. The new tab navigates to the validated <code>href</code>, so a <code>&lt;base href&gt;</code> cannot redirect it, and opens with <code>noopener,noreferrer</code>. Open redirects are still possible, so allowlist URLs derived from user data.</li>
            <li><strong><code>clone</code> mode.</strong> <code>cloneNode(true)</code> copies inline handlers, the same trust level as <code>innerHTML</code>. Never clone untrusted HTML. React never uses clone mode.</li>
            <li><strong><code>pipBodyStyles</code>.</strong> Written to <code>body.style</code> without sanitising. Trusted values only.</li>
            <li><strong>Registry.</strong> Same-page coordination, not isolation: any script on the page can call <code>getPip(id).open()</code>. Never build ids from user content.</li>
          </ul>

          <h3>CSP and Trusted Types</h3>
          <p>
            pip-it-up is compatible with <code>require-trusted-types-for 'script'</code> and <code>script-src 'self'</code> and
            needs no Trusted Types policy: it never converts strings into script or markup. It uses no
            <code>innerHTML</code>, <code>outerHTML</code>, <code>insertAdjacentHTML</code>, <code>eval</code> or <code>new Function</code>.
          </p>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>require-trusted-types-for 'script';
script-src 'self';
style-src 'self' 'unsafe-inline';</code></pre>
          <div class="alert alert-warning">
            <strong>The nonce caveat.</strong> Cloned <code>&lt;style&gt;</code> and <code>&lt;link&gt;</code> nodes keep their
            original <code>nonce</code>. With a <em>per-document</em> nonce, the value will not validate inside the PiP document and the
            window renders <strong>unstyled</strong>. Use a <em>per-response</em> nonce, or <code>copyStyles: 'once'</code> with
            pre-inlined critical CSS. The PiP window inherits the opener's CSP and it cannot be relaxed there.
          </div>
          <p>
            pip-it-up has not had a formal third-party security audit. Report vulnerabilities privately through
            <a href="https://github.com/Shakya47/pip-it-up/security/advisories/new" target="_blank" rel="noopener" class="text-[var(--color-accent-dark)] hover:underline">GitHub Security Advisories</a>.
          </p>
        `
      },
      {
        id: 'vanilla-route-persistence',
        title: 'Vanilla Route Persistence',
        keywords: ['vanilla', 'route persistence', 'navigation', 'registerElements', 'registerTeardown', 'isUsable', 'parking container', 'moveBefore'],
        summary: 'Keep a PiP window alive across navigation in plain JS, using core primitives.',
        content: `
          <p>
            In React this is built in (<code>&lt;PipProvider&gt;</code> / <code>&lt;PipAnchor&gt;</code>). Core has no packaged
            equivalent, but it has every primitive you need. Vanilla JS has no reconciler, so a node you hold stays alive and you
            move it yourself.
          </p>
          <table>
            <thead><tr><th>You need</th><th>Core gives you</th></tr></thead>
            <tbody>
              <tr><td>Swap the restore target when the UI changes</td><td><code>registerElements</code> and its compare-and-clear <code>release()</code></td></tr>
              <tr><td>Survive an origin being replaced mid-session</td><td>The restore target is read at close time</td></tr>
              <tr><td>Move content while the PiP document is still alive</td><td><code>registerTeardown</code></td></tr>
              <tr><td>Know whether a node is still safe to touch</td><td><code>isUsable(el)</code></td></tr>
              <tr><td>Tie listeners to the instance's lifetime</td><td><code>instance.signal</code></td></tr>
              <tr><td>Share one instance across modules</td><td><code>registerPip</code> / <code>getPip</code>, owner-only <code>unregisterPip(id, instance)</code></td></tr>
            </tbody>
          </table>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>import { createPip, isUsable, registerPip } from '@pip-it-up/core';

const contentEl = document.getElementById('tracker')!;
const pip = createPip({ id: 'tracker', mode: 'move' });
registerPip('tracker', pip);

// A hidden container you own. Parked content stays CONNECTED:
// detaching a &lt;video&gt; would pause it.
const parked = document.createElement('div');
parked.setAttribute('inert', '');
parked.style.cssText = 'position:fixed;top:0;left:0;width:0;height:0;overflow:hidden;content-visibility:hidden';
document.body.appendChild(parked);

let slot: HTMLElement | null = null;
const home = () =&gt; (isUsable(slot) ? slot! : parked);

const registration = pip.registerElements({ contentEl, originEl: home() });
home().appendChild(contentEl);

export function onRouteChange(nextSlot: HTMLElement | null) {
  slot = nextSlot;
  registration.update({ originEl: home() });
  // While the window is open the content lives in the PiP document.
  if (contentEl.ownerDocument === document) home().appendChild(contentEl);
}

// Put the content home while the PiP document is still alive.
pip.registerTeardown(() =&gt; home().appendChild(contentEl));</code></pre>
          <ul>
            <li><code>update()</code> re-points the origin in place. Releasing and re-registering also works, but briefly vacates <code>contentEl</code> too.</li>
            <li>If the widget can open while parked, pass <code>width</code> and <code>height</code>: parked content has no size to measure, so the window falls back to 900 × 600.</li>
            <li>When the feature goes away: <code>registration.release()</code>, <code>unregisterPip('tracker', pip)</code>, <code>pip.destroy()</code>.</li>
          </ul>
          <h3>What you still write</h3>
          <ul>
            <li>The parking container and your move policy. <code>Element.moveBefore()</code> preserves state on same-document moves but throws across documents, so fall back to <code>appendChild</code> when moving into or out of the PiP window.</li>
            <li>An anchor or registry abstraction, if several pages can host the widget.</li>
            <li>Layout-shift protection and dormancy (pausing the widget while parked).</li>
          </ul>
        `
      },
    ]
  },
  {
    id: 'react-api',
    title: 'React API Reference',
    sections: [
      {
        id: 'react-components',
        title: 'Components bindings',
        keywords: ['pipwrapper', 'piptrigger', 'props', 'controlled mode', 'uncontrolled mode', 'accessibility'],
        summary: 'React hooks and context components like PipWrapper and PipTrigger.',
        content: `
          <p>React handles styling, portals, and unmount triggers through structured wrappers.</p>

          <div class="alert alert-info">
            <strong>Zero remounts since 0.2.0.</strong> <code>&lt;PipWrapper&gt;</code> no longer remounts its
            subtree when the PiP window opens or closes. Video playheads, canvas bitmaps, WebGL contexts,
            WebRTC streams and component state are all preserved — the content lives in an immortal portal
            container that is moved with native DOM APIs rather than torn down and rebuilt.
          </div>

          <h3>&lt;PipWrapper&gt;</h3>
          <p>Props include all standard core options along with specific React attributes:</p>
          <ul>
            <li><code>open</code>: Controlled state boolean. Pair with <code>onOpenChange</code>.</li>
            <li><code>placeholder</code>: A React Node rendered inline in the layout while children reside inside the PiP portal.</li>
            <li><code>centerInPip</code>: Flex centering utility styles inside the PiP body.</li>
          </ul>

          <div class="alert alert-warning">
            <strong>Layout change in 0.2.0.</strong> The origin element is now
            <code>position: relative</code> instead of <code>display: contents</code>, so it generates a real
            layout box. This is required for size reservation and placeholder positioning. If you were relying
            on the wrapper being layout-invisible, add your own styles to compensate.
          </div>

          <h4>Full props</h4>
          <p><code>&lt;PipWrapper&gt;</code> accepts every core option except <code>mode</code> (it always portals; passing one from JavaScript logs a warning), plus:</p>
          <table>
            <thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>open</code></td><td><code>boolean</code></td><td>—</td><td>Controlled open state. Opening needs a user gesture, so set it from a click handler. Setting it back to <code>false</code> closes the window, or cancels an open still pending.</td></tr>
              <tr><td><code>defaultOpen</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Try to open once on mount (uncontrolled only). Usually blocked without a gesture; the failure is logged.</td></tr>
              <tr><td><code>onOpenChange</code></td><td><code>(open: boolean) =&gt; void</code></td><td>—</td><td>Called when the window opens or closes.</td></tr>
              <tr><td><code>as</code></td><td><code>ElementType</code></td><td><code>'div'</code></td><td>Element for the content box (the part that moves).</td></tr>
              <tr><td><code>originAs</code></td><td><code>ElementType</code></td><td><code>'div'</code></td><td>Element for the origin box (stays on the page). A custom component must forward its ref.</td></tr>
              <tr><td><code>placeholder</code></td><td><code>ReactNode</code></td><td>"📺 In PiP" + Restore button</td><td>Shown in the page while the content is in PiP.</td></tr>
              <tr><td><code>placeholderClassName</code></td><td><code>string</code></td><td>—</td><td>Class for the placeholder's wrapper.</td></tr>
              <tr><td><code>id</code></td><td><code>string</code></td><td>—</td><td>Registers the instance so a remote <code>&lt;PipTrigger pipId&gt;</code> can control it.</td></tr>
              <tr><td><code>onError</code></td><td><code>(err) =&gt; void</code></td><td>—</td><td>Called when opening fails. When set, the wrapper and its triggers don't log their own warning.</td></tr>
              <tr><td><code>ref</code></td><td><code>Ref&lt;HTMLElement&gt;</code></td><td>—</td><td>Receives the origin element.</td></tr>
            </tbody>
          </table>
          <p>Without <code>width</code>/<code>height</code>, the window matches the size of your content's own element (when it is a single element with no text beside it).</p>

          <h4>When Document PiP is missing</h4>
          <ol>
            <li><strong>Document PiP</strong>, if the browser has it.</li>
            <li><strong>Native video PiP</strong>, if the content holds exactly one <code>&lt;video&gt;</code> (the root or its only video descendant). This makes a player work on Safari and iOS with no setup. A <code>&lt;video&gt;</code> rendered later is picked up. <code>disableVideoPip</code> turns this off.</li>
            <li><strong><code>fallback</code></strong>: <code>'none'</code> does nothing; <code>'new-tab'</code> opens <code>fallbackUrl</code> with <code>noopener,noreferrer</code>; a function runs your own.</li>
          </ol>
          <p>If none apply, the instance is unsupported and <code>&lt;PipTrigger&gt;</code> renders <code>renderUnsupported</code>.</p>

          <h4>Controlled Example</h4>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>const [isFloating, setIsFloating] = useState(false);

return (
  &lt;PipWrapper 
    open={isFloating} 
    onOpenChange={setIsFloating}
    placeholder={&lt;div&gt;Active in PiP&lt;/div&gt;}
  &gt;
    &lt;VideoPlayer /&gt;
  &lt;/PipWrapper&gt;
);</code></pre>

          <h3>&lt;PipTrigger&gt;</h3>
          <p>A button that toggles the window. Its label switches between <code>openLabel</code> and <code>closeLabel</code>. Inside a <code>&lt;PipWrapper&gt;</code> it controls that wrapper; use <code>asChild</code> to render your own element:</p>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>&lt;PipTrigger asChild&gt;
  &lt;button className="px-4 py-2 border rounded"&gt;Toggle Float&lt;/button&gt;
&lt;/PipTrigger&gt;</code></pre>
          <p>With <code>asChild</code>, put <code>onClick</code> on <code>&lt;PipTrigger&gt;</code>, not the child: the child's own <code>onClick</code> replaces the toggle.</p>
          <p><strong>Remote trigger.</strong> Give a wrapper an <code>id</code> and point a trigger anywhere in the app at it:</p>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>// In a navbar
&lt;PipTrigger pipId="main-player"&gt;Open player&lt;/PipTrigger&gt;

// Somewhere else
&lt;PipWrapper id="main-player"&gt;&lt;Player /&gt;&lt;/PipWrapper&gt;</code></pre>
          <table>
            <thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>pipId</code></td><td><code>string</code></td><td>—</td><td>Control the instance registered under this id instead of the nearest wrapper.</td></tr>
              <tr><td><code>asChild</code></td><td><code>boolean</code></td><td><code>false</code></td><td>Render the single child element instead of a <code>&lt;button&gt;</code>.</td></tr>
              <tr><td><code>openLabel</code> / <code>closeLabel</code></td><td><code>string</code></td><td><code>'↗ Pop out'</code> / <code>'⊠ Close'</code></td><td>Labels while closed / open.</td></tr>
              <tr><td><code>renderOpen</code> / <code>renderClose</code></td><td><code>ReactNode</code></td><td>—</td><td>Replace the labels. <code>children</code> win over every label prop.</td></tr>
              <tr><td><code>renderUnsupported</code></td><td><code>ReactNode</code></td><td><code>null</code></td><td>Rendered when the instance can't open anything.</td></tr>
              <tr><td><code>hideInPip</code></td><td><code>boolean</code></td><td><code>true</code></td><td>Hide the trigger while the window is open.</td></tr>
            </tbody>
          </table>
          <h4>What it renders</h4>
          <ul>
            <li>Server render and first client render: nothing.</li>
            <li><code>pipId</code> with no instance registered yet: a disabled button.</li>
            <li>The instance can't open anything: <code>renderUnsupported</code>.</li>
            <li>Otherwise: the button, with <code>aria-pressed</code>.</li>
          </ul>
          <p>A click that fails logs a <code>[PipTrigger]</code> warning unless the owner has <code>onError</code>. An open cancelled by <code>close()</code> is not logged.</p>

          <h3>Accessibility (Aria Compliance)</h3>
          <ul>
            <li><strong>Live Regions:</strong> Automatically manages a visually hidden <code>aria-live="polite"</code> region to announce screen-reader updates when portal transitions occur.</li>
            <li><strong>Trigger:</strong> <code>&lt;PipTrigger&gt;</code> sets <code>aria-pressed</code>. Its accessible name is its visible label, so pass <code>aria-label</code> for a name without the glyphs, and document shortcuts with <code>aria-keyshortcuts</code>.</li>
            <li><strong>Focus Redirection:</strong> Shifts viewport focus directly to the first interactive element inside the floating frame upon open, and redirects it back to the launch trigger button upon close.</li>
          </ul>
        `
      },
      {
        id: 'react-hooks',
        title: 'React Hooks',
        keywords: ['usepip', 'useispipsupported', 'usevideopip', 'useautopip', 'auto pip', 'hooks'],
        summary: 'Accessing the active Picture-in-Picture state inside React functional components.',
        content: `
          <p>Hook integrations let you query support values and read the active window context.</p>

          <h3>usePip(options?)</h3>
          <p>Owns a core instance and <strong>moves</strong> the element you point it at (no portal). Takes the same options as <code>createPip()</code>. With <code>id</code>, the instance is also registered for <code>getPip(id)</code> and <code>&lt;PipTrigger pipId&gt;</code>. It is destroyed on unmount and is Strict Mode safe.</p>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>const { contentRef, originRef, open, close, isOpen } = usePip({ width: 360, height: 240 });

return (
  &lt;div ref={originRef}&gt;
    &lt;div ref={contentRef}&gt;
      00:42
      {isOpen &amp;&amp; &lt;button onClick={close}&gt;Back to page&lt;/button&gt;}
    &lt;/div&gt;
    {!isOpen &amp;&amp; &lt;button onClick={() =&gt; open().catch(console.warn)}&gt;Pop out&lt;/button&gt;}
  &lt;/div&gt;
);</code></pre>
          <ul>
            <li><code>contentRef</code> / <code>originRef</code>: attach to the element that moves and the place it returns to.</li>
            <li><code>open()</code> / <code>toggle()</code>: promises. Call from a user gesture and always <code>.catch</code>; they reject when opening fails, including <code>ERR_OPEN_ABORTED</code> when <code>close()</code> runs first.</li>
            <li><code>close()</code>: synchronous.</li>
            <li><code>isOpen</code>, <code>isSupported</code>, <code>pipWindow</code>: live state. <code>pipWindow</code> is <code>null</code> while closed.</li>
          </ul>
          <p>React handlers (<code>onClick</code>, <code>onChange</code>…) work inside the window: <code>usePip()</code> bridges events from the PiP document back to React. Differences from the page:</p>
          <ul>
            <li>Bridged events carry <code>pipItUpBridged: true</code> on <code>e.nativeEvent</code>.</li>
            <li>The copy is dispatched in the main document, so page-level <strong>capture</strong> listeners on <code>window</code>/<code>document</code> see it too. A global capture <code>keydown</code> shortcut can fire twice; skip events with <code>pipItUpBridged</code> there.</li>
            <li>React handlers run after native listeners inside the content, and not at all if one stops propagation.</li>
            <li><code>onSelect</code> misses selection changes made only with the keyboard.</li>
          </ul>
          <p><code>&lt;PipWrapper&gt;</code> uses a portal instead and has none of these differences.</p>

          <h3>usePipContext()</h3>
          <p>Inside a <code>&lt;PipWrapper&gt;</code> or a hosted widget, returns <code>{ instance, state, isInsidePip }</code>: the core instance, <code>{ isOpen, isSupported, pipWindow }</code>, and <code>true</code> while this instance is open (with Document PiP the content renders in the PiP window). Throws outside a wrapper.</p>

          <h3>useIsPipSupported()</h3>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>const isSupported = useIsPipSupported();</code></pre>
          <p><code>true</code> when the <strong>browser</strong> has Document PiP or video PiP. It is <code>false</code> on the server and on the first client render. It does not say whether a given instance can open: for that, read <code>isSupported</code> from <code>usePip()</code> or <code>usePipContext().state</code>.</p>

          <h3>useVideoPip(videoRef)</h3>
          <p>Floats a single <code>&lt;video&gt;</code> with the browser's native video PiP. The video stays in your page. Returns <code>isActive</code> (stays correct when the user closes the overlay), <code>enter()</code> / <code>leave()</code> (reject when the browser refuses; <code>enter()</code> also rejects with no <code>&lt;video&gt;</code>), and <code>toggle()</code> (never rejects; logs a <code>[useVideoPip]</code> warning). For anything other than a single video, use <code>&lt;PipWrapper&gt;</code>.</p>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>import { useRef } from 'react';
import { useVideoPip } from '@pip-it-up/react';

function CustomVideo() {
  const videoRef = useRef(null);
  const { isActive, toggle } = useVideoPip(videoRef);

  return (
    &lt;div&gt;
      &lt;video ref={videoRef} src="movie.mp4" controls playsInline /&gt;
      &lt;button onClick={toggle}&gt;
        {isActive ? 'Close PiP' : 'Video PiP'}
      &lt;/button&gt;
    &lt;/div&gt;
  );
}</code></pre>

          <h3>useAutoPip(enter, options?)</h3>
          <p>
            Enters Picture-in-Picture automatically when the tab is hidden. Always on unless you pass
            <code>enabled: false</code>. <code>enter</code> is read through a ref, so passing a fresh inline
            arrow every render never detaches the listener.
          </p>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>import { useVideoPip, useAutoPip } from '@pip-it-up/react';

function Player() {
  const videoRef = useRef(null);
  const { enter } = useVideoPip(videoRef);

  useAutoPip(enter, {
    when: () =&gt; !videoRef.current?.paused,
    onResult: (r) =&gt; !r.ok &amp;&amp; console.warn(r.error),
  });

  return &lt;video ref={videoRef} src="movie.mp4" controls playsInline /&gt;;
}</code></pre>
          <p>
            It accepts every <code>createAutoPip</code> option plus <code>enabled</code>. See
            <strong>Automatic PiP</strong> in the Core API for why an attempt can be refused and what
            <code>onResult</code> reports.
          </p>
        `
      },
      {
        id: 'route-persistent',
        title: 'Route-Persistent PiP',
        keywords: ['pipprovider', 'pipanchor', 'route persistent', 'navigation', 'teleport', 'zero remount', 'garage', 'layout shift', 'cls'],
        summary: 'Keep a PiP window alive across route changes with PipProvider and PipAnchor — zero unmounts, zero layout shift.',
        content: `
          <p>
            A component that lives inside a route unmounts when you navigate away, taking its PiP window with
            it. <code>&lt;PipProvider&gt;</code> solves that by hosting the content <em>above</em> the router and
            letting each route dock it through a <code>&lt;PipAnchor&gt;</code>. The DOM node is moved between
            anchors, never recreated.
          </p>

          <pre class="code-block font-mono text-xs p-4 mb-6"><code>import { PipProvider, PipAnchor } from '@pip-it-up/react';

function App() {
  return (
    &lt;PipProvider registry={{ player: &lt;VideoPlayer /&gt; }}&gt;
      &lt;Routes /&gt;
    &lt;/PipProvider&gt;
  );
}

// any route
function Dashboard() {
  return &lt;PipAnchor id="player" className="w-full aspect-video" /&gt;;
}</code></pre>

          <h3>How it works</h3>
          <ul>
            <li>Each registry id gets one <strong>immortal portal container</strong> ("shuttle"), created once.</li>
            <li>A mounted <code>PipAnchor</code> claims the id and the shuttle is moved into it.</li>
            <li>With no anchor mounted, the shuttle parks in a hidden <strong>garage</strong> — still connected to the document, so media keeps playing and state survives.</li>
            <li>Moves use the native <code>moveBefore()</code> API where available, which relocates a node <em>without</em> running disconnect/reconnect callbacks. It falls back to <code>appendChild</code> otherwise.</li>
          </ul>

          <h3>PipProvider props</h3>
          <table>
            <thead><tr><th>Prop</th><th>Type</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>registry</code></td><td><code>Record&lt;string, ReactNode&gt;</code></td><td>Persistent subtrees keyed by id. Each is rendered exactly once.</td></tr>
              <tr><td><code>options</code></td><td><code>Record&lt;string, PipOptions&gt;</code></td><td>Per-id core options. <code>mode</code> and <code>id</code> are forced.</td></tr>
              <tr><td><code>gcGraceMs</code></td><td><code>number</code></td><td>Eviction lease for an orphaned id. Default <code>30000</code>.</td></tr>
              <tr><td><code>dormantMedia</code></td><td><code>'pause' | 'keep'</code></td><td><code>'pause'</code> (default) pauses garage-parked media.</td></tr>
            </tbody>
          </table>

          <h3>PipAnchor props</h3>
          <table>
            <thead><tr><th>Prop</th><th>Type</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code>id</code></td><td><code>string</code></td><td>Must be a key of the provider's <code>registry</code>.</td></tr>
              <tr><td><code>reserve</code></td><td><code>'size' | 'ratio' | 'none'</code></td><td><code>'size'</code> (default) freezes the measured box while the content is away. <code>'ratio'</code> freezes <code>aspect-ratio</code>.</td></tr>
              <tr><td><code>axis</code></td><td><code>'block' | 'inline' | 'both'</code></td><td>Which axis to freeze. Default <code>'block'</code>.</td></tr>
              <tr><td><code>handoffMs</code></td><td><code>number</code></td><td>Restore-animation duration. Default <code>200</code>.</td></tr>
              <tr><td><code>placeholder</code></td><td><code>ReactNode</code></td><td>Rendered while the content is elsewhere, positioned <code>absolute; inset: 0</code>.</td></tr>
              <tr><td><code>as</code></td><td><code>ElementType</code></td><td>Element type for the anchor box. Must generate a real box. Default <code>'div'</code>.</td></tr>
            </tbody>
          </table>

          <div class="alert alert-info">
            <strong>Zero layout shift.</strong> An anchor mounting for a popped-out or parked id carries its
            size reservation in the <em>first painted frame</em>, not applied by a later effect — so nothing
            jumps. The restore animation is skipped automatically under
            <code>prefers-reduced-motion: reduce</code> and when the movement is under 1px.
          </div>

          <div class="alert alert-info">
            <strong>SSR-safe.</strong> On the server the provider renders only its <code>children</code> and anchors render their box and placeholder. Widgets attach after hydration, so there is no mismatch. Document PiP is browser-only, so mark components that use it <code>"use client"</code>.
          </div>

          <h3>The three placements</h3>
          <table>
            <thead><tr><th>Placement</th><th>When</th><th>Visible</th></tr></thead>
            <tbody>
              <tr><td><code>anchor</code></td><td>a <code>&lt;PipAnchor&gt;</code> for its id is on the current route</td><td>yes, inline</td></tr>
              <tr><td><code>pip</code></td><td>its PiP window is open</td><td>yes, in the window</td></tr>
              <tr><td><code>garage</code></td><td>no anchor on this route and no window</td><td><strong>no</strong>, but still alive</td></tr>
            </tbody>
          </table>
          <p>A hosted widget can use <code>&lt;PipTrigger&gt;</code> (no <code>pipId</code> needed) and <code>usePipContext()</code> inside itself.</p>

          <h3>Removing a widget</h3>
          <p>Routes never destroy a hosted widget. To remove one, delete its id from <code>registry</code>:</p>
          <ul>
            <li>The widget unmounts at once and loses its React state, even if you add the id back within <code>gcGraceMs</code>.</li>
            <li>After <code>gcGraceMs</code>, if no anchor claims the id and no window is open, the PiP instance and its container are destroyed. Adding the id later builds a fresh widget.</li>
            <li>Keep the <code>registry</code> object stable (outside render or <code>useMemo</code>), or every provider render re-renders all widgets.</li>
          </ul>

          <h3>Several anchors for one id</h3>
          <p>Several routes may each render an anchor for the same id; navigating between them moves the widget with no unmount. If two are mounted at once, the newest wins and dev builds warn <code>ERR_DUPLICATE_ANCHOR</code>.</p>

          <div class="alert alert-warning">
            <strong><code>&lt;PipAnchor&gt;</code> needs a real layout box.</strong> It sets <code>position: relative; display: block</code>. Don't override that with <code>display: contents</code> or <code>position: static</code> (dev builds warn).
          </div>

          <div class="alert alert-warning">
            <strong>The garage is not a security boundary.</strong> Parked widgets live in a hidden <code>[data-pip-garage]</code> container on <code>document.body</code>. Parked content is marked
            <code>inert</code> and <code>aria-hidden</code>, and skipped for layout and paint via
            <code>content-visibility: hidden</code>. But parked scripts keep running and parked DOM stays
            queryable by any same-page script. Never host untrusted content in a registry subtree.
          </div>
        `
      },
      {
        id: 'dormancy-hooks',
        title: 'Dormancy Hooks',
        keywords: ['usedormancy', 'useactiveeffect', 'userevealeffect', 'useadaptiveinterval', 'throttle', 'background', 'frozen', 'activity level'],
        summary: 'Throttle work in hosted subtrees when they are backgrounded, parked or frozen.',
        content: `
          <p>
            Content hosted by a <code>PipProvider</code> never unmounts, so a naive
            <code>setInterval</code> keeps polling forever — even while parked in the garage. The dormancy
            hooks let a subtree scale its own work to how visible it actually is.
          </p>

          <h3>Activity levels</h3>
          <p>Derived from placement, host visibility and the global freeze flag:</p>
          <table>
            <thead><tr><th>Level</th><th>Meaning</th></tr></thead>
            <tbody>
              <tr><td><code>active</code></td><td>Docked in a visible anchor, or in an open, visible PiP window.</td></tr>
              <tr><td><code>background</code></td><td>Rendered, but its host document is hidden.</td></tr>
              <tr><td><code>dormant</code></td><td>Parked in the garage.</td></tr>
              <tr><td><code>frozen</code></td><td>Explicitly frozen. <code>useAdaptiveInterval</code> registers <strong>zero</strong> timers here.</td></tr>
            </tbody>
          </table>

          <p>Dormancy hooks only work inside a <code>registry</code> widget; elsewhere they throw <code>ERR_NO_HOST</code>. Default <code>useAdaptiveInterval</code> periods: <code>active</code> 1 s, <code>background</code> 15 s, <code>dormant</code> 60 s, <code>frozen</code> no timer. Periods below 250 ms are raised to 250 ms (use <code>requestAnimationFrame</code> for faster). A new inline callback each render does not restart the timer.</p>

          <h3>useDormancy()</h3>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>const { level, placement, isOpen, visible, revealCount } = useDormancy();</code></pre>
          <p>The snapshot is referentially stable and frozen — safe to read every render.</p>

          <h3>useActiveEffect(effect, deps)</h3>
          <p>Runs the effect only while the level is <code>active</code>, and tears it down otherwise.</p>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>useActiveEffect(() =&gt; {
  const socket = connect();
  return () =&gt; socket.close();
}, [url]);</code></pre>

          <h3>useRevealEffect(effect)</h3>
          <p>Runs each time the subtree transitions <em>into</em> a rendered placement — the moment to refetch anything that went stale while parked.</p>

          <h3>useAdaptiveInterval(callback, periods?)</h3>
          <p>An interval whose period follows the activity level. Pass <code>null</code> for a level to disable it entirely.</p>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>useAdaptiveInterval(refresh, {
  active: 1000,
  background: 15000,
  dormant: 60000,
  frozen: null,
});</code></pre>
        `
      },
      {
        id: 'react-gotchas',
        title: 'React Gotchas',
        keywords: ['css inheritance', 'theme', 'dark', 'tiptap', 'updateRoot', 'prosemirror', 'iframe', 'cached document', 'key remount'],
        summary: 'Styling inheritance, editors that cache the document, and iframes.',
        content: `
          <h3>CSS inheritance</h3>
          <p>The PiP window is a separate document. Stylesheets and <code>&lt;html&gt;</code>/<code>&lt;body&gt;</code> classes are copied, but your content does not inherit styles from ancestors outside the wrapper (a <code>#root</code> div, a theme provider). Put theme or alignment classes (<code>dark</code>, <code>text-center</code>) on the content itself.</p>
          <h3>Editors and maps that cache <code>document</code></h3>
          <p>Monaco needs nothing: it reads the document live. TipTap / ProseMirror caches its root, so call <code>updateRoot()</code> whenever the window changes:</p>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>const { state } = usePipContext();

useEffect(() =&gt; {
  editor?.view.updateRoot();
}, [editor, state.pipWindow]);</code></pre>
          <p><code>state.pipWindow</code> changes once per open and once per close, exactly when a cached reference goes stale. Remounting with a <code>key</code> also works but throws away undo history, scroll, selection and IME input; use it only when the library has no refresh, and lift the state you need into a parent, a store or the URL first.</p>
          <h3>Iframes</h3>
          <p>Cross-origin embeds (YouTube, Vimeo, Maps) don't work in the window: moving an <code>&lt;iframe&gt;</code> reloads it and the service rejects the new origin. Use a <code>&lt;video&gt;</code> with a direct source instead.</p>
        `
      },
      {
        id: 'react-errors',
        title: 'React Errors',
        keywords: ['ERR_NO_PROVIDER', 'ERR_NO_HOST', 'ERR_UNKNOWN_ID', 'ERR_DUPLICATE_ANCHOR', 'ERR_SHUTTLE_MOVE_FAILED', 'error codes', 'diagnostics'],
        summary: 'Error and warning codes raised by PipProvider, PipAnchor and the dormancy hooks.',
        content: `
          <p>React errors and warnings carry a <code>code</code>. Messages start with <code>[pip-it-up] &lt;code&gt;:</code>.</p>
          <table>
            <thead><tr><th>Code</th><th>When</th><th>Effect</th></tr></thead>
            <tbody>
              <tr><td><code>ERR_NO_PROVIDER</code></td><td><code>&lt;PipAnchor&gt;</code> rendered outside <code>&lt;PipProvider&gt;</code></td><td>Throws</td></tr>
              <tr><td><code>ERR_NO_HOST</code></td><td>A dormancy hook called outside a <code>registry</code> widget</td><td>Throws</td></tr>
              <tr><td><code>ERR_UNKNOWN_ID</code></td><td><code>&lt;PipAnchor id&gt;</code> is not a key of <code>registry</code></td><td>Throws in dev, warns in production</td></tr>
              <tr><td><code>ERR_DUPLICATE_ANCHOR</code></td><td>Two anchors for one id mounted at once</td><td>Warns in dev only; the newest wins</td></tr>
              <tr><td><code>ERR_SHUTTLE_MOVE_FAILED</code></td><td>Moving content into the garage, an anchor, the origin or the PiP window failed with both <code>moveBefore</code> and <code>appendChild</code></td><td>Throws</td></tr>
            </tbody>
          </table>
          <p><code>open()</code>/<code>toggle()</code> rejections (<code>ERR_OPEN_ABORTED</code>, <code>ERR_WINDOW_CLOSED</code>, <code>ERR_INVALID_FALLBACK</code>, browser errors like <code>NotAllowedError</code>) come from core: see Errors &amp; Rejections.</p>
        `
      },
    ]
  },
  {
    id: 'recipes',
    title: 'Integration Recipes',
    sections: [
      {
        id: 'tailwind-recipe',
        title: 'Tailwind CSS Integration',
        keywords: ['tailwind', 'css styles', 'copystyles', 'dark mode', 'sync style'],
        summary: 'How to propagate Tailwind styles and dark mode classes into Picture-in-Picture windows.',
        content: `
          <p>
            When a new PiP window opens, <code>pip-it-up</code> copies your main document's style nodes. 
            If you use Tailwind CSS, those styles automatically carry over.
          </p>

          <h3>Recommended Options</h3>
          <p>Ensure <code>copyStyles</code> is set to <code>"sync"</code>. This uses a <code>MutationObserver</code> to watch changes in the head:</p>

          <pre class="code-block font-mono text-xs p-4 mb-6"><code>&lt;PipWrapper copyStyles="sync"&gt;
  &lt;div className="p-4 bg-indigo-600 text-white rounded-lg shadow-xl"&gt;
    &lt;p className="font-bold"&gt;Tailwind Tailwind!&lt;/p&gt;
  &lt;/div&gt;
&lt;/PipWrapper&gt;</code></pre>

          <h3>Dark Mode and Global Classes</h3>
          <p>
            Tailwind themes depending on element classes applied high up (like <code>&lt;html class="dark"&gt;</code> or <code>&lt;body class="theme-forest"&gt;</code>) 
            won't automatically apply inside the new PiP document because it has a separate root.
          </p>
          <p>To fix this, sync opener document classes using the <code>onPipWindowReady</code> callback:</p>

          <pre class="code-block font-mono text-xs p-4 mb-6"><code>&lt;PipWrapper
  onPipWindowReady={(pipWindow) => {
    // Mirror dark mode classes
    const classes = document.documentElement.className;
    pipWindow.document.documentElement.className = classes;
  }}
&gt;
  {/* Content */}
&lt;/PipWrapper&gt;</code></pre>
        `
      },
      {
        id: 'monaco-recipe',
        title: 'Monaco Editor Integration',
        keywords: ['monaco', 'editor layout', 'onpipwindowready', 'resize'],
        summary: 'Preventing Monaco Editor from rendering blank or misaligned inside Picture-in-Picture windows.',
        content: `
          <p>
            Monaco Editor calculates its coordinates and rendering dimensions dynamically based on container DOM bounds. 
            When portaled to a new window, its parent container size shifts, which can render Monaco blank.
          </p>

          <h3>Handling Layout Recalculation</h3>
          <p>You must trigger <code>editor.layout()</code> inside <code>onPipWindowReady</code>. Here is the clean integration pattern:</p>

          <pre class="code-block font-mono text-xs p-4 mb-6"><code>import { useState } from 'react';
import Editor from '@monaco-editor/react';
import { PipWrapper, PipTrigger } from '@pip-it-up/react';

export default function MonacoDemo() {
  const [editor, setEditor] = useState(null);

  return (
    &lt;PipWrapper
      onPipWindowReady={() => {
        // Recalculate Monaco layouts after window mounts
        if (editor) {
          editor.layout();
        }
      }}
    &gt;
      &lt;div className="h-96 flex flex-col"&gt;
        &lt;Editor
          height="100%"
          defaultLanguage="javascript"
          onMount={(instance) => setEditor(instance)}
        /&gt;
        &lt;PipTrigger&gt;
          &lt;button&gt;Pop out code&lt;/button&gt;
        &lt;/PipTrigger&gt;
      &lt;/div&gt;
    &lt;/PipWrapper&gt;
  );
}</code></pre>
        `
      },
      {
        id: 'tiptap-recipe',
        title: 'Tiptap Rich Text Editor',
        keywords: ['tiptap', 'rich text', 'prosemirror', 'events', 'refocus'],
        summary: 'Relocating Tiptap and ProseMirror nodes without losing edit state.',
        content: `
          <p>
            Tiptap builds on top of ProseMirror. While ProseMirror is robust to DOM relocation, 
            focus state and synthetic key events can get lost in transition.
          </p>

          <h3>React Portals and Focus Management</h3>
          <p>
            Using <code>mode="portal"</code> is recommended for Tiptap since React portals preserve synthetic events. 
            However, ensure you refocus the cursor input using the <code>onPipWindowReady</code> handler:
          </p>

          <pre class="code-block font-mono text-xs p-4 mb-6"><code>import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { PipWrapper } from '@pip-it-up/react';

export default function TiptapDemo() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '&lt;p&gt;Start writing...&lt;/p&gt;',
  });

  return (
    &lt;PipWrapper
      onPipWindowReady={() => {
        if (editor && !editor.isFocused) {
          editor.commands.focus();
        }
      }}
    &gt;
      &lt;div className="tiptap-container"&gt;
        &lt;EditorContent editor={editor} /&gt;
      &lt;/div&gt;
    &lt;/PipWrapper&gt;
  );
}</code></pre>
        `
      },
      {
        id: 'nextjs-recipe',
        title: 'Next.js & SSR Hydration',
        keywords: ['nextjs', 'ssr', 'hydration mismatch', 'use client', 'useeffect'],
        summary: 'Configuring client-only gates to run pip-it-up safely inside SSR frameworks.',
        content: `
          <p>
            The Document Picture-in-Picture API is a browser-only window extension. 
            Attempting to load or reference it during Server-Side Rendering (SSR) will throw <code>ReferenceError: documentPictureInPicture is not defined</code>.
          </p>

          <h3>Using Client-Only Hydration Guard</h3>
          <p>1. Always add the <code>"use client"</code> directive at the top of files using <code>@pip-it-up/react</code>.</p>
          <p>2. Wrap triggers in a mount state hook to bypass hydration mismatch cycles:</p>

          <pre class="code-block font-mono text-xs p-4 mb-6"><code>"use client"

import { useEffect, useState } from 'react';
import { useIsPipSupported } from '@pip-it-up/react';

export default function ClientOnlyButton() {
  const [mounted, setMounted] = useState(false);
  const isSupported = useIsPipSupported();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  return (
    &lt;div&gt;
      {isSupported ? (
        &lt;button&gt;PiP Available&lt;/button&gt;
      ) : (
        &lt;span&gt;PiP Unsupported&lt;/span&gt;
      )}
    &lt;/div&gt;
  );
}</code></pre>
        `
      },
      {
        id: 'fallbacks-recipe',
        title: 'Unsupported Fallbacks & Sync',
        keywords: ['fallback url', 'safari', 'firefox', 'broadcastchannel', 'crosstab', 'state sync'],
        summary: 'Synchronizing interactive states across browser tabs when Document PiP is unsupported.',
        content: `
          <p>
            Browsers like Safari (macOS/iOS) and Firefox do not support the Document Picture-in-Picture API natively.
            <code>pip-it-up</code> falls back to opening a secondary popup window via <code>window.open()</code>.
          </p>

          <h3>Cross-Tab State Syncing</h3>
          <p>
            Because a popup tab runs in a distinct JavaScript context and React reconciler tree, you cannot portal elements directly.
            Instead, use the browser's native <strong>BroadcastChannel API</strong> to synchronize state across windows:
          </p>

          <pre class="code-block font-mono text-xs p-4 mb-6"><code>// In the opener page:
const channel = new BroadcastChannel('notepad_sync');

// Send state when textarea edits occur
const handleEdit = (text) => {
  channel.postMessage({ type: 'UPDATE_TEXT', text });
};

// In the fallback subpage (/widgets/notepad-fallback):
useEffect(() => {
  const channel = new BroadcastChannel('notepad_sync');
  
  channel.onmessage = (event) => {
    if (event.data.type === 'UPDATE_TEXT') {
      setText(event.data.text);
    }
  };
  
  return () => channel.close();
}, []);</code></pre>
        `
      },
      {
        id: 'chrome-extension-postmortem',
        title: 'Chrome Extension Guide',
        keywords: ['chrome extension', 'sandboxed frame', 'async gesture', 'content security policy', 'isolated worlds', 'postmortem'],
        summary: 'Deep-dive into building Chrome Extensions using the Document PiP API.',
        content: `
          <p>
            Integrating Document PiP inside Chrome extensions presents unique challenges. 
            Below is a technical post-mortem detailing how to work around extension constraints.
          </p>

          <h3>1. Popup & Side Panel Constraints</h3>
          <p>
            Chrome blocks <code>documentPictureInPicture.requestWindow()</code> inside <code>chrome.sidePanel</code> and toolbar extension popups.
            Attempting this will throw <code>SecurityError: Disallowed in this context</code>.
          </p>
          <div class="alert alert-warning">
            <strong>Solution:</strong> Inject your UI directly into the active tab as a sidebar slider panel using content scripts. Since the sidebar becomes part of the web document, standard PiP APIs are allowed.
          </div>

          <h3>2. Asynchronous User Gesture Expiration</h3>
          <p>
            Opening a PiP window requires a direct, synchronous user click. If you click a button in your extension popup, send a message to a content script, and then call open: 
            the message pass is asynchronous, which expires the click gesture token, and the browser blocks the window.
          </p>
          <p>
            <strong>Solution:</strong> The webpage-injected sidebar drawer handles user clicks synchronously.
            Mounting the <code>&lt;PipWrapper&gt;</code> trigger directly in the content script drawer keeps the gesture token active.
          </p>

          <h3>3. Style Sheet Losses Across Isolated Worlds</h3>
          <p>
            Chrome executes content scripts inside an <em>isolated world</em>. Stylesheet additions made via <code>chrome.scripting.insertCSS</code> do not appear in <code>document.styleSheets</code>, 
            which causes the opened PiP window to lose its styling.
          </p>
          <p>
            <strong>Solution:</strong> Add a <code>useEffect</code> inside your editor component that detects the PiP window mounting, gets the stylesheet URL via <code>chrome.runtime.getURL('style.css')</code>, 
            and appends it directly to the PiP document head:
          </p>

          <pre class="code-block font-mono text-xs p-4 mb-6"><code>useEffect(() => {
  if (isInsidePip) {
    const pipWin = window.documentPictureInPicture.window;
    const link = pipWin.document.createElement('link');
    link.rel = 'stylesheet';
    link.href = chrome.runtime.getURL('content.css');
    pipWin.document.head.appendChild(link);
  }
}, [isInsidePip]);</code></pre>
        `
      }
    ]
  }
];
