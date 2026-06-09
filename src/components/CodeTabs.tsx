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
          <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white">
            Dead simple{' '}
            <span className="gradient-text">
              integration
            </span>
          </h2>
          <p className="text-base text-[var(--color-text-muted)] max-w-xl mx-auto">
            Wrap your component, drop in a trigger — you're done.
          </p>
        </div>

        {/* Code card */}
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-code)] overflow-hidden shadow-2xl">
          {/* Tab bar */}
          <div className="flex items-center border-b border-[var(--color-border)] overflow-x-auto">
            {frameworks.map((fw, i) => (
              <button
                key={fw.name}
                type="button"
                onClick={() => { if (fw.active) { setActiveTab(i); setCopied(false); } }}
                className={`relative px-5 py-3 text-sm font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  i === activeTab
                    ? 'text-white'
                    : fw.active
                    ? 'text-[var(--color-text-muted)] hover:text-white'
                    : 'text-[var(--color-text-dim)] opacity-50 cursor-not-allowed'
                }`}
              >
                {fw.name}
                {!fw.active && (
                  <span className="ml-1.5 text-[9px] px-1.5 py-0.5 rounded-full bg-[var(--color-bg-card)] text-[var(--color-text-dim)]">
                    soon
                  </span>
                )}
                {i === activeTab && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--color-accent)]" />
                )}
              </button>
            ))}

            {/* Copy button */}
            <button
              type="button"
              onClick={handleCopy}
              className="ml-auto mr-3 p-2 rounded-lg text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-bg-card-hover)] transition-colors cursor-pointer"
              title="Copy code"
            >
              {copied ? <Check size={15} className="text-[var(--color-emerald)]" /> : <Copy size={15} />}
            </button>
          </div>

          {/* Code block */}
          <div className="p-5 overflow-x-auto text-[var(--color-text)]">
            <pre className="text-sm font-mono">
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
