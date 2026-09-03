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

## NoCrickets Brand Kit and Favicon

- [x] Create a clean branch from the current website repo state.
- [x] Extract the uploaded favicon and brand kit archives.
- [x] Save brand kit/logo/favicon assets into the repo without disturbing legal, ES, or legacy pages.
- [x] Update current EN/ES website pages to use the new favicon.
- [x] Verify page loads and favicon asset paths locally.
- [x] Commit, push branch, and prepare/open PR to `main`.

## NoCrickets Repo Merge 2026-07-27

- [x] Create local `merge-repos` branch without touching `main`.
- [x] Move current website repo files into `/website`.
- [x] Add empty `/onboarding` and `/shared` folders.
- [x] Fetch `atw1n90/nocrickets-onboarding` as a temporary remote.
- [x] Merge onboarding history with unrelated histories allowed.
- [x] Place onboarding files under `/onboarding`.
- [x] Review duplicated brand, CSS, font, logo, and color-token assets for future `/shared` cleanup.
- [x] Report local-only status and manual deploy/routing review items.

## NoCrickets Shared Assets Merge Follow-up 2026-07-27

- [x] Cherry-pick `cb0c54d` into `merge-repos` and keep cleaned character encoding.
- [x] Create `/shared/fonts.css` and `/shared/tokens.css`.
- [x] Move favicon and brand-kit assets from `/website` into `/shared`.
- [x] Update `/website` pages to reference shared fonts, tokens, and assets.
- [x] Update `/onboarding` pages to reference shared fonts, tokens, and assets.
- [x] Render-check `/website` and `/onboarding` from the monorepo root.
- [x] Report deploy path caveats before any push.

## NoCrickets P2 Live Shared Asset Verification 2026-09-03

- [x] Verify `https://nocrickets.co/` returns `200`.
- [x] Verify `https://nocrickets.co/shared/tokens.css` returns `200`.
- [x] Verify `https://onboarding.nocrickets.co/` returns `200`.
- [x] Confirm live onboarding HTML references `/shared/fonts.css`, `/shared/tokens.css`, and shared favicon paths.
- [x] Confirm `https://onboarding.nocrickets.co/shared/tokens.css`, `/shared/fonts.css`, and `/shared/favicons/favicon-48x48.png` still return `404`.
- [x] Update AGENTS.md with the current monorepo-on-main deployment decision and live onboarding shared-asset issue.

## NoCrickets P2 Spanish Toggle Polish 2026-09-03

- [x] Review current website and onboarding language-toggle behavior.
- [x] Confirm website pages already use `EN` / `ES` language buttons.
- [x] Change onboarding language buttons from `English` / `Español` to `EN` / `ES`.
- [x] Wire Spanish translation for onboarding social media label, hint, and placeholder.
- [x] Wire Spanish translation for remaining onboarding option labels that were still visible in English.
- [x] Verify Spanish language switch updates the patched onboarding text.
- [x] Surgically update AGENTS.md with the key translation finding.

## NoCrickets P2 Booking Preview Link 2026-09-03

- [x] Change onboarding booking preview display to `https://booking.nocrickets.co/`.
- [x] Make the preview URL clickable.
- [x] Add EN/ES note that the preview is for a beauty studio and will be personalized to the user's business.
- [x] Verify the preview text renders correctly in English and Spanish.
