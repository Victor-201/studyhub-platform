export default class UserFollows {
  #follower_id;
  #target_user_id;
  #created_at;

  constructor(row = {}) {
    this.#follower_id = row.follower_id;
    this.#target_user_id = row.target_user_id;
    this.#created_at = row.created_at;
  }

  get follower_id() { return this.#follower_id; }
  get target_user_id() { return this.#target_user_id; }
  get created_at() { return this.#created_at; }

  toJSON() {
    return {
      follower_id: this.#follower_id,
      target_user_id: this.#target_user_id,
      created_at: this.#created_at,
    };
  }
}
