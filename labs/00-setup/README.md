# LAB 00 — SETUP

> 슬라이드 3쪽 (SETUP) · 한 번만 깔아두면 8개 LAB이 굴러간다

## 사전 점검 (PRE-CHECK)

워크숍 시작 전 다음을 확인한다.

- [ ] 터미널에서 `claude` 명령이 동작한다 (Claude Code 설치 완료)
- [ ] 본인 PC에 빈 워크숍 폴더 하나가 있다 (예: `~/harness-lab/`)
- [ ] 편집기로 Markdown 파일을 만들 수 있다 (VS Code, Sublime, vim 등 무관)

## 폴더 구조 (PROJECT)

본 패키지의 `template/` 폴더는 슬라이드와 동일한 구조의 빈 템플릿이다.
수강생은 이 구조를 `~/harness-lab/`로 복사해도 되고, 각 Lab 폴더를 그대로 옮겨도 된다.

```
~/harness-lab/
├── .claude/
│   ├── agents/        # Agent 정의 (.md)
│   ├── skills/        # Skill 패키지
│   ├── hooks/         # 선택 — 별첨
│   └── settings.json  # 선택 — 별첨
├── workspace/         # LAB 중간 산출물
└── samples/           # LAB 별 입력 파일
```

## 플러그인 설치 (PLUGIN)

워크숍 슬라이드 기준의 정식 설치 명령:

```bash
# 마켓플레이스 등록 + 플러그인 설치
/plugin marketplace add revfactory/harness
/plugin install harness@harness

# 팀 모드 활성화 (LAB 03~08 에서 필요)
export CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1
```

> **로컬 실습 시**: 본 워크숍 패키지(`labs/`)는 플러그인 설치 없이도 동작한다. 각 Lab 폴더의 `.claude/`가 그대로 들어 있기 때문이다. 플러그인은 본인 프로젝트에 적용할 때 의미가 있다.

## 워크숍 진행 약속

- 모든 LAB은 한 폴더 안에서 **누적**된다.
- LAB 01의 Skill이 LAB 03의 파이프라인 안에서 다시 호출된다.
- 지우지 말고 쌓아 갈 것.

## 다음 단계

→ `labs/01-changelog-generator/` 로 이동
