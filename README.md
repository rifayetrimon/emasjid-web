# CMS Display

A Next.js CMS display front-end that renders entirely from the external CMS
API. It is built as a **fully static export** (`output: 'export'`): `npm run
build` emits a plain `out/` directory of HTML/JS/CSS that you serve from any
static file host — **no Node server, no port for the app itself**. All content
and tenant configuration are fetched by the browser at runtime, so the
displayed site stays live and re-pointing a tenant needs no rebuild.

## Develop

```bash
npm install
npm run dev      # http://localhost:3000
```

## Build (static export)

```bash
npm run build    # copies configuration/config.json -> public/, then exports to out/
```

The output is in `out/`. Serve it with anything that serves static files:

```bash
npm run serve            # convenience: npx serve out
# or: any static host — nginx, Apache, Caddy, S3+CloudFront, GitHub Pages, a USB stick on a kiosk, etc.
```

There is no `npm start` / `next start` anymore — the app does not run a server.

## Tenant configuration — `config.json`

`configuration/config.json` is the **source** of the tenant bootstrap config
(which API to call, `sid`, the `x-encrypted-key`, etc.). On build it is copied
to `public/config.json` and ends up at **`out/config.json`**.

**To re-point a tenant without rebuilding:** edit `out/config.json` directly on
the deployed host. The browser fetches it (`cache: no-store`) on every load, so
the change takes effect on the next page refresh.

- `BASE_PATH` is the **one** value baked at build time (it is compiled into the
  client bundle and used as the Next.js `basePath`). Changing it requires a
  rebuild. Everything else (`NEXT_PUBLIC_API_URL`, `NEXT_PUBLIC_SID`,
  `NEXT_PUBLIC_X_ENCRYPTED_KEY`, domain, etc.) is read at runtime.

## Architecture notes (static model)

- **Data fetching is client-side.** Every page/template fetches from the
  external API in the browser via the `services/*` layer (`lib/myAxios.ts` +
  `lib/getConfig.ts`, both isomorphic). The shared loader is
  `lib/useCmsData.ts`.
- **No internal API routes.** The former `/api/gallery` and `/api/visitor-track`
  proxies were removed; the browser calls the external API directly.
- **Dynamic routes are query-param based** (static export cannot generate
  on-demand routes):
  - news article: `/news/detail/?id=<contentId>`
  - static CMS page: `/static/?slug=<staticId>`
  - maintenance design preview: `/maintenance-preview/view/?id=<designId>`

  `services/navService.ts` rewrites CMS menu links into these forms
  automatically.
- **Maintenance / Coming-soon / page title** are decided in the browser by
  `components/RuntimeGate.tsx` from the live CMS config (no server to decide
  per request). Build-time `<head>` metadata is a brand-neutral fallback.

## ⚠️ CORS requirement

Because the browser now calls `NEXT_PUBLIC_API_URL` (e.g.
`https://devapi02.awfatech.com`) **directly**, that API must return CORS headers
allowing the origin you serve the static site from (and allow the
`x-encrypted-key` request header). Without it, browser requests fail. This is a
server-side API/gateway configuration, not something this front-end can set.

> Note: in a static deployment the `x-encrypted-key` is delivered to the
> browser (via `config.json`). This is inherent to having no server — there is
> no place to hide it. The previous server-side proxy is gone.
