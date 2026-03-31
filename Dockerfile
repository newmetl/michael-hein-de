FROM node:20-alpine AS base

# --- Dependencies ---
FROM base AS deps
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable pnpm && pnpm install --frozen-lockfile

# --- Build ---
FROM base AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV DATABASE_URL="file:/app/build.db"
RUN corepack enable pnpm \
    && npx prisma generate \
    && npx prisma migrate deploy \
    && pnpm build \
    && rm -f /app/build.db

# --- Production ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
RUN apk add --no-cache openssl \
    && addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 nextjs

# 1. Full node_modules from deps (for prisma CLI at runtime)
COPY --from=deps /app/node_modules ./node_modules

# 2. Standalone Next.js output ON TOP (overwrites node_modules partially with generated client)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 3. Prisma schema + migrations
COPY --from=builder /app/prisma ./prisma

# 4. Data directory for uploads (volume-mounted at runtime)
RUN mkdir -p /app/data && chown nextjs:nodejs /app/data

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
ENV DATA_DIR="/app/data"
CMD ["sh", "-c", "mkdir -p /app/data/uploads/original /app/data/uploads/display /app/data/uploads/thumb && npx prisma migrate deploy && node server.js"]
