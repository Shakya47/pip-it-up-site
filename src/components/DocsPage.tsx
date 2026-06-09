import { useState, useEffect, useRef } from 'react';
import { Search, Copy, Check, Hash } from 'lucide-react';
import { docsData, type DocSection, type DocCategory } from '../data/docsData';

export default function DocsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('introduction');
  const [searchQuery, setSearchQuery] = useState('');
  const [headings, setHeadings] = useState<{ id: string; text: string; tag: string }[]>([]);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  
  const contentRef = useRef<HTMLDivElement>(null);

  // Find active section object
  let activeSection: DocSection | null = null;
  for (const cat of docsData) {
    const sec = cat.sections.find((s) => s.id === activeSectionId);
    if (sec) {
      activeSection = sec;
      break;
    }
  }

  // Fallback to first section if not found
  if (!activeSection) {
    activeSection = docsData[0].sections[0];
  }

  useEffect(() => {
    setMounted(true);
    
    // Sync hash on load
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      const sectionExists = docsData.some((cat) => 
        cat.sections.some((sec) => sec.id === hash)
      );
      if (sectionExists) {
        setActiveSectionId(hash);
      }
    }

    const handleHashChange = () => {
      const newHash = window.location.hash.replace('#', '');
      if (newHash) {
        setActiveSectionId(newHash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Sync headings and inject copy buttons to code blocks
  useEffect(() => {
    if (!mounted || !contentRef.current) return;

    // 1. Extract headings for Table of Contents
    const els = contentRef.current.querySelectorAll('h3, h4');
    const headingList = Array.from(els).map((el, i) => {
      const id = el.id || `heading-${activeSectionId}-${i}`;
      el.id = id;
      el.classList.add('scroll-mt-20'); // add scroll margin so it doesn't get hidden behind navbar
      return {
        id,
        text: el.textContent || '',
        tag: el.tagName.toLowerCase()
      };
    });
    setHeadings(headingList);

    // 2. Attach copy buttons to pre.code-block
    const codeBlocks = contentRef.current.querySelectorAll('pre.code-block');
    codeBlocks.forEach((block, idx) => {
      // Check if button is already added
      if (block.querySelector('.copy-btn-wrapper')) return;

      block.classList.add('relative', 'group');
      const wrapper = document.createElement('div');
      wrapper.className = 'copy-btn-wrapper absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity z-10';
      
      const button = document.createElement('button');
      button.className = 'p-1.5 rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-white transition-colors cursor-pointer';
      button.innerHTML = '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>';
      
      button.addEventListener('click', () => {
        const codeText = block.querySelector('code')?.textContent || '';
        navigator.clipboard.writeText(codeText);
        button.innerHTML = '<svg class="w-3.5 h-3.5 text-[var(--color-emerald)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>';
        setTimeout(() => {
          button.innerHTML = '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>';
        }, 1500);
      });

      wrapper.appendChild(button);
      block.appendChild(wrapper);
    });

  }, [activeSectionId, mounted]);

  const selectSection = (id: string) => {
    setActiveSectionId(id);
    window.location.hash = id;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Perform search filtering
  const searchResults: { categoryTitle: string; section: DocSection }[] = [];
  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    docsData.forEach((cat) => {
      cat.sections.forEach((sec) => {
        const matchesTitle = sec.title.toLowerCase().includes(q);
        const matchesSummary = sec.summary.toLowerCase().includes(q);
        const matchesKeywords = sec.keywords.some((kw) => kw.includes(q));
        const matchesContent = sec.content.toLowerCase().includes(q);
        
        if (matchesTitle || matchesSummary || matchesKeywords || matchesContent) {
          searchResults.push({ categoryTitle: cat.title, section: sec });
        }
      });
    });
  }

  if (!mounted) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 flex gap-8">
        <div className="w-64 animate-pulse bg-[var(--color-bg-card)] h-96 rounded-lg" />
        <div className="flex-1 animate-pulse bg-[var(--color-bg-card)] h-screen rounded-lg" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-10 pb-24 flex flex-col md:flex-row gap-8 relative">
      
      {/* ─── Left Sidebar Navigation ─── */}
      <aside className="w-full md:w-64 shrink-0 flex flex-col gap-6 md:sticky md:top-24 md:h-[calc(100vh-120px)] md:overflow-y-auto pr-2 scrollbar-thin">
        
        {/* Search Box */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-dim)]">
            <Search size={15} />
          </span>
          <input
            type="text"
            placeholder="Search docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[var(--color-bg-code)] border border-[var(--color-border)] rounded-lg text-sm text-[var(--color-text)] placeholder-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-accent-light)] transition-colors"
          />
        </div>

        {/* Categories / Navigation list */}
        {searchQuery.trim() === '' ? (
          <nav className="flex flex-col gap-6">
            {docsData.map((cat) => (
              <div key={cat.id} className="flex flex-col gap-1.5">
                <h4 className="text-[10px] font-bold tracking-wider text-[var(--color-text-dim)] uppercase px-2 mb-1">
                  {cat.title}
                </h4>
                <ul className="flex flex-col gap-1">
                  {cat.sections.map((sec) => {
                    const isActive = sec.id === activeSectionId;
                    return (
                      <li key={sec.id}>
                        <button
                          onClick={() => selectSection(sec.id)}
                          className={`w-full text-left py-1.5 px-2.5 rounded-lg text-sm transition-all cursor-pointer font-medium ${
                            isActive
                              ? 'text-white bg-[var(--color-bg-card)] border-l-2 border-[var(--color-accent)] font-semibold'
                              : 'text-[var(--color-text-muted)] hover:text-white hover:bg-[var(--color-bg-card-hover)]/30 border-l border-transparent'
                          }`}
                        >
                          {sec.title}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>
        ) : (
          /* Search Results Pane */
          <div className="flex flex-col gap-3">
            <h4 className="text-[10px] font-bold tracking-wider text-[var(--color-text-dim)] uppercase px-2">
              Search Results ({searchResults.length})
            </h4>
            {searchResults.length > 0 ? (
              <ul className="flex flex-col gap-2">
                {searchResults.map(({ categoryTitle, section }) => (
                  <li key={section.id}>
                    <button
                      onClick={() => {
                        selectSection(section.id);
                        setSearchQuery('');
                      }}
                      className="w-full text-left p-2.5 rounded-lg bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] border border-[var(--color-border)] hover:border-[var(--color-accent-light)] transition-all cursor-pointer group"
                    >
                      <div className="text-[10px] text-[var(--color-text-dim)] font-semibold uppercase mb-0.5">
                        {categoryTitle}
                      </div>
                      <div className="text-sm font-semibold text-white group-hover:text-[var(--color-accent-light)] transition-colors">
                        {section.title}
                      </div>
                      <div className="text-xs text-[var(--color-text-muted)] line-clamp-1 mt-1">
                        {section.summary}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-[var(--color-text-dim)] px-2 py-4">
                No results match your query.
              </div>
            )}
          </div>
        )}
      </aside>

      {/* ─── Main Content Pane ─── */}
      <main className="flex-1 min-w-0">
        <div className="max-w-2xl">
          {/* Header */}
          <div className="mb-8 border-b border-[var(--color-border)] pb-8">
            <h1 className="text-3xl font-extrabold tracking-tight text-white mb-2 font-sans leading-tight">
              {activeSection.title}
            </h1>
            <p className="text-base text-[var(--color-text-muted)] leading-relaxed">
              {activeSection.summary}
            </p>
          </div>

          {/* Render Content */}
          <div
            ref={contentRef}
            className="docs-content"
            dangerouslySetInnerHTML={{ __html: activeSection.content }}
          />
          
          {/* Navigation Helper Buttons */}
          <div className="flex justify-between items-center mt-16 pt-8 border-t border-[var(--color-border)]">
            {/* Find Prev / Next Section */}
            {(() => {
              const allSections = docsData.flatMap((c) => c.sections.map((s) => ({ ...s, cat: c.title })));
              const activeIdx = allSections.findIndex((s) => s.id === activeSectionId);
              const prevSec = activeIdx > 0 ? allSections[activeIdx - 1] : null;
              const nextSec = activeIdx < allSections.length - 1 ? allSections[activeIdx + 1] : null;
              
              return (
                <>
                  {prevSec ? (
                    <button
                      onClick={() => selectSection(prevSec.id)}
                      className="flex flex-col items-start p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent-light)] bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] cursor-pointer text-left max-w-[45%]"
                    >
                      <span className="text-[10px] text-[var(--color-text-dim)] font-semibold uppercase tracking-wider mb-1">Previous</span>
                      <span className="text-sm font-bold text-white leading-snug line-clamp-1">{prevSec.title}</span>
                    </button>
                  ) : (
                    <div />
                  )}
                  {nextSec ? (
                    <button
                      onClick={() => selectSection(nextSec.id)}
                      className="flex flex-col items-end p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent-light)] bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] cursor-pointer text-right max-w-[45%]"
                    >
                      <span className="text-[10px] text-[var(--color-text-dim)] font-semibold uppercase tracking-wider mb-1">Next</span>
                      <span className="text-sm font-bold text-white leading-snug line-clamp-1">{nextSec.title}</span>
                    </button>
                  ) : (
                    <div />
                  )}
                </>
              );
            })()}
          </div>
        </div>
      </main>

      {/* ─── Right Table of Contents (Outline) ─── */}
      <nav className="hidden lg:block w-48 shrink-0 sticky top-24 h-[calc(100vh-120px)] overflow-y-auto pl-4 border-l border-[var(--color-border)] scrollbar-thin">
        <h4 className="text-[10px] font-bold tracking-wider text-[var(--color-text-dim)] uppercase mb-3">
          On This Page
        </h4>
        {headings.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {headings.map((heading) => (
              <li
                key={heading.id}
                style={{ paddingLeft: heading.tag === 'h4' ? '12px' : '0px' }}
              >
                <a
                  href={`#${heading.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="text-xs text-[var(--color-text-muted)] hover:text-white transition-colors flex items-start gap-1 group py-0.5 line-clamp-2"
                >
                  <Hash size={10} className="text-[var(--color-text-dim)] mt-0.5 shrink-0 group-hover:text-[var(--color-accent-light)] transition-colors" />
                  <span>{heading.text}</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-[11px] text-[var(--color-text-dim)] italic">
            Overview
          </div>
        )}
      </nav>
    </div>
  );
}
