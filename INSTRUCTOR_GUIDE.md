# INSTRUCTOR GUIDE — Harness Meetup #2

> 강사용 진행 시나리오. 슬라이드 ↔ Lab 폴더 ↔ 웹사이트 라우트의 매핑 표 + 각 Lab의 핵심 시연 포인트.

## 사전 준비 (워크숍 30분 전)

1. PowerPoint로 `harness_meetup2.pptx` 열어 슬라이드 모드로 준비
2. 다른 모니터(또는 같은 화면 절반)에 `web/index.html` **더블클릭으로** 열어 둠 (서버 불필요)
3. 터미널 하나 열고 `cd C:\Work\agent-class\labs` 까지 이동해 둠
4. 각 Lab의 `expected/` 폴더 내용을 사전 검토 (실행 결과와 비교용)

## 슬라이드 ↔ Lab ↔ 웹사이트 매핑

| 슬라이드 | 시간 | Lab 폴더 | 웹 라우트 | 핵심 시연 |
|----------|------|-----------|------------|-----------|
| 1 (표지) | 1분 | — | `#/` | 워크숍 시작, 8개 Lab 예고 |
| 2 (Agenda) | 2분 | — | `#/` | 카드 그리드 한번 훑기 |
| 3 (Setup) | 5분 | `00-setup/` | `#/setup` | 폴더 구조 설명 |
| 3B-3D (Deep dive) | 10분 | — | `#/deep-dive` | SKILL/Agent 4요소 |
| 4–6 (LAB 01) | 25분 | `01-changelog-generator/` | `#/lab/1` | 한 줄 발화 → 5개 산출물 |
| 7–9 (LAB 02) | 25분 | `02-interview-analyst/` | `#/lab/2` | Agent 명시 호출 |
| 10–11 (LAB 03) | 30분 | `03-blog-pipeline/` | `#/lab/3` | 5단 파이프라인 자동 실행 |
| 12–13 (LAB 04) | 25분 | `04-code-review-team/` | `#/lab/4` | 4 병렬 + merger |
| 14–15 (LAB 05) | 25분 | `05-internal-helpdesk/` | `#/lab/5` | 3 케이스 라우팅 비교 |
| 16–17 (LAB 06) | 25분 | `06-andy-style-loop/` | `#/lab/6` | 3 라운드 통과 |
| 18–19 (LAB 07) | 25분 | `07-cs-supervisor/` | `#/lab/7` | 동적 분기 시연 |
| 20–21 (LAB 08) | 25분 | `08-campaign-org/` | `#/lab/8` | 2단 위임 트리 로그 |
| 22 (Recap) | 8분 | — | `#/recap` | 8개 카드 회고 |
| 23 (Close) | 5분 | — | `#/close` | "당신의 일로 옮겨라" |

## 각 Lab 데모 운영 패턴 (공통)

매 Lab마다 다음 5단계를 반복한다.

### 1) 슬라이드에서 시나리오 설명 (5–8분)
A 박스 → B 박스 → 익힐 개념. **여기까지는 슬라이드만.**

### 2) 웹사이트에서 빌드 보여주기 (3–5분)
웹사이트 `#/lab/N` 페이지의 **빌드** 탭으로 이동.
`.claude/` 디렉토리 트리에서 `SKILL.md` 클릭 → 코드뷰어로 YAML frontmatter·트리거 발화 강조.
agent.md 1개 클릭 → Role/Principles/Protocols 강조.

### 3) 터미널에서 실제 실행 (5–8분)
```powershell
cd labs/0N-<name>
claude
```
`PROMPTS.md`의 "정상 흐름 / 1번 프롬프트"를 복사·붙여넣기 (웹사이트 **실행** 탭에서 복사 버튼 사용 가능).
콘솔 로그가 흐르는 동안 슬라이드의 "OBSERVE" 박스 또는 웹사이트의 "예상 콘솔 로그" 박스를 가리키며 "지금 이게 화면에서 일어나는 일"이라고 안내.

### 4) 결과 확인 (3–5분)
`workspace/` 폴더 열어 생성된 파일 보여줌. `expected/`와 비교 (대체로 일치).
주요 산출물 1개를 슬라이드의 "EXPECTED" 박스와 나란히 보여줌.

### 5) Try Yourself 안내 (1–2분)
슬라이드의 Try Yourself 박스 읽기. 웹사이트 **Try Yourself** 탭의 구체 가이드 보여주고, "쉬는 시간에 해보세요"로 마무리.

## 각 Lab 핵심 시연 포인트

### LAB 01 — changelog-generator (Skill · 25분)

