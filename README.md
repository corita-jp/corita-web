# pictan-web

Static sites for corita studio and its apps. Hosted on Vercel as **two separate projects** sharing this single repository.

> **Repository name note**: this repo was previously named `corita-web` on GitHub. It was renamed to `pictan-web` on 2026-05-30 (the pictan site is the primary content; the corita.jp landing is a minimal stub). Old clone URLs at `github.com/corita-jp/corita-web` still redirect, but please use `github.com/corita-jp/pictan-web` going forward. Local clones should `git remote set-url origin https://github.com/corita-jp/pictan-web.git`.

## Structure

```
/                       → corita.jp (corita studio landing)
                        → Vercel project: corita-web (Root Directory: ./)
  index.html              Single-page studio landing
  favicon.svg             Black tile with white "c"
  apple-touch-icon.png    180×180 PNG rendered from favicon.svg (sharp)

pictan/                 → pictan.corita.jp (Pictan app site)
                        → Vercel project: pictan-web (Root Directory: pictan/)
  index.html              English LP (with first-visit ja auto-redirect)
  ja.html                 Japanese LP
  privacy[.html|-ja.html] Privacy policy (en / ja)
  terms[.html|-ja.html]   Terms of service (en / ja)
  support[.html|-ja.html] Support page (en / ja)
  app.js                  Demo phase machine, FAQ accordion, lang preference
  styles.css              Anthropic-derived design tokens
  assets/                 Screenshots, OG images
  favicon.png             32×32 PNG derived from the iOS app icon (sips)
  apple-touch-icon.png    180×180 PNG, same source
  vercel.json             cleanUrls + trailingSlash for the subproject
```

Each project's `vercel.json` enables clean URLs (no `.html` extension in the address bar).

## Deploy

The two Vercel projects auto-deploy from `main`:

- **corita-web**: Root Directory `./` — serves `corita.jp`
- **pictan-web**: Root Directory `pictan/` — serves `pictan.corita.jp`

DNS: `corita.jp` and `pictan` CNAME both point to Vercel via dnsv.jp.

## Tooling policy

This repository is intentionally a **static site** (HTML / CSS / inline JS only). Do **not** run `npm i` here — there is no Node project. `package.json`, `package-lock.json`, `yarn.lock`, `pnpm-lock.yaml`, and `node_modules/` are all `.gitignore`d at the root so they cannot accidentally be committed. If they ever reach the remote, Vercel will try to treat the site as a Node project and the build can fail in subtle ways.

## Analytics (planned)

Web analytics are **not yet instrumented**. PostHog Web (`posthog-js`) is the planned solution to unify with the mobile app's `posthog-react-native`. An attempt to add `@vercel/analytics` on 2026-05-30 was rolled back before any commit because PostHog will cover web traffic too. See the app repo's task tracker (#29) for the planned integration scope.

## History

The old `/pictan/*` path scheme under `corita.jp` was retired on 2026-05-28 in favor of the `pictan.corita.jp` subdomain. The previous static site (English-only `/pictan/index.html` with policy/terms/support pages) lived at `web/pictan/` and was removed in the same cleanup. The new `pictan/` directory holds the scratch-built LP previously kept under `pictan-next/`. See `MIGRATION.md` for the original migration plan record.

Favicons (`favicon.svg` + `apple-touch-icon.png` for corita.jp, `favicon.png` + `apple-touch-icon.png` for pictan.corita.jp) were added on 2026-05-28. Source for the pictan favicons is `app/assets/images/icon.png` resized via `sips`. The corita.jp favicon is an inline-authored SVG rendered to PNG via `sharp` for the Apple touch icon.
