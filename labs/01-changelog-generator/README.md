# LAB 01 — changelog-generator (Skill)

> 슬라이드 7~9쪽 · Skill · Progressive Loading

## 시나리오

v1.2.0 → v2.0.0 릴리스 준비를 한 번에. 손에는 git 저장소(태그 `v1.2.0` ~ `HEAD`)와 기존 `CHANGELOG.md`, 그리고 릴리스 유형(정규/핫픽스/프리릴리스)이 있다. 받게 되는 것은 5개 산출물이다.

```
workspace/
├── 00_input.md
├── 01_commit_analysis.md
├── 02_change_classification.md
├── 03_release_notes.md        # Keep a Changelog
├── 04_migration_guide.md     # Breaking Changes 가이드
└── 05_announcement.md        # 블로그 + SNS + 이메일
```

## 왜 이 패턴인가

릴리스마다 같은 절차 — 커밋 분석 · 분류 · 노트 · 마이그레이션 · 공지. 매번 프롬프트로 풀어쓰면 까먹고 흔들린다. 한 번 Skill 로 굳히면 "릴리스 준비해줘" 한마디로 끝난다. 평소엔 YAML 5~10줄만 메모리에 있고, 트리거 발화가 등장해야 본문이 펼쳐지는 Progressive Loading 이 이 LAB 의 핵심이다.

함정 — description 의 트리거 발화가 빈약하면 발동하지 않는다. 슬라이드 8쪽의 8개 한국어 발화를 반드시 포함시킨다. 범위 밖 한 줄("CI/CD 통합·자동 배포는 범위가 아니다")도 오작동을 줄이는 가장 강력한 장치다.

## 빌드 — 만든 파일

- `.claude/skills/changelog-generator/SKILL.md` — 트리거 YAML + 5단계 워크플로우
- `.claude/agents/commit-analyst.md` — git 이력 분석가
- `.claude/agents/change-classifier.md` — 변경 분류, 영향도 평가
- `.claude/agents/release-note-writer.md` — Keep a Changelog 작성
- `.claude/agents/migration-guide-writer.md` — Breaking Changes 가이드
- `.claude/agents/announcement-writer.md` — 블로그/SNS/이메일 공지
- `samples/git-log.txt` — v1.2.0..HEAD 가짜 git log 20커밋
- `samples/CHANGELOG.md` — 기존 v1.0.0~v1.2.0 체인지로그
- `samples/release-meta.yml` — version 2.0.0, type major, date 2026-05-14

## 실행 — 강의 중 데모

1. 이 폴더에서 `claude` 실행.
2. `PROMPTS.md` 의 첫 프롬프트를 그대로 복사·붙여넣기.
3. 5~10초 뒤 `workspace/` 에 5개 산출물 + `00_input.md` 가 쌓인다.

(전체 프롬프트는 `PROMPTS.md` 참조)

## 예상 결과

`expected/` 폴더 6개 파일 참조. 슬라이드 9쪽의 EXPECTED 와 `03_release_notes.md` 첫머리가 1:1 매칭된다.

## Try Yourself

- **공지문만 호출**: "이 릴리스 노트가 있는데 공지문만 써줘" + 기존 노트 첨부. `announcement-writer` 만 투입되고 4개 에이전트는 건너뛴다. (PROMPTS.md §2)
- **트리거 발화 바꿔보기**: SKILL.md description 의 발화 8개 중 3개를 지워보고, "변경사항 정리" 한 줄로 발동되는지 확인. 트리거가 description 의 어느 단어에 걸리는지 체감.
- **본인 프로젝트로 옮기기**: `samples/git-log.txt` 를 실제 `git log` 출력으로 교체. release-meta.yml 만 갈아끼우면 즉시 굴러간다.
