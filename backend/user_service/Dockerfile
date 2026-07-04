# ══════════════════════════════════════════════════════════════════════
# studyhub-platform — user_service Dockerfile
# Standard: devops.skill.md Section 3.3
# ══════════════════════════════════════════════════════════════════════

FROM node:20-alpine AS deps
WORKDIR /app
RUN corepack enable
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile --production && yarn cache clean

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

EXPOSE 3001

HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=5 \
    CMD wget --quiet --tries=1 --spider http://localhost:3001/health || exit 1

CMD ["node", "src/index.js"]
