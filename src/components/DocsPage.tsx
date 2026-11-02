import { useState, useEffect, useMemo } from 'react';
import { Search, Hash, Menu, X, ChevronDown } from 'lucide-react';
import { docsData, type DocSection, type DocCategory } from '../data/docsData';

const COPY_ICON = '<svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2"><path d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/></svg>';
const CHECK_ICON = '<svg class="w-3.5 h-3.5 text-[var(--color-emerald)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>';

const decodeEntities = (text: string) =>
  text
    .replace(/<[^>]+>/g, '')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&');

/**
 * Adds heading ids and copy buttons to the section HTML as a string, before React renders it.
 * Doing this by mutating the DOM after render does not stick: React owns the
 * dangerouslySetInnerHTML subtree and any later re-render discards those edits.
 */
function prepareContent(sectionId: string, html: string) {
  const headings: { id: string; text: string; tag: string }[] = [];
  let i = 0;
  const withIds = html.replace(/<(h[34])>([\s\S]*?)<\/\1>/g, (_m, tag: string, inner: string) => {
    const id = `heading-${sectionId}-${i++}`;
    headings.push({ id, text: decodeEntities(inner), tag });
    return `<${tag} id="${id}" class="scroll-mt-20">${inner}</${tag}>`;
  });
  const withCopy = withIds.replace(
    /<pre class="code-block([^"]*)">([\s\S]*?)<\/pre>/g,
    (_m, cls: string, inner: string) =>
      `<pre class="code-block relative group${cls}">${inner}<div class="copy-btn-wrapper absolute top-2 right-2 md:top-3 md:right-3 max-md:opacity-100 md:opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity z-10"><button type="button" data-copy aria-label="Copy code" class="p-1.5 rounded bg-[var(--color-bg-elevated)] border border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors cursor-pointer">${COPY_ICON}</button></div></pre>`
  );
  const withTables = withCopy.replace(/<table>[\s\S]*?<\/table>/g, (t) => `<div class="table-scroll">${t}</div>`);
  return { html: withTables, headings };
}

