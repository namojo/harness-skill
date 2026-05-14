# LAB 04 — 프롬프트 모음

> 강사용. Claude Code 에 그대로 붙여넣어 실행한다.

## 정상 흐름 (메인 데모)

### 1. 팀 자동 구성 — 메타 스킬 발동

```text
code-review-team 하네스 만들어줘. Fan-out 4명 + merger 1명. 입력은 PR diff, 출력은 우선순위 매긴 통합 리포트.
```

**기대 동작**: `harness:harness` 메타 스킬이 발동해 4명의 리뷰어와 1명의 merger 를 정의하고, `code-review-team` 오케스트레이터를 만든다. merger 의 Principles 3 개(충돌 병기 / Block·Warn·Nit / Block 1건이면 보류) 가 슬라이드 16쪽 그대로 박힌다.

**예상 결과**: `.claude/agents/` 에 5개 .md, `.claude/skills/code-review-team/SKILL.md` 1개.

---

### 2. 실제 PR 리뷰 — 4명이 동시에 본다

```text
PR #142 리뷰해줘.
```

**기대 동작**: `code-review-team` 트리거 발화 매칭 → `samples/pr-142.diff` + `samples/pr-142-context.md` 자동 로딩 → 4 리뷰어 병렬 실행 → merger 가 합본.

콘솔에 4 개의 리뷰가 동시에 진행되는 표시가 뜨고, 마지막에 merger 가 통합 리포트를 출력한다. 토큰은 동시에 소비된다.

**예상 결과**: `workspace/merged_report.md` 1개 + `workspace/_workspace/parallel/` 에 4개 개별 리뷰. 슬라이드 16쪽의 EXPECTED 블록과 매칭:

```
🔴 BLOCK (1)
- security: env 변수가 로그로 흘러간다.

🟡 WARN (3)
- performance: getUserById 가 루프 안.
- architect: domain 이 web 을 import.
- security ↔ style 충돌 → 두 의견 다 기록.
```

---

## 변형 / Try Yourself

### 3. 5번째 관점 cost-reviewer 추가

```text
code-review-team 에 5번째 관점 cost-reviewer 를 추가해줘. AWS 비용 영향을 본다. merger 의 Principles 에는 "cost 발견은 NIT 가 아닌 WARN 부터" 한 줄을 추가.
```

**기대 동작**: `.claude/agents/cost-reviewer.md` 생성, `code-review-team/SKILL.md` 의 Phase 1 표에 5번째 행 추가, `merger.md` 의 Principles 4번 추가.

같은 PR 을 다시 돌리면 5 명이 동시에 출발한다.

---

### 4. 부분 호출 — 한 명만

```text
security-reviewer 만 PR #142 봐줘.
```

**기대 동작**: merger 를 거치지 않고 `workspace/_workspace/parallel/security.md` 만 만들어 출력. 4 명 합본보다 빠르지만, 충돌 항목과 우선순위 통합은 빠진다.

---

### 5. 같은 PR 두 번 — 일관성 검증

```text
PR #142 다시 리뷰해줘.
```

**기대 동작**: 표면 문장은 다르지만 다음은 매번 동일해야 한다 — BLOCK 개수, 머지 보류 결론, 충돌 의견 병기 여부. 그게 Principles 가 박힌 효과다.

---

## 호출 컨벤션 메모

- `code-review-team` 또는 `merger`, `<영역>-reviewer` 처럼 팀/에이전트 ID 를 발화에 넣으면 다른 Lab 의 스킬과 충돌하지 않는다.
- 동일 폴더(`~/harness-lab/`) 에 LAB 01~03 이 누적된 상태에서도 안전하게 트리거된다.
