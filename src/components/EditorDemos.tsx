import { useState, useEffect, lazy, Suspense } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { PipWrapper, PipTrigger, usePip } from '@pip-it-up/react';
import { ExternalLink, X, Type, Bold, Italic, List, Quote } from 'lucide-react';

const MonacoEditorComponent = lazy(() => import('@monaco-editor/react'));

function TiptapToolbar({ editor }: { editor: ReturnType<typeof useEditor> }) {
  if (!editor) return null;

  const buttons = [
    { icon: <Bold size={14} />, action: () => editor.chain().focus().toggleBold().run(), active: editor.isActive('bold'), label: 'Bold' },
    { icon: <Italic size={14} />, action: () => editor.chain().focus().toggleItalic().run(), active: editor.isActive('italic'), label: 'Italic' },
    { icon: <List size={14} />, action: () => editor.chain().focus().toggleBulletList().run(), active: editor.isActive('bulletList'), label: 'Bullet List' },
    { icon: <Quote size={14} />, action: () => editor.chain().focus().toggleBlockquote().run(), active: editor.isActive('blockquote'), label: 'Quote' },
  ];

  return (
    <div className="flex items-center gap-1 px-3 py-2 border-b border-[var(--color-border)]">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          type="button"
          onClick={btn.action}
          className={`p-1.5 rounded-md transition-colors cursor-pointer ${btn.active
              ? 'bg-[var(--color-accent)]/20 text-[var(--color-accent-light)]'
              : 'text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-bg-card-hover)]'
            }`}
          title={btn.label}
        >
          {btn.icon}
        </button>
      ))}
    </div>
  );
}

function TiptapDemo() {
  const [content, setContent] = useState(
    `<h3>Rich Text Editor</h3><p>This is a <strong>Tiptap editor</strong> that preserves its full state — including <em>cursor position</em>, formatting, and undo history — when popped into PiP.</p><ul><li>Try formatting some text</li><li>Click "Pop out"</li><li>Keep editing in the floating window</li></ul><blockquote>The MutationObserver keeps all styles synced in real time.</blockquote>`
  );

  return (
    <PipWrapper
      id="tiptap-demo"
      copyStyles="sync"
      fallback="none"
      placeholder={
        <div className="flex flex-col items-center justify-center h-[420px] bg-white border border-dashed border-[var(--color-border)] text-[var(--color-text-dim)] relative shadow-md">
          <div className="absolute -top-3 left-4 washi-tape washi-tape-pink rotate-[-5deg]">popped out</div>
          <p className="text-sm font-medium font-handwritten text-lg text-slate-500">Tiptap editor is in PiP window</p>
          <PipTrigger className="mt-4 px-4 py-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] text-[var(--color-text)] font-handwritten font-bold border-2 border-[var(--color-border)] text-sm shadow-sm transition-all rotate-[2deg] cursor-pointer">
            Return to editor
          </PipTrigger>
        </div>
      }
    >
      <TiptapDemoContent content={content} onContentChange={setContent} />
    </PipWrapper>
  );
}

function TiptapDemoContent({ content, onContentChange }: { content: string; onContentChange: (c: string) => void }) {
  const { isInsidePip } = usePip();

  return (
    <div className="h-[420px] flex flex-col border-2 border-[var(--color-border)] bg-white shadow-md relative rotate-[-0.5deg]">
      {/* Washi tape on top-left of the board */}
      <div className="absolute -top-4 -left-6 washi-tape washi-tape-green rotate-[-15deg] z-10">TIPTAP</div>
      
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b-2 border-[var(--color-border)] bg-slate-50">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded bg-[var(--color-border)]/5 flex items-center justify-center border border-[var(--color-border)]">
            <Type size={14} className="text-[var(--color-text)]" />
          </div>
          <span className="text-sm font-bold text-[var(--color-text)] font-handwritten">Tiptap Editor</span>
        </div>
        <PipTrigger
          className="inline-flex items-center gap-1.5 px-3 py-1 font-handwritten text-xs font-bold bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] border border-[var(--color-border)] text-[var(--color-text)] shadow-sm hover:scale-105 active:scale-95 transition-all rotate-[1deg] cursor-pointer"
          openLabel=""
          closeLabel=""
          renderOpen={
            <span className="flex items-center gap-1.5">
              <ExternalLink size={12} />
              Pop out
            </span>
          }
          renderClose={
            <span className="flex items-center gap-1.5">
              <X size={12} />
              Close
            </span>
          }
          renderUnsupported={null}
        />
      </div>

      {/* Tiptap content wrapped in inner component with key */}
      <TiptapEditorInner
        key={isInsidePip ? 'pip' : 'main'}
        content={content}
        onContentChange={onContentChange}
      />

      {/* Status */}
      <div className="px-4 py-2 border-t border-[var(--color-border-subtle)] bg-slate-50 flex items-center justify-between">
        <span className="text-[10px] text-[var(--color-text-dim)] font-typewriter">
          tiptap + starter-kit
        </span>
        <span className="text-[10px] text-[var(--color-text-dim)] font-typewriter">
          auto-sizing: active
        </span>
      </div>
    </div>
  );
}

