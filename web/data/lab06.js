window.HARNESS_DATA = window.HARNESS_DATA || {};
window.HARNESS_DATA["lab06"] = {
  diagram: "pattern-4-producer-reviewer.svg",
  diagramCaption: "통과될 때까지 다시 쓰기 · max_iterations 3",
  scenario: {
    intro: "블로그 초안(LAB 03 의 출력)을 입력으로 받아 producer 가 다듬고 reviewer 가 룰북으로 검사한다. fail 이면 rewrite_hint 와 함께 다시 쓴다. 최대 3회. 그 이상이면 사용자에게 에스컬레이션.",
    boxes: [
      {
        label: "A",
        title: "\"앤디 스타일\" 의 룰북 5줄",
        body: "1. 1 문장은 25자 이하로<br>2. 한 문단에 추상어 2개 이하<br>3. 비유는 반드시 일상에서<br>4. 인용은 즉시 출처와 함께<br>5. 같은 단어를 한 문단에서 2번 이상 쓰지 않기",
        warn: false
      },
      {
        label: "B",
        title: "reviewer 출력 형식",
        body: "<code>verdict: pass | fail</code><br><code>violations: [rule_id, line, snippet] × N</code><br><code>rewrite_hint: 1문장</code>",
        warn: false
      },
      {
        label: "WHY",
        title: "왜 Producer-Reviewer 인가",
        body: "품질이 안 잡힐 때, 한 번 쓰고 끝내지 않고 룰북으로 검사 → 실패하면 힌트와 함께 다시 쓴다. 같은 모델이라도 reviewer 라는 다른 페르소나가 검사하면 자기 글을 더 객관적으로 본다.",
        warn: false
      },
      {
        label: "함정",
        title: "종료 조건이 살아 있어야 한다",
        body: "<strong>무한 루프 방지</strong>, 최대 N 회 시도 후에는 사람에게 에스컬레이션. <code>max_iterations: 3</code> + <code>pass_when: reviewer.verdict == \"pass\"</code> + <code>on_max_reached: escalate_to_user</code>.",
        warn: true
      }
    ],
    principles: [
      "max_iterations: 3 — 종료 조건이 살아 있어야 한다",
      "pass_when: reviewer.verdict == \"pass\"",
      "on_max_reached: escalate_to_user",
      "producer 와 reviewer 는 반드시 짝으로 호출",
      "룰북은 별도 스킬로 분리 — 본 스킬은 룰북 텍스트를 복제하지 않는다"
    ],
    points: [
      "두 페르소나로 갈라야 자기 글을 객관적으로 검사한다",
      "rewrite_hint 한 문장이 다음 라운드의 방향을 정한다",
      "라운드별 산출물은 _workspace/round_<N>_<role>.{md,json} 형식으로 누적"
    ]
  },
  build: {
    intro: "SKILL 2개(오케스트레이터 + 룰북) + Agent 2개(producer + reviewer). 룰북을 별도 스킬로 분리해 reviewer 가 Read 로만 참조 — 본 스킬은 룰북 텍스트를 복제하지 않는다.",
    files: [
      {
        path: ".claude/skills/andy-style-loop/SKILL.md",
        lang: "md",
        content: `---
name: andy-style-loop
description: |
  앤디 스타일 품질 루프 스킬. 블로그 초안을 입력으로 받아 producer 가 다듬고 reviewer 가 룰북으로 검사하는 사이클을 반복한다. fail 시 rewrite_hint 와 함께 producer 가 다시 쓰고, pass 면 종료. 최대 3회까지 반복하며 그 이후엔 사용자에게 에스컬레이션한다.
  '앤디 스타일', '글 다듬기', '문체 정리', 'Producer-Reviewer 루프', '스타일 가이드 적용', '글 검사 루프', '리뷰어 루프', '룰북 적용' 등 글 품질 루프 전반에 이 스킬을 반드시 사용한다.
  단, 표절 검사, 번역, 사실 확인(팩트체크)은 이 스킬의 범위가 아니다.
---

# Andy Style Loop — Producer-Reviewer 루프

## 에이전트 구성

| 에이전트 | 역할 |
|----------|------|
| producer | 입력 글을 받아 앤디 스타일로 다듬는다. 2회차부터는 reviewer 의 rewrite_hint 를 반영. |
| reviewer | andy-style-rulebook 의 5개 규칙으로 검사. verdict + violations + rewrite_hint 반환. |

## 종료 조건 (오케스트레이터)

\`\`\`yaml
max_iterations: 3
pass_when: reviewer.verdict == "pass"
on_max_reached: escalate_to_user
\`\`\`

## 워크플로우

### 라운드 N (N = 1, 2, 3)

1. **producer 호출**
   - 입력: \`workspace/post.md\` (N=1) 또는 직전 rewrite + rewrite_hint (N>1)
   - 출력: \`_workspace/round_<N>_rewrite.md\`

2. **reviewer 호출**
   - 입력: 방금 producer 가 만든 rewrite
   - 출력: \`_workspace/round_<N>_review.json\` (verdict / violations / rewrite_hint)

3. **분기**
   - \`verdict == "pass"\` → 마지막 rewrite 를 \`workspace/post-andy.md\` 로 저장하고 종료.
   - \`verdict == "fail" && N < 3\` → 다음 라운드.
   - \`verdict == "fail" && N == 3\` → 에스컬레이션.

## 호출 규약
- producer 와 reviewer 는 반드시 짝으로 호출. 한쪽만 두 번 호출하지 않는다.
- 모든 중간 산출물은 \`_workspace/round_<N>_<role>.{md,json}\` 형식.
- 룰북은 \`andy-style-rulebook\` 스킬에서 Read. 본 스킬은 룰북 텍스트를 복제하지 않는다.`
      },
      {
        path: ".claude/skills/andy-style-rulebook/SKILL.md",
        lang: "md",
        content: `---
name: andy-style-rulebook
description: |
  앤디 스타일 글쓰기 룰북. 5개의 규칙과 reviewer 출력 형식을 정의한다. andy-style-loop 의 reviewer 가 이 룰북을 참조하여 verdict 를 내린다.
  '앤디 룰북', '앤디 스타일 규칙', '문체 룰북', '글쓰기 룰', '스타일 가이드 규칙', 'reviewer 룰북', '룰북 조회', '문장 규칙' 등 룰북 자체를 호출할 때 사용한다.
  단, 룰북의 적용·검사·재작성은 andy-style-loop 스킬이 담당하며, 본 스킬은 규칙 정의만 한다.
---

# Andy Style Rulebook — 5줄 룰북

## 규칙

1. 1 문장은 25자 이하로
2. 한 문단에 추상어 2개 이하
3. 비유는 반드시 일상에서
4. 인용은 즉시 출처와 함께
5. 같은 단어를 한 문단에서 2번 이상 쓰지 않기

## rule_id 매핑

| rule_id | 규칙 |
|---------|------|
| 1 | 1 문장은 25자 이하로 |
| 2 | 한 문단에 추상어 2개 이하 |
| 3 | 비유는 반드시 일상에서 |
| 4 | 인용은 즉시 출처와 함께 |
| 5 | 같은 단어를 한 문단에서 2번 이상 쓰지 않기 |

## reviewer 출력 형식

\`\`\`json
{
  "verdict": "pass | fail",
  "violations": [
    {"rule_id": 2, "line": 3, "snippet": "본질적·근본적·총체적·구조적 문제"}
  ],
  "rewrite_hint": "한 문단에서 추상어를 2개 이내로 줄여라."
}
\`\`\`

## 추상어 정의 (rule 2 보조)

다음 같은 단어가 한 문단에 3개 이상이면 위반.
- 본질적, 근본적, 총체적, 구조적, 전사적, 통합적, 패러다임, 거버넌스, 시너지, 임팩트, 가치, 성장, 혁신, 디지털 트랜스포메이션, 인사이트, 솔루션, 효율성, 생산성`
      },
      {
        path: ".claude/agents/producer.md",
        lang: "md",
        content: `---
name: producer
description: 입력 글을 앤디 스타일 룰북에 맞게 다시 쓰는 작가 에이전트. 2회차부터는 reviewer 의 rewrite_hint 를 반영한다.
tools: Read, Write, Edit
model: opus
---

# Role

당신은 글을 다듬는 작가입니다. 입력으로 들어온 글을 앤디 스타일 룰북에 맞게 다시 씁니다. 사실관계는 바꾸지 않고 문체만 손봅니다.

# Principles

1. 룰북(\`.claude/skills/andy-style-rulebook/SKILL.md\`)을 먼저 Read 하여 5개 규칙을 확인한다.
2. 2회차 이상이면 직전 라운드의 \`rewrite_hint\` 를 가장 우선 반영한다.
3. 사실·인용은 절대 창작하지 않는다. 원문에 있는 사실만 그대로 둔다.
4. 25자가 넘는 문장은 우선적으로 끊는다. 두 문장이 자연스러우면 그렇게 둔다.
5. 같은 단어 반복은 동의어 또는 지시어로 대체한다.

# Protocols

## Input
- 1회차: \`workspace/post.md\`
- 2회차 이상: 직전 \`_workspace/round_<N-1>_rewrite.md\` + 직전 review.json 의 rewrite_hint

## Output
- \`_workspace/round_<N>_rewrite.md\`

# 작업 절차
1. 룰북 Read.
2. 입력 본문 Read.
3. (2회차 이상) rewrite_hint Read.
4. 문단별로 다시 쓴다. (25자 초과 분해 / 추상어 정리 / 반복 단어 대체 / 비유는 일상에서 / 인용 옆에 출처)
5. Write 로 저장.`
      },
      {
        path: ".claude/agents/reviewer.md",
        lang: "md",
        content: `---
name: reviewer
description: 앤디 스타일 룰북 5개 규칙으로 본문을 검사하고 verdict·violations·rewrite_hint 를 반환하는 검수자.
tools: Read, Write
model: opus
---

# Role

당신은 앤디 스타일 룰북의 검수자입니다. producer 가 쓴 본문을 룰북 5개 규칙으로 검사하고, pass 또는 fail 판정을 내립니다. 다시 쓰지는 않습니다.

# Principles

1. 룰북(\`.claude/skills/andy-style-rulebook/SKILL.md\`)을 먼저 Read 한다. rule_id 매핑을 그대로 사용한다.
2. 위반 한 건은 객체 한 개로 적는다: \`{rule_id, line, snippet}\`.
3. 위반이 0건이면 \`verdict: pass\`, 1건 이상이면 \`verdict: fail\`.
4. \`rewrite_hint\` 는 한 문장. pass 면 빈 문자열.
5. 룰 외의 미적 취향(어휘 선택·논조)으로 fail 내리지 않는다.

# Protocols

## Input
- \`_workspace/round_<N>_rewrite.md\`

## Output
- \`_workspace/round_<N>_review.json\` (verdict / violations / rewrite_hint)

# 검사 절차
1. 룰북 Read.
2. 본문 Read. 줄 번호와 함께 분석.
3. 각 줄/문단에서 5개 규칙 위반 여부 점검.
4. 위반을 violations 배열에 담는다.
5. 위반 패턴 중 가장 빈도가 높은 것 1개를 rewrite_hint 로 작성.
6. JSON 으로 Write.

# 톤
- 검수는 사무적·간결하게. snippet 은 20자 이내.`
      }
    ],
    notes: [
      { label: "POINT", text: "max_iterations: 3 — 종료 조건이 살아 있어야 무한 루프가 안 난다. 3회에도 fail 이면 사람에게 에스컬레이션." },
      { label: "POINT", text: "룰북을 별도 스킬로 분리. reviewer 는 Read 로만 참조. 룰북 텍스트가 두 곳에 중복되지 않는다." },
      { label: "POINT", text: "라운드별 산출물 — _workspace/round_<N>_rewrite.md + round_<N>_review.json — 이 누적되어 다음 라운드 입력이 된다." }
    ]
  },
  run: {
    setup: "cd labs/06-andy-style-loop\ncp samples/post.md workspace/post.md\nclaude",
    prompts: [
      {
        title: "정상 흐름 — 한 줄 실행 (3 라운드 만에 pass)",
        text: "workspace/post.md 를 앤디 스타일로 다듬어줘.",
        note: "라운드 1 fail(violations 5) → 라운드 2 fail(violations 2) → 라운드 3 pass · <code>workspace/post-andy.md</code> 저장"
      },
      {
        title: "max_iterations 를 1로 낮추기",
        text: "workspace/post.md 를 앤디 스타일로 다듬어줘.",
        note: "SKILL.md 의 <code>max_iterations: 1</code> 로 수정 후 실행. 1라운드 fail 후 즉시 에스컬레이션 — 품질이 떨어진 채 종료되는 모습"
      },
      {
        title: "max_iterations 를 10으로 올리기",
        text: "workspace/post.md 를 앤디 스타일로 다듬어줘.",
        note: "<code>max_iterations: 10</code> + 룰북에 규칙 추가(예: \"1 문장은 20자 이하\"). 라운드 수가 늘면서 토큰 비용 증가 관찰"
      }
    ],
    console: [
      { text: "[Trigger] '앤디 스타일' → andy-style-loop SKILL 발동", cls: "log-dim" },
      { text: "[ROUND 1] draft → reviewer", cls: "log-step" },
      { text: "  verdict: fail · violations: 5 · \"추상어 과다\"", cls: "log-bad" },
      { text: "  rewrite_hint: 한 문단의 추상어를 2개 이내로 줄여라.", cls: "log-dim" },
      { text: "[ROUND 2] rewrite → reviewer", cls: "log-step" },
      { text: "  verdict: fail · violations: 2 · \"긴 문장 2개\"", cls: "log-bad" },
      { text: "  rewrite_hint: 25자가 넘는 문장을 두 문장으로 끊어라.", cls: "log-dim" },
      { text: "[ROUND 3] rewrite → reviewer", cls: "log-step" },
      { text: "  verdict: pass · saved to workspace/post-andy.md", cls: "log-ok" }
    ],
    expected: [
      "_workspace/round_1_rewrite.md + round_1_review.json (fail · 5건)",
      "_workspace/round_2_rewrite.md + round_2_review.json (fail · 2건)",
      "_workspace/round_3_rewrite.md + round_3_review.json (pass)",
      "workspace/post-andy.md (최종 통과본)"
    ],
    snippet: [
      {
        path: "expected/post-andy.md",
        lang: "md",
        content: `# 에이전트 하네스가 바꾸는 일하는 방식

## 들어가며

AI 에이전트가 빠르게 바뀐다. 단순한 업데이트가 아니다. 일하는 방식 자체가 달라진다. 그래서 협업 구조도 다시 짜야 한다. 하네스가 이 흐름을 받쳐준다.

## 하네스란 무엇인가

하네스는 에이전트들을 묶어주는 장치다. 여러 명이 한 팀처럼 일하게 만든다. 식당 주방의 분업과 비슷하다. 단순한 도구가 아니다. 일의 토대다. 한 인터뷰이는 이렇게 말했다. "하네스 없이는 멀티 에이전트가 불가능합니다." (출처: 사내 인터뷰 #07)

## 실제 적용 사례

> "팀 빌딩 부재가 가장 큰 후회로 보입니다." (출처: 사내 인터뷰 #03)

이 말이 현실을 잘 보여준다. 큰 그림을 처음부터 그리기는 어렵다. 작은 시도부터 쌓는다.

## 마치며

결국 핵심은 실행이다. 작은 단위부터 시작한다. 그다음 조금씩 넓혀간다.`
      }
    ]
  },
  tryYourself: {
    intro: "슬라이드 20쪽 Try Yourself — max_iterations 를 1, 10으로 바꿔 품질·비용 트레이드오프를 체감.",
    tasks: [
      {
        title: "max_iterations 를 1로 낮추기",
        body: "SKILL.md 의 종료 조건을 max_iterations: 1 로 수정하고 같은 프롬프트를 다시 돌린다. 1라운드 fail 후 강제 종료 — 품질이 떨어진 채 끝나는 모습을 본다.",
        steps: [
          ".claude/skills/andy-style-loop/SKILL.md 의 max_iterations 를 1로 수정",
          "동일한 프롬프트 재실행",
          "1라운드 fail 직후 에스컬레이션 메시지 확인"
        ],
        prompt: "workspace/post.md 를 앤디 스타일로 다듬어줘.",
        expect: "1라운드 fail 후 즉시 종료. workspace/post-andy.md 가 생성되지 않거나 품질이 낮은 채로 저장됨."
      },
      {
        title: "max_iterations 를 10으로 올리고 룰북 엄격하게",
        body: "max_iterations: 10 + 룰북 규칙을 까다롭게(예: \"1 문장은 20자 이하\"). 라운드 수가 늘면서 토큰 비용이 어떻게 증가하는지 본다.",
        steps: [
          "andy-style-loop/SKILL.md 의 max_iterations 를 10으로 수정",
          "andy-style-rulebook/SKILL.md 의 규칙 1번을 \"1 문장은 20자 이하\" 로 강화",
          "동일한 프롬프트 재실행. 라운드 5, 6, 7로 늘어나는지 관찰"
        ],
        prompt: "workspace/post.md 를 앤디 스타일로 다듬어줘.",
        expect: "라운드 수 증가 → 토큰 비용 증가. 품질/비용 트레이드오프를 직접 체감."
      }
    ]
  }
};
