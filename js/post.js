/**
 * post.js
 * URL의 #id 해시를 읽어 data/{id}.json을 fetch하고
 * about/post 페이지를 렌더링합니다.
 */

function getPostId() {
  return window.location.hash.replace('#', '') || null;
}

function tagsHtml(tags = []) {
  return (tags || []).map(t => `<span class="tag">${t}</span>`).join('');
}

/* ── 섹션 렌더링 ── */
function renderSection(sec, idx) {
  const num = String(idx + 1).padStart(2, '0');

  if (sec.type === 'timeline') {
    const items = (sec.items || []).map(item => `
      <div class="timeline-item">
        <div class="timeline-period">${(item.period || '').replace(/\n/g, '<br>')}</div>
        <div>
          <div class="timeline-role">${item.role || ''}</div>
          <div class="timeline-org">${item.org ? '// ' + item.org : ''}</div>
          <p class="timeline-desc">${item.desc || ''}</p>
          <div class="timeline-tags">${tagsHtml(item.tags)}</div>
        </div>
      </div>`).join('');

    return `
      <div class="post-section">
        <div class="post-section-head">
          <div class="post-section-num">${num}</div>
          <div class="post-section-line"></div>
          <div class="post-section-label">${sec.label || ''}</div>
        </div>
        ${items}
      </div>`;
  }

  if (sec.type === 'posts') {
    const items = (sec.items || []).map(item => `
      <a class="post-list-item" href="${item.href || '#'}">
        <div class="post-list-date">${item.date || ''}</div>
        <div>
          <div class="post-list-title">${item.title || ''}</div>
          <p class="post-list-excerpt">${item.excerpt || ''}</p>
          <div class="timeline-tags" style="margin-top:10px;">${tagsHtml(item.tags)}</div>
        </div>
        <div class="post-list-arrow">→</div>
      </a>`).join('');

    return `
      <div class="post-section">
        <div class="post-section-head">
          <div class="post-section-num">${num}</div>
          <div class="post-section-line"></div>
          <div class="post-section-label">${sec.label || ''}</div>
        </div>
        ${items}
      </div>`;
  }

  return '';
}

/* ── 메인 초기화 ── */
async function initPostPage() {
  const id = getPostId();

  let data;
  try {
    const res = await fetch(`data/${id}.json`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    data = await res.json();
  } catch (e) {
    document.getElementById('postContent').innerHTML =
      `<div style="padding:80px 0;font-family:var(--font-mono);color:var(--text-muted);">
         data/${id}.json 을 불러오지 못했습니다.<br>${e}
       </div>`;
    await renderHeader(id);
    renderFooter();
    return;
  }

  await renderHeader(id);
  renderFooter();

  /* Hero */
  document.getElementById('postTag').textContent  = data.tag  || '// Profile';
  document.getElementById('postName').innerHTML   = (data.name  || '').replace(/\n/g, '<br>');
  document.getElementById('postDesc').textContent = data.desc  || '';

  /* Sections */
  document.getElementById('postContent').innerHTML =
    (data.sections || []).map((sec, i) => renderSection(sec, i)).join('');
}

document.addEventListener('DOMContentLoaded', initPostPage);