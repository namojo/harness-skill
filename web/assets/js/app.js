/* ===============================================
   Harness Meetup #2 · Workshop SPA
   - Hash router: #/, #/setup, #/lab/N, #/recap, #/close, #/deep-dive
   - Tabs, code viewer, prompt copy
   =============================================== */

const LABS = [
  { id: 1, name: 'changelog-generator', pattern: 'Skill · Progressive Loading',
    title: '인터뷰 녹취록 정제 스킬',
    desc: '한 줄 발화로 5개 산출물. Skill의 YAML이 곧 트리거다.' },
  { id: 2, name: 'interview-analyst', pattern: 'Agent · Role + I/O',
    title: '인사이트 추출 에이전트',
    desc: 'Role · Principles · I/O · Tools 네 요소로 변덕을 잡는다.' },
  { id: 3, name: 'blog-pipeline', pattern: 'Pattern 1 · Pipeline',
    title: '블로그 자동화 파이프라인',
    desc: '5개 에이전트 순차 실행. 가장 느린 단계가 전체 속도를 정한다.' },
  { id: 4, name: 'code-review-team', pattern: 'Pattern 2 · Fan-out / Fan-in',
    title: '4 관점 동시 코드 리뷰',
    desc: '4명 병렬 + merger 1명. 종합자가 천장이다.' },
  { id: 5, name: 'internal-helpdesk', pattern: 'Pattern 3 · Expert Pool',
    title: '사내 통합 헬프데스크',
    desc: '한 명에게만. 토큰 비용 1/N. 추측보다 되묻기.' },
  { id: 6, name: 'andy-style-loop', pattern: 'Pattern 4 · Producer-Reviewer',
    title: '앤디 스타일 품질 루프',
    desc: '통과될 때까지 다시 쓰기. 종료 조건이 살아 있어야 한다.' },
  { id: 7, name: 'cs-supervisor', pattern: 'Pattern 5 · Supervisor',
    title: 'CS 케이스 동적 라우팅',
    desc: '다음 단계가 앞 결과에 따라 달라진다. 매니저 패턴.' },
  { id: 8, name: 'campaign-org', pattern: 'Pattern 6 · Hierarchical',
    title: '마케팅 캠페인 2단 위임',
    desc: '워커에는 직접 일을 시키지 않는다. sub-supervisor를 거친다.' },
];

const $ = (sel, el = document) => el.querySelector(sel);
const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
const el = (tag, attrs = {}, ...children) => {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'class') e.className = v;
    else if (k === 'html') e.innerHTML = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2).toLowerCase(), v);
    else e.setAttribute(k, v);
  }
  for (const c of children) {
    if (c == null) continue;
    e.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
  }
  return e;
};
const esc = (s) => String(s).replace(/[&<>"']/g, c => ({
  '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
}[c]));

