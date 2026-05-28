# corita-web

Static sites for corita and its apps. Hosted on Vercel as **two separate projects** sharing this single repository.

## Structure

```
/                       → corita.jp (corita studio landing)
                        → Vercel project: corita-web (Root Directory: ./)

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
  vercel.json             cleanUrls + trailingSlash for the subproject
```

Each project's `vercel.json` enables clean URLs (no `.html` extension in the address bar).

## Deploy

The two Vercel projects auto-deploy from `main`:

- **corita-web**: Root Directory `./` — serves `corita.jp`
- **pictan-web**: Root Directory `pictan/` — serves `pictan.corita.jp`

DNS: `corita.jp` and `pictan` CNAME both point to Vercel via dnsv.jp.

## History

The old `/pictan/*` path scheme under `corita.jp` was retired on 2026-05-28 in favor of the `pictan.corita.jp` subdomain. The previous static site (English-only `/pictan/index.html` with policy/terms/support pages) lived at `web/pictan/` and was removed in the same cleanup. The new `pictan/` directory holds the scratch-built LP previously kept under `pictan-next/`. See `MIGRATION.md` for the original migration plan record.
