# NoCrickets P1 Redesign

- [x] Clone `atw1n90/nocrickets-website` and create `redesign-2026` from `main`.
- [x] Inspect current site for webhook, analytics, verification, form, and hosting snippets.
- [x] Extract attached redesign files and confirm `index.html` / `pricing.html`.
- [x] Move old site files into `legacy/` without deleting legal or hosting files.
- [x] Place redesigned `index.html` and `pricing.html` at repo root.
- [x] Re-inject preserved snippets carefully near the top of `<head>` / appropriate body location.
- [x] Validate links and static files.
- [x] Commit and push branch to GitHub.
- [ ] Open PR to `main` once GitHub PR-create permission is available.

## NoCrickets EN Legal Pages

- [x] Create `en-legal-pages-2026` from current `origin/main`.
- [x] Extract uploaded English legal files.
- [x] Replace only root `privacy-policy.html` and `terms-and-conditions.html`.
- [x] Preserve homepage, pricing, pending ES branch work, and `legacy/`.
- [x] Validate root legal pages render.
- [x] Commit, push branch, and open PR to `main`.

## NoCrickets ES Redesign

- [x] Create `es-redesign-2026` from current `origin/main`.
- [x] Extract uploaded ES redesign files.
- [x] Add Spanish homepage, pricing, privacy, and terms pages under `es/`.
- [x] Preserve existing root English pages and `legacy/`.
- [x] Validate `/es/` and `/es/pricing.html` render.
- [ ] Commit, push branch, and open PR to `main`.

## NoCrickets Legal Hardening

- [x] Create `nocrickets-legal-hardening-2026` from current `origin/main`.
- [x] Compare NoCrickets legal pages against the stronger Suvelo patterns.
- [x] Update English privacy policy and terms with Caelum contact details, regulated-use restrictions, AI-output cautions, data retention/export language, and client responsibility language.
- [x] Mirror the same updates into Spanish privacy policy and terms.
- [x] Correct stale legal-page pricing to match current public/onboarding prices.
- [x] Render-check all four legal pages.
- [ ] Commit, push branch, and open PR to `main`.

## NoCrickets Audit Fixes

- [x] Replace stale NoCrickets contact email references with `admin@caelumgroupventures.com` in current and legacy pages.
- [x] Replace stale legacy phone and pricing references with current Caelum phone/pricing.
- [x] Add `robots.txt` and `sitemap.xml`.
- [x] Add static security header guidance in `_headers`.
- [x] Mark legacy HTML files as `noindex`.
- [x] Render-check current public pages after fixes.
- [x] Commit and push PR update.
