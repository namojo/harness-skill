window.HARNESS_DATA = window.HARNESS_DATA || {};
window.HARNESS_DATA["lab01"] = {
  diagram: null,
  diagramCaption: "Skill 단일 호출 · Progressive Loading",
  scenario: {
    intro: "v1.2.0 → v2.0.0 릴리스 준비를 한 번에. 손에는 git 저장소(태그 v1.2.0~HEAD)와 기존 CHANGELOG.md, 그리고 릴리스 유형(정규/핫픽스/프리릴리스)이 있다. 받게 되는 것은 5개 산출물이다.",
    boxes: [
      {
        label: "A",
        title: "INPUT — 손에 있는 것",
        body: "git 저장소 (태그 <code>v1.2.0</code> ~ <code>HEAD</code>)<br>기존 <code>CHANGELOG.md</code> (선택 · 형식 유지)<br>릴리스 유형: 정규 / 핫픽스 / 프리릴리스",
        warn: false
      },
      {
        label: "B",
        title: "OUTPUT — 5개 산출물",
        body: "<code>workspace/00_input.md</code><br><code>workspace/01_commit_analysis.md</code><br><code>workspace/02_change_classification.md</code><br><code>workspace/03_release_notes.md</code> · Keep a Changelog<br><code>workspace/04_migration_guide.md</code> · Breaking Changes 가이드<br><code>workspace/05_announcement.md</code> · 블로그 + SNS + 이메일",
        warn: false
      },
      {
        label: "WHY",
        title: "왜 Skill 인가",
        body: "릴리스마다 같은 절차 — 커밋 분석 · 분류 · 노트 · 마이그레이션 · 공지. 매번 프롬프트로 풀어쓰면 까먹고 흔들린다. 한 번 Skill 로 굳히면 <strong>\"릴리스 준비해줘\"</strong> 한마디로 끝.",
        warn: false
      },
      {
        label: "함정",
        title: "트리거 발화가 빈약하면 발동하지 않는다",
        body: "description 의 8개 한국어 발화를 반드시 포함시킨다. 범위 밖 한 줄(<code>\"CI/CD 통합·자동 배포는 범위가 아니다\"</code>)도 오작동을 줄이는 가장 강력한 장치.",
        warn: true
      }
    ],
    principles: [
      "YAML 프론트매터의 name · description · trigger 발화",
      "SKILL.md 가 5개 에이전트의 워크플로우를 선언",
      "workspace/ 파일 기반 전달 프로토콜"
    ],
    points: [
      "Progressive Loading — 평소엔 YAML 5~10줄만 메모리, 트리거 발화 시 본문 + 5개 agent.md 펼쳐짐",
      "description 의 트리거 발화 8개가 곧 발동 키워드",
      "범위 밖 명시(\"안 함\")가 오작동 가장 강력하게 차단"
    ]
  },
  build: {
    intro: "Skill 파일 1개 + Agent 파일 5개. YAML 프론트매터의 description 안에 8개 한국어 발화가 곧 트리거.",
    files: [
    {
      path: ".claude/skills/conventional-commits/SKILL.md",
      lang: "md",
      content: `---
name: conventional-commits
description: |
  Conventional Commits 1.0.0 사양에 맞춰 커밋 메시지를 파싱하고, 타입·스코프·BREAKING CHANGE를 분류하는 도메인 표준. 시맨틱 버전 결정 규칙과 Keep a Changelog 섹션 매핑까지 포함한다.
  'conventional commits 파싱', '커밋 타입 분류', '커밋 메시지 분석', 'feat/fix/refactor 분류',
  '커밋 컨벤션', 'breaking change 추출', '시맨틱 버전 결정', 'commit message 정규화'
  등 커밋 파싱·분류 작업에 이 스킬을 반드시 사용한다.
  단, 실제 git 명령 실행, 자동 커밋 생성, 브랜치 전략 결정은 이 스킬의 범위가 아니다.
---

# Conventional Commits — 파싱·분류 표준

\`commit-analyst\` 에이전트가 git log 한 덩어리를 받았을 때, 어떤 규칙으로 커밋을 분류하고 release-note-writer에게 넘길지를 정한 도메인 표준이다.

## 메시지 구조

\`\`\`
<type>(<scope>)<!>: <description>

<body>

<footer(s)>
\`\`\`

- \`type\`: 필수. 아래 표 참조
- \`scope\`: 선택. 모듈명·기능명
- \`!\`: 선택. 있으면 Breaking Change
- \`description\`: 필수. 명령형 현재시제, 50자 이내
- \`body\`: 선택. 변경 배경·이유
- \`footer\`: 선택. \`BREAKING CHANGE: ...\`, \`Closes #123\`, \`Co-authored-by: ...\` 등

## 타입 분류 표

| type | 의미 | Keep a Changelog 섹션 | semver |
|------|------|----------------------|--------|
| \`feat\` | 새 기능 | Added | MINOR |
| \`fix\` | 버그 수정 | Fixed | PATCH |
| \`perf\` | 성능 개선 | Changed | PATCH |
| \`refactor\` | 동작 변경 없는 리팩터링 | (제외 가능) | — |
| \`style\` | 포맷·세미콜론 등 | (제외) | — |
| \`docs\` | 문서 | (제외 가능) | — |
| \`test\` | 테스트 추가·수정 | (제외) | — |
| \`build\` | 빌드 시스템 | (제외) | — |
| \`ci\` | CI 설정 | (제외) | — |
| \`chore\` | 잡일 | (제외) | — |
| \`revert\` | 이전 커밋 되돌림 | Changed | PATCH |

\`!\` 또는 footer의 \`BREAKING CHANGE:\` 가 있으면 → **MAJOR** 버전, Keep a Changelog의 **Breaking Changes** 섹션.

## 파싱 알고리즘

각 커밋 한 줄씩 처리:

1. 첫 줄에서 \`:\` 위치를 찾는다. 없으면 분류 불가 → \`chore\` 처리
2. \`:\` 앞부분에서 정규식 \`^(\\w+)(\\(([^)]+)\\))?(!)?$\` 로 type / scope / breaking 추출
3. \`:\` 뒷부분이 description
4. body·footer에서 \`BREAKING CHANGE:\` 패턴 검색 → 발견 시 breaking=true
5. footer에서 \`Closes #N\` / \`Fixes #N\` / \`Refs #N\` 추출 → 이슈 링크 보존

## 좋은 예

\`\`\`
feat(auth): OAuth2 PKCE 인증 흐름 추가

기존 Implicit Grant는 보안 권장에서 빠졌다. PKCE로 마이그레이션.

Closes #421
\`\`\`

→ \`type=feat\`, \`scope=auth\`, \`breaking=false\`, \`issue=421\`, 섹션: **Added**

\`\`\`
feat(api)!: /users/{id} 응답 스키마 변경

profile 필드를 nested 객체로 변경. 클라이언트는 마이그레이션 가이드 §2 참조.

BREAKING CHANGE: profile 필드 평탄 구조 폐기
\`\`\`

→ \`type=feat\`, \`scope=api\`, \`breaking=true\`, 섹션: **Breaking Changes**, semver: **MAJOR**

## 나쁜 예 (분류 실패·교정)

\`\`\`
update README
\`\`\`

→ type 없음. \`docs(readme)\` 로 추정 + body에 원문 보존. 분류는 (제외).

\`\`\`
fix bug
\`\`\`

→ type=fix 추출 가능, 그러나 description이 무의미. release-note에 그대로 넣지 말고 PR 번호·이슈로 보강.

## 시맨틱 버전 결정 규칙

전체 커밋 묶음을 보고 다음 순서로 결정:

1. 하나라도 BREAKING → **MAJOR**
2. 없으면 \`feat\`가 1개 이상 → **MINOR**
3. 없으면 \`fix\` / \`perf\` / \`refactor\`만 → **PATCH**
4. 위 모두 없으면 → 릴리스 생성 보류 (사용자에게 확인)

## 보고 형식

\`commit-analyst\` 산출물 \`_workspace/01_commit_analysis.md\` 의 표준 형식:

\`\`\`markdown
# Commit Analysis · v1.2.0 → HEAD

## 요약
- 총 N 커밋
- Breaking: M
- feat: K, fix: L, perf: P, refactor: R, 기타: O
- 권장 semver: MAJOR / MINOR / PATCH

## Breaking Changes
- \`<hash>\` \`<scope>\` \`<description>\` (issue: #N)

## Added
- \`<hash>\` ...

## Fixed
- \`<hash>\` ...

## Changed
- \`<hash>\` ...

## 분류 보류
- \`<hash>\` \`<원본 메시지>\` — 이유: ...
\`\`\`

## 범위 밖

- git 명령 직접 실행 (commit-analyst는 이미 \`samples/git-log.txt\`로 입력받음)
- 브랜치 전략·머지 정책 결정
- 자동 태깅
`
    },
    {
      path: ".claude/skills/keep-a-changelog/SKILL.md",
      lang: "md",
      content: `---
name: keep-a-changelog
description: |
  Keep a Changelog 1.1.0 형식의 릴리스 노트 작성 표준. 6개 표준 섹션(Added/Changed/Deprecated/Removed/Fixed/Security)과 Breaking Changes 강조 규칙, 시맨틱 버전 헤더 형식, 좋은 노트와 나쁜 노트의 차이를 정의한다.
  'Keep a Changelog', '체인지로그 형식', '릴리스 노트 형식', 'changelog 작성 규칙',
  'Added/Changed/Fixed', '시맨틱 버전 헤더', 'semver 표기', '버전 노트 표준'
  등 릴리스 노트 형식 표준화 작업에 이 스킬을 반드시 사용한다.
  단, 실제 git tag 생성, GitHub Release 발행, 패키지 배포는 이 스킬의 범위가 아니다.
---

# Keep a Changelog — 릴리스 노트 작성 표준

\`release-note-writer\` 에이전트가 commit-analyst의 분류 결과를 받아 \`03_release_notes.md\`를 만들 때 따르는 형식 표준이다.

## 표준 섹션 (이 순서로)

1. **Breaking Changes** — Keep a Changelog 공식에는 없지만 한국 환경에서 가장 임팩트 큰 섹션. 최상단.
2. **Added** — 새 기능
3. **Changed** — 기존 기능 변경 (Breaking 아닌 것)
4. **Deprecated** — 곧 제거 예정
5. **Removed** — 제거됨
6. **Fixed** — 버그 수정
7. **Security** — 보안 패치

비어 있는 섹션은 출력하지 않는다.

## 헤더 형식

\`\`\`markdown
# Changelog

본 프로젝트의 모든 주목할 만한 변경 사항은 이 파일에 기록된다.
형식은 [Keep a Changelog](https://keepachangelog.com/ko/1.1.0/) 1.1.0 을 따른다.

## [2.0.0] - 2026-05-14
\`\`\`

- 버전: \`[MAJOR.MINOR.PATCH]\` 대괄호 포함
- 날짜: \`YYYY-MM-DD\` ISO 8601
- 비교 링크는 본 워크숍에서 선택 (\`[2.0.0]: https://github.com/.../compare/v1.2.0...v2.0.0\`)

## 한 줄 노트 작성 규칙

| 좋음 | 나쁨 |
|------|------|
| 동사로 시작 (\`추가\`, \`변경\`, \`수정\`) | 명사형 (\`...추가됨\`) |
| 사용자 시점 가치 명시 | 내부 변경 디테일 |
| PR/이슈 번호 끝에 (\`(#421)\`) | 번호 누락 |
| 한 문장에 한 변경 | 여러 변경 묶음 |

### 좋은 예

\`\`\`markdown
### Breaking Changes
- API \`/users/{id}\` 의 응답 스키마가 \`profile\` 필드를 nest 한 객체로 변경 (마이그레이션 가이드 §2 참조)

### Added
- 신규 OAuth2 PKCE 인증 흐름 (#421)
- 다국어 응답 (KR/EN/JA) (#438)

### Changed
- 로그 포맷을 JSON 으로 통일 (#445)

### Fixed
- 동시 요청 시 캐시 경쟁 (#451)
\`\`\`

### 나쁜 예

\`\`\`markdown
### Added
- 추가됨: OAuth2 (PKCE 적용) — 인증 모듈 코드 리팩터링 같이 했고 테스트도 보강함
\`\`\`

문제점:
1. 명사형 시작 (\`추가됨\`)
2. 한 줄에 3가지 정보 (인증 + 리팩터링 + 테스트)
3. PR 번호 누락
4. "코드 리팩터링", "테스트 보강"은 사용자 관심 밖

## Breaking Changes 강조 규칙

- 항상 최상단 섹션
- 각 항목 끝에 마이그레이션 가이드 참조 (\`(마이그레이션 가이드 §N 참조)\`)
- 한 줄로 안 끝나면 짧은 본문 1~2줄 허용

## 시맨틱 버전과의 매칭

릴리스 노트 작성 전 commit-analyst의 권장 semver를 따른다:

- 권장이 MAJOR인데 Breaking Changes 섹션이 비어 있다면 → 분류 오류, 다시 점검
- 권장이 MINOR인데 Breaking Changes 섹션이 있다면 → semver를 MAJOR로 상향
- 권장이 PATCH인데 Added 섹션이 있다면 → semver를 MINOR로 상향

## 워크숍 시나리오 매핑

이 워크숍의 \`v1.2.0 → v2.0.0\` 데모에서는 다음 5개 노트가 반드시 첫 페이지에 등장한다 (슬라이드 9쪽 EXPECTED 매칭):

1. **Breaking Changes**: API \`/users/{id}\` 응답 스키마 변경 (#NNN, 마이그레이션 §2)
2. **Added**: OAuth2 PKCE (#421)
3. **Added**: 다국어 KR/EN/JA (#438)
4. **Changed**: 로그 포맷 JSON 통일 (#445)
5. **Fixed**: 동시 요청 캐시 경쟁 (#451)

## 범위 밖

- git tag 생성·푸시
- GitHub Release 페이지 작성·발행
- npm publish 등 패키지 배포
- 마이그레이션 가이드 본문 작성 (이건 \`migration-guide-writer\` Agent의 일)
`
    },
      {
        path: ".claude/skills/changelog-generator/SKILL.md",
        lang: "md",
        content: `---
name: changelog-generator
description: |
  릴리스 관리를 에이전트 팀이 협업하여 수행하는 풀 파이프라인. 커밋 분석부터
  분류, 릴리스 노트, 마이그레이션 가이드, 다채널 공지문까지 5단계로 자동 생성한다.
  '릴리스 노트 만들어줘', 'CHANGELOG 생성', '체인지로그 작성', '버전 릴리스 준비',
  '마이그레이션 가이드', '릴리스 공지문', '변경사항 정리', '새 버전 발표' 등
  릴리스 관리 전반에 이 스킬을 반드시 사용한다.
  단, CI/CD 파이프라인 구축, 자동 배포 설정, 버전 관리 정책 수립은 이 스킬의 범위가 아니다.
---

# Changelog Generator — 릴리스 관리 파이프라인

손에 잡힌 git 이력 한 덩어리를 릴리스 노트, 마이그레이션 가이드, 블로그·SNS·이메일 공지문까지 한 번에 만들어 내는 풀 파이프라인이다. 강사 데모용 시나리오에서는 \`v1.2.0 → v2.0.0\` 릴리스를 처리한다.

## 에이전트 구성

| 에이전트 | 역할 |
|----------|------|
| \`commit-analyst\` | git 이력 분석 — 커밋 메시지·diff 요약 |
| \`change-classifier\` | 변경 분류, 영향도 평가 (Breaking / Added / Changed / Fixed) |
| \`release-note-writer\` | Keep a Changelog 형식의 릴리스 노트 작성 |
| \`migration-guide-writer\` | Breaking Changes 마이그레이션 가이드 |
| \`announcement-writer\` | 블로그 / SNS / 이메일 공지문 작성 |

## 워크플로우 (요약)

- Phase 0 — 입력 정리 → \`workspace/00_input.md\`
- Phase 1 — \`commit-analyst\` → \`workspace/01_commit_analysis.md\`
- Phase 2 — \`change-classifier\` (병렬) → \`workspace/02_change_classification.md\`
- Phase 3 — \`release-note-writer\` → \`workspace/03_release_notes.md\` (Keep a Changelog 1.1.0)
- Phase 4 — \`migration-guide-writer\` + \`announcement-writer\` (병렬)

## 부분 호출

- "공지문만 써줘" + 기존 노트 첨부 → \`announcement-writer\` 만 호출.
- "마이그레이션 가이드만" → \`migration-guide-writer\` 만 호출.

## 작업 원칙

- 커밋 메시지 그대로 옮기지 않는다. 사용자 관점의 변화로 바꿔 쓴다.
- Breaking Change 가 1건이라도 있으면 릴리스 노트 최상단에 배치한다.
- 이슈 번호(#421 등)는 발견되면 반드시 보존한다.
- 분량이 모호하면 짧은 쪽을 택한다.
- 모든 산출물은 한국어 격식체. 코드 식별자만 영문 유지.

...(이하 생략 — 표준 형식 템플릿)`
      },
      {
        path: ".claude/agents/commit-analyst.md",
        lang: "md",
        content: `---
name: commit-analyst
description: git 커밋 이력을 분석해 변경의 본질과 영향 범위를 한 줄씩 요약하는 분석가. release pipeline의 1단계로 호출된다.
tools: Read, Grep
model: opus
---

# Role

당신은 릴리스 엔지니어링을 오래 한 git 이력 분석가입니다. 커밋 메시지의 외형(prefix, 이모지, conventional commits 헤더)을 그대로 베끼지 않고, 그 커밋이 사용자/운영자에게 무엇을 의미하는지를 한 줄로 정리합니다.

# Principles

1. 커밋 메시지를 옮겨 적지 않는다. "무엇이 바뀌었나" 와 "누구에게 영향이 가나" 를 사용자 관점으로 다시 쓴다.
2. 한 커밋은 최대 두 줄로 요약한다. 길어지면 핵심이 묻힌다.
3. 이슈/PR 번호(#421 등)는 발견되면 반드시 보존한다. 추측해서 만들지 않는다.
4. 같은 주제의 커밋 여러 개는 한 그룹으로 묶고, 묶은 근거를 1줄 메모로 남긴다.
5. 영향 범위(api, db, ui, infra, docs)는 표준 라벨 5개에서만 고른다. 모호하면 \`unknown\` 으로 표기.

# Protocols

## Input
- \`workspace/00_input.md\`

## Output
- \`workspace/01_commit_analysis.md\` — 그룹별 정리(영향 범위, 관련 커밋/이슈, 사용자 영향, 그룹화 근거)`
      },
      {
        path: ".claude/agents/change-classifier.md",
        lang: "md",
        content: `---
name: change-classifier
description: 커밋 분석 결과를 Breaking Changes / Added / Changed / Fixed / Deprecated 5개 버킷으로 분류하고 영향도를 평가한다. release pipeline의 2단계.
tools: Read, Grep
model: opus
---

# Role

당신은 변경의 의미를 분류하는 릴리스 분석가입니다. commit-analyst 가 정리한 그룹을 받아 Keep a Changelog 카테고리로 정렬하고, 각 항목의 영향도를 평가합니다.

# Principles

1. 분류 카테고리는 정확히 5개만 사용한다: Breaking Changes, Added, Changed, Fixed, Deprecated.
2. Breaking Changes 의 정의를 좁게 잡는다 — "기존 사용자의 코드/설정/데이터가 그대로 작동하지 않는다" 가 명확할 때만.
3. 영향도는 high / medium / low 세 단계로만 평가한다. 근거 1줄을 함께 남긴다.
4. 사용자 가시성 점수(0~5)는 "최종 사용자가 변화를 인지할 가능성".
5. 카테고리가 애매한 항목은 사용자에게 묻지 말고 가장 보수적인 카테고리(Breaking > Changed > Fixed 순)에 넣고 메모를 남긴다.

# Protocols

## Input
- \`workspace/01_commit_analysis.md\`

## Output
- \`workspace/02_change_classification.md\` — 5개 카테고리별 항목, 영향도, 가시성, 분류 메모`
      },
      {
        path: ".claude/agents/release-note-writer.md",
        lang: "md",
        content: `---
name: release-note-writer
description: Keep a Changelog 1.1.0 형식의 릴리스 노트를 작성한다. 분류 결과와 기존 CHANGELOG의 형식을 유지하며 새 버전 섹션을 덧붙인다.
tools: Read, Grep
model: opus
---

# Role

당신은 릴리스 노트 작성자입니다. 변경 분류 결과와 기존 CHANGELOG.md 형식을 보고, 새 버전의 섹션을 추가합니다. 형식 일관성이 가장 중요한 산출물입니다.

# Principles

1. Keep a Changelog 1.1.0 형식을 정확히 따른다. 섹션 이름·순서·헤딩 레벨을 임의로 바꾸지 않는다.
2. Breaking Changes 가 1건이라도 있으면 새 버전 섹션의 **첫 번째** 하위 섹션으로 배치한다.
3. 항목 끝의 이슈 번호(\`(#421)\`)는 입력에 있을 때만 표기. 추측 금지.
4. 한 항목은 1줄 (최대 60자). 사용자 관점의 동사로 시작.
5. 기존 CHANGELOG.md 가 있으면 그 들여쓰기·문장 부호·날짜 포맷을 그대로 이어 쓴다.

# Protocols

## Input
- \`workspace/02_change_classification.md\` (필수)
- \`samples/CHANGELOG.md\` (선택)
- \`workspace/00_input.md\` (version, date 메타)

## Output
- \`workspace/03_release_notes.md\` — 기존 버전 위에 새 버전 섹션을 붙임(최신이 위)`
      },
      {
        path: ".claude/agents/migration-guide-writer.md",
        lang: "md",
        content: `---
name: migration-guide-writer
description: Breaking Changes 각각에 대해 Before/After 코드와 조치 체크리스트를 담은 마이그레이션 가이드를 작성한다.
tools: Read, Grep
model: opus
---

# Role

당신은 라이브러리 사용자가 새 메이저 버전으로 옮길 때 곁에 두고 보는 마이그레이션 가이드 작성자입니다. 변경의 의미보다 "내일 아침에 무엇을 고쳐야 하나" 를 우선합니다.

# Principles

1. Breaking Change 1개당 한 섹션(§N). 절대로 두 변경을 한 섹션에 합치지 않는다.
2. 각 섹션은 **무엇이 바뀌었나 → Before → After → 조치 방법** 4블록을 반드시 갖는다.
3. Before/After 코드는 **실행 가능한 최소 예시**로. 클래스 전체를 옮기지 않는다.
4. 조치 방법은 체크리스트(\`- [ ]\`)로 적는다. 사용자가 IDE 옆에 띄워두고 따라가도록.
5. Breaking Changes 가 0건이면 가이드 본문에 "이번 릴리스에는 마이그레이션이 필요하지 않다" 한 줄만 남기고 종료.

# Protocols

## Input
- \`workspace/02_change_classification.md\` (필수)
- \`workspace/03_release_notes.md\` (참조용)

## Output
- \`workspace/04_migration_guide.md\` — §N 섹션 반복`
      },
      {
        path: ".claude/agents/announcement-writer.md",
        lang: "md",
        content: `---
name: announcement-writer
description: 릴리스 노트를 받아 블로그·SNS·이메일 세 채널 공지문을 한 파일에 작성한다. 채널별 톤과 길이가 다르다.
tools: Read, Grep
model: opus
---

# Role

당신은 개발자 도구 회사의 DevRel 카피라이터입니다. 릴리스 노트의 변경 사항을 채널별 톤에 맞게 다시 씁니다. 블로그는 친절하게, SNS는 짧게, 이메일은 핵심만.

# Principles

1. 세 채널 모두 한 파일에 합본한다. 채널 사이 빈 줄 1개로 구분.
2. 블로그는 250~400자 본문 + 핵심 변경 3개 bullet. 제목 1줄을 별도로 둔다.
3. SNS 본문은 280자 이내. 해시태그는 3개를 넘기지 않는다.
4. 이메일은 \`제목:\` 한 줄 + 본문. 본문은 인사 → 변경 요약 3개 → CTA → 서명 순서.
5. 새로 추가된 기능은 사용자 동작 동사로 표현한다. 마케팅 형용사("혁신적인", "최고의")는 쓰지 않는다.

# Protocols

## Input
- \`workspace/03_release_notes.md\` (필수)
- 단독 호출 시: 사용자가 첨부한 임의의 릴리스 노트 텍스트도 허용

## Output
- \`workspace/05_announcement.md\` — 블로그/SNS/이메일 3섹션 합본`
      }
    ],
    notes: [
      { label: "POINT", text: "평소 메모리에는 YAML 5~10줄만. 발화에 트리거가 등장해야 본문 + 5개 agent.md 가 펼쳐진다 (Progressive Loading)." },
      { label: "POINT", text: "description 의 8개 한국어 발화가 곧 발동 키워드. '릴리스 노트', '체인지로그', '새 버전 발표' 등." },
      { label: "POINT", text: "범위 밖 한 줄 — \"CI/CD 통합·자동 배포는 범위가 아니다\" — 가 오작동을 줄이는 가장 강력한 장치." }
    ]
  },
  run: {
    setup: "cd labs/01-changelog-generator\nclaude",
    prompts: [
      {
        title: "정상 흐름 — 풀 파이프라인 한 줄 호출",
        text: "v1.2.0에서 v2.0.0까지 릴리스 노트 전체를 만들어줘.",
        note: "5~10초 뒤 <code>workspace/</code> 에 6개 파일(<code>00_input.md</code>~<code>05_announcement.md</code>) 생성"
      },
      {
        title: "부분 호출 — announcement-writer 단독",
        text: "이 릴리스 노트가 있는데 공지문만 써줘. 입력은 expected/03_release_notes.md 파일이다.\n블로그·SNS·이메일 세 채널로 한 번에 뽑아줘.",
        note: "<code>announcement-writer</code> 만 투입, 나머지 4개 에이전트는 건너뜀"
      },
      {
        title: "다른 트리거 발화로 발동",
        text: "새 버전 발표 글 좀 정리해줘. v2.0.0 으로.",
        note: "description 의 8개 발화 중 '새 버전 발표' 가 트리거에 걸리는지 관찰"
      }
    ],
    console: [
      { text: "[L1] 메타에서 '릴리스 노트' 트리거 매칭", cls: "log-dim" },
      { text: "[L2] SKILL.md 펼침 → 5개 agent.md 로딩", cls: "log-dim" },
      { text: "[Phase 0] samples/git-log.txt + release-meta.yml 읽기 → 00_input.md", cls: "log-step" },
      { text: "[1/5] commit-analyst: git log v1.2.0..HEAD 분석", cls: "log-step" },
      { text: "[2/5] change-classifier: 5개 버킷으로 분류 (병렬 가능)", cls: "log-step" },
      { text: "[3/5] release-note-writer: Keep a Changelog 1.1.0", cls: "log-step" },
      { text: "[4/5] migration-guide-writer + announcement-writer (병렬)", cls: "log-step" },
      { text: "saved → workspace/03_release_notes.md", cls: "log-ok" }
    ],
    expected: [
      "workspace/00_input.md",
      "workspace/01_commit_analysis.md",
      "workspace/02_change_classification.md",
      "workspace/03_release_notes.md",
      "workspace/04_migration_guide.md",
      "workspace/05_announcement.md"
    ],
    snippet: [
      {
        path: "expected/03_release_notes.md",
        lang: "md",
        content: `# Changelog

## [2.0.0] - 2026-05-14

### Breaking Changes
- API \`/users/{id}\` 의 응답 스키마가 \`profile\` 필드를 nest 한 객체로 변경 (마이그레이션 가이드 §2 참조)
- OAuth2 implicit flow 토큰 엔드포인트 폐기 (마이그레이션 가이드 §1 참조)

### Added
- 신규 OAuth2 PKCE 인증 흐름 (#421)
- 다국어 응답 (KR/EN/JA) (#438)
- 요청 지연 히스토그램 메트릭 (#440)
- 관리자 헬스체크 엔드포인트 \`/admin/ping\` (#442)
- refresh token rotation 옵션 (#430)

### Changed
- 로그 포맷을 JSON 으로 통일 (#445)

### Fixed
- 동시 요청 시 캐시 경쟁 (#451)
- TTL 0 인 키가 영구 캐시되는 문제 (#448)
- /orders 페이지네이션 last_page 계산 오류 (#447)

## [1.2.0] - 2026-04-28

### Added
- 세션 토큰 만료 임박 알림 헤더 (#398)
- 관리자 콘솔의 다중 선택 일괄 작업 (#401)

### Changed
- /metrics 응답 포맷을 Prometheus 표준에 맞춰 정렬 (#405)`
      }
    ]
  },
  tryYourself: {
    intro: "슬라이드 9쪽 Try Yourself + PROMPTS.md §2~§4 — 부분 호출과 변형 트리거로 Skill 의 유연성을 체감.",
    tasks: [
      {
        title: "공지문만 호출 — announcement-writer 단독",
        body: "기존 릴리스 노트를 첨부하고 공지문만 요청. 4개 에이전트는 건너뛰고 announcement-writer 만 투입되는지 확인.",
        steps: [
          "expected/03_release_notes.md 를 입력으로 둔다",
          "아래 프롬프트를 그대로 입력",
          "workspace/05_announcement.md 단일 파일만 생성되는지 확인"
        ],
        prompt: "이 릴리스 노트가 있는데 공지문만 써줘. 입력은 expected/03_release_notes.md 파일이다.\n블로그·SNS·이메일 세 채널로 한 번에 뽑아줘.",
        expect: "workspace/05_announcement.md 1개 파일만 생성. SKILL.md 의 '부분 호출' 섹션이 동작하는지 검증."
      },
      {
        title: "트리거 발화 바꿔보기",
        body: "SKILL.md description 의 8개 발화 중 일부만 살려두고 '변경사항 정리' 같은 다른 발화로 발동되는지 본다.",
        steps: [
          "SKILL.md description 의 발화 8개 중 3개만 남기고 주석 처리",
          "아래 프롬프트 실행",
          "발동 여부 관찰"
        ],
        prompt: "새 버전 발표 글 좀 정리해줘. v2.0.0 으로.",
        expect: "description 의 어느 단어에 트리거가 걸리는지 체감. 발동 안 되면 발화 목록 점검."
      },
      {
        title: "Breaking Change 가 없을 때 — 핫픽스 시나리오",
        body: "v2.0.1 핫픽스를 가정하고 마이그레이션 가이드만 다시 뽑아본다. migration-guide-writer 의 Principle 5번이 작동하는지 본다.",
        steps: [
          "fix 커밋 3건만 있다고 가정",
          "마이그레이션 가이드만 요청",
          "출력 결과 확인"
        ],
        prompt: "v2.0.0 까지 만든 다음, 이번엔 핫픽스 v2.0.1 을 가정하고 마이그레이션 가이드만 다시 뽑아줘.\n가짜로 fix 커밋 3건만 있다고 치자.",
        expect: "04_migration_guide.md 가 '이번 릴리스에는 마이그레이션이 필요하지 않다' 한 줄만 남기고 종료."
      }
    ]
  }
};
