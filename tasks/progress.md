# Progress

## 2026-07-26

- Started NoCrickets P1 redesign work in the GitHub repo clone.
- Created branch `redesign-2026` from `main`.
- Scope: replace root `index.html`, add root `pricing.html`, preserve existing integrations, and move old site files into `legacy/` without touching legal/hosting files.
- Preservation scan found no Google Apps Script webhook URLs, no form submission handlers, no analytics tags, no Search Console verification tags, and no hosting config files in the current site.
- Replaced the root homepage with the supplied redesign bundle, added the supplied pricing page, and kept root legal pages unchanged.
- Moved old root homepage and old Spanish folder into `legacy/`; kept existing public image assets at root and in `legacy/` to avoid breaking favicon/social/logo URLs.
- Browser smoke check passed locally for `/` and `/pricing.html`.
- Commit `3c78478` was pushed to branch `redesign-2026`. PR creation was attempted through the GitHub connector, but GitHub returned `403 Resource not accessible by integration`; local `gh` is not installed, so PR creation needs to be completed from GitHub's branch prompt.

## 2026-07-26 EN Legal Pages

- Created branch `en-legal-pages-2026` from `origin/main`.
- Used only the English legal files from the uploaded ZIP: `deploy/privacy-policy.html` and `deploy/terms-and-conditions.html`.
- Left uploaded homepage/pricing files unused because the live redesign files were already in place.
- Browser smoke check passed locally for `/privacy-policy.html` and `/terms-and-conditions.html`.
- Sensitive scan found no API keys, webhook URLs, analytics/GTM tags, Search Console verification snippets, or secret-like values in the legal pages.

## 2026-07-26 ES Redesign

- Created branch `es-redesign-2026` from the merged English redesign on `origin/main`.
- Added uploaded Spanish pages under `es/`: homepage, pricing, privacy policy, and terms.
- Kept root English pages and `legacy/` unchanged.
- Forced the ES homepage and pricing bundles to initialize in Spanish; the uploaded bundles contained Spanish copy but defaulted visible content to English.
- Browser smoke check passed locally for `/es/`, `/es/pricing.html`, `/es/privacy-policy.html`, and `/es/terms-and-conditions.html`.
- Sensitive scan found no API keys, webhook URLs, analytics/GTM tags, or Search Console verification snippets in the ES pages.
