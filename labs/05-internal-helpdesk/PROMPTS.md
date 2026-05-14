# LAB 05 — 프롬프트 모음

> 강사용. Claude Code 에 그대로 붙여넣어 실행한다.
> 슬라이드 18쪽의 세 가지 테스트 시나리오를 그대로 재현한다.

## 정상 흐름 (메인 데모)

### 1. TEST 1 · 명확한 도메인 (hr)

```text
internal-helpdesk 로 사내 질문에 답해줘:

휴가 사용 기간이 회계연도 기준인가요?
```

**예상 결과**: `_workspace/route_decision.json` 에 `routed_to: hr`, `_workspace/answer.md` 에 hr-expert 의 응답. 슬라이드 18쪽 TEST 1 과 일치.

### 2. TEST 2 · 도메인 걸친 질문 (ask)

```text
internal-helpdesk 로 사내 질문에 답해줘:

퇴직금에 대한 세금 처리는 어떻게 되나요?
```

**예상 결과**: `routed_to: ask`. 라우터가 hr+finance 양쪽에 걸친다고 판단해 되묻는다. 슬라이드 18쪽 TEST 2 와 일치.

### 3. TEST 3 · 도메인 외 (ask)

```text
internal-helpdesk 로 사내 질문에 답해줘:

점심 메뉴 추천해줘.
```

**예상 결과**: `routed_to: ask`. 라우터가 사내 업무 외라고 판단해 정중히 거절. 슬라이드 18쪽 TEST 3 과 일치.

## 변형 / Try Yourself

### 4. 사규집 인용 검증 (finance)

```text
internal-helpdesk 로 사내 질문에 답해줘:

출장 중 법인카드로 결제한 식대 영수증을 분실했습니다. 사규집에 따르면 어떻게 처리해야 하나요?
```

**예상 결과**: `routed_to: finance`. answer.md 본문에 `(§4 법인카드 사용)` 처럼 조항 번호 + 제목이 병기되어 있어야 한다.

같은 프롬프트를 두 번 돌려 인용 형식이 일정한지 확인한다. 슬라이드 18쪽 Try Yourself 의 요구사항.

### 5. 라우터 원칙 끄고 비교

`.claude/agents/router.md` 의 Principles 1번("도메인이 명확하지 않으면 사용자에게 되묻는다")을 잠시 주석 처리하고 TEST 2 를 다시 돌려본다. 추측 라우팅이 늘어나며, 잘못된 전문가가 호출되는 모습을 관찰할 수 있다.
