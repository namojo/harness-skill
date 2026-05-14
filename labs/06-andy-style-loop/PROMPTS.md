# LAB 06 — 프롬프트 모음

> 강사용. Claude Code 에 그대로 붙여넣어 실행한다.
> 슬라이드 20쪽의 정상 흐름(3라운드 만에 pass)을 재현한다.

## 사전 준비

```bash
cp samples/post.md workspace/post.md
```

LAB 03 의 출력물이 입력이라는 누적 흐름을 데모하려면 위 명령으로 `workspace/post.md` 가 준비되어 있어야 한다.

## 정상 흐름 (메인 데모)

### 1. 한 줄 실행

```text
workspace/post.md 를 앤디 스타일로 다듬어줘.
```

**예상 결과**: 슬라이드 20쪽 OBSERVE 박스와 일치.

- `[ROUND 1]` verdict: fail · violations: 5 · "추상어 과다"
- `[ROUND 2]` verdict: fail · violations: 2 · "긴 문장 2개"
- `[ROUND 3]` verdict: pass · saved to `workspace/post-andy.md`

라운드별 중간 산출물은 `_workspace/round_<N>_review.json` 과 `_workspace/round_<N>_rewrite.md` 로 저장된다.

## 변형 / Try Yourself

### 2. max_iterations 를 1로 낮추기

`.claude/skills/andy-style-loop/SKILL.md` 의 종료 조건을 다음과 같이 수정한다.

```yaml
max_iterations: 1
```

그리고 같은 프롬프트를 다시 돌린다.

```text
workspace/post.md 를 앤디 스타일로 다듬어줘.
```

**관찰**: 1라운드 fail 후 즉시 에스컬레이션. 품질이 떨어진 채로 종료되는 모습을 본다.

### 3. max_iterations 를 10으로 올리기

```yaml
max_iterations: 10
```

룰북에 규칙을 1~2개 더 추가하거나 기준을 엄격하게 만든 뒤(예: "1 문장은 20자 이하") 같은 프롬프트를 돌린다.

**관찰**: 라운드 수가 늘어나며 토큰 비용이 증가한다. 비용/품질 트레이드오프 체감.
