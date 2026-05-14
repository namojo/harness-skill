window.HARNESS_DATA = window.HARNESS_DATA || {};
window.HARNESS_DATA["lab08"] = {
  diagram: "pattern-6-hierarchical.svg",
  diagramCaption: "2단 위임 · 컨텍스트 분산",
  scenario: {
    intro: "큰 위임 한 줄을 받아, 상위 supervisor (campaign-lead) → 하위 supervisor (research-lead / creative-lead) → 워커의 2 단으로 위임이 흐른다. 상위는 sub 가 보낸 요약만 받고, 원본은 보지 않는다. 컨텍스트 폭발을 막는 게 이 패턴의 본질.",
    boxes: [
      {
        label: "A",
        title: "왜 supervisor 한 층으론 부족한가",
        body: "하위 작업이 또 여러 단계로 쪼개진다. <code>survey</code> 워커도 사실은 <strong>\"설문 설계 + 발송 + 응답 정제\"</strong> 의 작은 파이프라인. 이걸 top supervisor 가 다 보면 컨텍스트가 폭발한다. 그래서 sub-supervisor 한 층을 더 둔다.",
        warn: false
      },
      {
        label: "B",
        title: "각 층의 책임 분리",
        body: `<table class="compare-table">
<thead><tr><th>층</th><th>책임</th></tr></thead>
<tbody>
<tr><th><code>campaign-lead</code></th><td>큰 그림 · 두 팀 간 조율만</td></tr>
<tr><th><code>research-lead</code></th><td>research 워커들만 봄</td></tr>
<tr><th><code>creative-lead</code></th><td>creative 워커들만 봄</td></tr>
<tr><th>워커들</th><td>실제 작업만</td></tr>
</tbody></table>`,
        warn: false
      },
      {
        label: "함정",
        title: "위임 위반은 보이지 않게 일어난다",
        body: "campaign-lead 가 survey-worker 결과 원본을 직접 읽거나, 워커가 sub-lead 를 건너뛰고 위로 보고하면 위임이 무너진다. 결과물은 비슷해 보여도 컨텍스트는 폭발한다 — Principles 1·2 번이 약하면 일어나는 일.",
        warn: true
      }
    ],
    principles: [
      "워커에는 직접 일을 시키지 않는다. 반드시 sub-supervisor 를 거친다.",
      "상위 supervisor 는 sub 가 보낸 요약만 받는다. 원본을 받지 않는다.",
      "두 sub 의 결과가 충돌하면, 일단 양쪽 다 기록한 뒤 사용자에게 묻는다."
    ],
    points: [
      "campaign-lead → research-lead / creative-lead → 워커 6 명 — 2 단 위임이 컨텍스트를 자동으로 쪼갠다.",
      "sub-lead 의 lead-summary.md 1 쪽만 위로 올라간다 — 워커 원본 (47 건 설문 응답, 5 안 헤드라인) 은 상위에 도달하지 않는다.",
      "Try Yourself 로 analytics-lead 를 추가해 3 팀 병렬로 확장 가능 — Pattern 6 의 진짜 확장성."
    ]
  },
  build: {
    intro: "Skill 1 개 + Agent 10 개 (campaign-lead + 2 sub-lead + 6 워커 + analytics-lead 확장). 핵심은 위로 올라가는 게 lead-summary.md 1 쪽 뿐이라는 것 — sub-lead 의 Principles 2 번이 컨텍스트 분산의 게이트.",
    files: [
    {
      path: ".claude/skills/survey-design/SKILL.md",
      lang: "md",
      content: `---
name: survey-design
description: |
  마케팅 캠페인용 설문 설계 표준. 설문 목적 정의, 질문 유형 선택, 5점 척도 가이드, 회피해야 할 질문 패턴, 응답 정제 절차를 정의한다.
  '설문 설계', '설문 문항 작성', '5점 척도', '리커트 척도', '설문 응답 정제',
  'survey design', '응답 데이터 정리', '설문 결과 요약'
  등 캠페인용 설문 설계·정제 작업에 이 스킬을 반드시 사용한다.
  단, 실제 설문 발송 시스템 호출, 패널 모집, 통계 검정(t-test 등)은 이 스킬의 범위가 아니다.
---

# Survey Design — 설문 설계·정제 표준

\`survey-worker\` 에이전트가 캠페인용 설문을 설계·발송·응답 정제하는 작은 파이프라인을 수행할 때 따르는 표준이다.

## 3단계 워크플로우

\`\`\`
1. 설문 설계 (10~15분)
   ├── 목적 정의
   ├── 질문 6~10개
   └── 척도 통일

2. 발송 (가상)
   └── 채널·기간·인센티브 명세 (실제 발송은 범위 밖)

3. 응답 정제 (정량 + 정성)
   ├── 정량: 평균·분포·세그먼트
   └── 정성: 빈출 키워드 + 대표 인용 3~5개
\`\`\`

## 설문 목적 정의 (필수)

설계 시작 전 반드시 한 문장으로 명확화:

\`\`\`text
"<제품/기능>에 대한 <타깃>의 <측정하려는 것>을 파악한다."

예: "하네스 학습 키트에 대한 주니어 개발자의 가격 민감도와 학습 동기를 파악한다."
\`\`\`

목적이 모호하면 질문이 발산해 응답이 의미 없어진다.

## 질문 유형 4가지

| 유형 | 용도 | 예 |
|------|------|-----|
| **5점 척도** | 정량 측정 | "이 가격은 적절하다 (1=매우 비싸다, 5=매우 적절)" |
| **단일 선택** | 분류 | "어떤 학습 방식을 선호하나? (영상/책/실습/멘토링)" |
| **순위** | 우선순위 | "다음 기능 중 중요도 순으로 정렬" |
| **자유 응답** | 정성 인사이트 | "이 제품을 한 줄로 설명한다면?" |

균형: 정량(5점·선택)이 70%, 정성(자유 응답) 30%. 자유 응답이 많으면 정제 부담 폭증.

## 회피해야 할 질문 패턴

| 나쁜 패턴 | 예 | 수정 |
|----------|-----|-----|
| **유도 질문** | "혁신적인 본 제품이 마음에 드나요?" | "본 제품에 대한 만족도는?" |
| **이중 질문** | "디자인과 가격이 마음에 드나요?" | 디자인·가격 별도 질문 |
| **모호한 단어** | "이 제품은 좋은가요?" | "추천 의사가 있나요?" |
| **닫힌 자유 응답** | "이유는?" 한 줄 자리 | "이유를 3~5 문장으로..." |
| **너무 많은 옵션** | 7개 이상 척도 | 5~7점으로 제한 |

## 5점 척도 표준

\`\`\`
1 - 매우 비동의 / 매우 부정적
2 - 비동의 / 부정적
3 - 중립 / 모르겠다
4 - 동의 / 긍정적
5 - 매우 동의 / 매우 긍정적
\`\`\`

7점·10점 척도는 통계 정밀성↑지만 응답 부담↑. 5점이 무난.

## 가격 민감도 (Van Westendorp PSM)

가격 민감도는 4질문 세트:

1. 너무 비싸서 사지 않을 가격은? (Too Expensive)
2. 사기에 부담되긴 하지만 검토할 가격은? (Expensive)
3. 합리적이라고 느끼는 가격은? (Cheap)
4. 너무 싸서 품질이 의심되는 가격은? (Too Cheap)

→ 교차점에서 최적 가격대 도출.

## 응답 정제 — 정량

\`\`\`markdown
## 정량 요약

- 응답자 수: 47
- 만족도 (5점 척도): 평균 4.2 (표준편차 0.8)
- 추천 의사 (NPS): +24 (Promoters 40%, Detractors 16%)
- 가격대 선호:
  - 8만원 이하: 45%
  - 8~12만원: 38%
  - 12만원 이상: 17%

## 세그먼트

| 세그먼트 | 응답수 | 만족도 평균 |
|----------|--------|------------|
| 주니어 (1~3년차) | 23 | 4.4 |
| 미드 (4~7년차) | 18 | 4.0 |
| 시니어 (8년차+) | 6 | 3.7 |
\`\`\`

## 응답 정제 — 정성

자유 응답은 키워드 + 대표 인용으로 요약:

\`\`\`markdown
## 정성 요약

### 자주 등장한 키워드
- "실습" (32회)
- "예제" (28회)
- "가격" (19회)
- "한국어" (15회)
- "현실적" (12회)

### 대표 인용 3개

> "실제 회사에서 쓰는 패턴이 들어 있어서 좋다." — P012, 주니어
> "가격이 8만원이면 부담 없이 추천할 수 있을 것 같다." — P028, 미드
> "기존 자료는 영어가 많아서 부담이었는데 한국어 버전이라 좋다." — P041, 주니어
\`\`\`

## 표준 출력 형식

\`survey-worker\` 산출물 \`_workspace/research/survey.md\`:

\`\`\`markdown
# Survey · <제품/캠페인 이름>

## 목적
<한 문장>

## 설문 구성 (요약)
- 질문 N개 (정량 X개, 정성 Y개)
- 응답 기간: ...
- 채널: ...
- 응답자: 47명

## 정량 요약
...

## 정성 요약
...

...(이하 생략 — 전체 파일은 .claude/skills/<name>/SKILL.md 참조)`
    },
    {
      path: ".claude/skills/competitor-analysis/SKILL.md",
      lang: "md",
      content: `---
name: competitor-analysis
description: |
  경쟁사 분석 데스크 리서치 표준. 비교 차원(가격·기능·타깃·포지셔닝·강약점), 비교 표 작성 형식, 차별화 포인트 도출 절차를 정의한다.
  '경쟁사 분석', '데스크 리서치', '경쟁사 비교표', '차별화 포인트', '시장 포지셔닝',
  'competitor analysis', '경쟁사 강약점', '시장 조사'
  등 경쟁사 비교 분석 작업에 이 스킬을 반드시 사용한다.
  단, 실제 경쟁사 정보 크롤링, 외부 시장조사 보고서 구매, 가격 변동 모니터링은 이 스킬의 범위가 아니다.
---

# Competitor Analysis — 데스크 리서치 표준

\`desk-research-worker\` 에이전트가 캠페인용 경쟁사 분석을 수행할 때 따르는 표준이다.

## 비교 차원 5가지

| 차원 | 내용 |
|------|------|
| **가격** | 가격대·할인·구독·번들 |
| **기능** | 주요 기능 리스트, 차별 기능 |
| **타깃** | 주 타깃 세그먼트, 사용자 페르소나 |
| **포지셔닝** | 한 줄 가치 제안, 슬로건, 카테고리 |
| **강약점** | 시장이 인정하는 강점 / 약점 |

## 비교 표 표준

\`\`\`markdown
| 항목 | 본 제품 | 경쟁사 A | 경쟁사 B | 경쟁사 C |
|------|---------|---------|---------|---------|
| 가격 | 89,000원 | 120,000원 | 무료 | 50,000원 |
| 타깃 | 주니어 개발자 | 모든 개발자 | 학생 | 시니어 |
| 핵심 차별 | 한국어, 실습 위주 | 영어, 이론 | 영어, 기초 | 영어, 심화 |
| 강점 | 한국 케이스 | 글로벌 표준 | 무료 | 깊이 |
| 약점 | 신규 브랜드 | 가격 부담 | 깊이 부족 | 진입 장벽 |
\`\`\`

비교 대상: 직접 경쟁 3~5곳 + 간접 경쟁 1~2곳.

## 차별화 포인트 도출 절차

1. 비교 표 작성
2. 본 제품의 강점 중 **다른 경쟁사가 약점인 곳**을 찾는다 (강×약 매트릭스)
3. 한 줄 차별화 메시지 작성 (\`<경쟁사 약점>을 해결한 <본 제품 강점>\`)

예:
\`\`\`
- 경쟁사 A: 가격 부담 (강점=글로벌)
- 본 제품: 89,000원 (강점=한국어)

→ 차별화 메시지: "글로벌 자료 가격 절반 + 한국어 실습"
\`\`\`

## 정보 출처 우선순위

데스크 리서치 시 다음 순서로 신뢰:

1. **공식 자료** (홈페이지, 공식 소셜, 보도자료) — 1차
2. **3rd party 리뷰** (블로그, 유튜브, 평점 사이트) — 2차
3. **사용자 커뮤니티** (Reddit, 디스코드, 디시인사이드) — 3차
4. **추측·인상** — 출처로 쓰지 않음, 가설 표시

각 정보에 출처 URL 또는 출처 종류 명시:

\`\`\`markdown
- 경쟁사 A 가격: 120,000원 (공식 홈페이지, 2026-05-13 확인)
- 경쟁사 A 강점: "체계적 커리큘럼" (블로그 리뷰 3건 공통, 2025-Q4)
\`\`\`

## 캐치하는 신호

다음은 분석에서 놓치면 안 되는 신호:

- **가격 변동 이력** (최근 인상·인하 → 시장 반응 추정)
- **신규 진입자** (작년 X곳 → 올해 Y곳, 카테고리 트렌드)
- **광고·SEO 키워드** (어떤 키워드에 돈을 쓰는가)
- **사용자 불만 빈출 키워드** (개선 기회)
- **공식 채널 활동성** (블로그 마지막 업데이트, 유튜브 빈도)

## 표준 출력 형식

\`desk-research-worker\` 산출물 \`_workspace/research/desk.md\`:

\`\`\`markdown
# Desk Research · <제품/카테고리>

## 분석 범위
- 경쟁사 N곳 (직접 X, 간접 Y)
- 분석 기간: ...
- 출처: 공식 a%, 리뷰 b%, 커뮤니티 c%

## 비교 표
<위 표 형식>

## 차별화 포인트 (3개)
1. <포인트 1>: 근거...
2. <포인트 2>: 근거...
3. <포인트 3>: 근거...

## 시장 시그널
- 신규 진입자: ...
- 가격 트렌드: ...
- 사용자 불만 빈출: ...

## 핵심 발견 (research-lead에게 올릴 1쪽 요약)
1. <발견 1>
2. <발견 2>
3. <발견 3>

## 출처
- ... (URL 또는 출처 종류)
\`\`\`

## 슬라이드 매핑

워크숍 슬라이드 24쪽의 트리 로그:
\`\`\`
research-lead
├── desk   → 경쟁사 12곳
\`\`\`

→ 본 Skill을 발동한 desk-research-worker의 표준 출력.

## 좋은 vs 나쁜 분석

| 좋음 | 나쁨 |
|------|------|
| 출처 명시 | "이것이 좋다고 알려져 있다" |
| 비교 표로 시각화 | 줄글 나열 |
| 차별화 포인트 명확 | "다 비슷하다" |
| 시장 시그널 캐치 | 정적 비교만 |

## 범위 밖

- 자동 크롤링·스크래핑
- 유료 시장조사 보고서 구매
- 가격 변동 실시간 모니터링
- 경쟁사 내부 정보 (재무·인사 등) 입수
`
    },
    {
      path: ".claude/skills/trend-keywords/SKILL.md",
      lang: "md",
      content: `---
name: trend-keywords
description: |
  트렌드 키워드 추출·정리 표준. 검색량 트렌드·SNS 빈출·관련 검색어 카테고리화·시즌성 표시·키워드 임팩트 점수 산정 규칙을 정의한다.
  '트렌드 키워드 분석', '검색량 트렌드', 'SNS 키워드', '시즌성 키워드', '관련 검색어 분석',
  '키워드 임팩트', 'trending keywords', '키워드 카테고리화'
  등 트렌드 키워드 도출 작업에 이 스킬을 반드시 사용한다.
  단, 실제 Google Trends API 호출, SNS 크롤링, 키워드 광고 입찰가 조회는 이 스킬의 범위가 아니다.
---

# Trend Keywords — 키워드 분석 표준

\`trends-worker\` 에이전트가 캠페인용 키워드를 도출·정리할 때 따르는 표준이다.

## 키워드 분류 4 카테고리

| 카테고리 | 정의 | 예 (학습 키트 캠페인) |
|---------|------|--------------------|
| **Core (핵심)** | 제품을 직접 설명 | "Claude Code", "AI 코딩 도구" |
| **Long-tail (롱테일)** | 구체적·세부 | "Claude Code 한국어 강의", "AI 에이전트 만들기" |
| **Trending (떠오르는)** | 최근 3개월 급상승 | "AI 워크숍", "프롬프트 엔지니어링 강의" |
| **Adjacent (인접)** | 관련은 있지만 직접 X | "GitHub Copilot", "Cursor IDE", "개발자 컨퍼런스" |

균형 잡힌 키워드 셋: Core 30%, Long-tail 40%, Trending 20%, Adjacent 10%.

## 키워드 임팩트 점수

각 키워드에 점수(1~10) 부여:

\`\`\`
점수 = (검색량 가중치 × 0.4) + (경쟁도 역수 × 0.3) + (제품 적합도 × 0.3)

- 검색량 가중치: 월 검색 추정치를 10단계 정규화
- 경쟁도 역수: 1 - (광고 입찰가 / 시장 최고가)
- 제품 적합도: 사람 판단 (1~10), 제품 USP와의 연결성
\`\`\`

높은 점수 = 검색 많고, 경쟁 적고, 제품과 맞는 키워드.

## 시즌성 표시

각 키워드의 시즌 패턴 표기:

| 패턴 | 표기 | 예 |
|------|------|-----|
| 연중 균등 | \`(전년)\` | "AI 코딩" |
| 시즌 피크 | \`(피크: 시즌)\` | "연말정산" → \`(피크: Q4)\` |
| 단기 이벤트 | \`(단기)\` | "Claude 4.7 출시" → \`(단기, 2026-04~05)\` |
| 하락세 | \`(하락)\` | "ChatGPT 3.5 사용법" |

## 관련 검색어 트리

핵심 키워드 1개에 대한 관련 검색어 4~6개 도출:

\`\`\`
Claude Code
├── Claude Code 한국어
├── Claude Code 강의
├── Claude Code 워크숍
├── Claude Code vs Cursor
├── Claude Code 설치
└── Claude Code 가격
\`\`\`

각 분기를 Long-tail 키워드로 사용.

## 표준 출력 형식

\`trends-worker\` 산출물 \`_workspace/research/trends.md\`:

\`\`\`markdown
# Trend Keywords · <캠페인 이름>

## 분석 범위
- 분석 기간: ...
- 출처: <Google Trends 시뮬레이션 / 네이버 트렌드 / SNS 모니터링 등>

## 핵심 키워드 (Core)
| 키워드 | 검색량 추정 | 경쟁도 | 적합도 | 점수 | 시즌 |
|--------|------------|--------|--------|------|------|
| Claude Code | 매우 높음 | 중간 | 10 | 8.4 | (전년) |
| AI 코딩 도구 | 높음 | 높음 | 8 | 6.7 | (전년) |
| ... | | | | | |

## Long-tail (롱테일)
| 키워드 | 점수 |
|--------|------|
| Claude Code 한국어 강의 | 7.8 |
| ... | |

## Trending (떠오르는)
| 키워드 | 점수 | 추세 |
|--------|------|------|
| 프롬프트 엔지니어링 강의 | 8.1 | ↑ 최근 3개월 +40% |
| ... | | |

## Adjacent (인접)
- GitHub Copilot, Cursor IDE, AI 컨퍼런스

## 추천 키워드 8개 (캠페인 카피·SEO에 사용)
1. Claude Code 워크숍
2. AI 에이전트 만들기
3. 프롬프트 엔지니어링 강의
4. 한국어 AI 코딩 강의
5. ...

## 핵심 발견 (research-lead에게 올릴 1쪽 요약)
1. <발견 1>
2. <발견 2>
3. <발견 3>
\`\`\`

## 슬라이드 매핑

워크숍 슬라이드 24쪽 트리 로그:
\`\`\`
research-lead
├── trends   → 키워드 8개
\`\`\`

→ 본 Skill의 "추천 키워드 8개" 섹션과 매핑.

## 좋은 vs 나쁜 분석

| 좋음 | 나쁨 |
|------|------|
| 4 카테고리 균형 | Core만 나열 |
| 점수로 우선순위 | 인상으로 추천 |
| 시즌 명시 | 시점 정보 없음 |
| 관련 검색어 트리 | 키워드 평면 나열 |

## 데이터 출처 (가상·실제)

- **실제 사용 가능**: Google Trends, 네이버 데이터랩, SimilarWeb (무료 범위)
- **유료**: SEMrush, Ahrefs, Keyword Planner (이 워크숍에서는 시뮬레이션)
- **본 워크숍**: 가상 데이터로 점수 산정 (학습 목적)

## 범위 밖

- 실시간 키워드 API 호출
- SNS 자동 모니터링
- 광고 입찰가 실시간 조회
- 멀티 언어 키워드 (영문·일문 키워드는 별도 작업)
`
    },
    {
      path: ".claude/skills/headline-frameworks/SKILL.md",
      lang: "md",
      content: `---
name: headline-frameworks
description: |
  마케팅 카피·헤드라인 작성 프레임워크 5종 (PAS·AIDA·BAB·4U·How-to). 각 프레임워크의 구조, 적합한 상황, 좋은 예/나쁜 예와 한국어 카피 변환 규칙을 정의한다.
  '헤드라인 작성', '카피 프레임워크', '광고 카피', 'PAS AIDA', '한 줄 가치 제안',
  '광고 헤드라인 5안', 'tagline', '슬로건 작성'
  등 마케팅 카피·헤드라인 작성 작업에 이 스킬을 반드시 사용한다.
  단, 실제 광고 집행, A/B 테스트 운영, 광고 매체 구매는 이 스킬의 범위가 아니다.
---

# Headline Frameworks — 카피 작성 프레임워크

\`copy-worker\` 에이전트가 캠페인용 헤드라인 5안을 작성할 때 따르는 5가지 프레임워크다.

## 5개 프레임워크

### 1. PAS — Problem · Agitation · Solution

\`\`\`
Problem: 독자가 겪는 문제 한 줄
Agitation: 그 문제의 고통을 극대화
Solution: 본 제품이 해결책
\`\`\`

**적합**: 명확한 페인이 있는 카테고리 (학습, 다이어트, 보안)

**예** (학습 키트):
\`\`\`
Claude Code 한국어 강의가 없다. (Problem)
영어 영상만 보다가 절반은 놓친다. (Agitation)
한국어 + 실습 워크숍으로 한 번에 익혀라. (Solution)
\`\`\`

### 2. AIDA — Attention · Interest · Desire · Action

\`\`\`
Attention: 시선 끄는 한 줄
Interest: 호기심 유발
Desire: 욕망·기대감 자극
Action: 즉시 행동 요구
\`\`\`

**적합**: 캠페인 메인 카피, 랜딩 페이지

**예**:
\`\`\`
[A] AI 에이전트, 직접 만들 수 있다고요?
[I] 8개 LAB · 4시간 · 한국어 워크숍
[D] 어제 막힌 그 문제, 오늘 풀린다
[A] 5월 28일 신청 마감 →
\`\`\`

### 3. BAB — Before · After · Bridge

\`\`\`
Before: 지금의 답답한 상태
After: 변화된 모습
Bridge: 본 제품이 그 다리
\`\`\`

**적합**: 변화·결과를 강조하고 싶을 때

**예**:
\`\`\`
Before: 프롬프트 한 줄에 결과가 매번 다르다.
After: Skill·Agent로 같은 결과가 재현된다.
Bridge: Harness 워크숍 8개 LAB.
\`\`\`

### 4. 4U — Useful · Urgent · Unique · Ultra-specific

\`\`\`
Useful: 실용적
Urgent: 시급
Unique: 유일성
Ultra-specific: 구체 (숫자, 시간, 결과)
\`\`\`

**적합**: 짧은 광고 카피, 한 줄 슬로건

**예** 4가지가 모두 들어간 한 줄:
\`\`\`
"4시간 만에 8개 AI 에이전트 직접 만드는 한국어 워크숍 (5월 28일 마감)"
- 4시간: Ultra-specific
- 8개 직접: Useful + Unique
- 5월 28일 마감: Urgent
\`\`\`

### 5. How-to · 숫자 헤드라인

\`\`\`
"<숫자>개의 <결과>를 만드는 <방법>"
"<시간> 만에 <변화> 하는 <방법>"
\`\`\`

**적합**: 블로그 제목, SEO 친화

**예**:
\`\`\`
"4시간 만에 AI 에이전트 8개 직접 만드는 법"
"개발 워크플로우를 자동화하는 6가지 패턴"
\`\`\`

## 헤드라인 작성 규칙

| 규칙 | 설명 |
|------|------|
| **18~25자 (한국어)** | 너무 짧으면 빈약, 너무 길면 안 읽힘 |
| **구체적 숫자** | "많은" 대신 "47명", "빠른" 대신 "4시간" |
| **두 번째 사람** | "당신", "직접", "혼자" |
| **결과 + 방법** | 결과만 있으면 광고티, 방법만 있으면 설명서 |
| **부정적 단어 적당히** | "실패", "후회"는 임팩트 있지만 남용 X |

## 5안 작성 표준

\`copy-worker\`는 항상 **다른 프레임워크 5개**로 헤드라인 5안 작성:

\`\`\`markdown
# 헤드라인 5안 · <캠페인 이름>

## 1. PAS 프레임워크
"<카피>"
- 의도: ...
- 채널 추천: <Facebook/유튜브 광고/...>

## 2. AIDA
"<카피>"
- 의도: ...

## 3. BAB
"<카피>"
- 의도: ...

## 4. 4U
"<카피>"
- 의도: ...

## 5. How-to / 숫자
"<카피>"
- 의도: ...

## 추천 (creative-lead에게 올릴 1쪽 요약)
- 메인: <5안 중 가장 강한 1개>
- 서브: <보조 2개>
- A/B 테스트 추천: <2개 조합>
\`\`\`

## 좋은 vs 나쁜 헤드라인

| 좋음 | 나쁨 |

...(이하 생략 — 전체 파일은 .claude/skills/<name>/SKILL.md 참조)`
    },
      {
        path: ".claude/skills/campaign-org/SKILL.md",
        lang: "md",
        content: `---
name: campaign-org
description: |
  마케팅 캠페인 한 줄 위임을 받아 campaign-lead 가 research-lead 와 creative-lead
  두 sub-supervisor 에게 위임하고, 각 sub 가 자기 워커들을 호출한 뒤 요약만 위로
  올리는 Pattern 6 (Hierarchical Delegation) 2 단 위임 오케스트레이터.
  '캠페인 기획', '마케팅 캠페인', '캠페인 브리프', '제품 출시 캠페인', '리서치 + 크리에이티브',
  '2단 위임', '캠페인 팀', '마케팅 팀 운영', '신제품 캠페인', '캠페인 조직' 등
  마케팅 캠페인 기획 전반에 이 스킬을 반드시 사용한다.
  단, 실제 광고 집행, 매체 구매, 법적 검수, 카피의 상표권 검토는 이 스킬의 범위가 아니다.
---

# Campaign Org — Pattern 6 · 2 단 위임

큰 위임 한 줄을 받아, **상위 supervisor (campaign-lead) → 하위 supervisor (research-lead / creative-lead) → 워커** 의 2 단으로 위임이 흐른다.

## 에이전트 구성

\`\`\`
campaign-lead
├── research-lead
│   ├── survey-worker          (설문 설계·발송·응답 정제)
│   ├── desk-research-worker   (데스크 리서치, 경쟁사 분석)
│   └── trends-worker          (키워드·트렌드)
└── creative-lead
    ├── copy-worker            (헤드라인)
    ├── design-worker          (비주얼 컨셉)
    └── video-worker           (30 초 스크립트)
\`\`\`

Try Yourself 확장: \`analytics-lead\` 라는 세 번째 sub-supervisor 를 추가해 3 팀 병렬로 만든다.

## 위임 규칙 (반드시 지킬 것)

1. 워커에는 직접 일을 시키지 않는다. 반드시 sub-supervisor 를 거친다.
2. 상위 supervisor 는 sub 가 보낸 요약만 받는다. 원본을 받지 않는다.
3. 두 sub 의 결과가 충돌하면, 일단 양쪽 다 기록한 뒤 사용자에게 묻는다.

## 워크플로우

- Phase 0 — 위임 접수 · 두 sub 에게 보낼 한 줄 미션 정리
- Phase 1 — research-lead / creative-lead 병렬 가동 → 각자 워커 3 명씩 호출 → lead-summary.md 1 쪽
- Phase 2 — campaign-lead 가 두 lead-summary.md 만 Read → campaign-brief.md 합성
- Phase 3 — tree-log.txt 에 위임 트리 기록

## 작업 원칙

- 깊이는 2 단으로 고정. 3 단 이상 늘리지 않는다.
- sub-lead 의 요약은 1 쪽 (대략 1500 자 이내) 으로 제한.
- 워커가 자기 위 sub-lead 를 거치지 않고 campaign-lead 에게 직접 보고하면 그것은 위임 위반.`
      },
      {
        path: ".claude/agents/campaign-lead.md",
        lang: "md",
        content: `---
name: campaign-lead
description: 마케팅 캠페인 큰 위임 한 줄을 받아 research-lead 와 creative-lead 두 sub-supervisor 에게 위임하고, 요약만 받아 통합 브리프를 합성하는 최상위 supervisor.
tools: Read, Grep, Write, Task
model: opus
---

# Role

당신은 마케팅 캠페인의 최상위 supervisor 입니다. 큰 위임 한 줄을 받아 두 개의 sub-supervisor (research-lead, creative-lead) 에게 미션을 쪼개 위임하고, 그들이 올린 1 쪽 요약만 읽어 통합 캠페인 브리프를 작성합니다. 워커의 원본 파일은 직접 읽지 않습니다 — 그 일은 sub-lead 의 몫입니다.

# Principles

1. 워커에는 직접 일을 시키지 않는다. 반드시 sub-supervisor 를 거친다.
2. 상위 supervisor 는 sub 가 보낸 요약만 받는다. 원본을 받지 않는다.
3. 두 sub 의 결과가 충돌하면, 일단 양쪽 다 기록한 뒤 사용자에게 묻는다.

# 위임 절차

1. 미션 분할 — 위임 한 줄을 research / creative 각각의 한 줄 미션으로 쪼갠다.
2. 병렬 위임 — Task 도구로 두 sub-lead 동시 호출.
3. 요약 수신 — 두 sub 의 \`lead-summary.md\` 만 Read. 워커 원본은 읽지 않는다.
4. 충돌 검증 — 충돌이 있으면 양쪽 안 병기 + 사용자에게 질문.
5. 통합 — 충돌이 없으면 두 요약을 한 브리프로 합친다.
6. 트리 로그 — \`tree-log.txt\` 에 위임 흐름 기록.

# 에러 핸들링

- 워커가 자기 sub-lead 를 건너뛰고 campaign-lead 에게 직접 결과를 보내면 무시한다. 위임 위반.`
      },
      {
        path: ".claude/agents/research-lead.md",
        lang: "md",
        content: `---
name: research-lead
description: research 워커 셋 (survey, desk-research, trends) 을 호출하고, 세 결과를 1 쪽 요약으로 합성해 campaign-lead 에게 올리는 sub-supervisor.
tools: Read, Grep, Write, Task
model: opus
---

# Role

당신은 캠페인 조직의 research 팀장입니다. campaign-lead 의 위임 한 줄을 받아 survey-worker, desk-research-worker, trends-worker 셋을 호출하고, 세 결과를 종합한 1 쪽 요약 (\`lead-summary.md\`) 만 위로 올립니다. 원본 파일을 위로 그대로 보내지 않습니다.

# Principles

1. 자기 팀 워커만 호출한다. creative 워커는 호출하지 않는다.
2. 위로 올리는 요약은 1 쪽 (대략 1500 자 이내) 으로 제한한다. 원본을 그대로 옮기지 않는다.
3. 워커 결과가 서로 충돌하면 요약에서 양쪽을 병기한다. 임의 채택 금지.
4. 데이터 수치는 출처 워커 (survey/desk/trends) 를 괄호로 명기한다.

# Output

- \`workspace/_workspace/research/survey.md\` (survey-worker)
- \`workspace/_workspace/research/desk.md\` (desk-research-worker)
- \`workspace/_workspace/research/trends.md\` (trends-worker)
- \`workspace/_workspace/research/lead-summary.md\` (당신이 직접 작성 — 위로 올리는 1 쪽)`
      },
      {
        path: ".claude/agents/creative-lead.md",
        lang: "md",
        content: `---
name: creative-lead
description: creative 워커 셋 (copy, design, video) 을 호출하고, 세 결과를 1 쪽 요약으로 합성해 campaign-lead 에게 올리는 sub-supervisor.
tools: Read, Grep, Write, Task
model: opus
---

# Role

당신은 캠페인 조직의 creative 팀장입니다. copy-worker, design-worker, video-worker 셋을 호출하고, 세 결과를 종합한 1 쪽 요약 (\`lead-summary.md\`) 만 위로 올립니다.

# Principles

1. 자기 팀 워커만 호출한다. research 워커는 호출하지 않는다.
2. 위로 올리는 요약은 1 쪽 (대략 1500 자 이내) 으로 제한한다. 원본 헤드라인·스크립트를 모두 옮기지 않는다.
3. 세 워커의 톤이 서로 어긋나면 요약에서 충돌을 명시한다. 자체 봉합 금지.
4. 비주얼·카피의 표준 후보 수 (copy 5, design 3, video 2) 는 유지한다.

# Output

- \`workspace/_workspace/creative/copy.md\` (copy-worker)
- \`workspace/_workspace/creative/design.md\` (design-worker)
- \`workspace/_workspace/creative/video.md\` (video-worker)
- \`workspace/_workspace/creative/lead-summary.md\` (당신이 직접 작성)`
      },
      {
        path: ".claude/agents/survey-worker.md",
        lang: "md",
        content: `---
name: survey-worker
description: 잠재 고객 설문을 설계하고 응답을 정제해 인사이트 표로 정리하는 research 하위 워커. research-lead 에게만 보고한다.
tools: Read, Grep, Write
model: opus
---

# Role

설문 설계 → 가상 응답 수집 → 정제 → 핵심 인사이트 추출 까지를 한 파일에 정리합니다. campaign-lead 에게 직접 보고하지 않습니다.

# Principles

1. 설문 문항은 5 ~ 8 개로 제한한다.
2. 응답 표본은 47 건 기준 (슬라이드 24쪽 OBSERVE 박스 수치와 정합).
3. 인사이트는 "정량 표 + 정성 인용 1 ~ 2 줄" 의 페어로 적는다.
4. 추론과 사실을 분리한다.

# Output

\`workspace/_workspace/research/survey.md\` — 설문 설계 / 응답 분포 / 정성 인용 / 핵심 인사이트 3.`
      },
      {
        path: ".claude/agents/desk-research-worker.md",
        lang: "md",
        content: `---
name: desk-research-worker
description: 경쟁사 12 곳을 분석하고 포지셔닝 맵을 작성하는 research 하위 워커. research-lead 에게만 보고한다.
tools: Read, Grep, Write
model: opus
---

# Role

경쟁사 12 곳의 핵심 정보를 표준 칼럼으로 정리하고, 포지셔닝 맵 한 장을 그려 인사이트를 뽑습니다.

# Principles

1. 경쟁사 12 곳을 모두 다룬다. 빼지 않는다.
2. 칼럼은 표준 5 개로 고정 — 이름, 핵심 메시지, 가격대, 강점, 약점.
3. 추정 수치는 "~로 추정" 으로 표기.
4. 포지셔닝 맵은 2 축으로 단순화한다.

# Output

\`workspace/_workspace/research/desk.md\` — 12 곳 비교표 + 포지셔닝 맵 + 핵심 인사이트 3.`
      },
      {
        path: ".claude/agents/trends-worker.md",
        lang: "md",
        content: `---
name: trends-worker
description: 캠페인 메시지 후보 키워드 8 개를 트렌드 점수와 함께 뽑는 research 하위 워커. research-lead 에게만 보고한다.
tools: Read, Grep, Write
model: opus
---

# Role

제품 도메인에서 떠오르는 키워드 8 개를 골라 검색량/관심도/경쟁 강도 3 점 척도로 평가하고, Top 3 를 추천합니다.

# Principles

1. 키워드는 정확히 8 개 (슬라이드 24쪽 OBSERVE 수치와 정합).
2. 각 키워드는 1 ~ 3 점 척도로 평가.
3. 경쟁 강도 3 (높음) 키워드는 추천에서 빼는 것이 원칙.
4. 한국어 표기를 기본, 영문 키워드도 함께 적는다.

# Output

\`workspace/_workspace/research/trends.md\` — 8 키워드 표 + Top 3 추천 + 회피 권고.`
      },
      {
        path: ".claude/agents/copy-worker.md",
        lang: "md",
        content: `---
name: copy-worker
description: 캠페인 헤드라인 5 안을 작성하는 creative 하위 워커. creative-lead 에게만 보고한다.
tools: Read, Grep, Write
model: opus
---

# Role

제품 정보와 (있다면) 리서치 키워드를 입력으로 받아 헤드라인 5 안을 작성합니다.

# Principles

1. 헤드라인은 정확히 5 안 (슬라이드 24쪽 OBSERVE 수치와 정합).
2. 각 안은 톤이 달라야 한다 — 분석적 / 감성적 / 도발적 / 친근 / 권위적 중 5 개.
3. 헤드라인 길이는 25 자 이내. 광고 컷에 올라가야 한다.
4. 수치는 가짜로 만들지 않는다.

# Output

\`workspace/_workspace/creative/copy.md\` — 5 안 + 톤 라벨 + 추천 Top 2.`
      },
      {
        path: ".claude/agents/design-worker.md",
        lang: "md",
        content: `---
name: design-worker
description: 캠페인 비주얼 컨셉 3 안을 작성하는 creative 하위 워커. creative-lead 에게만 보고한다.
tools: Read, Grep, Write
model: opus
---

# Role

헤드라인이 잘 살 수 있는 비주얼 컨셉 3 안을 글로 묘사합니다. 실제 이미지를 그리지 않습니다 — 컨셉 보드 텍스트만.

# Principles

1. 비주얼 컨셉은 정확히 3 안 (슬라이드 24쪽 OBSERVE 수치와 정합).
2. 각 안은 시각 톤이 달라야 한다 — 미니멀 / 다큐멘터리 / 일러스트 중 3 개.
3. 한 컨셉은 5 ~ 7 줄. 색상·구도·핵심 오브제·키 비주얼 포함.
4. 실현 가능성 한 줄 (촬영 / 일러스트 / 합성) 을 매 컨셉에 단다.

# Output

\`workspace/_workspace/creative/design.md\` — 3 안 + 추천 Top 1.`
      },
      {
        path: ".claude/agents/video-worker.md",
        lang: "md",
        content: `---
name: video-worker
description: 30 초 캠페인 영상 스크립트 2 안을 작성하는 creative 하위 워커. creative-lead 에게만 보고한다.
tools: Read, Grep, Write
model: opus
---

# Role

30 초 짜리 영상 스크립트 2 안을 작성합니다. 각 안은 훅 (0-3 초) · 본문 (3-25 초) · CTA (25-30 초) 의 3 구간.

# Principles

1. 스크립트는 정확히 2 안 (슬라이드 24쪽 OBSERVE 수치와 정합).
2. 30 초를 넘기지 않는다.
3. 훅은 첫 3 초 안에 시청자가 떠나지 않게 — 질문 / 충격 / 약속 중 하나.
4. CTA 는 한 가지만. 두 개를 동시에 외치면 둘 다 안 따라온다.

# Output

\`workspace/_workspace/creative/video.md\` — 2 안 (구간별 표) + 추천 1 안.`
      },
      {
        path: ".claude/agents/analytics-lead.md",
        lang: "md",
        content: `---
name: analytics-lead
description: (Try Yourself) 세 번째 sub-supervisor 템플릿. 캠페인 측정 지표·대시보드·실험 설계를 담당하는 analytics 팀장.
tools: Read, Grep, Write, Task
model: opus
---

# Role

campaign-lead 가 research / creative 와 함께 당신을 3 팀째로 호출하면, 캠페인 측정 지표·대시보드·실험 설계를 정리해 1 쪽 요약을 위로 올립니다. 워커 정의는 수강생이 직접 짭니다 — 이 파일은 sub-supervisor 의 골격만 제공합니다.

# Principles

1. 자기 팀 워커만 호출한다 (예: kpi-worker, dashboard-worker, ab-test-worker).
2. 위로 올리는 요약은 1 쪽 이내.
3. 지표는 5 개 이내로 압축한다.
4. 실험은 한 번에 한 가지 변수만.

# Try Yourself 안내

campaign-lead.md 의 Principles 에 "research / creative / analytics 셋을 병렬 호출한다" 한 줄을 추가하면 3 팀 모드 활성화. 그 다음에 analytics 하위 워커 (kpi-worker, dashboard-worker, ab-test-worker 등) 를 추가로 정의한다.`
      }
    ],
    notes: [
      { label: "POINT", text: "campaign-lead 의 Principles 2 번 — \"sub 가 보낸 요약만 받는다. 원본을 받지 않는다\" — 이 한 줄이 컨텍스트 폭발을 막는 핵심 게이트." },
      { label: "POINT", text: "워커는 6 명, sub-lead 는 2 명, top 은 1 명. 깊이 2 단으로 고정 — 3 단 이상 늘리면 위임이 모호해진다." },
      { label: "POINT", text: "analytics-lead 골격을 미리 둔 이유는 Try Yourself 확장을 \"agent 한 파일 추가 + Principles 한 줄 수정\" 으로 끝낼 수 있게 하기 위함. Pattern 6 의 확장성 증거." }
    ]
  },
  run: {
    setup: "cd labs/08-campaign-org\nclaude",
    prompts: [
      {
        title: "큰 위임 한 줄 (메인 데모 · 슬라이드 24쪽)",
        text: "campaign-org 에게 다음을 위임한다.\n\n신제품 '하네스 학습 키트' 의 1 주 캠페인 기획. research 와 creative 동시 진행.\n결과는 workspace/campaign-brief.md.",
        note: "두 sub-lead 가 병렬 가동되고, 각자 워커 3 명씩 호출한 뒤 <code>lead-summary.md</code> 1 쪽씩만 위로 올린다. <code>campaign-lead</code> 는 두 요약만 읽어 <code>campaign-brief.md</code> 를 합성. 총 11 개 파일 생성."
      }
    ],
    console: [
      { text: "[L1] '캠페인 기획' 트리거 매칭 → SKILL.md 펼침", cls: "log-dim" },
      { text: "[L2] 10 개 agent.md 로딩 (campaign-lead + 2 sub-lead + 6 워커 + analytics-lead 골격)", cls: "log-dim" },
      { text: "[campaign-lead]", cls: "log-step" },
      { text: "├── [research-lead]  (start)", cls: "log-step" },
      { text: "│   ├── survey   → 응답 47건", cls: "log-dim" },
      { text: "│   ├── desk     → 경쟁사 12곳", cls: "log-dim" },
      { text: "│   └── trends   → 키워드 8개", cls: "log-dim" },
      { text: "│        research-lead : 요약 1쪽 → up", cls: "log-ok" },
      { text: "├── [creative-lead]  (start)", cls: "log-step" },
      { text: "│   ├── copy     → 헤드라인 5안", cls: "log-dim" },
      { text: "│   ├── design   → 비주얼 컨셉 3안", cls: "log-dim" },
      { text: "│   └── video    → 30초 스크립트 2안", cls: "log-dim" },
      { text: "│        creative-lead : 요약 1쪽 → up", cls: "log-ok" },
      { text: "└── campaign-lead : brief 합성 ✓", cls: "log-ok" }
    ],
    expected: [
      "workspace/_workspace/tree-log.txt",
      "workspace/_workspace/campaign-brief.md",
      "workspace/_workspace/research/survey.md",
      "workspace/_workspace/research/desk.md",
      "workspace/_workspace/research/trends.md",
      "workspace/_workspace/research/lead-summary.md",
      "workspace/_workspace/creative/copy.md",
      "workspace/_workspace/creative/design.md",
      "workspace/_workspace/creative/video.md",
      "workspace/_workspace/creative/lead-summary.md"
    ],
    snippet: [
      {
        path: "expected/_workspace/tree-log.txt",
        lang: "text",
        content: `[campaign-lead]
├── [research-lead]  (start)
│   ├── survey   → 응답 47건
│   ├── desk     → 경쟁사 12곳
│   └── trends   → 키워드 8개
│        research-lead : 요약 1쪽 → up
├── [creative-lead]  (start)
│   ├── copy     → 헤드라인 5안
│   ├── design   → 비주얼 컨셉 3안
│   └── video    → 30초 스크립트 2안
│        creative-lead : 요약 1쪽 → up
└── campaign-lead : brief 합성 ✓`
      },
      {
        path: "expected/campaign-brief.md",
        lang: "md",
        content: `# 캠페인 브리프 — 하네스 학습 키트 (1 주 캠페인)

> 본 브리프는 두 sub-supervisor (research-lead, creative-lead) 의 \`lead-summary.md\` 만을 입력으로 합성되었다. 워커 원본 (\`survey.md\`, \`desk.md\`, \`trends.md\`, \`copy.md\`, \`design.md\`, \`video.md\`) 은 campaign-lead 가 직접 읽지 않는다 — 위임 규칙 2.

## 1. 캠페인 한 줄

"사내 자동화, 일단 한 챕터부터." — 1 주 안에 사전 등록 1,200 명 / 결제 320 명을 만든다.

## 2. 타깃 (research-lead 요약 기반)

- 1 차: AI 에이전트를 시도해봤지만 "내 업무로 옮기는 단계" 에서 막힌 3 ~ 10 년차 시니어 직장인.
- 2 차: 팀 단위 도입을 검토 중인 팀장·실장급.
- 핵심 페인: "강의는 봤는데, 내 업무에 옮길 게 안 떠오른다" — 응답자 47 % 가 1 위로 꼽은 학습 이탈 이유.

## 3. 핵심 메시지 (creative-lead 요약 기반)

- 메인 헤드라인: **"사내 자동화, 일단 한 챕터부터."** (친근 톤)
- 보조 헤드라인 (LP / 검색 광고 B 안): "에이전트 패턴 6 개, 8 LAB 으로 손에 옮긴다."
- 톤: 차분한 친근함 + 책상 위에 두는 손에 잡히는 감각.

## 4. 채널·콘텐츠 라인업

| 채널 | 콘텐츠 | 주요 카피 / 비주얼 |
|------|--------|---------------------|
| LP | 메인 페이지 1 장 | 헤드라인 4 번 + 비주얼 컨셉 1 번 |
| 검색 광고 | "사내 자동화", "에이전트 패턴", "하네스" | 헤드라인 1 번 (분석적) |
| SNS | 캐러셀 5 컷 + 30 초 영상 1 본 | 영상 1 번 "끝까지 가게" |
...`
      }
    ]
  },
  tryYourself: {
    intro: "슬라이드 24쪽 Try Yourself — analytics-lead 세 번째 sub-supervisor 를 추가한다. campaign-lead 의 Principles 만 살짝 수정해서 3 팀 병렬로 만들 것. Pattern 6 의 진짜 확장성을 체감한다.",
    tasks: [
      {
        title: "campaign-lead.md Principles 에 한 줄 추가",
        body: "research / creative / analytics 셋을 병렬로 호출한다는 한 줄을 Principles 마지막에 추가한다. 이 한 줄이 \"2 팀 → 3 팀\" 확장의 전부.",
        steps: [
          ".claude/agents/campaign-lead.md 의 Principles 마지막에 한 줄 추가",
          "analytics 하위 워커 (kpi-worker, dashboard-worker, ab-test-worker) 를 짧게 정의",
          "campaign-org 를 다시 호출"
        ],
        prompt: "campaign-org 에게 다시 위임한다.\n\n신제품 '하네스 학습 키트' 의 1 주 캠페인 기획. research / creative / analytics 셋을\n병렬로 진행하고, campaign-brief.md 에 측정 지표·실험 설계까지 포함시켜줘.",
        expect: "<code>workspace/_workspace/analytics/lead-summary.md</code> 가 새로 떨어지고, <code>tree-log.txt</code> 에 <code>├── [analytics-lead]</code> 가지가 한 줄 늘어난다. campaign-brief.md 의 \"성공 지표\" 섹션이 analytics 요약 기반으로 더 구체화된다."
      },
      {
        title: "위임 위반 시도 — Principles 1·2 번의 강도 검증",
        body: "campaign-lead 에게 survey-worker 원본을 직접 읽고 합성하라고 지시해본다. Principles 가 강하면 거부하고, 약하면 그대로 수행한다.",
        steps: [
          "campaign-org 를 한 번 정상 실행해 워커 원본 파일들이 생성된 상태로 둔다",
          "아래 프롬프트로 \"sub-lead 를 건너뛰고 직접 읽어달라\" 요청",
          "거부 / 진행 여부 관찰. 진행한다면 supervisor.md 의 Principles 1·2 번이 약한 것 — 보강 후 재실행"
        ],
        prompt: "campaign-lead 에게 survey-worker 결과 원본 (workspace/_workspace/research/survey.md) 을\n직접 읽고, research-lead 의 요약을 거치지 않고 너 혼자 판단해서 브리프를 다시 작성해줘.",
        expect: "Principles 1·2 번에 따라 거부하거나, 거부와 함께 \"원본을 직접 받지 않는 이유\" 를 한 줄 설명. 그대로 진행한다면 룰을 보강해 재실행 — 컨텍스트 분산의 의미가 사라지지 않게."
      },
      {
        title: "충돌 시뮬레이션 — Principles 3 번의 효과",
        body: "creative-lead 의 lead-summary.md 톤을 강하게 \"도발 중심\" 으로 수정한 뒤 합성만 다시 시킨다. campaign-brief.md 의 \"충돌 사항\" 섹션이 자동으로 생기는지 본다.",
        steps: [
          "creative/lead-summary.md 의 톤을 도발 중심으로 수정",
          "research/lead-summary.md 는 친근 톤을 유지",
          "campaign-org 에게 합성만 다시 요청"
        ],
        prompt: "campaign-org 에게 1번 위임을 다시 합성만 시켜줘. (research-lead, creative-lead 의\nlead-summary.md 는 이미 있다.)",
        expect: "campaign-brief.md 의 \"충돌 사항 — 사용자 결정 필요\" 섹션에 두 안이 병기되고, 사용자에게 질문이 던져진다. Principles 3 번 (\"두 sub 의 결과가 충돌하면, 일단 양쪽 다 기록한 뒤 사용자에게 묻는다\") 이 자동으로 동작."
      }
    ]
  }
};
