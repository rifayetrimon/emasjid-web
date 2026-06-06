# 1️⃣ Base ima

FROM node:20-alpine AS base
WORKDIR /app
COPY package.json yarn.lock ./

# 2️⃣ Install dependenci

FROM base AS deps
RUN yarn install --frozen-lockfile

# 3️⃣ Build the applicati

FROM base AS builder
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN yarn build

# 4️⃣ Production image

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# The production container only runs `node server.js` — it never needs
# npm/yarn/corepack at runtime. Those bundled package managers ship their
# own old copies of tar/minimatch/glob/cross-spawn that the CVE scanner
# flags (in /usr/local/lib/node_modules/npm and /opt/yarn-*). Remove them
# so the final image has zero of those findings. Pure `node` remains.
RUN rm -rf \
      /usr/local/lib/node_modules/npm \
      /usr/local/lib/node_modules/corepack \
      /usr/local/bin/npm \
      /usr/local/bin/npx \
      /usr/local/bin/corepack \
      /usr/local/bin/yarn \
      /usr/local/bin/yarnpkg \
      /opt/yarn-* \
  && echo "removed npm/yarn/corepack from runtime image"

# Copy only necessary build files

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# ✅ ADD THIS LINE BELOW: Copy the data folder manually

COPY --from=builder /app/data ./data

# Tenant config is read at runtime (visitor/gallery routes), but the

# standalone build does NOT bundle it — copy it in explicitly.

COPY --from=builder /app/configuration ./configuration
EXPOSE 3000
CMD ["node", "server.js"]