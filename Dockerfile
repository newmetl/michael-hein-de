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

# 1. Standalone Next.js output (base layer)
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# 2. Prisma: schema, migrations, ensure-pages script (overwrites standalone's prisma/)
COPY --from=builder /app/prisma ./prisma

# 3. Prisma CLI + client for runtime migrations
COPY --from=deps /app/node_modules/prisma ./node_modules/prisma
COPY --from=deps /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# 4. Startup script (AFTER standalone copy so it doesn't get overwritten)
COPY --from=builder /app/start.sh ./start.sh
RUN chmod +x start.sh

USER nextjs
EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"
CMD ["sh", "start.sh"]
