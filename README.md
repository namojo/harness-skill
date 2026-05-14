# Harness Meetup #2 — 워크숍 자료 패키지

> revfactory/harness 기반, 8개의 작은 팀을 직접 만들면서 **Skill·Agent·6가지 아키텍처 패턴**을 익히는 워크숍.

## 패키지 구성

```
agent-class/
├── harness_meetup2.pptx       # 원본 슬라이드
├── README.md                  # 이 문서
├── INSTRUCTOR_GUIDE.md        # 강사용 진행 시나리오 (슬라이드 ↔ 데모 매핑)
├── docs/
│   └── BUILD_SPEC.md          # Lab 빌드 공통 명세 (Builder 참고용)
├── labs/                      # 8개 Lab 실습 패키지
│   ├── 00-setup/              # 사전 준비, 폴더 템플릿
│   ├── 01-changelog-generator/  # Skill — Progressive Loading
│   ├── 02-interview-analyst/    # Agent — Role + I/O
│   ├── 03-blog-pipeline/        # Pattern 1: Pipeline (5 agents)
│   ├── 04-code-review-team/     # Pattern 2: Fan-out / Fan-in (4+1)
│   ├── 05-internal-helpdesk/    # Pattern 3: Expert Pool (router + 4)
│   ├── 06-andy-style-loop/      # Pattern 4: Producer-Reviewer (loop)
│   ├── 07-cs-supervisor/        # Pattern 5: Supervisor (dynamic)
│   └── 08-campaign-org/         # Pattern 6: Hierarchical (2-level)
└── web/                       # 인터랙티브 강의 사이트 (정적 HTML)
    ├── index.html             # 더블클릭으로 바로 열림
    ├── assets/
    └── data/
```

## 누구를 위한 자료인가

| 역할 | 사용법 |
|------|--------|
| **강사** | 슬라이드 발표 → 해당 Lab 폴더로 cd → Claude Code 띄우고 `PROMPTS.md`의 프롬프트 시연. 동시에 `web/index.html`을 보조 화면으로. |
| **수강생 (실습 중)** | 각 Lab 폴더를 본인 PC `~/harness-lab/`로 복사. `claude` 실행 후 `PROMPTS.md` 따라 입력. |
| **수강생 (복습)** | `web/index.html`을 브라우저로 열어 이론·코드·실행 흐름을 한 화면에 다시 본다. |

## 빠른 시작 (강사)

```powershell
# 1) 슬라이드 발표 시작 (PowerPoint로 harness_meetup2.pptx 열기)

# 2) 보조 화면에 인터랙티브 사이트 띄우기
start web/index.html

# 3) LAB 01 데모 시점이 되면
cd labs/01-changelog-generator
claude
# > Claude Code 안에서 PROMPTS.md의 첫 프롬프트 붙여넣기
```

## 빠른 시작 (수강생)

```powershell
# 본인 PC에 워크숍 폴더 만들기
mkdir ~/harness-lab
cd ~/harness-lab

# 강사가 공유한 labs/ 폴더에서 원하는 Lab을 복사
# 예: LAB 02만 따라하고 싶을 때
xcopy /E /I <강사가 준 경로>/labs/02-interview-analyst .

# Claude Code 실행 + PROMPTS.md의 첫 프롬프트
claude
```

## Lab 간 누적 흐름

각 Lab은 독립 폴더지만, 슬라이드 메시지대로 **앞 Lab의 산출물이 뒤 Lab의 입력**으로 이어진다.

```
LAB 02 인사이트  ──┐
                   ├─→ LAB 03 블로그 자동화
LAB 03 transcript ─┘
                   └─→ LAB 06 앤디 스타일 다듬기 (LAB 03의 post.md 사용)
```

각 Lab `samples/` 최상단에 `> 출처: Lab 0X expected/...` 코멘트로 명시.

## 산출물 통계

- **Lab 자료**: 약 200개 파일 (8개 독립 패키지)
  - 오케스트레이터 Skill 8개 + 도메인 Skill 22개 = **총 30개 Skill**
  - **38개 Agent** (각각 `## 사용하는 Skill` 섹션 명시)
  - samples · expected · README · PROMPTS + mock HTML 5개
- **워크숍 메타 하네스**: `.claude/agents/`에 빌더 정의 5개 + `.claude/skills/workshop-builder/`
- **웹사이트**: 20개 파일 (HTML/CSS/JS + 8개 Lab 데이터 + 6개 패턴 SVG)
- **공통 문서**: README, INSTRUCTOR_GUIDE, BUILD_SPEC

### Skill ↔ Agent 분리 구조

8개 Lab 모두 슬라이드 6쪽의 메시지("Skill = 어떻게, Agent = 누가")를 따른다.
- 오케스트레이터 Skill 1개가 Lab 전체 흐름을 선언 (8개)
- 각 도메인 Agent가 자기 작업을 할 때 도메인 Skill을 발동 (22개 도메인 Skill)
- 각 Agent .md 파일 끝에 `## 사용하는 Skill` 섹션으로 명시적 연결

## 의존성

- **Claude Code** (CLI) — 모든 Lab 실행에 필요
- **PowerPoint** — 슬라이드 발표
- **모던 브라우저** — `web/index.html` 열기 (Chrome/Edge/Firefox 권장)
- Lab 03 transcript-agent만 음성 파일을 다루지만, 실제 데모는 사전 추출된 텍스트 샘플로 진행 (음성 모델 호출 X)

## 진행 시간 가이드

| 섹션 | 분 |
|------|-----|
| Setup (슬라이드 3쪽) | 10 |
| LAB 01 Skill | 25 |
| LAB 02 Agent | 25 |
| LAB 03 Pipeline | 30 |
| LAB 04 Fan-out | 25 |
| LAB 05 Expert Pool | 25 |
| LAB 06 Producer-Reviewer | 25 |
| LAB 07 Supervisor | 25 |
| LAB 08 Hierarchical | 25 |
| RECAP + Q&A | 15 |
| **합계** | **약 230분 (4시간 + 휴식)** |

## 라이선스·출처

- 콘텐츠 베이스: github.com/revfactory/harness
- 워크숍 슬라이드: `harness_meetup2.pptx` (별도 제공)
