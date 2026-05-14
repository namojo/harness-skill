# Architect Review — PR #142

## [BLOCK]
(없음)

## [WARN]
- 레이어 위반: `domain` 이 `web` 을 import — `notification-service/.../domain/User.java:3`
  - 근거: `import com.example.notification.web.dto.DigestRequest;` — `User.matches(DigestRequest)` 가 `web.dto` 의 DTO 를 직접 받는다. domain 은 web 에 의존해선 안 되며, 표준 클린 아키텍처에서 의존 방향은 web → application → domain 한 방향이다. 같은 PR 의 `DigestService.java` 도 동일 위반을 한다 (아래 참고).
- 레이어 위반(추가 발생): `application` 이 `web` 을 import — `notification-service/.../application/DigestService.java:6`
  - 근거: `DigestResponse` (web.dto) 를 application 이 직접 import 하고 반환한다. application 은 자체 결과 객체를 두고, 변환은 web 레이어에서 해야 한다.

## [NIT]
- 데드 코드 가능성: `UserRepository.getUsersByIds()` 가 추가됐지만 이번 PR 에서 사용되지 않는다 — `notification-service/.../domain/UserRepository.java:5`
  - 근거: 다음 PR 에서 쓴다는 메모가 있다. 사용 시점에 함께 도입하는 편이 추적이 쉽다. 확인 필요.

## 발견 없음 영역
- 순환 의존: 없음.
- 공개 API 호환성: 신규 엔드포인트라 기존 호환성 영향 없음.
