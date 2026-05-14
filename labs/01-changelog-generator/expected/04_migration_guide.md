# Migration Guide · v1.2.0 → v2.0.0

> 영향 범위: api (인증, 사용자 응답). 예상 작업 시간: 약 1~3시간.

## §1. OAuth2 implicit flow 폐기 — PKCE 흐름으로 이전

**무엇이 바뀌었나**: 기존 implicit flow 의 `/oauth/token?response_type=token` 엔드포인트가 폐기됐다. 모든 클라이언트는 Authorization Code + PKCE 흐름으로 토큰을 발급받아야 한다.

**Before**
```http
GET /oauth/authorize?response_type=token&client_id=app-1&redirect_uri=https://app.example.com/cb
```

**After**
```http
GET /oauth/authorize?response_type=code&client_id=app-1
   &redirect_uri=https://app.example.com/cb
   &code_challenge=<S256(verifier)>
   &code_challenge_method=S256

POST /oauth/token
  grant_type=authorization_code
  code=<code>
  code_verifier=<verifier>
```

**조치 방법**
- [ ] SDK 를 v2.0.0 이상으로 업그레이드한다 (PKCE 자동 처리).
- [ ] SDK 를 쓰지 않는 클라이언트는 `code_verifier` 를 직접 생성·보관한다 (43~128자 base64url).
- [ ] redirect 처리 코드를 `response_type=token` 분기에서 `code` 분기로 옮긴다.
- [ ] 발급된 implicit access token 은 만료 후 갱신되지 않으므로, 배포 직후 사용자 재로그인을 안내한다.

## §2. `/users/{id}` 응답에서 profile 필드를 nest 객체로 변경

**무엇이 바뀌었나**: 기존 평면 키 `profile_name`, `profile_avatar` 가 `profile: { name, avatar }` 한 객체로 묶인다.

**Before**
```json
{
  "id": 42,
  "email": "alice@example.com",
  "profile_name": "Alice",
  "profile_avatar": "https://cdn.example.com/a.png"
}
```

**After**
```json
{
  "id": 42,
  "email": "alice@example.com",
  "profile": {
    "name": "Alice",
    "avatar": "https://cdn.example.com/a.png"
  }
}
```

**조치 방법**
- [ ] 응답 파싱 코드에서 `profile_name` → `profile.name`, `profile_avatar` → `profile.avatar` 로 경로를 바꾼다.
- [ ] 응답 JSON 을 캐싱하는 경우 캐시 키 무효화를 1회 수행한다.
- [ ] OpenAPI 스펙을 v2.0.0 으로 다시 내려받아 클라이언트 코드 생성기를 재실행한다.

## 점검 체크리스트

- [ ] §1, §2 의 변경을 스테이징 환경에서 먼저 검증.
- [ ] 배포 직후 30분 동안 4xx 응답률을 모니터링.
- [ ] 사용자 공지(블로그·이메일) 발송 완료 여부 확인.
