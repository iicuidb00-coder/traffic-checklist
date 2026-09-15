<!-- VOSS_MANAGED_FILE bundle="basic" version="starter-v1" file="doc/voss-starter/START_HERE.md" sourceSet="starter-core" sourceVersion="starter-core-2026-08-27.1" sourceUpdatedAt="2026-08-27" -->
# VOSS 스타터 시작 안내

## 문서 기준 정보
- 문서 버전: `starter-core-2026-08-27.1`
- 최종 갱신일: `2026-08-27`
- 기준 묶음: 스타터 핵심 문서 기준

## 현재 번들

- 유형: 기본 스타터 번들
- 버전: starter-v1
- 요약: 회원, 관리자, 운영 기능이 있는 중대형 웹 서비스용 문서 구조입니다.

## 사용자 진입 문서

- `doc/README.md`
- 필요 시 루트 `README.md`

## AI/시스템 진입 문서

- `doc/voss-starter/START_HERE.md`
- `doc/voss-starter/AI_개발시작_프롬프트.md`
- `doc/voss-starter/VOSS_AI통합보안점검.md`
- `doc/voss-starter/tools/security_scan.py`

## 이 번들에 포함된 핵심 문서

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

## 추천 작업 순서

1. `AI_개발시작_프롬프트.md`를 새 AI 대화의 첫 입력으로 사용합니다.
2. 현재 작업에 맞는 계획/설계 문서를 작성하거나 갱신합니다.
3. 구현 후 하네스와 정합성 점검 문서를 갱신합니다.
4. 배포 후 `VOSS_AI통합보안점검.md`와 `tools/security_scan.py`로 현재 운영 버전을 점검하고 원본 보고서를 생성합니다.
5. 운영 버전 점검 이력이 필요하면 원본 파일을 확정한 뒤 VOSS 보안 점검 탭에서 제출 토큰을 발급해 바로 VOSS 제출 API까지 완료합니다.

## 문서 관리 원칙

- `doc/voss-starter` 아래 문서는 VOSS 관리 문서입니다.
- 필요한 경우 이 경로 밖에 자유 문서를 추가할 수 있습니다.
- 라이트 스타터 번들 프로젝트는 필요 시 VOSS 프로젝트 상세에서 기본 스타터 번들로 확장할 수 있습니다.
