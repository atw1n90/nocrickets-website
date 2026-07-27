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
