# ── 1. Build the fully static export ───────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
# `yarn build` copies configuration/config.json -> public/ then runs
# `next build` (output: 'export'), producing the static site in /app/out.
RUN yarn build

# ── 2. Serve the static files with nginx (no Node at runtime) ───────────
FROM nginx:alpine AS runner
# nginx.conf is a TEMPLATE: the official entrypoint runs envsubst over files in
# /etc/nginx/templates and writes the result to /etc/nginx/conf.d. The .envsh
# hook below exports API_PROXY_TARGET (from config.json) before that step, so
# the same-origin /api/ proxy points at the configured upstream.
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY scripts/docker/10-api-proxy-target.envsh /docker-entrypoint.d/10-api-proxy-target.envsh
RUN chmod +x /docker-entrypoint.d/10-api-proxy-target.envsh
COPY --from=builder /app/out /usr/share/nginx/html
EXPOSE 80

# The tenant config is served at /config.json (i.e.
# /usr/share/nginx/html/config.json). To re-point a tenant WITHOUT
# rebuilding the image, mount a host file over it — see the volume note in
# the compose file — then just refresh the browser.
#
# NOTE: the API proxy upstream (/api/ -> NEXT_PUBLIC_API_URL) is read from
# config.json ONCE at container start. Changing the API host means restarting
# the container (`docker compose restart`), not just refreshing the browser.
