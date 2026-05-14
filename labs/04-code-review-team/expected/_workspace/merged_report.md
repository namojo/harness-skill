# 통합 리뷰 — PR #142

> 결론: 🔴 머지 보류 (Block 1건)
> 출처: architect / security / performance / style 4 명 + merger

## 🔴 BLOCK (1)
- security: env 변수가 로그로 흘러간다. — `notification-service/.../web/DigestController.java:32` (출처: security)
  - 공격 시나리오: 로그 수집 시스템 접근자가 `DIGEST_API_TOKEN`, `SMTP_PASSWORD`, `System.getenv()` 전체를 평문으로 본다.
  - 권장 조치: 환경 변수는 절대 로깅하지 않는다. 디버그가 필요하면 마스킹.

## 🟡 WARN (3)
- performance: getUserById 가 루프 안. — `notification-service/.../application/DigestService.java:27` (출처: performance)
  - 같은 PR 에 추가된 `getUsersByIds(List<Long>)` 를 써서 1회 호출로 줄인다.
- architect: domain 이 web 을 import. — `notification-service/.../domain/User.java:3` (출처: architect)
  - `application/DigestService.java:6` 에도 동일 위반 — application 이 web.dto 를 직접 반환. 변환은 web 레이어에서.
- security ↔ style 충돌 → 두 의견 다 기록. — `notification-service/.../web/DigestController.java:36`
  - security: 사용자 ID 로깅의 PII 정책 확인 필요 (NIT 단계, 정책에 따라 격상 가능).
  - style: 구조화 파라미터를 쓴 현재 로그 메시지는 가독성이 좋아 그대로 유지 권장.

## 🟢 NIT (4)
- architect: `UserRepository.getUsersByIds()` 가 추가됐지만 이번 PR 에서 사용 안 됨 — `notification-service/.../domain/UserRepository.java:5` (출처: architect)
- style: 필드 네이밍 PascalCase 위반 (`DigestService` → `digestService`, `LastDigestStatus` → `lastDigestStatus`) — `web/DigestController.java:23`, `domain/User.java:7` (출처: style)
- style: 매직 넘버 + public 가변 — `web/DigestController.java:42`, `48` (출처: style)
- performance: ArrayList 초기 용량 미지정 (영향 미미) — `application/DigestService.java:24` (출처: performance)

## 권장 다음 액션

1. **BLOCK 부터**: env 변수 로깅 라인 제거 또는 마스킹. 머지 보류 사유 해제 후 재리뷰.
2. **WARN 처리 순서**:
   - performance — N+1 을 `getUsersByIds()` 로 일괄 조회로 교체 (이미 PR 에 메서드는 추가됨).
   - architect — `application` 과 `domain` 의 web 의존 제거. application 자체 결과 객체 도입, 변환은 controller 에서.
   - 충돌 항목 — security 의 PII 정책 결정을 먼저 (정책에 따라 style 결론이 바뀐다).
3. **NIT** — 위 1·2 처리 후 같은 PR 에서 정리.