- **메시지**: "한 줄 발화 → 5개 파일". Skill의 YAML이 곧 트리거.
- **빌드 강조**: SKILL.md의 description 안에 8개 한국어 트리거 발화 + "단, CI/CD 통합은 범위 밖". 5개 agent를 호출하는 워크플로우.
- **실행 프롬프트**: `v1.2.0에서 v2.0.0까지 릴리스 노트 전체를 만들어줘.`
- **결과 비교**: `workspace/03_release_notes.md` 첫머리가 슬라이드 9쪽 EXPECTED와 동일 ("## [2.0.0] - 2026-05-14 / Breaking Changes / Added / Changed / Fixed").
- **Try Yourself**: 공지문만 호출 → announcement-writer만 단독 발동, 4개 agent 건너뜀.

### LAB 02 — interview-analyst (Agent · 25분)

- **메시지**: 같은 입력 두 번 → 표면 문장은 다르지만 구조·깊이는 동일. **Principles**가 박힌 효과.
- **빌드 강조**: agent.md의 4요소 (Role · Principles 3개 · I/O · Tools=Read·Grep만).
- **실행 프롬프트**: `interview-analyst 로 cleaned-raw-interview-01.md 분석해줘.`
- **결과 비교**: 핵심 발견 3개 + 각 1개 인용. "~로 보인다" 어미 유지. 슬라이드 12쪽의 두 인용("정말 후회되는 건...", "사용자 인터뷰 결과가 있었는데...")이 그대로 등장.
- **Try Yourself**: marketing-copywriter 페르소나 추가, "수치 없이 단정하지 않는다" Principles 넣어볼 것.

### LAB 03 — blog-pipeline (Pipeline · 30분)

- **메시지**: A → B → C → D → E 순차. LAB 02의 interview-analyst가 그대로 재사용된다. 누적!
- **빌드 강조**: 5개 agent + 4개 보조 skill. SKILL.md가 5단계 워크플로우를 선언.
- **실행 프롬프트 1 (빌드)**: `하네스 구성해줘. 인터뷰 음성을 블로그 마크다운까지의 5단계 파이프라인. interview-analyst 는 기존 것 재사용.`
- **실행 프롬프트 2 (실행)**: `samples/podcast-ep07-transcript.txt 로 블로그 글 한 편 뽑아줘.`
- **OBSERVE**: 콘솔에 `[1/5] transcript-agent` ~ `[5/5] md-packager` 5줄이 차례로.
- **Try Yourself**: review-editor를 4번-5번 사이에 끼움 → Producer-Reviewer 예고.

### LAB 04 — code-review-team (Fan-out/Fan-in · 25분)

- **메시지**: 4명 병렬. 토큰을 동시에 소비. **merger가 천장** — 충돌은 약화하지 말고 병기.
- **빌드 강조**: merger.md의 Principles 3줄 (충돌 병기 / Block·Warn·Nit 3단계 / Block 있으면 머지 보류).
- **실행 프롬프트 1**: `code-review-team 하네스 만들어줘. Fan-out 4명 + merger 1명. 입력은 PR diff, 출력은 우선순위 매긴 통합 리포트.`
- **실행 프롬프트 2**: `PR #142 리뷰해줘.`
- **결과 비교**: 슬라이드 16쪽의 BLOCK 1 (security/env), WARN 3 (performance / architect / security↔style 충돌).
- **Try Yourself**: 5번째 관점 `cost-reviewer` (AWS 비용) 추가, merger Principles 1줄만 수정.

### LAB 05 — internal-helpdesk (Expert Pool · 25분)

- **메시지**: 한 명에게만. 토큰 비용 1/N. **추측보다 되묻기가 안전한 기본값**.
- **빌드 강조**: router.md Principles 1번 — "도메인이 명확하지 않으면 사용자에게 되묻는다. 추측으로 라우팅하지 않는다."
- **3개 프롬프트로 비교**:
  - `휴가 사용 기간이 회계연도 기준인가요?` → `routed_to: hr` ✓
  - `퇴직금에 대한 세금 처리는 어떻게 되나요?` → `routed_to: ask` (hr + finance 걸침)
  - `점심 메뉴 추천해줘.` → `routed_to: ask` (도메인 외, 정중히 거절)
- **Try Yourself**: finance-expert에 "사규집 인용 시 조항 번호 병기" 규칙 추가 (이미 본 패키지에 반영됨, 4번째 프롬프트로 검증).

### LAB 06 — andy-style-loop (Producer-Reviewer · 25분)