function TiptapEditorInner({ content, onContentChange }: { content: string; onContentChange: (c: string) => void }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    editorProps: {
      attributes: {
        class: 'tiptap-editor px-4 py-3 outline-none',
      },
    },
    onUpdate({ editor }) {
      onContentChange(editor.getHTML());
    },
  });

  return (
    <>
      {/* Toolbar */}
      <TiptapToolbar editor={editor} />

      {/* Editor (Ruled notebook paper) */}
      <div className="flex-1 overflow-y-auto min-h-0 notebook-ruled border-b border-[var(--color-border-subtle)]">
        <EditorContent editor={editor} />
      </div>
    </>
  );
}

function MonacoEditorLazy() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-[var(--color-text-dim)]">
        Loading editor...
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center text-sm text-[var(--color-text-dim)]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-[var(--color-accent)]/30 border-t-[var(--color-accent)] rounded-full animate-spin" />
            Loading Monaco...
          </div>
        </div>
      }
    >
      <MonacoEditorComponent
        height="100%"
        defaultLanguage="html"
        theme="vs-dark"
        defaultValue={`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>PiP Demo</title>
  <style>
    body { font-family: system-ui, sans-serif; padding: 2rem; }
    .card { background: #1e1e30; color: white; padding: 1rem; border-radius: 8px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Hello, World!</h1>
    <p>This is a simple HTML example.</p>
  </div>
</body>
</html>`}
        options={{
          minimap: { enabled: false },
          fontSize: 13,
          lineHeight: 22,
          padding: { top: 12 },
          scrollBeyondLastLine: false,
          renderLineHighlight: 'none',
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
          scrollbar: { vertical: 'hidden', horizontal: 'hidden' },
        }}
      />
    </Suspense>
  );
}

function MonacoDemo() {
  return (
    <PipWrapper
      id="monaco-demo"
      copyStyles="sync"
      fallback="none"
      placeholder={
        <div className="flex flex-col items-center justify-center h-[420px] bg-white border border-dashed border-[var(--color-border)] text-[var(--color-text-dim)] relative shadow-md">
          <div className="absolute -top-3 left-4 washi-tape washi-tape-blue rotate-[4deg]">popped out</div>
          <p className="text-sm font-medium font-handwritten text-lg text-slate-500">Monaco editor is in PiP window</p>
          <PipTrigger className="mt-4 px-4 py-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] text-[var(--color-text)] font-handwritten font-bold border-2 border-[var(--color-border)] text-sm shadow-sm transition-all rotate-[2deg] cursor-pointer">
            Return to editor
          </PipTrigger>
        </div>
      }
      onPipWindowReady={(pipWindow) => {
        // Monaco needs a layout kick after PiP move
        setTimeout(() => {
          pipWindow.dispatchEvent(new Event('resize'));
        }, 100);
      }}
    >
      <div className="h-[420px] flex flex-col border-2 border-[var(--color-border)] bg-white shadow-md relative rotate-[0.5deg]">
        {/* Washi tape on top-right of the board */}
        <div className="absolute -top-4 -right-6 washi-tape washi-tape-blue rotate-[12deg] z-10">MONACO</div>

        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b-2 border-[var(--color-border)] bg-slate-50">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[var(--color-border)]/5 flex items-center justify-center border border-[var(--color-border)]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[var(--color-text)]"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" /></svg>
            </div>
            <span className="text-sm font-bold text-[var(--color-text)] font-handwritten">Monaco Editor</span>
          </div>
          <PipTrigger
            className="inline-flex items-center gap-1.5 px-3 py-1 font-handwritten text-xs font-bold bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] border border-[var(--color-border)] text-[var(--color-text)] shadow-sm hover:scale-105 active:scale-95 transition-all rotate-[-1deg] cursor-pointer"
            openLabel=""
            closeLabel=""
            renderOpen={
              <span className="flex items-center gap-1.5">
                <ExternalLink size={12} />
                Pop out
              </span>
            }
            renderClose={
              <span className="flex items-center gap-1.5">
                <X size={12} />
                Close
              </span>
            }
            renderUnsupported={null}
          />
        </div>

        {/* Monaco editor — inside a dark block to keep syntax contrast perfect */}
        <div className="flex-1 min-h-0 bg-[#1e2024] border-b border-[var(--color-border-subtle)]">
          <MonacoEditorLazy />
        </div>

        {/* Status */}
        <div className="px-4 py-2 border-t border-[var(--color-border-subtle)] bg-slate-50 flex items-center justify-between">
          <span className="text-[10px] text-[var(--color-text-dim)] font-typewriter">HTML</span>
          <span className="text-[10px] text-[var(--color-text-dim)] font-typewriter">
            auto-sizing: active
          </span>
        </div>
      </div>
    </PipWrapper>
  );
}

