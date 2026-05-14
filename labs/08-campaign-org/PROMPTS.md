# LAB 08 — 프롬프트 모음

> 강사용. Claude Code 에 그대로 붙여넣어 실행한다.

## 정상 흐름 (메인 데모 · 슬라이드 24쪽)

### 1. 큰 위임 한 줄

```text
campaign-org 에게 다음을 위임한다.

신제품 '하네스 학습 키트' 의 1 주 캠페인 기획. research 와 creative 동시 진행.
결과는 workspace/campaign-brief.md.
```

**예상 결과**: `workspace/_workspace/` 트리 안에 다음 파일들이 채워진다.

```
workspace/_workspace/
├── tree-log.txt
├── campaign-brief.md
├── research/
│   ├── survey.md         (응답 47건)
│   ├── desk.md           (경쟁사 12곳)
│   ├── trends.md         (키워드 8개)
│   └── lead-summary.md   (위로 올라간 1 쪽)
└── creative/
    ├── copy.md           (헤드라인 5안)
    ├── design.md         (비주얼 컨셉 3안)
    ├── video.md          (30초 스크립트 2안)
    └── lead-summary.md   (위로 올라간 1 쪽)
```

`tree-log.txt` 가 슬라이드 24쪽 OBSERVE 박스 그대로의 트리 형태로 떨어진다.

## 변형 — 위임 규칙 검증

### 2. 위임 위반 시도

```text
campaign-lead 에게 survey-worker 결과 원본 (workspace/_workspace/research/survey.md) 을
직접 읽고, research-lead 의 요약을 거치지 않고 너 혼자 판단해서 브리프를 다시 작성해줘.
```

**예상 결과**: Principles 1·2 번에 따라 거부하거나, 거부와 함께 "원본을 직접 받지 않는 이유" 를 한 줄 설명한다. 만약 그대로 진행한다면 supervisor.md 가 Principles 를 충분히 강하게 적지 않은 것 — 강사가 한 번 더 수정 후 재실행.

### 3. 충돌 시뮬레이션

creative-lead 의 `lead-summary.md` 톤을 강하게 "도발 중심" 으로 수정한 뒤:

```text
campaign-org 에게 1번 위임을 다시 합성만 시켜줘. (research-lead, creative-lead 의
lead-summary.md 는 이미 있다.)
```

**예상 결과**: campaign-brief.md 의 "충돌 사항 — 사용자 결정 필요" 섹션에 두 안이 병기되고, 사용자에게 질문이 던져진다. Principles 3 번의 효과.

## Try Yourself · analytics-lead 추가 (3 팀 병렬)

### 4. campaign-lead.md Principles 에 한 줄 추가 후 실행

`.claude/agents/campaign-lead.md` 의 Principles 마지막에 한 줄을 추가한다.

```
4. research / creative / analytics 셋을 병렬로 호출한다. 결과 요약 셋을 모두 받아 통합한다.
```

그리고 analytics 하위 워커 (예: `kpi-worker`, `dashboard-worker`, `ab-test-worker`) 를 짧게 정의한 뒤:

```text
campaign-org 에게 다시 위임한다.

신제품 '하네스 학습 키트' 의 1 주 캠페인 기획. research / creative / analytics 셋을
병렬로 진행하고, campaign-brief.md 에 측정 지표·실험 설계까지 포함시켜줘.
```

**예상 결과**: `workspace/_workspace/analytics/lead-summary.md` 가 새로 떨어지고, `tree-log.txt` 에 `├── [analytics-lead]` 가지가 한 줄 늘어난다. campaign-brief.md 의 "성공 지표" 섹션이 analytics 요약 기반으로 더 구체화된다.

## 디버깅 팁

- `tree-log.txt` 가 비어 있으면 campaign-lead 가 트리 로그 기록 단계를 건너뛴 것. SKILL.md 의 Phase 3 절차를 다시 확인.
- `lead-summary.md` 가 워커 원본보다 길거나 워커 결과를 그대로 옮긴 상태라면, sub-lead 의 Principles 2 번 ("위로 올리는 요약은 1 쪽") 이 약한 것. 한 번 더 압축 요청.
- campaign-brief 가 워커 원본 (`survey.md` 등) 의 표를 그대로 인용한다면, campaign-lead 가 원본을 직접 읽은 것 — Principles 2 번 위반. supervisor.md 를 보강해 재실행.