- **메시지**: 통과될 때까지 다시 쓰기. **종료 조건이 살아 있어야** — `max_iterations: 3`, `on_max_reached: escalate_to_user`.
- **빌드 강조**: reviewer.md 출력 형식 (`verdict: pass|fail`, `violations: [...]`, `rewrite_hint`). 5줄 룰북 (25자 이하 / 추상어 2개 이하 / 일상 비유 / 즉시 출처 / 같은 단어 2회 금지).
- **실행 프롬프트**: `workspace/post.md 를 앤디 스타일로 다듬어줘.`
- **OBSERVE 3 라운드**: fail·violations 5 → fail·violations 2 → pass.
- **Try Yourself**: `max_iterations` 1↔10 비교 — 품질 vs 토큰 비용 트레이드오프 체감.

### LAB 07 — cs-supervisor (Supervisor · 25분)

- **메시지**: Pipeline은 컨베이어 벨트, **Supervisor는 매니저**. 다음 단계가 앞 결과에 따라 달라진다.
- **빌드 강조**: supervisor.md Principles — 의도 다중 시 우선순위 / tech 결과에 따라 refund 호출 여부 결정 / 분기 결정을 `log.jsonl`에 기록.
- **실행 프롬프트**: `3 일 전 주문한 헤드폰이 도착했는데 한쪽이 안 들려요. 환불 가능한가요?`
- **OBSERVE 4 스텝**: intent 분석 → tech-worker → refund-worker → 응답 합성. log.jsonl에 한 줄씩.
- **Try Yourself**: 분노 톤 감지 시 human-handoff-worker 호출 (Principles 4번째 추가).

### LAB 08 — campaign-org (Hierarchical · 25분)

- **메시지**: supervisor 한 층으로 부족. **워커에 직접 일을 시키지 않는다.** sub-supervisor를 거친다.
- **빌드 강조**: campaign-lead.md Principles 3줄 — 워커 직접 호출 금지 / sub의 요약만 받기 / 충돌 시 양쪽 기록 후 사용자 문의.
- **실행 프롬프트**: `신제품 '하네스 학습 키트' 의 1 주 캠페인 기획. research 와 creative 동시 진행. 결과는 workspace/campaign-brief.md.`
- **OBSERVE 트리 로그**: `[campaign-lead] ├── [research-lead] ├── survey → 응답 47건 ...` (슬라이드 24쪽 그대로).
- **Try Yourself**: analytics-lead 추가, 3팀 병렬로 확장. Pattern 6의 진짜 확장성.

## 누적 흐름 (슬라이드 메시지)

8개 LAB은 독립이 아니라 **누적**이다.

- LAB 02의 `samples/cleaned-raw-interview-01.md`는 LAB 03의 transcript-agent 산출물이기도 함 (각 Lab은 자체적으로 가짜 데이터를 가져 독립 실행 가능, 누적 흐름은 **개념적 의미** 강조).
- LAB 03의 `expected/post.md`는 LAB 06의 `samples/post.md`로 이어진다 (앤디 스타일 다듬기의 입력).
- 워크숍 종료 시점에 한 폴더에 모든 산출물이 쌓여 있어야 한다는 메시지 — 강사가 "지우지 마세요"라고 강조.

## 문제 발생 시 대응

| 증상 | 대응 |
|------|------|
| Claude Code가 트리거를 못 잡음 | `PROMPTS.md`의 명시적 호출 프롬프트(예: `interview-analyst 로 ...`)로 재시도 |
| 결과가 expected와 너무 다름 | 정상. LLM의 자연스러운 변동. 슬라이드 메시지 "표면 문장은 다르지만 구조는 같다" 인용 |
| 토큰 한도 도달 | 미리 준비한 `expected/` 내용을 그대로 화면에 띄워 시연 진행 |
| 네트워크 끊김 | 웹사이트와 `expected/`만으로 진행 가능. 데모는 후반 휴식 후로 미룸 |
| 웹사이트가 안 열림 | 더블클릭으로 `web/index.html`을 Chrome/Edge에서 열기. JSON은 file://에서도 동작하도록 `.js`로 변환됨. |

## 시연 모범 동선

워크숍 전체 4시간 권장 동선:

```
[1부 90분]
├── 슬라이드 1~3 (Setup) 10분
├── 슬라이드 3B-3D (Deep dive) 10분
├── LAB 01 데모 25분 ← 첫 실전
├── LAB 02 데모 25분
└── (휴식 10분)

[2부 90분]
├── LAB 03 데모 30분 ← 파이프라인의 위력
├── LAB 04 데모 25분
├── LAB 05 데모 25분
└── (휴식 10분)

[3부 60분]
├── LAB 06 데모 25분
├── LAB 07 데모 25분
└── (휴식 5분)

[4부 35분]
├── LAB 08 데모 25분 ← 가장 큰 그림
└── 슬라이드 22~26 (Recap + Close) 10분
```

