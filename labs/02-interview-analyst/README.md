# LAB 02 — interview-analyst (Agent)

> 슬라이드 10~12쪽 · Agent · Role + I/O

## 시나리오

정제된 인터뷰에서 핵심 인사이트 3개를 뽑는다. 입력은 LAB 01 의 출력물 `samples/cleaned-raw-interview-01.md` (워크숍에서는 사전 제공). 받게 되는 것은:

- 핵심 발견 3가지 (각 1문장)
- 각 발견에 근거 인용 1개씩
- 다음 단계 추천 (선택)

## 왜 이 패턴인가

같은 인터뷰를 두 번 분석해도 같은 형식·같은 깊이의 답이 나오게 만든다. 그게 이번 LAB 의 목적이다.

| 비교 | SKILL 만 호출 | AGENT 호출 |
|------|---------------|------------|
| 일이 끝나면 | 잊는다 | 원칙이 남는다 ("추론과 사실 구분") |
| 펼치는 것 | 매뉴얼 | 역할이 있는 사람 |
| I/O | 느슨하다 | 프로토콜이 고정 |

함정 — `tools` 에 Bash·Write 까지 주면 에이전트가 "분석 외 행동" 을 시도한다. Read, Grep 만 노출한다.

## 빌드 — 만든 파일

- `.claude/agents/interview-analyst.md` — Role + Principles 3개 + I/O Protocol + tools Read, Grep
- `.claude/agents/marketing-copywriter.md` — Try Yourself 변형용 페르소나 템플릿
- `samples/cleaned-raw-interview-01.md` — 스타트업 공동창업자 회고 인터뷰 (메인 데모용)
- `samples/cleaned-raw-interview-02.md` — 제품 PM 회고 인터뷰 (Try Yourself 용)

## 실행 — 강의 중 데모

1. 이 폴더에서 `claude` 실행.
2. `PROMPTS.md` 의 첫 프롬프트 (`interview-analyst 로 cleaned-raw-interview-01.md 분석해줘`) 를 그대로 붙여넣기.
3. 1~2초 뒤 `workspace/insights-01.md` 가 만들어진다.
4. **같은 프롬프트를 한 번 더** 호출해서 두 결과를 비교한다.

(전체 프롬프트는 `PROMPTS.md` 참조)

## 예상 결과

`expected/insights-01.md` 와 `expected/insights-02.md` 참조. 슬라이드 12쪽의 EXPECTED 와 다음이 일치한다.

- 핵심 발견 1 — "팀 빌딩 부재가 가장 큰 후회로 보인다" + 인용 "정말 후회되는 건..."
- 핵심 발견 2 — "시장 신호를 받고도 피벗이 늦었던 것으로 보인다" + 인용 "사용자 인터뷰 결과가 있었는데..."

같은 입력으로 두 번 호출해도 표면 문장은 달라지지만 **발견 개수 3개 · 인용 형식 · "~로 보인다" 톤** 은 유지된다. 그게 Principles 가 박힌 효과다.

## Try Yourself

- **두 번 호출 비교**: 같은 입력으로 두 번 돌리고, 발견 개수와 인용 형식이 유지되는지 직접 확인.
- **marketing-copywriter 추가**: 이미 정의된 `.claude/agents/marketing-copywriter.md` 를 활용해 `insights-01.md` 를 카피 3종으로 확장. Principles 3번째에 "수치 없이 단정하지 않는다" 가 들어 있는지 직접 열어 본다.
- **두 번째 인터뷰**: `samples/cleaned-raw-interview-02.md` 로 같은 분석을 굴려본다. 톤이 회고에서 PM 회고로 바뀌어도 형식이 동일한지가 핵심.
