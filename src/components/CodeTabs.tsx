import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';

const frameworks = [
  {
    name: 'React',
    active: true,
    language: 'tsx',
    code: `import { PipWrapper, PipTrigger } from '@pip-it-up/react';

export function App() {
  return (
    <PipWrapper copyStyles="sync">
      <PipTrigger />
      <MyEditor />
    </PipWrapper>
  );
}`,
  },
  {
    name: 'Vue',
    active: false,
    language: 'vue',
    code: `<!-- Coming soon -->
<template>
  <PipWrapper>
    <PipTrigger />
    <MyEditor />
  </PipWrapper>
</template>`,
  },
  {
    name: 'Angular',
    active: false,
    language: 'typescript',
    code: `// Coming soon
@Component({
  template: \`
    <pip-wrapper>
      <pip-trigger />
      <my-editor />
    </pip-wrapper>
  \`
})
export class AppComponent {}`,
  },
  {
    name: 'Svelte',
    active: false,
    language: 'svelte',
    code: `<!-- Coming soon -->
<script>
  import { PipWrapper, PipTrigger } from '@pip-it-up/svelte';
</script>
 
<PipWrapper>
  <PipTrigger />
  <MyEditor />
</PipWrapper>`,
  },
  {
    name: 'Vanilla JS',
    active: true,
    language: 'typescript',
    code: `import { createPip } from '@pip-it-up/core';

const pip = createPip(
  document.getElementById('my-editor'),
  document.getElementById('origin-anchor'),
  {
    copyStyles: 'sync',
    forwardKeyboardEvents: true,
    onPipWindowReady: (pipWindow) => {
      console.log('PiP ready!', pipWindow);
    },
  }
);

document.getElementById('pip-btn')
  .addEventListener('click', () => pip.toggle());`,
  },
];

/* ─── Token types for syntax highlighting ─── */
type TokenType = 'keyword' | 'string' | 'comment' | 'tag' | 'attr' | 'number' | 'plain';

