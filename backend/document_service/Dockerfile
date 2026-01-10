FROM node:20-alpine AS builder
WORKDIR /app
RUN corepack enable
COPY package.json ./
RUN yarn install --frozen-lockfile
COPY . .

FROM node:20-alpine
WORKDIR /app
RUN corepack enable
COPY --from=builder /app .
ENV NODE_ENV=production
EXPOSE 3003
CMD ["node", "src/index.js"]
