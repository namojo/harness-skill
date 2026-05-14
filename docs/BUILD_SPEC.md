# BUILD SPEC — Harness Meetup #2 Lab 빌드 공통 명세

> 이 문서는 8개 Lab을 만드는 모든 builder가 따르는 표준 규약이다. 슬라이드(`harness_meetup2.pptx`)와 어긋나지 않게 만드는 것이 최우선 목표.

## 1. 톤·문체

- 한국어. 격식체("~다", "~한다")로 통일. 슬라이드 톤과 일치.
- 코드 주석, agent 정의, README, PROMPTS는 모두 한국어로.
- 영문 키워드는 그대로 (description, Role, Principles, Protocols, Tools, name 등).

## 2. 디렉토리 컨벤션

각 Lab 폴더는 다음 구조를 **반드시** 가진다:

```
labs/0X-name/
├── README.md            # 시나리오·왜·실행법·Try Yourself
├── PROMPTS.md           # 강사가 그대로 붙여넣을 프롬프트 모음
├── .claude/
│   ├── skills/<skill-name>/SKILL.md   # 1개 또는 그 이상
│   └── agents/<agent-name>.md         # 0개 이상
├── samples/             # 입력 데이터
├── workspace/           # 실행 결과가 쌓이는 곳 (.gitkeep 포함)
└── expected/            # 강사 사전 검토용 결과
```

`.gitkeep` 같은 빈 파일을 두지 말고, `workspace/`는 `.gitkeep` 하나만 둔다.

## 3. SKILL.md YAML frontmatter 표준

```yaml
---
name: <kebab-case-id>
description: |
  <한 줄 핵심 요약>. <2~3줄 구체 동작 설명>.
  '<발화 1>', '<발화 2>', '<발화 3>', '<발화 4>', '<발화 5>', '<발화 6>', '<발화 7>', '<발화 8>' 등
  <도메인> 전반에 이 스킬을 반드시 사용한다.
  단, <범위 밖 1>, <범위 밖 2>는 이 스킬의 범위가 아니다.
---
```

- description은 무조건 **pushy** 톤: "~할 때 반드시 이 스킬을 사용한다"
- 한국어 트리거 발화 **8개 이상** 포함
- 범위 밖 1줄 명시 (오작동 방지)
- 다른 Lab의 Skill과 트리거 충돌 금지 — Lab 02~08은 명시적 호출(`-agent`/팀명) 우선

## 4. Agent .md 표준 구조

```markdown
---
name: <agent-id>
description: <한 줄 — 언제 호출되는 페르소나인가>
tools: Read, Grep      # 최소 권한 원칙
model: opus
---

# Role

당신은 <역할 정체성>입니다.

# Principles

1. <원칙 1 — 변덕 방지의 핵심>
2. <원칙 2>
3. <원칙 3>
(... 3~5개 권장)

# Protocols

## Input
- <입력 명세>

## Output
- <출력 형식 — 마크다운/JSON>

## Workspace
- 결과는 `_workspace/<순번>_<역할>.md` 에 저장
```

- `tools`는 정말 필요한 것만 (예: 분석 에이전트는 Read, Grep만)
- `model: opus` 명시
- I/O 프로토콜은 다음 에이전트의 Input과 정확히 매칭

## 5. _workspace 파일 네이밍

순차 파이프라인(Lab 01, 03)에서는 `_workspace/` 하위에:

```
_workspace/
├── 00_input.md
├── 01_<phase>_<agent>.md
├── 02_<phase>_<agent>.md
└── ...
```

병렬(Lab 04)에서는 `_workspace/parallel/<agent>.md`, 머지 결과는 `_workspace/merged_report.md`.

Lab 05는 단일 라우팅이므로 `_workspace/route_decision.json` + `_workspace/answer.md`.

Lab 06은 루프이므로 `_workspace/round_<N>_<role>.md`.

Lab 07은 supervisor 로그 `_workspace/log.jsonl` + 결과 `_workspace/answer.md`.

Lab 08은 트리 구조 `_workspace/<sub-team>/<worker>.md` + `_workspace/brief.md`.

## 6. PROMPTS.md 표준 구조

