<!-- VOSS_MANAGED_FILE bundle="basic" version="starter-v1" file="doc/README.md" sourceSet="starter-core" sourceVersion="starter-core-2026-08-27.1" sourceUpdatedAt="2026-08-27" -->
# traffic-checklist 작업 안내

## 문서 기준 정보
- 문서 버전: `starter-core-2026-08-27.1`
- 최종 갱신일: `2026-08-27`
- 기준 묶음: 스타터 핵심 문서 기준

이 문서는 이 프로젝트에서 사용자가 먼저 읽는 작업 안내 문서입니다.

## 이 문서의 역할

- 어떤 문서를 먼저 읽고 어떤 순서로 AI와 협업할지 안내합니다.
- 기능 질의부터 기획, 설계, 구현, 검증, 보안 점검까지 기본 흐름을 설명합니다.
- 저장소 실행/설치/개발 환경 정보는 루트 `README.md`를 참고하게 연결합니다.

## 먼저 확인할 문서

1. `doc/README.md`
2. 실행 방법, 설치 방법, 개발 환경 정보 확인이 필요하면 루트 `README.md`
3. AI에게 작업을 맡길 때는 `doc/voss-starter/START_HERE.md`
4. 새 AI 대화를 시작할 때는 `doc/voss-starter/AI_개발시작_프롬프트.md`
5. 보안 점검을 진행할 때는 `doc/voss-starter/VOSS_AI통합보안점검.md`와 `doc/voss-starter/tools/security_scan.py`만 사용합니다.

## AI에게 문서를 읽히는 순서

1. `doc/README.md`
2. `doc/voss-starter/START_HERE.md`
3. `doc/voss-starter/AI_개발시작_프롬프트.md`
4. 배포 후 보안 점검 단계라면 `doc/voss-starter/VOSS_AI통합보안점검.md`와 `doc/voss-starter/tools/security_scan.py`
5. 필요하면 루트 `README.md`
6. 현재 번들 핵심 문서
   - `doc/voss-starter/index/문서색인.md`
   - `doc/voss-starter/status/현재진행상태.md`
   - `doc/voss-starter/rules/문서관리규칙.md`
   - `doc/voss-starter/rules/기술기준.md`
   - `doc/voss-starter/rules/저장및데이터정책.md`
   - `doc/voss-starter/rules/배포및환경변수정책.md`
   - `doc/voss-starter/plans/기획서_템플릿.md`
   - `doc/voss-starter/design/설계서_템플릿.md`
   - `doc/voss-starter/implementation/구현계획_템플릿.md`
   - `doc/voss-starter/testing/하네스검사_템플릿.md`
   - `doc/voss-starter/testing/정합성점검_템플릿.md`

## 기본 작업 순서

1. 기능을 왜 만드는지와 성공 기준을 먼저 정리합니다.
2. 현재 번들에 맞는 문서를 먼저 작성하거나 갱신합니다.
3. 설계를 확정한 뒤 구현을 진행합니다.
4. 구현 후 하네스 또는 테스트를 수행합니다.
5. 문서-구현 정합성을 다시 맞춥니다.
6. 운영에 반영할 버전을 배포합니다.
7. 배포 후 `VOSS_AI통합보안점검.md`와 `tools/security_scan.py`로 현재 운영 버전을 점검합니다.
8. 문제를 수정했다면 다시 커밋·push하고 스캐너와 AI 점검을 처음부터 다시 수행합니다.
9. 통합 점검 문서의 결과 확정 기준에 따라 원본 보고서들을 생성합니다.
10. 보고서가 준비된 뒤 VOSS 보안 점검 탭에서 제출 토큰을 발급해 원본 파일과 구조화 결과를 바로 제출합니다.

## 현재 번들 핵심 문서

- 번들 유형: 기본 스타터 번들
- 번들 요약: 회원, 관리자, 운영 기능이 있는 중대형 웹 서비스용 문서 구조입니다.
- `doc/voss-starter/index/문서색인.md`
- `doc/voss-starter/status/현재진행상태.md`
- `doc/voss-starter/rules/문서관리규칙.md`
- `doc/voss-starter/rules/기술기준.md`
- `doc/voss-starter/rules/저장및데이터정책.md`
- `doc/voss-starter/rules/배포및환경변수정책.md`
- `doc/voss-starter/plans/기획서_템플릿.md`
- `doc/voss-starter/design/설계서_템플릿.md`
- `doc/voss-starter/implementation/구현계획_템플릿.md`
- `doc/voss-starter/testing/하네스검사_템플릿.md`
- `doc/voss-starter/testing/정합성점검_템플릿.md`

## 문서 역할 구분

- `README.md`: 저장소 소개, 설치/실행, 개발 환경 정보
- `doc/README.md`: 사용자가 읽는 작업 안내와 AI 협업 순서
- `doc/voss-starter/START_HERE.md`: AI와 시스템이 참고하는 스타터 번들 구조 안내
- `doc/voss-starter/AI_개발시작_프롬프트.md`: 새 AI 대화에 바로 붙여 넣는 시작 프롬프트
- `doc/voss-starter/VOSS_AI통합보안점검.md`: AI 점검, 상세 기준, 원본 보고서 생성, VOSS 제출을 한 번에 안내하는 문서
- `doc/voss-starter/tools/security_scan.py`: 기계 점검 결과와 코드·파일목록 SHA-256 지문을 생성하는 공식 스캐너

## 주의할 점

- `doc/voss-starter` 아래 문서는 VOSS가 관리하는 기본 문서입니다.
- 기본 문서를 삭제하거나 이름을 바꾸지 말고, 필요한 자유 문서는 다른 경로에 추가합니다.
- 라이트 스타터 번들 프로젝트는 필요 시 VOSS 프로젝트 상세에서 기본 스타터 번들로 확장할 수 있습니다.
