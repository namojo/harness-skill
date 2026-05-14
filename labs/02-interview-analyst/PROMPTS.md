# LAB 02 — 프롬프트 모음

> 강사용. Claude Code 에 그대로 붙여넣어 실행한다.

## 정상 흐름 (메인 데모)

### 1. 첫 번째 분석 — 명시적 호출

```text
interview-analyst 로 cleaned-raw-interview-01.md 분석해줘.
```

**예상 결과**: `workspace/insights-01.md` 생성. `## 핵심 발견 1` 의 추론 문장이 "팀 빌딩 부재가 가장 큰 후회로 보인다." 로 끝나고, 그 아래 직접 인용이 `> [A] "정말 후회되는 건 처음에 팀 시너지를 제대로 안 짠 거였어요."` 형식.

### 2. 두 번째 분석 — 같은 입력 한 번 더

```text
interview-analyst 로 cleaned-raw-interview-01.md 다시 분석해줘.
```

**관찰 포인트**: 표면 문장은 1번과 살짝 다르지만 다음 3개는 매번 유지된다.

- 발견 개수 — 항상 3개
- 인용 형식 — `> [화자] "..."` 매번 동일
- "~로 보인다" 톤 — 유지됨

이게 Agent 의 Principles 가 박힌 효과. 슬라이드 12쪽 OBSERVE 박스 그대로의 데모.

## 변형 / Try Yourself

### 3. 두 번째 인터뷰로 형식 일관성 확인

```text
interview-analyst 로 cleaned-raw-interview-02.md 분석해줘.
```

**예상 결과**: `workspace/insights-02.md`. 인터뷰 톤은 스타트업 회고 → 제품 PM 회고로 바뀌었지만 출력 형식 (헤딩 3개 + 인용 3개 + 다음 단계) 은 동일하다.

### 4. marketing-copywriter 페르소나 추가 (슬라이드 12 Try Yourself)

```text
marketing-copywriter 로 workspace/insights-01.md 를 카피로 확장해줘.
A·B·C 세 안으로.
```

**예상 결과**: `workspace/copy-insights-01.md`. A안(짧고 정직) / B안(사례 강조) / C안(질문 던지기) 3종. `.claude/agents/marketing-copywriter.md` 의 Principles 3번째 "수치 없이 단정하지 않는다" 가 출력에 반영됐는지 확인.

### 5. 본인 변형 — Principles 1줄 추가

`.claude/agents/marketing-copywriter.md` 의 Principles 에 본인이 정한 한 줄 ("고객 이름은 가명을 쓴다" 등) 을 추가하고, 4번 프롬프트를 다시 돌려본다. 추가한 원칙이 출력에 반영되는지가 Agent 정의의 변덕 차단력을 체감하는 가장 짧은 실험이다.
