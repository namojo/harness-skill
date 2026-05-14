# CS 등급표

supervisor 의 Principles 1 번 ("의도가 2 개 이상 보이면, 우선순위가 높은 것 (CS 등급표) 부터 처리한다") 이 참조하는 표.

## 우선순위 (높음 → 낮음)

```
tech > refund > account > general
```

| 등급 | 의도 라벨 | 처리 워커 | 이유 |
|------|----------|----------|------|
| 1 | `tech_defect` | tech-worker | 제품 결함은 환불·교환의 근거가 된다. 사실 확인이 먼저. |
| 2 | `refund_intent` | refund-worker | 환불은 정책·금액이 걸리므로 두 번째. 단독 의도면 단독 처리. |
| 3 | `account_issue` | account-worker | 계정은 단독 사안인 경우가 많아 다른 의도와 거의 겹치지 않는다. |
| 4 | `general` | response-composer 직접 | 정보 문의·인사 등. 별도 워커 없이 양해 메시지로 종결. |

## 분기 규칙

- 단일 의도: 해당 등급의 워커 하나만 호출.
- 복합 의도: 등급이 높은 워커 먼저 → 결과를 보고 다음 워커 호출 여부 결정.
- `tech + refund`: tech 부터. tech 가 `hardware_defect` / `software_defect` 이면 refund 호출. `user_error` / `normal_operation` 이면 refund 건너뜀.
- `account + refund`: account 부터. account 가 본인 확인 통과 안 되면 refund 보류.

## 분류 불가

- 의도 라벨을 하나도 못 붙이면 사용자에게 한 번 되묻는다. 추측으로 호출하지 않는다.

## Try Yourself — 분노 톤 트리거

분노 톤이 감지되면 등급표를 무시하고 즉시 `human-handoff-worker` 만 호출한다. supervisor 의 Principles 4 번을 켜야 발동.
