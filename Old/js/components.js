/**
 * components.js
 * 헤더(nav)와 푸터를 렌더링합니다.
 * 모든 페이지에서 공통으로 사용됩니다.
 */

/* ── nav.json에서 메뉴 읽어서 헤더 렌더링 ── */
async function renderHeader(activeId = null) {
  const mount = document.getElementById('header-mount');
  if (!mount) return;

  let navItems = [];
  try {
    const res = await fetch('data/nav.json');
    navItems = await res.json();
  } catch (e) {
    console.warn('nav.json을 불러오지 못했습니다.', e);
  }

  const menuHtml = navItems.map(item => `
    <li class="${item.id === activeId ? 'active' : ''}" onclick="location.href='${item.href}'">
      <div class="nav-bar"></div>
      <span>${item.label}</span>
    </li>
  `).join('');

  mount.innerHTML = `
    <nav>
      <a class="nav-logo" href="index.html">
        <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
          <!-- 로고 자리: 실제 로고 SVG path로 교체하세요 -->
          <rect width="36" height="36" fill="#F0C400"/>
          <rect x="4" y="4" width="28" height="28" fill="none" stroke="#111" stroke-width="1"/>
        </svg>
      </a>
      <ul class="nav-menu">
        ${menuHtml}
      </ul>
      <div class="nav-color-strip">
        <div style="background: var(--accent)"></div>
        <div style="background: var(--text-primary)"></div>
        <div style="background: var(--bg)"></div>
      </div>
    </nav>
  `;
}

/* ── 푸터 렌더링 ── */
function renderFooter() {
  const mount = document.getElementById('footer-mount');
  if (!mount) return;

  mount.innerHTML = `
    <footer>
      <div class="footer-logo">
        <!-- 로고 자리: 실제 로고 SVG로 교체하세요 -->
        <div class="footer-logo-mark"></div>
        <div class="footer-name">YOUR STUDIO</div>
      </div>
      <div class="footer-tagline">Portfolio — Projects &amp; Works</div>
      <div class="footer-divider"></div>
      <div class="footer-links">
        <a href="#">Contact</a>
        <a href="#">GitHub</a>
        <a href="#">Privacy</a>
      </div>
    </footer>
  `;
}
