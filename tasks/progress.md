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

## 2026-07-26 Legal Hardening

- Created branch `nocrickets-legal-hardening-2026` from the merged website `main`.
- Updated English and Spanish legal pages to use Caelum Group Ventures contact details: `admin@caelumgroupventures.com` and `940-308-0607`.
- Added stronger NoCrickets restrictions for medical, legal, financial, insurance, emergency, crisis-response, regulated, and high-risk use cases.
- Added client responsibility language for customer consent, privacy compliance, accurate business settings, chatbot configuration, escalation instructions, and review of AI outputs.
- Added privacy/terms improvements covering AI-output limits, service providers, retention/export before cancellation, U.S. privacy rights, indemnification, and electronic communications.
- Corrected stale legal-page pricing so Growth is `$150/month` and the white-label add-on is `+$25/month`.

## 2026-07-26 Audit Fixes

- Fixed the audit's live-site contact mismatch by replacing the stale NoCrickets contact email with `admin@caelumgroupventures.com` across current homepage/pricing bundles and legacy pages.
- Cleaned stale legacy phone/pricing references to `940-308-0607`, Growth `$150`, and white-label `+$25`.
- Added `robots.txt` to disallow `/legacy/` and point crawlers to `sitemap.xml`.
- Added `sitemap.xml` for EN and ES homepage, pricing, privacy, and terms pages.
- Added `_headers` with baseline static security headers and `X-Robots-Tag` for `/legacy/*`.
- Marked preserved legacy HTML as `noindex, nofollow, noarchive` and added `legacy/README.md` to prevent accidental reuse as current content.

## 2026-07-26 Brand Kit and Favicon

- Created branch `brand-assets-favicon-2026`.
- Added the uploaded favicon set under `favicons/` and the uploaded brand kit under `brand-kit/`.
- Refreshed root `favicon.png` and `favicon.ico` fallbacks from the new favicon artwork.
- Updated current English and Spanish homepage, pricing, privacy policy, and terms pages to point at the new favicon files.
- Local static smoke check passed for all current public pages, root favicon fallbacks, favicon variants, and brand SVG files.
- Cleaned public page titles to use plain ASCII hyphens so browser tabs do not show garbled dash characters.

## 2026-07-27 Repo Merge

- Created local-only branch `merge-repos` from current `origin/main`.
- Moved website files into `/website` and added `/shared/.gitkeep`.
- Fetched the existing local `nocrickets-onboarding` clone as the onboarding remote after GitHub HTTPS auth blocked direct fetch.
- Preserved onboarding history by moving onboarding files into `/onboarding` on a temporary local branch, then merging that branch with `--allow-unrelated-histories`.
- Left deploy configuration unchanged for later review.
- Identified shared candidates: Google font import, core color tokens, favicon/logo assets, and repeated brand styling.

## 2026-07-27 Shared Assets Follow-up

- Cherry-picked the character-encoding cleanup commit into `merge-repos`.
- Added `/shared/fonts.css` for the shared NoCrickets Google font import.
- Added `/shared/tokens.css` for shared accent, dark background, text, muted text, and border colors.
- Moved `/website/favicons` and `/website/brand-kit` into `/shared/favicons` and `/shared/brand-kit`.
- Updated website and onboarding pages to reference shared fonts, tokens, and favicon assets.
- Removed stale website-root favicon fallbacks after confirming no references remained.
- Local monorepo-root render check passed for website, website pricing/legal/ES, and onboarding EN/ES with no shared-asset 404s, no horizontal overflow, and no visible character junk.
- Deploy caveat: `/shared` works when served from the monorepo root or explicitly exposed by the web server; a static server rooted only at `/website` or `/onboarding` will not automatically serve sibling `/shared` files.

## 2026-09-03 P2 Live Verification

- Confirmed the merged monorepo is now on `main` in the `nocrickets-website` repo and local source is clean.
- Live website checks passed: `https://nocrickets.co/` returns `200`, and `https://nocrickets.co/shared/tokens.css` returns `200`.
- Live onboarding homepage returns `200`, and its HTML references `/shared/fonts.css`, `/shared/tokens.css`, and shared favicon files.
- Live onboarding shared assets still return `404` for `/shared/tokens.css`, `/shared/fonts.css`, and `/shared/favicons/favicon-48x48.png`.
- Plain-English finding: onboarding source is deployed, but the onboarding container is not exposing the sibling `/shared` folder. The likely fix is a Coolify setting/config update, not an HTML change.

## 2026-09-03 P2 Spanish Toggle Polish

- Confirmed current website pages already use compact `EN` / `ES` language buttons.
- Updated onboarding English and Spanish routes to use `EN` / `ES` instead of `English` / `Español`.
- Fixed the onboarding Spanish translation wiring for the social media field, including label, helper text, and placeholder examples.
- Added Spanish display text wiring for phone/email option labels plus order-intake and photo-handling labels that were still visible in English after switching to Spanish.
- Verification used a terminal-based DOM simulation because local browser `file://` rendering was blocked by browser security policy. The simulation confirmed the patched onboarding fields render Spanish text after `setLang('es')`.

## 2026-09-03 P2 Booking Preview Link

- Updated the onboarding booking preview block in both English and Spanish routes to show the correct preview URL: `https://booking.nocrickets.co/`.
- Made the preview URL clickable and opened in a new tab with `rel="noopener noreferrer"`.
- Added EN/ES helper copy explaining that the preview is for a beauty studio and that the user's booking page will be personalized to their business.
- Verified the generated preview HTML in English and Spanish with a terminal-based DOM simulation.
- Live URL check passed: `https://booking.nocrickets.co/` returns `200`.

## 2026-09-20 DBA Footer Line

- Added the approved footer/legal identity line to the current website and onboarding pages: `NoCrickets is a DBA of Caelum Group Ventures LLC · 5900 Balcones Drive STE 100, Austin, TX 78731`.
- Omitted the phone number from public footers on purpose to reduce unnecessary phone traffic; contact/legal pages can keep fuller contact details where needed.
- Verified each edited public page has exactly one DBA/address line and that the new footer line does not include `940-308-0607`.

## 2026-09-20 Demo Email And Onboarding Back Link

- Replaced the homepage demo timeline email `maria___@gmail.com` with `customer@example.com` on English and Spanish website pages.
- Added a sticky top-bar link from both onboarding routes back to `https://nocrickets.co/`.
- Kept the onboarding `EN` / `ES` language buttons in the same top bar.
- Verified the old demo email no longer appears in website/onboarding source except in this task record.

## 2026-09-21 WhatsApp Privacy Policy Coverage

- Added a WhatsApp/client-bot message subsection to the English and Spanish privacy policies.
- Covered WhatsApp message content, sender contact information, timestamps, lead details, booking requests, and related conversation metadata processed on behalf of client businesses.
- Stated the data is used only to operate the client's bot, respond to inquiries, capture leads, support bookings, provide notifications, troubleshoot, maintain security, and deliver the NoCrickets service.
- Included no-sale language, deletion-request routing, retention caveats, and sensitive/regulated-data limits.