```markdown
# LAB 0X — 프롬프트 모음

> 강사용. Claude Code에 그대로 붙여넣어 실행한다.

## 정상 흐름 (메인 데모)

### 1. <첫 프롬프트 — 슬라이드와 일치>

```text
<프롬프트 본문>
```

**예상 결과**: `workspace/...` 에 N개 파일 생성. 슬라이드 X쪽의 EXPECTED와 일치.

## 변형 / Try Yourself

### 2. <변형 1>
...
```

## 7. Lab 간 누적 흐름

슬라이드의 "8개 LAB은 누적이다" 메시지를 살리기 위해:

| 출처 | 산출물 | 다음 Lab samples로 복제 |
|------|--------|--------------------------|
| LAB 01 expected | `05_announcement.md` 등 | (참고용) |
| LAB 02 expected | `interview-insights.md` | LAB 03 samples |
| LAB 03 expected | `post.md` | LAB 06 samples (앤디 스타일 다듬기 입력) |
| LAB 03 expected | `transcript.txt` | LAB 02 samples (사전 정제 텍스트) |

각 Lab `samples/` 첫 줄에 `> 출처: Lab 0X expected/...` 코멘트 1줄로 표기.

## 8. README.md 표준 섹션

```markdown
# LAB 0X — <Skill/Agent/Pattern 이름>

> 슬라이드 P쪽 ~ P쪽 · <패턴 한 줄>

## 시나리오

<슬라이드 A 박스 텍스트 그대로>

## 왜 이 패턴인가

<슬라이드 B 박스 텍스트 그대로 · 함정 포함>

## 빌드 — 만든 파일

- `.claude/skills/<skill-name>/SKILL.md`
- `.claude/agents/<a>.md`, `<b>.md`, ...

## 실행 — 강의 중 데모

1. 이 폴더에서 `claude` 실행
2. `PROMPTS.md`의 첫 프롬프트 복사·붙여넣기
3. 5~10초 후 `workspace/` 에 산출물

(전체 프롬프트는 `PROMPTS.md` 참조)

## 예상 결과

`expected/` 폴더 참조. 슬라이드 P쪽 EXPECTED와 매칭.

## Try Yourself

<슬라이드의 Try Yourself 박스 + 변형 안내>
```

## 9. 명시적 호출 컨벤션

여러 Lab이 한 폴더(`~/harness-lab/`)에 누적될 때, Skill 트리거 충돌을 피하려면:

- LAB 01만 자유 발화로 트리거 (`changelog-generator` 단일)
- LAB 02 이후는 **명시적 호출** 우선:
  - `interview-analyst 로 ... 분석해줘`
  - `code-review-team 하네스 만들어줘`
  - `cs-supervisor 에게 ...`

PROMPTS.md의 모든 프롬프트는 이 컨벤션을 따른다.

## 10. 슬라이드 일치성 체크리스트

각 Lab을 마치기 전 확인:

- [ ] `samples/`에 슬라이드에 언급된 입력 파일명이 존재 (예: `cleaned-raw-interview-01.md`)
- [ ] `expected/` 출력의 첫 문장·구조가 슬라이드 EXPECTED와 일치
- [ ] Agent의 Principles가 슬라이드 텍스트와 같음 (3~5개)
- [ ] PROMPTS.md의 첫 프롬프트가 슬라이드 PROMPT 예시와 같음

## 11. 가짜 데이터 작성 가이드

- 인터뷰 인용: A/B 화자 구분, 한국어 구어체 자연스럽게
- git log: 실제 형식 (`commit abc123 (HEAD -> main)\nAuthor: ...\nDate: ...\n\n    feat: ...`)
- PR diff: unified diff 형식 (`@@ -10,7 +10,7 @@`), 짧고 핵심만 (50~100줄)
- 사내 질문: 1~2문장, 도메인 명확/모호 케이스 분리
- CS 케이스: 실제 고객 톤 (감정·맥락 포함)

## 12. 산출물 분량 가이드

- SKILL.md: 80~200줄 (Lab 01만 250줄까지)
- agent.md: 30~80줄 (Role·Principles·Protocols 명확)
- README.md: 100~150줄
- PROMPTS.md: 40~80줄
- samples 파일 1개: 30~150줄
- expected 파일 1개: 30~200줄

너무 짧으면 데모 임팩트 없고, 너무 길면 강의 중 보여주기 어렵다.
