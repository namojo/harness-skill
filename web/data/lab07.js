window.HARNESS_DATA = window.HARNESS_DATA || {};
window.HARNESS_DATA["lab07"] = {
  diagram: "pattern-5-supervisor.svg",
  diagramCaption: "다음 단계가 앞 결과에 따라 달라진다 · 매니저 패턴",
  scenario: {
    intro: "고객 CS 메시지 한 줄을 받아 supervisor 가 의도를 해석하고, 앞 워커의 결과를 보고 다음 워커를 결정한다. Pipeline 처럼 순서가 미리 박혀 있지 않다 — 매번 다른 흐름이 나오는 게 핵심.",
    boxes: [
      {
        label: "A",
        title: "Pipeline 과의 결정적 차이",
        body: `<table class="compare-table">
<thead><tr><th></th><th>PIPELINE (LAB 03)</th><th>SUPERVISOR (LAB 07)</th></tr></thead>
<tbody>
<tr><th>순서</th><td>설계 시 고정</td><td>실행 중 결정</td></tr>
<tr><th>다음 단계</th><td>항상 같음</td><td>앞 결과를 보고 판단</td></tr>
<tr><th>비유</th><td>컨베이어 벨트</td><td>매니저</td></tr>
</tbody></table>`,
        warn: false
      },
      {
        label: "WHY",
        title: "왜 Supervisor 인가",
        body: "분기가 데이터에 따라 달라지는 일은 코드로 if/else 박아도 되지만, 의도가 모호하거나 워커 결과에 근거를 둬야 할 때 supervisor 가 진가를 발휘한다. <code>tech-worker</code> 가 \"결함 확정\" 이라고 답해야 <code>refund-worker</code> 가 호출되는 식.",
        warn: false
      },
      {
        label: "함정",
        title: "fan-out 으로 빠지지 않게",
        body: "supervisor 가 분기를 \"안 하고\" 모든 워커에 fan-out 하면 그것은 Pipeline 도 Supervisor 도 아닌 그냥 낭비. Principles 2 번 (\"호출할 수도, 안 할 수도 있다\") 을 강조해 분기 결정을 강제할 것.",
        warn: true
      }
    ],
    principles: [
      "의도가 2 개 이상 보이면, 우선순위가 높은 것 (CS 등급표) 부터 처리한다.",
      "tech 워커 결과에 따라 refund 를 호출할 수도, 안 할 수도 있다.",
      "모든 분기 결정은 한 줄 근거와 함께 workspace/log.jsonl 에 기록한다."
    ],
    points: [
      "인입 CS 메시지의 의도가 환불이면 refund-worker, 로그인 오류면 tech-worker, 계정 복구면 account-worker 가 호출된다. supervisor 가 매번 다른 결정을 내린다.",
      "CS 등급표 (tech > refund > account > general) — 복합 의도일 때 어느 워커부터 부를지 결정하는 우선순위 룰",
      "분기 결정은 모두 log.jsonl 에 한 줄 근거와 함께 기록 — 사후 감사 가능"
    ]
  },
  build: {
    intro: "Skill 파일 1 개 + Agent 파일 6 개 (supervisor + 4 워커 + composer + handoff). 호출 순서는 코드에 박지 않는다 — supervisor 의 Principles 3 줄이 동적 결정의 룰북.",
    files: [
    {
      path: ".claude/skills/tech-diagnosis/SKILL.md",
      lang: "md",
      content: `---
name: tech-diagnosis
description: |
  제품 결함·기술 문제 진단 체크리스트. 하드웨어 결함·소프트웨어 오류·사용자 오인 케이스를 구분하고, 환불 사유로 인정되는 결함 vs 사용자 책임 사유를 정의한다.
  '제품 결함 진단', '기술 문제 분석', '하드웨어 결함 확인', '소프트웨어 오류',
  '제품 진단 체크리스트', '결함 vs 사용자 오인', '반품 사유 판단', '품질 이슈 분석'
  등 CS 케이스의 기술 진단 작업에 이 스킬을 반드시 사용한다.
  단, 실제 제품 수리, 부품 교체, 펌웨어 업데이트 발행은 이 스킬의 범위가 아니다.
---

# Tech Diagnosis — 제품 결함 진단 체크리스트

\`tech-worker\` 에이전트가 CS 케이스에서 제품 결함 여부를 판정할 때 따르는 표준이다. 슬라이드 22쪽의 "헤드폰 한쪽이 안 들림" 같은 케이스를 다룬다.

## 진단 3단계

\`\`\`
1. 증상 분류 → 하드웨어 / 소프트웨어 / 사용자 / 환경
                ↓
2. 결함 가능성 등급 → Confirmed / Likely / Possible / Unlikely
                ↓
3. 후속 조치 → 반품 권장 / 교환 / A/S / 자가 해결 / 환경 점검
\`\`\`

## 증상 분류 표

| 분류 | 신호 | 예시 |
|------|------|------|
| **하드웨어** | 물리 손상·동작 불가·간헐 동작 | 한쪽 안 들림, 충전 안 됨, 액정 멍 |
| **소프트웨어** | 펌웨어·앱 오류·페어링 실패 | 블루투스 연결 끊김, 앱 크래시 |
| **사용자 오인** | 설명서 미숙지·설정 누락 | 음량 0, 모노 모드, 좌우 채널 반전 |
| **환경** | 외부 요인 | 와이파이 약함, 근거리 간섭, 케이블 |

## 결함 가능성 등급

| 등급 | 의미 | 후속 조치 |
|------|------|----------|
| **Confirmed** | 명백한 결함 (한쪽 출력 0, 충전 0) | **반품 권장**, 환불 근거 인정 |
| **Likely** | 결함 가능성 높음 (간헐적, 재현 가능) | 교환 권장 + 본사 분석 |
| **Possible** | 결함 + 사용자 요인 혼재 | A/S 진단 후 결정 |
| **Unlikely** | 사용자 오인·환경 추정 | 자가 해결 가이드 |

## 진단 체크리스트 (헤드폰 사례)

\`\`\`
증상: "3일 전 주문한 헤드폰이 한쪽이 안 들려요."

질문 트리:
□ 양쪽 모두 페어링 됨? (한쪽만 페어링 → 사용자/환경)
□ 다른 기기에서도 한쪽 안 들림? (예 → 하드웨어)
□ 좌우 채널 반전 시 같은 쪽 안 들림? (예 → 하드웨어)
□ 음량 모드 / 모노 설정 확인? (모노 모드 → 사용자 오인)
□ 케이블 헤드폰이면 다른 케이블 테스트?

진단 결과 예:
- 다른 기기에서도 한쪽 안 들림 + 채널 반전해도 같은 쪽 무음
→ "Confirmed" 하드웨어 결함, 반품 권장
\`\`\`

## 표준 출력 형식

\`tech-worker\` 산출물 \`_workspace/tech_diagnosis.json\`:

\`\`\`json
{
  "case_id": "case-01",
  "symptoms": ["한쪽 출력 없음"],
  "category": "hardware",
  "confidence": "Confirmed",
  "evidence": [
    "다른 기기에서도 재현",
    "채널 반전 시 같은 쪽 무음"
  ],
  "next_action": "refund_recommended",
  "reasoning": "양쪽 동일 페어링 + 채널 반전 무영향 → 출력 회로 결함 추정"
}
\`\`\`

\`next_action\` 가능 값:
- \`refund_recommended\` — supervisor가 refund-worker 호출 트리거
- \`exchange_recommended\` — 교환 권장
- \`as_recommended\` — A/S 센터 안내
- \`self_help\` — 자가 해결 가이드 (사용자 오인)
- \`escalate\` — 본사 기술팀

## 워크숍 case-01 매핑

슬라इ드 22쪽 시나리오의 정답 흐름:

\`\`\`
case-01: "3일 전 주문한 헤드폰이 한쪽이 안 들려요."
→ tech-worker 진단
  → category: hardware, confidence: Confirmed
  → next_action: refund_recommended
  → supervisor가 이 결과 보고 refund-worker 호출 분기
\`\`\`

## 좋은 vs 나쁜 진단

| 좋음 | 나쁨 |
|------|------|
| 체크리스트 단계별 확인 | "결함입니다" 즉답 |
| 증거 (재현·반전 테스트) 기록 | 추측만 |
| 신뢰도 등급 표기 | 단정 |
| next_action을 명확한 enum으로 | 자유 텍스트 |

## 자가 해결 가이드 (Unlikely 케이스)

증상이 사용자 오인으로 추정될 때 응답:

\`\`\`text
다음 단계를 시도해 주세요:
1. 음량이 0이 아닌지 확인
2. 좌우 채널 설정 (설정 → 사운드 → 균형) 중앙 정렬
3. 모노 출력 모드 OFF
4. 페어링 초기화 후 재연결

그래도 안 되면 다시 알려 주세요. A/S로 안내드릴게요.
\`\`\`

## 범위 밖

- 실제 수리 / 부품 교체
- 펌웨어 업데이트 발행
- 품질관리 / 양산 결함 추적 (그건 본사 QA)
- 의료기기 등 특수 안전 진단
`
    },
    {
      path: ".claude/skills/refund-policy/SKILL.md",
      lang: "md",
      content: `---
name: refund-policy
description: |
  환불 처리 정책 표준. 환불 사유 분류(결함·단순 변심·배송 문제), 환불 가능 기간, 환불 금액 산정 규칙(전액·부분·배송비 부담)을 정의한다.
  '환불 정책', '반품 처리', '환불 사유 분류', '환불 가능 기간', '단순 변심 환불',
  '제품 결함 환불', '환불 금액 산정', '반품 배송비'
  등 환불 처리 작업에 이 스킬을 반드시 사용한다.
  단, 실제 결제 취소 시스템 조작, PG사 환불 API 호출, 회계 정산 처리는 이 스킬의 범위가 아니다.
---

# Refund Policy — 환불 처리 표준

\`refund-worker\` 에이전트가 supervisor의 호출을 받아 환불을 처리할 때 따르는 정책 표준이다.

## 환불 사유 분류

| 사유 | 환불율 | 배송비 부담 | 가능 기간 |
|------|--------|------------|----------|
| **제품 결함 (Confirmed)** | 100% | 회사 | 수령 후 30일 |
| **제품 결함 (Likely)** | 100% (분석 후) | 회사 | 수령 후 30일 |
| **배송 문제 (파손/오배송)** | 100% | 회사 | 수령 후 14일 |
| **단순 변심 (개봉 전)** | 100% | 사용자 | 수령 후 7일 (전자상거래법 §17) |
| **단순 변심 (개봉 후)** | 90~100% | 사용자 | 수령 후 7일, 재판매 가능 시 |
| **단순 변심 (사용 흔적)** | 50~80% | 사용자 | 케이스별 협의 |

## 환불 가능 기간

\`\`\`
[제품 결함]              [단순 변심]
수령 ─── 14일 ─── 30일   수령 ─── 7일
       ↑           ↑          ↑
       배송 문제    결함 환불    변심 환불
\`\`\`

기간 초과 시 환불 거절 가능 (단, 명백한 안전 위험·치명 결함은 예외).

## 워크숍 case-01 매핑

\`\`\`
case: "3일 전 주문한 헤드폰이 한쪽이 안 들려요."
tech-worker 결과: Confirmed 하드웨어 결함

→ refund-worker 적용:
  - 사유: 제품 결함 (Confirmed)
  - 환불율: 100%
  - 배송비: 회사 부담
  - 기간: 3일 (30일 이내, OK)
  - 결정: 환불 승인
\`\`\`

## 환불 처리 흐름

1. **사유 분류** (tech-worker 결과 또는 케이스 본문에서)
2. **기간 점검** (수령일·구매일 기준)
3. **환불 금액 산정** (상품가 + 부담 결정된 배송비)
4. **추가 보상 검토** (반복 결함·심각도)
5. **사과문 첨부** (apology-template Skill 발동)
6. **결제 채널 분기** (카드·계좌·포인트)

## 표준 출력 형식

\`refund-worker\` 산출물 \`_workspace/refund_decision.json\`:

\`\`\`json
{
  "case_id": "case-01",
  "refund_reason": "product_defect_confirmed",
  "refund_amount": {
    "product": 89000,
    "shipping_refund": 3000,
    "additional_compensation": 0
  },
  "shipping_cost_bearer": "company",
  "within_period": true,
  "approval_status": "approved",
  "payment_channel": "original",
  "apology_required": true,
  "estimated_days": 3,
  "notes": "tech-worker 진단: Confirmed 하드웨어 결함"
}
\`\`\`

## 추가 보상 가이드

| 케이스 | 추가 보상 |
|--------|----------|
| 동일 주문 결함 2회+ | 다음 구매 10% 할인 쿠폰 |
| 안전 위험 케이스 | 상품가 100% + 위로금 |
| 사용자 입원·의료 비용 | 법무팀(legal-expert) 핸드오프 |
| 회사 명백한 과실 (오배송 2회+) | 사과문 + 쿠폰 + 무료 재배송 |

## 결제 채널 분기

- **신용카드** → PG사 API로 부분/전액 취소 (영업일 3~5일)
- **계좌이체** → 계좌 환급 (영업일 1~2일)
- **포인트** → 즉시 환급 (당일)
- **혼합 결제** → 사용자에게 환급 채널 선택 안내

## 분기 결정 (refund-worker → supervisor 보고)

refund-worker 처리 후 supervisor에게 다음을 보고:

- \`approved\` — supervisor가 response-composer로 진행
- \`partial_only\` — 부분 환불 사유와 함께 보고
- \`denied\` — 거절 사유 + 사용자 안내 메시지 제안
- \`escalate\` — 추가 보상·법적 검토 필요 (human-handoff)

## 좋은 vs 나쁜 처리

| 좋음 | 나쁨 |
|------|------|
| tech-worker 결과 인용 | 결함 여부 자체 판단 (중복) |
| 기간·금액 명시 | 모호한 약속 ("최대한 빨리") |
| 채널 + 일수 안내 | 채널 안내 없음 |
| 사과문 첨부 (결함 케이스) | 무미건조한 결정 통보 |

## 나쁜 예 (실패 응답)

\`\`\`text
"환불 가능합니다. 처리하겠습니다."
\`\`\`

문제:
- 금액 미명시
- 일수 미명시
- 채널 안내 없음
- 사과 없음

## 좋은 예 (성공 응답)

\`\`\`text
헤드폰 결함으로 인한 불편 진심으로 사과드립니다 (apology-template 발동 결과).

환불 처리 안내:
- 환불 금액: 89,000원 (상품가) + 3,000원 (배송비) = 92,000원
- 결제 채널: 원 결제 카드로 부분 취소
- 처리 기간: 영업일 3~5일

반품 송장은 별도 메시지로 발송됩니다. 추가 문의 사항이 있으시면 답장 주세요.
\`\`\`

## 범위 밖

- 실제 결제 취소 (PG사 API 호출)
- 회계 결산 처리
- 환불 통계 분석
- 환불 정책 자체 개정
`
    },
    {
      path: ".claude/skills/account-recovery/SKILL.md",
      lang: "md",
      content: `---
name: account-recovery
description: |
  계정 복구 플레이북. 로그인 실패·계정 잠김·비밀번호 재설정·OTP 미수신·계정 탈취 의심 케이스를 분류하고, 자가 해결 단계와 보안 위험 분기 규칙을 정의한다.
  '계정 복구', '로그인 실패', '계정 잠김 해결', '비밀번호 재설정', 'OTP 미수신',
  '계정 탈취 의심', '본인 확인 절차', 'login recovery'
  등 계정 관련 CS 케이스 작업에 이 스킬을 반드시 사용한다.
  단, 실제 계정 데이터 수정, 비밀번호 직접 변경, 본인인증 시스템 호출은 이 스킬의 범위가 아니다.
---

# Account Recovery — 계정 복구 플레이북

\`account-worker\` 에이전트가 supervisor의 호출로 로그인·계정 관련 CS 케이스를 처리할 때 따르는 표준이다.

## 케이스 분류

| 케이스 | 신호 | 위험도 | 자가 해결? |
|--------|------|--------|----------|
| **단순 비밀번호 분실** | "비밀번호를 잊었다" | 낮음 | 셀프 재설정 안내 |
| **계정 잠김** | "5회 실패로 잠겼다" | 낮음 | 30분 대기 + 재시도 |
| **OTP 미수신** | "OTP가 안 온다" | 낮음 | 수신 채널 확인·재발송 |
| **모든 인증 수단 분실** | "이메일·전화 다 못 씀" | 중간 | 본인 확인 + 본사 처리 |
| **계정 탈취 의심** | "모르는 로그인 알림이 옴" | **높음** | 즉시 차단 + 보안팀 |

## 단순 비밀번호 분실 — 자가 해결

\`\`\`text
다음 단계로 직접 재설정 가능합니다:

1. 로그인 화면 → "비밀번호 찾기"
2. 등록 이메일 또는 휴대폰 입력
3. 인증코드 수신 → 입력
4. 새 비밀번호 설정 (8자 이상, 영문+숫자+특수문자)

이메일이 안 오면:
- 스팸함 확인
- 등록 이메일 주소 변경 가능성 (이전에 가입 시 사용한 메일?)
- 그래도 안 되면 본인 확인 절차로 안내드릴게요.
\`\`\`

## 계정 잠김 — 자가 해결

\`\`\`text
5회 연속 로그인 실패 시 30분 자동 잠금됩니다 (보안 정책).

해결 방법:
1. 30분 후 재시도
2. 30분 안에 풀어야 한다면, 비밀번호 재설정으로 우회
3. 잠김이 반복되면 (하루 3회+) 계정 탈취 시도 가능성 → 보안팀 안내
\`\`\`

## OTP 미수신 — 자가 해결

\`\`\`text
1. SMS의 경우: 통신사 메시지 차단 / 해외 로밍 점검
2. 앱(예: Authenticator)의 경우: 앱 시간 동기화 (설정 → 시간 동기화)
3. 이메일 OTP: 스팸함 / 첨부파일 차단 정책 확인

위 단계 후에도 안 오면 등록된 OTP 채널 재확인 → 본사 처리 필요.
\`\`\`

## 모든 인증 수단 분실 — 본인 확인 + 본사 처리

\`\`\`text
등록된 이메일·전화 모두 사용 불가하면 본인 확인 절차가 필요합니다:

1. 신분증 사본 제출 (포털 → 본인확인)
2. 가입 시 정보 (가입 일자, 마지막 로그인 위치 등) 확인 질문
3. 본사 검토 (영업일 1~2일)

본인 확인 완료 후 새 이메일·전화로 등록 변경 + 비밀번호 재설정.
\`\`\`

## ★ 계정 탈취 의심 — 즉시 차단 (최우선)

다음 신호가 하나라도 있으면 **자가 해결 안내 금지, 즉시 계정 차단 + 보안팀 호출**:

1. 모르는 위치·시간에 로그인 성공 알림이 옴
2. 가입 정보가 변경됨 (이메일·전화·이름)
3. 결제 내역이 모름
4. 메일이 외부 주소로 자동 전달되도록 설정됨
5. 비밀번호 재설정 메일이 사용자가 신청하지 않았는데 옴

**응답 (1순위)**:
\`\`\`text
계정 탈취 의심 신호가 감지됐습니다.

지금 즉시:
1. 비밀번호 재설정 (다른 안전한 기기에서)
2. 2단계 인증 활성화
3. 가입 정보 (이메일·전화·이름) 변경 여부 확인
4. 결제 수단 사용 내역 점검

이 케이스는 보안팀이 별도로 점검합니다. 추가 정보가 필요하면 보안팀에서 직접 연락드립니다.

긴급 시: 보안센터 02-XXX-XXXX
\`\`\`

## 표준 출력 형식

\`account-worker\` 산출물 \`_workspace/account_action.json\`:

\`\`\`json
{
  "case_id": "case-02",
  "category": "login_failure",
  "risk": "low",
  "self_help_steps": [...],
  "needs_identity_verification": false,
  "needs_security_escalation": false,
  "estimated_resolution": "minutes",
  "next_action": "user_self_recovery"
}
\`\`\`

\`next_action\` 값:
- \`user_self_recovery\` — 사용자 셀프 해결 안내
- \`identity_verification\` — 본인 확인 절차 진행
- \`security_lock\` — 즉시 계정 잠금 + 보안팀
- \`escalate\` — human-handoff (의료·법적 사안 등)

## 본인 확인 질문 카탈로그

본인 확인 시 다음 중 2~3가지 일치해야 통과:

- 가입 일자 (월 단위)
- 마지막 로그인 위치 (도시 단위)
- 최근 결제·구매 내역 (제품·금액 일부)
- 등록 주소 (우편번호)
- 보안 질문 (가입 시 설정한 경우)

## 좋은 vs 나쁜 처리

| 좋음 | 나쁨 |
|------|------|
| 케이스 분류 명시 | "비밀번호 재설정하세요" 일괄 |
| 위험도에 맞춘 절차 | 모든 케이스에 같은 응답 |
| 탈취 신호 시 즉시 차단 우선 | 자가 해결만 안내 |
| 본사 처리 일수 명시 | 모호한 약속 |

## 범위 밖

- 실제 계정 데이터 수정·삭제
- 비밀번호 직접 변경
- 본인인증 시스템 호출 (외부 API)
- 형사 신고·법적 대응 (legal-expert 영역)
`
    },
    {
      path: ".claude/skills/apology-template/SKILL.md",
      lang: "md",
      content: `---
name: apology-template
description: |
  CS 응답에서 사용하는 사과문 작성 표준. 사과 강도 4단계(공감·확인·진심·공식), 책임 인정 vs 회피 어법, 후속 조치 명시 규칙을 정의한다. response-composer가 최종 응답을 합성할 때 발동.
  '사과문 작성', 'CS 사과 표현', '책임 인정 어법', '고객 응답 톤', '사과 강도 결정',
  '공식 사과문', '진심 어린 사과', 'apology composition'
  등 CS 응답의 사과·공감 작성 작업에 이 스킬을 반드시 사용한다.
  단, 실제 보상 금액 결정, 법적 책임 인정 문서 작성, 외부 PR 입장문 발행은 이 스킬의 범위가 아니다.
---

# Apology Template — CS 사과문 표준

\`response-composer\` 에이전트가 워커들의 결과를 받아 사용자에게 보낼 최종 응답을 합성할 때, 사과·공감 부분의 톤과 형식을 정한다.

## 사과 강도 4단계

| 강도 | 케이스 | 표현 |
|------|--------|------|
| **1. 공감** | 사용자 오인·환경 문제 | "불편함을 느끼셨겠어요." |
| **2. 확인** | 회사 가능성 일부 | "제품에 문제가 있을 수 있다는 점, 같이 살펴보겠습니다." |
| **3. 진심** | 회사 명백 결함 | "결함 제품을 받으시게 해서 정말 죄송합니다." |
| **4. 공식** | 안전 위험·반복 사고 | "이번 일로 불편을 드린 점, 회사를 대표해 깊이 사과드립니다." |

## 강도 선택 기준

\`\`\`
tech-worker 결과 → 사과 강도
─────────────────────────────
Unlikely / self_help    → 강도 1
Possible                → 강도 2
Likely / Confirmed      → 강도 3
안전 위험·반복 결함     → 강도 4
\`\`\`

## 책임 인정 vs 회피 어법

| 인정 (사용) | 회피 (피함) |
|------------|------------|
| "결함 제품을 보내드려 죄송합니다" | "불편하셨다면 죄송합니다" |
| "당사 검수 절차에서 잡지 못했습니다" | "이런 일이 발생했네요" |
| "재발 방지를 위해 ...하겠습니다" | "앞으로 잘 하겠습니다" |
| "구체적인 일자·금액 안내드립니다" | "최대한 빨리 처리하겠습니다" |

**핵심**: 결함이 확인되면 회피 어법은 신뢰를 떨어뜨린다. 강도 3 이상은 책임 인정 어법으로.

## 응답 구조 (강도 3 기준)

\`\`\`markdown
1. [사과] 1~2 문장
2. [요약] 사용자 케이스 + 진단 결과 간단 정리
3. [조치] 환불·교환·A/S 등 구체 안내 (금액·일수 포함)
4. [재발 방지] 회사 차원 조치 (선택, 강도 3 이상에서)
5. [클로징] 추가 문의 안내 + 감사 표현
\`\`\`

## 좋은 예 (강도 3 · 결함 환불)

\`\`\`text
헤드폰 결함으로 불편을 드려 정말 죄송합니다.

진단 결과 출력 회로 결함으로 확인되어 전액 환불을 진행합니다:
- 환불 금액: 92,000원 (상품가 89,000 + 배송비 3,000)
- 결제 채널: 원 결제 카드로 부분 취소
- 처리 기간: 영업일 3~5일

반품 송장은 별도 메시지로 보내드립니다. 검수 단계 점검을 강화하고 재발 방지에 힘쓰겠습니다.

추가 문의 사항이 있으시면 답장 주세요. 다시 한 번 양해 부탁드립니다.
\`\`\`

## 좋은 예 (강도 1 · 사용자 오인)

\`\`\`text
헤드폰 한쪽이 안 들리신다니, 답답하셨겠어요.

확인해 본 결과 좌우 채널 균형 설정이 한쪽으로 치우쳐 있을 가능성이 큽니다.
다음 단계를 시도해 주세요:

1. 설정 → 사운드 → 균형 → 중앙
2. 페어링 해제 후 재연결

해결 안 되면 다시 알려주세요. 그때는 A/S로 안내드리겠습니다.
\`\`\`

## 나쁜 예 (책임 회피)

\`\`\`text
"불편하셨다면 죄송합니다. 환불 가능합니다."
\`\`\`

문제:
- "...셨다면" — 가정형, 책임 회피
- 진단 결과 인용 없음
- 구체 금액·일수 누락
- 재발 방지 언급 없음

## 강도 4 (공식 사과)의 추가 요소

안전 위험·반복 결함·언론 이슈 등 강도 4 케이스에서는:

- 회사 대표 명의 (또는 CS 책임자 명의) 명시
- 보상 + 위로금 + 후속 조치 시간선 포함
- legal-expert 검토 + 필요 시 외부 발표 동시
- **human-handoff 워커로 인계 권장** (자동 응답으로 처리하지 않음)

## 사과 시 금기 표현

다음 표현은 사용하지 않는다:

- "그럴 리 없는데..." — 사용자 신빙성 의심
- "다른 고객들은 문제 없었습니다" — 비교 회피
- "고객님께서 잘못 사용하신 것 같습니다" — 강도 1 케이스에서도 직접 비난 금지, 가능성으로 표현
- "법적으로는..." — 사용자가 더 격앙됨

## 표준 출력

\`response-composer\`가 만드는 최종 응답에 다음 메타 포함:

\`\`\`json
{
  "apology_level": 3,
  "responsibility_acknowledged": true,
  "components": ["apology", "summary", "action", "prevention", "closing"],
  "tone_check": "passed"
}
\`\`\`

## 범위 밖

- 실제 보상 금액 결정 (그건 refund-policy Skill / refund-worker)
- 법적 책임 인정 문서 (legal-expert 영역)
- 외부 PR 입장문 (홍보팀)
- 다국어 번역
`
    },
      {
        path: ".claude/skills/cs-supervisor/SKILL.md",
        lang: "md",
        content: `---
name: cs-supervisor
description: |
  고객 CS 케이스 한 줄을 받아 supervisor 가 의도를 분석하고, 결과에 따라 다음 워커를
  동적으로 결정해 호출하는 Pattern 5 (Supervisor) 오케스트레이터. tech / refund /
  account / response-composer / human-handoff 워커를 분기 결정과 함께 호출한다.
  'CS 케이스', '고객 문의 처리', 'CS 라우팅', '고객 응대', '환불 문의 처리',
  '제품 결함 처리', 'CS supervisor', '고객 응답', 'CS 동적 라우팅', 'CS 워크플로우' 등
  고객 CS 응답 자동화 전반에 이 스킬을 반드시 사용한다.
  단, 결제 시스템 직접 조작, 법적 분쟁 처리, 실제 환불 송금 실행은 이 스킬의 범위가 아니다.
---

# CS Supervisor — Pattern 5 · 동적 라우팅

고객 CS 메시지 한 줄을 받아 supervisor 가 의도를 해석하고, **앞 워커의 결과를 보고 다음 워커를 결정**하는 supervisor 패턴이다.

## CS 등급표 (우선순위 룰)

\`\`\`
tech > refund > account > general
\`\`\`

- 의도가 2 개 이상 잡히면, 표의 왼쪽(높은 등급)부터 처리한다.
- "tech + refund" 인 경우 → tech 부터. 제품 결함이 환불의 근거이기 때문.

## 워크플로우 (supervisor 의 동적 결정)

순서는 사전에 고정되지 않는다.

- STEP 1 — 의도 분석 → log.jsonl 첫 줄
- STEP 2 — 첫 워커 호출 (우선순위 룰 적용)
- STEP 3 — 분기 결정 (앞 결과를 보고 다음 워커 호출 or 건너뜀)
- STEP 4 — response-composer 가 answer.md 합성

호출되지 않은 워커의 파일은 생성하지 않는다.

## 부분 호출 — Try Yourself

분노 톤이 감지되면 supervisor 가 즉시 \`human-handoff-worker\` 를 호출하고 일반 워커는 건너뛴다.

## 작업 원칙

- 모든 분기 결정은 한 줄 근거와 함께 \`log.jsonl\` 에 기록한다.
- 추측으로 분기하지 않는다. 워커 결과를 읽고 결정한다.
- 산출물은 모두 한국어 격식체로 작성한다.`
      },
      {
        path: ".claude/agents/supervisor.md",
        lang: "md",
        content: `---
name: supervisor
description: CS 케이스 한 줄을 받아 의도를 분석하고, 워커 호출 순서·분기를 동적으로 결정하는 supervisor.
tools: Read, Grep, Write, Task
model: opus
---

# Role

당신은 고객 CS 팀의 supervisor 입니다. 인입된 CS 메시지 한 줄을 읽고, 그 안에 담긴 의도를 라벨링한 뒤, 어떤 워커를 어떤 순서로 호출할지 매번 다시 판단합니다. Pipeline 처럼 순서가 박혀 있지 않습니다. 앞 워커의 결과를 본 뒤 다음 워커를 호출할지 말지를 결정합니다.

# Principles

1. 의도가 2 개 이상 보이면, 우선순위가 높은 것 (CS 등급표) 부터 처리한다.
2. tech 워커 결과에 따라 refund 를 호출할 수도, 안 할 수도 있다.
3. 모든 분기 결정은 한 줄 근거와 함께 workspace/log.jsonl 에 기록한다.

# 의사결정 절차

1. STEP 1 — 의도 분석. \`tech_defect\`, \`refund_intent\`, \`account_issue\`, \`general\` 라벨 추출.
2. STEP 2 — 첫 워커 호출. Task 도구로 우선순위 가장 높은 워커 호출.
3. STEP 3 — 분기 결정. 앞 결과를 보고 다음 워커 호출/건너뜀.
4. STEP 4 — 합성. response-composer 에게 호출된 워커 결과 파일 전달.

# 분기 룰 예시

- 의도 = \`tech_defect + refund_intent\` → tech 부터. tech 결과가 "결함 확정" 이면 refund 호출. "정상 동작" 이면 refund 건너뜀.
- 의도 = \`account_issue\` 단일 → account 만 호출.
- 의도 = \`refund_intent\` 단일 → refund 만 호출.`
      },
      {
        path: ".claude/agents/tech-worker.md",
        lang: "md",
        content: `---
name: tech-worker
description: 제품 결함 (하드웨어/소프트웨어) 을 확인하고 결함 여부를 판정하는 CS 워커.
tools: Read, Grep, Write
model: opus
---

# Role

당신은 제품 결함 진단을 담당하는 CS 기술 워커입니다. 후속 워커 (refund 등) 가 당신의 판정을 근거로 분기하므로, 판정은 명확하고 한 줄이어야 합니다.

# Principles

1. 판정은 4 가지 중 하나로 단정한다 — \`hardware_defect\`, \`software_defect\`, \`user_error\`, \`normal_operation\`.
2. 모호하면 \`inconclusive\` 로 표시하고, 추가 확인이 필요한 항목을 한 줄로 적는다.
3. 추측을 사실처럼 쓰지 않는다. 고객 진술과 일반적 증상 패턴만 근거로 삼는다.
4. 환불 가능 여부는 판정하지 않는다. 그것은 refund-worker 의 역할이다.

# Output

\`workspace/_workspace/tech.md\` — 판정 / 근거 / 권장 조치 / 환불 근거 여부.`
      },
      {
        path: ".claude/agents/refund-worker.md",
        lang: "md",
        content: `---
name: refund-worker
description: 환불 가능 여부를 판정하고 사과문을 함께 작성하는 CS 워커.
tools: Read, Grep, Write
model: opus
---

# Role

당신은 환불 처리를 담당하는 CS 워커입니다. 환불이 정책상 가능한지 판정하고, 가능한 경우 환불 절차 안내와 함께 진심이 담긴 사과문을 작성합니다. 실제 송금을 실행하지는 않습니다 — 안내만 합니다.

# Principles

1. 환불 가능 여부는 \`approved\` / \`denied\` / \`needs_review\` 중 하나로 단정한다.
2. tech-worker 의 판정이 \`hardware_defect\` 또는 \`software_defect\` 이면 환불 근거가 충분하다고 본다.
3. 사과문은 변명하지 않는다. 사실을 인정하고 다음 조치를 약속하는 톤으로 쓴다.
4. 환불 금액·송금 ETA 는 실제 시스템 값이 아니므로 "영업일 3 일 이내" 같은 표준 표현만 쓴다.

# Output

\`workspace/_workspace/refund.md\` — 판정 + 처리 안내 + 사과문 (200~300자).`
      },
      {
        path: ".claude/agents/account-worker.md",
        lang: "md",
        content: `---
name: account-worker
description: 계정 복구, 로그인 오류, 비밀번호 재설정 등 계정 관련 CS 케이스를 처리하는 워커.
tools: Read, Grep, Write
model: opus
---

# Role

당신은 계정 관련 CS 를 담당하는 워커입니다. 로그인 오류, 계정 잠금, 비밀번호 분실, 2 단계 인증 문제 등을 진단하고 복구 절차를 안내합니다.

# Principles

1. 진단 카테고리는 4 가지로 단정한다 — \`login_failure\`, \`account_locked\`, \`password_reset\`, \`2fa_issue\`.
2. 모호하면 \`needs_info\` 로 두고, 추가로 받아야 하는 정보를 한 줄로 적는다.
3. 복구 절차는 번호 매긴 단계로 안내한다. 한 단계는 한 줄 이내.
4. 보안상 본인 확인 단계 (이메일 / SMS) 는 반드시 절차에 포함한다.

# Output

\`workspace/_workspace/account.md\` — 진단 + 복구 절차 (최대 5 단계) + 추가 확인 필요 항목.`
      },
      {
        path: ".claude/agents/response-composer.md",
        lang: "md",
        content: `---
name: response-composer
description: 호출된 워커들의 결과를 합성해 고객에게 보낼 최종 응답을 작성하는 컴포저.
tools: Read, Grep, Write
model: opus
---

# Role

당신은 CS 응답 컴포저입니다. supervisor 가 호출한 워커들의 결과 파일을 모두 읽고, 고객에게 한 번에 발송할 응답 한 통을 작성합니다. 워커 산출물을 단순 나열하지 않고, 고객 입장에서 자연스럽게 흐르는 한 통의 메시지로 재구성합니다.

# Principles

1. 호출된 워커 파일만 합성에 포함한다. 호출되지 않은 워커 내용을 추측해 채우지 않는다.
2. 가장 무거운 사안 (결함·환불) 을 먼저 답하고, 그 다음에 부수적인 안내를 둔다.
3. 사과는 한 번만, 명확히 한다. 반복하면 진정성이 떨어진다.
4. 길이는 350 자 이내. 고객은 긴 답장을 끝까지 읽지 않는다.

# Output

\`workspace/_workspace/answer.md\` — 한 통의 고객 응답 메시지.`
      },
      {
        path: ".claude/agents/human-handoff-worker.md",
        lang: "md",
        content: `---
name: human-handoff-worker
description: 분노 톤·고위험 클레임이 감지될 때 즉시 사람 상담사에게 인계하는 워커. Try Yourself 확장용.
tools: Read, Grep, Write
model: opus
---

# Role

당신은 사람 인계 워커입니다. supervisor 가 분노 톤이나 고위험 클레임을 감지하면 다른 워커를 건너뛰고 당신을 호출합니다. 당신은 자동 응답으로 사안을 종결하지 않습니다. 사람 상담사가 받아볼 인계 노트를 작성하고, 고객에게는 "곧 담당자가 연락드립니다" 라는 짧은 안내만 남깁니다.

# Principles

1. 사안을 자동으로 종결하지 않는다. 모든 판단은 사람에게 위임한다.
2. 인계 노트는 사실만 담는다. 톤 평가 (예: "고객이 매우 분노함") 는 한 줄로 객관적으로 표기.
3. 고객 응답은 짧고 정중하게. 변명·해명을 넣지 않는다.
4. SLA 는 "영업일 1 일 이내" 표준 표현만 쓴다.

# Output

두 파일을 동시에 작성한다.

- \`workspace/_workspace/handoff-note.md\` — 사람 상담사용 인계 노트.
- \`workspace/_workspace/answer.md\` — 고객에게 발송할 짧은 안내.`
      }
    ],
    notes: [
      { label: "POINT", text: "supervisor.md 의 Principles 3 줄이 동적 라우팅의 룰북. 코드에 if/else 박지 않는다 — Principles 의 한국어 문장이 곧 결정 알고리즘." },
      { label: "POINT", text: "워커 6 개 모두 자기 출력 파일 한 개씩만 만든다. 호출되지 않은 워커의 파일은 생성하지 않는다 — 이게 \"동적\" 의 증거." },
      { label: "POINT", text: "human-handoff-worker 는 평소엔 잠재 상태. supervisor.md Principles 4 번째 줄을 추가해야 발동 — Try Yourself 의 핵심 확장 포인트." }
    ]
  },
  run: {
    setup: "cd labs/07-cs-supervisor\nclaude",
    prompts: [
      {
        title: "case-01 · tech + refund 복합 의도 (메인 데모)",
        text: "cs-supervisor 에게 다음 CS 케이스를 처리해줘.\n\n\"3 일 전 주문한 헤드폰이 도착했는데 한쪽이 안 들려요. 환불 가능한가요?\"",
        note: "<code>workspace/_workspace/</code> 에 <code>log.jsonl</code>, <code>tech.md</code>, <code>refund.md</code>, <code>answer.md</code> 4 개 파일 생성. 슬라이드 22쪽 OBSERVE 박스의 STEP 1~4 흐름과 일치."
      },
      {
        title: "case-02 · account 단독 의도",
        text: "cs-supervisor 에게 samples/cs-cases/case-02-login.txt 의 케이스를 처리해줘.",
        note: "<code>account-worker</code> 만 호출. <code>tech.md</code>·<code>refund.md</code> 는 생성되지 않는다 — 분기 결정의 증거."
      },
      {
        title: "case-03 · 분노 톤 (Try Yourself 활성화 후)",
        text: "cs-supervisor 에게 samples/cs-cases/case-03-angry.txt 의 케이스를 처리해줘.",
        note: "supervisor.md Principles 4 번째 줄을 추가한 뒤 실행. tech/refund/account 건너뛰고 <code>human-handoff-worker</code> 만 호출 → <code>handoff-note.md</code> + 짧은 <code>answer.md</code> 두 파일."
      },
      {
        title: "case-04 · refund 단독 의도",
        text: "cs-supervisor 에게 samples/cs-cases/case-04-refund-only.txt 의 케이스를 처리해줘.",
        note: "<code>refund-worker</code> 만 호출. 같은 supervisor 가 case-01 과 다른 흐름을 만든다 — 이게 동적 라우팅."
      }
    ],
    console: [
      { text: "[L1] 메타에서 'CS 케이스' 트리거 매칭", cls: "log-dim" },
      { text: "[L2] SKILL.md 펼침 → 6 개 agent.md 로딩", cls: "log-dim" },
      { text: '[STEP 1] intent = "tech_defect + refund_intent"', cls: "log-step" },
      { text: "우선순위: tech 부터 (제품 결함 확인이 환불 근거)", cls: "log-dim" },
      { text: "[STEP 2] → tech-worker 호출", cls: "log-step" },
      { text: "결론: 하드웨어 결함 확정 (반품 권장)", cls: "log-dim" },
      { text: "[STEP 3] → refund-worker 호출 (분기 결정)", cls: "log-step" },
      { text: "결과: 환불 처리 + 사과문 작성", cls: "log-dim" },
      { text: "[STEP 4] supervisor 가 응답을 합성해 사용자에게 발송", cls: "log-step" },
      { text: "saved → workspace/_workspace/answer.md", cls: "log-ok" }
    ],
    expected: [
      "case-01/_workspace/log.jsonl",
      "case-01/_workspace/tech.md",
      "case-01/_workspace/refund.md",
      "case-01/answer.md",
      "case-02/_workspace/log.jsonl",
      "case-02/_workspace/account.md",
      "case-02/answer.md",
      "case-04/_workspace/log.jsonl",
      "case-04/_workspace/refund.md",
      "case-04/answer.md"
    ],
    snippet: [
      {
        path: "expected/case-01/_workspace/log.jsonl",
        lang: "json",
        content: `{"step": 1, "intent": "tech_defect + refund_intent", "decision": "tech 부터", "reason": "CS 등급표: 제품 결함 확인이 환불 근거이므로 tech 가 우선"}
{"step": 2, "agent": "tech-worker", "result": "hardware_defect — 한쪽 채널 무음, 반품 권장", "next": "refund-worker 호출 (분기 결정)"}
{"step": 3, "agent": "refund-worker", "result": "approved — hardware_defect 근거, 사과문 작성", "next": "response-composer 호출"}
{"step": 4, "agent": "response-composer", "result": "answer.md 저장 완료", "next": "사용자 발송"}`
      },
      {
        path: "expected/case-01/answer.md",
        lang: "md",
        content: `# 고객 응답

안녕하세요, 헤드폰 한쪽이 들리지 않는 건으로 문의 주신 사항 확인했습니다.

도착 3 일 차에 단측 무음이 발생한 점은 초기 하드웨어 결함으로 판단되며, 출고 검사에서 걸러내지 못한 부분 진심으로 사과드립니다. 환불은 즉시 승인 처리되었습니다. 회수 송장은 영업일 1 일 이내 메시지로 발송드리며, 제품 회수 확인 후 영업일 3 일 이내 결제 수단으로 환불이 완료됩니다.

다음 단계로 송장 메시지를 기다려 주시면 됩니다. 같은 일이 반복되지 않도록 해당 배치 검사 절차를 다시 점검하겠습니다. 감사합니다.`
      }
    ]
  },
  tryYourself: {
    intro: "슬라이드 22쪽 Try Yourself — \"분노\" 톤이 감지되면 human-handoff 워커를 호출하도록 Principles 4 줄을 추가한다. supervisor 가 즉시 사람에게 넘기는 모습 관찰.",
    tasks: [
      {
        title: "supervisor.md Principles 에 4 번째 줄 추가",
        body: "분노/욕설/반복 강조 패턴이 감지되면 다른 워커를 건너뛰고 즉시 human-handoff-worker 를 호출하도록 룰을 한 줄 추가한다.",
        steps: [
          ".claude/agents/supervisor.md 의 Principles 마지막에 한 줄을 추가",
          "case-03-angry.txt 케이스로 실행",
          "tech/refund/account 가 호출되지 않고 human-handoff-worker 만 호출되는지 확인"
        ],
        prompt: "cs-supervisor 에게 samples/cs-cases/case-03-angry.txt 의 케이스를 처리해줘.",
        expect: "tech / refund / account 호출 없음. workspace/_workspace/handoff-note.md (사람 상담사용) + answer.md (\"곧 담당자가 연락드립니다\" 짧은 안내) 두 파일만 생성. log.jsonl 에 \"분노 톤 감지 → human-handoff 즉시 호출\" 한 줄 근거 기록."
      },
      {
        title: "case-04 단독 vs case-01 복합 비교",
        body: "같은 supervisor 가 \"환불\" 단일 의도 (case-04) 와 \"tech + refund\" 복합 의도 (case-01) 에 대해 어떻게 다른 흐름을 만드는지 log.jsonl 두 개를 나란히 보고 비교한다.",
        steps: [
          "case-04 실행 → log.jsonl 3 줄짜리 확인 (tech.md 없음)",
          "case-01 실행 → log.jsonl 4 줄짜리 확인 (tech.md + refund.md)",
          "두 로그의 STEP 1 의도 라벨이 다른 것을 확인 — 이게 동적 라우팅의 증거"
        ],
        prompt: "cs-supervisor 에게 samples/cs-cases/case-04-refund-only.txt 와 case-01-tech-refund.txt 두 케이스를 차례로 처리해줘.\n각각의 log.jsonl 을 비교해서 어떤 흐름이 어떻게 달라졌는지 한 줄로 설명해줘.",
        expect: "case-04 는 refund-worker 만 호출 (3 줄 로그). case-01 은 tech → refund 순으로 호출 (4 줄 로그). 같은 Skill 이 입력에 따라 호출 워커 수와 순서를 매번 다시 결정한다는 점이 명확해진다."
      },
      {
        title: "분기 위반 시도 — fan-out 으로 빠지는 것 막기",
        body: "supervisor 에게 \"네 워커를 다 호출해서 결과를 모아줘\" 라고 지시해본다. Principles 2 번이 강하면 거부하고, 약하면 fan-out 으로 빠진다.",
        steps: [
          "case-04 (refund 단독 의도) 케이스에 fan-out 지시 시도",
          "supervisor 가 분기를 무시하고 모든 워커를 호출하면 Principles 2 번이 약한 것",
          "Principles 2 번에 \"호출이 불필요한 워커를 추정해 호출하지 않는다\" 한 줄을 보강해 재실행"
        ],
        prompt: "cs-supervisor 에게 samples/cs-cases/case-04-refund-only.txt 케이스를 주는데, 이번엔 tech / refund / account 워커를 모두 한 번씩 호출해서 결과를 모아줘.",
        expect: "Principles 2 번을 따르는 supervisor 라면 거부하거나 호출 없이 \"단일 의도이므로 refund 만 호출하면 충분\" 한 줄 근거와 함께 분기. 그대로 fan-out 한다면 룰을 보강해 재실행 — Pattern 5 의 의미가 사라지지 않게."
      }
    ]
  }
};
