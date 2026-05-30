# pictan-web

Static sites for corita studio and its apps. Hosted on Vercel as **two separate projects** sharing this single repository.

## 🟢 Cross-session state (read this first)

pictan は Engineering / Marketing の **2 セッション並行運用**。横断的な状態の正本は **app リポの `STATE.md`** (`/Users/tatsuya/Corita/pictan/code/app/STATE.md`) にある。

Web 側の作業 (favicon 追加、HTML 修正、PostHog 仕込み、Vercel 設定変更等) でも、他セッションに影響する変更が発生したら **app リポの `STATE.md` に append** すること。本リポ単体での STATE は持たない (single source of truth)。

セッション役割と file ownership の詳細は app リポの `CLAUDE.md` 上部にあるセッション起動チェックリストを参照。

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

## Analytics

`pictan.corita.jp` is instrumented with **PostHog Web** (CDN snippet, no build step). All 8 HTML pages under `pictan/` include the init snippet in `<head>` and share the same PostHog project as the mobile app (key `phc_rWcrSJkdc...`), so LP → install funnels can be analyzed end-to-end. Each event is tagged with `source: 'web'` to keep web/app traffic filterable in the dashboard.

Tracked events today:
- Page views (automatic, `capture_pageview: true`)
- `cta_app_store_clicked` — every App Store CTA tap

Privacy: `localStorage` only (no cookies), no IP capture, no PII. PostHog usage is disclosed in `pictan/privacy.html` and `pictan/privacy-ja.html` along with the cross-border (US) data processing note.

`corita.jp` (root `index.html`) is **intentionally not instrumented** — it's a single-page studio landing with low traffic and no funnel role.

An attempt to add `@vercel/analytics` on 2026-05-30 was rolled back before any commit; PostHog covers web too.

## History

The old `/pictan/*` path scheme under `corita.jp` was retired on 2026-05-28 in favor of the `pictan.corita.jp` subdomain. The previous static site (English-only `/pictan/index.html` with policy/terms/support pages) lived at `web/pictan/` and was removed in the same cleanup. The new `pictan/` directory holds the scratch-built LP previously kept under `pictan-next/`. See `MIGRATION.md` for the original migration plan record.

Favicons (`favicon.svg` + `apple-touch-icon.png` for corita.jp, `favicon.png` + `apple-touch-icon.png` for pictan.corita.jp) were added on 2026-05-28. Source for the pictan favicons is `app/assets/images/icon.png` resized via `sips`. The corita.jp favicon is an inline-authored SVG rendered to PNG via `sharp` for the Apple touch icon.
