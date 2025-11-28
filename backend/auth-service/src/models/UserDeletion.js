export default class UserDeletion {
  #id;
  #userId;
  #deletedAt;
  #reason;

  constructor(row = {}) {
    this.#id = row.id;
    this.#userId = row.user_id;
    this.#deletedAt = row.deleted_at ? new Date(row.deleted_at) : null;
    this.#reason = row.reason || null;
  }

  get id() { return this.#id; }
  get userId() { return this.#userId; }
  get deletedAt() { return this.#deletedAt; }
  get reason() { return this.#reason; }
}
