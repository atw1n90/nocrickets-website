# NoCrickets Website Repo Notes

## 2026-07-27 Monorepo Merge Findings

- Repo structure change: `nocrickets-website` now contains `/website`, `/onboarding`, and `/shared` on branch `merge-repos`. `/shared` contains `fonts.css`, `tokens.css`, `favicons/`, and `brand-kit/`. The former separate `nocrickets-onboarding` repo was merged into this branch, but `merge-repos` was not yet pushed or merged to `main` as of 2026-07-27. Both site folders reference shared assets with root-relative paths such as `/shared/fonts.css`.
- Deploy dependency: both `/website` and `/onboarding` require the deployed server to expose `/shared` at the domain root. If `/shared` is not exposed, fonts, tokens, favicons, and shared brand assets will 404. The Coolify plan is documented in `coolify-deploy-config-notes.md`: Option A is root build context plus subfolder publish path; fallback is a custom Nginx alias or a build-step copy if Coolify only copies the publish folder into the final image.
- Deploy status: this monorepo setup has not been applied to live Coolify containers. Two containers exist, website and onboarding, currently pointed at the old separate repos. Before switching either container to `merge-repos` plus the new base directory, verify `/shared/fonts.css` and `/shared/tokens.css` return `200` using the verification URL list in `coolify-deploy-config-notes.md`.
- Rollout order to avoid downtime: push `merge-repos` to GitHub first and keep it off `main`. Update one container first, preferably onboarding because it is simpler, to point at `merge-repos` plus the `/onboarding` base/publish setup. Verify live. Then repeat for the website container. Only merge `merge-repos` into `main` after both containers are confirmed working.
- Also folded into this branch: the character-encoding/mojibake cleanup fix from commit `cb0c54d` was cherry-picked into `merge-repos`.

