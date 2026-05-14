window.HARNESS_DATA = window.HARNESS_DATA || {};
window.HARNESS_DATA["lab04"] = {
  diagram: "pattern-2-fanout.svg",
  diagramCaption: "병렬 독립 · 종합자가 천장",
  scenario: {
    intro: "PR 한 개를 4 개의 눈이 동시에 본다. architect / security / performance / style 네 관점은 서로 의존하지 않는다 — 순차로 묶으면 4 배 느려질 뿐이다. 4 명의 결과를 모두 받은 뒤 <code>merger</code> 한 명이 우선순위를 매겨 통합 리포트 한 장으로 떨어뜨린다.",
    boxes: [
      {
        label: "A",
        title: "4 개의 에이전트 + 1 명의 종합자",
        body: "<table style=\"width:100%;border-collapse:collapse;font-size:0.95em\"><tr><th style=\"text-align:left;padding:4px 8px;border-bottom:1px solid #ccc\">에이전트</th><th style=\"text-align:left;padding:4px 8px;border-bottom:1px solid #ccc\">관점</th></tr><tr><td style=\"padding:4px 8px\"><code>architect</code></td><td style=\"padding:4px 8px\">모듈 경계 · 의존성</td></tr><tr><td style=\"padding:4px 8px\"><code>security</code></td><td style=\"padding:4px 8px\">입력 검증 · 비밀 누출</td></tr><tr><td style=\"padding:4px 8px\"><code>performance</code></td><td style=\"padding:4px 8px\">N+1 쿼리 · 핫패스</td></tr><tr><td style=\"padding:4px 8px\"><code>style</code></td><td style=\"padding:4px 8px\">네이밍 · 컨벤션</td></tr><tr><td style=\"padding:4px 8px\"><code>merger</code></td><td style=\"padding:4px 8px\">4 개를 받아 우선순위 매겨 합본</td></tr></table>",
        warn: false
      },
      {
        label: "함정",
        title: "종합자가 천장",
        body: "<code>merger</code> 가 약하면 4 명이 모은 통찰이 평탄해진다. Principles 에 <strong>\"충돌하는 의견은 약화하지 말고 병기\"</strong> 를 꼭 넣을 것. 같은 발견을 두 리뷰어가 다른 단계로 분류했다면 더 높은 단계를 채택하되 다른 분류와 이유를 한 줄 병기.",
        warn: true
      },
      {
        label: "WHY",
        title: "왜 병렬 (Fan-out) 인가",
        body: "네 개의 관점은 서로 의존하지 않는다. 보안 리뷰가 끝나야 성능을 볼 필요는 없다. → Pipeline 으로 묶으면 4 배 느려진다. Fan-out 의 정확한 사용처. 4 명은 정말로 동시에 시작한다 — 한 명이 늦어도 merger 는 기다린다.",
        warn: false
      }
    ],
    principles: [
      "충돌하는 의견은 약화하지 말고 병기한다",
      "Block · Warn · Nit 3 단계로 분류한다",
      "Block 이 1 개라도 있으면 머지를 보류한다"
    ],
    points: [
      "왜 병렬? — 네 개의 관점은 서로 의존하지 않는다. 보안 리뷰가 끝나야 성능을 볼 필요는 없다",
      "Fan-in 의 종합자(merger)가 약하면 4 명이 모은 통찰이 평탄해진다 — 충돌은 병기",
      "각 리뷰어는 자기 관점의 발견만 보고한다. 다른 관점의 발견은 무시(중복 정리는 merger 의 일)"
    ]
  },
  build: {
    intro: "Skill 1개 (code-review-team 오케스트레이터) + Agent 5개 (4 리뷰어 + merger). 4 명은 동일 메시지에서 동시 호출되고, merger 는 4 명의 결과가 모두 도착한 뒤에만 시작한다.",
    files: [
    {
      path: ".claude/skills/owasp-top10/SKILL.md",
      lang: "md",
      content: `---
name: owasp-top10
description: |
  OWASP Top 10 (2021) 카테고리 기반 보안 코드 리뷰 표준. 인젝션·민감 데이터 노출·취약한 인증·SSRF 등 10개 카테고리의 패턴 인식 규칙과 위험도 분류(Critical/High/Medium/Low)를 정의한다.
  'OWASP Top 10', '보안 취약점 검사', 'SQL 인젝션 확인', 'XSS 검사', '시크릿 누출 검사',
  '보안 코드 리뷰', '취약점 분류', 'CVE 점검', '인젝션 패턴 검출'
  등 보안 리뷰 작업에 이 스킬을 반드시 사용한다.
  단, 실제 SAST/DAST 도구 실행, 의존성 자동 업데이트, 보안 패치 자동 적용은 이 스킬의 범위가 아니다.
---

# OWASP Top 10 — 보안 리뷰 표준 (2021)

\`security-reviewer\` 에이전트가 PR diff를 받아 보안 이슈를 분류·보고할 때 따르는 표준이다. 검출은 정적 분석 도구가 아닌 **읽기 기반** 휴리스틱 패턴 인식이다.

## 10개 카테고리

| ID | 이름 | 핵심 패턴 |
|----|------|----------|
| A01 | Broken Access Control | 권한 체크 누락, IDOR (객체 직접 참조) |
| A02 | Cryptographic Failures | 평문 저장, 약한 알고리즘 (MD5/SHA1), HTTPS 미적용 |
| A03 | Injection | SQL·NoSQL·LDAP·OS Command·XSS |
| A04 | Insecure Design | 비밀번호 정책 부재, 토큰 만료 없음 |
| A05 | Security Misconfiguration | 디폴트 비밀번호, 디버그 모드 프로덕션 노출 |
| A06 | Vulnerable Components | 오래된 라이브러리 (CVE 포함) |
| A07 | Identification & Auth Failures | 약한 세션 ID, MFA 없음, 자격증명 brute force |
| A08 | Software & Data Integrity | 서명 없는 업데이트, 신뢰 안 된 deserialize |
| A09 | Security Logging Failures | 민감 정보 로깅, 감사 로그 부재 |
| A10 | Server-Side Request Forgery | 외부 URL 입력값 검증 없이 fetch |

## 휴리스틱 패턴 (PR diff에서 찾는 것)

### A03 인젝션 — 가장 자주 잡힘

\`\`\`java
// 나쁨: SQL 인젝션
String sql = "SELECT * FROM users WHERE id = " + userId;
jdbc.query(sql);

// 나쁨: OS Command 인젝션
Runtime.exec("ping " + userInput);

// 나쁨: XSS (서버 응답에 사용자 입력 그대로)
response.getWriter().write("<div>" + userInput + "</div>");
\`\`\`

검출 신호: 문자열 + 변수 concat → SQL/HTML/명령 실행.

### A02 / A09 — 시크릿·민감 로깅

\`\`\`java
// 나쁨: env 변수가 로그로 흘러간다 (이 워크숍의 PR #142 사례)
logger.info("DB connection: " + System.getenv("DB_PASSWORD"));

// 나쁨: 평문 비밀번호 저장
user.setPassword(rawPassword);  // hash 없음
\`\`\`

검출 신호: \`getenv\`, \`process.env\`, \`System.getenv\`, \`password\` 변수가 log·response·serialize 함수의 인자.

### A05 — 디폴트/디버그 설정

\`\`\`yaml
# 나쁨: production에 debug 모드
spring:
  profiles: production
  debug: true
\`\`\`

### A06 — 오래된 의존성

\`\`\`xml
<!-- 나쁨: log4j 1.x (CVE-2019-17571 등 다수) -->
<dependency>
  <groupId>log4j</groupId>
  <version>1.2.17</version>
</dependency>
\`\`\`

검출 신호: \`pom.xml\`, \`package.json\`, \`build.gradle\` 변경 시 메이저 버전이 5년+ 전 → CVE 의심.

## 위험도 분류 → 보고 라벨

| 위험도 | 보고 라벨 | 조건 |
|--------|----------|------|
| Critical | \`[BLOCK]\` | 즉각 악용 가능 (SQL i, 시크릿 노출, RCE) |
| High | \`[BLOCK]\` | 인증 후 악용 가능 (IDOR, 평문 저장) |
| Medium | \`[WARN]\` | 조건부 위험 (XSS 가능성, 디버그 노출) |
| Low | \`[NIT]\` | 베스트 프랙티스 위반 (보안 헤더 누락) |

**Block은 merger의 머지 보류 트리거다.** Critical/High는 무조건 BLOCK.

## 워크숍 PR #142 매핑

이 워크숍의 PR diff에서 본 Skill이 잡아내야 할 이슈:

- **[BLOCK] security · A02/A09**: \`logger.info(...System.getenv("DB_PASSWORD")...)\` → env 변수가 로그로 흘러감

## 보고 형식

\`security-reviewer\` 산출물 \`_workspace/parallel/security.md\`:

\`\`\`markdown
# Security Review · PR #142

## [BLOCK] A02/A09 · env 변수 로그 노출

**위치**: \`UserService.java:42\`

**코드**:
\`\`\`java
logger.info("DB connection: " + System.getenv("DB_PASSWORD"));
\`\`\`

**위험**: 로그 수집 시스템에 DB 비밀번호가 그대로 적재. Critical.

**대안**: 로깅 전 마스킹 (\`mask(password)\`) 또는 connection 객체만 노출.

## [WARN] A03 · 잠재 XSS
...

## [NIT] A06 · log4j 의존성 점검
...
\`\`\`

## 좋은 예 (대안 코드)

\`\`\`java
// 좋음
String maskedPwd = mask(System.getenv("DB_PASSWORD"));
logger.info("DB connection ready (pwd hash: {})", maskedPwd);
\`\`\`

## 흔한 오탐 회피

- \`logger.debug(...)\` 만 사용한 경우 → production에선 안 찍힘 (디버그 레벨 정책 확인)
- 테스트 코드의 하드코딩 토큰 → 테스트 픽스처면 OK (단, repo에 들어가면 안 됨)
- 주석 안의 SQL → 실행 안 됨

## 범위 밖

- 동적 분석 (실제 페이로드 주입)
- 클라우드 인프라 보안 (IAM, S3 버킷 정책 등)
- 침투 테스트
`
    },
    {
      path: ".claude/skills/performance-antipatterns/SKILL.md",
      lang: "md",
      content: `---
name: performance-antipatterns
description: |
  코드 리뷰에서 자주 잡히는 6~8가지 성능 안티패턴 카탈로그. N+1 쿼리·핫패스 안 불필요 연산·동기 I/O·O(N²) 등을 패턴 이름·코드 예·수정안으로 정의한다.
  '성능 검토', 'N+1 쿼리', '핫패스 분석', '성능 안티패턴', '성능 병목',
  '느린 코드 검사', '쿼리 최적화 검토', '성능 리뷰'
  등 성능 리뷰 작업에 이 스킬을 반드시 사용한다.
  단, 실제 프로파일링 도구 실행, APM 데이터 분석, 부하 테스트 수행은 이 스킬의 범위가 아니다.
---

# Performance Antipatterns — 성능 리뷰 표준

\`performance-reviewer\` 에이전트가 PR diff를 받아 성능 이슈를 분류·보고할 때 따르는 카탈로그다. 측정 도구가 아닌 **읽기 기반** 패턴 인식.

## 안티패턴 카탈로그

### 1. N+1 쿼리

**가장 흔한 성능 이슈.**

\`\`\`java
// 나쁨: getUserById가 루프 안에서 호출
for (Order order : orders) {
    User user = userRepository.getUserById(order.userId);
    result.add(new OrderDto(order, user));
}
\`\`\`

**검출 신호**: \`for\` / \`forEach\` / \`stream().map\` 블록 안에서 repository·DAO 호출.

**대안**:
\`\`\`java
List<Long> userIds = orders.stream().map(Order::userId).toList();
Map<Long, User> users = userRepository.findAllById(userIds);
// 그 다음에 매핑
\`\`\`

### 2. 핫패스 안의 불필요한 연산

**요청마다 호출되는 경로에서 매번 동일 작업.**

\`\`\`java
// 나쁨: HTTP 핸들러에서 매번 정규식 컴파일
@GetMapping("/search")
public List<Item> search(String q) {
    Pattern p = Pattern.compile("\\\\w+@\\\\w+");  // 매번 컴파일!
    ...
}
\`\`\`

**검출 신호**: 핸들러·필터·인터셉터 메서드 안에서 \`compile\`, \`parse\`, \`newInstance\`, \`new ObjectMapper()\`.

**대안**: static final 필드로 한 번 초기화.

### 3. 동기 I/O (블로킹)

\`\`\`java
// 나쁨: HTTP 요청 핸들러에서 외부 API 호출 동기
String result = restTemplate.getForObject(url, String.class);  // 블로킹
\`\`\`

**검출 신호**: 리액티브 컨텍스트(\`Mono\`/\`Flux\`)에서 \`block()\`, async 핸들러에서 동기 호출.

**대안**: \`WebClient.get(...).bodyToMono(...)\` + 적절한 컴포지션.

### 4. O(N²) 중첩 루프 (대용량 컬렉션)

\`\`\`java
// 나쁨: items 1만개일 때 1억 비교
for (Item a : items) {
    for (Item b : items) {
        if (a.id.equals(b.id)) ...
    }
}
\`\`\`

**검출 신호**: 중첩 \`for\` 안에서 \`equals\`/\`contains\`, 컬렉션 크기가 100+ 추정.

**대안**: \`Map<K, V>\` 인덱스로 O(N).

### 5. 컬렉션 안의 \`.contains()\` 반복

\`\`\`java
// 나쁨: List에서 contains는 O(N), 1000번 호출하면 1M
for (String key : largeList) {
    if (allowedList.contains(key)) ...  // allowedList가 List<String>
}
\`\`\`

**검출 신호**: 큰 \`List\`에 대한 \`contains\` 반복.

**대안**: \`Set\` 으로 변환 → O(1).

### 6. 캐시 미스 / 캐시 없음

\`\`\`java
// 나쁨: 자주 호출되는 함수에 캐시 없음
public BigDecimal getExchangeRate(String currency) {
    return externalApi.fetch(currency);  // 매번 외부 호출
}
\`\`\`

**검출 신호**: 외부 API 호출, 변화 적은 데이터, 호출 빈도 추정 가능.

**대안**: \`@Cacheable\`, in-memory LRU, Redis.

### 7. 큰 트랜잭션

\`\`\`java
// 나쁨: 1만건 처리를 단일 트랜잭션으로
@Transactional
public void importAll(List<Row> rows) {
    for (Row r : rows) repository.save(r);
}
\`\`\`

**검출 신호**: \`@Transactional\`이 큰 컬렉션 처리에.

**대안**: 청크 단위 (\`saveAll\`을 1000개씩) + 청크별 트랜잭션.

### 8. 불필요한 직렬화·역직렬화

\`\`\`java
// 나쁨: 매 호출마다 Object → JSON → Object 변환
String json = mapper.writeValueAsString(obj);
SomeDto dto = mapper.readValue(json, SomeDto.class);
\`\`\`

**검출 신호**: 같은 메서드 안에서 직렬화·역직렬화 연속.

**대안**: 복사 생성자 / Mapper 인터페이스.

## 위험도 분류 → 보고 라벨

| 위험도 | 보고 라벨 | 조건 |
|--------|----------|------|
| 핫패스 + 큰 N | \`[BLOCK]\` | 매 요청 + N>100 추정 |
| 핫패스 또는 큰 N | \`[WARN]\` | 자주 호출 또는 큰 데이터 |
| 콜드 패스 / 작은 N | \`[NIT]\` | 시작·일회성·소규모 |

## 워크숍 PR #142 매핑

- **[WARN] performance · N+1**: \`getUserById\` 가 \`for (Order order : ...)\` 루프 안에서 호출됨 → 안티패턴 #1

## 보고 형식

\`\`\`markdown
# Performance Review · PR #142

## [WARN] N+1 쿼리 · \`OrderService.java:78\`

...(이하 생략 — 전체 파일은 .claude/skills/<name>/SKILL.md 참조)`
    },
    {
      path: ".claude/skills/module-boundaries/SKILL.md",
      lang: "md",
      content: `---
name: module-boundaries
description: |
  Clean/Hexagonal Architecture 기준의 모듈 경계·의존성 방향 검사 표준. domain→web import 금지, 순환 의존, 레이어 위반, abstraction 누수 패턴을 정의한다.
  '모듈 경계', '의존성 방향', '아키텍처 경계', '레이어 위반', '순환 참조',
  'domain web import 금지', '클린 아키텍처 점검', '의존성 그래프 검사'
  등 아키텍처 경계 리뷰 작업에 이 스킬을 반드시 사용한다.
  단, 실제 모듈 분할 리팩터링 수행, 빌드 설정(Gradle/Maven) 변경은 이 스킬의 범위가 아니다.
---

# Module Boundaries — 아키텍처 경계 검사

\`architect-reviewer\` 에이전트가 PR diff를 받아 의존성 방향과 레이어 위반을 검토할 때 따르는 표준이다.

## 레이어 정의 (Spring/Java 컨벤션)

\`\`\`
┌──────────────────────────────────────────┐
│  web         (controller, dto, request)  │  ← HTTP 진입점
├──────────────────────────────────────────┤
│  application (use-case, orchestrator)    │  ← 트랜잭션 경계
├──────────────────────────────────────────┤
│  domain      (entity, value, policy)     │  ← 비즈니스 규칙
├──────────────────────────────────────────┤
│  infrastructure (repository impl, ext)   │  ← DB·외부 API 구현
└──────────────────────────────────────────┘
\`\`\`

## 의존성 방향 규칙

**의존은 위에서 아래로만**. 절대 역방향 금지.

| 허용 | 금지 |
|------|------|
| \`web → application\` | \`web ← application\` |
| \`application → domain\` | \`domain → application\` |
| \`infrastructure → domain\` (인터페이스 구현) | \`domain → infrastructure\` |
| \`web → domain\` (읽기 전용 DTO 매핑) | \`domain → web\` ⚠ |

**가장 흔한 위반**: \`domain → web\` 또는 \`domain → infrastructure\`

## 휴리스틱 패턴

### 1. import 검사

\`\`\`java
// 나쁨: domain 패키지가 web의 dto를 import
// 파일: com/example/domain/User.java
import com.example.web.dto.UserDto;  // ⚠ 역방향 의존
\`\`\`

검출 신호: 패키지 경로의 상위 모듈을 import.

### 2. 순환 의존

\`\`\`
domain.User → application.UserService → domain.User (OK, 같은 레이어 X)

domain.User → infrastructure.UserRepository → domain.User  ← 순환?
\`\`\`

infrastructure가 domain interface를 구현하는 건 순환 아님 (DIP). 단 infra의 클래스를 domain이 직접 참조하면 순환.

### 3. abstraction 누수

\`\`\`java
// 나쁨: domain이 JPA 어노테이션에 의존
@Entity  // import javax.persistence.Entity — JPA는 infra 기술
public class Order {
    @Id Long id;
}
\`\`\`

검출 신호: domain 패키지의 클래스에 프레임워크 의존성 어노테이션 (\`@Entity\`, \`@Component\`, \`@JsonProperty\`).

**대안 1**: domain은 순수 POJO + 별도 infrastructure 패키지의 \`OrderEntity\`로 매핑.
**대안 2**: 프로젝트 규모상 단순화 허용 → 명시적 결정으로 기록 (\`docs/adr/\`).

### 4. 트랜잭션 경계 위반

\`\`\`java
// 나쁨: domain이 @Transactional
public class OrderPolicy {
    @Transactional  // 트랜잭션은 application 레이어
    public void cancel(Order o) {...}
}
\`\`\`

\`@Transactional\`은 application 레이어에서만.

## 워크숍 PR #142 매핑

- **[WARN] architect · 역방향 의존**: \`domain\` 패키지의 클래스가 \`web\` 패키지의 DTO를 import → 의존성 방향 규칙 위반

## 위험도 분류

| 위험도 | 보고 라벨 | 조건 |
|--------|----------|------|
| 양방향 의존·순환 | \`[BLOCK]\` | 빌드 실패 또는 머지 후 회복 어려움 |
| 역방향 import | \`[WARN]\` | 한 곳만 고치면 됨, 전염 위험 있음 |
| abstraction 누수 | \`[WARN]\` 또는 \`[NIT]\` | 프로젝트 컨벤션에 따라 |

## 보고 형식

\`\`\`markdown
# Architecture Review · PR #142

## [WARN] domain → web 역방향 import

**파일**: \`com/example/domain/User.java:7\`

**문제**:
\`\`\`java
import com.example.web.dto.UserDto;
\`\`\`

domain 레이어가 web 레이어를 알면 안 된다. 의존성 방향이 역방향이 되어, 다음 web 변경 시 domain이 깨진다.

**대안**:
1. \`domain.User\` 에는 dto import 제거
2. 변환은 \`application\` 레이어의 매퍼로 이동

## [NIT] @Entity 어노테이션 위치
...
\`\`\`

## 좋은 예 — 깔끔한 레이어

\`\`\`java
// web/UserController.java
public class UserController {
    private final FindUserUseCase findUser;  // application

    @GetMapping("/users/{id}")
    public UserDto get(Long id) {
        User user = findUser.byId(id);   // domain.User
        return UserDto.from(user);        // web → domain 매핑은 OK
    }
}
\`\`\`

\`\`\`java
// application/FindUserUseCase.java
public class FindUserUseCase {
    private final UserRepository repo;  // domain interface

    public User byId(Long id) {
        return repo.findById(id).orElseThrow();
    }
}

...(이하 생략 — 전체 파일은 .claude/skills/<name>/SKILL.md 참조)`
    },
    {
      path: ".claude/skills/code-style-ko/SKILL.md",
      lang: "md",
      content: `---
name: code-style-ko
description: |
  한국어 환경의 코드 컨벤션 표준 — Java/Kotlin/TypeScript의 네이밍 (camelCase/PascalCase), 함수 길이, 매직 넘버, 한국어 식별자 비추천, 주석 톤을 정의한다.
  '코드 스타일 검토', '네이밍 컨벤션', '코드 컨벤션', '함수 길이 검사', '매직 넘버',
  'PascalCase camelCase', '주석 검사', '리네이밍 제안'
  등 스타일 리뷰 작업에 이 스킬을 반드시 사용한다.
  단, 자동 포매터 실행, 린터 설정 변경, ESLint/Checkstyle 룰 추가는 이 스킬의 범위가 아니다.
---

# Code Style — 한국어 환경 코드 컨벤션

\`style-reviewer\` 에이전트가 PR diff를 받아 스타일·네이밍 이슈를 검토할 때 따르는 표준이다. 대부분 \`[NIT]\` 수준이지만, 가독성 저해가 큰 경우 \`[WARN]\`까지.

## 네이밍 컨벤션 표

| 언어 | 클래스 | 메서드/함수 | 변수 | 상수 | 패키지 |
|------|--------|------------|------|------|--------|
| Java | PascalCase | camelCase | camelCase | UPPER_SNAKE | lowercase.dot |
| Kotlin | PascalCase | camelCase | camelCase | UPPER_SNAKE | lowercase.dot |
| TypeScript | PascalCase | camelCase | camelCase | UPPER_SNAKE | kebab-case (파일명) |
| Python | PascalCase | snake_case | snake_case | UPPER_SNAKE | snake_case |

## 식별자 규칙

### 1. 의미 있는 이름

\`\`\`java
// 나쁨
int d;             // d가 뭐?
String[] arr;
List<Item> list;

// 좋음
int daysUntilExpiry;
String[] productNames;
List<Item> filteredItems;
\`\`\`

### 2. 동사로 시작하는 함수

\`\`\`java
// 나쁨
public User userById(Long id) {...}      // 동사 없음

// 좋음
public User findUserById(Long id) {...}
public User getUserById(Long id) {...}   // get은 caching·계산 없는 단순 조회
\`\`\`

함수 prefix 가이드:
- \`get\` — 단순 필드 반환·캐싱 조회
- \`find\` — 검색·DB 조회 (Optional 반환 추천)
- \`create\` / \`build\` — 새 객체 생성
- \`update\` — 기존 객체 수정
- \`delete\` / \`remove\` — 삭제
- \`is\` / \`has\` / \`can\` — boolean

### 3. 한국어 식별자 — 비추천

\`\`\`java
// 나쁨 (가능하긴 하지만)
String 사용자이름 = ...;
public boolean is유효() {...}

// 좋음
String userName = ...;
public boolean isValid() {...}
\`\`\`

이유: 빌드 도구·검색·git diff에서 깨질 가능성. 변수명은 영어, **주석은 한국어**가 한국 팀의 표준.

### 4. PascalCase 위반 (클래스 / DTO)

\`\`\`java
// 나쁨 (이 워크숍의 PR #142 사례)
public class userDto {        // 소문자로 시작
    private String User_name;  // snake_case
}

// 좋음
public class UserDto {
    private String userName;
}
\`\`\`

### 5. 매직 넘버

\`\`\`java
// 나쁨
if (status == 3) {...}
Thread.sleep(86400000);

// 좋음
if (status == OrderStatus.SHIPPED.code) {...}  // = 3
Thread.sleep(Duration.ofDays(1).toMillis());
\`\`\`

매직 넘버 = "왜 이 숫자?" 즉답 안 되는 숫자. 0, 1, -1, 2(짝수 판단)는 일반적으로 OK.

## 함수 길이 가이드

| 길이 | 등급 |
|------|------|
| ≤ 15 줄 | 좋음 |
| 16~30 줄 | 양호 |
| 31~50 줄 | 보통 (분리 검토) |
| 51~80 줄 | 길다 (\`[NIT]\`) |
| 81+ 줄 | 매우 길다 (\`[WARN]\`) |

긴 함수의 신호: \`if\`/\`else\` 중첩 3단계 이상, 빈 줄로 구분된 "단락"이 4개+.

## 주석 톤 (한국어)

| 좋은 주석 | 나쁜 주석 |
|----------|----------|
| 왜 이렇게 했는지 (Why) | 코드를 그대로 다시 읽는 것 |
| 외부 참조 (\`// 참조: 사규집 §15\`) | \`// i를 1 증가\` |
| TODO + 이슈 번호 (\`// TODO #123\`) | \`// 임시\` (정보 없음) |
| 함정 / 주의 (\`// 주의: 동시성 X\`) | 변경 이력 (그건 git log에) |

\`\`\`java
// 좋음
// 주의: 이 메서드는 main 스레드에서만 호출. UI 동기화 보장.

// 나쁨
// 사용자를 찾는다
public User findUser(...) { ... }   // 함수명에 이미 있음
\`\`\`

## 워크숍 PR #142 매핑

- **[NIT] style · PascalCase 위반**: DTO 클래스 이름 \`userDto\` → \`UserDto\`
- **[NIT] style · 필드 네이밍**: \`User_name\` → \`userName\`

위 두 NIT는 merger의 리포트에서 \`security ↔ style 충돌\` 케이스에 등장 (security가 같은 라인을 BLOCK으로 본 경우).

## 위험도 분류

| 위험도 | 보고 라벨 |
|--------|----------|
| 컨벤션 명백 위반, 자동 수정 가능 | \`[NIT]\` |
| 가독성 큰 저해 (긴 함수, 의미 없는 이름) | \`[WARN]\` |
| 빌드 실패 유발 | \`[BLOCK]\` (드뭄) |

## 보고 형식

\`\`\`markdown
# Style Review · PR #142


...(이하 생략 — 전체 파일은 .claude/skills/<name>/SKILL.md 참조)`
    },
      {
        path: ".claude/skills/code-review-team/SKILL.md",
        lang: "md",
        content: `---
name: code-review-team
description: |
  PR diff 한 개를 4명의 전문가(architect / security / performance / style) 가 동시에 리뷰하고
  merger 1명이 우선순위 매겨 통합 리포트를 만드는 Fan-out/Fan-in 팀. Block/Warn/Nit 3단계
  분류와 충돌 의견 병기 규칙을 강제한다.
  'PR 리뷰', '코드 리뷰 팀', '병렬 리뷰', 'PR 봐줘', '4관점 리뷰', '통합 리뷰',
  '코드 리뷰 해줘', 'PR diff 분석' 등 코드 리뷰 전반에 이 스킬을 반드시 사용한다.
  단, 자동 머지 실행, 실제 CI/CD 통합, 코드 자동 수정 패치 적용은 이 스킬의 범위가 아니다.
---

# Code Review Team — 4 관점 동시 리뷰 + 통합

PR diff 한 개를 네 개의 눈으로 동시에 보고 한 명의 종합자가 우선순위를 매기는 Fan-out/Fan-in 팀.

\`\`\`
         ┌─→ architect-reviewer  ┐
PR diff ─┼─→ security-reviewer   ┤
         ├─→ performance-reviewer├─→ merger → workspace/merged_report.md
         └─→ style-reviewer      ┘
\`\`\`

## 에이전트 구성

| 팀원 | 관점 | 출력 |
|------|------|------|
| \`architect-reviewer\` | 모듈 경계 · 의존성 | \`parallel/architect.md\` |
| \`security-reviewer\` | 입력 검증 · 비밀 누출 | \`parallel/security.md\` |
| \`performance-reviewer\` | N+1 쿼리 · 핫패스 | \`parallel/performance.md\` |
| \`style-reviewer\` | 네이밍 · 컨벤션 | \`parallel/style.md\` |
| \`merger\` | 4개 받아 우선순위 매겨 합본 | \`merged_report.md\` |

## 워크플로우

### Phase 1 — 4 관점 병렬 리뷰 (Fan-out)

단일 메시지에서 4 개 에이전트를 동시 호출한다 (\`run_in_background: true\`).
각 리뷰어는 자기 관점의 발견만 보고한다. 다른 관점의 발견은 무시(중복 정리는 merger 의 일).

발견은 다음 3 단계 라벨 중 하나:
- \`[BLOCK]\` — 머지를 보류해야 할 결함
- \`[WARN]\` — 머지 전후 처리가 필요한 위험 신호
- \`[NIT]\` — 작은 개선 제안

### Phase 2 — 통합 (Fan-in)

\`merger\` 가 4 개 파일을 모두 읽고 통합 리포트를 만든다. merger 의 Principles 3 개:

1. 충돌하는 의견은 약화하지 말고 병기한다.
2. Block / Warn / Nit 3단계로 분류한다.
3. Block 이 1개라도 있으면 머지를 보류한다.

## 작업 원칙

- 4 명은 정말로 동시에 시작한다. 한 명이 늦어도 merger 는 기다린다.
- merger 는 4 명의 발견을 임의로 약화/병합하지 않는다. 충돌은 병기.
- diff 외 추가 정보가 필요하면 각 리뷰어가 직접 Grep 으로 본 PR 외 파일을 확인할 수 있다. 단 수정은 금지.
- 모든 산출물은 한국어 격식체. 코드 식별자만 영문 유지.

...(이하 생략 — Phase 0/3, 통합 리포트 표준 형식, Try Yourself cost-reviewer 추가)`
      },
      {
        path: ".claude/agents/architect-reviewer.md",
        lang: "md",
        content: `---
name: architect-reviewer
description: PR diff 에서 모듈 경계와 의존성 위반을 찾는 아키텍처 리뷰어. code-review-team 의 Fan-out 4명 중 1명.
tools: Read, Grep
model: opus
---

# Role

당신은 모듈 경계와 의존성을 보는 아키텍처 리뷰어입니다. PR diff 한 개를 받아, 모듈 간 의존 방향, 레이어 위반, 순환 의존, 공개 API 변경의 영향만 봅니다. 보안·성능·스타일은 무시합니다(다른 리뷰어의 일).

# Principles

1. 모듈 경계 위반은 무조건 본다 — domain → web, infra → application 같은 역방향 의존은 BLOCK 후보.
2. 순환 의존이 새로 생기면 BLOCK. 기존 순환을 더 깊게 만들면 WARN.
3. 공개 API 변경(메서드 시그니처, 응답 스키마) 은 호환성 영향을 1줄 명시.
4. 같은 PR 안에서 같은 위반이 반복되면, 위반당 1줄이 아니라 패턴 1줄 + 발생 위치 목록.
5. 추측을 단정하지 않는다. 확실치 않으면 NIT 로 분류하고 "확인 필요" 명시.

# Protocols

## Input
- \`samples/pr-<번호>.diff\`
- 선택: \`samples/pr-<번호>-context.md\`, Grep 으로 본 PR 외 파일

## Output
- \`workspace/_workspace/parallel/architect.md\``
      },
      {
        path: ".claude/agents/security-reviewer.md",
        lang: "md",
        content: `---
name: security-reviewer
description: PR diff 에서 입력 검증 누락·비밀 누출·인증/인가 결함을 찾는 보안 리뷰어. code-review-team 의 Fan-out 4명 중 1명.
tools: Read, Grep
model: opus
---

# Role

당신은 코드 보안 분석가입니다. PR diff 한 개를 받아, OWASP Top 10 관점에서 다음만 봅니다 — 입력 검증 누락, 비밀(환경변수·토큰) 누출, 인증/인가 결함, 민감 데이터 로깅. 성능·스타일·아키텍처는 무시합니다.

# Principles

1. 비밀 누출은 무조건 BLOCK — \`process.env\`, \`System.getenv\`, 토큰/키가 로그·응답·예외 메시지로 흘러가면 즉시 BLOCK.
2. 입력 검증 누락은 외부 입력(HTTP, 파일, 큐) 인 경우 BLOCK, 내부 입력이면 WARN.
3. 위험도 기반 우선순위 — CVSS 와 악용 가능성을 함께 고려. 이론적 위험은 NIT 로.
4. 안전한 대안 코드를 반드시 같이 제시한다. 1~3줄 스니펫.
5. 공격 시나리오를 공격자 관점에서 1줄로 설명.

# Protocols

## Input
- \`samples/pr-<번호>.diff\`
- 선택: \`samples/pr-<번호>-context.md\`

## Output
- \`workspace/_workspace/parallel/security.md\``
      },
      {
        path: ".claude/agents/performance-reviewer.md",
        lang: "md",
        content: `---
name: performance-reviewer
description: PR diff 에서 N+1 쿼리·핫패스 비효율·동기 블로킹을 찾는 성능 리뷰어. code-review-team 의 Fan-out 4명 중 1명.
tools: Read, Grep
model: opus
---

# Role

당신은 성능 리뷰어입니다. PR diff 한 개를 받아 다음만 봅니다 — N+1 쿼리, 루프 안의 외부 호출(DB/HTTP), 핫패스 알고리즘 복잡도, 동기 블로킹, 불필요한 직렬화. 보안·아키텍처·스타일은 무시합니다.

# Principles

1. N+1 쿼리는 루프 안에서 DB 호출 시그니처(findById, getXxx, query) 가 보이면 즉시 WARN. 명백한 경우 BLOCK.
2. 외부 I/O 가 루프 안에 있고 batch API 가 가능하면 WARN + 대안 1줄 명시.
3. 알고리즘 복잡도 변경 — O(n) 이 O(n²) 가 되면 WARN. 핫패스면 BLOCK.
4. 마이크로 최적화는 NIT 또는 보고하지 않음. 측정 가능한 영향만 보고.
5. 측정 근거가 없으면 "추정" 명시. 단정하지 않는다.

# Protocols

## Input
- \`samples/pr-<번호>.diff\`
- 선택: Grep 으로 본 PR 외 파일 (호출 빈도 파악용)

## Output
- \`workspace/_workspace/parallel/performance.md\``
      },
      {
        path: ".claude/agents/style-reviewer.md",
        lang: "md",
        content: `---
name: style-reviewer
description: PR diff 에서 네이밍·코드 컨벤션·포매팅 위반을 찾는 스타일 리뷰어. code-review-team 의 Fan-out 4명 중 1명.
tools: Read, Grep
model: opus
---

# Role

당신은 코드 스타일 리뷰어입니다. PR diff 한 개를 받아 다음만 봅니다 — 변수/메서드/클래스 네이밍, 언어 컨벤션(camelCase / snake_case / PascalCase), 들여쓰기, 매직 넘버, 불필요한 주석/죽은 코드. 보안·성능·아키텍처는 무시합니다.

# Principles

1. 스타일 위반은 대부분 NIT. BLOCK 은 안 한다. 단 공개 API 명명이 컨벤션을 크게 어기면 WARN.
2. 같은 위반이 여러 곳에서 반복되면 위반당 1줄이 아니라 "패턴 + 발생 위치 N개" 로 정리.
3. 자동 포매터로 해결되는 항목은 보고하지 않거나 한 줄로 묶는다.
4. 매직 넘버(0, 1, -1 제외) 가 있으면 상수 추출 제안.
5. 다른 리뷰어 영역(보안/성능/아키텍처) 으로 보이면 보고하지 않는다.

# Protocols

## Input
- \`samples/pr-<번호>.diff\`

## Output
- \`workspace/_workspace/parallel/style.md\` (BLOCK 섹션은 원칙적으로 비어 있음)`
      },
      {
        path: ".claude/agents/merger.md",
        lang: "md",
        content: `---
name: merger
description: 4명의 리뷰어 결과를 받아 우선순위 매겨 통합 리포트를 만드는 종합자. code-review-team 의 Fan-in.
tools: Read, Write
model: opus
---

# Role

당신은 코드 리뷰 종합자입니다. architect / security / performance / style 4 명의 리뷰 결과를 모두 받아, 한 장의 통합 리포트를 만듭니다. 종합자가 약하면 4 명이 모은 통찰이 평탄해진다 — 그래서 다음 세 원칙은 절대 양보하지 않습니다.

# Principles

1. 충돌하는 의견은 약화하지 말고 병기한다.
2. "Block" · "Warn" · "Nit" 3 단계로 분류한다.
3. Block 이 1 개라도 있으면 머지를 보류한다.

# Protocols

## Input
- \`workspace/_workspace/parallel/architect.md\`
- \`workspace/_workspace/parallel/security.md\`
- \`workspace/_workspace/parallel/performance.md\`
- \`workspace/_workspace/parallel/style.md\`

## Output
- \`workspace/_workspace/merged_report.md\` + \`workspace/merged_report.md\` (사본)

# 충돌 처리 가이드

- 같은 라인에 대해 두 리뷰어가 반대 의견을 내면 — 어느 한쪽으로 합치지 말고, 한 항목 안에 두 의견을 모두 적는다.
- 같은 발견을 두 리뷰어가 다른 단계로 분류했다면 — 더 높은 단계(BLOCK > WARN > NIT) 를 채택하되, 다른 분류와 그 이유를 한 줄로 병기한다.
- 머지 보류 결정은 BLOCK 1개로 충분하다. "전반적으로 양호하니까 OK" 같은 약화 금지.`
      }
    ],
    notes: [
      { label: "POINT", text: "Phase 1 의 4 명은 단일 메시지에서 동시 호출(<code>run_in_background: true</code>). 토큰은 동시에 소비된다. 한 명이 늦어도 merger 는 기다린다." },
      { label: "POINT", text: "merger 의 Principles 3 줄(충돌 병기 / Block·Warn·Nit / Block 1건이면 보류)이 슬라이드 16쪽 그대로 박힌다. 이게 흔들리면 종합자가 천장이 된다." },
      { label: "POINT", text: "각 리뷰어는 자기 관점만 본다. style 리뷰어는 보안 발견을 봐도 보고하지 않는다 — 중복 정리는 merger 의 일이다." }
    ]
  },
  run: {
    setup: "cd labs/04-code-review-team\nclaude",
    prompts: [
      {
        title: "1. 팀 자동 구성 — 메타 스킬 발동",
        text: "code-review-team 하네스 만들어줘. Fan-out 4명 + merger 1명. 입력은 PR diff, 출력은 우선순위 매긴 통합 리포트.",
        note: "<code>harness:harness</code> 메타 스킬이 발동해 4명의 리뷰어와 1명의 merger 를 정의하고, <code>code-review-team</code> 오케스트레이터를 만든다. merger 의 Principles 3 개가 슬라이드 16쪽 그대로 박힌다."
      },
      {
        title: "2. 실제 PR 리뷰 — 4명이 동시에 본다",
        text: "PR #142 리뷰해줘.",
        note: "<code>code-review-team</code> 트리거 매칭 → <code>samples/pr-142.diff</code> + <code>samples/pr-142-context.md</code> 자동 로딩 → 4 리뷰어 병렬 실행 → merger 합본. 토큰은 동시에 소비된다."
      }
    ],
    console: [
      { text: "[L1] 'code-review-team' 트리거 매칭", cls: "log-dim" },
      { text: "[FAN-OUT] 4명 병렬 시작 (토큰 동시 소비)", cls: "log-step" },
      { text: "  ├─ architect: 모듈 경계 검사 중...", cls: "log-dim" },
      { text: "  ├─ security: 입력 검증·비밀 누출 검사 중...", cls: "log-dim" },
      { text: "  ├─ performance: N+1·핫패스 검사 중...", cls: "log-dim" },
      { text: "  └─ style: 네이밍·컨벤션 검사 중...", cls: "log-dim" },
      { text: "[FAN-IN] merger: 4개 리뷰 수신, 충돌 병기·우선순위 매김", cls: "log-step" },
      { text: "[OK] workspace/merged_report.md 저장 · BLOCK 1, WARN 3", cls: "log-bad" }
    ],
    expected: [
      "workspace/merged_report.md",
      "workspace/_workspace/parallel/architect.md",
      "workspace/_workspace/parallel/security.md",
      "workspace/_workspace/parallel/performance.md",
      "workspace/_workspace/parallel/style.md"
    ],
    snippet: [
      {
        path: "expected/_workspace/merged_report.md",
        lang: "md",
        content: `# 통합 리뷰 — PR #142

> 결론: 🔴 머지 보류 (Block 1건)
> 출처: architect / security / performance / style 4 명 + merger

## 🔴 BLOCK (1)
- security: env 변수가 로그로 흘러간다. — \`notification-service/.../web/DigestController.java:32\` (출처: security)
  - 공격 시나리오: 로그 수집 시스템 접근자가 \`DIGEST_API_TOKEN\`, \`SMTP_PASSWORD\`, \`System.getenv()\` 전체를 평문으로 본다.
  - 권장 조치: 환경 변수는 절대 로깅하지 않는다. 디버그가 필요하면 마스킹.

## 🟡 WARN (3)
- performance: getUserById 가 루프 안. — \`notification-service/.../application/DigestService.java:27\` (출처: performance)
  - 같은 PR 에 추가된 \`getUsersByIds(List<Long>)\` 를 써서 1회 호출로 줄인다.
- architect: domain 이 web 을 import. — \`notification-service/.../domain/User.java:3\` (출처: architect)
  - \`application/DigestService.java:6\` 에도 동일 위반 — application 이 web.dto 를 직접 반환. 변환은 web 레이어에서.
- security ↔ style 충돌 → 두 의견 다 기록. — \`notification-service/.../web/DigestController.java:36\`
  - security: 사용자 ID 로깅의 PII 정책 확인 필요 (NIT 단계, 정책에 따라 격상 가능).
  - style: 구조화 파라미터를 쓴 현재 로그 메시지는 가독성이 좋아 그대로 유지 권장.

## 🟢 NIT (4)
- architect: \`UserRepository.getUsersByIds()\` 가 추가됐지만 이번 PR 에서 사용 안 됨 — \`notification-service/.../domain/UserRepository.java:5\` (출처: architect)
- style: 필드 네이밍 PascalCase 위반 (\`DigestService\` → \`digestService\`) — \`web/DigestController.java:23\`, \`domain/User.java:7\` (출처: style)
- style: 매직 넘버 + public 가변 — \`web/DigestController.java:42\`, \`48\` (출처: style)
- performance: ArrayList 초기 용량 미지정 (영향 미미) — \`application/DigestService.java:24\` (출처: performance)

## 권장 다음 액션

1. **BLOCK 부터**: env 변수 로깅 라인 제거 또는 마스킹. 머지 보류 사유 해제 후 재리뷰.
2. **WARN 처리 순서**:
   - performance — N+1 을 \`getUsersByIds()\` 로 일괄 조회로 교체.
   - architect — \`application\` 과 \`domain\` 의 web 의존 제거.
   - 충돌 항목 — security 의 PII 정책 결정을 먼저 (정책에 따라 style 결론이 바뀐다).
3. **NIT** — 위 1·2 처리 후 같은 PR 에서 정리.`
      }
    ]
  },
  tryYourself: {
    intro: "슬라이드 16쪽 Try Yourself + PROMPTS.md §3 — 5 번째 관점 <code>cost-reviewer</code> 를 추가해 AWS 비용 영향을 본다. Fan-out 패턴의 진짜 확장성을 체감하는 변형.",
    tasks: [
      {
        title: "cost-reviewer 추가 — AWS 비용 관점",
        body: "5 번째 에이전트로 <code>cost-reviewer</code> 를 끼운다. PR diff 에서 EC2/RDS/Lambda 호출 빈도, S3 PUT/GET 비용, CloudWatch 로그 양 같은 비용 신호를 본다. <code>merger</code> 의 Principles 에 한 줄을 추가해 cost 발견을 받아들이게 만든다.",
        steps: [
          "Claude Code 에 아래 프롬프트를 그대로 입력",
          ".claude/agents/cost-reviewer.md 가 생성되는지 확인",
          "code-review-team SKILL.md 의 Phase 1 표에 5번째 행이 추가되는지 확인",
          "merger.md 의 Principles 4번이 추가되는지 확인",
          "같은 PR 을 다시 돌려 5 명이 동시에 출발하는지 본다"
        ],
        prompt: "code-review-team 에 5번째 관점 cost-reviewer 를 추가해줘. AWS 비용 영향을 본다. merger 의 Principles 에는 \"cost 발견은 NIT 가 아닌 WARN 부터\" 한 줄을 추가.",
        expect: "<code>cost-reviewer.md</code> 생성 + Phase 1 표 5행 + merger.md Principles 4번 추가. 다음 실행에서 <code>parallel/cost.md</code> 가 추가로 생긴다."
      },
      {
        title: "부분 호출 — 한 명만",
        body: "특정 관점만 빠르게 보고 싶을 때. merger 를 거치지 않고 단일 리뷰만 출력. 4 명 합본보다 빠르지만, 충돌 항목과 우선순위 통합은 빠진다.",
        steps: [
          "아래 프롬프트 실행",
          "<code>workspace/_workspace/parallel/security.md</code> 만 만들어지는지 확인",
          "merger 가 호출되지 않는지 콘솔에서 확인"
        ],
        prompt: "security-reviewer 만 PR #142 봐줘.",
        expect: "<code>parallel/security.md</code> 단일 파일만 생성. <code>merged_report.md</code> 는 생성되지 않음."
      },
      {
        title: "일관성 검증 — 같은 PR 두 번",
        body: "표면 문장은 매번 달라도, 다음은 동일해야 한다 — BLOCK 개수, 머지 보류 결론, 충돌 의견 병기 여부. 그게 Principles 가 박힌 효과다.",
        steps: [
          "PR #142 를 두 번 연속 리뷰",
          "두 리포트의 BLOCK 개수와 결론 한 줄을 비교",
          "표면 문장 변동은 허용, 분류·결론 변동은 Principles 실패 신호"
        ],
        prompt: "PR #142 다시 리뷰해줘.",
        expect: "BLOCK 1건·머지 보류 결론이 두 번 모두 동일. 충돌 항목(security ↔ style)이 두 번 모두 병기."
      }
    ]
  }
};
