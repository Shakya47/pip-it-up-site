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
          <div className="flex flex-col items-center justify-center h-[260px] bg-[#0d0d14] rounded-2xl border border-dashed border-[#1e1e30] text-[#555570]">
            <p className="text-sm font-medium">Editor is active in PiP</p>
            <PipTrigger className="mt-4 px-4 py-2 bg-[#7c5cff]/15 text-[#a78bfa] rounded-lg text-xs hover:bg-[#7c5cff]/25 transition-colors">
              Restore to page
            </PipTrigger>
          </div>
        }
      >
        <div className="relative rounded-2xl border border-[#1e1e30] bg-[#12121a] overflow-hidden shadow-2xl shadow-[rgba(124,92,255,0.08)]">
          {/* Title bar */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-[#1e1e30] bg-[#0d0d14]">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-[#fb7185]/60" />
                <span className="w-3 h-3 rounded-full bg-[#fbbf24]/60" />
                <span className="w-3 h-3 rounded-full bg-[#34d399]/60" />
              </div>
              <span className="ml-2 text-xs text-[#555570] font-mono">live-demo.tsx</span>
            </div>
            <PipTrigger
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 cursor-pointer border-none bg-[#7c5cff] text-white hover:bg-[#5b3fd9] active:scale-95"
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
            className="w-full h-40 p-4 bg-transparent text-[#e8e8f0] text-sm leading-relaxed resize-none outline-none placeholder-[#555570] font-[var(--font-sans)]"
            placeholder="Type something..."
            spellCheck={false}
          />

          {/* Status bar */}
          <div className="flex items-center justify-between px-4 py-2 border-t border-[#1e1e30] bg-[#0d0d14]">
            <span className="text-[10px] text-[#555570] font-mono">
              {text.length} chars
            </span>
            <span className="text-[10px] text-[#555570] font-mono flex items-center gap-1.5">
              {isSupported ? (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#34d399]" />
                  PiP Ready
                </>
              ) : (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-[#fbbf24]" />
                  PiP Unavailable
                </>
              )}
            </span>
          </div>
        </div>
      </PipWrapper>

      {/* Caption */}
      <p className="text-center text-xs text-[#555570] mt-4">
        {isSupported
          ? '👆 Click "Pop out" — this is a real live demo, not a mock.'
          : '⚠️ Your browser doesn\'t support Document PiP. Try Chrome 116+ or Edge 116+.'}
      </p>
    </div>
  );
}
