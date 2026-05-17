# corita-web

Static site for corita and its apps. Hosted on Vercel.

## Structure

```
/                       → corita.jp (landing)
/pictan                 → /pictan/index.html (English landing)
/pictan/ja              → /pictan/ja.html (Japanese landing)
/pictan/privacy         → English privacy policy
/pictan/privacy-ja      → Japanese privacy policy
/pictan/terms           → English terms
/pictan/terms-ja        → Japanese terms
/pictan/support         → English support
/pictan/support-ja      → Japanese support
```

`vercel.json` enables clean URLs (no `.html` extension in the address bar).

## Deploy

1. Push to GitHub.
2. Import the repo in Vercel.
3. Add `corita.jp` and `www.corita.jp` as production domains.
4. Update DNS at the registrar to point to Vercel.
