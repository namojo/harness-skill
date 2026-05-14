# LAB 06 — andy-style-loop (Producer-Reviewer)

> 슬라이드 19쪽 ~ 20쪽 · Pattern 4 — 통과될 때까지 다시 쓰기를 시키는 루프.

## 시나리오

블로그 초안(LAB 03 의 출력)을 입력으로 받아 producer 가 다듬고 reviewer 가 룰북으로 검사한다. fail 이면 rewrite_hint 와 함께 다시 쓴다. 최대 3회. 그 이상이면 사용자에게 에스컬레이션.

핵심: **종료 조건이 살아 있어야 한다.** 무한 루프 방지, 최대 N 회 시도 후에는 사람에게.

## 왜 이 패턴인가

품질이 안 잡힐 때, 한 번 쓰고 끝내지 않고 룰북으로 검사 → 실패하면 힌트와 함께 다시 쓴다. 같은 모델이라도 reviewer 라는 다른 페르소나가 검사하면 자기 글을 더 객관적으로 본다.

## 빌드 — 만든 파일

- `.claude/skills/andy-style-loop/SKILL.md` — 오케스트레이터
- `.claude/skills/andy-style-rulebook/SKILL.md` — 5줄 룰북 + reviewer 출력 형식
- `.claude/agents/producer.md`
- `.claude/agents/reviewer.md`
- `samples/post.md` — 의도적으로 5개 위반이 포함된 초안

## 실행 — 강의 중 데모

1. 이 폴더에서 `claude` 실행
2. `cp samples/post.md workspace/post.md`
3. `PROMPTS.md`의 첫 프롬프트 복사·붙여넣기
4. 콘솔에 3라운드 로그가 흐르고 `workspace/post-andy.md` 가 저장됨

(전체 프롬프트는 `PROMPTS.md` 참조)

## 예상 결과

슬라이드 20쪽 OBSERVE 박스와 매칭.

```
[ROUND 1] draft → reviewer
verdict: fail · violations: 5 · "추상어 과다"
[ROUND 2] rewrite → reviewer
verdict: fail · violations: 2 · "긴 문장 2개"
[ROUND 3] rewrite → reviewer
verdict: pass · saved to workspace/post-andy.md
```

`expected/_workspace/` 에 round_1 ~ round_3 의 review.json 과 rewrite.md 가 있다. 최종 통과본은 `expected/post-andy.md`.

## Try Yourself

슬라이드 20쪽 Try Yourself.

1. `.claude/skills/andy-style-loop/SKILL.md` 의 `max_iterations` 를 1로 낮추고 다시 돌린다. 1라운드 fail 상태에서 강제 종료되어 품질이 떨어지는 모습 관찰.
2. 10으로 올린다. 3라운드에서 이미 pass 가 나오므로 비용 차이는 적지만, 일부러 룰북을 까다롭게 바꾸면 라운드가 늘어나며 토큰 비용이 증가한다.
