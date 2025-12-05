export default class GroupJoinRequest {
  #id;
  #group_id;
  #user_id;
  #status;
  #requested_at;
  #responded_at;

  constructor(row = {}) {
    this.#id = row.id;
    this.#group_id = row.group_id;
    this.#user_id = row.user_id;
    this.#status = row.status;
    this.#requested_at = row.requested_at;
    this.#responded_at = row.responded_at;
  }

  get id() { return this.#id; }
  get group_id() { return this.#group_id; }
  get user_id() { return this.#user_id; }
  get status() { return this.#status; }
  get requested_at() { return this.#requested_at; }
  get responded_at() { return this.#responded_at; }

  toJSON() {
    return {
      id: this.#id,
      group_id: this.#group_id,
      user_id: this.#user_id,
      status: this.#status,
      requested_at: this.#requested_at,
      responded_at: this.#responded_at,
    };
  }
}
