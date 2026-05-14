# Style Review — PR #142

## [WARN]
- 필드 네이밍 컨벤션 위반: 필드명이 PascalCase. Java 의 인스턴스 필드는 camelCase 가 표준 — `notification-service/.../web/DigestController.java:23`
  - 위치: `private final DigestService DigestService;` → `private final DigestService digestService;`
  - 같은 패턴: `notification-service/.../domain/User.java:7` (`private String LastDigestStatus;` → `lastDigestStatus`)

## [NIT]
- 매직 넘버 2건 — 상수 추출 권장
  - `notification-service/.../web/DigestController.java:42` (`public int MAX_RETRY = 3;`) — public 가변 필드. `private static final int MAX_RETRY = 3;` 로 변경 권장. 의견: style 의 핵심은 인스턴스 필드 명명이지만, 이 항목은 가시성/불변성도 같이 어긋남.
  - `notification-service/.../web/DigestController.java:48` (`new DigestResponse(30, "fallback");`) — `30` 의 의미가 코드로 드러나지 않음. 상수명 부여 권장 (`TIMEOUT_SECONDS` 등).
- 로그 메시지 형식은 적절 — `notification-service/.../web/DigestController.java:36`
  - `log.info("digest built for {} users", userIds.size());` 는 구조화 파라미터를 잘 쓰고 있고 가독성이 좋다. 그대로 두는 것을 권장.
  - (참고: security 리뷰는 동일 라인에서 사용자 ID 의 정책 확인을 권장 — 양 의견은 통합 리포트에서 병기.)

## [BLOCK]
(없음 — style 은 원칙적으로 BLOCK 금지)

## 참고

- 인덴테이션, 줄 끝 공백 등 포매터로 해결되는 항목은 보고에서 제외.
