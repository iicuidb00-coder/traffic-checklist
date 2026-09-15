<!-- VOSS_MANAGED_FILE bundle="basic" version="starter-v1" file="doc/voss-starter/VOSS_AI통합보안점검.md" sourceSet="security-review" sourceVersion="2026-08-22" sourceUpdatedAt="2026-08-22" -->
# VOSS AI 통합 보안 점검

## 문서 기준 정보
- 문서 버전: `2026-08-22`
- 최종 갱신일: `2026-08-22`
- 기준 묶음: AI 보안 점검 문서 기준

> 이 문서와 `security_scan.py`만 사용자 프로젝트를 점검할 AI에게 전달하세요.
> 공통 충돌 기준, S1~S19, 조건부 VB1~VB5, 위아원 콘텐츠 자동 로그인 조건부 기준, 결과 생성과 VOSS 제출 절차는 이 문서의 부록과 후반부에 모두 포함되어 있습니다.
> VOSS 적용본 버전: 2026-08-22
> 호환 자동 스캐너 버전: 1.1.3
> 기준 원문: Zion Login integrated security verification v1.1.0

## VOSS 적용 원칙

아래 지시는 이 문서에 포함된 기준 원문과 함께 적용하며, 서로 충돌하면 이 절의 VOSS 적용 원칙을 우선합니다.

1. 점검 대상은 반드시 커밋하고 원격 저장소에 push한 프로젝트 버전이어야 합니다. 먼저 `git status --porcelain`이 비어 있고 대상 커밋이 원격에 존재하는지 확인하세요. 충족하지 않으면 점검을 중단하고 커밋과 push를 요청하세요.
2. 일반 VOSS 프로젝트는 배포 후 VOSS에 설정된 기한 안에 현재 운영 커밋의 적합 결과를 제출합니다. 정확한 마감 시각은 `배포/운영 관리 > 보안 점검`에서 확인합니다. 시온 로그인 프로덕션 키가 필요한 프로젝트는 같은 점검을 배포 전에 수행하고 키 신청서를 만든 뒤 배포할 수 있습니다.
3. 아래 통합 기준의 최종 보안 판정과 프로덕션 운영 가능 여부는 점검을 수행하는 AI가 결정합니다. 사용자의 별도 보안 판정은 요구하지 않습니다.
4. `S5`, `S12`는 VOSS 플랫폼 관리 항목입니다. VOSS 제출 정보의 플랫폼 기준 버전이 `2026-07-21`이면 `VOSS 관리(확인 완료)`로 기록하고 구조화 결과는 `verdict=pass`, `severity=advisory`, `assessmentSource=voss`로 작성하세요.
5. `S11`은 공동 책임 항목입니다. VOSS 관리 부분은 확인 완료로 기록하되 사용자 저장소의 컨테이너·DB 노출 설정은 직접 점검하고 `assessmentSource=shared`로 작성하세요. `S16`, `S18`을 포함한 나머지 항목은 사용자 코드 기준으로 직접 점검합니다.
6. 그 외 항목은 `assessmentSource=user_ai`로 작성하세요. VOSS가 관리하지 않는 사용자 코드 항목을 플랫폼 확인 완료로 처리하면 안 됩니다.
7. 자동 점검은 이 번들과 함께 제공되는 `doc/voss-starter/tools/security_scan.py`를 `python doc/voss-starter/tools/security_scan.py --root .` 명령으로 실행하세요. 프로젝트에 파일이 없다면 개발 템플릿에서 같은 버전의 스캐너를 내려받되, 배포된 커밋을 바꾸지 않도록 저장소 밖 경로에서 `python /절대/경로/security_scan.py --root .` 형태로 실행하세요.
8. 이 통합 문서의 부록 A 공통 충돌 기준과 부록 B `S1~S19` 기준을 반드시 읽고 판정하세요. 별도 봇 구성요소가 발견된 경우에만 부록 C `VB1~VB5`를 추가 적용하고, `X-Wao-Authorization` 헤더 방식이 발견된 경우에는 부록 D를 기존 인증·세션·로그 항목의 판정 근거에 반영합니다. 사용자에게 부록을 별도 파일로 요청하지 마세요.
9. 최종 산출물은 반드시 `{프로젝트ID}_보안점검결과보고.md`, `security_scan_report.md`, `security_scan_report.json`입니다. 시온 로그인 적용 프로젝트만 `{프로젝트ID}_프로덕션키신청서.md`를 추가합니다.
10. 최종 스캐너 실행의 `report_id`, 코드 지문, 파일목록 지문, 전체 `git_commit`을 결과 보고서에 그대로 기록하세요. 스캐너를 다시 실행하면 지문이 같아도 `report_id`가 달라질 수 있으므로 이전 결과 보고서를 폐기하고 새 실행 결과로 다시 작성해야 합니다.
11. 보고서 작성 후 `python doc/voss-starter/tools/security_scan.py --verify-report ./{프로젝트ID}_보안점검결과보고.md`를 실행해 세 파일의 연결 검증을 통과하세요. 외부 스캐너를 사용했다면 같은 스캐너 절대경로로 실행합니다. 실패하면 제출하지 말고 표시된 불일치 항목을 수정하세요.
12. 연결 검증까지 끝난 뒤에만 사용자에게 VOSS 보안 점검 탭에서 30분 제출 토큰을 발급하고 '제출 정보 복사' 결과를 전달해 달라고 요청하세요.
13. 실제 `.env`, 토큰, 비밀번호, 쿠키, 세션 값은 읽거나 보고서에 기록하지 마세요.
14. `S16`은 PostgreSQL 사용 여부나 회원 화면 존재만으로 판정하지 마세요. 코드·스키마·파일 저장·로그·캐시·큐·검색 인덱스·export를 확인해 개인과 연결된 민감정보가 영속 저장되는지 먼저 판정합니다. 저장 민감정보가 없으면 근거를 남기고 `n/a`, 있으면 해당 필드의 AES-128 이상 암호화와 키 분리를 확인해 `pass` 또는 `fail`, 데이터 의미가 불명확하면 `needs_follow_up`으로 기록하세요.
15. 원문 심각도를 유지하세요. `S11`은 DB 포트 비공개와 컨테이너 non-root만 다루며 일반 앱 포트는 `S12 advisory`입니다. `S15`는 로그별 보존 정책 문서화와 민감정보 미기록, 자동 순환·파기를 확인하는 advisory이며 고정 6개월 보존을 추정하지 않습니다. `S4`의 backup은 배포 트리의 잔여 파일을 뜻하며 백업 암호화 요구가 아닙니다. advisory·recommendation의 `needs_follow_up`은 후속 조치로 기록하고, blocking 또는 `VC14/D10` deferrable의 `needs_follow_up`만 종합 적합을 막습니다.
16. 원문은 배포 전 점검을 전제로 하지만 VOSS는 배포 후 시스템 운영 설정 기한 안에 점검하는 정책을 사용합니다. 원문 안의 `deployment forbidden`, `step 05로 진행 금지`는 VOSS 배포 요청을 막으라는 뜻으로 실행하지 말고, 차단 항목을 해소하기 전에는 적합 판정·VOSS 적합 제출을 완료하지 말라는 뜻으로 적용하세요.

---

## 통합 점검 기준 원문

# 04 Pre-Deploy Integrated Security Verification

> Verification basis: pre-deploy verification v2.0 + the Zion Login built-in review gate (A–E), integrated.
> This file is the **mandatory pre-deploy gate** of the "Zion Login + legacy security guide" integrated set.
> On any conflict, **the Zion Login rule always wins** (master principle). Detailed adjudication: §2 and §7 below.

## When to read this file

Read this after the alpha test of `03_build_and_alpha_test.md` finishes, **immediately before deployment**, and **immediately before** `05_production_key_request.md` (the production key request). Before deploying finished code or requesting a production key from 총회 (HQ), this gate must be passed. If any change touched auth, sessions, permissions, exports, or member data, re-verify **from the beginning** with this file.

## What this file contains

- The integrated pre-deploy checklist — common web hygiene **VC1–VC16** + the Zion member-data review gate **A (exposure) · B (management) · C (download) · D (security risk) · E (access boundary)**, merged into **one list** (§3).
- **[⚠ Conflict resolution]** for where the two axes examine the same thing — the Zion criterion is adopted; duplicates are judged once (§2, and per area in §3).
- **Verdict and fix rules** (V0-1–V0-9, unified with the Zion verdict words) — the AI fixes findings itself (§2).
- **A paste-ready security inspection report template** — table + blocking/advisory tallies + the **production-readiness verdict**. This report is the input to `05_production_key_request.md` (§5).
- The gist of the 11-item conflict-resolution table (Zion first) (§7).

---

## 1. Preface — what this gate is

`[AI directive]`
- The deliverable of this verification is **one security inspection report** (§5 template). Without the report, neither deployment nor the production key request proceeds.
- Review scope: the entire code to be deployed + dependency files (`requirements.txt`/`package.json`, etc.) + `.env.example` + `.gitignore` + deployment configuration.
- Review premise: the builder is not a code expert. Minimize jargon, and **the AI must fix every finding itself** (§2 V0-9).
- **Pre-emptive block — a real `.env` (V0-8, before every other rule).** If the input shows signs of a `.env` holding real tokens/keys (a filename `.env*`, non-code `KEY=value` lines with long tokens or a `digits:alphanumerics` pattern, or the user saying "my `.env`"), stop before reading, quoting, or judging anything and output only:
  ```
  ⚠ .env(실제 토큰·비밀키가 든 파일)가 입력에 포함된 것 같습니다. 검증에 필요하지 않으며 올리면 노출됩니다.
  - .env는 올리지 마세요. .env.example(자리표시자만)만 있으면 됩니다.
  - 이미 올리셨다면 토큰·키를 즉시 재발급하세요.
  - 비밀값을 지우고 코드와 .env.example만 다시 붙여넣어 주세요.
  ```
  Tools that run directly in the directory (e.g. Claude Code) **only enumerate `.env` and never open its contents** — confirm only that it exists and whether `.gitignore` covers it. Even after this block, VC1/VC2 judgment proceeds normally.

`[바이브코더 안내]`
- 지금 할 일은 하나: 배포하려는 **코드 전체와 설정 파일들을 AI에게 주는 것**이다. AI가 52개 항목(+ 인프라·개인정보보호법 보충 점검 S1~S19)을 하나씩 판정하고, 문제가 있으면 직접 고친 뒤 **보고서 1부**를 만들어 준다.
- **진짜 `.env`(실제 키가 든 파일)는 절대 붙여넣지 않는다.** `.env.example`(자리표시자만)이면 충분하다. 실수로 올렸다면 즉시 그 키를 재발급하라.
- 검증이 끝나면 AI가 만들어 준 보고서를 그대로 `05_production_key_request.md` (프로덕션 키 신청 파일) 단계로 가져간다. 보고서가 "배포 불가"면 AI가 고친 뒤 다시 검증한다.

---

## 2. Verdict Principles (VC and Zion review verdict words unified)

`[AI directive]` Unify the verdict words of the two sources onto the single axis below. Use the unified verdict word in the report, citing the original ID (VC, A–E) in the evidence.

| Unified verdict | Pre-deploy verification (VC) | Zion review (A–E) | Meaning |
|---|---|---|---|
| **적합** — pass | 적합 | `PASS` | **Every** relevant path meets the criterion (V0-7). |
| **부적합(차단·blocking)** — blocking finding | 부적합(치명) | `FINDING (blocking)` | Blocks deployment/delivery. No deploy until blocking count reaches 0. |
| **부적합(권고·advisory)** — advisory finding | 부적합(비치명) | `FINDING (advisory)` | Deploy is possible, but assign an owner and a deadline. |
| **해당없음** — N/A | 해당없음 | `N/A (reason)` | The feature does not exist in this code. Always state the reason. |
| **추가확인필요** — needs-input | 추가 확인 필요 (VC14) | — | Verdict deferred pending an external lookup (§6 C11 procedure). |

**Core verdict rules (V0-1–V0-9, consistent with the Zion review rules):**
- **V0-1.** Judge each item with exactly one of the verdict words above. No vague wording.
- **V0-2.** Every verdict cites **a short quotation of the relevant code as evidence**. If there is no code to quote, state "해당 코드 없음" (no such code).
- **V0-3.** When unsure, do not mark pass/`PASS` — rule toward the **safe side (finding)**.
- **V0-4.** Never assume a feature exists when it is not in the code. Judge **only from visible code** (the actual code, not a memory of "code usually does this").
- **V0-5.** If a quotation would contain sensitive values in the code — tokens, `client_id`, `access_token`, `newNo`, real names — mask the value as `[REDACTED]` and cite "sensitive value exposed in code" as finding evidence.
- **V0-6. Definition of critical/blocking.** Any of the following is **blocking**, and the overall verdict becomes "배포 불가" (no deploy).
  - The six critical pre-deploy items: a finding on any of **VC1·VC4·VC5·VC6·VC7·VC8**.
  - A **VC2-(d)** finding (a real `.env` leak, or a formerly-public repo indication) → no deploy until tokens are reissued.
  - **VC16** with **out-of-scope rows or sensitive columns included in the response payload** (overlaps VC5) → critical.
  - Any **`FINDING (blocking)`** among Zion review A–E (see the "default severity" column in each §3 area).
- **V0-7.** If only some paths of an item are protected and the rest are open, judge it a **finding** (pass only when every relevant path complies).
- **V0-8.** Apply the real-`.env` pre-emptive block (§1 above) **first of all**.
- **V0-9. The fixer is the AI — it fixes findings directly.** Do not stop at "fix this here, like this".
  - **With file-write access (e.g. Claude Code):** **edit the code directly**. Keep variable/function names, change only what is needed, and reflect any new secret in `.env.example` and `.gitignore` too. Leave **one line per fix stating what changed and why**, and **collect each fix's "verify with your own eyes" item, then distill them into the §5 report's 「배포 전 직접 해볼 체크(최대 5개)」 section, delivered once** (do not exhaust the user with itemized lists). **Priority for the 5 slots: ① checks tied to blocking fixes → ② permission/scope (authorization, data range) → ③ the rest** — fill in this order so permission-bypass checks never fall outside the 5 (`00_START_HERE.md` §1.5).
  - **Without write access (pure chat):** output the corrected code as **complete units (function/file level, not fragments)** so pasting alone suffices. Never instruct "edit line N".
  - For out-of-code configuration — RLS, Firebase rules, GAS server-side verification, fail-closed functions, mass assignment triggers — provide **complete, paste-ready SQL/rules/verification code**, leaving the user a single step: "paste into the dashboard/console".

`[⚠ Conflict resolution]` **When VC and A–E examine the same target, judge by the Zion criterion and list the duplicate only once in the report.** Representative overlaps: auth/session (VC5·VC6 ⟷ E1–E4·D2·D3), permissions (VC5 ⟷ D4·D5·D7), audit (VC gap ⟷ B4·B5·C2·D7), personal-data ceiling (VC11·VC16 ⟷ A1–A7·B1·C1–C6). Judge by the Zion item (A–E), marking the corresponding VC as "judged jointly under the Zion item". Details in the §7 conflict-resolution table.

---

## 2b. Running the Automated Security Scanner (machine verification + the HQ submission report)

`[AI directive]` Before judging all of §3 by eye, **let the automated scanner judge the machine-checkable items first**. This turns the gate from "self-declaration" into **reproducible evidence**. The vibe coder runs the scanner directly and submits **only the result (the report)** to 총회; the report's **code fingerprint and file-manifest fingerprint (SHA-256)** are its tamper-evidence seals. (총회 inspects using this report alone; when needed it requests the repo only as a sample audit and re-runs at the same commit to confirm the fingerprints match.)

### How to run (by execution environment)
- **Claude Code / Codex (can run files/commands):** the AI **runs it directly**.
  ```
  python tools/security_scan.py --root <프로젝트 루트>
  # 정적 배포면:    --deploy-url https://<배포주소>
  # Supabase 쓰면:  --supabase-url https://xxx.supabase.co --supabase-key <ANON_KEY> --supabase-table <표>
  ```
  The scanner is `tools/security_scan.py` in the starter bundle (standard library only — no installation). If it is not already part of the deployed commit, invoke the downloaded scanner by an absolute path outside the repository. Exit code 1 = FAIL present.
- **Other chat-only AIs (cannot run commands):** guide the user to download the same-version `security_scan.py` from VOSS, save it outside the target repository, run it with `--root <프로젝트 루트>`, and **paste back** the resulting `security_scan_report.md`. Feed that result into the §3 verdicts.

### What the scanner judges (machine verification) vs what it cannot (AI verdict)
- **Machine-verified (automatic, with evidence and fingerprints):** repo visibility (VC3/E5) · `/.git/config` exposure · `.env` in `.gitignore` and `.env.example` placeholders (VC2) · hardcoded secrets (VC1) · `JWT_SECRET` (D2) · the `/oauth/` path · `v3_0/me` · the 4-field member-data ceiling (B1) · `service_role` client exposure (G3) · raw XSS sinks (VC8, WARN) · string-built SQL (VC7, WARN) · live anon-key unauthorized-read probe (VC4, when arguments are provided) · dependency vulnerabilities (VC14) · **supplement subset (WARN): debug mode (S1) · directory listing (S3) · stray backup/dump files (S4) · docker-compose DB-port/root (S11) · weak hash MD5/SHA-1 (S18) · config-file secrets (S19)**; VC8 also catches template escape bypasses (`| safe`/`v-html`); secret detection is **entropy-aware** (placeholder word + long high-entropy token = real secret).
- **AI-judged (outside scanner scope):** server-side authorization and mass assignment (VC5) · IDOR object checks (D5) · fail-closed permission resolution (D7) · audit logs (B4·B5·C2·D7) · state CSRF · actual behavior of session revalidation (D1·D3) · server-side enforcement of the data scope (C3) · internal-information login triggers (E1–E4), etc. **A scanner WARN/SKIP is not a pass — the AI must make the final judgment from the code.**

### Grafting the results into the 04 verdicts and report
`[AI directive]`
- Adopt each scanner **FAIL** as finding evidence for the matching §3 item and fix it directly (V0-9). Criticality follows §2 V0-6.
- A scanner **NEEDINPUT (추가확인필요)** means a value needed for live probing of a managed backend etc. was missing, so no verdict was possible — **never wave it through as a pass.** Following the guidance in the evidence column, the AI **explains to the vibe coder concretely where to get what, receives the value, then judges**. Examples: Supabase → dashboard → Project Settings → API — get the **Project URL and anon public key** plus the **table name** to check, and re-run with `--supabase-url/--supabase-key/--supabase-table`; Firebase → get the **contents of the Rules tab** from the console and judge whether the rules are locked. **While any NEEDINPUT remains, deployment and step 05 are forbidden.**
- Scanner **WARN/SKIP** items get their final verdict from the AI in §3 (not seen by the scanner ≠ pass).
- Carry the final scan output's (`security_scan_report.md`/`.json`) **tallies, code fingerprint, file-manifest fingerprint, report_id, and full git commit** verbatim into the §5 report section 「0. 자동 점검 결과」. This report is a self-contained artifact that **the vibe coder runs personally and submits only the result to 총회**; the two fingerprints (code, file manifest) are the tamper-evidence seals.
- After fixing code, **re-run the scanner** to produce a fresh report with **FAIL 0 · NEEDINPUT 0** (fingerprints and report_id refreshed). Discard the previous result report, rebuild it from this final run, and attach only the three files from the same final run.

---

## 3. Integrated checklist (52 items · 44 merged rows — merged rows judged once; + Area 9 supplement S1–S19)

`[AI directive]` Judge **every item in all 8 areas below, exhaustively**. Column meanings in each table:
- **Source ID** — pre-deploy verification `VC*` or Zion review `A/B/C/D/E`. Merged items list both IDs and are judged under the Zion item as the representative.
- **Check (pass criterion)** — this state is required for 적합/`PASS`.
- **Default severity** — `blocking` (a finding blocks) / `advisory` / `deferrable`. The actual verdict applies V0-3·V0-7, ruling toward the safe side.
- **Notes** — live-probe instructions, Zion precedence, original rationale (why).

### Area 1 — Repository, secrets, source exposure

