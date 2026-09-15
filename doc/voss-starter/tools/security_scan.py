#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
security_scan.py — pre-deploy automated security scanner for the Zion Login
integrated guide (stage 04).

Purpose: automatically judge the machine-checkable items of
    04_predeploy_verification.md and emit a report for HQ submission
    (JSON + Markdown, including a code fingerprint). The remaining items
    that require code comprehension (permission logic, audit, IDOR, ...)
    are judged by the AI.

    Also flags the machine-checkable subset of the infra/compliance
    supplement (references/infra-compliance-supplement.md §E): S1 debug
    mode (DEBUG=True), S3 directory listing (autoindex on), S4 stray
    backup/temp/DB-dump files, S11 docker-compose DB-port exposure / root
    container, S18 weak hash (MD5/SHA-1), S19 config-file secrets
    (URL-embedded credentials / plaintext secret directives). VC8 also
    covers template auto-escape bypasses (`| safe`, v-html, {@html). These
    emit WARN — the AI finalizes per 04.

    Secret detection is entropy-aware: a value that embeds a placeholder
    word but carries a long high-entropy token (e.g. API_KEY="example_<real
    key>") is treated as a real secret, not a placeholder.

Principles:
- Standard library only (no installation; works on Windows/Mac/Linux,
  Python 3.7+).
- Fingerprints are line-ending- and path-separator-normalized (CRLF→LF,
  `\\`→`/`), so the same commit hashes identically on Windows/Mac/Linux —
  HQ reproduction stays stable across a mixed-platform fleet.
- Never write real values or secrets into the report (evidence is masked
  as [REDACTED]).
- Five verdicts: PASS/FAIL/NEEDINPUT/WARN/SKIP. NEEDINPUT means a required
  input (e.g. Supabase RLS probe credentials) was missing; WARN/SKIP are
  finalized by the AI or a human.

Usage:
  python security_scan.py --root .                 # static scan from project root
  python security_scan.py --root . --deploy-url https://myapp.example.com
  python security_scan.py --root . --supabase-url https://xxx.supabase.co \
         --supabase-key <ANON_KEY> --supabase-table members   # live RLS probe
  python security_scan.py --root . --out-dir ./outputs         # report location
  python security_scan.py --root . --tracked-only \
         --exclude-path doc/ref --dependency-root . --dependency-root server
  python security_scan.py --verify-report ./my-project_보안점검결과보고.md
Exit code: 0 = no FAIL/NEEDINPUT, 1 = one or more FAIL or NEEDINPUT
(critical verdicts are finalized by the AI), 2 = input or report linkage error.
"""

import argparse
import hashlib
import json
import math
import os
import re
import shutil
import subprocess
import sys
import urllib.request
import urllib.error
from collections import Counter
from datetime import datetime, timezone

SCANNER_VERSION = "1.1.3"

# ── Scan targets / exclusions ─────────────────────────────────
CODE_EXT = {".py", ".js", ".ts", ".jsx", ".tsx", ".vue", ".svelte", ".go",
            ".rb", ".php", ".java", ".kt", ".cs", ".html", ".htm", ".sql",
            ".env.example", ".yml", ".yaml", ".toml", ".cfg", ".ini", ".sh",
            ".conf"}  # .conf added so nginx/apache configs are scanned (S3 dir-listing, secrets)
# .claude is skipped so this skill's own guide files (which quote the very
# patterns we grep for, e.g. JWT_SECRET / /oauth2/) never self-flag the scan.
SKIP_DIRS = {".git", "node_modules", "dist", "build", ".next", ".nuxt",
             ".svelte-kit", "venv", ".venv", "__pycache__", "coverage",
             ".mypy_cache", ".pytest_cache", "vendor", ".idea", ".vscode",
             ".claude", "zion-login-integrated"}
CLIENT_DIRS = {"public", "static", "client", "frontend", "www", "assets"}
MAX_FILE_BYTES = 2_000_000
PLACEHOLDER_HINTS = ("your", "xxx", "placeholder", "example", "changeme",
                     "<", "${", "여기", "자리표시", "todo", "dummy", "sample")


def mask(s, keep=4):
    s = str(s)
    if len(s) <= keep:
        return "[REDACTED]"
    return s[:keep] + "…[REDACTED]"


def _shannon_entropy(s):
    if not s:
        return 0.0
    n = len(s)
    return -sum((c / n) * math.log2(c / n) for c in Counter(s).values())


def looks_like_secret(val):
    """True if the value contains a long, high-entropy token — a real key
    wearing a placeholder word (e.g. `example_9f8a7b6c…`) still trips this.
    URLs and short values are excluded to hold down false positives."""
    v = val.strip().strip('"').strip("'")
    if v.startswith(("http://", "https://")):
        return False
    for tok in re.findall(r"[A-Za-z0-9+/_\-]{20,}", v):
        if _shannon_entropy(tok) >= 3.2:      # random hex/base64 ~3.9–5.5; words ~2–3
            return True
    return False


def is_placeholder(val):
    v = val.strip().strip('"').strip("'")
    if v == "" or len(v) < 8:
        return True
    # A hint word (example/sample/your/…) normally means "placeholder", BUT a
    # genuinely secret-looking value that merely embeds such a word is a real
    # secret in disguise — do NOT treat it as a placeholder (avoids the
    # `API_KEY="example_<realkey>"` evasion). Name-gated + long+high-entropy +
    # URL-excluded, so obvious placeholders (your-key-here, changeme) still pass.
    if looks_like_secret(v):
        return False
    low = v.lower()
    return any(h in low for h in PLACEHOLDER_HINTS)


def normalize_relpath(path):
    normalized = path.replace("\\", "/").strip("/")
    while normalized.startswith("./"):
        normalized = normalized[2:]
    return "" if normalized == "." else normalized


def is_excluded_path(relpath, excluded_paths):
    normalized = normalize_relpath(relpath)
    return any(
        normalized == excluded or normalized.startswith(excluded + "/")
        for excluded in excluded_paths
    )


def git_tracked_files(root):
    try:
        out = subprocess.run(
            ["git", "-C", root, "ls-files", "-z"],
            capture_output=True,
            timeout=30,
        )
    except Exception as exc:  # noqa
        raise RuntimeError(f"git 추적 파일 조회 실패: {exc}") from exc

    if out.returncode != 0:
        message = out.stderr.decode("utf-8", "ignore").strip() or "git ls-files 실패"
        raise RuntimeError(message)

    return [
        normalize_relpath(path.decode("utf-8", "surrogateescape"))
        for path in out.stdout.split(b"\0")
        if path
    ]


def git_untracked_files(root):
    try:
        out = subprocess.run(
            ["git", "-C", root, "ls-files", "--others", "--exclude-standard", "-z"],
            capture_output=True,
            timeout=30,
        )
    except Exception as exc:  # noqa
        raise RuntimeError(f"Git 미추적 파일 조회 실패: {exc}") from exc

    if out.returncode != 0:
        message = out.stderr.decode("utf-8", "ignore").strip() or "git ls-files --others 실패"
        raise RuntimeError(message)

    return [
        normalize_relpath(path.decode("utf-8", "surrogateescape"))
        for path in out.stdout.split(b"\0")
        if path
    ]


def collect_project_files(root, tracked_only=False, include_untracked=False, excluded_paths=()):
    normalized_excludes = tuple(
        normalize_relpath(path) for path in excluded_paths if normalize_relpath(path)
    )

    if tracked_only:
        paths = git_tracked_files(root)
        if include_untracked:
            paths = sorted(set(paths + git_untracked_files(root)))
        return [
            os.path.join(root, relpath)
            for relpath in paths
            if not is_excluded_path(relpath, normalized_excludes)
            and not any(part in SKIP_DIRS for part in relpath.split("/"))
            and os.path.isfile(os.path.join(root, relpath))
        ]

    files = []
    for dirpath, dirnames, filenames in os.walk(root):
        relative_dir = normalize_relpath(os.path.relpath(dirpath, root))
        dirnames[:] = [
            dirname
            for dirname in dirnames
            if dirname not in SKIP_DIRS
            and not is_excluded_path(
                dirname if relative_dir in ("", ".") else f"{relative_dir}/{dirname}",
                normalized_excludes,
            )
        ]
        for filename in filenames:
            path = os.path.join(dirpath, filename)
            if not is_excluded_path(rel(root, path), normalized_excludes):
                files.append(path)
    return files


def iter_source_files(root, project_files):
    self_path = os.path.abspath(__file__)
    for fp in project_files:
        fn = os.path.basename(fp)
        ext = os.path.splitext(fn)[1].lower()
        special = fn.lower() in (".env.example", ".gitignore", ".htaccess")
        if ext not in CODE_EXT and not special:
            continue
        if os.path.abspath(fp) == self_path:
            continue
        try:
            if os.path.getsize(fp) > MAX_FILE_BYTES:
                continue
        except OSError:
            continue
        yield fp


def read_text(fp):
    try:
        with open(fp, "r", encoding="utf-8", errors="ignore") as f:
            # Normalize line endings so the code/manifest fingerprints are
            # identical across platforms (Windows CRLF vs *nix LF, git
            # autocrlf) — otherwise the same commit fingerprints differently
            # on a Mac dev box vs a Linux CI, breaking HQ reproduction.
            return f.read().replace("\r\n", "\n").replace("\r", "\n")
    except OSError:
        return ""


def rel(root, fp):
    try:
        return os.path.relpath(fp, root).replace("\\", "/")
    except ValueError:
        return fp


def under_client_dir(relpath):
    # Client-side if under a client dir, OR a UI-component file that always
    # compiles into the browser bundle (.vue/.svelte/.jsx/.tsx) — so a
    # service_role key in a Vue/Svelte/React component is caught even under src/.
    parts = relpath.split("/")
    return (any(p in CLIENT_DIRS for p in parts[:-1])
            or relpath.endswith((".html", ".htm", ".vue", ".svelte", ".jsx", ".tsx")))


# ── Verdict container ─────────────────────────────────────────
class Result:
    def __init__(self):
        self.findings = []  # {id, vc, name, status, evidence}

    def add(self, cid, vc, name, status, evidence):
        self.findings.append({"id": cid, "vc": vc, "name": name,
                              "status": status, "evidence": evidence})

    def counts(self):
        c = {"PASS": 0, "FAIL": 0, "NEEDINPUT": 0, "WARN": 0, "SKIP": 0}
        for f in self.findings:
            c[f["status"]] = c.get(f["status"], 0) + 1
        return c


# ── HTTP probe ────────────────────────────────────────────────
def http_status(url, timeout=8):
    req = urllib.request.Request(url, headers={"User-Agent": "zion-scan/1.0",
                                               "Accept": "application/json"})
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return resp.status, resp.read(4096)
    except urllib.error.HTTPError as e:
        return e.code, b""
    except Exception as e:  # noqa
        return None, str(e).encode()


def git_remote(root):
    try:
        out = subprocess.run(["git", "-C", root, "remote", "get-url", "origin"],
                             capture_output=True, text=True, timeout=10)
        if out.returncode == 0:
            return out.stdout.strip()
    except Exception:  # noqa
        pass
    return ""


def git_head(root):
    try:
        out = subprocess.run(["git", "-C", root, "rev-parse", "HEAD"],
                             capture_output=True, text=True, timeout=10)
        if out.returncode == 0:
            return out.stdout.strip()
    except Exception:  # noqa
        pass
    return "no-git"


def normalize_remote(url):
    """SSH/HTTPS remote → (host, owner, repo). (None, None, None) on failure."""
    url = url.strip()
    m = re.match(r"git@([^:]+):([^/]+)/(.+?)(?:\.git)?$", url)
    if m:
        return m.group(1), m.group(2), m.group(3)
    m = re.match(r"https?://(?:[^@/]+@)?([^/]+)/([^/]+)/(.+?)(?:\.git)?$", url)
    if m:
        return m.group(1), m.group(2), m.group(3)
    return None, None, None


# ── Checks ────────────────────────────────────────────────────
def check_repo_visibility(root, res):
    remote = git_remote(root)
    if not remote:
        res.add("VC3", "VC3/E5", "저장소 공개 여부(레포 private)", "SKIP",
                "git remote(origin) 없음 → 배포처 소스공개 여부를 수동 확인 필요")
        return
    host, owner, repo = normalize_remote(remote)
    if not host:
        res.add("VC3", "VC3/E5", "저장소 공개 여부(레포 private)", "WARN",
                f"remote 형식 파싱 실패: {mask(remote,10)} → 수동 실측")
        return
    # Judge public visibility via the host's API (unauthenticated)
    if "github.com" in host:
        api = f"https://api.github.com/repos/{owner}/{repo}"
    elif "gitlab" in host:
        api = f"https://{host}/api/v4/projects/{owner}%2F{repo}"
    else:
        api = f"https://{host}/{owner}/{repo}"
    status, _ = http_status(api)
    if status == 200:
        res.add("VC3", "VC3/E5", "저장소 공개 여부(레포 private)", "FAIL",
                f"{host}/{owner}/{repo} 비인증 접근 200(공개) → private 전환 + 커밋 비밀값 유출 간주(재발급)")
    elif status == 404:
        res.add("VC3", "VC3/E5", "저장소 공개 여부(레포 private)", "PASS",
                f"{host}/{owner}/{repo} 비인증 404(비공개/없음)")
    elif status in (401, 403, 429):
        res.add("VC3", "VC3/E5", "저장소 공개 여부(레포 private)", "WARN",
                f"상태 {status}(rate limit/인증) → 잠시 후 재시도 또는 로그아웃 창으로 수동 확인")
    else:
        res.add("VC3", "VC3/E5", "저장소 공개 여부(레포 private)", "WARN",
                f"상태 {status} → 수동 확인 필요")


def check_git_config_exposure(root, res, deploy_url):
    if not deploy_url:
        res.add("VC3b", "VC3", "배포 URL의 /.git/config 노출", "SKIP",
                "--deploy-url 미제공 → 정적 배포면 수동 확인")
        return
    url = deploy_url.rstrip("/") + "/.git/config"
    status, _ = http_status(url)
    if status == 200:
        res.add("VC3b", "VC3", "배포 URL의 /.git/config 노출", "FAIL",
                f"{mask(deploy_url,20)}/.git/config 200 → 소스 전체 유출(치명)")
    else:
        res.add("VC3b", "VC3", "배포 URL의 /.git/config 노출", "PASS",
                f"/.git/config 상태 {status}(노출 아님)")


def _find_named(root, name, max_depth=2, project_files=None):
    # Monorepo layouts keep these per sub-project (backend/.gitignore etc.),
    # so look a couple of levels deep, not only at the root.
    if project_files is not None:
        found = []
        for path in project_files:
            relative = rel(root, path)
            depth = relative.count("/")
            if os.path.basename(path) == name and depth <= max_depth:
                found.append(path)
        return found

    found = []
    root = os.path.abspath(root)
    for dirpath, dirnames, filenames in os.walk(root):
        relative_dir = os.path.relpath(dirpath, root)
        depth = 0 if relative_dir == "." else relative_dir.count(os.sep) + 1
        if depth >= max_depth:
            dirnames[:] = []
        else:
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
        if name in filenames:
            found.append(os.path.join(dirpath, name))
    return found


def check_gitignore_env(root, res, project_files=None):
    gis = _find_named(root, ".gitignore", project_files=project_files)
    if not gis:
        res.add("VC2a", "VC2/G1", ".gitignore에 .env 포함", "FAIL",
                ".gitignore 없음 → .env가 커밋될 위험")
        return
    for gi in gis:
        lines = [ln.strip() for ln in read_text(gi).splitlines()]
        if any(re.fullmatch(r"\*?\.env\*?", ln) or ln == ".env" for ln in lines):
            res.add("VC2a", "VC2/G1", ".gitignore에 .env 포함", "PASS",
                    f".gitignore가 .env 무시({os.path.relpath(gi, root)})")
            return
    res.add("VC2a", "VC2/G1", ".gitignore에 .env 포함", "FAIL",
            ".gitignore에 .env 규칙 없음 → 추가 필요")


def check_env_example(root, res, project_files=None):
    exs = _find_named(root, ".env.example", project_files=project_files)
    if not exs:
        res.add("VC2b", "VC2/D9", ".env.example 자리표시자만", "WARN",
                ".env.example 없음 → 자리표시자 예시 파일 제공 권장")
        return
    leaks = []
    for ex in exs:
        rel = os.path.relpath(ex, root)
        for i, ln in enumerate(read_text(ex).splitlines(), 1):
            if "=" in ln and not ln.strip().startswith("#"):
                k, _, v = ln.partition("=")
                v = v.split("#")[0].strip()
                if v.startswith(("http://", "https://")) and "ziongroup.net" in v:
                    continue  # canonical Zion endpoint URL, not a secret
                if v and not is_placeholder(v) and re.search(r"[A-Za-z0-9_\-]{12,}", v):
                    leaks.append(f"{rel}:L{i}:{k.strip()}={mask(v)}")
    if leaks:
        res.add("VC2b", "VC2/D9", ".env.example 자리표시자만", "FAIL",
                "실제 값으로 보이는 항목: " + "; ".join(leaks[:5]))
    else:
        res.add("VC2b", "VC2/D9", ".env.example 자리표시자만", "PASS",
                "자리표시자/빈값만 확인")


def _grep(files_texts, pattern, flags=0):
    rx = re.compile(pattern, flags)
    hits = []
    for relpath, txt in files_texts:
        for i, ln in enumerate(txt.splitlines(), 1):
            if rx.search(ln):
                hits.append((relpath, i, ln.strip()))
    return hits


def check_hardcoded_secrets(files_texts, res):
    # Reading via os.getenv/process.env is fine; catch only literal assignments.
    secret_name = r"(client[_-]?secret|api[_-]?key|access[_-]?token|" \
                  r"secret[_-]?key|password|passwd|oauth2?[_-]?client[_-]?id|client[_-]?id)"
    pat = re.compile(
        secret_name + r"""\s*[:=]\s*["']([^"']{8,})["']""", re.IGNORECASE)
    hits = []
    for relpath, txt in files_texts:
        for i, ln in enumerate(txt.splitlines(), 1):
            if "getenv" in ln or "process.env" in ln or "os.environ" in ln:
                continue
            m = pat.search(ln)
            if m and not is_placeholder(m.group(2)):
                hits.append(f"{relpath}:L{i} {m.group(1)}={mask(m.group(2))}")
    if hits:
        res.add("VC1", "VC1/G1/D9", "하드코딩된 비밀값/자격증명", "FAIL",
                "리터럴 대입 발견: " + "; ".join(hits[:6]))
    else:
        res.add("VC1", "VC1/G1/D9", "하드코딩된 비밀값/자격증명", "PASS",
                "코드 내 비밀값 리터럴 대입 없음(env 로드로 판단)")


def check_jwt_secret(files_texts, res):
    hits = _grep(files_texts, r"JWT_SECRET")
    hits = [h for h in hits if "없" not in h[2] and "no " not in h[2].lower()
            and "not" not in h[2].lower() and "금지" not in h[2]]
    if hits:
        loc = "; ".join(f"{r}:L{i}" for r, i, _ in hits[:6])
        res.add("D2", "D2/하드룰2", "자체 JWT(JWT_SECRET) 부재", "FAIL",
                f"JWT_SECRET 사용 정황({loc}) → 이 에디션은 자체 토큰 금지(세션=시온 access_token)")
    else:
        res.add("D2", "D2/하드룰2", "자체 JWT(JWT_SECRET) 부재", "PASS",
                "JWT_SECRET 사용 정황 없음")


def check_oauth_path(files_texts, res):
    hits = _grep(files_texts, r"/oauth2/")
    # Guide-style comments quote the wrong path to warn against it
    # ("path is /oauth/, NOT /oauth2/") — a real misuse has no negation.
    hits = [h for h in hits if "not" not in h[2].lower() and "아님" not in h[2]
            and "금지" not in h[2] and "/oauth/" not in h[2]]
    if hits:
        loc = "; ".join(f"{r}:L{i}" for r, i, _ in hits[:6])
        res.add("PATH1", "자주틀리는값", "OAuth 경로 /oauth/ (NOT /oauth2/)", "FAIL",
                f"/oauth2/ 발견({loc}) → 경로는 /oauth/ 여야 함(로그인 실패 주범)")
    else:
        res.add("PATH1", "자주틀리는값", "OAuth 경로 /oauth/ (NOT /oauth2/)", "PASS",
                "/oauth2/ 오용 없음")


def check_userinfo_version(files_texts, res):
    hits = _grep(files_texts, r"v2_0/me")
    if hits:
        loc = "; ".join(f"{r}:L{i}" for r, i, _ in hits[:6])
        res.add("API1", "api-catalog", "회원조회 v3_0/me 사용(v2_0 금지)", "FAIL",
                f"v2_0/me 발견({loc}) → v3_0/me 사용")
    else:
        res.add("API1", "api-catalog", "회원조회 v3_0/me 사용(v2_0 금지)", "PASS",
                "v2_0/me 사용 없음")


def check_member_ceiling(files_texts, res):
    banned = r"\b(MOBILE|EMAIL|ADDRESS|BIRTHDAY|SEX|PICTURE)\b"
    # Zion userinfo properties-request context: a line mentioning
    # 'properties'/'v3_0/me', or one containing a Zion-specific allowed token
    # (NEW_NO/ORGANIZATION_PATH/ORGANIZATION_WITH_DUTY) — even if the variable
    # is named e.g. `props` — is treated as a properties list.
    zion_ctx = re.compile(r"NEW_NO|ORGANIZATION_PATH|ORGANIZATION_WITH_DUTY")
    hits = []
    for relpath, txt in files_texts:
        for i, ln in enumerate(txt.splitlines(), 1):
            in_props_ctx = ("properties" in ln.lower() or "v3_0/me" in ln
                            or "/me?" in ln or zion_ctx.search(ln))
            if in_props_ctx:
                m = re.search(banned, ln)
                if m:
                    hits.append(f"{relpath}:L{i} {m.group(1)}")
    if hits:
        res.add("B1", "B1/하드룰3", "회원데이터 4개 필드 상한", "FAIL",
                "properties 문맥에 초과 필드: " + "; ".join(hits[:6]) +
                " → 총회 승인 없이 금지(허용: NAME/NEW_NO/ORGANIZATION_PATH/ORGANIZATION_WITH_DUTY)")
    else:
        res.add("B1", "B1/하드룰3", "회원데이터 4개 필드 상한", "PASS",
                "properties 문맥에 초과 필드 없음")


def check_xss_sinks(files_texts, res):
    # Template auto-escape bypasses matter as much as innerHTML: Jinja/Django
    # `| safe`, Vue `v-html`, Svelte `{@html`, Flask render_template_string.
    # (Matches the audit checklist's own XSS grep set — 11-3.)
    hits = _grep(files_texts,
                 r"\.innerHTML\s*=|dangerouslySetInnerHTML|\bv-html\b"
                 r"|\{@html|\|\s*safe\b|render_template_string\(")
    if hits:
        loc = "; ".join(f"{r}:L{i}" for r, i, _ in hits[:8])
        res.add("VC8", "VC8/G14", "XSS 원시 sink(innerHTML·|safe·v-html 등)", "WARN",
                f"미이스케이프 가능 지점({loc}) → 이스케이프 여부를 AI가 확인")
    else:
        res.add("VC8", "VC8/G14", "XSS 원시 sink(innerHTML·|safe·v-html 등)", "PASS",
                "innerHTML/dangerouslySetInnerHTML/|safe/v-html 없음")


def check_sql_string_build(files_texts, res):
    # On lines containing SQL keywords, WARN when 'string + variable'
    # concatenation, 'string % variable' formatting, or f-string
    # interpolation ({..}) appears alongside — evidence of assembled SQL.
    # Parameterized forms (execute("...%s", (x,)) / "...:name") are not
    # flagged, to avoid false positives.
    sql_kw = re.compile(r"\b(SELECT|INSERT\s+INTO|UPDATE\s+\w|DELETE\s+FROM|FROM\s+\w+\s+WHERE)\b",
                        re.IGNORECASE)
    concat = re.compile(r"""["']\s*\+|\+\s*["']|["']\s*%\s*[\w(]""")
    fstr = re.compile(r"""[fF]["'][^"']*\{""")
    # JS/TS template-literal interpolation: `... ${x} ...` (backtick + ${).
    # Parameterized queries ('...?', [x] / '...:name') have no backtick+${.
    tmpl = re.compile(r"`[^`]*\$\{")
    hits = []
    for relpath, txt in files_texts:
        for i, ln in enumerate(txt.splitlines(), 1):
            if sql_kw.search(ln) and (concat.search(ln) or fstr.search(ln)
                                      or tmpl.search(ln)):
                hits.append((relpath, i, ln.strip()))
    if hits:
        loc = "; ".join(f"{r}:L{i}" for r, i, _ in hits[:8])
        res.add("VC7", "VC7/D6", "문자열 조립 SQL(인젝션)", "WARN",
                f"문자열 조립 SQL 정황({loc}) → 파라미터화 여부를 AI가 확인")
    else:
        res.add("VC7", "VC7/D6", "문자열 조립 SQL(인젝션)", "PASS",
                "문자열 조립 SQL 정황 없음(또는 파라미터화)")


def check_service_role_client(files_texts, res):
    hits = [(r, i, ln) for (r, i, ln) in _grep(files_texts, r"service_role")
            if under_client_dir(r)]
    if hits:
        loc = "; ".join(f"{r}:L{i}" for r, i, _ in hits[:6])
        res.add("G3", "G3/하드룰1", "service_role 클라이언트 노출", "FAIL",
                f"클라이언트/정적 경로에 service_role({loc}) → 서버 전용")
    else:
        res.add("G3", "G3/하드룰1", "service_role 클라이언트 노출", "PASS",
                "클라이언트 경로에 service_role 없음")


def check_debug_mode(files_texts, res):
    # Supplement S1 (checklist 12-4): production debug must be OFF. Flag the
    # common framework debug toggles. Comments and the guide's own prose are
    # excluded (a line explaining the rule is not a real DEBUG=True).
    pat = re.compile(
        r"""(?:^|[^A-Za-z_])(DEBUG\s*=\s*True|FLASK_DEBUG\s*=\s*1|"""
        r"""app\.debug\s*=\s*[Tt]rue|debug\s*=\s*True|FLASK_ENV\s*=\s*development)""")
    hits = []
    for relpath, txt in files_texts:
        for i, ln in enumerate(txt.splitlines(), 1):
            s = ln.strip()
            if s.startswith("#") or s.startswith("//") or s.startswith("*"):
                continue
            if pat.search(ln):
                hits.append(f"{relpath}:L{i}")
    if hits:
        loc = "; ".join(hits[:8])
        res.add("S1", "S1/G25/12-4", "운영 DEBUG 모드 OFF", "WARN",
                f"디버그 켜짐 정황({loc}) → 배포 산출물에서 꺼졌는지 AI가 확정(개발용 분기면 무해)")
    else:
        res.add("S1", "S1/G25/12-4", "운영 DEBUG 모드 OFF", "PASS",
                "DEBUG=True/debug=True 정황 없음")


def check_weak_hash(files_texts, res):
    # Supplement S18 (checklist 4-2): no MD5/SHA-1 for security purposes.
    # SHA-256(access_token) session-store hashing is fine and not matched here.
    pat = re.compile(r"\b(hashlib\.md5|hashlib\.sha1|md5\s*\(|sha1\s*\(|"
                     r"createHash\(\s*['\"](?:md5|sha1)['\"]\s*\))",
                     re.IGNORECASE)
    hits = []
    for relpath, txt in files_texts:
        for i, ln in enumerate(txt.splitlines(), 1):
            s = ln.strip()
            if s.startswith("#") or s.startswith("//") or s.startswith("*"):
                continue
            if pat.search(ln):
                hits.append(f"{relpath}:L{i}")
    if hits:
        loc = "; ".join(hits[:8])
        res.add("S18h", "S18/G34/4-2", "약한 해시(MD5/SHA-1) 사용", "WARN",
                f"MD5/SHA-1 정황({loc}) → 보안 용도면 SHA-256↑/bcrypt로. 비보안 용도인지 AI가 확정")
    else:
        res.add("S18h", "S18/G34/4-2", "약한 해시(MD5/SHA-1) 사용", "PASS",
                "MD5/SHA-1 보안 사용 정황 없음")


def check_dir_listing(files_texts, res):
    # Supplement S3 (checklist 12-7): directory listing must be OFF.
    hits = _grep(files_texts, r"autoindex\s+on|Options\s+.*\bIndexes\b")
    hits = [h for h in hits if "-Indexes" not in h[2] and "off" not in h[2].lower()]
    if hits:
        loc = "; ".join(f"{r}:L{i}" for r, i, _ in hits[:6])
        res.add("S3", "S3/G25/12-7", "디렉토리 리스팅 OFF", "WARN",
                f"디렉토리 목록 노출 정황({loc}) → autoindex off / Options -Indexes 확인")
    else:
        res.add("S3", "S3/G25/12-7", "디렉토리 리스팅 OFF", "PASS",
                "autoindex on/디렉토리 리스팅 정황 없음")


def check_config_secrets(files_texts, res):
    # S19 (checklist 12-1·12-3 · G2): config-file secret hygiene. Config files
    # (nginx/apache/.ini/.yml) embed secrets in ways the '=/:' assignment
    # scanner (VC1) misses — credentials inside a URL, or space-separated
    # directives. (a) is scanned in ALL files (proxy_pass, DB DSNs live in code
    # too); (b) only in config-type files.
    url_cred = re.compile(
        r"[a-zA-Z][a-zA-Z0-9+.\-]*://[^/\s:@\"']+:([^/\s:@\"']{4,})@")
    directive = re.compile(
        r"""\b(password|passwd|secret|api[_-]?key|auth[_-]?token|token)\b\s+"""
        r"""["']?([^"'\s;]{8,})["']?""", re.IGNORECASE)
    cfg_ext = (".conf", ".htaccess", ".ini", ".cfg", ".yml", ".yaml", ".toml")
    hits = []
    for relpath, txt in files_texts:
        is_cfg = relpath.endswith(cfg_ext) or relpath.endswith(".htaccess")
        for i, ln in enumerate(txt.splitlines(), 1):
            s = ln.strip()
            if s.startswith("#") or s.startswith("//") or s.startswith(";"):
                continue
            if "getenv" in ln or "process.env" in ln or "os.environ" in ln:
                continue
            m = url_cred.search(ln)
            if m and not is_placeholder(m.group(1)):
                hits.append(f"{relpath}:L{i} URL내 자격증명 …:{mask(m.group(1))}@")
            if is_cfg and "=" not in ln:   # '=' assignments already covered by VC1
                m2 = directive.search(ln)
                if m2 and looks_like_secret(m2.group(2)):
                    hits.append(f"{relpath}:L{i} 평문 비밀 {m2.group(1)}={mask(m2.group(2))}")
    if hits:
        res.add("S19", "S19/G2/12-1", "설정파일 시크릿(URL 자격증명·평문 비밀)", "WARN",
                "정황: " + "; ".join(hits[:6]) +
                " → 환경변수로 분리, URL에 비밀 금지(G2). 실값인지 AI가 확정")
    else:
        res.add("S19", "S19/G2/12-1", "설정파일 시크릿(URL 자격증명·평문 비밀)", "PASS",
                "설정파일 내 URL 자격증명/평문 비밀 정황 없음")


def check_stray_files(root, res, project_files=None):
    # S4 (checklist 12-9): backup/temp/DB-dump files left in the tree leak data
    # and source. Walk the tree — these names are outside CODE_EXT, so the
    # content scan never sees them.
    ext_pat = re.compile(r"(\.bak|\.orig|\.old|\.swp|\.tmp|\.dump|\.sqlite3?|\.db|~)$",
                         re.IGNORECASE)
    name_pat = re.compile(r"^(dump|backup|db[_-]?backup)\.", re.IGNORECASE)
    hits = []
    if project_files is not None:
        for path in project_files:
            filename = os.path.basename(path)
            if ext_pat.search(filename) or name_pat.match(filename):
                hits.append(rel(root, path))
    else:
        for dirpath, dirnames, filenames in os.walk(root):
            dirnames[:] = [d for d in dirnames if d not in SKIP_DIRS]
            for filename in filenames:
                if ext_pat.search(filename) or name_pat.match(filename):
                    hits.append(rel(root, os.path.join(dirpath, filename)))
    if hits:
        res.add("S4", "S4/G25/12-9", "백업·임시·DB덤프 파일 잔존", "WARN",
                "정황: " + "; ".join(sorted(hits)[:8]) +
                " → 배포 트리에서 제거 + .gitignore 등록(민감 데이터 유출 위험)")
    else:
        res.add("S4", "S4/G25/12-9", "백업·임시·DB덤프 파일 잔존", "PASS",
                "백업/임시/덤프 파일 정황 없음")


def check_compose_infra(files_texts, res):
    # S11 (checklist 14-1·14-3): docker-compose publishing a DB port to the host,
    # or running a container as root. A bind to 127.0.0.1/localhost (e.g.
    # "127.0.0.1:5432:5432") is loopback-only and safe → not flagged.
    db_map = re.compile(
        r"(?:(?P<ip>[\d.]+|localhost):)?\d{2,5}:"
        r"(?:3306|5432|27017|6379|1433|5984|9200|9042)\b")
    root_user = re.compile(r"""\buser\s*:\s*["']?root(?::|["']|\s|$)""", re.IGNORECASE)
    hits = []
    for relpath, txt in files_texts:
        if not relpath.endswith((".yml", ".yaml")):
            continue
        for i, ln in enumerate(txt.splitlines(), 1):
            s = ln.strip()
            if s.startswith("#"):
                continue
            m = db_map.search(ln)
            if m and (m.group("ip") or "") not in ("127.0.0.1", "localhost", "::1"):
                hits.append(f"{relpath}:L{i} DB포트 노출({s[:40]})")
            if root_user.search(ln):
                hits.append(f"{relpath}:L{i} 컨테이너 root 실행")
    if hits:
        res.add("S11", "S11/G28/14-1", "DB포트 노출·컨테이너 root", "WARN",
                "정황: " + "; ".join(hits[:6]) +
                " → DB포트는 내부망만 개방, 컨테이너는 non-root(14-3)")
    else:
        res.add("S11", "S11/G28/14-1", "DB포트 노출·컨테이너 root", "PASS",
                "docker-compose DB포트 노출/root 실행 정황 없음")


def check_state_and_validate(files_texts, res):
    has_state = bool(_grep(files_texts, r"\bstate\b") and
                     _grep(files_texts, r"callback"))
    has_validate = bool(_grep(files_texts, r"v1_0/validate|/validate"))
    if has_state and has_validate:
        # Presence heuristic satisfied — quiet the noise on correct code. The
        # *behavior* (state actually verified, validate actually fail-closed)
        # is still an AI verdict at D1/D3 (Area 2), so PASS here ≠ D1/D3 done.
        res.add("D1D3", "D1/D3", "state·validate 정황(휴리스틱)", "PASS",
                "state·validate 호출 정황 있음 (CSRF 검증·fail-closed 동작은 D1/D3로 AI가 최종 확정)")
    else:
        miss = []
        if not has_state:
            miss.append("state 처리")
        if not has_validate:
            miss.append("validate 재검증")
        res.add("D1D3", "D1/D3", "state·validate 정황(휴리스틱)", "WARN",
                "·".join(miss) + " 정황 없음 → D1(CSRF)/D3(fail-closed) 누락 의심, AI가 코드로 확정")


def detect_managed_backend(files_texts):
    found = set()
    for _, txt in files_texts:
        low = txt.lower()
        if ("supabase" in low or "supabase_url" in low
                or "@supabase" in low or "createclient(" in low):
            found.add("supabase")
        if "firebase" in low or "firestore" in low or "firebaseconfig" in low:
            found.add("firebase")
    return found


def check_supabase_rls(res, url, key, table, backends):
    if not (url and key and table):
        if "supabase" in backends:
            res.add("VC4", "VC4/G7", "anon 키 무단 조회(RLS) 실측", "NEEDINPUT",
                    "코드에서 Supabase 사용 감지 → RLS 실측 필수(미제공이면 '적합'이 아님). "
                    "Supabase 대시보드 → Project Settings → API에서 'Project URL'과 'anon public' 키를 복사하고, "
                    "점검할 테이블명과 함께 --supabase-url/--supabase-key/--supabase-table 로 재실행. "
                    "(anon 키는 공개키라 넣어도 안전)")
        elif "firebase" in backends:
            res.add("VC4", "VC4/G7", "Firebase 보안 규칙 잠금", "NEEDINPUT",
                    "코드에서 Firebase 사용 감지 → 스캐너가 규칙을 직접 못 읽는다. Firebase 콘솔 → "
                    "Firestore/Realtime Database → Rules 탭 내용을 복사해 AI에게 붙여넣어 "
                    "`allow read/write: if true`·`.read:true`가 없고 auth+소유자/역할로 잠겼는지 판정받으라.")
        else:
            res.add("VC4", "VC4/G7", "anon 키 무단 조회(RLS) 실측", "SKIP",
                    "관리형 백엔드(Supabase/Firebase) 사용 정황 없음 → 미해당(쓰는데 인자 미제공이면 --supabase-* 지정)")
        return
    probe = url.rstrip("/") + f"/rest/v1/{table}?select=*&limit=1"
    req = urllib.request.Request(probe, headers={
        "apikey": key, "Authorization": "Bearer " + key,
        "User-Agent": "zion-scan/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=8) as resp:
            body = resp.read(4096).decode("utf-8", "ignore")
            status = resp.status
    except urllib.error.HTTPError as e:
        status, body = e.code, ""
    except Exception as e:  # noqa
        res.add("VC4", "VC4/G7", "anon 키 무단 조회(RLS) 실측", "WARN",
                f"프로브 실패: {mask(str(e),20)}")
        return
    if status == 200 and body.strip() not in ("[]", ""):
        res.add("VC4", "VC4/G7", "anon 키 무단 조회(RLS) 실측", "FAIL",
                f"세션 없는 anon 요청이 행 반환(status 200) → RLS 열림(치명). 표={table}")
    elif status == 200:
        res.add("VC4", "VC4/G7", "anon 키 무단 조회(RLS) 실측", "PASS",
                f"anon 요청 200이나 빈 결과(정책 차단). 표={table}")
    else:
        res.add("VC4", "VC4/G7", "anon 키 무단 조회(RLS) 실측", "PASS",
                f"anon 요청 status {status}(비인증 거부). 표={table}")


def command_evidence(out):
    evidence = (out.stdout or out.stderr or "").strip()
    if not evidence or evidence in ("undefined", "null"):
        return f"종료 코드 {out.returncode}, 해석 가능한 출력 없음"
    return evidence[-500:].strip()


def npm_audit_evidence(out):
    try:
        payload = json.loads(out.stdout or "")
    except (TypeError, ValueError):
        return command_evidence(out)

    vulnerabilities = payload.get("vulnerabilities")
    if not isinstance(vulnerabilities, dict):
        return command_evidence(out)
    if not vulnerabilities:
        return "공개 취약점 0건"

    metadata = payload.get("metadata", {}).get("vulnerabilities", {})
    total = metadata.get("total", len(vulnerabilities))
    severity_counts = [
        f"{severity} {metadata.get(severity, 0)}"
        for severity in ("critical", "high", "moderate", "low")
        if metadata.get(severity, 0)
    ]
    summaries = []
    for name in sorted(vulnerabilities):
        vulnerability = vulnerabilities[name]
        severity = vulnerability.get("severity", "unknown")
        direct = "직접" if vulnerability.get("isDirect") else "간접"
        fix_available = vulnerability.get("fixAvailable")
        if fix_available is True:
            fix = "수정 가능"
        elif isinstance(fix_available, dict):
            version = fix_available.get("version")
            fix = (
                f"npm 제안 {version}, 별도 검증 필요"
                if version
                else "npm 수정 제안 있음, 별도 검증 필요"
            )
        else:
            fix = "자동 수정 없음"
        summaries.append(f"{name}({severity}, {direct}, {fix})")

    count_text = ", ".join(severity_counts) or "심각도 집계 없음"
    return f"공개 취약점 {total}건({count_text}): " + "; ".join(summaries)


def check_dependency_audit(root, res, dependency_roots=None):
    roots = dependency_roots or [root]
    results = []

    for dependency_root in roots:
        label = rel(root, dependency_root) or "."
        requirements = os.path.join(dependency_root, "requirements.txt")
        package_json = os.path.join(dependency_root, "package.json")

        if os.path.isfile(requirements):
            if not shutil.which("pip-audit"):
                results.append((
                    "SKIP",
                    f"{label}: pip-audit 미설치 → `pip install pip-audit && pip-audit -r requirements.txt`",
                ))
                continue
            try:
                out = subprocess.run(
                    ["pip-audit", "-r", requirements],
                    capture_output=True,
                    text=True,
                    timeout=120,
                )
                results.append((
                    "PASS" if out.returncode == 0 else "FAIL",
                    f"{label}: {command_evidence(out)}",
                ))
            except Exception as exc:  # noqa
                results.append(("WARN", f"{label}: 실행 실패: {mask(str(exc),20)}"))
            continue

        if os.path.isfile(package_json):
            if not shutil.which("npm"):
                results.append(("SKIP", f"{label}: npm 미설치 → `npm audit`"))
                continue
            try:
                out = subprocess.run(
                    ["npm", "audit", "--omit=dev", "--json"],
                    cwd=dependency_root,
                    capture_output=True,
                    text=True,
                    timeout=180,
                )
                results.append((
                    "PASS" if out.returncode == 0 else "WARN",
                    f"{label}: {npm_audit_evidence(out)}",
                ))
            except Exception as exc:  # noqa
                results.append(("WARN", f"{label}: 실행 실패: {mask(str(exc),20)}"))
            continue

        results.append((
            "SKIP",
            f"{label}: requirements.txt/package.json 없음 → 스택에 맞는 감사 도구 필요",
        ))

    statuses = {status for status, _ in results}
    if "FAIL" in statuses:
        status = "FAIL"
    elif "WARN" in statuses:
        status = "WARN"
    elif statuses == {"PASS"}:
        status = "PASS"
    else:
        status = "SKIP"

    res.add(
        "VC14",
        "VC14/D10",
        "의존성 취약점 감사",
        status,
        " | ".join(evidence for _, evidence in results)[:1500],
    )


# ── Code fingerprint (for HQ reproduction/verification) ───────
def code_fingerprint(root, files_texts):
    digest = hashlib.sha256()
    for relpath, txt in sorted(files_texts, key=lambda x: x[0]):
        h = hashlib.sha256(txt.encode("utf-8", "ignore")).hexdigest()
        digest.update((relpath + ":" + h + "\n").encode("utf-8"))
    return digest.hexdigest()


def build_report(root, res, meta):
    ts = meta["scanned_at"]
    fp = meta["code_fingerprint"]
    commit = meta["git_commit"]
    counts = res.counts()
    report_id = hashlib.sha256((fp + ts).encode("utf-8")).hexdigest()[:16]

    md = []
    md.append(f"# 자동 보안 스캔 리포트 (04 단계) — report_id `{report_id}`")
    md.append("")
    md.append(f"- 스캐너 버전: `{SCANNER_VERSION}`")
    md.append(f"- 스캔 시각(UTC): `{ts}`")
    md.append(f"- git commit: `{commit}`")
    file_selection = (
        "git-tracked+untracked"
        if meta["tracked_only"] and meta["include_untracked"]
        else "git-tracked"
        if meta["tracked_only"]
        else "filesystem"
    )
    md.append(f"- 파일 선택 방식: `{file_selection}`")
    md.append(f"- 스캔 파일 수: `{meta['file_count']}`")
    md.append(f"- **코드 지문(SHA-256): `{fp}`**")
    md.append(f"- **스캔 파일 목록 지문(SHA-256): `{meta['manifest_sha256']}`**  "
              f"(무엇을 스캔했는지까지 고정 — 파일 은닉 방지)")
    md.append(f"- 집계: PASS {counts['PASS']} · **FAIL {counts['FAIL']}** · "
              f"**NEEDINPUT(추가확인필요) {counts['NEEDINPUT']}** · "
              f"WARN {counts['WARN']} · SKIP {counts['SKIP']}")
    md.append("")
    md.append("> 이 리포트는 **기계가 확인 가능한 항목만** 판정한다. "
              "WARN/SKIP과 권한·감사·IDOR 등 코드 이해가 필요한 항목은 04 본문 기준으로 AI가 최종 판정한다. "
              "**NEEDINPUT은 관리형 백엔드(예: Supabase RLS) 실측에 필요한 값이 없어 판정 못 한 항목**으로, "
              "'적합'이 아니라 값을 받아 재실행해야 하는 '추가확인필요'다. "
              "이 리포트는 **바이브코더가 직접 실행해 총회에 결과만 제출**하는 자기완결 산출물이다 — "
              "코드 지문·파일목록 지문이 위변조 방지 표지이며, 총회는 이 리포트만으로 검사한다.")
    md.append("")
    md.append("| 판정 | ID | VC/시온 | 검사 | 근거(마스킹) |")
    md.append("|------|----|---------|------|--------------|")
    order = {"FAIL": 0, "NEEDINPUT": 1, "WARN": 2, "SKIP": 3, "PASS": 4}
    for f in sorted(res.findings, key=lambda x: order.get(x["status"], 9)):
        ev = f["evidence"].replace("|", "\\|")
        md.append(f"| {f['status']} | {f['id']} | {f['vc']} | {f['name']} | {ev} |")
    md.append("")
    md.append("## 스캔 파일 목록(지문 대상)")
    md.append(f"제외 디렉터리: `{', '.join(meta['excluded_dirs'])}`")
    if meta["excluded_paths"]:
        md.append(f"추가 제외 경로: `{', '.join(meta['excluded_paths'])}`")
    md.append(f"의존성 감사 루트: `{', '.join(meta['dependency_roots'])}`")
    if meta["file_count"] <= 40:
        for p in meta["manifest"]:
            md.append(f"- `{p}`")
    else:
        md.append(f"- 총 {meta['file_count']}개 — 전체 목록은 "
                  "`security_scan_report.json`의 `scanned_files` 참조.")
    md.append("")
    md.append("## 총회 검증(결과만 제출)")
    md.append("바이브코더가 이 스캐너를 **직접 실행**해 산출한 이 리포트(코드 지문·파일목록 지문 포함)를 "
              "총회에 **결과만 제출**한다. 총회는 레포 전체를 받을 필요 없이 이 리포트로 검사한다: "
              "**FAIL·NEEDINPUT이 0이어야 하며**, 지문이 보고서 본문과 일치해야 한다. "
              "(선택적 표본 감사 — 총회가 특정 시스템에 한해 레포 읽기 권한을 요청하면, 같은 커밋에서 "
              "재실행해 두 지문이 일치하는지로 위변조 없음을 확인할 수 있다.)")

    js = {
        "report_id": report_id,
        "scanner_version": SCANNER_VERSION,
        "scanned_at_utc": ts,
        "git_commit": commit,
        "file_selection": file_selection,
        "file_count": meta["file_count"],
        "code_fingerprint_sha256": fp,
        "file_manifest_sha256": meta["manifest_sha256"],
        "excluded_dirs": meta["excluded_dirs"],
        "excluded_paths": meta["excluded_paths"],
        "dependency_roots": meta["dependency_roots"],
        "scanned_files": meta["manifest"],
        "counts": counts,
        "findings": res.findings,
    }
    return "\n".join(md), js


SUBMISSION_EVIDENCE_FIELDS = (
    ("report_id", False),
    ("code_fingerprint_sha256", True),
    ("file_manifest_sha256", True),
    ("git_commit", True),
)


def missing_submission_evidence(content, scanner_report):
    normalized_content = content.lower()
    missing = []
    for field, case_insensitive in SUBMISSION_EVIDENCE_FIELDS:
        value = scanner_report.get(field)
        if not isinstance(value, str) or not value.strip():
            raise ValueError(f"security_scan_report.json 필수 값 누락: {field}")
        value = value.strip()
        found = (
            value.lower() in normalized_content
            if case_insensitive
            else value in content
        )
        if not found:
            missing.append(field)
    return missing


def verify_submission_report(report_path, scanner_json_path="", scanner_markdown_path=""):
    report_path = os.path.abspath(report_path)
    report_dir = os.path.dirname(report_path)
    scanner_json_path = os.path.abspath(
        scanner_json_path or os.path.join(report_dir, "security_scan_report.json")
    )
    scanner_markdown_path = os.path.abspath(
        scanner_markdown_path or os.path.join(report_dir, "security_scan_report.md")
    )

    required_paths = (
        ("보안점검 결과 보고서", report_path),
        ("자동 스캐너 JSON", scanner_json_path),
        ("자동 스캐너 Markdown", scanner_markdown_path),
    )
    for label, path in required_paths:
        if not os.path.isfile(path):
            print(f"[ERROR] {label} 파일 없음: {path}", file=sys.stderr)
            return 2

    try:
        with open(scanner_json_path, "r", encoding="utf-8") as f:
            scanner_report = json.load(f)
        if not isinstance(scanner_report, dict):
            raise ValueError("security_scan_report.json 최상위 값은 객체여야 합니다.")
        with open(scanner_markdown_path, "r", encoding="utf-8") as f:
            scanner_markdown = f.read()
        with open(report_path, "r", encoding="utf-8") as f:
            security_report = f.read()

        scanner_markdown_missing = missing_submission_evidence(
            scanner_markdown,
            scanner_report,
        )
        security_report_missing = missing_submission_evidence(
            security_report,
            scanner_report,
        )
    except (OSError, UnicodeError, json.JSONDecodeError, ValueError) as exc:
        print(f"[ERROR] 제출 파일 검증 실패: {exc}", file=sys.stderr)
        return 2

    if scanner_markdown_missing:
        print(
            "[ERROR] 자동 스캐너 Markdown과 JSON 불일치: "
            + ", ".join(scanner_markdown_missing),
            file=sys.stderr,
        )
    if security_report_missing:
        print(
            "[ERROR] 보안점검 결과 보고서와 자동 스캐너 JSON 불일치: "
            + ", ".join(security_report_missing),
            file=sys.stderr,
        )
    if scanner_markdown_missing or security_report_missing:
        print(
            "[ERROR] 최종 스캐너 실행 결과로 보고서를 다시 작성한 뒤 동일한 세 파일을 제출하세요.",
            file=sys.stderr,
        )
        return 2

    print(
        "[security_scan] submission report verification passed: "
        f"report_id={scanner_report['report_id']}"
    )
    return 0


def main():
    ap = argparse.ArgumentParser(description="시온로그인 배포전 자동 보안 스캐너")
    ap.add_argument("--root", default=".", help="프로젝트 루트")
    ap.add_argument("--deploy-url", default="", help="배포 URL(정적 /.git/config 노출 실측)")
    ap.add_argument("--supabase-url", default="", help="Supabase URL(RLS 무단조회 실측)")
    ap.add_argument("--supabase-key", default="", help="Supabase anon key(공개키)")
    ap.add_argument("--supabase-table", default="", help="RLS 실측 대상 테이블")
    ap.add_argument("--out-dir", default="", help="리포트 저장 폴더(기본: 루트)")
    ap.add_argument("--scanned-at", default="", help="스캔 시각 override(UTC ISO). 미지정 시 현재시각")
    ap.add_argument(
        "--verify-report",
        default="",
        help="제출 전 보안점검 결과 보고서 경로(같은 폴더의 스캐너 MD/JSON과 대조)",
    )
    ap.add_argument(
        "--scanner-json",
        default="",
        help="--verify-report에서 사용할 security_scan_report.json 경로",
    )
    ap.add_argument(
        "--scanner-markdown",
        default="",
        help="--verify-report에서 사용할 security_scan_report.md 경로",
    )
    ap.add_argument(
        "--tracked-only",
        action="store_true",
        help="Git 추적 파일만 스캔(무시 파일과 로컬 산출물 제외)",
    )
    ap.add_argument(
        "--include-untracked",
        action="store_true",
        help="--tracked-only 사용 시 Git이 무시하지 않는 미추적 파일도 포함",
    )
    ap.add_argument(
        "--exclude-path",
        action="append",
        default=[],
        help="스캔에서 제외할 프로젝트 상대 경로(반복 지정 가능)",
    )
    ap.add_argument(
        "--dependency-root",
        action="append",
        default=[],
        help="의존성 감사를 실행할 루트 기준 상대 경로(반복 지정 가능, 기본 '.')",
    )
    args = ap.parse_args()

    if args.verify_report:
        return verify_submission_report(
            args.verify_report,
            args.scanner_json,
            args.scanner_markdown,
        )

    root = os.path.abspath(args.root)
    if not os.path.isdir(root):
        print(f"[ERROR] --root 경로 없음: {root}", file=sys.stderr)
        return 2

    excluded_paths = tuple(
        normalize_relpath(path) for path in args.exclude_path if normalize_relpath(path)
    )
    try:
        project_files = collect_project_files(
            root,
            tracked_only=args.tracked_only,
            include_untracked=args.include_untracked,
            excluded_paths=excluded_paths,
        )
    except RuntimeError as exc:
        print(f"[ERROR] 스캔 파일 목록 생성 실패: {exc}", file=sys.stderr)
        return 2

    dependency_root_args = args.dependency_root or ["."]
    dependency_roots = []
    for dependency_root_arg in dependency_root_args:
        dependency_root = (
            os.path.abspath(dependency_root_arg)
            if os.path.isabs(dependency_root_arg)
            else os.path.abspath(os.path.join(root, dependency_root_arg))
        )
        if not os.path.isdir(dependency_root):
            print(f"[ERROR] --dependency-root 경로 없음: {dependency_root}", file=sys.stderr)
            return 2
        if dependency_root not in dependency_roots:
            dependency_roots.append(dependency_root)

    files_texts = [
        (rel(root, fp), read_text(fp))
        for fp in iter_source_files(root, project_files)
    ]
    res = Result()

    # Static / network checks
    check_repo_visibility(root, res)
    check_git_config_exposure(root, res, args.deploy_url)
    check_gitignore_env(root, res, project_files)
    check_env_example(root, res, project_files)
    check_hardcoded_secrets(files_texts, res)
    check_jwt_secret(files_texts, res)
    check_oauth_path(files_texts, res)
    check_userinfo_version(files_texts, res)
    check_member_ceiling(files_texts, res)
    check_xss_sinks(files_texts, res)
    check_sql_string_build(files_texts, res)
    check_service_role_client(files_texts, res)
    check_debug_mode(files_texts, res)
    check_weak_hash(files_texts, res)
    check_dir_listing(files_texts, res)
    check_config_secrets(files_texts, res)
    check_stray_files(root, res, project_files)
    check_compose_infra(files_texts, res)
    check_state_and_validate(files_texts, res)
    backends = detect_managed_backend(files_texts)
    check_supabase_rls(res, args.supabase_url, args.supabase_key,
                       args.supabase_table, backends)
    check_dependency_audit(root, res, dependency_roots)

    ts = args.scanned_at or datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    manifest = sorted(relpath for relpath, _ in files_texts)
    manifest_hash = hashlib.sha256("\n".join(manifest).encode("utf-8")).hexdigest()
    meta = {
        "scanned_at": ts,
        "git_commit": git_head(root),
        "code_fingerprint": code_fingerprint(root, files_texts),
        "file_count": len(files_texts),
        "manifest": manifest,
        "manifest_sha256": manifest_hash,
        "excluded_dirs": sorted(SKIP_DIRS),
        "excluded_paths": list(excluded_paths),
        "tracked_only": args.tracked_only,
        "include_untracked": args.include_untracked,
        "dependency_roots": [rel(root, path) or "." for path in dependency_roots],
    }
    md, js = build_report(root, res, meta)

    out_dir = os.path.abspath(args.out_dir) if args.out_dir else root
    os.makedirs(out_dir, exist_ok=True)
    md_path = os.path.join(out_dir, "security_scan_report.md")
    js_path = os.path.join(out_dir, "security_scan_report.json")
    with open(md_path, "w", encoding="utf-8") as f:
        f.write(md + "\n")
    with open(js_path, "w", encoding="utf-8") as f:
        json.dump(js, f, ensure_ascii=False, indent=2)

    counts = res.counts()
    print(f"[security_scan] report_id={js['report_id']} "
          f"PASS={counts['PASS']} FAIL={counts['FAIL']} "
          f"NEEDINPUT={counts['NEEDINPUT']} WARN={counts['WARN']} SKIP={counts['SKIP']}")
    print(f"[security_scan] wrote: {md_path}")
    print(f"[security_scan] wrote: {js_path}")
    return 1 if (counts["FAIL"] > 0 or counts["NEEDINPUT"] > 0) else 0


if __name__ == "__main__":
    sys.exit(main())