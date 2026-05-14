# LAB 03 — blog-pipeline (Pattern 1 · Pipeline)

> 슬라이드 13쪽 ~ 14쪽 · 5단계 순차 파이프라인 — A가 끝나야 B가 시작된다

## 시나리오

인터뷰 한 건이 블로그 글 한 편이 되기까지. 종속 관계가 명확하다 — A 가 끝나야 B 가 시작된다. 순서를 어기면 결과가 망가진다. Pipeline 의 정의 그 자체.

LAB 02 의 에이전트(`interview-analyst`) 는 다시 짜지 않는다. 그대로 파이프라인의 2번째 단계로 꽂힌다.

## 왜 이 패턴인가

각 에이전트의 I/O 가 다음 에이전트의 Input 으로 정확히 들어맞아야 한다. 한 단계라도 형식이 어긋나면 다음 단계가 멈춘다. Pipeline 은 가장 느린 단계가 전체 속도를 정한다.

함정 — 형식이 어긋난 산출물을 그대로 넘기면 다음 에이전트가 추측으로 메우고, 추측은 변덕이 된다. 그래서 각 단계가 자기 출력 형식을 엄격하게 지킨다.

## 빌드 — 만든 파일

```
.claude/skills/
├── blog-pipeline/SKILL.md          # 5단계 오케스트레이터
├── transcript-clean/SKILL.md       # 1단계 정제 규약
├── blog-structure-ko/SKILL.md      # 3단계 H2 5개 구조
└── md-export/SKILL.md              # 5단계 export 규약

.claude/agents/
├── transcript-agent.md             # [1/5]
├── interview-analyst.md            # [2/5] — LAB 02 재사용
├── blog-drafter.md                 # [3/5]
├── tone-writer.md                  # [4/5]
└── md-packager.md                  # [5/5]
```

5 에이전트 + 4 스킬 + 1 input. interview-analyst 는 LAB 02 의 파일을 복사해 두었다.

## 실행 — 강의 중 데모

1. 이 폴더에서 `claude` 실행 (또는 워크숍 통합 폴더 `~/harness-lab/` 에 누적된 상태에서)
2. `PROMPTS.md` 의 첫 프롬프트 복사·붙여넣기 — 메타 스킬이 5단계 팀을 자동 구성
3. `PROMPTS.md` 의 두 번째 프롬프트 — 실제 파이프라인 실행
4. 5~10초 후 `workspace/` 에 `post.md` 1개 + `_workspace/` 6개 파일

(전체 프롬프트는 `PROMPTS.md` 참조)

## 예상 결과

`expected/` 폴더 참조. 슬라이드 14쪽의 5단계 콘솔 로그와 매칭된다.

```
[1/5] transcript-agent   : 19분 음성 → 텍스트
[2/5] interview-analyst  : 발견 3개 추출
[3/5] blog-drafter       : H2 5개의 초안
[4/5] tone-writer        : 문체 정리
[5/5] md-packager        : workspace/post.md 저장
```

최종 `workspace/post.md` 는 H2 5개 구조에 약 1,800자, 핵심 발견 3개와 직접 인용 2~3개를 포함한다.

## Try Yourself

### review-editor 끼우기 — Pipeline 안에 Producer-Reviewer 가 처음 등장

4번(`tone-writer`) 과 5번(`md-packager`) 사이에 `review-editor` 단계를 끼워 넣는다. `tone-writer` 출력을 검수해 통과되면 `md-packager` 로 보내고, 통과 못 하면 `tone-writer` 에게 한 번 더 돌린다. 짧은 루프지만, Pipeline 안에 LAB 06 의 Producer-Reviewer 패턴이 처음 끼는 경험이다.

힌트:
- `.claude/agents/review-editor.md` 를 추가하고 검수 룰 3~5개를 박아둔다 ("H2 정확히 5개", "인용 화자 라벨 보존", "TODO 마커 위치 확인").
- `blog-pipeline` SKILL.md 의 Phase 4 와 Phase 5 사이에 Phase 4.5 를 끼우고 `max_iterations: 2` 를 둔다.

### 다른 입력으로 돌리기

LAB 02 의 `samples/cleaned-raw-interview-01.md` 를 입력으로 주면 1단계(`transcript-agent`) 를 건너뛰고 Phase 2 부터 시작한다. 같은 파이프라인이 부분 호출도 지원하는지 확인하는 변형이다.

## 누적 흐름

- 입력: `samples/podcast-ep07-transcript.txt` (이 Lab 에서 새로 만든 인터뷰)
- 재사용: `interview-analyst.md` (LAB 02 정의를 그대로 복사)
- 출력: `expected/post.md` → LAB 06 (앤디 스타일 루프) 의 입력으로 복제된다
