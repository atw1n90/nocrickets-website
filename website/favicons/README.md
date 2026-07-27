# NoCrickets favicons

Generated from the neon "nc" mark (Pacifico script, amber #FFB454 on midnight #0A0C18).

## Files
- favicon-16x16.png, favicon-32x32.png, favicon-48x48.png — browser tabs
- apple-touch-icon.png (180×180, square — iOS rounds it) — iPhone/iPad home screen
- favicon-192x192.png, favicon-512x512.png — Android / PWA manifest

## Head snippet (add to every page)
```html
<link rel="icon" type="image/png" sizes="16x16" href="/favicons/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicons/favicon-32x32.png">
<link rel="icon" type="image/png" sizes="48x48" href="/favicons/favicon-48x48.png">
<link rel="apple-touch-icon" href="/favicons/apple-touch-icon.png">
```

If a manifest.json exists, point its icons at favicon-192x192.png and favicon-512x512.png.
