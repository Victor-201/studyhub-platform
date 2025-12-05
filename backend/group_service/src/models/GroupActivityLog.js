export default class GroupActivityLog {
  #id;
  #group_id;
  #actor_id;
  #action;
  #target_id;
  #created_at;

  constructor(row = {}) {
    this.#id = row.id;
    this.#group_id = row.group_id;
    this.#actor_id = row.actor_id;
    this.#action = row.action;
    this.#target_id = row.target_id;
    this.#created_at = row.created_at;
  }

  get id() { return this.#id; }
  get group_id() { return this.#group_id; }
  get actor_id() { return this.#actor_id; }
  get action() { return this.#action; }
  get target_id() { return this.#target_id; }
  get created_at() { return this.#created_at; }

  toJSON() {
    return {
      id: this.#id,
      group_id: this.#group_id,
      actor_id: this.#actor_id,
      action: this.#action,
      target_id: this.#target_id,
      created_at: this.#created_at,
    };
  }
}