export default function DocsPage() {
  const [mounted, setMounted] = useState(false);
  const [activeSectionId, setActiveSectionId] = useState('introduction');
  const [searchQuery, setSearchQuery] = useState('');
  // Below md the sidebar is a full-screen drawer instead of a block stacked above the content.
  const [menuOpen, setMenuOpen] = useState(false);
  
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

  const { html: contentHtml, headings } = useMemo(
    () => prepareContent(activeSection!.id, activeSection!.content),
    [activeSection]
  );

  // Event delegation: the buttons live inside the dangerouslySetInnerHTML string.
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const button = (e.target as HTMLElement).closest<HTMLButtonElement>('button[data-copy]');
    if (!button) return;
    const text = button.closest('pre')?.querySelector('code')?.textContent || '';
    navigator.clipboard?.writeText(text).catch(() => {});
    button.innerHTML = CHECK_ICON;
    setTimeout(() => {
      button.innerHTML = COPY_ICON;
    }, 1500);
  };

  // The drawer is phone-only: close it if the viewport grows past md (rotate, resize).
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => e.matches && setMenuOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Lock page scroll behind the mobile drawer and let Escape close it.
  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenuOpen(false);
    window.addEventListener('keydown', onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const activeCategory = docsData.find((c) => c.sections.some((sec) => sec.id === activeSection!.id));

  const selectSection = (id: string) => {
    setActiveSectionId(id);
    setMenuOpen(false);
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
        const matchesKeywords = sec.keywords.some((kw) => kw.toLowerCase().includes(q));
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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-[4.75rem] md:pt-16 pb-16 md:pb-24 flex flex-col md:flex-row gap-4 md:gap-8 relative md:z-10">

      {/* ─── Mobile section picker: sticky under the navbar, opens the drawer ─── */}
      <div className="md:hidden sticky top-[4.25rem] z-40 -mx-4 sm:-mx-6 px-4 sm:px-6 py-2 bg-[var(--color-bg)] border-b border-[var(--color-border-subtle)]">
        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          aria-expanded={menuOpen}
          aria-controls="docs-sidebar"
          className="w-full min-h-11 flex items-center gap-3 px-3 py-2 bg-[var(--paper-white)] border-2 border-[var(--color-border)] rounded-md text-left font-handwritten cursor-pointer"
        >
          <Menu size={18} className="shrink-0" />
          <span className="flex-1 min-w-0">
            <span className="block text-[10px] uppercase tracking-wider text-[var(--color-text-dim)] font-sans leading-none mb-0.5">
              {activeCategory?.title}
            </span>
            <span className="block text-base font-bold text-[var(--color-text)] truncate leading-tight">{activeSection.title}</span>
          </span>
          <ChevronDown size={18} className="shrink-0" />
        </button>
      </div>

      {/* ─── Left Sidebar Navigation (Notepad card; full-screen drawer on phones) ─── */}
      <aside
        id="docs-sidebar"
        role={menuOpen ? 'dialog' : undefined}
        aria-modal={menuOpen ? true : undefined}
        aria-label="Documentation menu"
        className={`w-full md:w-64 shrink-0 bg-[var(--paper-white)] md:border-2 border-[var(--color-border)] md:shadow-md md:relative md:sticky md:top-24 md:h-[calc(100vh-120px)] md:rotate-[-0.5deg] z-10 font-handwritten max-md:fixed max-md:inset-0 max-md:z-[70] ${menuOpen ? '' : 'max-md:hidden'}`}
      >
        {/* Drawer header (phones only) */}
        <div className="md:hidden flex items-center justify-between px-5 py-3 border-b-2 border-[var(--color-border)]">
          <span className="text-xl font-bold">Docs</span>
          <button
            type="button"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
            className="min-h-11 min-w-11 flex items-center justify-center border-2 border-[var(--color-border)] rounded-md cursor-pointer"
          >
            <X size={20} />
          </button>
        </div>
        {/* Red Thumbtack pin */}
        <div className="max-md:!hidden thumbtack !-top-3.5 !left-1/2 !-translate-x-1/2"></div>
        {/* Washi tape label */}
        <div className="max-md:!hidden absolute -bottom-3 -right-2 washi-tape washi-tape-orange text-xs rotate-[-5deg] z-20 pointer-events-none">INDEX</div>

        {/* Scroll lives here, not on <aside>, so the pinned tape and thumbtack
            stay on the card edge instead of riding down the nav list. */}
        <div className="p-5 md:p-6 max-md:h-[calc(100%-3.75rem)] max-md:overflow-y-auto md:h-full md:overflow-y-auto">

        {/* Search Box */}
        <div className="relative mb-6">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[var(--color-text-dim)]">
            <Search size={15} />
          </span>
          <input
            type="text"
            placeholder="Search docs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[var(--color-bg-code)] border-2 border-[var(--color-border)] rounded-md font-sans text-sm text-[var(--color-text)] placeholder-[var(--color-text-dim)] focus:outline-none focus:border-[var(--color-accent-light)] shadow-sm"
          />
        </div>

        {/* Categories / Navigation list */}
        {searchQuery.trim() === '' ? (
          <nav className="flex flex-col gap-6">
            {docsData.map((cat) => (
              <div key={cat.id} className="flex flex-col gap-1.5">
                <h4 className="text-base font-bold tracking-wider text-[var(--color-accent-dark)] uppercase px-2 mb-1">
                  {cat.title}
                </h4>
                <ul className="flex flex-col gap-1">
                  {cat.sections.map((sec) => {
                    const isActive = sec.id === activeSectionId;
                    return (
                      <li key={sec.id}>
                        <button
                          onClick={() => selectSection(sec.id)}
                          className={`w-full text-left py-2.5 md:py-1 px-2.5 rounded text-base transition-all cursor-pointer font-bold ${
                            isActive
                              ? 'text-[var(--note-yellow-ink)] bg-[var(--note-yellow-bg)] border border-[var(--color-border)] md:rotate-[1deg]'
                              : 'text-[var(--color-text-muted)] hover:text-[var(--color-text)] hover:bg-[var(--color-bg-elevated)] border border-transparent'
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

            {/* External Links */}
            <div className="flex flex-col gap-1.5 border-t border-[var(--color-border)] pt-4 mt-2">
              <h4 className="text-base font-bold tracking-wider text-[var(--color-accent-dark)] uppercase px-2 mb-1">
                Resources
              </h4>
              <ul className="flex flex-col gap-1 px-2.5 text-sm text-[var(--color-text-muted)] font-bold">
                <li>
                  <a href="https://github.com/Shakya47/pip-it-up" target="_blank" rel="noopener" className="hover:text-[var(--color-text)] transition-colors flex items-center justify-between py-1 group">
                    <span>GitHub Repository</span>
                    <span className="text-[10px] text-[var(--color-text-dim)] group-hover:text-[var(--color-accent-dark)] transition-colors">↗</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.npmjs.com/package/@pip-it-up/core" target="_blank" rel="noopener" className="hover:text-[var(--color-text)] transition-colors flex items-center justify-between py-1 group font-mono">
                    <span>@pip-it-up/core</span>
                    <span className="text-[10px] text-[var(--color-text-dim)] group-hover:text-[var(--color-accent-dark)] transition-colors">↗</span>
                  </a>
                </li>
                <li>
                  <a href="https://www.npmjs.com/package/@pip-it-up/react" target="_blank" rel="noopener" className="hover:text-[var(--color-text)] transition-colors flex items-center justify-between py-1 group font-mono">
                    <span>@pip-it-up/react</span>
                    <span className="text-[10px] text-[var(--color-text-dim)] group-hover:text-[var(--color-accent-dark)] transition-colors">↗</span>
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        ) : (
          /* Search Results Pane */
          <div className="flex flex-col gap-3">
            <h4 className="text-base font-bold tracking-wider text-[var(--color-accent-dark)] uppercase px-2">
              Results ({searchResults.length})
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
                      <div className="text-sm font-semibold text-[var(--color-text)] group-hover:text-[var(--color-accent-dark)] transition-colors">
                        {section.title}
                      </div>
                      <div className="text-xs text-[var(--color-text-muted)] line-clamp-1 mt-1 font-sans">
                        {section.summary}
                      </div>
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-xs text-[var(--color-text-dim)] px-2 py-4 font-sans">
                No results match your query.
              </div>
            )}
          </div>
        )}
        </div>
      </aside>

      {/* ─── Main Content Pane (Typewriter sheet) ─── */}
      <main className="flex-1 min-w-0 bg-[var(--paper-white)] border-2 border-[var(--color-border)] p-5 sm:p-10 shadow-md relative md:rotate-[0.5deg]">
        {/* Pink Washi tape on top-right */}
        <div className="max-md:!hidden absolute -top-4 -right-4 washi-tape washi-tape-pink text-xs rotate-[4deg] z-10">DOCS</div>
        {/* Blue Washi tape on bottom-left */}
        <div className="max-md:!hidden absolute -bottom-4 -left-6 washi-tape washi-tape-blue text-xs rotate-[-8deg] z-10">★ COMPLIANT</div>

        <div className="max-w-2xl">
          {/* Header */}
          <div className="mb-6 md:mb-8 border-b border-[var(--color-border)] pb-6 md:pb-8">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-text)] mb-2 font-handwritten leading-tight">
              {activeSection.title}
            </h1>
            <p className="text-base text-[var(--color-text-muted)] leading-relaxed font-typewriter">
              {activeSection.summary}
            </p>
          </div>

          {/* On this page (phones and tablets; the sticky outline takes over at lg) */}
          {headings.length > 1 && (
            <details className="lg:hidden mb-6 border-2 border-[var(--color-border-subtle)] rounded-md bg-[var(--color-bg-elevated)]">
              <summary className="min-h-11 flex items-center px-3 text-sm font-bold font-handwritten cursor-pointer">
                On this page ({headings.length})
              </summary>
              <ul className="px-3 pb-3 flex flex-col">
                {headings.map((heading) => (
                  <li key={heading.id} style={{ paddingLeft: heading.tag === 'h4' ? '12px' : '0px' }}>
                    <a
                      href={`#${heading.id}`}
                      onClick={(e) => {
                        e.preventDefault();
                        document.getElementById(heading.id)?.scrollIntoView({ behavior: 'smooth' });
                      }}
                      className="flex items-start gap-1 py-2 text-sm text-[var(--color-text-muted)]"
                    >
                      <Hash size={12} className="mt-1 shrink-0" />
                      <span>{heading.text}</span>
                    </a>
                  </li>
                ))}
              </ul>
            </details>
          )}

          {/* Render Content */}
          <div
            className="docs-content"
            onClick={handleContentClick}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
          
          {/* Navigation Helper Buttons */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 mt-12 md:mt-16 pt-6 md:pt-8 border-t border-[var(--color-border)]">
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
                      className="flex flex-col items-start w-full sm:w-auto p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent-light)] bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] cursor-pointer text-left max-w-[45%]"
                    >
                      <span className="text-[10px] text-[var(--color-text-dim)] font-semibold uppercase tracking-wider mb-1">Previous</span>
                      <span className="text-sm font-bold text-[var(--color-text)] leading-snug line-clamp-1">{prevSec.title}</span>
                    </button>
                  ) : (
                    <div className="hidden sm:block" />
                  )}
                  {nextSec ? (
                    <button
                      onClick={() => selectSection(nextSec.id)}
                      className="flex flex-col items-end w-full sm:w-auto p-3 rounded-lg border border-[var(--color-border)] hover:border-[var(--color-accent-light)] bg-[var(--color-bg-card)] hover:bg-[var(--color-bg-card-hover)] cursor-pointer text-right max-w-[45%]"
                    >
                      <span className="text-[10px] text-[var(--color-text-dim)] font-semibold uppercase tracking-wider mb-1">Next</span>
                      <span className="text-sm font-bold text-[var(--color-text)] leading-snug line-clamp-1">{nextSec.title}</span>
                    </button>
                  ) : (
                    <div className="hidden sm:block" />
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
                  className="text-xs text-[var(--color-text-muted)] hover:text-[var(--color-text)] transition-colors flex items-start gap-1 group py-0.5 line-clamp-2"
                >
                  <Hash size={10} className="text-[var(--color-text-dim)] mt-0.5 shrink-0 group-hover:text-[var(--color-accent-dark)] transition-colors" />
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
