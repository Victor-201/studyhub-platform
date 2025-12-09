export default class IncomingEvent {
  #id;
  #event_source;
  #event_type;
  #payload;
  #consumed_at;
  #created_at;

  constructor(row = {}) {
    this.#id = row.id;
    this.#event_source = row.event_source;
    this.#event_type = row.event_type;
    this.#payload = row.payload;
    this.#consumed_at = row.consumed_at ? new Date(row.consumed_at) : null;
    this.#created_at = row.created_at ? new Date(row.created_at) : null;
  }

  get id() { return this.#id; }
  get event_source() { return this.#event_source; }
  get event_type() { return this.#event_type; }
  get payload() { return this.#payload; }
  get consumed_at() { return this.#consumed_at; }
  get created_at() { return this.#created_at; }

  toJSON() {
    return {
      id: this.#id,
      event_source: this.#event_source,
      event_type: this.#event_type,
      payload: this.#payload,
      consumed_at: this.#consumed_at,
      created_at: this.#created_at,
    };
  }
}
