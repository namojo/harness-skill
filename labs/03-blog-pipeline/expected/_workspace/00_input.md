# 00 — 입력 정리

> 출처: `samples/podcast-ep07-transcript.txt`
> 파이프라인: `blog-pipeline` (5단계)
> 처리일: 2026-05-14

## 메타

| 항목 | 값 |
|------|----|
| 세션 제목 | 스타트업 회고록 Ep.07 — 김도윤 (플로우데스크 전 대표) |
| 분량 | 약 19분 / 약 3,800자 |
| 화자 수 | 2명 ([A] 김도윤 게스트, [B] 인터뷰어) |
| 입력 형식 | 사전 추출 텍스트 (raw STT 모사) |
| 주제 | B2B SaaS 4년 운영 후의 후회 |

## 처리 계획

1. `transcript-agent` — 필러 제거·화자 라벨 통일 → `01_transcript.md`
2. `interview-analyst` — 핵심 발견 3개 + 인용 → `02_insights.md`
3. `blog-drafter` — H2 5개 초안 → `03_draft.md`
4. `tone-writer` — 담백한 기술 블로그 톤 정리 → `04_toned.md`
5. `md-packager` — front-matter + 푸터 + export → `workspace/post.md`

## 사용자에게 물을 것 (없음)

화자 수·분량·주제 모두 파일에 명시되어 있어 추가 질문 없이 Phase 1 으로 진행한다.
