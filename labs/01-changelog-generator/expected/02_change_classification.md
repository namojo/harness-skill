# Change Classification

## Breaking Changes
- [high · 가시성 5/5] API `/users/{id}` 의 응답 스키마가 `profile` 필드를 nest 한 객체로 변경
  - 근거: 평면 키(`profile_name`, `profile_avatar`)에 의존하던 모든 클라이언트가 응답 파서를 수정해야 한다.
  - 관련: 그룹 1 (커밋 f3a4b5d1)
- [high · 가시성 4/5] OAuth2 implicit flow 토큰 엔드포인트 폐기 — PKCE 흐름으로만 발급
  - 근거: 기존 implicit flow 클라이언트는 토큰을 발급받지 못한다.
  - 관련: #421

## Added
- [medium · 가시성 4/5] 신규 OAuth2 PKCE 인증 흐름 (#421)
- [medium · 가시성 4/5] 다국어 응답 (KR/EN/JA) (#438)
- [low · 가시성 2/5] 요청 지연 히스토그램 메트릭 (#440)
- [low · 가시성 2/5] 관리자 헬스체크 엔드포인트 `/admin/ping` (#442)
- [low · 가시성 1/5] refresh token rotation 옵션 (#430)

## Changed
- [medium · 가시성 3/5] 로그 포맷을 JSON 으로 통일 (#445)

## Fixed
- [medium · 가시성 3/5] 동시 요청 시 캐시 경쟁 (#451)
- [low · 가시성 2/5] TTL 0 인 키가 영구 캐시되는 문제 (#448)
- [low · 가시성 2/5] /orders 페이지네이션 last_page 계산 오류 (#447)

## Deprecated
- (해당 사항 없음 — implicit flow 폐기는 Breaking Changes 로 이미 명시)

## 분류 메모
- OAuth2 PKCE 도입은 "Added" 인 동시에 "Breaking" 이다. Breaking 측면은 Breaking Changes 섹션에, 신규 흐름 자체는 Added 에 각각 표기.
- refresh token rotation 은 옵션이라 가시성이 낮지만, OAuth2 작업과 묶인다는 점만 메모.
