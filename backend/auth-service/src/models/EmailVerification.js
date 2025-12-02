export default class EmailVerification {
  #id;
  #user_email_id;
  #token_hash;
  #expires_at;
  #used_at;
  #ip;
  #user_agent;
  #created_at;

  constructor(row = {}) {
    this.#id = row.id;
    this.#user_email_id = row.user_email_id;
    this.#token_hash = row.token_hash;
    this.#expires_at = row.expires_at ? new Date(row.expires_at) : null;
    this.#used_at = row.used_at ? new Date(row.used_at) : null;
    this.#ip = row.ip;
    this.#user_agent = row.user_agent;
    this.#created_at = row.created_at ? new Date(row.created_at) : null;
  }

  get id() { return this.#id; }
  get user_email_id() { return this.#user_email_id; }
  get token_hash() { return this.#token_hash; }
  get expires_at() { return this.#expires_at; }
  get used_at() { return this.#used_at; }
  get ip() { return this.#ip; }
  get user_agent() { return this.#user_agent; }
  get created_at() { return this.#created_at; }

  toJSON() {
    return {
      id: this.#id,
      user_email_id: this.#user_email_id,
      token_hash: this.#token_hash,
      expires_at: this.#expires_at,
      used_at: this.#used_at,
      ip: this.#ip,
      user_agent: this.#user_agent,
      created_at: this.#created_at,
    };
  }
}
