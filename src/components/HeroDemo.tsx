import { useState } from 'react';
import { PipWrapper, PipTrigger, useIsPipSupported } from '@pip-it-up/react';
import { ExternalLink, X, Maximize2 } from 'lucide-react';

export default function HeroDemo() {
  const isSupported = useIsPipSupported();
  const [text, setText] = useState(
    'Try editing this text, then click "Pop out" to move it into a floating Picture-in-Picture window!\n\nYour content and cursor state will be preserved. ✨'
  );

  return (
    <div className="w-full max-w-2xl mx-auto mt-10 mb-4">
      <PipWrapper
        id="hero-demo"
        copyStyles="sync"
        mode="move"
        fallback="none"
        placeholder={
          <div className="flex flex-col items-center justify-center h-[260px] bg-[var(--color-bg-code)] rounded-lg border border-dashed border-[var(--color-border)] text-[var(--color-text-dim)]">
            <p className="text-sm font-medium">Editor is active in PiP</p>
            <PipTrigger className="mt-4 px-4 py-2 bg-[var(--color-accent)]/15 text-[var(--color-accent-light)] rounded-lg text-xs hover:bg-[var(--color-accent)]/25 transition-colors cursor-pointer">
              Restore to page
            </PipTrigger>
          </div>
        }
      >
        <div className="relative rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-card)] overflow-hidden shadow-2xl">
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--color-border)] bg-[var(--color-bg-code)]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-rose)]/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-amber)]/50" />
                <span className="w-2.5 h-2.5 rounded-full bg-[var(--color-emerald)]/50" />
              </div>
              <span className="ml-2 text-xs text-[var(--color-text-dim)] font-mono">live-demo.tsx</span>
            </div>
            <PipTrigger
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer border-none bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-dark)] active:scale-98 shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]"
              openLabel=""
              closeLabel=""
              renderOpen={
                <span className="flex items-center gap-1.5">
                  <ExternalLink size={13} />
                  Pop out
                </span>
              }
              renderClose={
                <span className="flex items-center gap-1.5">
                  <X size={13} />
                  Close PiP
                </span>
              }
              renderUnsupported={
                <span className="flex items-center gap-1.5 opacity-50 cursor-not-allowed">
                  <Maximize2 size={13} />
                  Not supported
                </span>
              }
            />
          </div>

          {/* Editor area */}
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full h-40 p-4 bg-transparent text-[var(--color-text)] text-sm leading-relaxed resize-none outline-none placeholder-[var(--color-text-dim)] font-[var(--font-sans)]"
            placeholder="Type something..."
            spellCheck={false}
          />

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-[var(--color-border)] bg-[var(--color-bg-code)]">
            <span className="text-[10px] text-[var(--color-text-dim)] font-mono">
              {text.length} chars
            </span>
            <span className="text-[10px] text-[var(--color-text-dim)] font-mono flex items-center gap-1.5">
              {isSupported ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-emerald)]" />
                  PiP Ready
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-amber)]" />
                  PiP Unavailable
                </>
              )}
            </span>
          </div>
        </div>
      </PipWrapper>

      {/* Caption */}
      <p className="text-center text-xs text-[var(--color-text-dim)] mt-4">
        {isSupported
          ? '👆 Click "Pop out" — this is a real live demo, not a mock.'
          : '⚠️ Your browser doesn\'t support Document PiP. Try Chrome 116+ or Edge 116+.'}
      </p>
    </div>
  );
}
