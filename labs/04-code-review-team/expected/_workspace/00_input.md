# 00 — 입력 정리 (PR #142)

> 출처: `samples/pr-142.diff` + `samples/pr-142-context.md`
> 팀: `code-review-team` (Fan-out 4 + merger 1)
> 처리일: 2026-05-14

## PR 메타

| 항목 | 값 |
|------|----|
| 번호 | #142 |
| 제목 | feat(notification): add weekly digest endpoint and user lookup batch |
| 작성자 | dev-namho |
| 변경 파일 | 4 개 |
| 추가/삭제 | +108 / -0 |
| 관련 이슈 | #97, #128 |
| 단위 테스트 | 없음 (다음 PR 예정) |

## 영향 모듈

- `notification-service` 단일 서비스 안에서 `web` / `application` / `domain` 3 레이어.

## 리뷰어 배치

| 리뷰어 | 출력 |
|--------|------|
| architect-reviewer | `parallel/architect.md` |
| security-reviewer | `parallel/security.md` |
| performance-reviewer | `parallel/performance.md` |
| style-reviewer | `parallel/style.md` |

4 명을 단일 메시지에서 동시 호출하고, 모두 완료되면 `merger` 가 `merged_report.md` 를 만든다.
