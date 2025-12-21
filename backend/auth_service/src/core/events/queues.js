// src/core/events/queues.js
export const RMQ_QUEUES = {
  Auth: "Auth_queue", 
};

export const RMQ_ROUTING_KEYS = {
  AUTH: {
    CREATED: "user.created",
    DELETED: "user.deleted",
  },
};
