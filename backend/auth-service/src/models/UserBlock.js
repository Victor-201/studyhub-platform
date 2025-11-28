export default class UserBlock {
  #id;
  #userId;
  #reason;
  #blockedAt;

  constructor(row = {}) {
    this.#id = row.id;
    this.#userId = row.user_id;
    this.#reason = row.reason || null;
    this.#blockedAt = row.blocked_at ? new Date(row.blocked_at) : null;
  }

  get id() { return this.#id; }
  get userId() { return this.#userId; }
  get reason() { return this.#reason; }
  get blockedAt() { return this.#blockedAt; }
}
