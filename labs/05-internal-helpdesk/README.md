# LAB 05 — internal-helpdesk (Expert Pool)

> 슬라이드 17쪽 ~ 18쪽 · Pattern 3 — 라우터가 한 명의 전문가에게만 보낸다.

## 시나리오

사내 질문을 한 명의 전문가에게만 보낸다. Fan-out 과의 차이: Fan-out 은 모두에게, Expert Pool 은 한 명에게만. 토큰 비용이 1/N 이 된다.

- 라우터의 역할: 들어온 질문을 보고 딱 한 명의 전문가를 고른다. 잘못 분류하면 답이 엉뚱하게 나간다.
- 가장 중요한 1줄(슬라이드 17쪽): "도메인이 명확하지 않으면 사용자에게 되묻는다. 추측으로 라우팅하지 않는다."

## 왜 이 패턴인가

라우터가 병목 + 단일 장애점. 그래서 추측보다 되묻기가 안전한 기본값이다. 같은 모델이라도 라우터에 명확한 도메인 정의와 Principles 를 박아두면 분류가 일관된다.

## 빌드 — 만든 파일

- `.claude/skills/internal-helpdesk/SKILL.md`
- `.claude/agents/router.md`
- `.claude/agents/legal-expert.md`
- `.claude/agents/hr-expert.md`
- `.claude/agents/it-expert.md`
- `.claude/agents/finance-expert.md`
- `samples/questions/q1-clear.txt` (명확: hr)
- `samples/questions/q2-cross.txt` (모호: hr+finance → ask)
- `samples/questions/q3-outdomain.txt` (도메인 외 → ask)
- `samples/questions/q4-finance.txt` (Try Yourself: 사규 인용 요구)
- `samples/policies/{hr,finance,it,legal}-policy.md`

## 실행 — 강의 중 데모

1. 이 폴더에서 `claude` 실행
2. `PROMPTS.md`의 첫 프롬프트 복사·붙여넣기 (q1)
3. `_workspace/route_decision.json` 과 `_workspace/answer.md` 가 생성됨
4. q2, q3 로 모호·도메인 외 케이스도 확인

(전체 프롬프트는 `PROMPTS.md` 참조)

## 예상 결과

`expected/` 폴더 참조. 슬라이드 18쪽의 세 가지 테스트 결과와 매칭.

| 케이스 | 결과 |
|--------|------|
| q1 (휴가 회계연도) | `routed_to: hr ✓` — hr-expert 가 §2 인용 |
| q2 (퇴직금 세금) | `routed_to: ask` — 되묻기 |
| q3 (점심 메뉴) | `routed_to: ask` — 정중한 거절 |
| q4 (영수증 분실) | `routed_to: finance ✓` — §4 조항 번호 병기 |

## Try Yourself

슬라이드 18쪽 Try Yourself 가 이미 빌드에 반영되어 있다. finance-expert 의 Principle 2번이 "사규집 인용 시 조항 번호와 제목을 반드시 병기" 다.

- q4 를 두 번 돌려 인용 형식(`(§4 법인카드 사용)`)이 일정한지 확인한다.
- router.md 의 Principles 에서 1번을 지우고 q2 를 돌려보면, 추측 라우팅이 늘어나는 것을 관찰할 수 있다.
