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
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/out /usr/share/nginx/html
EXPOSE 80

# The tenant config is served at /config.json (i.e.
# /usr/share/nginx/html/config.json). To re-point a tenant WITHOUT
# rebuilding the image, mount a host file over it — see the volume note in
# the compose file — then just refresh the browser.
