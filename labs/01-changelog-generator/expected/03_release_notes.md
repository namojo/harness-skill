# Changelog

## [2.0.0] - 2026-05-14

### Breaking Changes
- API `/users/{id}` 의 응답 스키마가 `profile` 필드를 nest 한 객체로 변경 (마이그레이션 가이드 §2 참조)
- OAuth2 implicit flow 토큰 엔드포인트 폐기 (마이그레이션 가이드 §1 참조)

### Added
- 신규 OAuth2 PKCE 인증 흐름 (#421)
- 다국어 응답 (KR/EN/JA) (#438)
- 요청 지연 히스토그램 메트릭 (#440)
- 관리자 헬스체크 엔드포인트 `/admin/ping` (#442)
- refresh token rotation 옵션 (#430)

### Changed
- 로그 포맷을 JSON 으로 통일 (#445)

### Fixed
- 동시 요청 시 캐시 경쟁 (#451)
- TTL 0 인 키가 영구 캐시되는 문제 (#448)
- /orders 페이지네이션 last_page 계산 오류 (#447)

## [1.2.0] - 2026-04-28

### Added
- 세션 토큰 만료 임박 알림 헤더 (#398)
- 관리자 콘솔의 다중 선택 일괄 작업 (#401)

### Changed
- /metrics 응답 포맷을 Prometheus 표준에 맞춰 정렬 (#405)

### Fixed
- 비정상 종료 시 락 파일이 남는 문제 (#412)

## [1.1.0] - 2026-03-10

### Added
- 외부 webhook 재시도 정책 설정 (#370)

### Fixed
- 한국어 응답에서 따옴표가 깨지는 인코딩 오류 (#381)

## [1.0.0] - 2026-01-20

### Added
- 최초 정식 릴리스
