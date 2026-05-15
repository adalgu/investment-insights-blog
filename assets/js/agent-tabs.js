/**
 * Agent Tabs — WAI-ARIA Tabs Pattern (automatic activation)
 *
 * Single post에서 본문 헤딩 `# 🌑 흑 에이전트` / `# ⚪ 백 에이전트`를 찾아
 * 전체/흑/백 3개의 탭으로 분할 표시한다.
 *
 * 접근성:
 * - role="tablist" / role="tab" / role="tabpanel"
 * - aria-controls, aria-selected, aria-labelledby
 * - tabindex roving (활성 탭만 0, 나머지 -1)
 * - 키보드: ←/→ 탭 이동, Home/End 처음/끝, Enter/Space 활성화 (automatic activation)
 * - aria-label로 SR이 이모지를 읽지 않고 텍스트만 읽도록 명시
 *
 * 초기 상태:
 * - URL hash(#black / #white / #흑 / #백)로 시작 탭 결정
 */
(function () {
  'use strict';

  var content = document.querySelector('.post-content');
  if (!content) return;

  /* 1. 본문에서 흑/백 에이전트 헤딩 탐색 */
  var headings = Array.prototype.slice.call(content.querySelectorAll('h1'));
  var blackH = null;
  var whiteH = null;
  headings.forEach(function (h) {
    var t = h.textContent || '';
    if (!blackH && t.indexOf('흑 에이전트') !== -1) blackH = h;
    if (!whiteH && t.indexOf('백 에이전트') !== -1) whiteH = h;
  });
  if (!blackH || !whiteH) return;

  /* 2. 각 자식 요소에 섹션 태그 부여 (intro/black/white) */
  var children = Array.prototype.slice.call(content.children);
  var blackIdx = children.indexOf(blackH);
  var whiteIdx = children.indexOf(whiteH);
  children.forEach(function (el, i) {
    if (i >= whiteIdx) el.dataset.agentSection = 'white';
    else if (i >= blackIdx) el.dataset.agentSection = 'black';
    else el.dataset.agentSection = 'intro';
  });

  /* 3. 탭 정의 — 이모지는 시각용, aria-label은 SR용 텍스트 */
  var TAB_DEFS = [
    { key: 'all',   emoji: '📋', label: '전체 보기',   aria: '전체 보기' },
    { key: 'black', emoji: '🌑', label: '흑 에이전트', aria: '흑 에이전트' },
    { key: 'white', emoji: '⚪', label: '백 에이전트', aria: '백 에이전트' }
  ];

  /* 4. tablist 생성 */
  var tablist = document.createElement('div');
  tablist.className = 'agent-tabs';
  tablist.setAttribute('role', 'tablist');
  tablist.setAttribute('aria-label', '에이전트 관점 선택');

  var tabButtons = TAB_DEFS.map(function (def) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'agent-tab';
    btn.id = 'agent-tab-' + def.key;
    btn.dataset.show = def.key;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-controls', 'agent-panel-' + def.key);
    btn.setAttribute('aria-selected', 'false');
    btn.setAttribute('aria-label', def.aria);
    btn.setAttribute('tabindex', '-1');
    /* aria-hidden=true로 이모지 노드를 SR이 읽지 않게 차단 */
    btn.innerHTML =
      '<span aria-hidden="true">' + def.emoji + '</span> ' +
      '<span>' + def.label + '</span>';
    tablist.appendChild(btn);
    return btn;
  });

  content.insertBefore(tablist, content.firstChild);

  /* 5. 가상 tabpanel wrapper 부여
   *    - 실제 DOM 구조를 깨지 않기 위해 헤딩에 role=tabpanel을 직접 달지 않고,
   *      각 섹션의 첫 요소(첫 등장하는 흑/백 헤딩, intro의 경우 tablist 자기 자신)에
   *      role="tabpanel" + aria-labelledby + id 를 부여한다.
   *    - 'all' 패널은 .post-content 자체를 라벨한다. */
  var panelTargets = {
    all:   content,            /* 전체 패널은 본문 컨테이너 */
    black: blackH,
    white: whiteH
  };
  Object.keys(panelTargets).forEach(function (key) {
    var el = panelTargets[key];
    if (!el) return;
    el.setAttribute('role', 'tabpanel');
    el.id = 'agent-panel-' + key;
    el.setAttribute('aria-labelledby', 'agent-tab-' + key);
    /* 활성 패널이 아닐 때 키보드 포커스에서 빠지도록 */
    if (!el.hasAttribute('tabindex')) el.setAttribute('tabindex', '0');
  });

  /* 6. 표시 토글 */
  function showTab(tabKey, opts) {
    opts = opts || {};
    tabButtons.forEach(function (b) {
      var active = b.dataset.show === tabKey;
      b.classList.toggle('active', active);
      b.setAttribute('aria-selected', active ? 'true' : 'false');
      b.setAttribute('tabindex', active ? '0' : '-1');
    });

    children.forEach(function (el) {
      var s = el.dataset.agentSection;
      if (!s) return;
      if (tabKey === 'all') {
        el.style.display = '';
      } else if (s === 'intro') {
        el.style.display = '';
      } else {
        el.style.display = (s === tabKey) ? '' : 'none';
      }
    });

    /* 패널 hidden 토글 (all일 땐 모두 보임) */
    if (panelTargets.black) {
      panelTargets.black.hidden = !(tabKey === 'all' || tabKey === 'black');
    }
    if (panelTargets.white) {
      panelTargets.white.hidden = !(tabKey === 'all' || tabKey === 'white');
    }
    /* all 패널(content)은 항상 보임 (그 안에서 children별 display로 제어) */

    /* URL hash 갱신 (스크롤 없이) */
    if (history.replaceState) {
      history.replaceState(
        null,
        '',
        tabKey === 'all' ? location.pathname : location.pathname + '#' + tabKey
      );
    }

    if (opts.focus) {
      var activeBtn = tabButtons.find(function (b) { return b.dataset.show === tabKey; });
      if (activeBtn) activeBtn.focus();
    }
  }

  /* 7. 클릭 활성화 */
  tablist.addEventListener('click', function (e) {
    var btn = e.target.closest('.agent-tab');
    if (btn) showTab(btn.dataset.show);
  });

  /* 8. 키보드 — automatic activation 패턴 */
  tablist.addEventListener('keydown', function (e) {
    var current = tabButtons.findIndex(function (b) {
      return b.getAttribute('aria-selected') === 'true';
    });
    if (current < 0) current = 0;

    var next = -1;
    switch (e.key) {
      case 'ArrowRight':
        next = (current + 1) % tabButtons.length;
        break;
      case 'ArrowLeft':
        next = (current - 1 + tabButtons.length) % tabButtons.length;
        break;
      case 'Home':
        next = 0;
        break;
      case 'End':
        next = tabButtons.length - 1;
        break;
      case 'Enter':
      case ' ':
      case 'Spacebar':
        /* 이미 활성 탭이면 무시. automatic activation이라 보통 도착 즉시 활성화되지만
         * focus만 이동한 상태에서 Enter/Space를 친 경우를 위해 안전망. */
        var focused = document.activeElement;
        if (focused && focused.classList && focused.classList.contains('agent-tab')) {
          e.preventDefault();
          showTab(focused.dataset.show, { focus: true });
        }
        return;
      default:
        return;
    }

    if (next >= 0) {
      e.preventDefault();
      showTab(tabButtons[next].dataset.show, { focus: true });
    }
  });

  /* 9. 초기 상태 — URL hash 기반 */
  var hash = (location.hash || '').toLowerCase();
  var initial = 'all';
  var scrollTarget = null;
  if (hash.indexOf('black') !== -1 || hash.indexOf('흑') !== -1) {
    initial = 'black';
    scrollTarget = blackH;
  } else if (hash.indexOf('white') !== -1 || hash.indexOf('백') !== -1) {
    initial = 'white';
    scrollTarget = whiteH;
  }
  showTab(initial);
  if (scrollTarget) {
    setTimeout(function () {
      scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 80);
  }
})();
