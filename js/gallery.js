/**
 * gallery.js
 * 갤러리 슬라이드, 인디케이터, 자동슬라이드, expand 패널을 담당합니다.
 * project.js가 섹션을 렌더링한 뒤 initGalleries()를 호출합니다.
 */

const galleries = []; // { current, total, autoTimer }

/* ── 슬라이드 이동 ── */
function goToSlide(idx, pos) {
  const g = galleries[idx];
  g.current = (pos + g.total) % g.total;
  document.getElementById('track' + idx).style.transform =
    'translateX(-' + (g.current * 100) + '%)';
  updateCounter(idx);
}

function slideGallery(idx, dir) {
  goToSlide(idx, galleries[idx].current + dir);
  resetAuto(idx);
}

/* ── 카운터 & 인디케이터 ── */
function updateCounter(idx) {
  const g = galleries[idx];
  const el = document.getElementById('counter' + idx);
  if (el) el.textContent = (g.current + 1) + ' / ' + g.total;
  renderIndicators(idx);
}

function renderIndicators(idx) {
  const wrap = document.getElementById('indicators' + idx);
  if (!wrap) return;
  const g = galleries[idx];
  wrap.innerHTML = '';
  for (let i = 0; i < g.total; i++) {
    const d = document.createElement('div');
    d.className = 'slide-indicator' + (i === g.current ? ' active' : '');
    d.onclick = () => { goToSlide(idx, i); resetAuto(idx); };
    wrap.appendChild(d);
  }
}

/* ── 자동 슬라이드 ── */
function startAuto(idx) {
  galleries[idx].autoTimer = setInterval(
    () => goToSlide(idx, galleries[idx].current + 1),
    4000
  );
}

function resetAuto(idx) {
  clearInterval(galleries[idx].autoTimer);
  startAuto(idx);
}

/* ── Expand 패널 ── */
function toggleSection(idx) {
  const btn     = document.getElementById('expandBtn'   + idx);
  const panel   = document.getElementById('expandPanel' + idx);
  const wrapper = panel ? panel.closest('.section-wrapper') : null;
  if (!btn || !panel) return;
  const isOpen = panel.classList.contains('open');

  btn.classList.toggle('open',   !isOpen);
  wrapper && wrapper.classList.toggle('expanded', !isOpen);

  if (!isOpen) {
    // 열기 — 실제 높이 측정 후 적용
    panel.classList.add('open');
    const inner = panel.querySelector('.section-expand-inner');
    const h = inner ? inner.scrollHeight + 56 : 600; // padding 여유
    panel.style.maxHeight = h + 'px';
  } else {
    // 닫기
    panel.style.maxHeight = '0px';
    panel.classList.remove('open');
  }
}

/* ── 초기화 (project.js에서 호출) ── */
function initGalleries(sectionCount) {
  galleries.length = 0;
  for (let i = 0; i < sectionCount; i++) {
    const track = document.getElementById('track' + i);
    const total = track ? track.children.length : 0;
    galleries.push({ current: 0, total, autoTimer: null });
    renderIndicators(i);
    updateCounter(i);
    startAuto(i);
  }
  // 레이아웃 재계산 트리거 (chrome 높이 측정 가능해진 시점)
  document.dispatchEvent(new CustomEvent('galleriesReady'));
}

/* ── Description drawer ── */
let descOpen = false;

function toggleDesc() {
  descOpen = !descOpen;
  document.getElementById('descDrawer').classList.toggle('open', descOpen);
}