export default class UserBlock {
  #id;
  #userId;
  #blockedBy;
  #reason;
  #blockedUntil;
  #isPermanent;
  #liftedAt;
  #createdAt;

  constructor(row = {}) {
    this.#id = row.id;
    this.#userId = row.user_id;
    this.#blockedBy = row.blocked_by;
    this.#reason = row.reason;
    this.#blockedUntil = row.blocked_until ? new Date(row.blocked_until) : null;
    this.#isPermanent = row.is_permanent;
    this.#liftedAt = row.lifted_at ? new Date(row.lifted_at) : null;
    this.#createdAt = row.created_at ? new Date(row.created_at) : null;
  }

  get id() { return this.#id; }
  get userId() { return this.#userId; }
  get blockedBy() { return this.#blockedBy; }
  get reason() { return this.#reason; }
  get blockedUntil() { return this.#blockedUntil; }
  get isPermanent() { return this.#isPermanent; }
  get liftedAt() { return this.#liftedAt; }
  get createdAt() { return this.#createdAt; }
}
