export default class Session {
  #id;
  #user_id;
  #refresh_token_hash;
  #created_at;
  #last_used_at;
  #expires_at;
  #revoked_at;
  #ip;
  #user_agent;
  #device_info;

  constructor(row = {}) {
    this.#id = row.id;
    this.#user_id = row.user_id;
    this.#refresh_token_hash = row.refresh_token_hash;
    this.#created_at = row.created_at ? new Date(row.created_at) : null;
    this.#last_used_at = row.last_used_at ? new Date(row.last_used_at) : null;
    this.#expires_at = row.expires_at ? new Date(row.expires_at) : null;
    this.#revoked_at = row.revoked_at ? new Date(row.revoked_at) : null;
    this.#ip = row.ip;
    this.#user_agent = row.user_agent;
    this.#device_info = row.device_info;
  }

  get id() { return this.#id; }
  get user_id() { return this.#user_id; }
  get refresh_token_hash() { return this.#refresh_token_hash; }
  get created_at() { return this.#created_at; }
  get last_used_at() { return this.#last_used_at; }
  get expires_at() { return this.#expires_at; }
  get revoked_at() { return this.#revoked_at; }
  get ip() { return this.#ip; }
  get user_agent() { return this.#user_agent; }
  get device_info() { return this.#device_info; }

  toJSON() {
    return {
      id: this.#id,
      user_id: this.#user_id,
      refresh_token_hash: this.#refresh_token_hash,
      created_at: this.#created_at,
      last_used_at: this.#last_used_at,
      expires_at: this.#expires_at,
      revoked_at: this.#revoked_at,
      ip: this.#ip,
      user_agent: this.#user_agent,
      device_info: this.#device_info,
    };
  }
}
