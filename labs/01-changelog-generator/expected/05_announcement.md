# Release Announcement · v2.0.0

## 블로그

### v2.0.0 — OAuth2 PKCE 와 사용자 응답 구조 정리

오늘 v2.0.0 을 공개한다. 이번 메이저 릴리스의 핵심은 두 가지다. 첫째, 인증 흐름을 PKCE 한 줄기로 정리했다. 기존 implicit flow 는 폐기된다. 둘째, `/users/{id}` 응답의 평면 키가 `profile` nest 객체로 묶였다. 그 외에 다국어 응답(KR/EN/JA), JSON 로그 포맷, 동시 요청 캐시 경쟁 수정이 함께 들어갔다. 마이그레이션 가이드를 같이 공개하니, 두 Breaking Change 만 차근차근 따라가면 30분~1시간 안에 옮길 수 있다.

핵심 변경
- OAuth2 PKCE 흐름 도입, implicit flow 폐기 (#421)
- `/users/{id}` 응답에서 profile 을 nest 객체로 변경 (Breaking)
- 다국어 응답 KR/EN/JA, JSON 로그 포맷, 캐시 경쟁 버그 수정

## SNS (X / LinkedIn)

v2.0.0 공개. OAuth2 PKCE 한 줄기로 정리, `/users/{id}` 응답 구조 변경(Breaking), 다국어 응답·JSON 로그·캐시 경쟁 수정까지. 마이그레이션은 두 단계만 따라가면 끝난다. 가이드 링크는 댓글에. #release #oauth2 #devtools

## 이메일

제목: [Release] v2.0.0 — OAuth2 PKCE 와 사용자 응답 구조 변경 안내

본문:
안녕하세요. 운영 팀입니다.

이번 v2.0.0 에서는 다음이 바뀌었다.
- OAuth2 implicit flow 가 폐기되고 PKCE 흐름으로 일원화됐다 (#421).
- `/users/{id}` 응답이 `profile` nest 객체 구조로 변경됐다.
- 다국어 응답(KR/EN/JA), JSON 로그 통일, 동시 요청 캐시 경쟁 수정이 함께 포함됐다.

Breaking Change 가 2건 있어 마이그레이션 가이드를 별도로 준비했다. 가이드의 §1, §2 를 차례로 따라가면 작업 시간은 평균 1~3시간 정도다. 5월 21일까지는 v1.2.x 서버를 함께 운영하니, 그 안에 옮겨주시기 바란다.

릴리스 노트: https://example.com/changelog#2-0-0
마이그레이션 가이드: https://example.com/migrations/2-0-0

— Harness Platform Team
