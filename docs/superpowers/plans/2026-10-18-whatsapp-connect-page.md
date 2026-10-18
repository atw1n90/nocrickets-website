# WhatsApp Connect Page Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add private English and Spanish NoCrickets pages that launch Meta Embedded Signup, reconcile the authorization code with session events, and send one safe payload to n8n.

**Architecture:** Create directory-based static routes at `/connect/` and `/es/connect/` so the existing Nginx configuration serves them without modification. Each page contains localized HTML, existing brand styles, and its own inline Meta integration; a Node test executes the real inline scripts in an isolated browser-like environment.

**Tech Stack:** Static HTML/CSS/JavaScript, Facebook JavaScript SDK v26.0, Node.js built-in test runner.

**Spec:** `C:/Users/alang/.codex/attachments/15efa5f3-60a8-4559-8d8a-40dbc68bf4dd/Pasted text.txt`

## Global Constraints

- Work only on branch `connect-page`; do not merge, push, or deploy.
- Leave existing pages, navigation, footer links, sitemap, and `robots.txt` untouched.
- Include `<meta name="robots" content="noindex, nofollow">` on both pages.
- Use no external libraries other than the supplied Facebook SDK.
- Never include an app secret or access token.
- Keep all visible copy localized, with natural Spanish using `tú`.
- Reuse NoCrickets fonts, colors, favicon, header, and footer styling.

## Review Focus

- Reject origins that merely contain or end visually like `facebook.com` but are not that hostname or a subdomain.
- Ignore malformed and unrelated window messages without changing the UI or sending data.
- Send exactly once when code and session data arrive in either order.
- Send code with null session fields after the 30-second wait.
- Re-enable the button on cancellation, Meta errors, network errors, and non-2xx responses.

---

### Task 1: Executable Meta Flow Contract

**Files:**
- Create: `tests/connect-page.test.js`
- Create: `website/connect/index.html`
- Create: `website/es/connect/index.html`

**Interfaces:**
- Consumes: The exact Meta App ID, Config ID, event names, endpoint, payload fields, and localized copy from the approved spec.
- Produces: Two static pages whose inline scripts register the Meta listener before user interaction and expose behavior only through the DOM, Facebook callback, timers, and fetch request.

- [ ] **Step 1: Write failing behavior tests**

Cover valid `FINISH`, valid `FINISH_WHATSAPP_BUSINESS_APP_ONBOARDING`, both arrival orders, timeout fallback, cancellation, Meta error, invalid JSON, wrong origin, missing callback code, non-2xx response, network failure, duplicate events, localized SDK URL, noindex, and language links.

- [ ] **Step 2: Run the tests and verify RED**

Run: bundled Node executable with `--test tests/connect-page.test.js`

Expected: FAIL because the two page files and their behavior do not exist.

- [ ] **Step 3: Implement the English and Spanish pages**

Use the existing brand tokens and a compact mobile-first connection panel. Parse `event.origin` with `new URL`, accept only `facebook.com` or `.facebook.com` subdomains, parse event data inside `try/catch`, and send one normalized payload after both inputs or the 30-second fallback.

- [ ] **Step 4: Run the behavior tests and verify GREEN**

Run: bundled Node executable with `--test tests/connect-page.test.js`

Expected: all tests pass with no warnings.

### Task 2: Browser and Repository Verification

**Files:**
- Modify: `tasks/todo.md`
- Modify: `tasks/progress.md`

**Interfaces:**
- Consumes: The pages and tests from Task 1.
- Produces: Desktop/mobile visual evidence, console verification, and a branch diff limited to this task.

- [ ] **Step 1: Serve the monorepo root locally and open both routes**

Verify `/website/connect/` and `/website/es/connect/` at desktop and mobile widths. Expected Meta localhost/domain warnings may be noted; application JavaScript errors are not allowed.

- [ ] **Step 2: Verify repository boundaries**

Confirm neither route appears in existing navigation, footer, sitemap, or `robots.txt`; confirm no secrets, placeholders, TODOs, or mojibake; run `git diff --check`.

- [ ] **Step 3: Request whole-branch review and address important findings**

Review the complete branch diff against the approved spec and re-run the full test suite after any fix.

- [ ] **Step 4: Commit the verified task branch**

Commit only task files on `connect-page`. Do not push, merge, or deploy.
