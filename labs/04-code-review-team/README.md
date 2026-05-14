# LAB 04 — code-review-team (Pattern 2 · Fan-out / Fan-in)

> 슬라이드 15쪽 ~ 16쪽 · 4 관점 동시 + 1 종합

## 시나리오

PR 하나를 네 개의 눈이 동시에 본다. 네 관점(architect / security / performance / style) 은 서로 의존하지 않는다. 보안 리뷰가 끝나야 성능을 볼 필요는 없다. Pipeline 으로 묶으면 4 배 느려질 뿐이다.

merger 한 명이 4 명의 결과를 받아 우선순위 매겨 통합 리포트로 만든다.

## 왜 이 패턴인가

서로 독립인 작업은 병렬이 정답이다. Fan-out 으로 동시에 시작하고, 결과는 Fan-in 으로 통합한다.

**함정** — 종합자가 천장이다. merger 가 약하면 4 명이 모은 통찰이 평탄해진다. 그래서 `merger.md` 의 Principles 에 다음 3 줄을 박았다.

```
1. 충돌하는 의견은 약화하지 말고 병기 한다.
2. "Block"·"Warn"·"Nit" 3 단계로 분류한다.
3. Block 이 1 개라도 있으면 머지를 보류한다.
```

## 빌드 — 만든 파일

```
.claude/skills/
└── code-review-team/SKILL.md           # Fan-out/Fan-in 오케스트레이터

.claude/agents/
├── architect-reviewer.md               # 모듈 경계 · 의존성
├── security-reviewer.md                # 입력 검증 · 비밀 누출
├── performance-reviewer.md             # N+1 쿼리 · 핫패스
├── style-reviewer.md                   # 네이밍 · 컨벤션
└── merger.md                           # 4개 받아 우선순위 매겨 합본

samples/
├── pr-142.diff                         # 가짜 PR (Java/Spring)
└── pr-142-context.md                   # PR 설명·이슈 번호
```

4 리뷰어 + 1 머저 = 5 에이전트. PR diff 한 개에 의도적으로 4 영역 이슈가 1건씩 박혀 있다.

## 실행 — 강의 중 데모

1. 이 폴더에서 `claude` 실행
2. `PROMPTS.md` 의 첫 프롬프트 — 팀 자동 구성
3. `PROMPTS.md` 의 두 번째 프롬프트 — 실제 리뷰 실행
4. 5~15초 후 `workspace/merged_report.md` 1개 + `workspace/_workspace/parallel/` 에 4개 개별 리뷰

(전체 프롬프트는 `PROMPTS.md` 참조)

## 예상 결과

`expected/_workspace/merged_report.md` 참조. 슬라이드 16쪽 EXPECTED 와 매칭된다.

```
🔴 BLOCK (1)
- security: env 변수가 로그로 흘러간다.

🟡 WARN (3)
- performance: getUserById 가 루프 안.
- architect: domain 이 web 을 import.
- security ↔ style 충돌 → 두 의견 다 기록.
```

## Try Yourself

### 5번째 관점 cost-reviewer 추가 — Pattern 의 확장성 체감

AWS 비용 영향을 보는 `cost-reviewer` 를 추가한다.

1. `.claude/agents/cost-reviewer.md` 를 새로 만든다. Role 은 "AWS / 클라우드 비용 분석가". Principles 에는 "지표 단위 명시", "월 단위 영향 추정", "대안 비용까지 같이 제시" 같은 3~5개 룰.
2. `code-review-team/SKILL.md` 의 Phase 1 병렬 호출 표에 5번째 행을 추가.
3. `merger.md` 의 Principles 마지막에 한 줄만 추가한다 — `4. cost 발견이 있으면 "🟢 NIT" 가 아닌 "🟡 WARN" 부터 시작한다 (비용은 누적된다).`

같은 PR 을 다시 돌리면, 이번엔 5명이 동시에 출발한다. merger 가 자연스럽게 5번째 영역을 받아들이는 모습을 본다.

### 부분 호출 — 한 관점만

```text
security-reviewer 만 PR #142 봐줘.
```

merger 를 거치지 않고 보안 리뷰만 출력한다. 같은 입력에 대해 4 명의 합본보다 1 명의 단독이 더 빠른지, 그러나 충돌 신호를 놓치는지 비교한다.

## 호출 컨벤션

- 명시적 호출 권장: `code-review-team 으로 PR #142 봐줘.` 또는 `PR #142 리뷰해줘.`
- 개별 호출도 가능: `architect-reviewer 만 봐줘.`
