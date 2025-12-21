import { createApp } from "./app.js";
import { pool } from "./config/db.js";
import { env } from "./config/env.js";

import { initRabbitConnection } from "./core/events/connection.js";
import { bindQueues } from "./core/events/bind.js";
import { initEventConsumers } from "./core/events/consume.js";

import { IncomingEventRepository } from "./repos/IncomingEventRepository.js";
import { IncomingEventService } from "./services/IncomingEventService.js";
import { UserRepository } from "./repos/UserRepository.js";

// IMPORT HANDLERS
import userCreated from "./core/events/handlers/userCreated.js";
import userDeleted from "./core/events/handlers/userDeleted.js";

const PORT = env.PORT;

async function bootstrap() {
  const app = createApp();

  app.listen(PORT, () => {
    console.log(`[User Service] running on port ${PORT}`);
  });

  // RabbitMQ
  await initRabbitConnection();
  await bindQueues();

  const userRepo = new UserRepository(pool);
  const incomingRepo = new IncomingEventRepository(pool);

  const incomingEventService = new IncomingEventService({
    incomingRepo,
    handlers: {
      "user.created": userCreated({ userRepo }),
      "user.deleted": userDeleted({ userRepo }),
    },
  });

  await initEventConsumers(incomingEventService);

  console.log("[BOOTSTRAP] RabbitMQ started");
}

bootstrap();
