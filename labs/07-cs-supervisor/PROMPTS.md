# LAB 07 — 프롬프트 모음

> 강사용. Claude Code 에 그대로 붙여넣어 실행한다.

## 정상 흐름 (메인 데모 · 슬라이드 22쪽)

### 1. case-01 · tech + refund 복합 의도

```text
cs-supervisor 에게 다음 CS 케이스를 처리해줘.

"3 일 전 주문한 헤드폰이 도착했는데 한쪽이 안 들려요. 환불 가능한가요?"
```

**예상 결과**: `workspace/_workspace/` 에 `log.jsonl`, `tech.md`, `refund.md`, `answer.md` 4 개 파일 생성. 슬라이드 22쪽 OBSERVE 박스의 STEP 1~4 흐름과 일치.

```
[STEP 1] intent = "tech_defect + refund_intent" · 우선순위: tech 부터
[STEP 2] → tech-worker → 하드웨어 결함 확정
[STEP 3] → refund-worker (분기 결정) → 환불 + 사과문
[STEP 4] → response-composer → answer.md
```

## 변형 — 동적 분기 비교

### 2. case-02 · account 단독 의도

```text
cs-supervisor 에게 samples/cs-cases/case-02-login.txt 의 케이스를 처리해줘.
```

**예상 결과**: `account-worker` 만 호출. `tech.md` / `refund.md` 는 생성되지 않는다. `log.jsonl` 은 3 줄 (STEP 1 / account 호출 / composer 합성).

### 3. case-04 · refund 단독 의도

```text
cs-supervisor 에게 samples/cs-cases/case-04-refund-only.txt 의 케이스를 처리해줘.
```

**예상 결과**: `refund-worker` 만 호출. `tech.md` 는 생성되지 않는다. 같은 supervisor 가 case-01 과 다른 흐름을 만든다 — 이게 동적 라우팅이다.

## Try Yourself · 분노 톤 → human-handoff

### 4. supervisor.md Principles 에 4 번째 줄 추가 후 실행

`.claude/agents/supervisor.md` 의 Principles 마지막에 한 줄을 추가한다.

```
4. 입력 텍스트에서 분노/욕설/반복적 강조 패턴이 감지되면, 다른 워커를 건너뛰고
   즉시 human-handoff-worker 를 호출해 사람에게 인계한다.
```

그 다음 프롬프트:

```text
cs-supervisor 에게 samples/cs-cases/case-03-angry.txt 의 케이스를 처리해줘.
```

**예상 결과**: tech / refund / account 가 호출되지 않는다. `human-handoff-worker` 만 호출되어 `handoff-note.md` (사람 상담사용) + `answer.md` (고객용 짧은 인사) 두 파일이 생성된다.

## 디버깅 팁

- `log.jsonl` 이 비어 있으면 supervisor 가 의도 라벨링 단계를 건너뛴 것. SKILL.md 의 "STEP 1" 절차를 다시 확인.
- 모든 워커가 호출됐다면 supervisor 가 분기 결정 없이 fan-out 한 것. Principles 2 번 ("결과에 따라 호출할 수도, 안 할 수도 있다") 을 강조해 다시 호출.
