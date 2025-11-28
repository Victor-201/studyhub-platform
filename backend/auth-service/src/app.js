import express from "express";
import morgan from "morgan";
import { createRouter } from "./routes/routes.js";

export function createApp({ AuthController, OAuthController, AdminController, ReportController }) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan("dev"));

  const router = createRouter({ AuthController, OAuthController, AdminController, ReportController });
  app.use("/api", router);

  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });

  app.use((err, req, res, next) => {
    console.error(err.stack);
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Internal Server Error" });
  });

  return app;
}
