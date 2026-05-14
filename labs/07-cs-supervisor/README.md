# LAB 07 — cs-supervisor · Pattern 5 (Supervisor)

> 슬라이드 21쪽 ~ 22쪽 · 동적 라우팅

## 시나리오

다음 단계가 앞 결과에 따라 달라진다.

| | PIPELINE (LAB 03) | SUPERVISOR (LAB 07) |
|---|-------------------|---------------------|
| 순서 | 설계 시 고정 | 실행 중 결정 |
| 다음 단계 | 항상 같음 | 앞 결과를 보고 판단 |
| 비유 | 컨베이어 벨트 | 매니저 |

인입 CS 메시지의 의도가 환불이면 `refund-worker`, 로그인 오류면 `tech-worker` / `account-worker`, 계정 복구면 `account-worker` 가 호출된다. supervisor 가 매번 다른 결정을 내린다.

## 왜 이 패턴인가

Pipeline 으로 짜면 모든 케이스가 같은 순서를 거쳐야 한다. CS 는 그렇지 않다. 환불만 필요한 케이스에 굳이 tech 진단을 돌리면 토큰만 낭비된다. 반대로 결함 진단 없이 환불을 처리하면 정책 근거가 약해진다. supervisor 가 의도를 보고 매번 다르게 라우팅 — 게다가 첫 워커 결과를 보고 두 번째 워커를 호출할지 말지까지 결정한다. 이게 supervisor 패턴의 핵심.

함정: supervisor 가 분기 근거를 남기지 않으면 나중에 "왜 그 워커를 호출했는지" 추적이 안 된다. 그래서 Principles 3 번에 "모든 분기 결정은 한 줄 근거와 함께 log.jsonl 에 기록한다" 가 박혀 있다.

## 빌드 — 만든 파일

```
.claude/skills/cs-supervisor/SKILL.md
.claude/agents/
├── supervisor.md
├── tech-worker.md
├── refund-worker.md
├── account-worker.md
├── response-composer.md
└── human-handoff-worker.md  (Try Yourself 용)
samples/
├── cs-priority-table.md
└── cs-cases/
    ├── case-01-tech-refund.txt   # tech + refund
    ├── case-02-login.txt         # account 단독
    ├── case-03-angry.txt         # 분노 톤 (Try Yourself)
    └── case-04-refund-only.txt   # refund 단독
expected/
├── case-01/_workspace/{log.jsonl, tech.md, refund.md}
├── case-01/answer.md
├── case-02/_workspace/{log.jsonl, account.md}
├── case-02/answer.md
├── case-04/_workspace/{log.jsonl, refund.md}
└── case-04/answer.md
```

## 실행 — 강의 중 데모

1. 이 폴더에서 `claude` 실행.
2. `PROMPTS.md` 의 첫 프롬프트 (case-01) 복사·붙여넣기.
3. 10 초 후 `workspace/_workspace/` 에 `log.jsonl` + 호출된 워커 파일 + `answer.md`.
4. case-02, case-04 도 차례로 돌려 동적 분기를 비교한다.

(전체 프롬프트는 `PROMPTS.md` 참조)

## 예상 결과

`expected/` 폴더 참조. 슬라이드 22쪽 OBSERVE 박스의 4 단계 흐름 (STEP 1~4) 이 `case-01/_workspace/log.jsonl` 에 그대로 매핑된다.

```
[STEP 1] intent = "tech_defect + refund_intent" · 우선순위: tech 부터
[STEP 2] → tech-worker 호출 → 하드웨어 결함 확정
[STEP 3] → refund-worker 호출 (분기 결정) → 환불 + 사과문
[STEP 4] response-composer 합성 → 사용자 발송
```

## Try Yourself

> "분노" 톤이 감지되면 `human-handoff-worker` 를 호출하도록 Principles 4 줄을 추가하세요. supervisor 가 즉시 사람에게 넘기는 모습 관찰. (case-03-angry.txt 사용)

`.claude/agents/supervisor.md` 의 Principles 마지막에 한 줄을 추가한다:

```
4. 입력 텍스트에서 분노/욕설/반복적 강조 패턴이 감지되면, 다른 워커를 건너뛰고
   즉시 human-handoff-worker 를 호출해 사람에게 인계한다.
```

추가 변형:
- case-02 (login) 와 case-04 (refund-only) 를 차례로 돌려 supervisor 가 호출하는 워커 수가 매번 달라지는 것을 비교한다.
- tech 결과를 강제로 `normal_operation` 으로 바꾼 뒤 case-01 을 다시 돌리면 refund 가 호출되지 않는 것을 확인한다.