interface Token {
  type: TokenType;
  text: string;
}

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < code.length) {
    // Comments: // or <!-- -->
    if (code[i] === '/' && code[i + 1] === '/') {
      const end = code.indexOf('\n', i);
      const commentEnd = end === -1 ? code.length : end;
      tokens.push({ type: 'comment', text: code.slice(i, commentEnd) });
      i = commentEnd;
      continue;
    }

    if (code.slice(i, i + 4) === '<!--') {
      const end = code.indexOf('-->', i);
      const commentEnd = end === -1 ? code.length : end + 3;
      tokens.push({ type: 'comment', text: code.slice(i, commentEnd) });
      i = commentEnd;
      continue;
    }

    // Strings
    if (code[i] === '"' || code[i] === "'" || code[i] === '`') {
      const quote = code[i];
      let j = i + 1;
      while (j < code.length && code[j] !== quote) {
        if (code[j] === '\\') j++; // skip escaped chars
        j++;
      }
      j++; // include closing quote
      tokens.push({ type: 'string', text: code.slice(i, j) });
      i = j;
      continue;
    }

    // Numbers
    if (/\d/.test(code[i]) && (i === 0 || /[\s=({,:]/.test(code[i - 1]))) {
      let j = i;
      while (j < code.length && /\d/.test(code[j])) j++;
      tokens.push({ type: 'number', text: code.slice(i, j) });
      i = j;
      continue;
    }

    // JSX/HTML tags: < followed by word chars or /
    if (code[i] === '<' && /[a-zA-Z/]/.test(code[i + 1] || '')) {
      // Check if it's a closing or opening tag name
      let j = i + 1;
      if (code[j] === '/') j++;
      const nameStart = j;
      while (j < code.length && /[a-zA-Z0-9.-]/.test(code[j])) j++;
      if (j > nameStart) {
        tokens.push({ type: 'plain', text: code.slice(i, i + (code[i + 1] === '/' ? 2 : 1)) }); // < or </
        tokens.push({ type: 'tag', text: code.slice(code[i + 1] === '/' ? i + 2 : i + 1, j) });
        i = j;
        continue;
      }
    }

    // Keywords
    const keywordMatch = code.slice(i).match(
      /^(import|export|from|function|const|let|var|return|if|else|new|class|extends|true|false|null|undefined|typeof|document|template|script|Component)\b/
    );
    if (keywordMatch && (i === 0 || /[\s;({,<>]/.test(code[i - 1]))) {
      tokens.push({ type: 'keyword', text: keywordMatch[0] });
      i += keywordMatch[0].length;
      continue;
    }

    // Attribute names (word followed by =)
    if (/[a-zA-Z]/.test(code[i])) {
      let j = i;
      while (j < code.length && /[a-zA-Z0-9_:@[\].-]/.test(code[j])) j++;
      if (code[j] === '=' && j > i) {
        tokens.push({ type: 'attr', text: code.slice(i, j) });
        i = j;
        continue;
      }
      // Plain word
      tokens.push({ type: 'plain', text: code.slice(i, j) });
      i = j;
      continue;
    }

    // Everything else
    tokens.push({ type: 'plain', text: code[i] });
    i++;
  }

  return tokens;
}

function HighlightedCode({ code }: { code: string }) {
  const lines = code.split('\n');

  return (
    <>
      {lines.map((line, lineIdx) => (
        <div key={lineIdx} className="leading-relaxed">
          {line === '' ? '\n' : (
            tokenize(line).map((token, tokenIdx) => (
              <span key={tokenIdx} className={`token-${token.type}`}>
                {token.text}
              </span>
            ))
          )}
        </div>
      ))}
    </>
  );
}

export default function CodeTabs() {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);
  const active = frameworks[activeTab];

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(active.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [active.code]);

  return (
    <section id="code-snippets" className="relative py-24 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl sm:text-5xl font-handwritten font-extrabold mb-4 text-[var(--color-text)]">
            Dead simple integration
          </h2>
          <p className="text-base font-typewriter text-[var(--color-text-muted)] max-w-xl mx-auto">
            Wrap your component, code lines, a trigger — you're done.
          </p>
        </div>

        {/* Tab row (Notebook Divider Tabs) */}
        <div className="flex items-end gap-1.5 px-4 overflow-x-auto relative z-10 -mb-[2px] font-handwritten">
          {frameworks.map((fw, i) => (
            <button
              key={fw.name}
              type="button"
              onClick={() => { if (fw.active) { setActiveTab(i); setCopied(false); } }}
              className={`relative px-4 py-2 text-lg font-bold border-t-2 border-x-2 border-[var(--color-border)] rounded-t-md transition-all cursor-pointer ${
                i === activeTab
                  ? 'bg-white text-[var(--color-text)] translate-y-[2px] pb-3 shadow-none z-20'
                  : fw.active
                  ? 'bg-slate-200/80 hover:bg-slate-100/90 text-[var(--color-text-muted)] hover:text-[var(--color-text)]'
                  : 'bg-slate-200/40 text-[var(--color-text-dim)] opacity-60 cursor-not-allowed'
              }`}
            >
              {fw.name}
              {!fw.active && (
                <span className="ml-1.5 text-[10px] px-1 py-0.5 rounded bg-slate-300 text-slate-600 font-bold font-sans">
                  soon
                </span>
              )}
            </button>
          ))}

          {/* Copy button */}
          <button
            type="button"
            onClick={handleCopy}
            className="ml-auto mr-1 mb-2 p-1.5 rounded border border-[var(--color-border)] hover:bg-white text-[var(--color-text)] shadow-sm bg-slate-100 transition-colors cursor-pointer"
            title="Copy code"
          >
            {copied ? <Check size={14} className="text-[var(--color-emerald)]" /> : <Copy size={14} />}
          </button>
        </div>

        {/* Code printout (Dot-matrix continuous feed paper) */}
        <div className="dot-matrix-paper border-2 border-[var(--color-border)] px-8 sm:px-12 py-8 overflow-x-auto shadow-md">
          <div className="text-[var(--color-text)]">
            <pre className="text-sm font-mono overflow-x-auto">
              <code>
                <HighlightedCode code={active.code} />
              </code>
            </pre>
          </div>
        </div>
      </div>
    </section>
  );
}
