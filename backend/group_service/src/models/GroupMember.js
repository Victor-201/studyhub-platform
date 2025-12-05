export default class GroupMember {
  #group_id;
  #user_id;
  #role;
  #joined_at;

  constructor(row = {}) {
    this.#group_id = row.group_id;
    this.#user_id = row.user_id;
    this.#role = row.role;
    this.#joined_at = row.joined_at;
  }

  get group_id() { return this.#group_id; }
  get user_id() { return this.#user_id; }
  get role() { return this.#role; }
  get joined_at() { return this.#joined_at; }

  toJSON() {
    return {
      group_id: this.#group_id,
      user_id: this.#user_id,
      role: this.#role,
      joined_at: this.#joined_at,
    };
  }
}
