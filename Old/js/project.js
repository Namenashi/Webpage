/**
 * project.js
 * URL의 ?id=파라미터를 읽어 data/{id}.json을 fetch하고
 * 프로젝트 페이지 전체를 렌더링합니다.
 */

/* ── URL에서 ?id= 읽기 ── */
function getProjectId() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id') || 'alpha'; // 기본값 alpha
}

/* ── 태그 HTML ── */
function tagsHtml(tags = []) {
  return tags.map(t =>
    `<span class="tag${t.accent ? ' accent' : ''}">${t.label}</span>`
  ).join('');
}

/* ── 슬라이드 HTML ── */
function slideHtml(slide) {
  const bg = slide.src ? '#1a1a1a' : (slide.bg || '#1a1a1a');
  const img = slide.src
    ? `<img src="${slide.src}" alt="${slide.caption || ''}">`
    : '';
  return `
    <div class="gallery-slide" style="background:${bg};">
      ${img}
      <div class="slide-label">${slide.caption || ''}</div>
    </div>`;
}

/* ── 섹션 HTML ── */
function sectionHtml(sec, sIdx) {
  const num        = String(sIdx + 1).padStart(2, '0');
  const titleLines = (sec.expand.title || '').split('\n').join('<br>');
  const total      = sec.slides.length;

  const divider = sIdx > 0 ? `
    <div class="section-divider">
      <div class="section-divider-num">${num}</div>
      <div class="section-divider-line"></div>
      <div class="section-divider-label">${sec.label}</div>
      <div class="crosshair"></div>
    </div>` : '';

  return `
    <div class="section-wrapper">
      <div class="section-divider">
        <div class="section-divider-num">${num}</div>
        <div class="section-divider-line"></div>
        <div class="section-divider-label">${sec.label}</div>
        <div class="crosshair"></div>
      </div>
      <div class="gallery-section" id="gallerySection${sIdx}">
        <div class="gallery-viewport">
          <div class="corner-deco tl"></div>
          <div class="corner-deco tr"></div>
          <div class="corner-deco bl"></div>
          <div class="corner-deco br"></div>
          <div class="gallery-track" id="track${sIdx}">
            ${sec.slides.map(s => slideHtml(s)).join('')}
          </div>
        </div>

        <div class="gallery-nav">
          <div style="display:flex;align-items:center;gap:10px;">
            <div class="crosshair"></div>
            <span style="font-family:var(--font-mono);font-size:9px;color:var(--text-muted);
                         letter-spacing:0.15em;text-transform:uppercase;">
              SECTION ${num} — ${sec.label}
            </span>
            <button class="section-expand-btn" id="expandBtn${sIdx}"
                    onclick="toggleSection(${sIdx})" title="설명 펼치기">
              <div class="plus-h"></div>
              <div class="plus-v"></div>
            </button>
          </div>
          <div class="gallery-counter">
            <button class="gallery-arrow" onclick="slideGallery(${sIdx},-1)">
              <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>
            </button>
            <span id="counter${sIdx}">1 / ${total}</span>
            <button class="gallery-arrow" onclick="slideGallery(${sIdx},1)">
              <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
          </div>
        </div>

        <div style="padding:0 16px 12px;display:flex;gap:6px;flex-shrink:0;" id="indicators${sIdx}"></div>
      </div>

      <div class="section-expand-panel" id="expandPanel${sIdx}">
        <div class="section-expand-inner">
          <div class="expand-col">
            <div class="expand-col-label">Overview</div>
            <div class="expand-col-title">${titleLines}</div>
            <p class="expand-col-text">${sec.expand.text || ''}</p>
            <div class="expand-tags">${tagsHtml(sec.expand.tags)}</div>
          </div>
          <div class="expand-col">
            <div class="expand-col-label">Notes</div>
            <p class="expand-col-text" style="margin-top:4px;">${sec.expand.notes || ''}</p>
          </div>
        </div>
      </div>
    </div>`;
}

/* ── Left panel 렌더링 ── */
function renderLeftPanel(p) {
  document.getElementById('leftTitle').textContent    = p.title    || '';
  document.getElementById('leftStatus').textContent   = p.status   || '';
  document.getElementById('leftTheme').textContent    = p.theme    || '';
  document.getElementById('leftCategory').textContent = p.category || '';
  document.getElementById('leftYear').textContent     = p.year     || '';
  document.getElementById('leftIndex').textContent    = p.index    || '';
  document.getElementById('leftProgressFill').style.width = (p.progress || 0) + '%';
  document.getElementById('leftProgressLabel').textContent = (p.progress || 0) + '%';
}

/* ── Description drawer 렌더링 ── */
function renderDescDrawer(d) {
  document.getElementById('descTitle').innerHTML =
    (d.title || '').split('\n').join('<br>');
  document.getElementById('descTagsWrap').innerHTML  = tagsHtml(d.tags || []);
  document.getElementById('descText').textContent    = d.text  || '';
  document.getElementById('descNotes').textContent   = d.notes || '';
  document.getElementById('descSpecTable').innerHTML = (d.specs || []).map(s => `
    <div class="spec-row">
      <div class="spec-key">${s.key}</div>
      <div class="spec-val">${s.val}</div>
    </div>`).join('');
}

/* ── 메인 진입점 ── */
async function initProjectPage() {
  const id = getProjectId();

  let data;
  try {
    const res = await fetch(`data/${id}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (e) {
    document.getElementById('content-mount').innerHTML =
      `<div style="padding:80px 40px;font-family:var(--font-mono);color:var(--text-muted);">
         data/${id}.json 을 불러오지 못했습니다.<br>${e}
       </div>`;
    return;
  }

  /* 헤더 active 상태 업데이트 */
  await renderHeader(id);
  renderFooter();

  /* Left panel */
  renderLeftPanel(data);

  /* Description drawer */
  renderDescDrawer(data.description || {});

  /* 섹션 렌더링 */
  document.getElementById('content-mount').innerHTML =
    (data.sections || []).map((sec, i) => sectionHtml(sec, i)).join('');

  /* 갤러리 초기화 */
  initGalleries(data.sections.length);
}

/* 페이지 로드 시 실행 */
document.addEventListener('DOMContentLoaded', initProjectPage);