export default function EditorDemos() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="editor-demos" className="relative py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <h2 className="text-4xl sm:text-5xl font-handwritten font-extrabold mb-4 text-[var(--color-text)]">
            Works with real editors
          </h2>
          <p className="text-base font-typewriter text-[var(--color-text-muted)] max-w-xl mx-auto">
            Tiptap, Monaco, CodeMirror — pop out any editor while preserving state, undo history.
          </p>
        </div>

        {/* Demos grid (Rendered only on client to avoid Tiptap/Monaco SSR mismatch) */}
        {mounted ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <TiptapDemo />
              <p className="text-xs font-typewriter text-[var(--color-text-dim)] mt-3 text-center">
                Rich text — formatting, lists, and blockquotes all survive the pop-out.
              </p>
            </div>
            <div>
              <MonacoDemo />
              <p className="text-xs font-typewriter text-[var(--color-text-dim)] mt-3 text-center">
                Code editor — onPipWindowReady triggers layout resize handlers.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-pulse">
            <div className="h-[420px] bg-slate-50 border-2 border-[var(--color-border)] rounded shadow-sm" />
            <div className="h-[420px] bg-slate-50 border-2 border-[var(--color-border)] rounded shadow-sm" />
          </div>
        )}

        {/* Examples CTA */}
        <div className="mt-16 text-center" data-reveal="">
          <div className="inline-block p-8 sm:p-10 bg-white border-2 border-[var(--color-border)] shadow-md relative rotate-[-1deg] max-w-xl mx-auto">
            {/* Washi tape pin */}
            <div className="absolute -top-3 left-[30%] washi-tape washi-tape-yellow rotate-[3deg]">RECIPES</div>
            
            <h3 className="text-2xl font-bold font-handwritten mb-4 text-[var(--color-text)]">Want to see more recipes?</h3>
            <p className="text-sm font-sans text-[var(--color-text-muted)] mb-6">
              We have pre-built examples and detailed recipes for almost every common developer requirement.
            </p>

            {/* Tag chips styled as hand-drawn sticky tabs */}
            <div className="flex flex-wrap justify-center gap-2 mb-8 max-w-lg mx-auto relative font-handwritten">
              {[
                'Fixed-size PiP',
                'Portal mode',
                'Theme sync',
                'Keyboard shortcuts',
                'Fallbacks',
                'Controlled mode',
              ].map((tag, idx) => {
                const tapes = ['washi-tape-yellow', 'washi-tape-pink', 'washi-tape-green', 'washi-tape-blue', 'washi-tape-orange'];
                const tapeClass = tapes[idx % tapes.length];
                const rotate = idx % 2 === 0 ? 'rotate-[-2deg]' : 'rotate-[2deg]';
                return (
                  <span
                    key={tag}
                    className={`px-3 py-1 font-bold text-xs border border-[var(--color-border)] shadow-sm text-slate-800 ${tapeClass} ${rotate}`}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>

            <a
              href="/docs"
              className="inline-flex items-center gap-2 px-5 py-2 bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] border-2 border-[var(--color-border)] text-[var(--color-text)] font-handwritten text-lg font-bold shadow-sm hover:scale-105 active:scale-95 transition-all rotate-[1.5deg]"
            >
              Explore recipes
              <ExternalLink size={14} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
