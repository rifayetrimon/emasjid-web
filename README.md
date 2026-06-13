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
- **The browser calls the API same-origin (`/api/...`).** `lib/getConfig.ts`
  sets the axios baseURL to the page's own origin, so requests go to
  `/api/v2/...` on the same host the site is served from. A thin proxy in the
  serving layer forwards them to the real backend (see "CORS" below). This
  avoids the cross-origin CORS preflight the upstream gateway rejects.
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

## CORS — same-origin API proxy

The backend (e.g. `https://aws01.awfatech.com`, fronted by AWS API Gateway)
does **not** answer CORS preflights: requests carry a custom `x-encrypted-key`
header, which makes the browser send an `OPTIONS` preflight first, and the
gateway has no `OPTIONS` method — it returns 403, so the browser blocks the
real request (*"Response to preflight request doesn't pass access control
check: It does not have HTTP ok status"*). `devapi02` works only because it
happens to allow CORS; `aws01` does not.

Rather than depend on the backend, the browser only ever calls **its own
origin** (`/api/...`), which needs no preflight. The serving layer then
forwards those requests **server-to-server** to the real backend — and
server-to-server calls aren't subject to CORS at all:

- **Production (`Dockerfile` → nginx):** `nginx.conf` proxies `location /api/`
  to the upstream. The upstream host is read from `config.json`'s
  `NEXT_PUBLIC_API_URL` at container start by
  `scripts/docker/10-api-proxy-target.envsh` (override with the
  `API_PROXY_TARGET` env var). Changing the API host needs a container restart.
- **Local dev (`next dev`):** a dev-only `rewrites()` in `next.config.ts`
  proxies `/api/*` to the same `NEXT_PUBLIC_API_URL`. (Rewrites are ignored by
  the static export build, which is why nginx handles production.) Changing the
  host needs a dev-server restart.

So `NEXT_PUBLIC_API_URL` in `config.json` still selects which backend is used —
it is just consumed by the proxy layer now, not called directly by the browser.

> Note: in a static deployment the `x-encrypted-key` is delivered to the
> browser (via `config.json`). This is inherent to having no server — there is
> no place to hide it.
