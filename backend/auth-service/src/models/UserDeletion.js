export default class UserDeletion {
  #id;
  #userId;
  #deletedBy;
  #reason;
  #createdAt;
  #restoredAt;
  #restoredBy;

  constructor(row = {}) {
    this.#id = row.id;
    this.#userId = row.user_id;
    this.#deletedBy = row.deleted_by;
    this.#reason = row.reason;
    this.#createdAt = row.created_at ? new Date(row.created_at) : null;
    this.#restoredAt = row.restored_at ? new Date(row.restored_at) : null;
    this.#restoredBy = row.restored_by;
  }

  get id() { return this.#id; }
  get userId() { return this.#userId; }
  get deletedBy() { return this.#deletedBy; }
  get reason() { return this.#reason; }
  get createdAt() { return this.#createdAt; }
  get restoredAt() { return this.#restoredAt; }
  get restoredBy() { return this.#restoredBy; }
}
