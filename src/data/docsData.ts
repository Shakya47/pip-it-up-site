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
        keywords: ['pip', 'document picture-in-picture', 'floating window', 'dom moving', 'features', 'browser support'],
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
            <a href="https://www.npmjs.com/package/@pip-it-up/core" target="_blank" rel="noopener" class="text-[var(--color-accent-light)] hover:underline font-mono">@pip-it-up/core</a> and 
            <a href="https://www.npmjs.com/package/@pip-it-up/react" target="_blank" rel="noopener" class="text-[var(--color-accent-light)] hover:underline font-mono">@pip-it-up/react</a>). 
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
      }
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
      }
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

          <h3>&lt;PipWrapper&gt;</h3>
          <p>Props include all standard core options along with specific React attributes:</p>
          <ul>
            <li><code>open</code>: Controlled state boolean. Pair with <code>onOpenChange</code>.</li>
            <li><code>placeholder</code>: A React Node rendered inline in the layout while children reside inside the PiP portal.</li>
            <li><code>centerInPip</code>: Flex centering utility styles inside the PiP body.</li>
          </ul>

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
        keywords: ['usepip', 'useispipsupported', 'usevideopip', 'hooks'],
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
        `
      }
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
