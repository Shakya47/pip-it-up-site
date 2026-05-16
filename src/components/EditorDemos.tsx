import { useState, useEffect, lazy, Suspense } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { PipWrapper, PipTrigger, useIsPipSupported } from '@pip-it-up/react';
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
    <div className="flex items-center gap-1 px-3 py-2 border-b border-[#1e1e30]">
      {buttons.map((btn) => (
        <button
          key={btn.label}
          type="button"
          onClick={btn.action}
          className={`p-1.5 rounded-md transition-colors ${btn.active
              ? 'bg-[#7c5cff]/20 text-[#a78bfa]'
              : 'text-[#8888a0] hover:text-[#e8e8f0] hover:bg-[#1a1a28]'
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
  const editor = useEditor({
    extensions: [StarterKit],
    content: `<h3>Rich Text Editor</h3><p>This is a <strong>Tiptap editor</strong> that preserves its full state — including <em>cursor position</em>, formatting, and undo history — when popped into PiP.</p><ul><li>Try formatting some text</li><li>Click "Pop out"</li><li>Keep editing in the floating window</li></ul><blockquote>The MutationObserver keeps all styles synced in real time.</blockquote>`,
    editorProps: {
      attributes: {
        class: 'tiptap-editor px-4 py-3 outline-none',
      },
    },
  });

  return (
    <PipWrapper
      id="tiptap-demo"
      copyStyles="sync"
      fallback="none"
      placeholder={
        <div className="flex flex-col items-center justify-center h-[420px] bg-[#0d0d14] rounded-2xl border border-dashed border-[#1e1e30] text-[#555570]">
          <p className="text-sm font-medium text-white/40">Tiptap editor is in PiP</p>
          <PipTrigger className="mt-4 px-4 py-2 bg-[#7c5cff]/15 text-[#a78bfa] rounded-lg text-xs hover:bg-[#7c5cff]/25">
            Return to editor
          </PipTrigger>
        </div>
      }
    >
      <div className="h-[420px] flex flex-col rounded-2xl border border-[#1e1e30] bg-[#12121a] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e30] bg-[#0d0d14]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#7c5cff]/15 flex items-center justify-center">
              <Type size={14} className="text-[#a78bfa]" />
            </div>
            <span className="text-sm font-medium text-white">Tiptap Editor</span>
          </div>
          <PipTrigger
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border-none bg-[#7c5cff] text-white hover:bg-[#5b3fd9] active:scale-95"
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

        {/* Toolbar */}
        <TiptapToolbar editor={editor} />

        {/* Editor */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <EditorContent editor={editor} />
        </div>

        {/* Status */}
        <div className="px-4 py-2 border-t border-[#1e1e30] bg-[#0d0d14] flex items-center justify-between">
          <span className="text-[10px] text-[#555570] font-mono">
            tiptap + starter-kit
          </span>
          <span className="text-[10px] text-[#555570] font-mono">
            auto-sizing: active · styles: sync
          </span>
        </div>
      </div>
    </PipWrapper>
  );
}

function MonacoEditorLazy() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-[#555570]">
        Loading editor...
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center text-sm text-[#555570]">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-[#7c5cff]/30 border-t-[#7c5cff] rounded-full animate-spin" />
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
        <div className="flex flex-col items-center justify-center h-[420px] bg-[#0d0d14] rounded-2xl border border-dashed border-[#1e1e30] text-[#555570]">
          <p className="text-sm font-medium text-white/40">Monaco editor is in PiP</p>
          <PipTrigger className="mt-4 px-4 py-2 bg-[#22d3ee]/10 text-[#22d3ee] rounded-lg text-xs hover:bg-[#22d3ee]/20">
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
      <div className="h-[420px] flex flex-col rounded-2xl border border-[#1e1e30] bg-[#12121a] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e30] bg-[#0d0d14]">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#22d3ee]/15 flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22d3ee" strokeWidth="2"><path d="M16 18l6-6-6-6M8 6l-6 6 6 6" /></svg>
            </div>
            <span className="text-sm font-medium text-white">Monaco Editor</span>
          </div>
          <PipTrigger
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border-none bg-[#22d3ee]/15 text-[#22d3ee] hover:bg-[#22d3ee]/25 active:scale-95"
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

        {/* Monaco editor — lazy-loaded */}
        <div className="flex-1 min-h-0">
          <MonacoEditorLazy />
        </div>

        {/* Status */}
        <div className="px-4 py-2 border-t border-[#1e1e30] bg-[#0d0d14] flex items-center justify-between">
          <span className="text-[10px] text-[#555570] font-mono">HTML</span>
          <span className="text-[10px] text-[#555570] font-mono">
            auto-sizing: active · resize: event
          </span>
        </div>
      </div>
    </PipWrapper>
  );
}

export default function EditorDemos() {
  return (
    <section id="editor-demos" className="relative py-24 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Works with{' '}
            <span className="bg-gradient-to-r from-[#7c5cff] via-[#22d3ee] to-[#a78bfa] bg-clip-text text-transparent">
              real editors
            </span>
          </h2>
          <p className="text-lg text-[#8888a0] max-w-2xl mx-auto">
            Tiptap, Monaco, CodeMirror — pop out any editor while preserving state, undo history.
          </p>
        </div>

        {/* Demos grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <TiptapDemo />
            <p className="text-xs text-[#555570] mt-3 text-center">
              Rich text — formatting, lists, and blockquotes all survive the pop-out.
            </p>
          </div>
          <div>
            <MonacoDemo />
            <p className="text-xs text-[#555570] mt-3 text-center">
              Code editor — <code className="text-[#8888a0]">onPipWindowReady</code> triggers <code className="text-[#8888a0]">editor.layout()</code>
            </p>
          </div>
        </div>

        {/* Examples CTA */}
        <div className="mt-16 text-center" data-reveal="">
          <div className="inline-block p-8 sm:p-10 rounded-3xl border border-[#1e1e30] bg-[#0d0d14]/50 backdrop-blur-sm relative overflow-hidden group">
            {/* Background glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#7c5cff]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            <h3 className="text-xl font-semibold mb-6 relative">Want to see more?</h3>

            {/* Tag chips */}
            <div className="flex flex-wrap justify-center gap-2 mb-10 max-w-lg mx-auto relative">
              {[
                'Fixed-size PiP',
                'Portal mode',
                'Theme sync',
                'Keyboard shortcuts',
                'Fallbacks',
                'Controlled mode',
              ].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 rounded-full text-[11px] font-medium bg-[#1a1a28] border border-[#2a2a40] text-[#8888a0] tracking-wide"
                >
                  {tag}
                </span>
              ))}
            </div>

            <a
              href="https://pip-it-up-playground.vercel.app"
              target="_blank"
              rel="noopener"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#7c5cff] text-white text-sm font-semibold hover:bg-[#5b3fd9] transition-all active:scale-95 relative"
            >
              Explore all examples
              <ExternalLink size={16} />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
