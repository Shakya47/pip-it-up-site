import { useState, useEffect } from 'react';
import { PipWrapper, PipTrigger, useIsPipSupported } from '@pip-it-up/react';
import { ExternalLink, X, Maximize2 } from 'lucide-react';

export default function HeroDemo() {
  const isSupported = useIsPipSupported();
  const [text, setText] = useState(
    'Try editing this text, then click "Pop out" to move it into a floating Picture-in-Picture window!\n\nYour content and cursor state will be preserved. ✨'
  );

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full max-w-xl mx-auto mt-10 mb-8 px-4 animate-pulse">
        <div className="polaroid-frame bg-white text-[var(--color-text)] border border-[#e5e5df] p-4 pb-10 shadow-xl">
          <div className="relative rounded border-2 border-[var(--color-border)] bg-[#1e2024] h-[240px] flex flex-col justify-center items-center">
            <span className="text-sm font-mono text-gray-500">Loading editor...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-xl mx-auto mt-10 mb-8 px-4">
      {/* Polaroid border wrapper (stays on page, doesn't go to PiP) */}
      <div className="polaroid-frame bg-white text-[var(--color-text)] border border-[#e5e5df] p-4 pb-10 shadow-xl rotate-[-1deg]">
        <PipWrapper
          id="hero-demo"
          copyStyles="sync"
          mode="move"
          fallback="none"
          placeholder={
            <div className="flex flex-col items-center justify-center h-[240px] bg-slate-100 border border-dashed border-slate-300 text-slate-500 rounded">
              <p className="text-sm font-medium font-handwritten text-lg text-slate-500">Popped into PiP window! 🚀</p>
              <PipTrigger className="mt-4 px-4 py-1.5 bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] text-[var(--color-text)] font-handwritten font-bold border border-[var(--color-border)] text-sm shadow-sm transition-all rotate-[2deg] cursor-pointer">
                Restore to page
              </PipTrigger>
            </div>
          }
        >
          {/* Poppable editor content (rendered straight and clean in PiP) */}
          <div className="relative rounded border-2 border-[var(--color-border)] bg-[#1e2024] overflow-hidden shadow-sm flex flex-col">
            {/* Title bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b-2 border-[var(--color-border)] bg-[#1a1b1f]">
              <div className="flex items-center gap-1.5">
                <div className="flex gap-1">
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-rose)] border border-[var(--color-border)]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-amber)] border border-[var(--color-border)]" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-emerald)] border border-[var(--color-border)]" />
                </div>
                <span className="ml-1 text-[10px] text-gray-400 font-mono">live-editor.tsx</span>
              </div>
              <PipTrigger
                className="inline-flex items-center gap-1.5 px-3 py-1 font-handwritten text-sm font-bold bg-[var(--color-accent)] hover:bg-[var(--color-accent-light)] border border-[var(--color-border)] text-[var(--color-text)] shadow-sm hover:scale-105 active:scale-95 transition-all rotate-[1deg] cursor-pointer"
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
                    Close PiP
                  </span>
                }
                renderUnsupported={
                  <span className="flex items-center gap-1.5 opacity-50 cursor-not-allowed">
                    <Maximize2 size={12} />
                    Not supported
                  </span>
                }
              />
            </div>

            {/* Editor area */}
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-full h-36 p-3 bg-transparent text-gray-200 text-sm leading-relaxed resize-none outline-none placeholder-gray-500 font-mono"
              placeholder="Type something..."
              spellCheck={false}
            />

            {/* Status bar */}
            <div className="flex items-center justify-between px-3 py-1.5 border-t border-[var(--color-border)] bg-[#1a1b1f]">
              <span className="text-[9px] text-gray-400 font-mono">
                {text.length} chars
              </span>
              <span className="text-[9px] text-gray-400 font-mono flex items-center gap-1.5">
                {isSupported ? (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
                    PiP Ready
                  </>
                ) : (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-warning)]" />
                    PiP Unavailable
                  </>
                )}
              </span>
            </div>
          </div>
        </PipWrapper>
        {/* Polaroid handwritten caption */}
        <div className="text-center mt-3 font-handwritten text-lg text-gray-700 tracking-wide rotate-[0.5deg]">
          live demo — try editing! ✏️
        </div>
      </div>
    </div>
  );
}
