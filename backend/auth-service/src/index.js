import "dotenv/config";
import http from "http";
import { createApp } from "./app.js";
import { AuthController } from "./controllers/AuthController.js";
import { OAuthController } from "./controllers/OAuthController.js";
import { AdminController } from "./controllers/AdminController.js";
import { ReportController } from "./controllers/ReportController.js";

const PORT = process.env.PORT || 3000;

const app = createApp({ AuthController, OAuthController, AdminController, ReportController });
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
