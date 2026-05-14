window.HARNESS_DATA = window.HARNESS_DATA || {};
window.HARNESS_DATA["lab03"] = {
  diagram: "pattern-1-pipeline.svg",
  diagramCaption: "순차 의존 · 단방향 · 5단계",
  scenario: {
    intro: "인터뷰 한 건이 블로그 글 한 편이 되기까지. 19분 음성(혹은 사전 추출 텍스트) 하나가 transcript-agent → interview-analyst → blog-drafter → tone-writer → md-packager 5단계를 거쳐 <code>workspace/post.md</code> 한 개로 떨어진다. 각 단계는 이전 단계의 산출물에 강하게 의존한다 — Pipeline 의 정의 그 자체.",
    boxes: [
      {
        label: "A",
        title: "전제 — 종속 관계가 명확",
        body: "A 가 끝나야 B 가 시작된다. 순서를 어기면 결과가 망가진다. → Pipeline 의 정의 그 자체.",
        warn: false
      },
      {
        label: "B",
        title: "LAB 02 의 에이전트가 재사용된다",
        body: "<code>interview-analyst</code> 는 다시 짜지 않는다. 그대로 파이프라인의 2번째 단계로 꽂힌다. 한 폴더(<code>~/harness-lab/</code>)에 누적된 정의를 인식해 재생성하지 않는다.",
        warn: false
      },
      {
        label: "WHY",
        title: "왜 Pipeline 인가",
        body: "정제 → 분석 → 초안 → 문체 → export 의 순서는 어겨질 수 없다. 분석 없이 초안을 쓸 수 없고, 초안 없이 문체를 정리할 수 없다. 종속 관계가 명확하면 Fan-out 으로 묶을 이유가 없다. Pipeline 의 정확한 사용처.",
        warn: false
      },
      {
        label: "함정",
        title: "I/O 가 다음 단계 Input 과 정확히 맞아야 한다",
        body: "한 단계의 출력 형식이 다음 단계의 Input 형식과 정확히 일치하지 않으면, 파이프라인 중간에서 그 자리에 멈춘다. 형식 불일치는 가장 흔한 실패. <strong>가장 느린 단계가 전체 속도를 정한다.</strong>",
        warn: true
      }
    ],
    principles: [
      "한 단계의 출력이 다음 단계 Input 형식과 정확히 일치한다",
      "5단계 콘솔 로그를 그대로 찍는다 (`[N/5] <agent>: <한 줄>`)",
      "인터뷰 인용·화자 라벨([A]/[B])은 5단계 어디서도 손대지 않는다"
    ],
    points: [
      "Pipeline 은 가장 느린 단계가 전체 속도를 정한다",
      "각 에이전트의 I/O 가 다음 에이전트의 Input 으로 정확히 들어맞아야 한다",
      "LAB 02 의 interview-analyst 를 그대로 재사용 — 한 번 정의된 에이전트는 여러 파이프라인에 꽂힌다"
    ]
  },
  build: {
    intro: "Skill 4개 (오케스트레이터 1 + 보조 스킬 3) + Agent 5개. 메타 스킬 한 줄 호출로 자동 생성되며, LAB 02 의 <code>interview-analyst</code> 는 재사용된다.",
    files: [
      {
        path: ".claude/skills/blog-pipeline/SKILL.md",
        lang: "md",
        content: `---
name: blog-pipeline
description: |
  인터뷰 음성(또는 사전 추출 텍스트)을 한 편의 블로그 마크다운으로 만드는 5단계 풀 파이프라인.
  transcript-agent → interview-analyst → blog-drafter → tone-writer → md-packager 가
  workspace/ 하위에 순번대로 산출물을 쌓아 최종 post.md 를 만든다.
  '블로그 글 만들어줘', '인터뷰 음성을 블로그로', '팟캐스트 글로 풀어줘', '인터뷰 글로 정리',
  '블로그 자동화', '파이프라인 실행', '블로그 초안 작성', '음성 블로그 변환' 등
  인터뷰·팟캐스트 → 블로그 변환 전반에 이 스킬을 반드시 사용한다.
  단, SEO 키워드 최적화, 대표 이미지 생성, 발행 자동화(워드프레스/Notion 업로드)는 이 스킬의 범위가 아니다.
---

# Blog Pipeline — 인터뷰 → 블로그 5단계 파이프라인

음성 한 건이 블로그 한 편이 되기까지의 종속 관계가 명확한 작업을 순차로 묶었다. 슬라이드 14쪽의 5단계 콘솔 로그가 이 스킬의 정상 흐름이다.

\`\`\`
[1/5] transcript-agent   : 19분 음성 → 텍스트
[2/5] interview-analyst  : 발견 3개 추출
[3/5] blog-drafter       : H2 5개의 초안
[4/5] tone-writer        : 문체 정리
[5/5] md-packager        : workspace/post.md 저장
\`\`\`

## 에이전트 구성

| 단계 | 에이전트 | 역할 | 사용 스킬 | 출력 |
|------|----------|------|-----------|------|
| 1 | \`transcript-agent\` | 음성/raw 텍스트 → 정제 텍스트 | \`transcript-clean\` | \`_workspace/01_transcript.md\` |
| 2 | \`interview-analyst\` | 핵심 발견 3개 추출 (LAB 02 재사용) | — | \`_workspace/02_insights.md\` |
| 3 | \`blog-drafter\` | H2 5개 구조의 초안 | \`blog-structure-ko\` | \`_workspace/03_draft.md\` |
| 4 | \`tone-writer\` | 담백한 기술 블로그 톤 정리 | — | \`_workspace/04_toned.md\` |
| 5 | \`md-packager\` | 최종 마크다운 export | \`md-export\` | \`workspace/post.md\` |

## 부분 호출

- 이미 정제 텍스트가 있는 경우 → \`transcript-agent\` 를 건너뛰고 Phase 2 부터 시작.
- 초안만 필요하면 \`blog-drafter\` 까지만 돌리고 \`04\`·\`05\` 는 생략 가능.

## 작업 원칙

- 한 단계의 출력이 다음 단계의 Input 형식과 정확히 일치한다. 형식이 맞지 않으면 그 자리에서 멈추고 사용자에게 보고한다.
- 5단계 콘솔 로그를 그대로 찍는다(\`[N/5] <agent>: <한 줄>\`).
- 인터뷰 인용은 5단계 어디서도 임의로 다듬지 않는다. 화자 라벨([A]/[B])을 보존한다.
- 모든 산출물은 한국어 격식체. 코드 식별자만 영문 유지.

...(이하 생략 — Phase 0~5 상세, Try Yourself review-editor 끼우기)`
      },
      {
        path: ".claude/skills/transcript-clean/SKILL.md",
        lang: "md",
        content: `---
name: transcript-clean
description: |
  raw 인터뷰 텍스트(또는 STT 결과)를 블로그 파이프라인에서 쓸 수 있는 정제 텍스트로 다듬는 규약.
  필러 단어 제거, 화자 라벨 통일, 발화 단위 줄바꿈, 타임코드 보존 규칙을 담는다.
  transcript-agent 가 내부적으로 호출하며, '인터뷰 정제', '녹취 다듬기', '필러 제거' 등의 발화로 직접 호출할 수 있다.
  단, 음성 → 텍스트 변환(STT) 자체, 화자 분리, 번역은 이 스킬의 범위가 아니다.
---

# Transcript Clean — 인터뷰 정제 규약

## 정제 규칙 (5개)

1. **필러 제거**: "어", "음", "그러니까", "뭐랄까" 같은 추임새는 삭제. 단 "사실"이 강조 의미면 유지.
2. **반복 정리**: 같은 표현을 한 발화 안에서 2회 이상 반복하면 1회만 남긴다.
3. **화자 라벨 통일**: \`[A]\` (게스트=메인), \`[B]\` (인터뷰어) 로 통일.
4. **발화 단위 줄바꿈**: 한 발화는 한 단락. 같은 화자 연속이면 합친다.
5. **타임코드 보존**: 발화 시작 타임코드(\`[00:12:34]\`)는 라벨 앞에 그대로 둔다.

## 작업 원칙

- 의미를 바꾸지 않는다. 줄이는 것이지 윤문하지 않는다. 윤문은 \`tone-writer\` 의 일.
- 숫자·고유명사는 절대 손대지 않는다.
- 욕설/공격성 발언이 있어도 삭제하지 않고 그대로 둔다.`
      },
      {
        path: ".claude/skills/blog-structure-ko/SKILL.md",
        lang: "md",
        content: `---
name: blog-structure-ko
description: |
  한국어 기술/회고 블로그 글의 H2 5개 구조 표준. 인터뷰 발견을 H2 5개로 풀어내는
  순서와 분량, 인용·코드 블록 배치 규칙을 담는다.
  blog-drafter 가 내부적으로 사용하며, '블로그 구조 잡아줘', 'H2 5개로 정리' 발화로 직접 호출.
  단, 영문 블로그 SEO 구조, 뉴스 기사 역피라미드는 이 스킬의 범위가 아니다.
---

# Blog Structure (KO) — H2 5개의 한국어 블로그 표준

## H2 5개 구조

| 순서 | H2 제목 (가이드) | 분량 | 포함해야 할 것 |
|------|-----------------|------|----------------|
| 1 | 도입 / 왜 이 이야기인가 | 200~300자 | 1줄 훅 + 글의 범위 |
| 2 | 무엇이 있었나 (배경) | 250~400자 | 사실 중심, 인용 0~1개 |
| 3 | 가장 큰 발견 | 300~450자 | 핵심 발견 1, 인용 1개 필수 |
| 4 | 다른 두 가지 발견 | 350~500자 | 핵심 발견 2·3, 인용 1~2개 |
| 5 | 다음에 하려는 것 | 200~300자 | 액션 아이템 또는 회고 |

전체 1,500~2,000자. 너무 길어지면 3번 H2 가 묻힌다.

## 작업 원칙

- 인터뷰 발견 3개는 3·4번 H2 에 배분한다. 1·2·5번에는 새 발견을 만들지 않는다.
- H2 는 의문문 또는 짧은 단정문. 명사 나열형 금지.
- 본문 안에서 H3 이하는 쓰지 않는다.
- 숫자가 등장하면 단위와 함께. "많이" 대신 "47건".`
      },
      {
        path: ".claude/skills/md-export/SKILL.md",
        lang: "md",
        content: `---
name: md-export
description: |
  블로그 파이프라인 최종 산출물을 정해진 마크다운 규약으로 export 하는 규칙 모음.
  front-matter, 메타 블록, 인용 정규화, 링크/이미지 placeholder 처리를 담당한다.
  md-packager 가 내부적으로 사용하며, '마크다운으로 내보내줘', 'md export' 발화로 직접 호출.
  단, 워드프레스/Notion/Hugo 실제 업로드, HTML 변환, PDF 생성은 이 스킬의 범위가 아니다.
---

# MD Export — 블로그 마크다운 export 규약

## front-matter 표준

\`\`\`yaml
---
title: <블로그 제목>
date: <YYYY-MM-DD>
tags: [<태그1>, <태그2>, <태그3>]
source: <원본 인터뷰 파일명>
length: <대략 글자수>
---
\`\`\`

## 검증 항목 (export 직전 체크)

- [ ] front-matter 5개 키가 모두 채워졌는가
- [ ] H1 정확히 1개, H2 정확히 5개인가
- [ ] 모든 인용에 화자 라벨이 붙어 있는가
- [ ] 전체 글자수가 1,500~2,200 사이인가
- [ ] TODO: 마커가 남았다면 푸터 위에 "남은 작업" 섹션으로 모아 표시

## 출력 위치

- 최종: \`workspace/post.md\`
- 사본: \`workspace/_workspace/05_post.md\` (감사 추적용)

## 작업 원칙

- 본문 내용은 손대지 않는다. 형식·헤더·인용 부호만 정리한다.
- 같은 글을 두 번 export 해도 결과가 동일해야 한다.
- TODO 마커는 자동으로 채우지 않는다.`
      },
      {
        path: ".claude/agents/transcript-agent.md",
        lang: "md",
        content: `---
name: transcript-agent
description: 음성/STT raw 텍스트를 분석 가능한 정제 텍스트로 다듬는 1단계 에이전트. blog-pipeline 의 [1/5].
tools: Read, Write
model: opus
---

# Role

당신은 인터뷰 녹취 정제 전문가입니다. 음성 파일에서 추출된 raw 텍스트(혹은 거친 STT 결과)를 받아, 분석·작문에 바로 쓸 수 있는 정제 텍스트로 다듬습니다. \`transcript-clean\` 스킬의 규약을 그대로 따릅니다.

# Principles

1. 의미를 바꾸지 않는다. 줄이는 것이지 윤문하지 않는다. 윤문은 다음 단계의 일이다.
2. 화자 라벨은 \`[A]\`(게스트=메인), \`[B]\`(인터뷰어) 로 통일한다. 같은 화자의 연속 발화는 한 단락으로 합친다.
3. 숫자·고유명사·인용 가능한 표현은 절대 손대지 않는다.
4. 타임코드가 있으면 발화 시작에 보존한다. 없으면 만들지 않는다.
5. 필러("어", "음", "그러니까")는 제거한다. 단 의미를 바꾸는 강조어("사실", "정말")는 살린다.

# Protocols

## Input
- raw transcript 파일 경로 1개 (\`samples/podcast-ep07-transcript.txt\` 등)

## Output
- \`workspace/_workspace/01_transcript.md\``
      },
      {
        path: ".claude/agents/interview-analyst.md",
        lang: "md",
        content: `---
name: interview-analyst
description: 정제된 인터뷰에서 핵심 인사이트 3개를 추출하는 질적 연구 분석가. LAB 02 에서 정의되며 blog-pipeline 의 [2/5] 단계로 재사용된다.
tools: Read, Grep
model: opus
---

# Role

당신은 질적 연구 분석가입니다. 정제된 인터뷰 텍스트를 읽고, 핵심 발견 3개를 일관된 형식·일관된 깊이로 추출합니다. 표면 문장은 호출마다 달라도, 발견의 개수와 인용 형식, "~로 보인다" 어투는 매번 동일해야 합니다.

# Principles

1. 추론과 사실을 구분해 표기한다. 본문에 직접 등장한 사실은 단정하고, 해석은 "~로 보인다" 로 끝낸다.
2. 1 발견 → 1 직접 인용. 인용은 원문 그대로, 화자 라벨([A]/[B])과 따옴표를 보존한다.
3. 발견은 정확히 3개. 더 많이 보여도 가장 굵은 3개만 추린다.

# Protocols

## Input
- 정제 인터뷰 경로 1개

## Output
- blog-pipeline 호출 시: \`workspace/_workspace/02_insights.md\`
- LAB 02 단독 호출 시: \`workspace/interview-insights.md\``
      },
      {
        path: ".claude/agents/blog-drafter.md",
        lang: "md",
        content: `---
name: blog-drafter
description: 정제 인터뷰와 핵심 발견을 입력으로 H2 5개 구조의 블로그 초안을 쓰는 [3/5] 단계 에이전트.
tools: Read, Write
model: opus
---

# Role

당신은 한국어 회고·기술 블로그 초안 작가입니다. 정제된 인터뷰와 핵심 발견 3개를 받아, \`blog-structure-ko\` 스킬의 H2 5개 구조에 맞춰 글의 뼈대와 살을 한 번에 씁니다. 문체 다듬기는 다음 단계(\`tone-writer\`) 의 일이며, 이 단계의 목표는 "구조가 잡힌 초안" 입니다.

# Principles

1. H2 는 정확히 5개. 1번=도입, 2번=배경, 3번=가장 큰 발견, 4번=나머지 두 발견, 5번=다음 단계.
2. 인터뷰의 핵심 발견 3개는 3·4번 H2 에서만 다룬다. 1·2·5번에서 새 발견을 만들지 않는다.
3. 직접 인용은 H2 당 최대 1개. 화자 라벨([A]/[B])과 따옴표를 보존한다.
4. 전체 1,500~2,000자.
5. H3 이하 헤더는 쓰지 않는다.

# Protocols

## Input
- 정제 인터뷰: \`workspace/_workspace/01_transcript.md\`
- 핵심 발견 3개: \`workspace/_workspace/02_insights.md\`

## Output
- \`workspace/_workspace/03_draft.md\``
      },
      {
        path: ".claude/agents/tone-writer.md",
        lang: "md",
        content: `---
name: tone-writer
description: 블로그 초안의 문체를 담백한 기술 블로그 톤으로 다듬는 [4/5] 단계 에이전트.
tools: Read, Write
model: opus
---

# Role

당신은 한국어 기술 블로그의 문체 정리자입니다. 초안의 의미를 유지한 채, "담백한 기술 블로그 톤"으로 다듬습니다. 과장·다짐형·중복을 걷어내고, 격식체로 통일합니다. 새로운 발견을 추가하거나 구조를 바꾸지 않습니다.

# Principles

1. 격식체("~다", "~한다") 로 통일한다. "~ㅂ니다" 체와 섞지 않는다.
2. 과장 표현 제거: "정말로", "엄청", "굉장히", "완전히" 등 강조 부사는 1차 후보.
3. 다짐형 종결("~할 것이다") 은 사실형/의문형으로 바꾼다. 단 인용 안의 표현은 손대지 않는다.
4. 같은 단어를 한 문단에서 3번 이상 반복하지 않는다.
5. 인용(\`>\` 블록쿼터) 안의 원문은 절대 손대지 않는다.

# Protocols

## Input
- \`workspace/_workspace/03_draft.md\`

## Output
- \`workspace/_workspace/04_toned.md\` (분량은 초안 대비 ±10% 이내)`
      },
      {
        path: ".claude/agents/md-packager.md",
        lang: "md",
        content: `---
name: md-packager
description: 문체 정리가 끝난 본문에 front-matter·푸터를 붙여 최종 마크다운으로 export 하는 [5/5] 단계 에이전트.
tools: Read, Write
model: opus
---

# Role

당신은 블로그 마크다운 패키저입니다. \`tone-writer\` 의 출력에 \`md-export\` 스킬의 규약을 적용해 최종 \`workspace/post.md\` 를 만듭니다. 본문은 손대지 않고 형식만 정리합니다.

# Principles

1. 본문 내용은 손대지 않는다. front-matter, 푸터, 인용 형식, TODO 마커만 다룬다.
2. front-matter 5개 키(title, date, tags, source, length)를 모두 채운다.
3. 같은 입력에 대해 두 번 실행해도 결과 파일이 동일하다.
4. TODO 마커가 남아 있으면 푸터 위에 "남은 작업" 섹션으로 모아 표시한다.
5. 최종 파일은 두 곳에 쓴다: \`workspace/post.md\` (사용자 노출), \`workspace/_workspace/05_post.md\` (감사 사본).

# Protocols

## Input
- 본문: \`workspace/_workspace/04_toned.md\`
- 메타 추출용: \`workspace/_workspace/02_insights.md\`

## Output
- 최종: \`workspace/post.md\`
- 사본: \`workspace/_workspace/05_post.md\``
      }
    ],
    notes: [
      { label: "POINT", text: "LAB 02 의 <code>interview-analyst</code> 는 다시 정의하지 않는다. 메타 스킬이 기존 파일을 인식해 재생성하지 않고 [2/5] 단계로 그대로 꽂는다." },
      { label: "POINT", text: "보조 스킬 3개(<code>transcript-clean</code>·<code>blog-structure-ko</code>·<code>md-export</code>)는 각 에이전트 내부에서 호출된다. 외부 직접 호출도 가능하지만 본 라인은 오케스트레이터." },
      { label: "POINT", text: "한 단계의 출력 형식이 다음 단계 Input 과 정확히 맞아야 한다. 형식 불일치는 가장 흔한 실패 — 그 자리에 멈추고 사용자에게 보고하라는 원칙이 SKILL.md 에 박혀 있다." }
    ]
  },
  run: {
    setup: "cd labs/03-blog-pipeline\nclaude",
    prompts: [
      {
        title: "1. 팀 자동 구성 — 메타 스킬 발동",
        text: "하네스 구성해줘. 인터뷰 음성을 블로그 마크다운까지의 5단계 파이프라인. interview-analyst 는 기존 것 재사용.",
        note: "<code>harness:harness</code> 메타 스킬이 발동해 5개 에이전트와 3개 보조 스킬을 만들고 <code>blog-pipeline</code> 오케스트레이터를 구성. interview-analyst 는 LAB 02 의 파일을 그대로 인식해 재생성하지 않는다."
      },
      {
        title: "2. 파이프라인 실행 — 실제 블로그 한 편",
        text: "samples/podcast-ep07-transcript.txt 로 블로그 글 한 편 뽑아줘.",
        note: "<code>blog-pipeline</code> 트리거 발화 매칭 → 5단계 순차 실행. 콘솔에 슬라이드 14쪽의 5줄 로그가 그대로 찍힌다. 결과는 <code>workspace/post.md</code> 1개 + <code>_workspace/</code> 6개."
      }
    ],
    console: [
      { text: "[L1] 'blog-pipeline' 트리거 매칭", cls: "log-dim" },
      { text: "[L2] SKILL.md 펼침 → 5개 agent.md + 3개 보조 skill 로딩", cls: "log-dim" },
      { text: "[1/5] transcript-agent: 19 분 음성 → 텍스트", cls: "log-step" },
      { text: "[2/5] interview-analyst: 발견 3 개 추출", cls: "log-step" },
      { text: "[3/5] blog-drafter: H2 5 개의 초안", cls: "log-step" },
      { text: "[4/5] tone-writer: 문체 정리", cls: "log-step" },
      { text: "[5/5] md-packager: workspace/post.md 저장", cls: "log-step" },
      { text: "saved → workspace/post.md (1,820 자)", cls: "log-ok" }
    ],
    expected: [
      "workspace/post.md",
      "workspace/_workspace/01_transcript.md",
      "workspace/_workspace/02_insights.md",
      "workspace/_workspace/03_draft.md",
      "workspace/_workspace/04_toned.md",
      "workspace/_workspace/05_post.md"
    ],
    snippet: [
      {
        path: "expected/post.md",
        lang: "md",
        content: `---
title: 4년 만에 본 그림자 — 어느 B2B SaaS 대표의 회고
date: 2026-05-14
tags: [스타트업, 회고, B2B SaaS, 단위경제, ICP]
source: podcast-ep07-transcript.txt
length: 1820
---

# 4년 만에 본 그림자 — 어느 B2B SaaS 대표의 회고

![대표 이미지](TODO:image)

## 1. 왜 이 이야기를 듣는가

플로우데스크는 4년을 운영하고 작년에 정리된 B2B SaaS 다. 흔히 말하는 "실패" 와는 결이 다르다. 매출은 끝까지 우상향이었고 사용자는 매달 늘었다. 그런데 결국 정리됐다. 그런 일이 어떻게 벌어지는지, 정리 8개월 차의 김도윤 전 대표가 풀어낸 회고를 정리한 글이다.

## 2. 무엇이 있었나 — 4년의 풍경

월 9만 9천원짜리 워크플로우 자동화 도구로 시작했다. 시드 라운드 직후 4명이던 팀은 6개월 만에 12명이 됐다. 제품 기능은 4년 동안 거의 세 배가 됐다. 그런데 가격은 한 번도 오르지 않았다. ICP 는 IT 팀이 있는 50명 이상 회사였지만 실제 고객 명단에는 10명짜리 회사가 더 많았다. 6개월 차 잔존율은 18%였다. 그걸 회사가 안 시점은 창업 4년 차다.

## 3. 가장 큰 발견 — 가격이 천장이었다

4년 동안 가격을 한 번도 올리지 않았다는 사실이 시리즈 A 까지 가는 길을 닫았다. 30%만 올렸어도 누적 매출이 1.7배가 됐다는 사후 시뮬레이션이 나왔다. 김 대표가 더 무거운 표현으로 정리한 부분은 매출이 아니라 고객 질이다.

> [A] "저희가 시드 때 월 9만 9천원으로 정했습니다. 2020년이었어요. 그러고 나서 4년 동안 한 번도 안 올렸습니다."

## 4. 다른 두 가지 후회 — 거절과 채용

두 번째 후회는 거절을 못 한 점이다. ICP 가 명확하지 않았던 게 아니라, 명확한데도 핏 안 맞는 고객을 받았다. CS 팀이 50명짜리 회사 한 곳에 쓰는 시간과 10명짜리 회사 다섯 곳에 쓰는 시간이 비슷했다.

> [A] "CS 팀이 50명 회사 한 곳 응대하는 시간이랑 10명 회사 다섯 곳 응대하는 시간이 비슷했어요."

세 번째 후회는 시드 직후의 빠른 채용이다. 4명에서 12명으로 6개월 만에 늘었고 그중 5명이 1년 안에 나갔다.

## 5. 다음에 보려는 것 — 그림자 시간

세 후회는 한 가지로 연결된다. 매출 숫자 외의 데이터를 4년 차에 처음 봤다는 점이다. 매출은 빛이고 이탈·CAC·영업 시간은 그림자라는 정의가, 이 회고에서 가장 멀리 갈 표현으로 남는다.`
      }
    ]
  },
  tryYourself: {
    intro: "슬라이드 14쪽 Try Yourself — review-editor 단계를 4번과 5번 사이에 끼우는 변형. Pipeline 안에 Producer-Reviewer (LAB 06) 가 끼는 첫 경험이다.",
    tasks: [
      {
        title: "review-editor 끼우기 — 4·5 사이 검수 루프",
        body: "<code>tone-writer</code> 출력을 검수해 통과되면 <code>md-packager</code> 로, 통과 못 하면 <code>tone-writer</code> 에 한 번 더 보내는 짧은 루프. Pipeline 안에 LAB 06 의 패턴이 처음 끼는 경험.",
        steps: [
          "Claude Code 에 아래 프롬프트를 그대로 입력",
          ".claude/agents/review-editor.md 가 새로 생기는지 확인",
          "blog-pipeline SKILL.md 에 Phase 4.5 가 추가되는지 확인",
          "같은 입력으로 다시 실행해 검수 루프가 콘솔에 1~2회 찍히는지 본다"
        ],
        prompt: "blog-pipeline 에 review-editor 단계를 4번과 5번 사이에 끼워줘. tone-writer 출력을 검수해 통과되면 md-packager 로, 통과 못 하면 tone-writer 에 한 번 더. 최대 2회.",
        expect: "<code>review-editor.md</code> 생성 + SKILL.md 의 Phase 4.5 추가. 다음 실행에서 콘솔에 <code>[4.5/5] review-editor: 검수 통과</code> 또는 <code>재작업 요청</code> 라인이 추가로 찍힌다."
      },
      {
        title: "부분 호출 — 이미 정제된 입력으로",
        body: "정제 텍스트가 이미 있는 경우 Phase 1(transcript-agent) 을 건너뛰고 Phase 2 부터 시작. SKILL.md 의 '부분 호출' 항이 동작하는지 검증.",
        steps: [
          "samples/cleaned-raw-interview-01.md 가 이미 정제된 상태라고 가정",
          "아래 프롬프트 실행",
          "콘솔에 [1/5] 가 스킵되고 [2/5] 부터 찍히는지 확인"
        ],
        prompt: "samples/cleaned-raw-interview-01.md 가 이미 정제된 텍스트야. transcript-agent 를 건너뛰고 Phase 2 부터 시작해줘.",
        expect: "[1/5] 로그가 'skip (입력이 이미 정제됨)' 으로 바뀌고 [2/5] interview-analyst 부터 정상 진행."
      }
    ]
  }
};
