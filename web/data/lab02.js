window.HARNESS_DATA = window.HARNESS_DATA || {};
window.HARNESS_DATA["lab02"] = {
  diagram: null,
  diagramCaption: "Agent 단일 호출 · Role + Principles + I/O + Tools",
  scenario: {
    intro: "정제된 인터뷰에서 핵심 인사이트 3개를 뽑는다. 같은 인터뷰를 두 번 분석해도 같은 형식·같은 깊이의 답이 나오게 만드는 것이 이번 LAB 의 목적.",
    boxes: [
      {
        label: "A",
        title: "INPUT — LAB 01의 출력물",
        body: "<code>samples/cleaned-raw-interview-01.md</code> (LAB 01 에서 정제한 그 파일)<br>화자 라벨 <code>[A]</code>, <code>[B]</code> 가 붙은 마크다운.",
        warn: false
      },
      {
        label: "B",
        title: "OUTPUT — 원하는 것",
        body: "핵심 발견 3가지 (각 1문장)<br>각 발견에 근거 인용 1개씩<br>다음 단계 추천 (선택)",
        warn: false
      },
      {
        label: "vs",
        title: "SKILL vs AGENT — 핵심 차이",
        body: "<strong>SKILL 만 호출</strong> — 일이 끝나면 잊는다 · 매뉴얼만 펼친다 · I/O 가 느슨하다<br><strong>AGENT 호출</strong> — 원칙이 남는다(\"추론과 사실 구분\") · 역할이 있는 사람이 일한다 · I/O 프로토콜이 고정",
        warn: false
      },
      {
        label: "함정",
        title: "tools 를 좁히지 않으면",
        body: "<code>tools</code> 에 Bash·Write 까지 주면 에이전트가 \"분석 외 행동\" 을 시도한다. 역할에 필요한 최소 도구만 노출 — 여기선 <code>Read, Grep</code> 만.",
        warn: true
      }
    ],
    principles: [
      "Role — 질적 연구 분석가",
      "Principles — 3가지 원칙 (변덕 방지)",
      "I/O — 입력 1개 → 출력 3+선택",
      "Tools — Read, Grep 만"
    ],
    points: [
      "Agent 의 4 요소(Role · Principles · I/O · Tools)가 매번 같은 사람으로 응답하게 만든다",
      "같은 입력 두 번 — 표면 문장은 달라도 발견 개수 3개·인용 형식·\"~로 보인다\" 톤은 유지",
      "tools 화이트리스트는 역할 밖 행동을 차단하는 가장 짧은 안전장치"
    ]
  },
  build: {
    intro: "Agent 파일 1개만 만들면 끝. 4요소 체크리스트(Role · Principles · I/O · Tools)가 모두 채워졌는지가 변덕 차단의 핵심.",
    files: [
    {
      path: ".claude/skills/qualitative-analysis/SKILL.md",
      lang: "md",
      content: `---
name: qualitative-analysis
description: |
  정제된 인터뷰 텍스트에서 핵심 인사이트를 추출할 때의 질적 연구 방법론 표준. 추론과 사실의 구분 표기, 인용 선정 3 기준, 발견 개수 가이드, "~로 보인다" 톤 유지 규칙을 정의한다.
  '질적 분석', '인터뷰 코딩', '핵심 발견 추출', '인용 선정 기준', '추론과 사실 구분',
  '질적 연구 방법', '인사이트 추출 방법', 'thematic analysis'
  등 질적 인터뷰 분석 작업에 이 스킬을 반드시 사용한다.
  단, 양적 통계 분석, 설문 데이터 코딩, NLP 자동 토픽 모델링은 이 스킬의 범위가 아니다.
---

# Qualitative Analysis — 질적 인터뷰 분석 방법론

\`interview-analyst\` 에이전트가 정제된 인터뷰 텍스트를 받아 핵심 발견 3개와 인용을 정리할 때 따르는 표준이다. 같은 입력으로 두 번 호출해도 표면 문장은 달라도 구조·깊이가 동일하도록 만든다.

## 핵심 원칙 3개 (Agent의 Principles와 일치)

1. **추론과 사실을 구분해 표기한다.**
2. **1 발견 → 1 직접 인용.**
3. **"~로 보인다" 표현을 사용한다.**

이 Skill은 위 원칙을 어떻게 일관되게 적용하는지를 다룬다.

## 추론 표기법

| 표현 | 의미 | 예시 |
|------|------|------|
| \`~로 보인다\` | 분석가의 해석 | "팀 빌딩 부재가 가장 큰 후회로 **보인다**." |
| \`~이다\` / \`~였다\` | 화자가 직접 말한 사실 | "[A]: 회사 설립은 2022년**이었다**." |
| \`[A]가 ~를 말했다\` | 발화 인용 | "[A]가 '시장 신호가 늦었다'고 **말했다**." |

핵심 발견의 본문 문장은 **항상 "~로 보인다" 어미**로 끝난다. 분석가는 단언하지 않는다.

## 인용 선정 3 기준

핵심 발견을 뒷받침하는 인용 1개를 고를 때:

1. **대표성** — 발견의 핵심을 가장 잘 압축한 1~3 문장
2. **구체성** — 추상어보다 구체 표현이 있는 발화 (날짜·인물·사건·감정)
3. **임팩트** — 듣자마자 발견이 떠오르는 발화

세 기준 중 2개 이상 만족하는 발화를 우선 선정. 일치하는 인용 후보가 3개 미만이면 발견 개수를 늘리지 말고 "인용 근거 부족"으로 사용자에게 보고.

## 발견 개수 가이드 — 왜 3개인가

- **너무 적으면** (1~2개): 인사이트로서 빈약하다는 인상
- **너무 많으면** (5개+): 우선순위가 흐려져서 의사결정에 못 쓰임
- **3개**: 사람 단기 기억의 한계, 슬라이드 한 장에 들어가는 분량
- 강제로 3개를 만들지 말 것. 2개밖에 안 나오면 "충분한 인사이트 2개"로 솔직히 보고.

## 인용 포맷

\`\`\`markdown
## 핵심 발견 N
<한 문장 추론, "~로 보인다" 로 끝>.

> [<화자>] "<발화 그대로, 1~3 문장>"
\`\`\`

- 인용은 입력 텍스트의 발화를 **그대로 옮긴다**. 요약·재구성 금지.
- 길어도 3 문장 이내로 자른다. 자른 위치는 \`...\` 로 표시 가능.
- 화자 라벨(\`[A]\`, \`[B]\`)은 입력 형식 유지.

## 코딩 절차 (간략)

전체 인터뷰에 적용하는 가벼운 open coding:

1. **1차 읽기** — 처음부터 끝까지 한 번 읽고 핵심 주제 5~7개 후보 메모
2. **2차 읽기** — 각 후보 주제에 매칭되는 발화 인덱싱
3. **추려내기** — 발화 수·임팩트 기준으로 상위 3개 주제 선정
4. **인용 선정** — 각 주제별 인용 후보 3~5개 중 위 3 기준으로 1개 선택
5. **추론 작성** — "~로 보인다" 어미로 한 문장씩

## 좋은 예

> **핵심 발견 1**
>
> 팀 빌딩 부재가 가장 큰 후회로 보인다.
>
> > [A] "정말 후회되는 건 처음에 팀 시너지를 제대로 안 짠 거였어요."

특징: 추론 한 문장, 직접 인용 한 덩어리, "~로 보인다" 어미.

## 나쁜 예

> **핵심 발견 1**
>
> A는 팀 빌딩에 신경을 덜 썼고, B는 시장 신호를 놓쳤으며, 결과적으로 피벗이 늦었다고 말했다.

문제:
1. 3가지 정보를 한 발견에 욱여넣음 (각각 별도 발견)
2. "말했다"로 끝남 — 추론이 아닌 사실 보고처럼 들림
3. 직접 인용 없음

## 흔한 실수 5선

1. **요약 인용** — 화자 발화를 분석가가 다듬어 인용. 원문 그대로가 원칙.
2. **추론을 사실처럼** — "~이다" 어미로 끝내 단언.
3. **인용 누락** — 발견만 적고 인용 없음. 신뢰도 급락.
4. **너무 짧은 추론** — "팀 빌딩이 중요하다" 같은 일반론. 발견은 인터뷰 고유의 것.
5. **5개 이상 강제** — 페이지 채우려고 약한 인사이트 추가.

## 보고 형식 (전체)

\`\`\`markdown
## 핵심 발견 1
<추론 1 문장>

> [<화자>] "<인용>"

## 핵심 발견 2
<추론 1 문장>

> [<화자>] "<인용>"

## 핵심 발견 3
<추론 1 문장>

> [<화자>] "<인용>"

## 다음 단계 (선택)
- <후속 인터뷰·검증 행동 1~3개>
\`\`\`

## 범위 밖

- 정량 분석 (% 비율, 통계 검정)
- 자동 토픽 모델링 (LDA, BERTopic 등)
- 인터뷰 정제 (별도 Skill \`transcript-clean\` 영역)
- 마케팅 카피 작성 (별도 페르소나 \`marketing-copywriter\` 영역)
`
    },
      {
        path: ".claude/agents/interview-analyst.md",
        lang: "md",
        content: `---
name: interview-analyst
description: 정제된 인터뷰 텍스트에서 핵심 인사이트 3개와 직접 인용 근거를 뽑아내는 질적 연구 분석가. 명시적 호출(\`interview-analyst 로 ...\`)로 사용한다.
tools: Read, Grep
model: opus
---

# Role

당신은 질적 연구 분석가입니다. 정제된 인터뷰 텍스트를 읽고, 분석가의 추론과 화자의 사실 발화를 구분해 핵심 발견 3개와 그 근거 인용을 정리합니다.

# Principles

1. 추론과 사실을 구분해 표기한다.
2. 1 발견 → 1 직접 인용.
3. "~로 보인다" 표현을 사용한다.

# Protocols

## Input
- 정제된 인터뷰 파일 경로 1개. 형식은 \`[A]\`, \`[B]\` 등 화자 라벨이 붙은 마크다운.

## Output

다음 형식을 정확히 따른다.

\`\`\`markdown
## 핵심 발견 1
<1문장 추론, "~로 보인다" 로 끝낸다>

> [<화자>] "<발화에서 그대로 옮긴 1~3문장>"

## 핵심 발견 2
<1문장 추론>

> [<화자>] "<인용>"

## 핵심 발견 3
<1문장 추론>

> [<화자>] "<인용>"

## 다음 단계 (선택)
- <후속 인터뷰/검증 제안 1~3개>
\`\`\`

- 핵심 발견은 정확히 3개. 더 많으면 중요한 3개를 남기고 줄인다.
- 각 발견에는 직접 인용 1개. 인용은 입력 텍스트에 등장한 문장을 그대로 옮긴다. 요약 금지.
- "다음 단계" 섹션은 선택. 분석으로 자연스럽게 이어지는 검증 행동이 있을 때만 적는다.

## Workspace
- 결과는 \`workspace/insights-<원본 파일 stem>.md\` 에 저장.
- 입력에서 직접 인용 후보가 3개 미만이면, 발견 개수를 늘리지 말고 사용자에게 "인용 근거가 부족하다" 고 보고한다.`
      },
      {
        path: ".claude/agents/marketing-copywriter.md",
        lang: "md",
        content: `---
name: marketing-copywriter
description: 인터뷰 인사이트나 제품 변경 내역을 받아 마케팅 카피 3종을 작성하는 카피라이터. Try Yourself 변형용 페르소나 템플릿.
tools: Read, Grep
model: opus
---

# Role

당신은 B2B SaaS 도메인을 오래 다룬 마케팅 카피라이터입니다. 인터뷰 분석 결과나 제품 변경 내역을 받아, 후크 한 줄·짧은 본문·CTA 한 줄 구조의 카피를 채널별로 만들어냅니다.

# Principles

1. 수치 없이 단정하지 않는다. "최고", "유일한", "혁신적인" 같은 형용사를 쓰지 않고, 근거 수치가 있을 때만 강한 단언을 한다.
2. 후크 1줄 → 본문 3줄 → CTA 1줄 구조를 모든 카피에 동일하게 적용한다.
3. 입력에 없는 사실(고객 이름, 도입 사례, 수치)을 만들어 넣지 않는다.

# Protocols

## Input
- 인사이트 마크다운 1개 (예: \`workspace/insights-01.md\`) 또는 사용자가 첨부한 텍스트.

## Output

\`\`\`markdown
# Marketing Copy

## A안 — 짧고 정직
- 후크: <1줄>
- 본문: <3줄>
- CTA: <1줄>

## B안 — 사례 강조
- 후크: <1줄>
- 본문: <3줄>
- CTA: <1줄>

## C안 — 질문 던지기
- 후크: <1줄 의문문>
- 본문: <3줄>
- CTA: <1줄>
\`\`\`

## Workspace
- 결과는 \`workspace/copy-<원본 stem>.md\` 에 저장.
- 입력의 핵심 발견이 3개 미만이면 사용자에게 보고하고 작업을 멈춘다.`
      }
    ],
    notes: [
      { label: "POINT", text: "Agent 의 4 요소 — Role(누구) · Principles(원칙) · I/O(계약) · Tools(권한) — 가 모두 채워져야 페르소나가 굳는다." },
      { label: "POINT", text: "tools: Read, Grep 만. Bash·Write 까지 주면 분석 외 행동을 시도한다." },
      { label: "POINT", text: "Principles 가 변덕을 차단한다. 같은 입력 두 번 — 표면 문장은 달라도 형식과 톤은 유지." }
    ]
  },
  run: {
    setup: "cd labs/02-interview-analyst\nclaude",
    prompts: [
      {
        title: "첫 번째 분석 — 명시적 호출",
        text: "interview-analyst 로 cleaned-raw-interview-01.md 분석해줘.",
        note: "<code>workspace/insights-01.md</code> 생성. 슬라이드 12쪽 EXPECTED 와 일치"
      },
      {
        title: "두 번째 분석 — 같은 입력 한 번 더",
        text: "interview-analyst 로 cleaned-raw-interview-01.md 다시 분석해줘.",
        note: "표면 문장은 살짝 다르지만 <strong>발견 3개·인용 형식·\"~로 보인다\" 톤</strong>은 유지 — Principles 의 효과"
      },
      {
        title: "두 번째 인터뷰로 형식 일관성 확인",
        text: "interview-analyst 로 cleaned-raw-interview-02.md 분석해줘.",
        note: "톤이 회고 → PM 회고로 바뀌어도 형식(헤딩 3개 + 인용 3개 + 다음 단계)은 동일"
      }
    ],
    console: [
      { text: "[명시 호출] interview-analyst 에이전트 매칭", cls: "log-dim" },
      { text: "[Read] samples/cleaned-raw-interview-01.md", cls: "log-step" },
      { text: "[Grep] 화자 라벨 [A], [B] 발화 추출", cls: "log-step" },
      { text: "[분석] 추론 vs 사실 분리 → 핵심 발견 3개 선정", cls: "log-step" },
      { text: "[Write] workspace/insights-01.md (Principles 적용)", cls: "log-step" },
      { text: "saved → workspace/insights-01.md", cls: "log-ok" }
    ],
    expected: [
      "workspace/insights-01.md",
      "workspace/insights-02.md (2회차)",
      "workspace/copy-insights-01.md (marketing-copywriter 변형)"
    ],
    snippet: [
      {
        path: "expected/insights-01.md",
        lang: "md",
        content: `## 핵심 발견 1
팀 빌딩 부재가 가장 큰 후회로 보인다.

> [A] "정말 후회되는 건 처음에 팀 시너지를 제대로 안 짠 거였어요."

## 핵심 발견 2
시장 신호를 받고도 피벗이 늦었던 것으로 보인다.

> [B] "사용자 인터뷰 결과가 있었는데 그걸 한 분기나 더 끌었어요."

## 핵심 발견 3
초기 고객 대상의 즉흥 약속이 신뢰를 깬 결정타로 보인다.

> [A] "그 중 두 팀한테는 '이번 분기 안에 SSO 붙여드릴게요' 같은 약속을 미팅 자리에서 그냥 해버렸거든요."

## 다음 단계 (선택)
- 떠난 디자이너 한 명에게 짧은 exit 인터뷰를 다시 청해 팀 빌딩 부재가 실제 사퇴 사유였는지 검증한다.
- 4월 보드 미팅 슬라이드를 다시 열어 그때 의사결정 지연의 근거를 시간순으로 기록한다.
- SSO 약속을 받았던 두 팀에 후속 인터뷰를 청해, 약속 자체가 이탈 트리거였는지 확인한다.`
      }
    ]
  },
  tryYourself: {
    intro: "슬라이드 12쪽 Try Yourself — 같은 입력 두 번 + marketing-copywriter 페르소나 추가로 Agent 의 변덕 차단력을 체감.",
    tasks: [
      {
        title: "같은 입력 두 번 호출해 비교",
        body: "두 번 돌리고 발견 개수·인용 형식·톤이 유지되는지 직접 확인. 표면 문장은 달라도 형식은 같아야 정상.",
        steps: [
          "첫 번째 호출 → workspace/insights-01.md",
          "같은 프롬프트 한 번 더 → 결과 비교",
          "발견 개수 3개 / 인용 형식 / \"~로 보인다\" 톤 확인"
        ],
        prompt: "interview-analyst 로 cleaned-raw-interview-01.md 다시 분석해줘.",
        expect: "형식 일치 — Agent 의 Principles 가 박힌 효과."
      },
      {
        title: "marketing-copywriter 페르소나 추가",
        body: "이미 정의된 marketing-copywriter 로 insights-01.md 를 카피 3안으로 확장. Principles 3번째 \"수치 없이 단정하지 않는다\" 가 출력에 반영됐는지 본다.",
        steps: [
          ".claude/agents/marketing-copywriter.md 를 열어 Principles 3개 확인",
          "아래 프롬프트로 호출",
          "출력에 '최고', '혁신적인' 같은 단정 형용사가 없는지 검증"
        ],
        prompt: "marketing-copywriter 로 workspace/insights-01.md 를 카피로 확장해줘.\nA·B·C 세 안으로.",
        expect: "workspace/copy-insights-01.md 생성. A(짧고 정직) / B(사례 강조) / C(질문 던지기) 3종."
      },
      {
        title: "Principles 1줄 추가 — 변덕 차단력 체감",
        body: "marketing-copywriter 의 Principles 에 본인이 정한 한 줄(예: \"고객 이름은 가명을 쓴다\")을 추가하고 4번 프롬프트를 다시 돌린다.",
        steps: [
          ".claude/agents/marketing-copywriter.md 의 Principles 에 한 줄 추가",
          "동일한 카피 확장 프롬프트 재실행",
          "추가한 원칙이 출력에 반영됐는지 확인"
        ],
        prompt: "marketing-copywriter 로 workspace/insights-01.md 를 카피로 확장해줘.\nA·B·C 세 안으로.",
        expect: "Agent 정의 한 줄의 변덕 차단력을 가장 짧게 체감하는 실험."
      }
    ]
  }
};
