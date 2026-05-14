# 음성 파일 안내

## 두 개의 입력 파일

```
samples/
├── podcast-ep07.m4a              ← placeholder (28 bytes)
└── podcast-ep07-transcript.txt   ← 사전 추출된 텍스트 (실제 데모용)
```

## 왜 두 개인가

`transcript-agent`는 슬라이드 시나리오상 **음성 → 텍스트** 변환을 담당하지만, 실제 Claude Code 데모에서는 음성 파일을 직접 듣지 않는다. 따라서:

- **podcast-ep07.m4a** — 강사가 "이런 음성 파일이 입력으로 들어옵니다"라고 가리키며 시연하는 **소품**. 실제 처리는 안 됨. 28바이트 헤더만 있는 placeholder.
- **podcast-ep07-transcript.txt** — `transcript-agent`가 사전 추출했다고 가정하는 **실제 입력 데이터**. 강의 중 이 파일이 실제로 다음 단계 파이프라인에 들어간다.

## 강사 안내 멘트 예시

> "실제 운영 환경이라면 transcript-agent가 음성을 받아 Whisper API 등으로 변환합니다.
> 이 워크숍에서는 시연 속도를 위해 사전 추출된 텍스트를 사용해요.
> 트랜스크립트가 어떻게 정제되어 다음 단계로 넘어가는지에 집중해 봅시다."

## 실제 음성 파일을 만들고 싶다면

본인 환경에 ffmpeg가 있으면 다음 명령으로 1분짜리 무음 m4a를 생성:

```bash
ffmpeg -f lavfi -i anullsrc=r=22050:cl=mono -t 60 -c:a aac -b:a 32k \
       -metadata title="Podcast Ep.07" \
       podcast-ep07.m4a
```

또는 본인의 실제 음성 파일을 같은 이름으로 교체해도 된다. 단, 데모 시간이 충분히 짧아야 한다 (워크숍 진행 흐름 방해 X).
