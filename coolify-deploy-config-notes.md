# Coolify Deploy Config Notes

Date: 2026-07-27  
Branch: `merge-repos`  
Goal: deploy `/website` and `/onboarding` as separate sites/subdomains while both can load shared files from `/shared`.

## Current Repo Layout

```text
/
  website/
    index.html
    pricing.html
    es/
    legacy/
    robots.txt
    sitemap.xml
    _headers
  onboarding/
    index.html
    es/
  shared/
    fonts.css
    tokens.css
    favicons/
    brand-kit/
```

The HTML now references shared files with root-relative URLs:

```text
/shared/fonts.css
/shared/tokens.css
/shared/favicons/...
/shared/brand-kit/...
```

That means the deployed web server must expose `/shared` at the domain root.

## Preferred Option A: Root Context + Subfolder Publish Path

Use this if Coolify lets you set the repository/build context separately from the public/publish directory.

### Website Container

Purpose: `https://nocrickets.co` serves `/website` as `/`, while `/shared/...` also works.

Recommended Coolify settings:

```text
Repository: atw1n90/nocrickets-website
Branch: merge-repos
Build Pack: Static
Build Context / Base Directory: /
Publish Directory / Public Directory: /website
Domain: https://nocrickets.co,https://www.nocrickets.co
Web Server: Nginx
```

Required root-level mapping:

```text
/          -> repo /website
/shared/*  -> repo /shared/*
```

If Coolify's Static site implementation copies only the publish directory into the final image, `/shared` will not be included. In that case, use the Nginx fallback below or a small Dockerfile/copy step.

### Onboarding Container

Purpose: `https://onboarding.nocrickets.co` serves `/onboarding` as `/`, while `/shared/...` also works.

Recommended Coolify settings:

```text
Repository: atw1n90/nocrickets-website
Branch: merge-repos
Build Pack: Static
Build Context / Base Directory: /
Publish Directory / Public Directory: /onboarding
Domain: https://onboarding.nocrickets.co
Web Server: Nginx
```

Required root-level mapping:

```text
/          -> repo /onboarding
/shared/*  -> repo /shared/*
```

Same caveat: if Coolify copies only `/onboarding` into the final image, sibling `/shared` files will not be available unless the server config or build step explicitly includes them.

## Fallback: Minimal Custom Nginx Alias

Use this if Coolify's Static site type only supports one Base Directory and does not let you expose sibling folders from the repo root.

Important assumption: the generated container/image must contain both the site folder and `/shared`. If Coolify builds from only `/website` or only `/onboarding`, Nginx cannot alias files that were never copied into the container.

### Website Nginx Config

Use this shape when the container has the full repo available at `/app` or similar. Adjust `/app` to the real path shown in the generated Coolify Nginx config.

```nginx
server {
    listen 80;
    server_name _;

    root /app/website;
    index index.html;

    location /shared/ {
        alias /app/shared/;
        try_files $uri =404;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

### Onboarding Nginx Config

Use this shape when the container has the full repo available at `/app` or similar. Adjust `/app` to the real path shown in the generated Coolify Nginx config.

```nginx
server {
    listen 80;
    server_name _;

    root /app/onboarding;
    index index.html;

    location /shared/ {
        alias /app/shared/;
        try_files $uri =404;
    }

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## If Coolify Only Copies the Publish Folder

If `/shared` is not present inside the final container, the lowest-risk fix is a tiny repo-level Dockerfile per site or a generated build step that copies both folders into one served directory.

Website output shape:

```text
served-root/
  index.html                 from /website
  pricing.html               from /website
  es/                        from /website/es
  legacy/                    from /website/legacy
  shared/                    from /shared
```

Onboarding output shape:

```text
served-root/
  index.html                 from /onboarding
  es/                        from /onboarding/es
  shared/                    from /shared
```

This duplicates shared assets into each final image at build time, but keeps one source of truth in Git.

## What Requires Rebuild/Redeploy

These require a rebuild/redeploy:

- Changing branch to `merge-repos`.
- Changing Build Context / Base Directory.
- Changing Publish Directory / Public Directory.
- Switching build pack type.
- Adding a Dockerfile/copy build step.
- Any Git changes under `/website`, `/onboarding`, or `/shared`.

These are usually settings/restart-level changes:

- Editing custom Nginx config after the image already contains the needed files.
- Updating domain list or www/non-www behavior.
- Updating proxy settings.

Coolify's own docs note that custom web-server config changes need a restart to take effect.

## Manual Verification After Applying

Check these URLs after deployment:

```text
https://nocrickets.co/
https://nocrickets.co/pricing.html
https://nocrickets.co/shared/fonts.css
https://nocrickets.co/shared/tokens.css
https://nocrickets.co/shared/favicons/favicon-48x48.png

https://onboarding.nocrickets.co/
https://onboarding.nocrickets.co/es/
https://onboarding.nocrickets.co/shared/fonts.css
https://onboarding.nocrickets.co/shared/tokens.css
https://onboarding.nocrickets.co/shared/favicons/favicon-48x48.png
```

Expected result:

- Site pages return `200`.
- Shared CSS and favicon URLs return `200`.
- Browser tab icon loads.
- No visible character junk.
- No mobile horizontal overflow.

## Current Recommendation

Start with Option A:

```text
Base Directory: /
Publish Directory: /website or /onboarding
```

Then immediately test `/shared/fonts.css` on each domain. If it 404s, Coolify is only copying the publish folder, so use the Nginx alias/custom Dockerfile fallback.

