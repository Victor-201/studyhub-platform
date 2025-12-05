export default class AuditLog {
  #id;
  #actor_user_id;
  #target_user_id;
  #action;
  #resource_type;
  #resource_id;
  #meta;
  #ip;
  #user_agent;
  #created_at;

  constructor(row = {}) {
    this.#id = row.id;
    this.#actor_user_id = row.actor_user_id;
    this.#target_user_id = row.target_user_id;
    this.#action = row.action;
    this.#resource_type = row.resource_type;
    this.#resource_id = row.resource_id;
    this.#meta = typeof row.meta === "string" ? JSON.parse(row.meta) : row.meta;
    this.#ip = row.ip;
    this.#user_agent = row.user_agent;
    this.#created_at = row.created_at ? new Date(row.created_at) : null;
  }

  get id() { return this.#id; }
  get actor_user_id() { return this.#actor_user_id; }
  get target_user_id() { return this.#target_user_id; }
  get action() { return this.#action; }
  get resource_type() { return this.#resource_type; }
  get resource_id() { return this.#resource_id; }
  get meta() { return this.#meta; }
  get ip() { return this.#ip; }
  get user_agent() { return this.#user_agent; }
  get created_at() { return this.#created_at; }

  toJSON() {
    return {
      id: this.#id,
      actor_user_id: this.#actor_user_id,
      target_user_id: this.#target_user_id,
      action: this.#action,   
      resource_type: this.#resource_type,
      resource_id: this.#resource_id,
      meta: this.#meta,
      ip: this.#ip,
      user_agent: this.#user_agent,
      created_at: this.#created_at,
    };
  }
}
