export default class AuditLog {
  #id;
  #actorUserId;
  #targetUserId;
  #action;
  #resourceType;
  #resourceId;
  #meta;
  #ip;
  #userAgent;
  #createdAt;

  constructor(row = {}) {
    this.#id = row.id;
    this.#actorUserId = row.actor_user_id;
    this.#targetUserId = row.target_user_id;
    this.#action = row.action;
    this.#resourceType = row.resource_type;
    this.#resourceId = row.resource_id;
    this.#meta = typeof row.meta === "string" ? JSON.parse(row.meta) : row.meta;
    this.#ip = row.ip;
    this.#userAgent = row.user_agent;
    this.#createdAt = row.created_at ? new Date(row.created_at) : null;
  }

  get id() { return this.#id; }
  get actorUserId() { return this.#actorUserId; }
  get targetUserId() { return this.#targetUserId; }
  get action() { return this.#action; }
  get resourceType() { return this.#resourceType; }
  get resourceId() { return this.#resourceId; }
  get meta() { return this.#meta; }
  get ip() { return this.#ip; }
  get userAgent() { return this.#userAgent; }
  get createdAt() { return this.#createdAt; }
}
