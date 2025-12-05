export default class UserBlock {
  #id;
  #user_id;
  #blocked_by;
  #reason;
  #blocked_until;
  #is_permanent;
  #lifted_at;
  #created_at;

  constructor(row = {}) {
    this.#id = row.id;
    this.#user_id = row.user_id;
    this.#blocked_by = row.blocked_by;
    this.#reason = row.reason;
    this.#blocked_until = row.blocked_until ? new Date(row.blocked_until) : null;
    this.#is_permanent = row.is_permanent;
    this.#lifted_at = row.lifted_at ? new Date(row.lifted_at) : null;
    this.#created_at = row.created_at ? new Date(row.created_at) : null;
  }

  get id() { return this.#id; }
  get user_id() { return this.#user_id; }
  get blocked_by() { return this.#blocked_by; }
  get reason() { return this.#reason; }
  get blocked_until() { return this.#blocked_until; }
  get is_permanent() { return this.#is_permanent; }
  get lifted_at() { return this.#lifted_at; }
  get created_at() { return this.#created_at; }

  toJSON() {
    return {
      id: this.#id,
      user_id: this.#user_id,
      blocked_by: this.#blocked_by,
      reason: this.#reason,
      blocked_until: this.#blocked_until,
      is_permanent: this.#is_permanent,
      lifted_at: this.#lifted_at,
      created_at: this.#created_at,
    };
  }
}
