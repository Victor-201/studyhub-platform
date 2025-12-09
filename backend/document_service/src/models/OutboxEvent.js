export default class OutboxEvent {
  #id;
  #aggregate_type;
  #aggregate_id;
  #event_type;
  #routing_key;
  #payload;
  #status;
  #published_at;
  #created_at;

  constructor(row = {}) {
    this.#id = row.id;
    this.#aggregate_type = row.aggregate_type;
    this.#aggregate_id = row.aggregate_id;
    this.#event_type = row.event_type;
    this.#routing_key = row.routing_key;
    this.#payload = row.payload;
    this.#status = row.status;
    this.#published_at = row.published_at ? new Date(row.published_at) : null;
    this.#created_at = row.created_at ? new Date(row.created_at) : null;
  }

  get id() { return this.#id; }
  get aggregate_type() { return this.#aggregate_type; }
  get aggregate_id() { return this.#aggregate_id; }
  get event_type() { return this.#event_type; }
  get routing_key() { return this.#routing_key; }
  get payload() { return this.#payload; }
  get status() { return this.#status; }
  get published_at() { return this.#published_at; }
  get created_at() { return this.#created_at; }

  toJSON() {
    return {
      id: this.#id,
      aggregate_type: this.#aggregate_type,
      aggregate_id: this.#aggregate_id,
      event_type: this.#event_type,
      routing_key: this.#routing_key,
      payload: this.#payload,
      status: this.#status,
      published_at: this.#published_at,
      created_at: this.#created_at,
    };
  }
}
