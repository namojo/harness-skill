# LAB 01 — 프롬프트 모음

> 강사용. Claude Code 에 그대로 붙여넣어 실행한다.

## 정상 흐름 (메인 데모)

### 1. 풀 파이프라인 한 줄 호출

```text
v1.2.0에서 v2.0.0까지 릴리스 노트 전체를 만들어줘.
```

**예상 결과**: `workspace/` 에 6개 파일 (`00_input.md` ~ `05_announcement.md`) 생성. `03_release_notes.md` 의 첫머리가 슬라이드 9쪽 EXPECTED 와 일치 — `## [2.0.0] - 2026-05-14` 헤딩 아래 Breaking Changes / Added / Changed / Fixed 순서.

**내부 동작**:
1. L1 메타에서 "릴리스 노트" 트리거 매칭
2. SKILL.md 펼침 → 5개 agent.md 로딩
3. `samples/git-log.txt`, `release-meta.yml`, `CHANGELOG.md` 자동 읽기
4. Phase 2 의 작업 2a (분류) 와 Phase 4 의 4a·4b (마이그레이션·공지) 가 병렬 실행

## 변형 / Try Yourself

### 2. 공지문만 호출 — announcement-writer 단독

```text
이 릴리스 노트가 있는데 공지문만 써줘. 입력은 expected/03_release_notes.md 파일이다.
블로그·SNS·이메일 세 채널로 한 번에 뽑아줘.
```

**예상 결과**: `workspace/05_announcement.md` 단일 파일만 생성. `announcement-writer` 만 투입되고 나머지 4개 에이전트는 호출되지 않는다. SKILL.md 의 "부분 호출" 섹션이 살아 있는지 확인하는 데모.

### 3. Try Yourself — 다른 트리거 발화

```text
새 버전 발표 글 좀 정리해줘. v2.0.0 으로.
```

**관찰 포인트**: description 의 8개 발화 중 "새 버전 발표" 가 트리거에 걸리는지. 같은 결과가 나와야 한다. 만약 발동하지 않으면 SKILL.md 의 description 트리거 발화를 점검한다.

### 4. Try Yourself — Breaking Change 가 없을 때

```text
v2.0.0 까지 만든 다음, 이번엔 핫픽스 v2.0.1 을 가정하고 마이그레이션 가이드만 다시 뽑아줘.
가짜로 fix 커밋 3건만 있다고 치자.
```

**예상 결과**: `04_migration_guide.md` 가 "이번 릴리스에는 마이그레이션이 필요하지 않다" 한 줄만 남긴 채 종료. `migration-guide-writer` 의 Principles 5번이 작동하는지 보는 케이스.
