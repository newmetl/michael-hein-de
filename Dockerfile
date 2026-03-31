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

# 1. Standalone Next.js output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 2. Prisma schema + migrations
COPY --from=builder /app/prisma ./prisma

# 3. Full node_modules for prisma CLI at runtime (pnpm symlinks require complete tree)
COPY --from=deps /app/node_modules ./node_modules

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["sh", "-c", "npx prisma migrate deploy && node server.js"]
