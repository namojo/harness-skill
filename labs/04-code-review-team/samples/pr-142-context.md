# PR #142 — feat(notification): add weekly digest endpoint and user lookup batch

## 변경 요약

주간 다이제스트 알림 기능을 추가한다. 외부에서 사용자 ID 리스트를 받아 사용자별로 1주일치 활동을 정리한 메일을 보내는 API.

- 신규 엔드포인트: `POST /api/v1/digest/weekly`
- 신규 서비스: `DigestService.buildDigest(List<Long> userIds)`
- 도메인 변경: `User` 에 `matches()`, `lastDigestStatus` 필드 추가
- 리포지토리 변경: `UserRepository` 에 `getUsersByIds()` 추가 (이번 PR 에서는 사용 안 함)

## 변경 파일

| 파일 | 추가 | 삭제 |
|------|------|------|
| `notification-service/.../web/DigestController.java` | 52 | 0 |
| `notification-service/.../application/DigestService.java` | 48 | 0 |
| `notification-service/.../domain/User.java` | 6 | 0 |
| `notification-service/.../domain/UserRepository.java` | 2 | 0 |
| 합계 | 108 | 0 |

## 관련 이슈

- 이슈 #97 — 주간 다이제스트 발송 시스템 (요청 분기)
- 이슈 #128 — 사용자 일괄 조회 API 추가 (사전 준비)

## 테스트

- 로컬에서 50 명 userIds 리스트로 호출 → 정상 응답 확인.
- 단위 테스트 미작성 (다음 PR 에서 추가 예정).
- 운영 부하 테스트는 미실시.

## 작성자 메모

- `getUsersByIds()` 는 추가만 해두었고 이번 PR 에서는 안 쓴다. 다음 PR 에서 `buildDigest()` 가 이걸 쓰도록 리팩토링 예정.
- 환경 변수 로깅은 디버깅 중에 임시로 넣은 것일 수 있음 — 머지 전 확인 부탁.