/* ---------- minimal syntax highlighter ---------- */
function hlYaml(src) {
  return esc(src)
    .replace(/^(---)$/gm, '<span class="tok-pn">$1</span>')
    .replace(/^(\s*)([a-zA-Z_][\w-]*)(:)/gm, '$1<span class="tok-key">$2</span><span class="tok-pn">$3</span>')
    .replace(/(["'`])(.*?)\1/g, '<span class="tok-str">$1$2$1</span>')
    .replace(/^(\s*)(#.*)$/gm, '$1<span class="tok-cmt">$2</span>');
}
function hlMd(src) {
  let s = esc(src);
  s = s.replace(/^(---[\s\S]*?---)/, (m) => `<span class="tok-pn">${hlYamlInside(m)}</span>`);
  s = s.replace(/^(#{1,6}\s.+)$/gm, '<span class="tok-hd">$1</span>');
  s = s.replace(/(`[^`\n]+`)/g, '<span class="tok-str">$1</span>');
  s = s.replace(/^(\s*[-*]\s)/gm, '<span class="tok-pn">$1</span>');
  s = s.replace(/^(\s*\d+\.\s)/gm, '<span class="tok-pn">$1</span>');
  return s;
}
function hlYamlInside(src) {
  return esc(src)
    .replace(/^(\s*)([a-zA-Z_][\w-]*)(:)/gm, '$1<span class="tok-key">$2</span><span class="tok-pn">$3</span>')
    .replace(/(["'`])(.*?)\1/g, '<span class="tok-str">$1$2$1</span>')
    .replace(/^(\s*)(#.*)$/gm, '$1<span class="tok-cmt">$2</span>');
}
function hlJson(src) {
  return esc(src)
    .replace(/(".*?")(\s*:)/g, '<span class="tok-key">$1</span>$2')
    .replace(/:\s*(".*?")/g, ': <span class="tok-str">$1</span>')
    .replace(/\b(true|false|null)\b/g, '<span class="tok-num">$1</span>')
    .replace(/:\s*(-?\d+(\.\d+)?)/g, ': <span class="tok-num">$1</span>');
}
function hlDiff(src) {
  return esc(src).split('\n').map(line => {
    if (line.startsWith('+')) return `<span class="tok-str">${line}</span>`;
    if (line.startsWith('-')) return `<span class="tok-fn">${line}</span>`;
    if (line.startsWith('@@')) return `<span class="tok-cmt">${line}</span>`;
    return line;
  }).join('\n');
}
function highlight(code, lang) {
  if (lang === 'yaml' || lang === 'yml') return hlYaml(code);
  if (lang === 'md' || lang === 'markdown') return hlMd(code);
  if (lang === 'json') return hlJson(code);
  if (lang === 'diff') return hlDiff(code);
  if (lang === 'jsonl') {
    return code.split('\n').map(l => hlJson(l)).join('\n');
  }
  return esc(code);
}

/* ---------- copy button ---------- */
function copyBtn(text) {
  const btn = el('button', { class: 'copy-btn' }, '복사');
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(text);
      btn.classList.add('copied');
      btn.textContent = '복사됨 ✓';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.textContent = '복사';
      }, 1600);
    } catch (e) {
      btn.textContent = '실패';
    }
  });
  return btn;
}

/* ---------- tabs ---------- */
function makeTabs(items) {
  // items: [{ id, label, render(panelEl) }]
  const wrap = el('div', { class: 'tab-wrap' });
  const bar = el('div', { class: 'tabs' });
  const panels = el('div', { class: 'tab-panels' });
  items.forEach((it, i) => {
    const btn = el('button', { class: 'tab' + (i === 0 ? ' active' : ''), 'data-tab': it.id }, it.label);
    const panel = el('div', { class: 'tab-panel' + (i === 0 ? ' active' : ''), 'data-panel': it.id });
    it.render(panel);
    btn.addEventListener('click', () => {
      $$('.tab', bar).forEach(b => b.classList.toggle('active', b === btn));
      $$('.tab-panel', panels).forEach(p => p.classList.toggle('active', p.dataset.panel === it.id));
    });
    bar.appendChild(btn);
    panels.appendChild(panel);
  });
  wrap.appendChild(bar);
  wrap.appendChild(panels);
  return wrap;
}

/* ---------- code viewer ---------- */
function codeViewer(files) {
  // files: [{ path, lang, content }]
  const wrap = el('div', { class: 'code-viewer' });
  const tree = el('div', { class: 'file-tree' });
  const pane = el('div', { class: 'code-pane' });

  // group by top folder
  const groups = {};
  files.forEach(f => {
    const parts = f.path.split('/');
    const folder = parts.slice(0, -1).join('/') || '/';
    (groups[folder] = groups[folder] || []).push(f);
  });

  let activeBtn = null;
  function show(f, btn) {
    if (activeBtn) activeBtn.classList.remove('active');
    btn.classList.add('active');
    activeBtn = btn;
    pane.innerHTML = '';
    pane.appendChild(el('div', { class: 'filename' }, f.path));
    const pre = el('pre');
    const code = el('code');
    code.innerHTML = highlight(f.content, f.lang || 'md');
    pre.appendChild(code);
    pane.appendChild(pre);
  }

  Object.entries(groups).forEach(([folder, fs]) => {
    tree.appendChild(el('div', { class: 'tree-folder' }, folder));
    fs.forEach((f, idx) => {
      const fname = f.path.split('/').pop();
      const btn = el('button', { class: 'tree-file' }, fname);
      btn.addEventListener('click', () => show(f, btn));
      tree.appendChild(btn);
      if (idx === 0 && folder === Object.keys(groups)[0]) {
        setTimeout(() => show(f, btn), 0);
      }
    });
  });

  wrap.appendChild(tree);
  wrap.appendChild(pane);
  return wrap;
}

/* ---------- prompt block ---------- */
function promptBlock(text, note) {
  const wrap = el('div', { class: 'prompt-block' });
  const pre = el('pre');
  const code = el('code');
  code.textContent = text;
  pre.appendChild(code);
  pre.appendChild(copyBtn(text));
  wrap.appendChild(pre);
  if (note) wrap.appendChild(el('div', { class: 'callout tip', html: `<span class="callout-label">예상 결과</span>${note}` }));
  return wrap;
}

/* ---------- console replay ---------- */
function consoleBlock(lines) {
  const c = el('div', { class: 'console' });
  c.innerHTML = lines.map(l => {
    if (l.cls) return `<span class="${l.cls}">${esc(l.text)}</span>`;
    return esc(l.text || l);
  }).join('\n');
  return c;
}

/* ---------- file list ---------- */
function fileList(items) {
  const ul = el('ul', { class: 'file-list' });
  items.forEach(it => ul.appendChild(el('li', {}, it)));
  return ul;
}

/* ---------- data lookup (file:// 호환) ---------- */
// 데이터는 data/*.js 파일들이 window.HARNESS_DATA 에 등록한다.
window.HARNESS_DATA = window.HARNESS_DATA || {};
function fetchData(key) {
  // key: 'setup', 'deep-dive', 'recap', 'lab01' ~ 'lab08'
  return Promise.resolve(window.HARNESS_DATA[key] || null);
}

function setActive(route) {
  $$('#nav a').forEach(a => {
    a.classList.toggle('active', a.dataset.route === route);
  });
}

function renderHome(main) {
  main.innerHTML = '';
  main.appendChild(el('div', { class: 'crumbs' }, 'HARNESS · MEETUP #2'));
  main.appendChild(el('h1', {}, '8개 LAB으로 익히는 ', el('span', { style: 'color:var(--accent)' }, 'Agent · Skill')));
  main.appendChild(el('p', { class: 'subtitle' },
    '읽지 말고 직접 만들면서 익힌다. Skill 1 · Agent 1 · 6 가지 아키텍처 패턴. 각 LAB마다 시나리오 → 코드 → 호출 → 결과 → 변형.'));
  main.appendChild(el('div', { class: 'callout', html: '<span class="callout-label">기반</span>github.com/revfactory/harness · 사내 워크숍용 실습 패키지' }));

  const grid = el('div', { class: 'lab-grid' });
  LABS.forEach(lab => {
    const card = el('a', { href: `#/lab/${lab.id}`, class: 'lab-card' });
    card.appendChild(el('div', { class: 'lab-num' }, `LAB ${String(lab.id).padStart(2, '0')}`));
    card.appendChild(el('div', { class: 'lab-title' }, lab.name));
    card.appendChild(el('div', { class: 'lab-pattern' }, lab.pattern));
    card.appendChild(el('div', { class: 'lab-desc' }, lab.desc));
    grid.appendChild(card);
  });
  main.appendChild(el('h2', {}, '8개 LAB'));
  main.appendChild(grid);

  main.appendChild(el('h2', {}, '진행 흐름'));
  main.appendChild(el('p', {}, '강사가 슬라이드 발표 → 해당 LAB 페이지로 이동 → 빌드 탭의 코드 → 실행 탭의 프롬프트 시연 → Try Yourself로 변형 안내.'));
  main.appendChild(el('p', {}, '8개 LAB은 독립이 아니라 누적이다. LAB 01의 스킬은 LAB 03에 꽂히고, LAB 03의 출력은 LAB 06의 입력이 된다.'));
}

function renderSetup(main, data) {
  main.innerHTML = '';
  main.appendChild(el('div', { class: 'crumbs' }, 'SETUP · 슬라이드 3쪽'));
  main.appendChild(el('h1', {}, '시작 전 · 준비물'));
  main.appendChild(el('p', { class: 'subtitle' }, '한 번만 깔아두면 모든 LAB이 굴러간다'));

  if (!data) { main.appendChild(el('div', { class: 'loading' }, '데이터를 불러올 수 없습니다.')); return; }

  data.sections.forEach(sec => {
    main.appendChild(el('h2', {}, sec.title));
    if (sec.desc) main.appendChild(el('p', {}, sec.desc));
    if (sec.code) {
      const wrap = el('div', { class: 'prompt-block' });
      const pre = el('pre');
      const code = el('code');
      code.innerHTML = highlight(sec.code, sec.lang || 'shell');
      pre.appendChild(code);
      pre.appendChild(copyBtn(sec.code));
      wrap.appendChild(pre);
      main.appendChild(wrap);
    }
    if (sec.callout) {
      main.appendChild(el('div', { class: 'callout tip', html: `<span class="callout-label">${sec.callout.label || '안내'}</span>${sec.callout.text}` }));
    }
  });
}

function renderDeepDive(main, data) {
  main.innerHTML = '';
  main.appendChild(el('div', { class: 'crumbs' }, 'DEEP DIVE · 슬라이드 3B–3D쪽'));
  main.appendChild(el('h1', {}, '필수 개념 · Skill / Agent'));
  main.appendChild(el('p', { class: 'subtitle' }, 'LAB 시작 전 알아야 할 3가지'));

  if (!data) { main.appendChild(el('div', { class: 'loading' }, '데이터를 불러올 수 없습니다.')); return; }

  data.concepts.forEach(c => {
    main.appendChild(el('h2', {}, c.title));
    main.appendChild(el('p', { class: 'subtitle' }, c.subtitle));
    if (c.code) {
      const pre = el('pre');
      const code = el('code');
      code.innerHTML = highlight(c.code, c.lang || 'yaml');
      pre.appendChild(code);
      main.appendChild(pre);
    }
    if (c.points) {
      const boxes = el('div', { class: 'box-grid' });
      c.points.forEach(p => {
        const b = el('div', { class: 'box' });
        b.appendChild(el('div', { class: 'box-label' }, p.label));
        b.appendChild(el('div', { class: 'box-title' }, p.title));
        b.appendChild(el('div', {}, p.text));
        boxes.appendChild(b);
      });
      main.appendChild(boxes);
    }
    if (c.callout) {
      main.appendChild(el('div', { class: 'callout', html: `<span class="callout-label">★</span>${c.callout}` }));
    }
  });
}

function renderLab(main, id, data) {
  const lab = LABS.find(l => l.id === id);
  main.innerHTML = '';
  main.appendChild(el('div', { class: 'crumbs' },
    `LAB ${String(id).padStart(2,'0')} `,
    el('span', { class: 'sep' }, '·'),
    lab.pattern
  ));
  main.appendChild(el('h1', {}, lab.name));
  main.appendChild(el('p', { class: 'subtitle' }, lab.title + ' — ' + lab.desc));

  if (!data) {
    main.appendChild(el('div', { class: 'callout warn', html: '<span class="callout-label">준비 중</span>이 Lab의 상세 콘텐츠는 아직 채워지지 않았습니다. <code>web/data/lab' + String(id).padStart(2,'0') + '.json</code> 파일을 추가해 주세요.' }));
    return;
  }

  // Tabs
  const tabs = makeTabs([
    {
      id: 'scenario',
      label: '시나리오',
      render(panel) {
        if (data.diagram) {
          panel.appendChild(el('div', { class: 'diagram' },
            el('img', { src: 'assets/img/' + data.diagram, alt: 'pattern diagram' })
          ));
          if (data.diagramCaption) {
            panel.appendChild(el('div', { class: 'diagram-caption' }, data.diagramCaption));
          }
        }
        if (data.scenario) {
          if (data.scenario.intro) panel.appendChild(el('p', {}, data.scenario.intro));
          if (data.scenario.boxes) {
            const grid = el('div', { class: 'box-grid' });
            data.scenario.boxes.forEach(b => {
              const box = el('div', { class: 'box' + (b.warn ? ' warn' : '') });
              box.appendChild(el('div', { class: 'box-label' }, b.label));
              if (b.title) box.appendChild(el('div', { class: 'box-title' }, b.title));
              box.appendChild(el('div', { html: b.body }));
              grid.appendChild(box);
            });
            panel.appendChild(grid);
          }
          if (data.scenario.principles) {
            panel.appendChild(el('h3', {}, '핵심 원칙 (Principles)'));
            const ol = el('ol');
            data.scenario.principles.forEach(p => ol.appendChild(el('li', {}, p)));
            panel.appendChild(ol);
          }
          if (data.scenario.points) {
            panel.appendChild(el('h3', {}, '익힐 개념'));
            const ul = el('ul');
            data.scenario.points.forEach(p => ul.appendChild(el('li', {}, p)));
            panel.appendChild(ul);
          }
        }
      }
    },
    {
      id: 'build',
      label: '빌드',
      render(panel) {
        if (data.build && data.build.intro) panel.appendChild(el('p', {}, data.build.intro));
        if (data.build && data.build.files) {
          panel.appendChild(codeViewer(data.build.files));
        }
        if (data.build && data.build.notes) {
          data.build.notes.forEach(n => {
            panel.appendChild(el('div', { class: 'callout', html: `<span class="callout-label">${n.label || 'NOTE'}</span>${n.text}` }));
          });
        }
      }
    },
    {
      id: 'run',
      label: '실행',
      render(panel) {
        if (data.run) {
          panel.appendChild(el('h3', {}, '터미널'));
          if (data.run.setup) {
            const pre = el('pre');
            const code = el('code');
            code.innerHTML = highlight(data.run.setup, 'shell');
            pre.appendChild(code);
            pre.appendChild(copyBtn(data.run.setup));
            panel.appendChild(pre);
          }
          panel.appendChild(el('h3', {}, '프롬프트'));
          (data.run.prompts || []).forEach((p, i) => {
            panel.appendChild(el('h4', {}, `${i+1}. ${p.title}`));
            panel.appendChild(promptBlock(p.text, p.note));
          });
          if (data.run.console) {
            panel.appendChild(el('h3', {}, '예상 콘솔 로그'));
            panel.appendChild(consoleBlock(data.run.console));
          }
          if (data.run.expected) {
            panel.appendChild(el('h3', {}, '예상 산출물'));
            panel.appendChild(fileList(data.run.expected));
          }
          if (data.run.snippet) {
            panel.appendChild(el('h3', {}, '주요 산출물 미리보기'));
            data.run.snippet.forEach(s => {
              panel.appendChild(el('h4', {}, s.path));
              const pre = el('pre');
              const code = el('code');
              code.innerHTML = highlight(s.content, s.lang || 'md');
              pre.appendChild(code);
              panel.appendChild(pre);
            });
          }
        }
      }
    },
    {
      id: 'try',
      label: 'Try Yourself',
      render(panel) {
        if (data.tryYourself) {
          if (data.tryYourself.intro) panel.appendChild(el('p', {}, data.tryYourself.intro));
          (data.tryYourself.tasks || []).forEach((t, i) => {
            panel.appendChild(el('h3', {}, `과제 ${i+1}. ${t.title}`));
            if (t.body) panel.appendChild(el('p', {}, t.body));
            if (t.steps) {
              const ol = el('ol');
              t.steps.forEach(s => ol.appendChild(el('li', {}, s)));
              panel.appendChild(ol);
            }
            if (t.prompt) panel.appendChild(promptBlock(t.prompt, t.expect));
          });
        }
      }
    }
  ]);
  main.appendChild(tabs);
}

function renderRecap(main, data) {
  main.innerHTML = '';
  main.appendChild(el('div', { class: 'crumbs' }, 'RECAP · 슬라이드 22쪽'));
  main.appendChild(el('h1', {}, '오늘 손수 만든 8개의 팀'));
  main.appendChild(el('p', { class: 'subtitle' }, '8개의 LAB은 독립이 아니라 누적이었다. LAB 01의 스킬은 LAB 03에 꽂혔고, LAB 03의 출력은 LAB 06의 입력이 됐다.'));

  const grid = el('div', { class: 'lab-grid' });
  LABS.forEach(lab => {
    const card = el('a', { href: `#/lab/${lab.id}`, class: 'lab-card' });
    card.appendChild(el('div', { class: 'lab-num' }, `LAB ${String(lab.id).padStart(2, '0')} ✓`));
    card.appendChild(el('div', { class: 'lab-title' }, lab.name));
    card.appendChild(el('div', { class: 'lab-pattern' }, lab.pattern));
    card.appendChild(el('div', { class: 'lab-desc' }, lab.desc));
    grid.appendChild(card);
  });
  main.appendChild(grid);

  main.appendChild(el('div', { class: 'callout tip', html: '<span class="callout-label">메시지</span>실제 프로젝트도 이렇게 자란다.' }));
}

function renderClose(main) {
  main.innerHTML = '';
  main.appendChild(el('div', { class: 'crumbs' }, 'CLOSE · 슬라이드 26쪽'));
  main.appendChild(el('h1', {}, '제일 중요한 건 해봐야 한다는 것'));
  main.appendChild(el('p', { class: 'subtitle' }, '진짜 학습은 지금부터 — 8개 중 단 하나를 당신의 프로젝트로 옮겨 본다.'));

  main.appendChild(el('h2', {}, 'PICK ONE · 시작점 추천'));
  const grid = el('div', { class: 'box-grid' });
  [
    { label: 'LAB 01', title: 'Skill', text: '반복 작업이 있다면 — 한 번 굳히면 흔들리지 않는다.' },
    { label: 'LAB 02', title: 'Agent', text: '한 가지 일을 하는 페르소나가 필요하면 — 변덕이 잡힌다.' },
    { label: 'LAB 03', title: 'Pipeline', text: '순서가 정해진 워크플로우가 있다면 — 자동화된다.' },
    { label: 'LAB 06', title: 'Producer-Reviewer', text: '품질이 안 잡힌다면 — 통과될 때까지.' }
  ].forEach(b => {
    const box = el('div', { class: 'box' });
    box.appendChild(el('div', { class: 'box-label' }, b.label));
    box.appendChild(el('div', { class: 'box-title' }, b.title));
    box.appendChild(el('div', {}, b.text));
    grid.appendChild(box);
  });
  main.appendChild(grid);

  main.appendChild(el('div', { class: 'callout', html: '<span class="callout-label">한 줄 권유</span>오늘 본 다이어그램은 잊어도 좋다. 폴더 하나 / 파일 하나부터 직접 만들어 볼 것.' }));
}

async function route() {
  const hash = location.hash || '#/';
  const path = hash.slice(1) || '/';
  setActive(path);
  const main = $('#main');
  main.innerHTML = '<div class="loading">Loading…</div>';

  if (path === '/') return renderHome(main);
  if (path === '/setup') {
    const data = await fetchData('setup');
    return renderSetup(main, data);
  }
  if (path === '/deep-dive') {
    const data = await fetchData('deep-dive');
    return renderDeepDive(main, data);
  }
  if (path === '/recap') {
    const data = await fetchData('recap');
    return renderRecap(main, data);
  }
  if (path === '/close') {
    return renderClose(main);
  }
  const m = path.match(/^\/lab\/(\d+)$/);
  if (m) {
    const id = parseInt(m[1], 10);
    if (id < 1 || id > 8) { main.innerHTML = '<h1>404</h1>'; return; }
    const data = await fetchData(`lab${String(id).padStart(2,'0')}`);
    return renderLab(main, id, data);
  }
  // fallback
  renderHome(main);
}

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', route);
