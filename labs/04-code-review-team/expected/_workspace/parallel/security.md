# Security Review — PR #142

## [BLOCK]
- 환경변수 전체가 로그로 흘러간다 — `notification-service/.../web/DigestController.java:32`
  - 공격 시나리오: 로그 수집 시스템(ELK / CloudWatch 등) 에 접근 가능한 누구나 `DIGEST_API_TOKEN`, `SMTP_PASSWORD` 그리고 `System.getenv()` 전체 맵을 평문으로 읽을 수 있다. 토큰 1건이면 다이제스트 API 전체를 임의 호출 가능.
  - 안전한 대안:
    ```java
    // 환경 변수는 절대 로깅하지 않는다. 디버그가 필요하면 마스킹.
    log.info("weekly digest request: userCount={}", req.getUserIds().size());
    ```

## [WARN]
- 입력 검증 누락: `DigestRequest.userIds` 의 크기/null 체크 없음 — `notification-service/.../web/DigestController.java:29`
  - 공격 시나리오: 외부에서 100만 개 ID 를 한 번에 보내면 `buildDigest()` 가 그대로 루프를 돈다. DoS 가능.
  - 안전한 대안:
    ```java
    if (req.getUserIds() == null || req.getUserIds().isEmpty()) throw new BadRequestException();
    if (req.getUserIds().size() > 1000) throw new BadRequestException();
    ```
- 인증/인가 누락: `@PostMapping("/weekly")` 에 권한 어노테이션이 없음 — `notification-service/.../web/DigestController.java:27`
  - 공격 시나리오: 외부에서 임의 사용자 ID 로 다이제스트 발송 트리거 가능. 메일 폭탄 / 비용 폭주.

## [NIT]
- 로그 형식: 두 번째 `log.info("digest built for {} users", ...)` 는 PII 영향은 없으나, 사용자 ID 자체 로깅은 정책 확인 권장 — `notification-service/.../web/DigestController.java:36`