## 강의 직후 체크리스트

- [ ] 슬라이드 모든 페이지 노출됨
- [ ] 8개 Lab 모두 1회 이상 실행 시연됨
- [ ] 웹사이트 사이드바·탭·코드뷰어 모두 보여줬음
- [ ] Try Yourself 변형 1개 이상 라이브 도전 (시간 여유 시)

## Skill ↔ Agent 매핑 (각 Lab의 "어떻게 ↔ 누가" 구조)

각 Lab의 Agent가 자기 작업을 할 때 발동시키는 도메인 Skill 목록. 강사가 빌드 탭에서 강조 설명할 때 참고.

| Lab | Agent | 사용하는 도메인 Skill |
|-----|-------|----------------------|
| 01 | commit-analyst | `conventional-commits` |
| 01 | release-note-writer | `keep-a-changelog` |
| 02 | interview-analyst | `qualitative-analysis` |
| 03 | transcript-agent | `transcript-clean` |
| 03 | blog-drafter | `blog-structure-ko` |
| 03 | md-packager | `md-export` |
| 04 | security-reviewer | `owasp-top10` |
| 04 | performance-reviewer | `performance-antipatterns` |
| 04 | architect-reviewer | `module-boundaries` |
| 04 | style-reviewer | `code-style-ko` |
| 05 | legal-expert | `legal-citation` |
| 05 | hr-expert | `hr-policy-lookup` |
| 05 | it-expert | `it-troubleshoot` |
| 05 | finance-expert | `finance-citation` ★ |
| 06 | producer | `andy-style-rulebook` |
| 06 | reviewer | `andy-style-rulebook` |
| 07 | tech-worker | `tech-diagnosis` |
| 07 | refund-worker | `refund-policy` + `apology-template` |
| 07 | account-worker | `account-recovery` |
| 07 | response-composer | `apology-template` |
| 08 | survey-worker | `survey-design` |
| 08 | desk-research-worker | `competitor-analysis` |
| 08 | trends-worker | `trend-keywords` |
| 08 | copy-worker | `headline-frameworks` |

★ `finance-citation` 은 슬라이드 18쪽 Try Yourself의 "조항 번호 병기" 규칙을 담은 Skill. 강의 중 직접 보여주면 임팩트.

총 **30개 Skill** (오케스트레이터 8 + 도메인 22) + **38개 Agent**.

## 시연 보조 자료 (mock HTML)

각 Lab의 `samples/`에 강사가 슬라이드와 함께 보여줄 수 있는 시각 mock이 들어 있다 (브라우저로 더블클릭하면 열림):

| Lab | mock 파일 | 용도 |
|-----|----------|------|
| 01 | `mock-git-log-view.html` | git log 5개 핵심 커밋을 컬러 시각화. EXPECTED 결과(Breaking/Added/Fixed)와 매핑 시연 |
| 03 | `podcast-ep07.m4a` + `AUDIO_NOTE.md` | placeholder 음성 파일 + 강사 안내 멘트 |
| 04 | `mock-pr-142.html` | GitHub PR 스타일 페이지. 리뷰 입력 컨텍스트 보여줌 |
| 07 | `mock-cs-inbox.html` | CS 받은편지함 mock. 4개 케이스 카드 + supervisor 라우팅 시뮬레이션 |
| 08 | `mock-product-card.html` | "하네스 학습 키트" 제품 카드. campaign brief 입력 시각화 |

데모 동선 예: 슬라이드 → mock HTML 열기 (입력이 어떻게 생겼는지 보여줌) → 터미널에서 실제 실행 → 결과 비교.

## 자료 배포

워크숍 후 수강생에게 공유할 것:

1. `harness_meetup2.pptx` (참고용)
2. `labs/` 폴더 전체 (zip) — 8개 독립 패키지
3. `web/` 폴더 전체 (zip) — `index.html` 더블클릭으로 열림
4. `README.md` + `INSTRUCTOR_GUIDE.md` (선택)

## 산출물 통계

- **Lab 자료**: 156개 파일 (LAB 01: 18 / 02: 9 / 03: 20 / 04: 17 / 05: 21 / 06: 15 / 07: 25 / 08: 26 + setup)
- **웹사이트**: 20개 파일 (HTML 1 + CSS 1 + JS 1 + data JS 11 + SVG 6)
- **공통 문서**: README, INSTRUCTOR_GUIDE, BUILD_SPEC
