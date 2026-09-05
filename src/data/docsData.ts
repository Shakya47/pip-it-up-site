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
        keywords: ['pip', 'document picture-in-picture', 'floating window', 'dom moving', 'features', 'browser support', 'route persistent', 'zero remount', 'auto pip'],
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
  pip.open({ contentEl, originEl });
});</code></pre>
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
          <table>
            <thead>
              <tr>
                <th>Option</th>
                <th>Type</th>
                <th>Default</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><code>mode</code></td>
                <td><code>'move' | 'clone' | 'portal'</code></td>
                <td><code>'move'</code></td>
                <td>Strategical relocation. <code>'move'</code> physically detaches elements. <code>'portal'</code> is optimized for framework hooks.</td>
              </tr>
              <tr>
                <td><code>copyStyles</code></td>
                <td><code>'sync' | 'once' | false</code></td>
                <td><code>'sync'</code></td>
                <td>Clones style blocks. <code>'sync'</code> uses a <code>MutationObserver</code> to replicate HMR or CSS-in-JS styles live.</td>
              </tr>
              <tr>
                <td><code>fallback</code></td>
                <td><code>'new-tab' | 'none'</code></td>
                <td><code>'new-tab'</code></td>
                <td>Behavior when PiP is unsupported. <code>'new-tab'</code> loads <code>fallbackUrl</code> in a popup window.</td>
              </tr>
              <tr>
                <td><code>fallbackUrl</code></td>
                <td><code>string</code></td>
                <td><code>undefined</code></td>
                <td>Target path for fallback browser window. Mandatory if <code>fallback</code> is set to <code>'new-tab'</code>.</td>
              </tr>
              <tr>
                <td><code>reserveSpace</code></td>
                <td><code>boolean</code></td>
                <td><code>true</code></td>
                <td>Maintains placeholder box in parent layout to prevent surrounding element shifting.</td>
              </tr>
              <tr>
                <td><code>forwardKeyboardEvents</code></td>
                <td><code>boolean</code></td>
                <td><code>true</code></td>
                <td>Bridges <code>keydown</code> and <code>keyup</code> events back to main opener window so global shortcuts keep executing.</td>
              </tr>
              <tr>
                <td><code>restoreFocus</code></td>
                <td><code>boolean</code></td>
                <td><code>true</code></td>
                <td>Restores active focus state and selected ranges when returning elements back to the host document.</td>
              </tr>
            </tbody>
          </table>

          <h3>Lifecycle Events</h3>
          <ul>
            <li><code>onBeforeOpen</code>: Executed before request window resolves. Return <code>false</code> to intercept and cancel window open.</li>
            <li><code>onOpen</code>: Fired instantly when browser PiP window opens, passing raw <code>Window</code> handles.</li>
            <li><code>onPipWindowReady</code>: Fired after the first paint cycle inside the newly provisioned window completes.</li>
            <li><code>onClose</code>: Triggered on window close.</li>
          </ul>
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
  getPip('main-player')?.toggle();
});</code></pre>

          <h3>Practical Implementations</h3>
          
          <h4>1. Global Keyboard Shortcuts</h4>
          <p>Bind key codes on your opener page to trigger remote float/restore:</p>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>window.addEventListener('keydown', (e) => {
  if (e.altKey && e.key.toLowerCase() === 'p') {
    getPip('main-player')?.toggle();
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
          <p>Toggles parent state context. Supplying <code>asChild</code> allows wrapping custom buttons:</p>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>&lt;PipTrigger asChild&gt;
  &lt;button className="px-4 py-2 border rounded"&gt;Toggle Float&lt;/button&gt;
&lt;/PipTrigger&gt;</code></pre>

          <h3>Accessibility (Aria Compliance)</h3>
          <ul>
            <li><strong>Live Regions:</strong> Automatically manages a visually hidden <code>aria-live="polite"</code> region to announce screen-reader updates when portal transitions occur.</li>
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

          <h3>usePip()</h3>
          <p>Returns details about the local wrapped scope:</p>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>const { isOpen, pipWindow, instance, isInsidePip } = usePip();</code></pre>
          <ul>
            <li><code>isOpen</code>: Active open state.</li>
            <li><code>isInsidePip</code>: Returns <code>true</code> only inside components rendered inside the floating window viewport, making responsive layouts simple.</li>
            <li><code>pipWindow</code>: Native <code>Window</code> handle.</li>
          </ul>

          <h3>useIsPipSupported()</h3>
          <pre class="code-block font-mono text-xs p-4 mb-6"><code>const isSupported = useIsPipSupported();</code></pre>
          <p>Checks if Document PiP or classic Video PiP is available inside the user's browser.</p>

          <h3>useVideoPip(videoRef)</h3>
          <p>Enables classic Video PiP explicitly for custom video elements on Safari/iOS:</p>
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

          <div class="alert alert-warning">
            <strong>The garage is not a security boundary.</strong> Parked content is marked
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
