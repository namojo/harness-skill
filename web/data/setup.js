window.HARNESS_DATA = window.HARNESS_DATA || {};
window.HARNESS_DATA["setup"] = {
  "sections": [
    {
      "title": "1. 사전 점검 (PRE-CHECK)",
      "desc": "워크숍 시작 전 다음을 확인한다. 터미널에서 claude 명령이 동작해야 하고, 워크숍용 빈 폴더 하나(~/harness-lab/)가 있어야 하며, 편집기로 Markdown 파일을 만들 수 있어야 한다."
    },
    {
      "title": "2. 폴더 구조 (PROJECT)",
      "desc": "모든 LAB은 이 폴더 안에서 누적된다. LAB 01의 스킬이 LAB 03의 파이프라인 안에서 다시 호출된다.",
      "code": "~/harness-lab/\n├── .claude/\n│   ├── agents/        # Agent 정의 (.md)\n│   ├── skills/        # Skill 패키지\n│   ├── hooks/         # 선택 — 별첨\n│   └── settings.json  # 선택 — 별첨\n├── workspace/         # LAB 중간 산출물\n└── samples/           # LAB 별 입력 파일",
      "lang": "shell",
      "callout": {
        "label": "지우지 말고 쌓아갈 것",
        "text": "8개 LAB은 누적된다. 한 폴더 안에 모든 산출물이 쌓이도록 진행한다."
      }
    },
    {
      "title": "3. 플러그인 설치 (PLUGIN · 한 번만)",
      "code": "# 마켓플레이스 등록 · 플러그인 설치\n/plugin marketplace add revfactory/harness\n/plugin install harness@harness\n\n# 팀 모드 활성화 (LAB 03~08 에서 필요)\nexport CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1",
      "lang": "shell",
      "callout": {
        "label": "로컬 실습 시 안내",
        "text": "본 워크숍 패키지(<code>labs/</code>)는 플러그인 설치 없이도 동작한다. 각 Lab 폴더의 <code>.claude/</code>가 그대로 들어 있기 때문이다. 플러그인은 본인 프로젝트에 적용할 때 의미가 있다."
      }
    }
  ]
};