| Source ID | Check (pass criterion) | Default severity | Notes |
|---|---|---|---|
| **VC1** [G1·G2·G3] | Tokens, passwords, keys, `client_id`, internal IPs are not hardcoded — loaded from `.env`/environment variables (`os.getenv`, `process.env`, a config loader). Secrets never travel in URL query strings (`?key=`, `?secret=`) — headers only. No service_role/master key in the browser, static files, or any client code. | **blocking** | A real token string embedded in code = finding (`[REDACTED]`). Not committing `client_id` is the same verdict as Zion **D9** (merged). |
| **VC2** [G1·G4] | (a) `.gitignore` includes `.env`, (b) a separate `.env.example` is provided, (c) `.env.example` holds no real tokens (placeholders only), (d) `.env` was never committed/pushed and the repo was never public. | **blocking** | A (d) violation (leak indication) → **reissue tokens + no deploy**. If anything is missing, state which. Not git-managed → (d) is N/A. Merged with Zion **D9·E6**. |
| **VC3** [G5·G6] ⟷ Zion **E5** | Do not trust "the settings say Private" — **live-probe whether the source is actually reachable unauthenticated (without login)**. The git repo must be **private** (E5). | **blocking** | **Live probe (perform when possible):** normalize the git remote URL to HTTPS (SSH `git@host:owner/repo` → `https://host/owner/repo`, strip `.git`), then check the status code with an unauthenticated `curl` — **200 = public (finding)**, **404 = private/absent (pass)**, **403·429 = rate-limited, verdict deferred**. For static deployments also check `/.git/config` exposure (200 = full source leak = critical) and source maps. **No conflict (§7 #8): Zion principle + the guide's live probe (stronger) adopted.** If confirmed public, treat every committed secret as leaked (VC2) → reissue, and enumerate actual leaks with `gitleaks`/`trufflehog`. |
| **VC15** [G22] ⟷ Zion **E6** | No organization names, real names, internal terminology, religious terminology, internal IPs, deployment hosts, project refs, or live endpoint URLs in the code. | **advisory** | On discovery: (1) the AI externalizes the value into `.env`/config and gitignores it, (2) if it cannot be externalized, keep it but notify "this will be exposed if the code is published/shared". **A VC15 violation is not by itself a no-deploy reason (not critical).** E6 also minimizes exposure inside a private repo. |

### Area 2 — Auth, session, access boundary (Zion-first core)

`[⚠ Conflict resolution]` This entire area is **governed by the Zion Login hard rules**. Any design that newly introduces local password auth or self-issued JWTs is a finding (§7 #1·#3).

| Source ID | Check (pass criterion) | Default severity | Notes |
|---|---|---|---|
| **E1** | **Any system handling internal information (member data, personal data, contact networks, org/operations information, strategy — everything not meant for the public)** sits behind Zion Login (real server-side auth). Whether personal data or non-identifying internal aggregates — if it is internal information, login is **mandatory**. | **blocking** | §A2 policy P-1 (matches Zion hard rule 7/E1): the trigger is **internal information**. Handling internal information with no login, or with a client-side gate only, is a finding. §7 #3. **P-3 exception (small write-only public form):** login absence passes ONLY if every P-3 condition (통합 문서 부록 A §A2) is verified in code — no read/search/manage/export path anywhere, forward-and-purge in place; judge it, don't assume it. |
| **E2** | If internal information is **truly zero** (pure public content), the absence of login is correct — do not gate public pages without reason. | advisory | Over-gating is security-free friction. The rule is scoped to internal information only. Matches 총회 §E (no rejection risk). |
| **E3** ⟷ **VC5** (partial) · R0-6 | Authentication is **enforced server-side**. Client-side passwords, overlays, and localStorage flags are not a boundary — the data has already shipped before the check runs. | **blocking** | Hiding on the client is not security (theater). §7 #3. |
| **E4** | Data payloads are delivered **only after the server-side auth check** — never inlined into pages or returned by unauthenticated endpoints. | **blocking** | The classic failure: "a password prompt on top of already-loaded data". |
| **D2** ⟷ **VC6** (critical) | **No self-issued JWT anywhere**, no `JWT_SECRET` in configuration, and the Zion `access_token` is the only session credential. | **blocking** | Zion hard rule. `[⚠ Conflict resolution]` §7 #1: guide G12 (password hashing)/generic self-managed login vs Zion → **Zion**. **Never build new local password auth.** VC6 (password handling) is reinterpreted in this context: pass requires no local password comparison, no plaintext, no hardcoded default password. If a separate non-Zion secret exists (webhook secret, etc.), apply the server-side hashing rule (bcrypt/PBKDF2) to that secret only. |
| **D1** | `state` is random, stored, and verified at the callback. Mismatch = hard reject. | **blocking** | OAuth callback CSRF = an account-linking attack. **A guide gap filled by Zion — must be judged.** |
| **D3** | Session revalidation runs against `GET /api/auth/v1_0/validate` at the configured interval (`SESSION_REVALIDATE_SECONDS`, default 300s) and is **fail-closed** (network error = 401). | **blocking** | A revoked Zion 계정 must not keep a live session here. **A guide gap filled by Zion — must be judged.** Session model details: `01_zion_login_canon.md`. |

### Area 3 — DB access control, server authorization, IDOR, over-fetch

| Source ID | Check (pass criterion) | Default severity | Notes |
|---|---|---|---|
| **VC4** [G7·G8] | **Supabase:** RLS enabled on data tables + owner/role policies, no out-of-policy rows visible with the anon key, no `anon` full-access policy or migration. **Firebase:** rules are not `if true`/`.read:true` — locked with auth + owner/role conditions, and not a flat download-everything-then-filter-in-UI structure. **GAS/custom backend:** `doGet`/`doPost` verify identity server-side and never trust a client-supplied email; admin actions only from a verified role. | **blocking** | **Live probe (perform when possible):** query each table/node over REST with the public anon key, without login → if data returns (e.g. HTTP 200 + rows), the policy is open → finding, act immediately (read-only, mask values). `[⚠ Conflict resolution]` §7 #2: identity is **the 고유번호 from the Zion session**, not `auth.uid()`. If Supabase serves as the local DB, go through the backend (behind the session gate) instead of browser-direct. **The primary control for scope enforcement is the backend query filter** (`organizationPaths`); RLS (default-deny) is the **second line of defense** blocking non-`service_role` paths (`service_role` bypasses RLS, so RLS is never evaluated on `service_role` queries → scope must be enforced by query filters). |
| **VC5** [G9·G10·G11] ⟷ **D7** | Permission decisions happen **on the server** (client-sent role/isMaster distrusted; session/localStorage permission values re-verified; no localhost auto-admin backdoor). **Mass assignment blocked** (users cannot change their own role, affiliation, or approval status; triggers/policies/RPCs pinned; new sign-ups start as pending approval). **Fail-closed** (no `if(SECRET){check}` pattern that skips the check when the secret is unset — missing secret = 401). | **blocking** | `[⚠ Conflict resolution]` §7 #5: permissions are **고유번호 RBAC**, duty-based automatic permissions forbidden, `SUPER_ADMIN` = `DO_EVERYTHING`. 이 통합 문서에 기술된 권한 기준을 적용합니다. Judged merged with D7 (fail-closed permission resolution: unknown 고유번호/lookup error/empty result → empty permission set). |
| **D4** | Every API route **declares its required permission**. Routes without one are consciously public and cataloged as such. | **blocking** | An undeclared route = an unauthenticated route waiting to be discovered. |
| **D5** | Object-level checks (IDOR) on **every** endpoint that accepts an ID: validate the caller's scope against **the fetched object**, not the request parameter. | **blocking** | Sequential IDs + missing object check = a full data walk. **A guide gap filled by Zion — must be judged.** |
| **VC16** [G24] ⟷ Zion **A1** | Queries/APIs fetch and return only what is needed: (a) no `select *` and no columns in the response that the screen does not display (phone, email, address, internal memos, secret tokens), (b) no downloading all rows to filter/paginate on the frontend, (c) no aggregating by downloading everything and counting on the frontend. | **blocking** (if out-of-scope rows/sensitive columns are included) / advisory (mere traffic waste) | **The judging viewpoint is the actual response payload in F12/network tab, not the code** — invisible on screen but present in the payload is still exposure. Judge separately even when RLS (VC4) is correct. **Same target as A1 → judged once under Zion A1 (merged).** Fixes: explicit column selection + server-side filtering/pagination + per-screen/per-role DTOs + server-side aggregate queries. |

### Area 4 — Permission model, audit logs (guide gaps filled by Zion — every item must be judged)

| Source ID | Check (pass criterion) | Default severity | Notes |
|---|---|---|---|
| **B4** | Member-data admin screens/APIs require a **specific permission**, and **bulk member-data reads are audit-logged** (who, when, what scope). | **blocking** | Religious-affiliation data is special-category — access accountability is mandatory, not optional. §7 #6. |
| **B5** | Every 고유번호 permission grant/revoke has an **audit row**. The bootstrap `SUPER_ADMIN` 고유번호 is a real, intended operator (not a test leftover), and `SUPER_ADMIN` assignments are minimal and justified. | **blocking** | The permission table is the SSOT — an unaudited change is an invisible privilege escalation, and a stray master grant is a total breach. §7 #6. |
| **D7** | Permission resolution is fail-closed (unknown 고유번호/lookup error/empty result → empty set). `SUPER_ADMIN` actions are still audit-logged. | **blocking** | Judged merged with VC5 (Area 3). Fail-open RBAC breaks exactly when the data is most interesting. |
| **C1** | Every export/download of member data is gated by a **dedicated `*_EXPORT`/`*_DOWNLOAD` permission code** — not bundled into generic VIEW/MANAGE. | **blocking** | Exports are the leak path — they must be grantable and revocable individually. |
| **C2** | Each export is audit-logged: actor, time, filter/scope, row count. | **blocking** | A leak investigation starts at this table — without it there is nothing to investigate. §7 #6. |

### Area 5 — Member-data exposure and minimization

| Source ID | Check (pass criterion) | Default severity | Notes |
|---|---|---|---|
| **B1** [G17] ⟷ **VC11** | Collected fields = exactly `NAME, NEW_NO, ORGANIZATION_PATH, ORGANIZATION_WITH_DUTY`. Any additional property request has a **총회 approval record**. | **blocking** | `[⚠ Conflict resolution]` §7 #4: guide G17 (general minimal collection) vs Zion hard rule 3 (exactly 4) → **the Zion 4-field ceiling**. G17 is the generic form of this ceiling. VC11 (PII) is absorbed into the B1·A·C areas. **Scope caveat:** this ceiling/prohibition covers **member data fetched from Zion** — **non-member PII** newly collected apart from Zion (public newsletter emails, etc.) is not member data, so it is not subject to this ceiling (not a reason to refuse the request); judge it under G17–G19 + gated management, audit, retention/destruction (통합 문서 부록 A §A2 P-1). |
| **A2** | Member data never appears in URLs/query strings (고유번호 search uses POST or the request body). | **blocking** | URLs persist in access logs, browser history, and proxies. **A guide gap filled by Zion — must be judged.** |
| **A3** ⟷ **VC12** | Application logs contain no `name`+`newNo` pairs, no org+직책 dumps, no member-list payloads. `access_token` appears in no log. | **blocking** | Logs outlive requests and are read widely; the audit table is the canonical who-did-what record. Merged with VC12. |
| **A4** ⟷ **VC12** | Error messages and 4xx/5xx bodies leak no member data, stack traces, SQL, or internal identifiers. | **blocking** | Errors are, by definition, shown to the wrong audience. |
| **A5** | List screens display only the minimal identity set (이름, 소속, 직책, and 고유번호 where operationally needed) — no fields unnecessary for the viewer's role. | advisory | One extra column is permanent exposure to every viewer of that screen. |
| **A6** | No developer terminology in end-user UI: permission codes, enum values, internal IDs, and the word **"ZAuth"** must not appear. | advisory | The non-developer UX rule + shrinks what screenshots can leak. Naming rules: `01_zion_login_canon.md`. |
| **A7** | Browser storage holds only the `access_token` (no cached member lists or permission dumps in localStorage). | **blocking** | Client storage is readable by any intruding script. |
| **B6** | The local user table's member-data snapshot (name/org/duty) is **refreshed at login** and never hand-edited. | advisory | A hand-edited copy drifts from the registry and becomes a shadow member DB. **A guide gap filled by Zion.** |
| **C3** | Exports respect the caller's data scope (own 교회/지파 filter applied **server-side**, not in the UI). | **blocking** | A frontend-only scope filter is not a filter. |
| **C4** | Export contents equal the screen's minimal set — no wider fields than the source screen shows. | **blocking** | "Extra columns in the CSV" is the classic silent leak. |
| **C5** | No scheduled/unattended bulk exports; no export endpoint callable without a user session. | **blocking** | An unattended export has no accountable actor. |
| **C6** | Exported files carry no misleading persistence (server-side cleanup of temp files; member-data files never committed to the repo or left in shared storage). | advisory | Files outlive the permission that created them. |

### Area 6 — Retention, destruction, session hashing (guide gaps filled by Zion — must be judged)

| Source ID | Check (pass criterion) | Default severity | Notes |
|---|---|---|---|
| **B2** | A **documented retention rule** exists per stored artifact (user rows, sessions, audit rows), and destruction actually runs (a job or a startup task). | advisory | "Kept forever by accident" is a PIPA citation, not a default. |
| **B3** | Sessions store only the **hash** of the token (never the raw token), and expired sessions are destroyed. | **blocking** | A session-table dump must not become a token dump. Session model: `01_zion_login_canon.md` (hash = `SHA-256(token)`). |

### Area 7 — Input/output safety (Zion weaknesses covered by the guide — every item must be judged)

| Source ID | Check (pass criterion) | Default severity | Notes |
|---|---|---|---|
| **VC7** [G13] ⟷ **D6** | External input is validated and parameterized. No SQL injection or command injection (`eval`/`exec`/`os.system`/user input into a shell). | **blocking** | Injection near member data is an immediate breach (D6). No string-built SQL. |
| **VC8** [G14] | User/external-origin values go through `textContent`/`escapeHtml`; no unescaped `innerHTML`/`dangerouslySetInnerHTML`. | **blocking** | **An item absent from the Zion review, covered by the guide.** One unescaped spot = finding; state the location. |
| **VC9** [G15] | Server-side fetches of user-specified URLs have a scheme/host allowlist, block private/link-local/loopback ranges, forbid redirects, and enforce timeouts and size caps; upstream status/errors are not reflected back. | advisory | **Zion weakness covered — must be judged.** SSRF. |
| **VC10** [G16] | Uploads and CSV/Excel have server-side format/size/row-count validation, and CSV exports have **formula-injection defense**. | advisory | **Zion weakness covered — must be judged.** |

### Area 8 — Transport and operational hygiene

| Source ID | Check (pass criterion) | Default severity | Notes |
|---|---|---|---|
| **D8** | CORS restricted to configured origins (`CORS_ORIGINS`); cookies (if any) `Secure`+`HttpOnly`+`SameSite`; HTTPS enforced end-to-end. | **blocking** | Token-theft vectors. **A guide gap filled by Zion — must be judged.** |
| **D11** ⟷ **VC1** (G1) | The `client_id` is unique to this system — not a key reused from another app/site/지파 (총회 master testing is the only exception). | **blocking** | `[⚠ Conflict resolution]` §7 #10: **keep** G1 (no hardcoding) + **add** D11 (per-system uniqueness, no reuse) — **both**. Reuse breaks per-system attribution and forces a full rotation on a single leak. |
| **VC12** [G19] | Error responses expose no stack traces, internal paths, or raw upstream bodies; logs hold no plaintext tokens/PII (masking). | **blocking** (if member data leaks) / advisory | Judged merged with A3·A4 (Area 5). |
| **VC13** [G21] | Limits exist against excessive requests, brute force, and abuse of paid APIs (LLM/TTS); no paid endpoint is open without auth. | advisory | **Zion weakness covered — must be judged.** Rate limiting. |
| **VC14** [G20] ⟷ Zion **D10** | Dependency vulnerabilities: known critical CVEs resolved before deployment. | **deferrable** | Requires an external vulnerability-DB lookup → low AI-only reliability. Follow the **§6 C11 procedure**; until results arrive, the verdict is **"추가확인필요 (needs-input, deferred)"**. An auth stack is only as strong as its weakest wheel (D10). |

### Area 9 — Infrastructure hardening & PIPA compliance (supplement S1–S19 · 통합 문서 부록 B)

`[AI directive]` Judge **S1–S19 in addition to the 52 core items** (full rule table + severities + judge column: 통합 문서 부록 B §E). These close the infra-hardening and 개인정보보호법 procedural gaps the in-house 64-item audit inspects. Merge duplicates with the cited VC/A–E item (judge once). Fold every finding into the same §5 report. Religious-affiliation data linked to an identifiable person is 민감정보 (제23조), but **S16 applies only when such sensitive data is persistently stored**. Do not turn every member-data surface into an automatic S16 failure; follow the classification procedure below.

| S# | Check (pass criterion) | Checklist | Default severity | Judge |
|---|---|---|---|---|
| **S1** | Production debug OFF — no `DEBUG=True`/`debug=True`/dev error middleware in the deployed artifact | 12-4 | **blocking** | scanner + AI |
| **S2** | Custom error pages; no stack trace/version/SQL/path in 4xx/5xx (reinforces A4·VC12) | 12-5 | blocking | AI |
| **S3** | Directory listing OFF (autoindex off; no browsable dirs) | 12-7 | advisory | scanner + AI |
| **S4** | No stray backup/temp/test files in the deployed tree (`*.bak`/`*.orig`/`*.sqlite`/`dump.*`) | 12-9 | advisory | scanner + AI |
| **S5** | HTTP→HTTPS 301 redirect + HSTS | 3-2 | advisory | deploy/infra |
| **S6** | Upload extension whitelist (server-side) | 11-6 | blocking | AI |
| **S7** | Upload MIME check | 11-7 | advisory | AI |
| **S8** | Upload magic-byte/signature check | 11-8 | advisory | AI |
| **S9** | Uploads stored outside web root / non-executable path, randomized filename | 11-9 | **blocking** | AI |
| **S10** | Download by server-resolved ID; no path param; `..` rejected; permission+scope enforced (with D5) | 11-10·11-11 | **blocking** | AI |
| **S11** | DB port not internet-exposed (self-hosted bind/firewall; docker-compose publishes no DB port to a **non-loopback** address — `127.0.0.1:`/`localhost:` bind OK, bare `5432:5432`/`0.0.0.0:` not; managed = backend-only + RLS); container non-root (14-3) | 14-1·14-3 | blocking | scanner + AI + deploy/infra |
| **S12** | Only required ports open; tier separation where feasible; WAF recommended | 3-3·14-2·14-4 | advisory | deploy/infra |
| **S13** | Admin surface: server-side RBAC gate present (G29); network-isolation N/A note recorded; IP allowlist as DiD where available | 2-1·2-2·13-1 | advisory | AI |
| **S14** | Audit includes login success/fail + individual PII view/edit/delete → the audit table, not app logs (A3 preserved) | 9-1·9-2·10-3 | **blocking** | AI |
| **S15** | 로그 종류별 보존 정책이 문서화되고, access/web 로그에 회원정보·비밀값이 남지 않으며, 최소 필드 기록과 자동 순환·파기가 실제 동작함 | 9-3·9-4·14-5 | advisory | AI |
| **S16** | First classify persistent stores and sensitive fields. Encrypt every stored sensitive field with AES-128+; if none is stored, record the inspected stores and use N/A | 4-4 | **blocking** if sensitive stored without compliant encryption; else N/A | AI |
| **S17** | Direct-collection PII: notice (items/purpose/retention/contact) + explicit consent + required/optional split | 1-1·1-2·1-3 | blocking (if direct collection) | AI |
| **S18** | Idle timeout ≤60min; no MD5/SHA-1 for security; dormant-grant review (≥90d); MFA delegated to Zion IdP (rec) | 6-3·4-2·6-2·5-2 | advisory / recommendation | scanner (md5/sha1) + AI |
| **S19** | Config-file secret hygiene: no URL-embedded credentials (`://user:pass@`), no plaintext secret directives in nginx/apache/.ini configs (catches what VC1's `=`/`:` scan misses in config files) | 12-1·12-3 | **blocking** if a real secret | scanner + AI |

#### S16 판정 절차

`[AI directive]` Apply the following order. Never skip directly to a storage-volume or disk-encryption verdict.

1. **List persistent stores from code and schemas.** Inspect database/ORM fields, JSON/CSV/files, logs, long-lived cache/session stores, queue retry payloads, search indexes, exports and application-created backups. Do not open real production data or `.env` values.
2. **Classify each stored field.** Decide whether it is linked to an identifiable person and reveals a sensitive category. This includes religion/belief/ideology, health/sexual/genetic/criminal data, national-ID-grade identifiers, high-risk financial data, and an individual's church/tribe/duty/member number when it directly reveals religious affiliation. A public organization-name list or anonymous aggregate is not sensitive personal data.
3. **If no sensitive datum is stored, use `n/a`.** Evidence must name the inspected schemas/storage paths and explain why their fields do not meet the sensitive-data definition. `n/a` is a completed review, not a skipped check.
4. **If sensitive data is stored, verify field encryption.** Require AES-128 or stronger; for new code prefer AES-256-GCM with a fresh nonce/IV per encryption and authentication-tag verification. Verify the key is separate from the repository, database and ciphertext, and that plaintext is not copied to logs, indexes, cache or exports.
5. **If exact-match search or uniqueness is required,** store the display value as authenticated ciphertext and use a separately keyed HMAC-SHA-256 lookup value. Do not accept Base64, masking, ordinary hashing or deterministic encryption as a substitute for protected storage.
6. **If field meaning or runtime persistence is unclear, use `needs_follow_up`.** Ask only for the data meaning or storage behavior needed to decide. Never request real personal values or secret keys.
7. **Treat volume/disk/backup encryption as defense in depth.** Its presence does not prove field encryption, and its absence alone does not fail S16.

S16 evidence must state, without secret or personal values:

- whether sensitive data is persistently stored;
- inspected fields and storage paths, or the reason they are not sensitive;
- when applicable, algorithm/mode, key environment-variable name, nonce/tag handling and lookup protection;
- existing plaintext migration and regression-test status.

`[AI directive]` Scanner-checkable subset (scanner flags, AI confirms — a scanner miss is not a pass, per §2b): **S1** (`DEBUG=True`/`debug=True`), **S3** (`autoindex on`), **S4** (stray `*.bak`/`*.orig`/`*.sqlite`/`dump.*`), **S11** (docker-compose DB-port publish / root container), **S18** weak-hash (`md5`/`sha1`), **S19** (URL-embedded credentials / config secrets). **VC8** additionally catches template auto-escape bypasses (`| safe`, `v-html`, `{@html`). All other S-items are AI/infra verdicts. **Secret detection is entropy-aware** (a placeholder word + a long high-entropy token = a real secret, e.g. `API_KEY="example_<realkey>"`). For blocking S-findings the AI fixes directly (V0-9), same as any other finding.

> **Bot add-on (VB1–VB5) note:** Zion Login is web OAuth login, not a bot (§7 #11). Only when a **separate bot component exists** (Telegram/Discord bot, etc.), additionally judge all of VB1–VB5 in 통합 문서 부록 C (payload gate, two-layer permissions, group behavior, deployment mode, non-injection cross-check). Do not apply them to the base web flow.

---

## 4. Verdict and Fix Execution Rules

`[AI directive]`
- Judge **all 52 core items** of §3 (VC1–VC16 = 16 + review gate A1–A7·B1–B6·C1–C6·D1–D11·E1–E6 = 36) **exhaustively**, across the 44 merged rows, **plus the Area 9 supplement S1–S19** (통합 문서 부록 B — infra hardening + PIPA) (+ 부록 C의 VB1–VB5 if a bot exists). Merged rows are judged once under the Zion item, citing the corresponding VC in the evidence.
- **The AI fixes findings directly (V0-9).** With file access, edit the code; without it, output complete function/file-level code. Provide RLS, Firebase rules, GAS verification, fail-closed functions, mass assignment triggers, and audit-log inserts as **paste-ready complete artifacts**, and reflect any new secret in `.env.example` and `.gitignore` too.
- **If 4 or more critical/blocking findings exist**, to avoid response truncation fix the critical ones first (VC1·VC4·VC5·VC6·VC7·VC8) + Zion blocking items, then instruct: "after these fixes, re-run this verification from the beginning and continue with the remaining items".
- **Re-verification triggers:** any change touching auth, sessions, permissions, exports, or the member-data scope re-runs **the whole checklist from the beginning**. Small follow-up changes re-run only the affected areas.

`[Check]` Verify the following right before the overall verdict (if anything was missed, go back, judge it, then produce the result).
- [ ] V0-8 applied first of all (real-`.env` upload/directory exposure checked up front).
- [ ] VC1–VC16 + A–E (A1–A7·B1–B6·C1–C6·D1–D11·E1–E6) judged exhaustively. VB1–VB5 added if a bot exists. VC14/C11 may be deferred.
- [ ] Output item 0 (verification-basis version line) produced.
- [ ] VC2-(d)·E5 checked — on leak/public indications: token reissue + no deploy.
- [ ] Every verdict has evidence (a code quotation or "해당 코드 없음").
- [ ] Every finding fixed by the AI per V0-9 (direct code edit or complete code output, names preserved).
- [ ] "배포 불가" on any critical (VC1·VC4·VC5·VC6·VC7·VC8) or Zion blocking finding.
- [ ] If VC14 is deferred, cap at "조건부 가능" + instructions to submit the dependency results.
- [ ] Sensitive values masked `[REDACTED]` (V0-5).

---

## 5. Paste-Ready Security Inspection Report Template

`[AI directive]` Generate the report exactly in the order and format below. This report is the input to `05_production_key_request.md`. Fill `{ }` with real values.

```markdown
# 보안점검 결과 보고서 — {시스템명} ({지파})
검증 기준: 배포전-검증 v2.0 + 시온로그인 리뷰게이트(A~E)
점검일 / 점검자: {date} / {who}
개발 시 사용 버전: {공통 vX.Y[ + 봇애드온 vX.Y] / 미확인}
검토 범위: {파일/엔드포인트/화면 목록}
리포트 저장 위치: {repo 경로 / 문서 링크}

## 0. 자동 점검 결과 (tools/security_scan.py — 기계검증)
- 스캔 report_id: {report_id} · 스캐너 버전: {scanner_version}
- **코드 지문(SHA-256): {fingerprint}** · **파일목록 지문(SHA-256): {manifest_hash}** · git commit: {commit} · 스캔 파일 수: {n}
- 집계: PASS {n} · **FAIL {n}** · **NEEDINPUT {n}** · WARN {n} · SKIP {n}
- 첨부: `security_scan_report.md` / `security_scan_report.json`(스캔 파일 목록 포함)
- 주: 스캐너 FAIL은 아래 표에 부적합으로 반영·조치했고, NEEDINPUT은 값을 받아 재실행·판정했으며, WARN/SKIP은 AI가 코드로 최종 판정했다.
  이 리포트는 결과만 제출하는 자기완결 산출물이다 — 두 지문이 위변조 방지 표지이며, 총회는 필요 시 표본으로만 레포를 요청해 재현 확인한다.
  **재현 시에는 위 「스캐너 버전」과 동일 버전으로 재실행해야 한다** — 버전이 다르면 점검 항목·스캔 대상 파일집합이 달라져 파일목록 지문이 정당하게 불일치할 수 있다(위변조 아님).

## 1. 판정 결과 표 (전항목)
| 항목ID | 판정 | 근거(코드 인용 또는 "해당 코드 없음") | 조치 |
|--------|------|----------------------------------------|------|
| VC1    | 적합 | config.py: os.getenv 로드, 하드코딩 없음 | — |
| A2     | 부적합(차단) | search?newNo=... 쿼리스트링 사용 | POST 본문으로 변경(AI 수정 완료) |
| D3     | 부적합(차단) | validate 호출 없음, 세션 무기한 | 재검증 루프 추가(완성 코드 제공) |
| C2     | 부적합(차단) | export_members에 감사 write 없음 | 감사행 삽입 후 스트림 |
| VC14   | 추가확인필요 | requirements.txt 버전 미고정 | C11 절차로 의존성 스캔 후 갱신 |
| S16    | 해당없음 | 확인한 ORM 스키마와 파일 저장 경로에 개인과 연결된 민감 필드가 없음 | — |
| ...    | ...  | ...                                    | ... |

## 2. 집계
- blocking(차단) 부적합: {n}건  → 목록: {VC/A~E ID …}
- advisory(권고) 부적합: {n}건  → 목록 + 담당자/기한: {…}
- 추가확인필요(보류): {n}건  → {VC14 등}
- 해당없음: {n}건

## 3. 종합 판정 (정확히 하나)
{배포 불가 / 조건부 가능(최소 수정 필요) / 조건부 가능(의존성 교차 확인 필요) / 배포 가능}
- 판정 규칙: 치명(VC1·VC4·VC5·VC6·VC7·VC8) 또는 시온 blocking 하나라도 부적합 → "배포 불가".
  VC2-(d)/E5 유출·공개 정황 → 토큰 재발급 전 "배포 불가".
  그 외 부적합 있음(= blocking 0, advisory만 잔존) → "조건부 가능(최소 수정 필요)". ※이 판정도 프로덕션 운영 가능 조건을 만족한다 — advisory는 삭제할 필요 없이 §4대로 담당자·기한과 함께 05로 이월한다.
  VC14 보류 → 최대 "조건부 가능(의존성 교차 확인 필요)"까지. 확인 완료 후에만 상위 판정.
  부적합 없음 → "배포 가능".

## 4. 프로덕션 운영 가능 여부 (05 입력)
{가능 / 불가} — {근거 1~2문장}
- **"가능"의 조건: blocking(차단) 0건(전건 조치 완료) 그리고 VC14 보류·자동 스캐너 NEEDINPUT 없음(§2b).** 이때 종합 판정이 "배포 가능" 또는 "조건부 가능(최소 수정 필요)"이면 **가능**이다 — 남은 advisory(권고)는 없앨 필요 없이 담당자·기한(조치계획)과 함께 05로 이월한다. (프로덕션 진입 게이트는 **blocking·VC14·NEEDINPUT에만** 의존한다. advisory는 게이트를 막지 않는다.)
- "불가"의 조건: blocking이 하나라도 남았거나 VC14가 미해소(보류). 이 경우 05로 진행하지 않는다 — 고치고 재검증한다.

## 5. 📋 쉽게 풀어 쓴 점검 결과 (비전문가용, 부적합·보류만)
| 항목 | 무엇이 문제인가 | 안 고치면 |
|------|-----------------|-----------|
| A2   | 이름·고유번호가 주소창에 실려 나감 | 접속기록·브라우저 기록에 회원정보가 남음 |
| VC15 | 코드에 조직명/실명이 박혀 있음 | 배포는 가능하나 코드 공개·공유 시 이 이름이 노출됨 |
| VC14 | 라이브러리 취약점 점검이 아직 미완 | 문제 발견이 아니라 담당자가 한 단계 더 점검해야 하는 상태 |

## 5b. 배포 전 직접 해볼 체크 (비전문가용 · 최대 5개)
자동 수정이 제대로 됐는지 **당신이 직접 눈으로** 확인할 것들입니다(수정마다 쌓인 확인 항목 중 가장 중요한 것만 추림). 하나씩 해보세요.
1. {예: 권한 없는 계정으로 「전체 명단」 화면을 열어 '접근 거부'가 뜨는지}
2. {예: 다른 지파/교회 계정으로 로그인해 남의 소속 데이터가 안 보이는지}
3. {예: 로그아웃(시크릿) 창으로 소스 URL 접속 시 404가 뜨는지}
4. {…}
5. {…}
- 이상하면(막혀야 하는데 열림 등) AI에게 "여기서 이렇게 나와요"라고 알려주세요.

## 6. 사용자 액션 안내 (AI가 코드로 못 하는 것만 · 각 1단계)
- {예: 레포를 private으로 전환 — GitHub → Settings → Danger Zone → Change visibility → Private}
- {예: Supabase 대시보드에 아래 RLS SQL 붙여넣기}
- {예: 유출 정황 있으면 총회에 client_id 재발급 요청}

## 7. 결과 회신 안내
이 검증 결과(판정·수정 내역·기준 버전)를 담당자(총회 정보통신부 전산개발과)에게 그대로 전달하세요.

✅ 검증 자가 점검 완료 (배포전-검증 v2.0 · VC1~VC16 + 시온 A~E 전수 판정 확인[ + 봇 VB1~VB5])
```

---

## 6. C11 Integrated Procedure (VC14 dependency check)

`[AI directive]` Keep VC14 at "추가확인필요 (needs-input, deferred)" until results are in hand.
- **Step 1 — identify the stack:** identify directly from dependency files (`requirements.txt`/`pyproject` → Python, `package.json`/lock → Node·TS, `go.mod` → Go, `Cargo` → Rust, `composer` → PHP, `Gemfile` → Ruby, `pom`/`gradle` → Java). Without files, infer from imports, library names, and extensions. If version information is missing, state "stack known but no versions — precise checking impossible", ask for the dependency file or a platform scan, and defer.
- **Step 2 — static verdict:** check version pinning and the presence of lock files.
- **Step 3 — execution branch:** if a shell can be run directly, run the audit tool and update from the results. If not, provide the commands below and update from the pasted results. Either way, defer until results exist.
- **Audit tools:** (A) No installation — if the code is on GitHub/GitLab, enable Dependabot/Dependency Scanning (but first confirm, before pushing, that `.env` is in `.gitignore` and the repo is **private** — VC2·E5). (B) Terminal:
  ```bash
  pip install pip-audit && pip-audit -r requirements.txt   # Python
  npm audit / yarn audit / pnpm audit                       # Node·TS
  go install golang.org/x/vuln/cmd/govulncheck@latest && govulncheck ./...   # Go
  cargo install cargo-audit && cargo audit                  # Rust
  composer audit                                            # PHP
  gem install bundler-audit && bundle-audit check --update  # Ruby
  ```
- **Step 4 — hand-holding guidance (fallback):** if the user struggles, walk them through opening a terminal → pasting the command → handling errors, tailored to their OS. If both the terminal and GitHub are too hard, route to "run one check with a coding agent; if still stuck, send the code and this verification result to 정보통신부 for help" (no dead ends).
- **Step 5 — result follow-up:** when the user pastes results/alerts/errors, tabulate vulnerable packages, current/recommended versions, and severity; provide upgrade commands (`pip install "pkg>=x"`, `npm install pkg@x`, etc.) and the dependency-file edit (before/after of only the changed lines), with a one-line compatibility warning for major-version changes. Afterwards update VC14 to pass and, if needed, direct a full re-verification.

`[바이브코더 안내]` VC14가 "추가확인필요"로 나오면, 그것은 문제가 발견된 것이 아니라 **한 단계 더 점검이 필요한 상태**다. AI가 안내하는 명령 한 줄을 터미널에 붙여넣거나, 코드를 private 레포에 올려 자동 점검을 켜면 된다. 막히면 코드와 이 보고서를 정보통신부에 보내 도움받는다.

---

## 7. Conflict-Resolution Table (Zion Login first) — gist of the 11 items

`[⚠ Conflict resolution]` When the security guide and the Zion Login canon conflict, **Zion Login always wins.** Below is the gist of the points that this file's verification touches (full commentary: 통합 문서 부록 A).

| # | Issue | Security-guide position | Zion position | Resolution (Zion first) |
|---|------|-----------------|-----------|-----------------|
| 1 | Auth, self-issued tokens | G12 (password hashing)/generic self-managed login | Hard rule 2: self-issued JWT and `JWT_SECRET` forbidden; session token = the Zion `access_token` | **Zion.** Never build new local password auth. Identity and sessions come from the Zion `access_token`. G12 applies only to separate non-Zion secrets (webhook secrets, etc.). → Verified at: **VC6/D2**. |
| 2 | DB access control, identity source | G7 (`auth.uid()`/Firebase auth, browser→DB direct) | The backend fixes identity from the session; permissions = local 고유번호; scope = `organizationPaths` | **Zion.** Identity is the 고유번호 from the Zion session, not `auth.uid()`. Go through the backend instead of browser-direct. The **primary scope control is the backend query filter**; RLS (default-deny) is the **second line of defense** blocking non-`service_role` paths (`service_role` bypasses RLS). G24 (minimal response) and R0-6 (server-side enforcement) agree with Zion. → Verified at: **VC4/VC5**. |
| 3 | Login trigger | Personal-data/DB criterion | Hard rule 7/E1: internal-information criterion (broader than personal data) | **Zion (agrees with §A2 policy P-1).** Handling internal information (including personal data and non-identifying sensitive aggregates) **forces login**; only fully public content is exempt. Client-side gates not recognized (R0-6·E3). Matches 총회 §E. → Verified at: **E1–E4**. |
| 4 | Minimal member-data collection | G17 (minimal-collection principle) | Hard rule 3: exactly 4 fields; more requires 총회 approval | **Zion.** The 4-field ceiling applies. G17 is the generic form of this ceiling. → Verified at: **B1**. |
| 5 | Permission model | G9/G10 (server authorization, mass assignment — generic) | Hard rules 4/5: 고유번호 RBAC, 직책 display-only, `SUPER_ADMIN` = `DO_EVERYTHING` | **Zion.** Permissions by 고유번호; duty-based automatic permissions forbidden. The G9/G10 principles (server-side, self-escalation blocked, fail-closed) still apply on top of the Zion model. → Verified at: **VC5/D7**. |
| 6 | Audit logs (guide gap) | None | B4/B5/C2/D7 | **Zion adopted.** Auditing of bulk reads, permission grants/revokes, exports, and `SUPER_ADMIN` actions is mandatory. → Verified at: **Area 4**. |
| 7 | Bulk personal-data handling | G18 (user confirmation) | C1/C2 (dedicated permission + audit) | **Both (complementary).** Bulk exports need user confirmation + a dedicated permission + audit, all three. → Verified at: **C1–C5**. |
| 8 | Non-public source/private repo | G5/G6/VC3 | Hard rule 8/E5 | **No conflict.** Zion principle + the guide's live probe (VC3, stronger) adopted. → Verified at: **VC3/E5**. |
| 9 | Start behavior, user questions | R0-1/R0-2 (never ask about security, safe defaults, 3 exceptions) | Fixed flow; human touchpoints = alpha key, 총회 approval, production verdict | **The Zion flow's touchpoints are folded into the R0-2 exceptions.** Bot auth strength (B2) only when a bot is included. → This file is the **production-verdict** touchpoint. |
| 10 | Credentials | G1 (no hardcoding) | D11 (per-system unique key, no reuse) | **Both.** Keep G1 + add D11. → Verified at: **VC1/D11**. |
| 11 | Bot add-on (B1–B5) | — | Web OAuth login (not a bot) | Apply 통합 문서 부록 C additionally **only when a separate bot component exists**. Not applied to the base web flow. → Verified at: **VB1–VB5 (conditional)**. |

---

## 8. Completion Criteria for This Stage

`[Check]`
- [ ] **Automated scanner (`tools/security_scan.py`) executed** (§2b) → every FAIL and NEEDINPUT resolved (NEEDINPUT: obtain the values and re-run) → re-run to obtain a **FAIL 0 · NEEDINPUT 0 report** (code fingerprint + file-manifest fingerprint), recorded in §5 「0. 자동 점검 결과」.
- [ ] Every §3 item (VC1–VC16 + A1–A7·B1–B6·C1–C6·D1–D11·E1–E6 + **the Area 9 supplement S1–S19**, plus VB1–VB5 if a bot exists) judged exhaustively (scanner WARN/SKIP also finally judged by the AI).
- [ ] Every finding fixed by the AI (direct code edit or complete code output).
- [ ] The §5 report generated (tallies + overall verdict + **production-readiness verdict** included).
- [ ] Blocking findings = 0 **and** "프로덕션 운영 가능 = 가능".
- [ ] **Review track re-checked** (§A2 policy P-2): if the spec claimed the lightweight track (경량 트랙), confirm every P-2 condition still holds against the finished code (no member-list surface, no export codes, no bulk PII, scale within limits); otherwise the request goes full track.

`[Next step]`
- All completion criteria met (blocking 0 + "프로덕션 운영 가능") → proceed to `05_production_key_request.md`. This report is its input.
- Any criterion unmet (a critical/blocking finding, VC14 deferred, "운영 불가") → **fix, then re-verify with this file from the beginning.** Do not move on to `05_production_key_request.md` before passing.
- The detailed conflict and supplementary criteria required for this VOSS review are included in appendices A–C of this integrated document. Do not stop the review to request separate reference files from the user.

---

## VOSS 구조화 판정 작성 규칙

이 통합 문서 후반부의 `결과 확정 및 VOSS 제출 절차`를 이어서 읽고 다음을 수행하세요.

- `VC1~VC16`, `A1~A7`, `B1~B6`, `C1~C6`, `D1~D11`, `E1~E6`, `S1~S19`를 구조화 결과에 정확히 한 번씩 포함합니다.
- 별도 봇 구성요소가 있을 때만 `VB1~VB5`를 추가합니다.
- 판정은 `pass`, `fail`, `n/a`, `needs_follow_up` 중 하나를 사용합니다.
- 위험도는 원문 기준의 `blocking`, `advisory`, `deferrable`, `recommendation` 중 하나로 기록합니다.
- `blocking fail`, blocking `needs_follow_up` 또는 `VC14/D10` deferrable `needs_follow_up`이 남아 있으면 `overallVerdict=pass`로 제출하지 않습니다. advisory·recommendation의 `fail`·`needs_follow_up`은 후속 조치로 남길 수 있으며 단독으로 종합 적합을 막지 않습니다.
- `S16`은 저장 민감정보 여부, 확인한 저장 경로와 필드, 적용 시 암호화·키 분리·마이그레이션 근거를 `evidence`에 기록합니다. 단순히 `DB 사용`, `VOSS PostgreSQL`, `디스크 암호화`만 적은 근거는 인정하지 않습니다.
- 자동 스캐너의 `FAIL`과 `NEEDINPUT`이 0이 된 최종 결과만 VOSS 적합 제출로 인정됩니다.
- 보고서·스캐너 파일을 생성한 후 파일을 다시 쓰거나 줄바꿈을 정규화하지 말고, 저장된 원본 바이트를 기준으로 Base64와 SHA-256을 계산합니다.

---

# 부록 A. 공통 보안 규칙과 시온 로그인 충돌 해결 원문

# 01b · Pre-development — Common Security Rules (G1–G24) + Conflict Resolution

> **Preamble — priority declaration**
> The **Zion canon in `01_zion_login_canon.md` takes absolute precedence.** The common security rules below (G1–G24, R0) apply **on top of** that canon.
> When a common security rule conflicts with the Zion canon, **always follow the Zion Login rule** (see the conflict-resolution table in this file). Never revert to the generic security-guide position.

---

## When to read this file
Immediately **before development starts** — right after `01_zion_login_canon.md` has been injected/accepted. This file fills the general web-security ground the Zion canon does not cover (secrets, hosting, DB access, input/output, personal data, operations) and pins the verdicts where the two overlap.

## What this file contains
- **R0 integration** — top-priority rules that stay in force on top of the Zion flow: R0-6 (server-side enforcement), R0-7 (weakest link), R0-8 (retroactive application), R0-1/R0-2 (ask-a-human exceptions → merged into the Zion flow's human-intervention points).
- **Common security rules G1–G24** — every item of the legacy pre-development common ruleset, intent preserved, aligned to the Zion context. One line per rule + one line of Zion context where relevant.
- **Conflict-resolution table (11 items)** — each entry reads "security-guide position / Zion position / resolution (Zion wins)". Conflicts are always resolved in Zion's favor.
- **One-line code self-check** — the check the AI performs every time it emits code.

---

## A. R0 integration — top-priority rules on top of the Zion flow

`[AI directive]` The R0 rules below rank above G1–G24. When G rules conflict with each other or with the situation, R0 decides. But when R0 conflicts with the Zion canon, Zion wins.

| ID | Rule | Application in the Zion flow |
|---|---|---|
| **R0-6** | **"Hiding things on the client/screen is not security."** Access control, permission checks, payment decisions, and data filtering MUST be enforced on the **server** (RLS/security rules, or server functions/RPC). A browser-JS `if (isAdmin)`, screen-side filters, a password prompt screen, or a hidden div are UI conveniences, not security boundaries. Never build "download all the data, then hide it on screen." | Matches Zion **E3 (access boundary)**. Identity and permission decisions are enforced by the backend using the Zion session's **고유번호 (newNo)**. A client-side password gate does not count as authentication. |
| **R0-7** | **"Weakest link" principle.** Among the screens/features/endpoints sharing one DB/project, if a single one is weak, the whole thing is breached. Once one place is secured, apply the same bar to **every path** that touches the same data. | Apply the same **permission check + data-scope (organizationPaths) filter** to every API/page that touches member data. Leave not a single path that bypasses the Zion session gate. |
| **R0-8** | **[Retroactive application]** If this directive is injected mid-development (code already exists), apply the rules **retroactively to the code written so far** — review and fix it before proceeding, not only to code yet to be written. | Same as the retroactive application declared in `00_START_HERE.md`. Retroactively apply the Zion canon (core flow, session model, permission model) and G1–G24 to the existing code, fix it, then continue. |
| **R0-3** | When unsure, do not improvise — choose the **safer** option. | When a Zion rule's interpretation is ambiguous, ground it in `01_zion_login_canon.md` and `references/` (permission-model, api-catalog); if still ambiguous, choose the fail-closed side. |
| **R0-4** | Do not add dangerous features (external command execution, exposing public endpoints, bulk export of personal data, etc.) until the user has **explicitly requested them and confirmed understanding**. | Bulk member-data export (Zion C1/C2) is not built until user confirmation + a dedicated permission + audit are all in place. |
| **R0-5** | Values the user must fill in (tokens, allowlists, etc.) are shown as **blanks/placeholders**. Settings that require judgment are decided by the AI. | Zion keys (`OAUTH2_CLIENT_ID`, etc.) and endpoint URLs go into `.env` as placeholders only; the vibe coder fills in the real keys. `.env.example` contains placeholders only. |

### R0-1 / R0-2 → merged into the Zion flow's human-intervention points

`[AI directive]`
- **R0-1.** For security choices, do not ask the user — the AI **implements the safest default directly**. Record what was decided and why in a single comment line above the code, nothing more.
- **R0-2.** The only exceptions where a human is **asked, in plain language**, are pinned below. Since the Zion flow has a fixed order, R0-2's exceptions are merged with the Zion flow's **human-intervention points**. Security choices outside this table are not asked about, per R0-1.

`[⚠ Conflict resolution]` The Zion flow is fixed (conflict-resolution table #9). Outside the points below, the AI proceeds silently with safe defaults.

| Human-intervention point | What is asked of / received from the human | In which file | Governing rules |
|---|---|---|---|
| Hosting/deployment type | Ask the deployment-target type (1–4) once, then configure per type | `06_deploy_and_operations.md` | R0-2 exception · G5 · Zion hard rule 8/E5 |
| Intent behind bulk personal-data processing | Whether bulk upload/export/external transfer is **actually needed** | (when that feature is built) | R0-2 exception · G18 · Zion C1/C2 |
| Alpha key request | Request the **development (alpha) key directly from HQ (총회 정보통신부 전산개발과)** | `02_spec_and_alpha_key.md` | Zion credentials (keys not bundled — HQ-issued) |
| HQ approval (field ceiling exceeded) | If member-data collection must exceed the **4-field ceiling**, obtain HQ (총회) approval | `02_spec_and_alpha_key.md` | Zion hard rule 3 |
| Production-operation verdict | The file-04 report's **"production readiness" verdict** → production key request | `04_predeploy_verification.md` → `05_production_key_request.md` | VC1–VC16 · A–E · Zion hard rules |
| (Only when a bot component exists) Bot entry-authentication strength | B2 authentication strength | `references/bot-addon-optional.md` | R0-2 exception · conflict-resolution table #11 |

---

## A2. Organizational Policy Registry

`[⚠ Organizational policy]` This section is the **single place that collects policy decisions made by the organization (총회 / in-house)**. When an adjustment relative to the Zion canon is needed, record it **here only**; other files reference this registry (never scatter policies across files — this protects the "Zion wins on conflict" principle from erosion). Read each policy as "Decision / Relationship to the Zion canon / Rationale / Where it applies".

### Policy P-1 — login trigger = internal information

- **Decision:** **If the system touches internal information at all, Zion Login is mandatory.** Internal information = everything not meant for the public (member data / personal data, external contact lists, org/operations information, strategy, non-public notices, etc.). **Whether it is personal data (고유번호 etc.) or non-identifying internal sensitive data (e.g. per-지파 donation totals — aggregates) — if it is internal, login is mandatory.** Only fully public content (public notices, marketing) needs no login. **When in doubt, treat it as internal** and put it behind login (under-classification is the more dangerous error).
- **Relationship to the Zion canon:** **In agreement** (hard rule 7 / E1 as-is — the trigger is the broader "internal information", not "personal data"). This is canon compliance, not an adjustment. It also matches the HQ production-key review (`references/privacy-security-review.md` §E), so there is **no §E rejection risk**.
- **Rationale:** Even data that identifies no individual, if it is organizational confidential material (sensitive aggregates, etc.), must sit behind login. A "personal data only" trigger misses such internal sensitive data — too narrow.
- **Where it applies:** Client-side password gates/overlays/`localStorage` flags are not recognized as authentication (R0-6, E3 — server-side enforcement). The classification table is item 7 of `02_spec_and_alpha_key.md`; pre-deployment verification is E1–E4 of `04_predeploy_verification.md`; conflict resolution is #3 in the table below.
- **[⚠ Public collection vs gated administration — common misunderstanding]** When personal data is collected **from general public visitors** (newsletter, contact, application forms, etc.), "Zion Login mandatory" does **not** mean *require the submitter to log in as a member* (that would defeat the form's purpose — over-gating, `04_predeploy_verification.md` E2). What must be gated is **not "who submits" but "who views, manages, and exports the collected data"**:
  - Put **the view/manage/export paths for the collected data** behind Zion Login + 고유번호 RBAC + audit, enforced **server-side** (E1, E3, E4, B4, C1, C2).
  - Leave **the public submission endpoint** login-free, but harden it with minimal collection (G17), input validation (G13), rate limiting (G21), and response/log masking (G19).
  - **Non-member PII is unrelated to the member-data model:** hard rule 3's "4-field ceiling / EMAIL etc. forbidden" governs **member data fetched from Zion**. PII newly collected independently of Zion (public newsletter emails, etc.) is not member data, so that ceiling/prohibition **does not apply to it (and is not a reason to refuse the request)**; instead, G17–G19 (general PII) plus gated administration, audit, and retention/destruction apply.

### Policy P-2 — lightweight review track (경량 트랙) for small, low-risk systems

*Status: added 2026-07-05 as a recommended policy; to be confirmed by HQ (총회 정보통신부 전산개발과) at its next review. Until then it changes only how the request is marked — HQ may still review at full depth.*

- **Decision:** A system that meets **ALL** of the eligibility conditions below may request its production key on the **lightweight review track**: HQ reviews only the 5-item request plus the automated scanner report (report_id, code fingerprint, file-manifest fingerprint, FAIL 0 · NEEDINPUT 0) and **waives the full verdict-table review**. Eligibility (all mandatory):
  1. **Member data used at most for login + showing the signed-in user their own identity** (no other members' data is listed, searched, stored, or displayed beyond the local user snapshot) — or no member data at all (the internal information is non-personal).
  2. **No export/download of any internal data** (no `*_EXPORT`/`*_DOWNLOAD` permission codes exist).
  3. **No bulk PII processing** (none of the G18 triggers: bulk upload/import, scraping, full-list export/transfer, third-party/LLM transmission).
  4. **Small scale:** one operating department (사용부서 1개) and expected total users ≤ 100.
  5. **The standard gate is still fully passed:** `04_predeploy_verification.md` run in full — blocking 0 and scanner FAIL·NEEDINPUT 0.
- **What does NOT change:** the developer-side flow is identical — all 6 stages, the full 52-item gate (+ the S1–S19 infra/compliance supplement), the two mandatory pages, private repo, audit rules. The AI and the scanner do that work anyway; **only the depth of HQ's human review is reduced.** If any eligibility condition later breaks (a member list screen, an export, growth past the scale line), the next change goes through the **full track**.
- **Relationship to the Zion canon:** compatible — no hard rule is relaxed. The canon fixes *what must be true of the system*; P-2 only tiers *how deeply HQ re-verifies it*, leaning on the scanner's tamper-evident fingerprints.
- **Rationale:** with 12 tribes submitting, HQ review throughput is the realistic bottleneck. Small self-service tools with no member-data browsing and no exfiltration surface carry a fraction of the risk of a member-directory system; spending full review depth on them delays the reviews that matter.
- **Where it applies:** the AI determines eligibility at spec time (`02_spec_and_alpha_key.md`, spec item 8) and re-checks it at `04_predeploy_verification.md` completion; the production-key request marks the track (`05_production_key_request.md` template, 부기). HQ makes the final call — a lightweight-track request is a claim, not an entitlement.

### Policy P-3 — small public collection forms (소형 폼): write-only pattern, no Zion Login required

*Status: added 2026-07-05 as a recommended policy; to be confirmed by HQ at its next review. The pattern is strictly narrower than P-1's gated-administration clarifier (it removes the read surface entirely), so applying it early does not weaken P-1.*

- **Decision:** A small public form collecting **non-member PII** (문의·신청·뉴스레터 등) may be built **without Zion Login** if it follows the **write-only pattern** — the system exposes **no read path at all** for the collected data. ALL conditions mandatory:
  1. **Non-member PII only** — data comes from public visitors; no Zion member data (`/me` fields) is stored with it.
  2. **Minimal fields for the purpose** (name / one contact channel / free text level). **Never** PIPA-sensitive categories (건강, 종교적 신념, 사상, 성적지향 등) and never national-ID-grade identifiers.
  3. **Write-only:** the system has **no view/search/manage/statistics/export UI or API** for the collected data. There is nothing internal to expose, so the P-1 login trigger is not tripped.
  4. **Delivery + purge:** each submission is auto-forwarded to **one fixed, documented internal recipient** over an org-approved channel (사내 메일 등 — no unapproved third-party services), and/or stored server-side with **auto-purge ≤ 30 days** (a job or startup task that actually runs — B2). Longer retention requires a documented reason and forces full-track consideration.
  5. **PIPA notice on the form:** purpose · items · retention period · a contact for deletion requests (수집·이용 고지).
  6. **Endpoint hardening:** input validation (G13), rate limiting (G21), submitted PII never in app logs or error bodies (G19), HTTPS; the data store is gitignored and never committed (G1); **the repo is still private** (hard rule 8 — the system transiently holds internal information).
  7. **Volume guard:** if retained rows would exceed ~1,000, or any browsing/statistics/search need appears, **stop — switch to the full track** (gated administration per P-1: Zion Login + 고유번호 RBAC + audit on the management path).
- **Re-evaluation stays armed:** `00_START_HERE.md` §1.1 applies unchanged — the moment ANY read path is added, the P-1 trigger fires and the system promotes into the full Zion Login flow.
- **Relationship to the Zion canon:** compatible. P-1's clarifier already exempts the *submitter* from login and gates the *management path*; P-3 covers the degenerate case where the best management path is **no path**. Fewer surfaces than a gated admin screen — strictly less exposure.
- **Rationale:** forcing a full Zion Login backend + RBAC + audit stack onto a 5-field contact form makes the secure route so expensive that vibe coders route around it; a write-only pattern keeps the risk profile lower than the "proper" alternative while staying buildable in an afternoon.
- **Where it applies:** triage exception in `00_START_HERE.md` §1.1; classification note in `02_spec_and_alpha_key.md` item 7; verification via E1/E4 (a write-only system passes by *having no read surface*, verified — not assumed) plus G13/G19/G21/B2 in `04_predeploy_verification.md`. No key request is involved (no Zion Login), but running the scanner locally before deploy is still expected.

> If the organization later adjusts other canon rules, **add them to this registry only, as P-4, P-5, …** — the affected files must reference this registry instead of restating the rule.

---

## B. Common security rules G1–G24 (aligned to the Zion context)

`[AI directive]` The G rules below apply **in addition to** the Zion canon. Each rule preserves its original intent; where it touches Zion, the "Zion context" column aligns it in one line. Overlaps that need a detailed verdict link to this file's conflict-resolution table.

### B-1. Secrets & credentials (G1–G4)

| ID | Rule | Zion context |
|---|---|---|
| **G1** | Never write tokens, passwords, API keys, or internal IPs directly in code → load from `.env`/environment variables. Always ship `.env.example` (placeholders only). `.gitignore` must include `.env`, DB files (`*.db`, `*.sqlite*`), sessions, logs, roster/personal-data files, and the progress marker (`.pstate`, `00_START_HERE.md` §1.7). | Zion keys (`OAUTH2_CLIENT_ID`; the AUTH/TOKEN/USERINFO/VALIDATE/AUTHORITIES URLs; `REDIRECT_URI`, etc.) are likewise loaded from `.env` only. Having no `JWT_SECRET` is **normal**. Zion D11 (per-system unique key, no reuse) applies additionally (conflict-resolution #10). |
| **G2** | Never put secrets in URL query strings (`?key=`, `?secret=`, `?payload=`) → deliver via **HTTP headers only**. (Query strings persist in plaintext in access logs, Referer, history, and cron records.) | Never let the Zion `access_token` or `newNo` (고유번호) appear in URLs, logs, or raw error output (directly tied to Zion D audit / the token-logging ban). |
| **G3** | Keys that bypass RLS (`service_role`, master, admin, etc.) must **never** be placed in the browser, client, or static files. Server-only. Even if the backend runs as `service_role`, keep table **RLS on, default-deny** (second line of defense). | If Supabase is used as the local DB, go **through the backend (behind the Zion session gate)** instead of connecting the browser directly. The backend may run as `service_role`, but RLS stays on (conflict-resolution #2). |
| **G4** | If `.env` was ever committed/pushed, or the repo was ever public, treat it as **already leaked** → guide the user to re-issue tokens. (Making the repo private or gitignoring does not recall values from history.) | If a Zion key has ever been exposed, request **re-issuance/revocation from HQ (총회)** (see the key-revocation procedure in `06_deploy_and_operations.md`). |

### B-2. Hosting & repository — preventing source exposure (G5–G6)

| ID | Rule | Zion context |
|---|---|---|
| **G5** | Default to **hosting that does not expose the source**. At the point deployment becomes necessary, ask **once** for the deployment-target type (① internal server ② free static/serverless ③ GitHub ④ undecided) (R0-2 exception) and configure per type. Judge by **type** (static / serverless / container·self-hosted / managed backend), not by vendor name. | **No conflict** with Zion hard rule 8/E5 (source non-public). The type question and configuration are performed in `06_deploy_and_operations.md` (conflict-resolution #8). |
| **G6** | Ensure the source is not **publicly readable without authentication** (regardless of deployment target). On a git host, repo private by default (user's one step: Settings → Danger Zone → Change visibility → Private). After configuring, **open the source URL in a logged-out (incognito) window and confirm a 404**. | Adopt Zion E5 plus the guide's **live check (VC3 — stronger)**. Post-deployment live checks are performed in `04_predeploy_verification.md` and `06_deploy_and_operations.md`. |

### B-3. DB access control (G7–G8)

| ID | Rule | Zion context |
|---|---|---|
| **G7** | If the client accesses the DB **directly**, the entire access-control story rests on DB rules. **Supabase**: RLS enabled on every table + owner/role policies; sensitive reads/writes only via server-validated RPC; no `anon` full-access policy. **Firebase**: lock down with security rules (no `allow …: if true`; at minimum `auth != null` + owner/role). **GAS / self-hosted backends**: no unauthenticated `doGet`/`doPost`; server-side identity verification (ID-token signature, aud, exp). | **→ Zion wins (conflict-resolution #2).** Identity is the **Zion session's 고유번호**, not `auth.uid()`. If Supabase is the local DB, go **through the backend** instead of connecting the browser directly. **The primary control for scope enforcement is the backend application query filter** (keyed on `organizationPaths`). RLS (default-deny) is the **second line of defense** blocking **non-`service_role` paths** (direct `anon`/`authenticated` connections, etc.) — `service_role` bypasses RLS (BYPASSRLS), so RLS policies (including 고유번호-context policies) are **not evaluated** for backend queries running as `service_role`. To actually apply a "고유번호-context" RLS policy, run that query under a non-`service_role` role. Do not copy G7's `auth.uid()` examples as-is. |
| **G8** | Having the `anon`/public key in code is **normal in itself**. The premise is "RLS/rules are properly locked". Whenever writing code that uses a public key, **create the matching RLS/rules as a set** (either one alone is incomplete). | In Zion, the **primary scope control is the backend query filter**; keep RLS (default-deny) as the **second line of defense** blocking non-`service_role` paths (G3, conflict-resolution #2). |

### B-4. Minimal response — preventing over-fetching (G24)

| ID | Rule | Zion context |
|---|---|---|
| **G24** | **Minimal-response principle.** APIs/queries fetch only the data they need and return only what is needed (separate from RLS). No `select *` / all-columns; exclude sensitive columns not used on screen; **row filtering, sorting, pagination, search on the server**; split response DTOs per screen/role; aggregate via server-side aggregate queries. | Directly tied to Zion **R0-6** and the Zion **A (exposure) gate**. Member data stays within the **4-field ceiling** (`newNo`/`name`/`organizationPaths`/`organizationWithDuties`), sending only the fields each screen/role needs. "Download everything and hide it in the frontend" is forbidden (matches the minimal response of conflict-resolution #2). |

### B-5. Server-side authorization & privilege-escalation prevention (G9–G12)

| ID | Rule | Zion context |
|---|---|---|
| **G9** | Permission decisions are made **on the server** (R0-6). Never trust client-sent permission fields (`role`, `isMaster`, `isAdmin`, etc.). Permission values from session/localStorage are re-verified by the server on every request. Never leave dev backdoors (localhost auto-admin login, etc.) in production code. | **→ Zion wins (conflict-resolution #5).** Permissions are decided by **고유번호 RBAC** (Zion hard rules 4/5). 직책 is display-only; duty-based automatic permissions are forbidden. G9's server-side/re-verification principles apply unchanged on top of the Zion model. |
| **G10** | **Block mass assignment / self-escalation.** When a user edits their own record, lock `role`, permissions, 소속, and `status` server-side (trigger/policy/RPC) so they cannot change them. New applications always start as 'pending approval'. | In the 고유번호→permission-code local table, only **`SUPER_ADMIN` (= `DO_EVERYTHING`) or a delegated `PERMISSION_ADMIN`** may grant/revoke permissions. Grants and revocations require audit (Zion B5). |
| **G11** | **Fail-closed.** No fail-open "check only when the value is set". If a secret is unset, reject unconditionally (401). Compare in constant time (`timingSafeEqual`). | If Zion **session revalidation** (`validate`, default 300s) fails, reject the session fail-closed (consistent with the Zion hard rules / session model). |
| **G12** | Never store passwords in plaintext or compare them on the client. Compare server-side (RPC/function) with a hash (bcrypt/PBKDF2), returning only true/false. No client-side plaintext-comparison fallback on network failure. | **→ Zion wins (conflict-resolution #1).** **Never build new local password authentication.** Identity and sessions are the Zion `access_token` (Zion hard rule 2; `JWT_SECRET` forbidden). G12 applies only to **separate secrets outside Zion** (webhook secrets, etc.). |

### B-6. Input/output safety (G13–G16)

| ID | Rule | Zion context |
|---|---|---|
| **G13** | Validate/filter all external input (messages, filenames, command arguments, payloads, uploads). Parameterized queries against SQL injection; no shell/`eval`/`exec`/`os.system` against command injection. | Validate the inputs of member-data APIs the same way (R0-7: same bar on every path). |
| **G14** | **XSS.** Never put user-derived or externally derived values (names, free text, model output, sheet values) directly into `innerHTML` → `textContent`/`escapeHtml()`. No auto-escaping bypasses (`dangerouslySetInnerHTML`, etc.). CSP header where possible. | **A spot where the guide fills a gap the Zion canon leaves open.** Especially when rendering the member `name` and similar. Must be judged as **VC8** in `04_predeploy_verification.md`. |
| **G15** | **SSRF.** If the server fetches user-specified URLs: scheme/host allowlist; block private, link-local, and loopback ranges (`169.254.169.254`, `localhost`, `10.`, `192.168.`, `127.`); no redirects; timeout and response-size caps. Never reflect upstream status or raw error bodies. | A spot where the guide fills a Zion gap. Judged as **VC9** in `04_predeploy_verification.md`. |
| **G16** | Validate file uploads and CSV/Excel processing server-side (format, size, row count). Block **formula injection** in CSV export (escape cells starting with `=`, `+`, `-`, `@` by prefixing `'`). | Directly tied to member-roster export (Zion C1/C2). Judged as **VC10** in `04_predeploy_verification.md`. |

### B-7. Personal data (PII) (G17–G19)

| ID | Rule | Zion context |
|---|---|---|
| **G17** | **Minimal collection.** Collect only what is needed. For PIPA sensitive data (religion/beliefs, health, minors, sexual orientation, ideology, etc.), reconsider whether to collect at all; if unavoidable, run a separate explicit-consent procedure. | **→ Zion wins (conflict-resolution #4).** Member data has an **exact 4-field ceiling** (Zion hard rule 3); exceeding it requires HQ (총회) approval. Treat G17 as the **general form** of that ceiling. |
| **G18** | **[R0-2 exception — always ask]** For features that process personal data **in bulk at once** (bulk upload/import, scraping, full-roster export/transfer, transfer to external parties (third parties, LLMs, Google, etc.)), **ask the user's actual intent before writing code**. (Small-scale/routine cases — e.g. one person's own data — are not asked about.) | **→ Both (conflict-resolution #7, complementary).** Bulk export requires **user confirmation (G18) + a dedicated permission (Zion C1) + audit (Zion C2)** — all of them. |
| **G19** | Never expose personal data in HTTP responses, debug output, or logs. Mask emails, phone numbers, names, and secret URLs. Error responses carry only a simple notice — no stack traces, internal paths, or raw upstream bodies. | Consistent with Zion's **token/`newNo` logging ban**. Do not expose internal values of the Zion response envelope (`traceId`, etc.) verbatim in raw error output. |

### B-8. Operations & misc (G20–G23)

| ID | Rule | Zion context |
|---|---|---|
| **G20** | Use only maintained, stable library versions. Avoid deprecated/vulnerable stacks (e.g. the `request` family). Prefer lightweight dependencies; avoid inefficient queries (N+1). | Considering resource-constrained environments (self-hosted servers, NAS), keep the Zion integration code lightweight too. |
| **G21** | Apply **rate limiting**: excessive requests from the same user, brute force, and abuse of paid APIs (LLM/TTS, etc.). Never expose paid endpoints without authentication. | A spot where the guide fills a Zion gap. Judged as **VC13** in `04_predeploy_verification.md`. Also applies to the login/token-exchange endpoints. |
| **G22** | No org names, real names, internal jargon, religious terms, internal IPs, deployment hosts, or project identifiers in code comments, variable names, or messages (neutral naming). Externalize unavoidable values into `.env`/config. | Consistent with Zion's **user-facing naming rules**: never expose `'ZAuth'`; no codes/enums/internal IDs in the UI; `newNo` is always labeled **'고유번호'** for users. |
| **G23** | In the pre-deployment verification step, instruct the user **not to upload the real `.env` (actual tokens)** (`.env.example` only). Tools that run directly on the directory (Claude Code, etc.) must **not open and read `.env` contents** — check only that it exists and is in `.gitignore`. | Same for the Zion alpha/production keys. Real keys live only in the local `.env` (gitignored); the repository stays private (`06_deploy_and_operations.md`). |

### B-9. Infrastructure hardening & PIPA compliance (G25–G34 → `references/infra-compliance-supplement.md`)

`[AI directive]` G1–G24 above are dense on auth/authorization/minimization/source-exposure but thin on **runtime/infra hardening** and the **procedural obligations of 개인정보보호법 (PIPA)**. Those two axes are the ground the in-house 64-item audit checklist inspects and are collected in **`references/infra-compliance-supplement.md`** — apply it exactly like G1–G24 (additive; the Zion canon and A–E gate are not modified). Load it in the pre-development stage together with this file.

| Group | Rules | Covers (checklist) |
|---|---|---|
| **Infra/runtime hardening** | **G25** production debug OFF · custom error pages · directory-listing OFF · no stray backup files; **G26** HTTP→HTTPS redirect + HSTS; **G27** file upload/download hardening (whitelist·MIME·signature·non-exec path·no path-traversal); **G28** DB port not exposed · required ports only · WAF (rec); **G29** admin surface = server-side RBAC gate (network-isolation substitution — design note) | 12-4·12-5·12-7·12-9 · 3-2 · 11-6~11-10 · 14-1·14-2·14-4·3-3 · 2-1·2-2·13-1 |
| **PIPA compliance** | **G30** audit login success/fail + individual PII access (to the audit table, not app logs — A3 preserved); **G31** artifact-specific retention documentation + privacy-minimized access logs + working rotation/purge (no fixed duration inferred); **G32** encryption at rest (AES-128+) for any stored sensitive datum; **G33** direct-collection notice + consent + required/optional split; **G34** idle timeout ≤60min · no MD5/SHA-1 · dormant-grant review · MFA delegated to Zion IdP | 9-1~9-4·10-3·14-5 · 4-4 · 1-1~1-3 · 6-2·6-3·5-2·4-2 |

`[AI directive]` The supplement also carries a **"already handled / N/A" mapping** (§D there) so an auditor does not false-flag items the Zion design removes (no local password → checklist §7; RBAC gate → 2-2/13-1; etc.), and the **supplementary verification items S1–S19** grafted into `04_predeploy_verification.md`. Religious-affiliation data linked to an identifiable person is 민감정보 (제23조). This raises G30 access accountability for member-data administration, while **G32/S16 becomes blocking only when that or another sensitive field is persistently stored without compliant field encryption**. A member-data screen alone is not an S16 verdict.

---

## C. Conflict-resolution table (Zion Login wins) — all 11 items

`[⚠ Conflict resolution]` **Principle: when a common security rule and the Zion canon conflict, Zion Login always wins.** The 11 items below pin the verdicts at the overlap points. Read each as "security-guide position / Zion position / resolution (Zion wins)". (This table applies identically in `04_predeploy_verification.md`.)

### 1. Authentication & self-issued tokens

| Axis | Content |
|---|---|
| Security-guide position | G12 (password hashing) / generic local login |
| Zion position | Hard rule 2: self-issued JWT / `JWT_SECRET` forbidden; session token = Zion `access_token` |
| **Resolution** | **→ Zion.** **Never build new local password authentication.** Identity/session = the Zion `access_token`. Even if a local-looking login UI exists, the real session is Zion. **G12 applies only to separate secrets outside Zion (webhook secrets, etc.).** |

### 2. DB access control & identity source

| Axis | Content |
|---|---|
| Security-guide position | G7: Supabase `auth.uid()` / Firebase auth, browser→DB direct connection |
| Zion position | The backend fixes identity from the session; permissions = local 고유번호; scope = `organizationPaths` |
| **Resolution** | **→ Zion.** Identity is the **Zion session's 고유번호**, not `auth.uid()`. If Supabase is the local DB, go **through the backend (behind the session gate)** instead of connecting the browser directly. **The primary control for scope enforcement is the backend query filter** (`organizationPaths`); RLS (default-deny) is the **second line of defense** blocking non-`service_role` paths (direct `anon`/`authenticated` connections, etc.) — `service_role` bypasses RLS (BYPASSRLS), so RLS is **not evaluated** for `service_role` backend queries (therefore, in a `service_role` backend, scope MUST be enforced by query filters). To actually apply a "고유번호-context" RLS policy, run that query under a non-`service_role` role. Do not copy G7's `auth.uid` examples as-is. **G24 (minimal response) and R0-6 (server-side enforcement) agree with Zion and remain fully in force.** |

### 3. Login trigger

| Axis | Content |
|---|---|
| Security-guide position | Personal-data/DB-based trigger |
| Zion position | Hard rule 7/E1: **internal-information trigger** (broader than personal data) |
| **Resolution** | **→ Zion.** Anything handling internal information (including personal data, and including non-identifying sensitive aggregates) makes Zion Login **mandatory**; only fully public content is exempt. Client-side gates are not recognized (R0-6, E3). The organization's confirmed policy is §A2 Policy P-1 (internal-information trigger — matches the canon and HQ §E; no rejection risk). |

### 4. Member-data minimal collection

| Axis | Content |
|---|---|
| Security-guide position | G17: minimal-collection principle |
| Zion position | Hard rule 3: **exactly 4 fields**; exceeding requires HQ (총회) approval |
| **Resolution** | **→ Zion.** The **4-field ceiling** applies. Treat G17 as the general form of that ceiling. |

### 5. Permission model

| Axis | Content |
|---|---|
| Security-guide position | G9/G10: server-side authorization & mass assignment (generic) |
| Zion position | Hard rules 4/5: **고유번호 RBAC**; 직책 display-only; `SUPER_ADMIN` = `DO_EVERYTHING` |
| **Resolution** | **→ Zion.** Permissions are keyed on **고유번호**; duty-based automatic permissions are forbidden. The G9/G10 principles (server-side, self-escalation blocking, fail-closed) apply unchanged on top of the Zion model. |

### 6. Audit log (guide gap → Zion addition)

| Axis | Content |
|---|---|
| Security-guide position | None |
| Zion position | B4/B5/C2/D7 |
| **Resolution** | **→ Adopt Zion.** Bulk reads, permission grant/revoke, exports, and `SUPER_ADMIN` actions **require audit**. |

### 7. Bulk personal-data processing

| Axis | Content |
|---|---|
| Security-guide position | G18: user confirmation |
| Zion position | C1/C2: dedicated permission + audit |
| **Resolution** | **→ Both (complementary).** Bulk export requires **user confirmation + dedicated permission + audit** — all of them. |

### 8. Source non-public / private repo

| Axis | Content |
|---|---|
| Security-guide position | G5/G6/VC3 |
| Zion position | Hard rule 8/E5 |
| **Resolution** | **No conflict.** Zion principle + the guide's **live check (VC3, stronger)** adopted. |

### 9. Startup behavior & user questions

| Axis | Content |
|---|---|
| Security-guide position | R0-1/R0-2: don't ask about security, use safe defaults, 3 exceptions |
| Zion position | Fixed flow; human intervention = alpha key, HQ approval, production verdict |
| **Resolution** | **→ Merge the Zion flow's intervention points into the R0-2 exceptions.** (See the human-intervention table in §A of this file.) Bot authentication strength (B2) only when a bot is included. |

### 10. Credentials

| Axis | Content |
|---|---|
| Security-guide position | G1: no hardcoding |
| Zion position | D11: per-system unique key, no reuse |
| **Resolution** | **→ Both.** Keep G1 + add D11. |

### 11. Bot addon (B1–B5)

| Axis | Content |
|---|---|
| Security-guide position | Bot security gates B1–B5 |
| Zion position | Zion Login is web OAuth login (not a bot) |
| **Resolution** | **→ Only when a separate bot component exists**, additionally apply `references/bot-addon-optional.md`. Not applied to the base web flow (preserved only to prevent omission). |

---

## D. Code self-check — every time code is emitted (AI-only)

`[AI directive]` Immediately **before presenting code**, verify on your own that the Zion canon (core flow, session model, permission model) and G1–G24 below are reflected. Fix any omission or weakness **before** presenting. Perform this every single time code is emitted. Do not print the checklist itself — expose only the one-line completion notice.

`[Check]` Self-check items
- [ ] **Zion canon** — core flow (`/oauth/` path, `state`, no `client_secret`, 4-field userinfo, permissions from `DO_EVERYTHING` only), session model (hashed storage, fail-closed revalidation), permissions = 고유번호 RBAC
- [ ] **G1–G4** secrets — no hardcoding, no secrets in URLs, no `service_role` on the client, past-leak handling, no `JWT_SECRET`
- [ ] **G5–G6** hosting — type judgment, source non-public, private repo, no hardcoded values
- [ ] **G7–G8, G24** DB access control & minimal response — RLS/rules as a set, identity = Zion-session 고유번호, no `select *`, server-side filtering/pagination, per-role DTOs, sensitive columns excluded
- [ ] **G9–G12** server-side authorization, mass assignment, fail-closed — permissions keyed on 고유번호, no new local password auth
- [ ] **G13–G16** input validation, XSS, SSRF, CSV/files
- [ ] **G17–G19** personal data — 4-field ceiling, bulk-processing confirmation, response/log masking
- [ ] **G20–G23** dependencies, rate limiting, neutral naming (no `'ZAuth'` exposure), verification hygiene
- [ ] **G25–G34** (`references/infra-compliance-supplement.md`) infra hardening (debug off, dir-listing off, HTTPS redirect, file upload/download, ports) + PIPA (audit login/PII-access, retention, at-rest encryption, collection consent, idle timeout/weak-hash)

`[AI directive]` On completion, append exactly one line together with the code:
> **✅ 보안 자가 점검 완료 (시온 캐논 + 개발전-공통 G1~G24)**

If anything was remediated, append `— 일부 항목 보완함`. When ambiguous, follow R0-3 and remediate toward the safer side.

---

## [Next step]
Move on to `02_spec_and_alpha_key.md`. There, write up the spec (design plan) and request the **alpha key** from HQ (총회).

---

# 부록 B. S1~S19 보충 점검 원문

# Infrastructure Hardening & Privacy-Law Compliance Supplement (G25–G34)

> **Priority declaration.** This file is **additive**. The Zion canon (`01_zion_login_canon.md` hard rules 1–8) and the built-in review gate (A–E, `references/privacy-security-review.md`) take absolute precedence and are **not modified** by this file. G25–G34 below apply **on top of** them, exactly like G1–G24 in `01b_common_security_conflicts.md`. On any conflict, the Zion Login rule still wins.
>
> **Why this file exists.** The Zion canon + G1–G24 cover authentication, authorization, data minimization, and source non-exposure densely. They are comparatively thin on two axes that the in-house audit checklist (사내 보안성 검토 체크리스트, 64 items) inspects: **(1) infrastructure/runtime hardening** (the settings a non-expert vibe coder most often gets wrong — DEBUG, directory listing, file uploads) and **(2) the procedural obligations of 개인정보보호법 (PIPA)** (collection notice/consent, access logging, encryption at rest, retention/destruction). This file closes those gaps so that a system built with this guide **passes the 64-item audit** instead of being flagged.

## When to read this file

Together with `01b_common_security_conflicts.md` in the pre-development stage (the G rules), and again at `04_predeploy_verification.md` (the verification gate references the S-checklist below). Apply G25–G34 every time code, configuration, or deployment is produced.

`[AI directive]` **Auto-loaded, never user-uploaded.** On file-access lanes (Claude Code/Codex) read this file yourself the moment the pre-development stage begins — `00_START_HERE.md` §3 lists it under "Before development", and `01b` §B-9 registers it. The vibe coder loads only `00_START_HERE.md`; they never need to know this file exists. **Language policy (identical to every guide file):** this file is English (AI-facing), but **every finding, explanation, fix note, and report line the vibe coder receives is Korean** — S1–S19 findings fold into the Korean user-facing sections of the `04` §5 report (「쉽게 풀어 쓴 점검 결과」, 「배포 전 직접 해볼 체크」). Korean domain/legal terms (고유번호, 민감정보, 개인정보보호법) stay Korean.

## What this file contains

- **G25–G29** — infrastructure & runtime hardening (production config, transport, file I/O, network, admin surface).
- **G30–G34** — 개인정보보호법 (PIPA) compliance (access/audit logging, retention & destruction, encryption at rest, collection notice/consent, session & account hygiene).
- **§C — sensitive-data classification note** that raises the bar on G30–G31 for member-data handling and applies G32 only when sensitive data is persistently stored.
- **§D — the "already handled / N/A" mapping table** so an auditor using the 64-item checklist does not false-flag items the Zion design deliberately removes (no local password, etc.).
- **§E — supplementary verification items S1–S19** grafted into `04_predeploy_verification.md`, each mapped to the 64-item checklist ID + severity + who judges it (scanner vs AI).

---

## A. Infrastructure & runtime hardening (G25–G29)

`[AI directive]` These are settings, not features. Decide them with safe defaults (R0-1) and record the choice in one comment line above the config. Most are machine-checkable — the stage-4 scanner flags the common ones; the AI finalizes the rest from the code/config.

### G25 — Production runtime hardening (checklist 12-4·12-5·12-7)

| Rule | Zion / guide context |
|---|---|
| **Framework debug OFF in production.** Never ship `DEBUG=True` (Django), `debug=True`/`app.run(debug=True)` (Flask), `FLASK_ENV=development`, `NODE_ENV!=production`, `app.debug=true`, or a dev error middleware in the deployed artifact. Debug mode turns any exception into an interactive stack-trace + source + (Werkzeug) a remote console. | The *symptom* (no stack trace in responses) is already required by **A4 / VC12**; G25 pins the *root cause* (the debug toggle), which is the single most common vibe-coder leak. |
| **Custom error pages.** 4xx/5xx return a plain notice only — no stack trace, framework version, SQL, or internal path (reinforces A4/VC12/G19). | — |
| **Directory listing OFF.** No auto-index of any served directory: nginx `autoindex off` (default), Apache `Options -Indexes`, and no framework/static-server dir-listing. A browsable directory leaks structure, backups, and temp files. | Complements VC3's `/.git/config` probe — that catches the repo, this catches the filesystem. |
| **Server banner / version headers minimized.** Suppress `Server:`/`X-Powered-By` version strings where the platform allows. | advisory (12-5 adjacent). |
| **No stray backup/temp/test files in the deployed tree** (`*.bak`, `*~`, `.orig`, `db.sqlite`, `dump.sql`, editor swap files) (checklist 12-9). | Ties into C6 (files outlive the permission that created them). Here, `backup` means a stray backup copy left in the deployed tree; it does not require encrypted backup storage. |

### G26 — Transport hardening (checklist 3-2)

| Rule | Zion / guide context |
|---|---|
| **Force HTTP → HTTPS.** A plain-HTTP request is 301-redirected to HTTPS (server/reverse-proxy or platform setting); the app is never reachable in cleartext. | Extends **D8** ("HTTPS end to end"), which asserts the endpoint state but not the redirect. |
| **HSTS.** Send `Strict-Transport-Security` (e.g. `max-age=31536000; includeSubDomains`) so the browser refuses future cleartext. | advisory. |

### G27 — File upload / download hardening (checklist 11-6·11-7·11-8·11-9·11-10)

`[AI directive]` Apply the full set **only when the system has an upload or a file-download feature** (else N/A — state it). Extends **VC10/G16**, which covered format/size/row-count and CSV formula injection but not storage location or path traversal.

| Rule | Why |
|---|---|
| **Extension whitelist** (allow-list, not deny-list) server-side (11-6). | Deny-lists are always incomplete. |
| **MIME-type check** against the declared/allowed set (11-7). | The client-sent `Content-Type` is a hint, not proof. |
| **Magic-byte / file-signature check** — verify the real type from the leading bytes, not the extension or MIME (11-8). | A `.jpg` can be a polyglot script. |
| **Store outside the web root / on a non-executable path** — uploaded files are never served from a location the web server will execute; store with a **randomized server-generated filename** (never the user's name verbatim) (11-9). | Prevents webshell upload → RCE. |
| **Download by identifier, resolved server-side** — never accept a filesystem path/filename as a parameter; map an opaque ID → path in server code and reject any `..`, absolute paths, or null bytes; enforce the caller's permission + scope on the resolved object (11-10, 11-11). | Path traversal + IDOR on files. Ties into **D5** (object-level check on the *fetched* object). |

### G28 — Network & infrastructure isolation (checklist 14-1·14-2·14-4·3-3)

| Rule | Zion / guide context |
|---|---|
| **DB port not internet-exposed** (14-1). Self-hosted DB binds to localhost/private network; a managed DB (Supabase/Firebase) is reached **through the backend** (never browser-direct) and RLS/rules stay default-deny (G3/G7, conflict-resolution #2). | For managed backends the real control is the backend session gate + query filter; for self-hosted, it is the firewall/bind address. |
| **Only required ports open** (3-3); on containers, expose only the app port (extends 06 §2's "required ports only"). | advisory/P3. General app/BFF ports belong here, not in the blocking DB-port rule S11. |
| **Tier separation where the hosting allows** (14-2·2-3): web/app/DB on separate containers or hosts. Not mandatory for small self-service tools, but stated as the target. | advisory/P3 — do not force onto a one-box hobby deploy. |
| **WAF recommended** where the platform offers one (Cloudflare, cloud WAF) (14-4). | advisory/P3 — a recommendation, not a blocker. |
| **Non-root container** (14-3) — already required by `06_deploy_and_operations.md` §2. | (cross-reference only.) |

### G29 — Administrative surface (checklist 2-1·2-2·13-1) — **design-choice clarification**

`[⚠ Design note — read before auditing 2-2 / 13-1]` The 64-item checklist expects the admin page to be **network-isolated** (internal-only, IP-restricted). **This edition deliberately protects the admin surface by server-side permission gating instead** (SUPER_ADMIN / PERMISSION_ADMIN, 고유번호 RBAC, fail-closed — hard rules 4·5, E3), because tribe sites are internet-facing self-service tools with no internal-network to sit behind. This is a **conscious substitution, not an omission** — record it in the review so an auditor does not mark 2-2/13-1 as a violation.

| Rule | Note |
|---|---|
| **Primary control: server-side permission gate** on every admin route (already E3/D4/VC5). The admin page is logically separated by permission, and its data is delivered only after the server-side check (E4). | This is what makes 2-1 pass. |
| **Defense-in-depth (recommended, not required):** where the deployment supports it, add an **IP allowlist** on the admin path and/or a **non-guessable admin URL** (13-1). | advisory. When network isolation is genuinely available (internal server hosting, 06 type 1), prefer it. |
| **Audit note for 2-2/13-1:** if there is no network isolation, the reviewer writes "N/A — replaced by server-side RBAC gate (G29), see A/B/C/D/E findings" rather than a blocking finding. | Prevents a false blocking verdict. |

---

## B. 개인정보보호법 (PIPA) compliance (G30–G34)

`[AI directive]` These map the in-house checklist's legal-basis items (개인정보보호법 근거) onto the Zion flow. Member data collected **from Zion** has its collection consent handled **upstream by Zion Login** — G33 applies to data the app collects **directly** (P-3 forms, any non-member PII). G30–G31 apply to handled personal data as scoped below; G32 applies only after persistent fields are classified and a stored sensitive datum is found.

### G30 — Access & audit logging extension (checklist 9-1·9-2·10-3)

`[⚠ Resolves the A3 tension]` The checklist wants **login success/failure** and **individual PII access** logged (account, time, IP). Rule **A3** forbids `name`+`newNo` pairs and `access_token` in **application logs**. These do **not** conflict: the required records go to the **audit table** (the sanctioned who-did-what store, B4/B5/C2/D7), **not** general app logs. G30 extends the audit-target list; A3 is untouched.

| Audit target to ADD | Fields | Checklist |
|---|---|---|
| **Login success** | actor 고유번호, timestamp, source IP, result=success | 9-1 |
| **Login failure** | attempted-account reference (masked/opaque), timestamp, source IP, failure count, result=fail | 9-2 |
| **Individual member-data view / edit / delete** by an operator (not only bulk reads) | actor 고유번호, target 고유번호, action, timestamp | 10-3 |
| (already in the canon: bulk reads B4, permission grant/revoke B5, exports C2, SUPER_ADMIN actions D7) | — | — |

- The `access_token` is still **never** logged (raw or in audit). Reference members by 고유번호 in the audit table only, never together with behavioral data in app logs (A3 preserved).
- Login happens at the Zion IdP, but **session creation at `/auth/callback` is the app's event** — log *that* (a session was created for 고유번호 X from IP Y at time T). Failed *callbacks* (bad `state`, token-exchange failure) are the app-observable "login failure".

### G31 — Retention & destruction policy (checklist 9-3·9-4·14-5)

`[AI directive]` **B2** requires a documented retention rule per stored artifact and a purge that actually runs, but the supplied canonical review does **not** pin a universal number of days. Do not invent a fixed 5-year or 6-month minimum from checklist identifiers alone. A separate law, contract or approved organization policy may define a duration; when it does, identify that source explicitly instead of presenting it as B2/S15.

| Artifact | Required control | Checklist |
|---|---|---|
| **Permission grant/revoke & operator-privilege-change audit** | Document purpose, fields, access scope, retention period and owner; run the documented purge | 9-3 |
| **Access/authentication & web access logs** | Keep member data and secrets out of URL/path/query/referrer and general logs; minimize recorded fields; document the operational retention period; run rotation and purge | 9-4, 14-5 |
| User rows, sessions, other audit rows | Apply the documented artifact-specific rule; purge sessions on expiry (B3); no "kept forever by accident" | B2 |

- Destruction is **actual** (a scheduled job, startup task or log rotation that runs), not a comment.
- Compression is an operational storage choice, not proof of compliance by itself.
- A shorter documented access-log period can be valid when it supports the stated operational purpose and automatic destruction works. Retaining privacy-bearing logs longer without a purpose increases exposure.

### G32 — Encryption at rest for sensitive data (checklist 4-4)

| Rule | Zion / guide context |
|---|---|
| **First classify persistent storage.** Inspect schemas and code for DB fields, files, logs, long-lived caches/sessions, retry queues, search indexes, exports and application-created backups. Do not inspect real personal values. | S16 is decided from the data model and storage behavior, not from the mere use of PostgreSQL or a member-data screen. |
| **Any sensitive datum linked to an identifiable person and persistently stored is encrypted with AES-128 or stronger.** New implementations should use AES-256-GCM with a fresh nonce/IV and verified authentication tag. | Sensitive includes PIPA 제23조 categories such as religion/belief, health and ideology, national-ID-grade identifiers, high-risk financial data, and a person's church/tribe/duty/member number when it directly reveals religious affiliation. |
| **If no sensitive datum is stored, record N/A with evidence.** Name the inspected schemas/storage paths and explain why their fields are not sensitive. | A public organization-name list, anonymous aggregate or transient request value that is not persisted does not trigger S16. `N/A` is a completed classification, not an assumption. |
| Encryption keys are **not** in the repo (G1), DB or alongside the ciphertext. Exact-match lookup uses a separately keyed HMAC-SHA-256 value when required. | Base64, masking, ordinary hashing and deterministic encryption do not satisfy protected storage. |
| Volume, disk and backup encryption are optional defense in depth. | They neither prove application-field encryption nor become a mandatory S16 prerequisite for every project. |

### G33 — Collection notice & consent (checklist 1-1·1-2·1-3)

`[AI directive]` Applies to PII the **app collects directly** (P-3 forms, contact/application/newsletter, any input field storing personal data). Member data fetched from Zion is **consented upstream** — note that and move on.

| Rule | Checklist |
|---|---|
| **Collection notice** shown at the point of collection: **items collected · purpose · retention period · a contact for deletion/inquiry** (수집·이용 고지). Already required for P-3 forms by §A2 P-3; G33 generalizes it to any direct collection. | 1-1 |
| **Explicit consent** captured before/at collection (an affirmative action — checked box, submit-with-notice), not pre-ticked. | 1-2 |
| **Required vs optional fields distinguished**; optional fields are not a precondition of the service, and refusing them does not block the core function. | 1-3 |

### G34 — Session & account hygiene (checklist 6-2·6-3·5-2·4-2)

| Rule | Zion / guide context | Checklist |
|---|---|---|
| **Idle timeout.** In addition to token-`exp` expiry and the 300s revalidation, delete the local session row after **≤ 60 min of inactivity** (last-activity timestamp on the session row → expire → 401 → re-login). | **Extends** the session model (canon §3) — it is just an *earlier* session-row deletion (same mechanism as logout), so **no `JWT_SECRET`, no self-issued token** (hard rule 2 untouched). | 6-3 |
| **No weak hashes for any security purpose.** Never `md5`/`sha1` for passwords, tokens, signatures, or integrity where an attacker benefits from a collision/preimage. | The session-store key `SHA-256(access_token)` is fine (it is not password hashing). Separate non-Zion secrets use bcrypt/PBKDF2 (G12). This rule simply forbids MD5/SHA-1 explicitly. | 4-2 |
| **Dormant local-permission review.** The app cannot lock a Zion **account** (central IdP — delegated). What the app CAN do: flag/expire **local permission grants** for a 고유번호 with no login in **≥ 90 days**, so a stale operator does not keep standing access. | Account lockout itself is a Zion IdP responsibility → documented delegation, not app-enforced. | 6-2 |
| **Step-up auth for the master surface (recommended).** 2FA/MFA for SUPER_ADMIN / sensitive actions is **delegated to the Zion IdP** (the app does not run its own second factor). Recommend that the operator's Zion 계정 has MFA enabled; app-level step-up is out of scope unless HQ provides a mechanism. | Zion Login is single-factor OAuth from the app's view → delegation note. | 5-2 |

---

## C. Sensitive-data classification (raises G30–G32)

`[AI directive]` A tribe member's **religious affiliation linked to that identifiable person is special-category personal data (민감정보, 개인정보보호법 제23조)** — the canon already flags this (review B4: "Religious-affiliation data is special-category"). Therefore:

- **Access accountability is mandatory, not optional** → G30 (login + individual-access audit) is **blocking**, not advisory, for member-data admin surfaces.
- **Retention discipline applies** → use the documented artifact-specific rule from G31. Do not infer a fixed duration, and preserve S15 advisory severity in the final verdict.
- **G32 is decided by persistence, not screen category** → if the application stores a person's religious-affiliation field or another sensitive field, encryption is **blocking**; if no sensitive field is stored, record the inspected storage paths and use N/A.

State this classification explicitly in the review report so the heightened bar is visible.

---

## D. "Already handled / N/A" mapping — do not false-flag these

`[AI directive]` When auditing with the 64-item checklist, the items below are **not gaps** — the Zion design removes or exceeds them. Record the stated reason so they are not marked as violations.

| Checklist item | Verdict | Reason |
|---|---|---|
| 4-1 강한 해시로 패스워드 저장 | **N/A** | No local password exists (hard rule 2 — session = Zion access_token). |
| 7-1 ~ 7-5 패스워드 정책 | **N/A** | The checklist itself scopes section 7 to "Zauth 미사용 시". Zion Login is used → no local password policy applies. |
| 8-2 로그인 실패 메시지 구분 안 함 | **N/A (delegated)** | The login UI/credential entry is the Zion IdP's, not the app's — failure-message behavior is upstream. |
| 13-3 JWT none/HS256+ | **PASS (stronger)** | Self-issued JWT is forbidden entirely (hard rule 2); the session is the server-validated Zion access_token — stricter than "HS256+". |
| 13-4 쿠키 HttpOnly/Secure/SameSite | **PASS or N/A** | This edition stores the token via `Authorization: Bearer` (A7), not cookies; if any cookie exists, D8 enforces the flags. |
| 5-1 검증된 인증체계 사용 | **PASS** | Zion Login is the verified SSO/IdP. |
| 2-2 / 13-1 관리자망 격리 | **N/A → RBAC substitution** | Replaced by server-side permission gating (G29); note the substitution, do not block. |
| 4-4 민감정보 저장 암호화 | **Classify first** | Inspect persistent fields. N/A only when no identifiable sensitive datum is stored; otherwise AES-128+ field encryption is blocking (G32). |

---

## E. Supplementary verification items (S1–S19) — grafted into `04_predeploy_verification.md`

`[AI directive]` Judge each S-item at the pre-deploy gate, in addition to the 52 core items. Merge duplicates with the cited VC/A–E item (judge once). **Severity** follows the same rules (V0-3/V0-7, safe side). **Judge** = who decides: `scanner` (machine-checkable, finalized by AI), `AI` (code comprehension), `deploy/infra` (a hosting/ops setting the AI configures or instructs).

| S# | Rule | Checklist | Default severity | Judge |
|---|---|---|---|---|
| **S1** | Production debug OFF (no `DEBUG=True`/`debug=True`/dev error middleware in the deployed artifact) | 12-4 | **blocking** | scanner + AI |
| **S2** | Custom error pages; no stack trace/version/SQL/path in 4xx/5xx (reinforces A4/VC12) | 12-5 | blocking | AI |
| **S3** | Directory listing OFF (autoindex off; no browsable dirs) | 12-7 | advisory | scanner + AI |
| **S4** | No stray backup/temp/test files in the deployed tree (`*.bak`/`*.orig`/`*.sqlite`/`dump.*`, …) | 12-9 | advisory | scanner + AI |
| **S5** | HTTP → HTTPS 301 redirect + HSTS | 3-2 | advisory | deploy/infra |
| **S6** | Upload extension whitelist (server-side) | 11-6 | blocking | AI |
| **S7** | Upload MIME check | 11-7 | advisory | AI |
| **S8** | Upload magic-byte/signature check | 11-8 | advisory | AI |
| **S9** | Uploads stored outside web root / non-executable path, randomized filename | 11-9 | **blocking** | AI |
| **S10** | Download by server-resolved ID, no path param, `..` rejected, permission+scope enforced (with D5) | 11-10, 11-11 | **blocking** | AI |
| **S11** | DB port not internet-exposed (self-hosted bind/firewall; docker-compose publishes no DB port to a **non-loopback** address — a `127.0.0.1:`/`localhost:` bind is acceptable, a bare `5432:5432` or `0.0.0.0:` publish is not; managed = backend-only + RLS); container runs non-root (14-3) | 14-1·14-3 | blocking | scanner + AI + deploy/infra |
| **S12** | Only required ports open; tier separation where feasible; WAF recommended | 3-3, 14-2, 14-4 | advisory | deploy/infra |
| **S13** | Admin surface: server-side RBAC gate present (G29); network isolation N/A note recorded; IP allowlist as DiD where available | 2-1, 2-2, 13-1 | advisory | AI |
| **S14** | Audit includes login success/fail + individual PII view/edit/delete (to audit table, not app logs) | 9-1, 9-2, 10-3 | **blocking** (member data = 민감정보) | AI |
| **S15** | Artifact-specific retention is documented; access/web logs exclude member data and secrets, minimize fields, and have working rotation/purge | 9-3, 9-4, 14-5 | advisory | AI |
| **S16** | Classify persistent fields first. Encrypt every stored sensitive datum with AES-128+ (AES-256-GCM recommended); record inspected stores and N/A reason when none is stored. Volume/disk encryption is DiD, not the verdict shortcut. | 4-4 | **blocking** if sensitive stored without compliant field encryption; else N/A | AI |
| **S17** | Direct-collection PII has notice (items/purpose/retention/contact) + explicit consent + required/optional split | 1-1, 1-2, 1-3 | blocking (if direct collection) | AI |
| **S18** | Idle timeout ≤60min; no MD5/SHA-1 for security; dormant-grant review (≥90d); MFA delegated to Zion IdP for master (recommended) | 6-3, 4-2, 6-2, 5-2 | advisory (idle/weak-hash), recommendation (MFA/dormant) | scanner (md5/sha1) + AI |
| **S19** | Config-file secret hygiene: no credentials embedded in a URL (`scheme://user:pass@` — proxy_pass, DB DSNs), no plaintext secret directives in nginx/apache/.ini configs (secrets referenced from env, not inlined). Catches what the `=`/`:` assignment scan (VC1) misses in config files. | 12-1·12-3 (G2) | **blocking** if a real secret | scanner + AI |

`[AI directive]` Scanner-checkable subset (finalized by the scanner, then confirmed by the AI): **S1** (`DEBUG=True`/`debug=True`), **S3** (`autoindex on`), **S4** (stray `*.bak`/`*.orig`/`*.sqlite`/`dump.*` files), **S11** (docker-compose DB-port publish / root container), **S18** weak-hash (`md5`/`sha1`/`hashlib.md5`), **S19** (URL-embedded credentials / config secret directives). **S16 is AI-only** because a scanner cannot reliably infer the meaning and persistence of fields. Additionally **VC8** now catches template auto-escape bypasses (`| safe`, `v-html`, `{@html`) beyond `innerHTML`. All other S-items are AI/infra verdicts — a scanner miss is **not** a pass (same rule as §2b). **The scanner's secret detection is entropy-aware** — a value embedding a placeholder word (`example`, `sample`, …) but carrying a long high-entropy token is treated as a **real** secret, not a placeholder (closes the `API_KEY="example_<realkey>"` evasion).

`[VOSS severity guard]` S4, S12, S15 and S18 remain advisory/recommendation even when they need follow-up. Do not re-label them as S11 or S16 blocking findings. A stronger VOSS-specific requirement must be identified separately as a VOSS policy or VX item.

---

## [Next step]

Back to `04_predeploy_verification.md` — judge S1–S19 alongside the 52 core items and fold the findings into the same report (§5). The production-readiness gate is unchanged: **blocking findings (including blocking S-items) = 0 + VC14/NEEDINPUT clear**.

---

# 부록 C. 별도 봇 구성요소 VB1~VB5 조건부 점검 원문

<!-- Version v2.0 / release 260703 | Bot addon part (references/bot-addon-optional.md) — MUST be injected together with the common rules in 01b_common_security_conflicts.md (common rules first). Contents: B1 payload gate, B2 entry authentication strength (Questions A/B/C), B3 two-tier permissions / one-time bootstrap / lockout, B4 group behavior, B5 deployment mode (polling/webhook decision + asymmetric confirmation procedure). -->
# Vibe-Coding Security Directives — Bot Addon (SYSTEM PROMPT)
**Version v2.0 · 260703 · File: `references/bot-addon-optional.md`**

> ⚠ **Never use this file alone. Always inject it together with `01b_common_security_conflicts.md` (the common rules first).** This file contains only the bot-specific rules (B1–B5). Apply them in addition to the common G1–G24.
> Applies: when building a bot (Telegram etc.).

## Bot addon rules [only when building a bot such as a Telegram bot — in addition to the common G1–G24]
> The [Question A/B/C] blocks, the [deployment-mode decision], and the [webhook confirmation procedure] in this section are **behavioral logic that must be output and executed exactly as written**. Never summarize, paraphrase, or alter their wording or branching. In particular, the fenced Korean question/consent blocks below are printed to the user **verbatim, byte for byte**.

- B1. [Always] **Access-token gate (deep-link authentication).** Assume the bot is discoverable via search and any user can message it. Only users who enter through a `/start <payload>` deep link carrying an unguessable secret payload (managed in `.env`) are registered into an authenticated session.
    - The payload must respect Telegram's start-parameter constraints (characters A-Z a-z 0-9 _ -, 1–64 chars). Generate it from base64url-safe characters and truncate to 64 (e.g. `secrets.token_urlsafe(32)[:64]`, Node.js `crypto.randomBytes(32).toString('base64url').slice(0,64)`).
    - Users with a missing or wrong payload get no reaction, commands, or feature exposure whatsoever. Compare with `hmac.compare_digest` (timing-attack prevention).
    - Persist the authentication state to a file/DB so it survives restarts. Default to a store that guarantees atomic writes (SQLite etc.); if using a plain file such as JSON, pick either a single-process assumption or write serialization, and record the choice in a one-line comment.

- B2. [Always · R0-2 exception] **Entry authentication strength.** This is a security choice, but it is decided by asking the user in plain language. Right after receiving the bot's feature description, output Questions A and B below in order — and Question C as well if per-person issuance is chosen. Never expose jargon (token, user_id, whitelist) on the question surface.
    - Defaults (when the user hesitates or does not answer): A=1 (shared link), B=1 (admin approval) — i.e. "shared link + approval" is the recommended default. Add a one-line note in Korean that this can be made stricter later ("나중에 더 엄격하게 바꿀 수 있다").
    - **[Question A — entry-link scheme]** Output exactly the following:
        ```
        봇에 들어오는 입장 링크를 어떻게 관리할지 골라주세요. 잘 모르겠으면 1번을 고르세요.
        1. 링크 하나를 만들어 모두에게 공유
           가장 간단해요. 단톡방에 링크 하나 올리면 다들 그걸로 들어와요. (소규모 모임, 내부용 봇에 적합)
        2. 사람마다 링크를 따로 발급
           멤버가 들어올 때마다 관리자가 봇 명령으로 새 링크를 1개씩 뽑아 그 사람에게만 보내요.
           한 사람 링크가 새도 그 사람만 막으면 돼요. 조금 더 번거롭지만 더 안전해요. (민감한 봇에 적합)
        ```
    - **[Question B — how strangers are blocked]** After receiving the answer to A, output exactly the following:
        ```
        봇에 모르는 사람이 들어오는 걸 어떻게 막을지 골라주세요. 잘 모르겠으면 1번(권장)을 고르세요.
        1. 관리자 승인을 받게 한다 (권장)
           새 사람이 들어오면 관리자에게 "OOO님을 승인할까요?" 알림이 가고, 버튼만 누르면 됩니다.
           링크가 새서 모르는 사람이 들어와도 승인 안 하면 아무것도 못 해요.
        2. 승인 없이 링크만 맞으면 통과시킨다
           링크를 가진 사람은 누구나 바로 사용할 수 있어요. 편하지만 링크가 새면 모르는 사람도 들어올 수 있어요.
           ⚠ 이 경우에도 '관리자 전용 기능'은 관리자만 쓸 수 있게 따로 보호돼요.
        ```
    - **[Question C — link validity. Output only if 2 (per-person issuance) was chosen in A]** Output exactly the following:
        ```
        발급하는 링크를 언제까지 쓸 수 있게 할지 기본값을 골라주세요. (발급할 때마다 바꿀 수도 있어요.)
        1. 1회용 (한 번 들어오면 그 링크는 바로 만료) — 가장 안전
        2. 기간제 (예: 7일간 유효, 기간이 지나면 그 링크만 자동 만료)
        ```
    - **Implementation mapping:** A=1 → manage one payload in `.env`, announce a single entry link. A=2 → implement an admin-only issuing command (e.g. `/invite`, with `once`/`7d` to change validity per issue): each call generates and stores a new payload and returns exactly one link. **Validity is a property of each issued link, not a "bot-wide deadline"** — the bot keeps running after expiry; new people simply get a re-issued link. B=1 → the B3 approval flow. B=2 → register as a member immediately when the link passes, but protect admin features via B3, and give a one-line Korean notice that "링크가 새면 누구나 들어올 수 있다" (if the link leaks, anyone can get in).
    - Issued-link commons: (a) one-time links are consumed (invalidated) immediately on successful authentication; (b) time-boxed links auto-expire when the period lapses; (c) never record plaintext tokens in issuance/usage history (identifier + issued/expiry timestamps only).

- B3. [Always] **Two-tier permission split (member/admin).** "Members (people who can use the bot)" and "admins (people who can use management commands)" are distinct.
    - **Member whitelist (approval-based — no pre-registration):** do not list user_ids up front (the vibe coder does not know the members' user_ids). When a new user enters via a correct link, the bot sends the admin approve/reject buttons; on approval, that user_id is registered automatically. Nothing works before approval. (If B2 chose the no-approval option, skip this step and register as a member as soon as the link passes.)
    - **First admin (one-time bootstrap — must never re-trigger on restart):** exactly once in the bot's lifetime. Default: "the first person to enter via a correct link after the bot is first started becomes the first admin". On registration, immediately set a permanent flag (`admin_initialized = true`); once this flag exists, **skip the "first entrant becomes admin" logic entirely.** Tell the user once, in Korean: "봇을 켜자마자 본인이 가장 먼저 입장하라" (start the bot and be the first to enter). Afterwards, admins are added **only by existing admins** via `/grant_admin`-style commands.
    - **Lockout prevention:** (a) the last remaining admin cannot remove their own admin rights (a zero-admin state is structurally impossible). (b) Emergency recovery: allow an emergency-admin user_id in `.env`; a user_id listed there is always recognized as an admin regardless of flag/roster corruption. Provide the helper step in Korean: "봇에 아무 메시지나 보내면 봇이 당신의 user_id를 알려준다 → 그 숫자를 .env에 넣어라". (c) When announcing first-admin registration, **strongly recommend** setting the `.env` emergency admin (if the storage file is wiped, the bootstrap reopens and could be hijacked).
    - **Admin-only command classification (ask the user):** split each command/feature into "admin-only / member-allowed". Only a user who knows the bot's purpose can judge this, so ask instead of deciding arbitrarily (full-roster views, announcements, data export, and settings changes are recommended admin-only defaults). Ask in Korean, e.g.: "관리자만 쓸 기능과 멤버 누구나 쓸 기능을 나눠 주세요. 예) 전체 명단 조회 → 관리자만 / 내 정보 확인 → 누구나".
    - Member/admin roster files go into `.gitignore` (ties into G1).

- B4. [Always] If added to an unauthenticated group, auto-leave or stay silent; recommend enabling Telegram privacy mode by default. When operating in groups (announcement/guide bots etc.): never process sensitive commands (management, personal data, full data) in groups — steer users with "자세한 기능은 1:1(DM)로", and allow in groups only what is safe to expose (like `/help`). Authentication and management flows (B1, B3) assume DM. For group authentication, check the allowed group chat_id and perform only minimal actions in any other group.

- B5. [Always · choice-dependent] **Deployment mode (long polling / webhook).**
    - Default: assume long polling provisionally until the infrastructure is settled. Do not pre-write deployment-dependent code (webhook handlers etc.).
    - **long polling:** no address open to the internet — safest (no domain/certificate/endpoint security needed). Proceed without further confirmation.
    - **webhook:** `setWebhook` secret_token (`.env`; characters A-Z a-z 0-9 _ -, 1–256 chars; random, `secrets.token_urlsafe(32)`-class) + verify the incoming request's `X-Telegram-Bot-Api-Secret-Token` header with `hmac.compare_digest` + an unguessable random string in the URL path + allow the Telegram source IP ranges (149.154.160.0/20, 91.108.4.0/22) (if the environment cannot do IP filtering, state explicitly that secret_token verification is the sole origin authentication and the first line of defense) + recommend automatic HTTPS certificate renewal (if the platform manages it automatically, just confirm).
    - **[Decision — 3-stage priority. Once an earlier stage decides, later stages are NOT run]:**
        - **Stage 1 — auto-decision (no question):** only when both (a) a specific infrastructure is mentioned AND (b) its actual use for this bot is clearly intended. If intent is unclear ("AWS 계정은 있는데 안 써봤다", hypotheticals, undecided) or the clues conflict → stage 2. IF intent is clear + (serverless/edge OR always-on server/VPS OR owns a domain+https OR has web-operations experience) → webhook → [confirmation procedure]. IF intent is clear + (personal laptop / home PC OR no server) → long polling (one-line rationale). If not confident → stage 2.
        - **Stage 2 — a single plain-language question (no jargon):** output exactly the following:
            ```
            봇을 어디서 켜둘 계획인지 알려주세요. 가장 가까운 걸 골라주세요.
            1. 내 노트북이나 집 컴퓨터에서 직접 켜둔다
            2. 항상 켜져 있는 서버나 클라우드를 쓴다 (예: AWS, 오라클 클라우드, Vercel, 회사·학교 서버 등)
            3. 잘 모르겠다 / 아직 안 정했다
            ```
            1 → long polling. 2 → the AI judges webhook fitness from the environment the user names → webhook → [confirmation procedure] (if the user does not name one, do not push the classification onto the user — say in Korean "어떤 서비스 쓸지 이름만 알려주면 내가 맞는 방식으로 정하겠다" and let the AI decide). 3 → stage 3.
        - **Stage 3 — classify on their behalf instead of re-asking:** never offload environment classification onto the user. Draw the facts out with one or two plain Korean questions ("컴퓨터를 꺼도 봇이 계속 돌아야 하나요?", "가입해둔 클라우드가 있나요?"), then the AI classifies directly. If it still cannot be decided, proceed with long polling and add a one-line Korean note: "나중에 서버를 갖추면 webhook으로 전환 가능".
    - **[Webhook confirmation procedure — asymmetric safeguard]:** webhook only. Long polling proceeds without confirmation.
        - CASE 1) The user explicitly requested it ("webhook으로 해줘"): proceed without further confirmation, but give a one-line notice of the management responsibility that comes with it.
        - CASE 2) The AI decided via auto-detection/inference: (an exception to R0-1 — must ask per R0-2.) So that a notification never masquerades as consent, output exactly the following and proceed only after explicit consent:
            ```
            이 환경이면 webhook 방식이 적합합니다. 다만 이 방식은 long polling과 달리 봇이 인터넷에 열린 주소를 갖게 되어, 비밀 키(secret token) 관리와 주소 보안에 신경 써야 합니다. 보안 설정은 제가 코드에 모두 넣어드리지만, 운영 중 관리 책임이 따릅니다. 이 방식으로 진행할까요? (더 간단하고 안전한 long polling으로 가도 됩니다.)
            ```
        - If the user hesitates or seems burdened, recommend long polling and proceed that way.
    - **[Switch handling]:** if the infrastructure changes mid-way (laptop → Vercel etc.), re-run this decision. When switching long polling → webhook, always re-check that the newly created secrets (secret_token etc.) are reflected in `.env`, `.env.example`, and `.gitignore` (prevents the un-updated-`.env.example` leak on switch).
    - **[Scope limit]:** this procedure covers only the mode decision and the matching code/security configuration. Actual server deployment, daemonization, and platform deploy execution are out of scope (only on user request).


## Self-check before emitting bot code [AI-only — expose only the one completion line]
- Immediately before presenting code, verify that B1–B5 are reflected, together with the common G rules.
    - [ ] B1 payload gate (unguessable, hmac, silence toward the unauthenticated) / B2 entry authentication strength (Questions A/B/C)
    - [ ] B3 two-tier permissions (approval-based registration, one-time bootstrap, lockout, emergency admin, command classification)
    - [ ] B4 group behavior (leave unauthenticated groups, privacy mode, sensitive commands in DM) / B5 deployment mode (polling default, the 4 webhook items, confirmation procedure)
- On completion, one line: "✅ 봇 보안 자가 점검 완료 (개발전-봇애드온 v2.0)". (Shown together with the common completion line.)

---

# 부록 D. 위아원 콘텐츠 자동 로그인 조건부 점검 기준

# 위아원 콘텐츠 자동 로그인 조건부 점검 기준

이 절은 점검 대상 프로젝트가 `X-Wao-Authorization` WebView 헤더 방식의 위아원 콘텐츠 자동 로그인을 구현한 경우에만 적용한다. 해당 기능이 없으면 이 절을 별도 항목으로 제출하지 않는다.

점검 AI는 아래 결과를 기존 `VC1`, `VC5`, `VC6`, `VC12`, `VC13`, `A2~A4`, `B1`, `B3`, `D1~D3`, `D8`, `E1~E4` 중 실제로 대응하는 항목의 근거와 판정에 포함한다.

필수 확인 내용:

1. 헤더 이름은 공개 환경변수 `WAO_WEBVIEW_TOKEN_HEADER=X-Wao-Authorization`에서 읽고 다른 이름이나 토큰 원문을 코드에 고정하지 않는다.
2. `X-Wao-Authorization` 값이 URL query, fragment, 폼, 브라우저 저장소 또는 일반 쿠키로 이동하지 않는다.
3. 헤더 존재만으로 인증하지 않고, VOSS가 제공하는 `ZION_VALIDATE_URL`의 명시적인 `valid: true`와 같은 토큰을 사용한 `ZION_ME_URL` 조회를 모두 통과시킨다.
4. validate와 `/me` 성공 전에는 사용자, 계정, 권한 또는 세션 상태를 변경하지 않는다.
5. WebView access token을 프로젝트 세션으로 재사용하지 않고 새로운 불투명 세션을 발급하며, 서버 저장소에는 세션 원문이 아니라 일방향 해시만 저장한다.
6. `/me`는 승인된 최소 속성만 요청하고 기존 시온 로그인과 같은 불가역 사용자 식별 규칙을 사용한다.
7. 토큰 원문·일부 문자열·길이·prefix·해시, Authorization 헤더, 사용자정보 원문과 외부 응답 본문을 로그에 남기지 않는다.
8. validate와 `/me` 호출에 서버 측 요청 제한과 timeout을 적용하고 장애 시 fail closed로 처리한다.
9. 헤더 없는 일반 브라우저 요청은 기존 로그인 흐름을 유지하며, 인증 실패 화면은 원본 외부 오류를 노출하지 않는다.
구현 기준의 상세 내용은 VOSS `연동 API 문서 > 위아원 콘텐츠 연동`에서 확인한다.

---

# 결과 확정 및 VOSS 제출 절차

# VOSS AI 통합 보안 점검 실행 및 제출 템플릿

> 이 문서는 `VOSS AI 통합 보안 점검 요청 템플릿`으로 점검을 끝낸 AI가 결과 파일을 확정하고 VOSS에 제출할 때 사용합니다.
> VOSS 적용본 버전: 2026-08-22

## 1. 실행 전제

다음 조건을 모두 만족하기 전에는 VOSS 제출 토큰을 요청하지 마세요.

- 대상 커밋이 원격 저장소에 push되어 있습니다.
- 워킹트리가 깨끗합니다.
- 자동 스캐너 최종 결과가 `FAIL=0`, `NEEDINPUT=0`입니다.
- 모든 필수 항목을 판정했습니다.
- `blocking fail`과 `needs_follow_up`이 없습니다.
- 보안점검 결과 보고서 원본 파일을 생성했습니다.
- 시온 로그인 프로젝트라면 프로덕션 키 신청서 원본 파일도 생성했습니다.

AI가 최종 운영 가능 여부를 판정합니다. 사용자의 별도 보안 판정을 요구하지 마세요. 아래 05 원문의 사람 판정 조항과 충돌하면 이 VOSS 적용 원칙을 우선합니다. 다만 실제 프로덕션 키 신청서를 총회에 보내는 행위는 사용자가 수행합니다.

## 2. 원본 파일 확정

정확한 파일명은 VOSS의 '제출 정보 복사' 결과를 따릅니다. 기본 규칙은 다음과 같습니다.

- 항상: `{프로젝트ID}_보안점검결과보고.md`
- 항상: `security_scan_report.md`
- 항상: `security_scan_report.json`
- 시온 로그인 적용 프로젝트만: `{프로젝트ID}_프로덕션키신청서.md`

파일을 생성한 후에는 내용을 다시 가공하거나 줄바꿈을 변경하지 마세요. 디스크에 저장된 원본 바이트로 SHA-256과 Base64를 계산합니다.

---

## 3. 시온 로그인 프로젝트의 프로덕션 키 신청서 기준

아래 05 기준은 VOSS 제출 정보에서 '시온 로그인 적용: 예'인 경우에만 적용합니다. '아니오'이면 이 절 전체를 건너뜁니다.

# 05 · Production Key Request

## When to read this file
Read this immediately after the security inspection report of `04_predeploy_verification.md` comes out with **blocking findings = 0 + the "프로덕션 운영 가능" (production-ready) verdict**. If you are still in the alpha (development) stage, or the report does not exist yet, do not open this file.

## What this file contains
- The **prerequisite gates** for entering this stage (failing them sends you back to `04_predeploy_verification.md`).
- The **paste-ready 5-item application template** for requesting the production `client_id` (operations key) from 총회 (HQ).
- The request is **not sent automatically** (the vibe coder sends it personally) — what, to whom, how.
- The rule: **if item ⑤ "프로덕션 운영 가능 여부" is not '가능', sending is forbidden**.
- The 04 report (including the automated scan results and the **code fingerprint + file-manifest fingerprint**) goes along as the **attachment for 총회 inspection** — the developer runs the scanner personally and submits **only the result** (no repo upload); 총회 inspects via the fingerprints.
- Reconfirmation that the key is **system-unique** (no reuse — review gate D11).

---

## 0. Prerequisite Gates — stop here if not passed

`[AI directive]`
This stage takes the **security inspection report** produced by `04_predeploy_verification.md` as its only input. Unless **both** conditions below are met, do not draft or send the application; instead direct the vibe coder back to `04_predeploy_verification.md` to fix the findings and re-verify.

| Gate | Pass condition | On failure |
|---|---|---|
| G-05-1 | The report shows **blocking (critical) findings = 0** (VC1·VC4·VC5·VC6·VC7·VC8 and every critical review-gate A–E item all resolved) | Return to `04_predeploy_verification.md`. Fix the findings, re-verify, then come back to this file |
| G-05-2 | The report ends with the **"프로덕션 운영 가능 여부 = 가능"** verdict | If the verdict is '불가', sending is forbidden. Fix the underlying items in `04_predeploy_verification.md` and re-judge |

`[⚠ Conflict resolution]`
The judging authority at production-key issuance time is **the human touchpoints fixed by the Zion Login flow** (alpha key, 총회 approval, production verdict) — conflict-resolution table #9. The legacy guide's R0-1/R0-2 principle ("never ask the human about security; use safe defaults") absorbs this production verdict as **the exception where a human must explicitly declare '가능'**. The AI never declares '가능' on the human's behalf.

---

## 1. This request is not automatic

`[바이브코더 안내]`
프로덕션 키(운영용 `client_id`)는 **당신이 직접 총회에 신청**해서 받습니다. 이 스킬이나 AI가 총회로 대신 보내주지 않습니다(알파키 때와 같습니다 — `02_spec_and_alpha_key.md` (기획안·알파키 신청 파일) 참고). AI는 아래 신청서 **초안만 만들어 드리고**, 실제 발송 버튼을 누르는 것은 사람입니다.

`[AI directive]`
The skill/AI **never auto-sends** the application to 총회. Fill in the template below as a **complete, ready-to-send draft** the vibe coder can copy verbatim, and accompany it with the instruction to "send it yourself". Whether and when to send remains the vibe coder's act.

---

## 2. To whom · what · how

`[바이브코더 안내]`

| 항목 | 내용 |
|---|---|
| **누구에게** | 총회 정보통신부 전산개발과 (알파키를 받았던 곳과 동일 창구) |
| **무엇을** | 프로덕션(운영)용 `client_id` 발급 요청 + 아래 5개 항목 신청서 |
| **어떻게** | 아래 템플릿을 복사 → `{ }` 안을 당신 서비스 내용으로 채움 → 총회 창구로 직접 발송 (접수 경로를 모르면 `02_spec_and_alpha_key.md`의 알파키 신청 창구 안내 참고) |
| **언제** | `04_predeploy_verification.md` (배포 전 검증 파일) 보고서가 blocking 0 + "운영 가능"으로 나온 **뒤에만** |

> 참고: 프로덕션 키 신청에 **redirect_uri 사전 등록은 필요 없습니다**(알파 때와 동일하게 키만 필요). 콜백 주소는 당신 `.env`의 `REDIRECT_URI`로 관리합니다.

---

## 3. The 5-Item Application Template (paste-ready)

`[바이브코더 안내]`
아래 블록 전체를 복사해서 `{ }` 부분만 당신 서비스에 맞게 채우세요. **다섯 항목 모두 필수**입니다 — 하나라도 비우면 안 됩니다. 언어는 **한국어**로 보냅니다(받는 부서의 업무 언어).

```markdown
# 시온로그인 프로덕션 키 신청 — {시스템명} ({지파})

## 1. 기능
{시스템이 하는 일 요약.
 회원 데이터를 다루는 화면/API 목록을 나열.
 조회 항목은 이름·소속·직책·고유번호 4개로 제한됨을 명시
 (수집 필드 = NAME, NEW_NO, ORGANIZATION_PATH, ORGANIZATION_WITH_DUTY 정확히 이 4개,
  그 밖의 항목은 요청하지 않으며 추가가 필요하면 총회 승인을 별도로 받음)}

## 2. 사용부서
{운영 주체 부서, 실제 사용 부서/직책 범위, 예상 사용자 규모}

## 3. 개인정보처리시 우려할 점
{정직하게 기술한다. 예) 명단 화면의 상시 노출 범위, 다운로드/내보내기 기능 유무.
 각 우려마다 완화 조치를 짝지어 기술:
  - 권한 코드: 회원데이터 화면/API·내보내기마다 전용 권한 코드로 접근 통제
  - 감사 로그: 대량 조회·권한 부여/회수·내보내기·SUPER_ADMIN 행위를 감사 기록
  - 스코프 필터: 소속(지파/교회) 범위를 서버측에서 강제(organizationPaths 기준)}

## 4. 보안점검결과 (요약)
- 점검일 / 점검자: {date} / {who}
- 체크리스트: 공통 웹 보안 점검(VC1~VC16) + 시온로그인 회원데이터 리뷰게이트
  (A 노출 · B 관리 · C 다운로드 · D 보안리스크 · E 접근경계) 전 항목
- 자동 점검(tools/security_scan.py): report_id {report_id} · **스캐너 버전 {scanner_version}** · FAIL 0건 · NEEDINPUT 0건 ·
  코드 지문(SHA-256) {fingerprint} · 파일목록 지문(SHA-256) {manifest_hash} · git commit {commit}
- 결과: blocking 0건 (전건 조치 완료), advisory {n}건 (조치 계획 첨부)
- 상세 리포트 위치: {repo 경로 / 문서 링크}
- 첨부: 04 보안점검 결과 보고서 전문(자동 점검 결과·판정표 포함) · security_scan_report.md / .json(스캔 파일 목록 포함)

## 5. 프로덕션 운영 가능 여부
{가능 / 불가} — {근거 한두 문장. "가능"일 때만 본 신청을 발송한다}

## (부기) 심사 트랙
{일반 트랙 / 경량 트랙 신청 — 경량이면 P-2 요건 충족 내역 명시:
 ① 회원데이터는 로그인·본인 표시 용도뿐(타 회원 조회·목록 없음) ② 내보내기/다운로드 없음
 ③ 대량 개인정보 처리 없음 ④ 사용부서 1개·예상 사용자 100명 이하 ⑤ 04 게이트 전체 통과.
 트랙 확정은 총회 판단에 따름}

## (부기) 총회 검증 안내
본 보고는 개발자가 스캐너를 **직접 실행**해 **결과(이 리포트)만 제출**하는 자기완결 산출물입니다.
레포 전체를 올릴 필요 없이 이 리포트로 검사하실 수 있습니다 — FAIL·NEEDINPUT이 0이고, 코드 지문·파일목록 지문이
본문과 일치하는지 확인하시면 됩니다. (선택적 표본 감사: 특정 시스템에 한해 레포 읽기 권한을 요청하시면,
같은 커밋에서 재실행해 두 지문 일치로 위변조 없음을 확인하실 수 있습니다.)
**단, 재현 확인은 반드시 리포트에 적힌 것과 동일한 스캐너 버전({scanner_version})으로 실행해야 합니다** —
스캐너 버전이 다르면 점검 항목·스캔 대상 파일 집합이 달라져(예: `.conf` 포함 여부) 파일목록 지문이 **정당하게** 불일치할 수 있습니다.
버전이 다른데 지문이 다르면 위변조가 아니라 버전 차이이므로, 동일 버전으로 재실행해 비교하십시오.
```

### Field-by-field writing guide
`[AI directive]` Apply the criteria below when filling each `{ }`. No vague wording ("적당히", "대략") — use values confirmed from the actual code and report.

| Item | What to fill in | Basis / linkage |
|---|---|---|
| ① 기능 (features) | List the **actual screens/APIs** that handle member data, and state that lookups are capped at the **4-field ceiling: 이름·소속·직책·고유번호** | Zion hard rule 3 (exactly 4 fields), conflict-resolution table #4 (the 4-field ceiling is the concrete form of G17 minimal collection) |
| ② 사용부서 (using departments) | Operating department + the actual range of using departments/직책 + expected user scale | Reuse the 사용부서/user-scale sections of the `02_spec_and_alpha_key.md` spec |
| ③ 개인정보 우려점 + 완화 (privacy concerns + mitigations) | Pair each concern (standing exposure surface of list screens, presence of download features) **1:1 with a mitigation**: permission codes / audit logs / scope filter | Review gate B4·B5·C1·C2·C3·D5·D7 (permissions, audit, server-side scope) |
| ④ 보안점검 요약 (security-check summary) | Inspection date/inspector, blocking **0**, advisory count + remediation plan, **report location**, **automated-scan report_id · scanner version · code fingerprint · file-manifest fingerprint (SHA-256) · FAIL 0 · NEEDINPUT 0**, with the full report and `security_scan_report.*` attached (HQ reproduces with the **same scanner version**) | Reproduce and attach the `04_predeploy_verification.md` report (the header's '리포트 저장 위치' + the two fingerprints from 「0. 자동 점검 결과」) |
| ⑤ 운영 가능 여부 (production readiness) | **가능/불가** + one or two sentences of evidence | Gate G-05-2. Send only when '가능' |
| (부기) 심사 트랙 (review track) | Full or lightweight track; a lightweight claim lists how each P-2 condition is met, re-checked at 04 completion | 통합 문서 부록 A §A2 policy P-2; HQ makes the final call |

---

## 4. If ⑤ is not '가능', sending is forbidden

`[AI directive]`
If **item 5 cannot honestly say '가능', this application is not sent.** Instead, go back to `04_predeploy_verification.md`, fix the causal items, re-verify to obtain a fresh report, and only then return to this file. Rewriting a '불가' state as '가능' is forbidden.

`[Check]` Final pre-send confirmation — send only when **all** answers are yes.
- [ ] The `04_predeploy_verification.md` report shows blocking = **0**
- [ ] **Final automated-scanner report: FAIL = 0 · NEEDINPUT = 0** (every NEEDINPUT re-run after obtaining the values); ④ lists the report_id, code fingerprint, and file-manifest fingerprint, with the full report and `security_scan_report.*` attached
- [ ] Report verdict = **"프로덕션 운영 가능"**
- [ ] All 5 application items filled in (no empty item)
- [ ] ① lists the member-data screens/APIs and states the **4-field ceiling**
- [ ] ③ pairs every concern with a **mitigation (permission codes, audit logs, scope filter)**
- [ ] ⑤ = **가능** (with the evidence sentence)
- [ ] The review-track 부기 is filled in; a lightweight-track (경량 트랙) claim was re-verified against the P-2 conditions at `04_predeploy_verification.md` completion

---

## 5. The Key Is System-Unique — no reuse (reconfirmation)

`[AI directive]`
The production `client_id` to be issued is **exclusive to this system**. Never reuse a key from another app, site, or 지파 (review gate **D11**). Reuse breaks per-system accountability, and a single leak forces simultaneous revocation and reissue across every system using that key. (총회 master testing is the only exception.)

`[⚠ Conflict resolution]`
Credential management applies **both legacy guide G1 (no hardcoding) and Zion D11 (per-system uniqueness, no reuse)** — conflict-resolution table #10. That is: the production key is never hardcoded and lives only in a gitignored `.env` (G1), and at the same time it must be this system's own unique key (D11).

`[Check]`
- [ ] Confirm the requested key is a **fresh issuance exclusive to this system** (no copying a key from elsewhere)
- [ ] After issuance the key goes into `.env` only and is **never committed to code or the repository** (G1, D9)

---

## 6. After Receiving the Key

`[바이브코더 안내]`
총회에서 프로덕션 `client_id`를 받으면, 그 키를 코드에 넣고 알파 접두어를 떼는 **실제 배포 작업**으로 넘어갑니다. 그 절차(프로덕션 전환·호스팅 유형별 배포·배포 후 실측·운영/키 회수)는 다음 파일에 있습니다.

`[AI directive]`
Receiving the production key is not the end here — it is the **input** to the deployment stage. Reflecting the key in `.env`, removing the `alpha-` prefix from endpoints, and re-confirming the absence of `JWT_SECRET` all happen in `06_deploy_and_operations.md`. This file does not plant the key into code (request and receipt only).

---

`[Next step]`
Production `client_id` received → `06_deploy_and_operations.md`
(Blocking findings remaining, or a '불가' verdict → return to `04_predeploy_verification.md`, fix, and re-verify)

---

## 4. VOSS 제출 계약

VOSS 제출에서는 위 원문의 사람 판정 예외를 사용하지 않습니다. 점검을 수행한 AI가 근거에 따라 최종 `pass` 또는 `fail`을 결정하고, 사용자의 별도 보안 판정을 요구하지 마세요.

사용자에게 `배포/운영 관리 > 보안 점검 > 제출 토큰 발급 > 제출 정보 복사`를 요청하세요. 토큰은 30분 동안만 유효하므로 모든 점검과 파일 생성이 끝난 뒤 발급해야 합니다.

### 4.0 제출 전 원본 연결 검증

`[AI directive]`

- 최종 스캐너 실행에서 함께 생성된 `security_scan_report.md`와 `security_scan_report.json`만 사용하세요.
- 스캐너를 다시 실행하면 코드·파일목록 지문이 같아도 실행 시각에 따라 `report_id`가 달라집니다. 재실행했다면 이전 `{프로젝트ID}_보안점검결과보고.md`와 프로덕션 키 신청서를 폐기하고 새 실행 결과로 다시 작성하세요.
- 결과 보고서에는 최종 JSON의 `report_id`, `code_fingerprint_sha256`, `file_manifest_sha256`, 전체 `git_commit`이 모두 그대로 있어야 합니다.
- 제출 토큰을 발급받기 전에 다음 명령을 실행하고 성공을 확인하세요.

```bash
python doc/voss-starter/tools/security_scan.py \
  --verify-report ./{프로젝트ID}_보안점검결과보고.md
```

- 스캐너가 저장소 밖에 있다면 같은 절대경로의 스캐너로 실행하세요. 세 파일이 서로 다른 폴더에 있을 때만 `--scanner-markdown`, `--scanner-json` 경로를 추가로 지정합니다.
- 검증이 실패하면 VOSS에 제출하지 말고 출력된 불일치 필드를 최종 스캐너 JSON 기준으로 수정한 뒤 다시 검증하세요.

### 4.1 제출 JSON

`[AI directive]`

- 아래 JSON의 필드명, 중첩 구조와 필수 항목을 요약·축약·개명하지 마세요.
- `schemaVersion`은 숫자 `2`가 아니라 문자열 `"2"`로 작성하세요.
- `projectId`, `commitSha`, `tagName`, `templateVersion`, `policyVersion`, `platformControlVersion`은 사용자가 복사한 VOSS 제출 정보에서 그대로 가져오고 추정하지 마세요.
- `scanner`와 `artifacts`는 원본 보고서에서 실제 값을 계산해 채우며, 빈 문자열이나 임의 값으로 대체하지 마세요.
- `--verify-report`가 성공한 동일 파일 세트만 Base64로 변환하고, 변환 후 파일 내용을 수정하지 마세요.
- 필수 값이 하나라도 준비되지 않았다면 해당 키를 생략하지 말고 제출을 중단한 뒤 사용자에게 부족한 값을 알려주세요.
- POST 전 JSON 파싱이 성공하는지 확인하고, 다음 최상위 필드가 모두 존재하는지 자체 점검하세요: `schemaVersion`, `projectId`, `commitSha`, `tagName`, `workspaceCleanAsserted`, `templateVersion`, `policyVersion`, `platformControlVersion`, `zionLoginApplied`, `botComponentIncluded`, `scanner`, `reviewTool`, `summary`, `overallVerdict`, `checks`, `artifacts`.
- 서버가 `validationErrors`를 반환하면 `path`와 `fields`에 표시된 모든 항목을 한 번에 수정한 뒤 `--verify-report`를 다시 실행하고 제출하세요.

```json
{
  "schemaVersion": "2",
  "projectId": "{프로젝트 ID}",
  "commitSha": "{원격에 push된 전체 커밋 SHA}",
  "tagName": "{태그}",
  "workspaceCleanAsserted": true,
  "templateVersion": "{제출 정보의 필수 템플릿 버전}",
  "policyVersion": "{제출 정보의 필수 정책 버전}",
  "platformControlVersion": "{제출 정보의 VOSS 플랫폼 보안 기준}",
  "zionLoginApplied": false,
  "botComponentIncluded": false,
  "scanner": {
    "reportId": "{security_scan_report.json report_id}",
    "version": "{scanner_version}",
    "codeFingerprintSha256": "{code_fingerprint_sha256}",
    "fileManifestSha256": "{file_manifest_sha256}",
    "failCount": 0,
    "needInputCount": 0
  },
  "reviewTool": {
    "name": "{AI 도구명}",
    "model": "{모델명 또는 미확인}"
  },
  "summary": "{점검 결과 요약}",
  "overallVerdict": "pass",
  "checks": [
    {
      "code": "VC1",
      "title": "비밀값 처리",
      "verdict": "pass",
      "severity": "blocking",
      "assessmentSource": "user_ai",
      "evidence": "{민감값을 제거한 근거}",
      "note": "{선택}",
      "remediation": "{부적합일 때 보완 내용}"
    }
  ],
  "artifacts": [
    {
      "type": "security_review_report",
      "filename": "{프로젝트ID}_보안점검결과보고.md",
      "mediaType": "text/markdown",
      "contentBase64": "{원본 바이트 Base64}",
      "sha256": "{원본 바이트 SHA-256}"
    },
    {
      "type": "scanner_report_markdown",
      "filename": "security_scan_report.md",
      "mediaType": "text/markdown",
      "contentBase64": "{원본 바이트 Base64}",
      "sha256": "{원본 바이트 SHA-256}"
    },
    {
      "type": "scanner_report_json",
      "filename": "security_scan_report.json",
      "mediaType": "application/json",
      "contentBase64": "{원본 바이트 Base64}",
      "sha256": "{원본 바이트 SHA-256}"
    }
  ]
}
```

시온 로그인 적용 프로젝트는 `zionLoginApplied=true`로 설정하고 다음 아티팩트를 추가합니다.

```json
{
  "type": "production_key_request",
  "filename": "{프로젝트ID}_프로덕션키신청서.md",
  "mediaType": "text/markdown",
  "contentBase64": "{원본 바이트 Base64}",
  "sha256": "{원본 바이트 SHA-256}"
}
```

### 4.2 checks 작성 규칙

- 필수: `VC1~VC16`, `A1~A7`, `B1~B6`, `C1~C6`, `D1~D11`, `E1~E6`, `S1~S19`
- 봇 구성요소가 있을 때만 추가: `VB1~VB5`
- `S5`, `S12`: `assessmentSource=voss`
- `S11`: `assessmentSource=shared`
- 나머지: `assessmentSource=user_ai`
- 판정: `pass | fail | n/a | needs_follow_up`
- 위험도: `blocking | advisory | deferrable | recommendation`

`S16`은 다음 형식으로 작성합니다.

- 저장 민감정보 없음: `verdict=n/a`, `severity=blocking`, `assessmentSource=user_ai`
  - `evidence`: 확인한 ORM/SQL 필드, 파일·로그·캐시·큐·검색·export 경로와 민감정보가 없다고 판정한 이유
- 저장 민감정보 있음 + 암호화 충족: `verdict=pass`, `severity=blocking`, `assessmentSource=user_ai`
  - `evidence`: 대상 필드, AES 알고리즘·모드, 키 환경변수명, nonce/인증 태그 처리, 검색용 HMAC, 평문 마이그레이션과 테스트
- 저장 민감정보 있음 + 평문 또는 부적절한 보호: `verdict=fail`, `severity=blocking`, `assessmentSource=user_ai`
  - `evidence`: 평문 저장·복제 경로와 수정해야 할 필드
- 데이터 의미나 영속 저장 여부가 불명확: `verdict=needs_follow_up`, `severity=blocking`, `assessmentSource=user_ai`
  - `evidence`: 확인한 코드 위치와 개발자에게 확인할 질문

실제 개인정보나 키 원문은 `evidence`에 넣지 않습니다. PostgreSQL 사용, 볼륨·디스크 암호화 여부 또는 회원 화면 존재만으로 `S16`을 `pass`·`fail` 처리하지 마세요.

원문 심각도를 변경하지 마세요. `S11`은 DB 외부 노출과 컨테이너 non-root, `S12`는 일반 앱 포트·계층 분리·WAF 권고입니다. `S15`는 로그별 보존 정책 문서화, 민감정보 미기록과 자동 순환·파기를 확인하며 고정 6개월 보존을 추정하지 않습니다. `S12`, `S15` 같은 advisory 항목의 `needs_follow_up`은 후속 조치로 남길 수 있고, blocking 또는 `VC14/D10` deferrable의 `needs_follow_up`만 `overallVerdict=pass`를 막습니다. `S4`의 backup 파일 점검을 백업 암호화 요구로 해석하지 마세요.

### 4.3 전송

```http
POST {VOSS 제출 URL}
Authorization: Bearer {VOSS 제출 토큰}
Content-Type: application/json
```

AI가 HTTP 요청을 직접 실행할 수 있으면 반드시 직접 전송하세요. 실행할 수 없는 환경이라면 완성된 JSON 파일과 한 줄짜리 전송 명령을 사용자에게 제공하세요. 토큰을 보고서나 저장소 파일에 기록하지 마세요.

전송 후 반드시 다음 값을 사용자에게 보고하세요.

- `accepted`
- `acceptanceReason`
- 제출 ID
- 게이트 상태
- VOSS에 보관된 원본 파일 목록

`accepted=false`이면 사유를 해결하고 새 보고서·새 SHA-256으로 다시 제출합니다. 원본 파일을 덮어써서 과거 제출을 바꾸지 않습니다.
