window.HARNESS_DATA = window.HARNESS_DATA || {};
window.HARNESS_DATA["deep-dive"] = {
  "concepts": [
    {
      "title": "필수 개념 1/3 · Skill의 YAML 프론트매터가 곧 트리거다",
      "subtitle": "harness-100/21-code-reviewer · 실제 SKILL.md의 맨 위",
      "code": "---\nname: code-reviewer\ndescription: \"코드 리뷰 자동화 풀 파이프라인.\n  스타일→보안→성능→아키텍처 4 영역을\n  에이전트 팀이 협업하여 체계적으로 리뷰한다.\n  '코드 리뷰해줘', '이 코드 봐줘', '코드 검토',\n  'PR 리뷰', '보안 리뷰', '성능 리뷰' 등\n  코드 리뷰 전반에 이 스킬을 사용한다.\n  단, 실제 CI/CD 통합, 자동 수정, Git 커밋/머지는 이 스킬의 범위가 아니다.\"\n---\n# Code Reviewer — 코드 리뷰 자동화 파이프라인\n...",
      "lang": "yaml",
      "points": [
        {
          "label": "NAME",
          "title": "파일명·디렉터리명과 일치",
          "text": "호출 시 ID로 쓰인다. kebab-case 사용."
        },
        {
          "label": "DESCRIPTION",
          "title": "언제 발동하는지 — 트리거 발화 4–8개",
          "text": "구체적인 한국어 발화 예시를 나열한다. 범위 밖('CI/CD 통합 안 함')도 함께 명시해 오작동을 줄인다."
        },
        {
          "label": "TOOLS",
          "title": "이 스킬이 쓰는 도구 화이트리스트",
          "text": "좁힐수록 환각이 줄어든다. 정말 필요한 것만 노출한다."
        },
        {
          "label": "★ EFFICIENCY",
          "title": "평소엔 이 YAML 5–10줄만 로딩",
          "text": "발화에 트리거 표현이 등장해야 본문 SKILL.md가 펼쳐진다. 컨텍스트가 절약되는 핵심."
        }
      ]
    },
    {
      "title": "필수 개념 2/3 · 왜 Skill인가 — 한 번에 다 펼치지 않기",
      "subtitle": "CONTEXT MATH · Progressive Disclosure",
      "points": [
        {
          "label": "WITHOUT",
          "title": "매번 프롬프트에 박는다",
          "text": "\"OWASP Top 10 기준으로 SQL 인젝션, XSS, 하드코딩 시크릿, 의존성 CVE를 보고, 위험도는 CVSS와 악용 가능성을 함께 고려하고, 안전한 대안 코드를 반드시 같이 제시하고…\" 입력 토큰 ≈ 1,200. 매번 까먹을 확률 높음. 결과 일관성 흔들림."
        },
        {
          "label": "WITH",
          "title": "Progressive Disclosure",
          "text": "평소: YAML 5–10줄만 메모리에. \"보안 리뷰\" 발화 → SKILL.md 본문이 펼쳐짐. 더 깊이가 필요할 때 vulnerability-patterns/ 확장 스킬이 추가 로딩. 평소 토큰 ≈ 50. 결과 일관성 선언적·재현 가능."
        }
      ],
      "callout": "3단 로딩 ─ L1 메타데이터(항상) → L2 본문(트리거 시) → L3 references/, scripts/(본문이 참조할 때만)"
    },
    {
      "title": "필수 개념 3/3 · Agent의 네 개 설정이 변덕을 잡는다",
      "subtitle": "WHY 4 SECTIONS · security-analyst.md (발췌)",
      "code": "---\nname: security-analyst\ndescription: \"코드 보안 분석가. OWASP Top 10, 인젝션 취약점,\n  인증/인가 결함, 민감 데이터 노출, 안전하지 않은 직렬화,\n  의존성 취약점을 분석한다.\"\n---\n# Security Analyst — 코드 보안 분석가\n\n## 핵심 역할\n# ← Role\n1. 인젝션 분석 (SQL/XSS/Command/LDAP)\n2. 인증·인가 검사 (하드코딩 자격증명, 약한 해시…)\n3. 데이터 보호 (민감 로깅, 평문 저장…)\n4. 의존성 취약점 (CVE, 오래된 패키지)\n5. 암호화 검사\n\n## 작업 원칙\n# ← Principles\n- OWASP Top 10 프레임워크로 체계 분석\n- 위험도 기반 우선순위 (CVSS + 악용 가능성)\n- 오탐 최소화 — 이론적 위험은 참고로 분류\n- 안전한 대안 반드시 함께 제공\n- 공격 시나리오를 공격자 관점에서 설명",
      "lang": "yaml",
      "points": [
        {
          "label": "ROLE",
          "title": "당신은 누구인가",
          "text": "호출될 때마다 동일한 정체성. 흔들리지 않는 페르소나."
        },
        {
          "label": "PRINCIPLES",
          "title": "작업 시 따르는 5가지 안팎 규칙",
          "text": "변덕 차단의 핵심. 같은 입력으로 두 번 호출해도 같은 깊이의 답이 나오게 한다."
        },
        {
          "label": "I/O PROTOCOL",
          "title": "입력 형식·출력 포맷",
          "text": "팀원 간 인터페이스 계약. Pipeline·Fan-out 패턴의 기반."
        },
        {
          "label": "TOOLS",
          "title": "Read·Grep만, Bash·Write 제외",
          "text": "역할 밖 행동 차단. 분석 에이전트가 파일을 함부로 쓰지 않도록."
        }
      ],
      "callout": "같은 모델이라도, 이 네 칸을 채운 페르소나로 호출하면 매번 같은 사람이 응답한다."
    }
  ]
};
