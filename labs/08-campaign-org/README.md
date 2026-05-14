# LAB 08 — campaign-org · Pattern 6 (Hierarchical Delegation)

> 슬라이드 23쪽 ~ 24쪽 · 2 단 위임

## 시나리오

하나의 supervisor 로는 다 못 보는 규모.

하위 작업이 또 여러 단계로 쪼개진다. `survey` 워커도 사실은 "설문 설계 + 발송 + 응답 정제" 의 작은 파이프라인이다. 이걸 top supervisor 가 다 보면 컨텍스트가 폭발한다.

### 각 층의 책임 분리

| 층 | 책임 |
|----|------|
| `campaign-lead` | 큰 그림 · 두 팀 간 조율만 |
| `research-lead` | research 워커들만 봄 |
| `creative-lead` | creative 워커들만 봄 |
| 워커들 | 실제 작업만 |

## 왜 이 패턴인가

LAB 07 의 supervisor 한 층은 워커가 3 ~ 5 명일 때까지 잘 굴러간다. 그러나 캠페인처럼 작업이 또 작업을 낳는 도메인에서는 supervisor 가 모든 워커 산출물을 직접 읽어야 해서 토큰·집중력이 폭발한다. 2 단 위임은 그것을 두 층으로 쪼개 — **상위는 sub 가 보낸 요약만**, 워커는 자기 sub-lead 한 명만 본다. 깊이는 2 단으로 끝낸다 — 3 단을 넘으면 지연과 컨텍스트 손실이 커진다.

함정: campaign-lead 가 워커에게 직접 일을 시키거나, 워커 원본 파일을 읽으면 위임이 무너진다. Principles 1·2 번이 그것을 차단한다.

## 빌드 — 만든 파일

```
.claude/skills/campaign-org/SKILL.md
.claude/agents/
├── campaign-lead.md      (top supervisor)
├── research-lead.md      (sub-supervisor 1)
├── creative-lead.md      (sub-supervisor 2)
├── survey-worker.md
├── desk-research-worker.md
├── trends-worker.md
├── copy-worker.md
├── design-worker.md
├── video-worker.md
└── analytics-lead.md     (Try Yourself · sub-supervisor 3 템플릿)
samples/
├── product-brief.md      (하네스 학습 키트)
└── competitor-list.md    (경쟁사 12 곳)
expected/
├── campaign-brief.md
└── _workspace/
    ├── tree-log.txt
    ├── research/{survey.md, desk.md, trends.md, lead-summary.md}
    └── creative/{copy.md, design.md, video.md, lead-summary.md}
```

## 실행 — 강의 중 데모

1. 이 폴더에서 `claude` 실행.
2. `PROMPTS.md` 의 첫 프롬프트 (큰 위임 한 줄) 복사·붙여넣기.
3. 1 ~ 2 분 후 `workspace/_workspace/` 트리 안에 research / creative 두 폴더가 채워지고, 최상위에 `campaign-brief.md` 와 `tree-log.txt` 가 떨어진다.

(전체 프롬프트는 `PROMPTS.md` 참조)

## 예상 결과

`expected/` 폴더 참조. 슬라이드 24쪽 OBSERVE 박스의 트리 로그가 `expected/_workspace/tree-log.txt` 에 그대로 매핑된다.

```
[campaign-lead]
├── [research-lead]  (start)
│   ├── survey   → 응답 47건
│   ├── desk     → 경쟁사 12곳
│   └── trends   → 키워드 8개
│        research-lead : 요약 1쪽 → up
├── [creative-lead]  (start)
│   ├── copy     → 헤드라인 5안
│   ├── design   → 비주얼 컨셉 3안
│   └── video    → 30초 스크립트 2안
│        creative-lead : 요약 1쪽 → up
└── campaign-lead : brief 합성 ✓
```

## Try Yourself

> `analytics-lead` 라는 세 번째 sub-supervisor 를 추가하세요. `campaign-lead` 의 Principles 만 살짝 수정해서 3 팀 병렬로 만들 것. Pattern 6 의 진짜 확장성을 체감한다.

`.claude/agents/analytics-lead.md` 템플릿이 이미 들어 있다. 다음 두 가지를 해본다:

1. `campaign-lead.md` 의 Principles 에 한 줄을 추가한다:
   ```
   4. research / creative / analytics 셋을 병렬로 호출한다. 결과 요약 셋을 모두 받아 통합한다.
   ```
2. analytics 의 하위 워커 (예: `kpi-worker`, `dashboard-worker`, `ab-test-worker`) 를 정의한다. 워커 정의는 본 LAB 의 다른 워커 파일을 템플릿으로 복사해 짧게 짠다.

확장하면 트리 로그가 3 가지 (├── analytics-lead) 로 늘어나는 것을 확인할 수 있다.

추가 변형:
- 위임 규칙 위반 테스트: campaign-lead 에게 "survey-worker 결과 원본을 보고 직접 결정해줘" 라고 요청해본다. Principles 1·2 번에 따라 거부하는지 관찰.
- 충돌 시뮬레이션: creative-lead 의 `lead-summary.md` 톤을 강하게 "도발 중심" 으로 바꾼 뒤 다시 합성. campaign-lead 가 양쪽을 병기하고 사용자에게 묻는지 확인.
