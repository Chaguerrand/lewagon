/* ═══════════════════════════════════════════════════════
   Le Wagon Notes — Navigation & Interactions
   ═══════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initActiveLink();
  initCopyButtons();
  initScrollProgress();
  initScrollToTop();
  initTocHighlight();
  initSearch();
  initPageTabs();
});

/* ── Mobile Menu ───────────────────────────────────────── */
function initMobileMenu() {
  const btn = document.querySelector('.mobile-menu-btn');
  const sidebar = document.querySelector('.sidebar');
  const backdrop = document.querySelector('.sidebar-backdrop');
  const closeBtn = document.querySelector('.sidebar-close-btn');

  if (!btn || !sidebar) return;

  function open() {
    sidebar.classList.add('open');
    if (backdrop) {
      backdrop.style.display = 'block';
      requestAnimationFrame(() => backdrop.classList.add('active'));
    }
    document.body.style.overflow = 'hidden';
  }

  function close() {
    sidebar.classList.remove('open');
    if (backdrop) {
      backdrop.classList.remove('active');
      setTimeout(() => { backdrop.style.display = 'none'; }, 300);
    }
    document.body.style.overflow = '';
  }

  btn.addEventListener('click', open);
  if (backdrop) backdrop.addEventListener('click', close);
  if (closeBtn) closeBtn.addEventListener('click', close);
}

/* ── Active Sidebar Link ───────────────────────────────── */
function initActiveLink() {
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll('.nav-links a');

  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Match by filename
    const linkFile = href.split('/').pop();
    const currentFile = currentPath.split('/').pop();

    if (linkFile === currentFile) {
      link.classList.add('active');
      // Scroll sidebar to show active link
      setTimeout(() => {
        link.scrollIntoView({ block: 'center', behavior: 'smooth' });
      }, 100);
    }
  });
}

/* ── Copy Code Buttons ─────────────────────────────────── */
function initCopyButtons() {
  document.querySelectorAll('.code-copy-btn').forEach(btn => {
    btn.addEventListener('click', async () => {
      const wrapper = btn.closest('.code-block-wrapper');
      const code = wrapper.querySelector('code');
      if (!code) return;

      try {
        await navigator.clipboard.writeText(code.textContent);
        btn.classList.add('copied');
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Copie !`;

        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copier`;
        }, 1500);
      } catch {
        // Fallback for file:// protocol
        const textarea = document.createElement('textarea');
        textarea.value = code.textContent;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);

        btn.classList.add('copied');
        btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg> Copie !`;
        setTimeout(() => {
          btn.classList.remove('copied');
          btn.innerHTML = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copier`;
        }, 1500);
      }
    });
  });
}

/* ── Scroll Progress Bar ───────────────────────────────── */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
}

/* ── Scroll to Top Button ──────────────────────────────── */
function initScrollToTop() {
  const btn = document.querySelector('.scroll-top-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ── TOC Highlight (IntersectionObserver) ──────────────── */
function initTocHighlight() {
  const tocLinks = document.querySelectorAll('.toc a');
  if (tocLinks.length === 0) return;

  const headings = [];
  tocLinks.forEach(link => {
    const id = link.getAttribute('href')?.replace('#', '');
    if (id) {
      const el = document.getElementById(id);
      if (el) headings.push({ el, link });
    }
  });

  if (headings.length === 0) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tocLinks.forEach(l => l.classList.remove('toc-active'));
        const match = headings.find(h => h.el === entry.target);
        if (match) match.link.classList.add('toc-active');
      }
    });
  }, {
    rootMargin: '-80px 0px -70% 0px',
    threshold: 0
  });

  headings.forEach(h => observer.observe(h.el));
}

/* ── Index Page Search ─────────────────────────────────── */
function initSearch() {
  const input = document.querySelector('.index-search input');
  if (!input) return;

  const cards = document.querySelectorAll('.index-card');

  input.addEventListener('input', () => {
    const query = input.value.toLowerCase().trim();

    cards.forEach(card => {
      if (!query) {
        card.style.display = '';
        card.querySelectorAll('.index-card-links li').forEach(li => {
          li.style.display = '';
        });
        return;
      }

      const title = card.querySelector('.index-card-title')?.textContent.toLowerCase() || '';
      const links = card.querySelectorAll('.index-card-links a');
      let hasMatch = title.includes(query);

      links.forEach(link => {
        const text = link.textContent.toLowerCase();
        const match = text.includes(query);
        link.closest('li').style.display = match ? '' : 'none';
        if (match) hasMatch = true;
      });

      card.style.display = hasMatch ? '' : 'none';
    });
  });
}

/* ── Page Tabs (Cours le Wagon / Synthèse enrichie) ────── */
function initPageTabs() {
  const tabs = document.querySelectorAll('.page-tab');
  if (!tabs.length) return;

  function activate(target) {
    document.querySelectorAll('.page-tab').forEach(t => {
      const isActive = t.dataset.tab === target;
      t.classList.toggle('active', isActive);
      t.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });
    document.querySelectorAll('.tab-content').forEach(c => {
      c.classList.toggle('active', c.dataset.tabContent === target);
    });
    // Les TOCs sont maintenant DANS les sections → plus besoin de toggler .tab-toc

    // Re-render KaTeX dans la section nouvellement visible
    if (window.renderMathInElement) {
      const visible = document.querySelector('.tab-content.active');
      if (visible) {
        try {
          renderMathInElement(visible, {
            delimiters: [
              { left: '$$', right: '$$', display: true },
              { left: '$',  right: '$',  display: false }
            ],
            throwOnError: false
          });
        } catch (e) { /* noop */ }
      }
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => activate(tab.dataset.tab));
  });
}
