# Performance Review — PR #142

## [BLOCK]
(없음 — 핫패스 여부가 명확치 않아 BLOCK 까지는 가지 않음)

## [WARN]
- N+1 쿼리: 루프 안에서 `userRepository.getUserById(userId)` 호출 — `notification-service/.../application/DigestService.java:27`
  - 측정/추정: userIds 100 명 기준 DB 왕복 100 회. 같은 PR 에 추가된 `getUsersByIds(List<Long>)` 를 쓰면 1 회로 줄어든다.
  - 대안:
    ```java
    List<User> users = userRepository.getUsersByIds(userIds);
    Map<Long, User> byId = users.stream().collect(toMap(User::getId, u -> u));
    for (Long userId : userIds) {
        User user = byId.get(userId);
        ...
    }
    ```
- 루프 안 추가 외부 호출: `digestItemReader.readByUser(user)` 도 같은 루프 안 — `notification-service/.../application/DigestService.java:33`
  - 측정/추정: 사용자당 1회 외부 호출 — userIds 가 100 이면 총 200 회 외부 호출. batch 또는 비동기 fetch 검토.
  - 대안: `readByUsers(List<User>)` API 도입 후 1 회 호출.

## [NIT]
- `new ArrayList<>()` 초기 용량 미지정 — userIds 크기로 init capacity 를 주면 재할당 비용 절약. 측정 가능한 영향은 미미.
