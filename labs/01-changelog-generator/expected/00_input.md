# Release Input · v2.0.0

## 메타

- version: 2.0.0
- type: major
- date: 2026-05-14
- from_tag: v1.2.0
- to_ref: HEAD
- codename: harness

## git log v1.2.0..HEAD (요지)

총 20 커밋. 주요 화제:

- OAuth2 PKCE 인증 도입과 implicit flow 폐기 (#421)
- `/users/{id}` 응답에서 profile 필드를 nest 객체로 변경 (Breaking)
- 다국어 응답 KR/EN/JA (#438)
- 로그 포맷을 JSON 으로 통일 (#445)
- 동시 요청 시 캐시 경쟁 조건 해소 (#451)
- 그 외 페이지네이션, 메트릭, 관리자 엔드포인트, 의존성 업데이트

원본 git log 는 `samples/git-log.txt` 에 보관.
