# ══════════════════════════════════════════════════════════════════════
# studyhub-platform — auth_service Dockerfile
# Standard: devops.skill.md Section 3.3 (Multi-stage, non-root, HEALTHCHECK)
# Improved from original single-stage build (289 bytes) to production-grade.
# ══════════════════════════════════════════════════════════════════════

# ── Stage 1: Install dependencies ─────────────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

# ── Stage 2: Runtime ──────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

# Security: add wget for healthcheck, create non-root user
RUN apk add --no-cache wget && \
    addgroup -g 1001 -S nodejs && \
    adduser  -S nodeapp -u 1001

ENV NODE_ENV=production

# Copy only production deps + source
COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY package.json ./

RUN chown -R nodeapp:nodejs /app
USER nodeapp

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
    CMD wget --quiet --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "src/index.js"]
