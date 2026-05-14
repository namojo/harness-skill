# LAB 03 — 프롬프트 모음

> 강사용. Claude Code 에 그대로 붙여넣어 실행한다.

## 정상 흐름 (메인 데모)

### 1. 팀 자동 구성 — 메타 스킬 발동

```text
하네스 구성해줘. 인터뷰 음성을 블로그 마크다운까지의 5단계 파이프라인. interview-analyst 는 기존 것 재사용.
```

**기대 동작**: `harness:harness` 메타 스킬이 발동해 5개 에이전트와 3~4개 스킬을 만들고 `blog-pipeline` 오케스트레이터를 구성한다. interview-analyst 는 LAB 02 의 파일을 그대로 인식해 재생성하지 않는다.

**예상 결과**: 슬라이드 14쪽의 "생성되는 파일들" 블록과 동일한 파일 트리.

---

### 2. 파이프라인 실행 — 실제 블로그 한 편

```text
samples/podcast-ep07-transcript.txt 로 블로그 글 한 편 뽑아줘.
```

**기대 동작**: `blog-pipeline` 트리거 발화 매칭 → 5단계 순차 실행. 콘솔에 슬라이드 14쪽의 5줄 로그가 그대로 찍힌다.

```
[1/5] transcript-agent   : 19분 음성 → 텍스트
[2/5] interview-analyst  : 발견 3개 추출
[3/5] blog-drafter       : H2 5개의 초안
[4/5] tone-writer        : 문체 정리
[5/5] md-packager        : workspace/post.md 저장
```

**예상 결과**: `workspace/post.md` 1개 + `workspace/_workspace/` 에 6개 중간 파일.
슬라이드 14쪽 / `expected/post.md` 와 구조·인용·H2 개수가 일치.

---

## 변형 / Try Yourself

### 3. review-editor 단계를 4 와 5 사이에 추가 — Producer-Reviewer 예고

```text
blog-pipeline 에 review-editor 단계를 4번과 5번 사이에 끼워줘. tone-writer 출력을 검수해 통과되면 md-packager 로, 통과 못 하면 tone-writer 에 한 번 더. 최대 2회.
```

**기대 동작**: `.claude/agents/review-editor.md` 가 새로 생기고, `blog-pipeline` SKILL.md 의 Phase 4.5 가 추가된다. 다음 실행에서는 4·5단계 사이에 검수 루프가 콘솔에 1~2번 찍힌다.

이 변형은 LAB 06 (Producer-Reviewer) 의 워밍업이다. Pipeline 안에 루프가 처음으로 끼는 경험.

---

### 4. 부분 호출 — 이미 정제된 입력으로

```text
samples/cleaned-raw-interview-01.md 가 이미 정제된 텍스트야. transcript-agent 를 건너뛰고 Phase 2 부터 시작해줘.
```

**기대 동작**: `blog-pipeline` 이 Phase 1 을 스킵하고 `01_transcript.md` 자리에 입력 파일을 복사한 뒤 `interview-analyst` 부터 시작한다.

---

## 호출 컨벤션 메모

- LAB 03 부터는 명시적 호출이 기본이다. `blog-pipeline` 또는 `transcript-agent` 처럼 팀/에이전트 ID 를 발화에 포함하면 충돌 없이 정확하게 트리거된다.
- 동일 폴더(`~/harness-lab/`) 에 LAB 02 가 누적되어 있으면 `interview-analyst` 는 한 번만 정의되며, LAB 02 와 03 양쪽에서 재사용된다.
