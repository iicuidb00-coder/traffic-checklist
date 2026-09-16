# 베드로 지파 교통과 월간 체크리스트 시스템

## 기술 스택
- Next.js 14 (App Router)
- TypeScript
- Prisma + VOSS PostgreSQL
- Tailwind CSS
- Recharts (차트)
- Zion OAuth 로그인

## 시작하기

### 1. 환경변수 설정
```bash
cp .env.example .env
# .env 파일에 실제 값 입력
```

VOSS 환경설정에서 제공되는 값:
- `VPG_DATABASE_URL`, `VPG_HOST` 등 PostgreSQL 접속 정보
- `ZION_AUTHORIZE_URL`, `ZION_TOKEN_URL`, `ZION_ME_URL`, `ZION_VALIDATE_URL` (ZION_ENV 선택 시 자동)

직접 설정 필요:
- `ZION_APP_KEY`: Zion 앱 REST API 키
- `ZION_REDIRECT_URI`: 실제 콜백 주소 (예: `https://your-domain.voss.kr/api/auth/zion-login/callback`)
- `NEXT_PUBLIC_BASE_URL`: 배포 도메인

### 2. DB 마이그레이션 및 시드
```bash
npm run db:generate   # Prisma 클라이언트 생성
npm run db:push       # DB 스키마 반영
npm run db:seed       # 교회/중점사항 초기 데이터 입력
```

### 3. 개발 서버
```bash
npm run dev
```

### 4. 빌드
```bash
npm run build
npm start
```

## 권한 체계
| 역할 | 설명 |
|------|------|
| `member` | 자기 교회 체크리스트만 입력 |
| `manager` | 담당 교회 + 전체 조회 |
| `admin` | 전체 교회 관리 + 사용자 권한 설정 |

## 최초 관리자 설정
1. Zion 로그인 후 자동 계정 생성
2. DB에서 직접 role을 `admin`으로 변경:
   ```sql
   UPDATE "User" SET role = 'admin', "churchId" = null
   WHERE "zionNewNo" = '본인13자리번호';
   ```
3. 이후 `/admin` 페이지에서 다른 사용자 권한 설정 가능

## 페이지 구조
- `/` — 전체 대시보드 (연간/월별 교회별 달성률)
- `/dashboard/[church]` — 교회별 상세 대시보드 (월별/분기별/달성유형 분석)
- `/checklist` — 내 교회 이번 달 체크리스트 입력
- `/checklist/[church]` — 관리자용 특정 교회 체크리스트
- `/admin` — 사용자 교회 배정 및 권한 관리

## 달이 바뀌면?
별도 작업 없이 자동으로 새 달 빈 체크리스트가 표시됩니다.
각 교회 담당자가 해당 월에 항목을 입력하면 됩니다.
