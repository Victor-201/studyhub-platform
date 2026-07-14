const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();
const PORT = process.env.PORT || 8000;

const ALLOWED_ORIGINS = [
  "https://studyhub-platform.pages.dev",
  "http://localhost:5173",
];

const CORS_HEADERS = {
  "access-control-allow-credentials": "true",
  "access-control-allow-headers": "Accept, Authorization, Content-Type, X-Requested-With",
  "access-control-allow-methods": "GET, POST, PUT, PATCH, DELETE, OPTIONS",
  "access-control-expose-headers": "X-Auth-Token",
  "access-control-max-age": "3600",
};

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("access-control-allow-origin", origin);
  }
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    Object.entries(CORS_HEADERS).forEach(([k, v]) => res.setHeader(k, v));
  }
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
});

// health
app.get("/health", (_req, res) => res.send("OK"));

// routes
const services = [
  { path: "/api/v1/auth", target: "https://sh-auth-service.onrender.com" },
  { path: "/api/v1/user", target: "https://sh-user-service.onrender.com" },
  { path: "/api/v1/group", target: "https://sh-group-service.onrender.com" },
  { path: "/api/v1/document", target: "https://sh-document-service.onrender.com" },
  { path: "/api/v1/chat", target: "https://sh-chat-service.onrender.com" },
  { path: "/api/v1/notification", target: "https://sh-notification-service.onrender.com" },
];

services.forEach(({ path, target }) => {
  app.use(
    path,
    createProxyMiddleware({
      target,
      changeOrigin: true,
      proxyTimeout: 60000,
      timeout: 60000,
      on: {
        proxyReq: (proxyReq) => {
          proxyReq.setHeader("connection", "keep-alive");
        },
      },
    })
  );
});

app.listen(PORT, () => console.log(`gateway listening on ${PORT}`));
