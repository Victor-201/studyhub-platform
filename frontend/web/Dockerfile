# ══════════════════════════════════════════════════════════════════════
# studyhub-platform — frontend/web Dockerfile
# Standard: devops.skill.md Section 3.3
# Stack: React 18 + Vite + Tailwind v4
# ══════════════════════════════════════════════════════════════════════

# ── Stage 1: Build ────────────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .

ARG VITE_API_GATEWAY_URL=""
ENV VITE_API_GATEWAY_URL=$VITE_API_GATEWAY_URL

RUN yarn build

# ── Stage 2: Serve via Nginx ──────────────────────────────────────────
FROM nginx:1.27-alpine AS runner

# Remove default config; will use SPA-friendly config below
RUN rm /etc/nginx/conf.d/default.conf

# SPA routing: all unknown paths → index.html
RUN printf 'server {\n\
    listen 80;\n\
    root /usr/share/nginx/html;\n\
    index index.html;\n\
    # Gzip\n\
    gzip on;\n\
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;\n\
    # Security headers\n\
    add_header X-Content-Type-Options nosniff;\n\
    add_header X-Frame-Options SAMEORIGIN;\n\
    add_header X-XSS-Protection "1; mode=block";\n\
    location / {\n\
        try_files $uri $uri/ /index.html;\n\
    }\n\
    # Cache static assets\n\
    location ~* \\.(js|css|png|svg|ico|woff2?)$ {\n\
        expires 1y;\n\
        add_header Cache-Control "public, immutable";\n\
    }\n\
}\n' > /etc/nginx/conf.d/default.conf

COPY --from=builder /app/dist /usr/share/nginx/html

# Non-root: Nginx worker processes already run as nobody;
# only master needs root for port binding. Touch the pid file.
RUN touch /var/run/nginx.pid && \
    chown -R nginx:nginx /var/run/nginx.pid && \
    chown -R nginx:nginx /var/cache/nginx

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
    CMD wget --quiet --tries=1 --spider http://localhost:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
