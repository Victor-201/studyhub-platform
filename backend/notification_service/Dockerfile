# ══════════════════════════════════════════════════════════════════════
# studyhub-platform — notification_service Dockerfile
# Standard: devops.skill.md Section 3.3
# Note: Uses MongoDB (MONGO_URI) — no yarn.lock in this service
# ══════════════════════════════════════════════════════════════════════

FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json ./
RUN npm install --omit=dev && npm cache clean --force

FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache wget && \
    addgroup -g 1001 -S nodejs && \
    adduser  -S nodeapp -u 1001

ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY src ./src
COPY package.json ./

RUN chown -R nodeapp:nodejs /app
USER nodeapp

EXPOSE 3005

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
    CMD wget --quiet --tries=1 --spider http://localhost:3005/health || exit 1

CMD ["node", "src/index.js"]
