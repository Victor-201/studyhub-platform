export default class AuditLog {
  #id;
  #userId;
  #action;
  #ip;
  #userAgent;
  #createdAt;

  constructor(row = {}) {
    this.#id = row.id;
    this.#userId = row.user_id;
    this.#action = row.action;
    this.#ip = row.ip;
    this.#userAgent = row.user_agent;
    this.#createdAt = row.created_at ? new Date(row.created_at) : null;
  }

  get id() { return this.#id; }
  get userId() { return this.#userId; }
  get action() { return this.#action; }
  get ip() { return this.#ip; }
  get userAgent() { return this.#userAgent; }
  get createdAt() { return this.#createdAt; }
}
