export default class DocumentDownload {
  #document_id;
  #user_id;
  #downloaded_at;

  constructor(row = {}) {
    this.#document_id = row.document_id;
    this.#user_id = row.user_id;
    this.#downloaded_at = row.downloaded_at ? new Date(row.downloaded_at) : null;
  }

  get document_id() { return this.#document_id; }
  get user_id() { return this.#user_id; }
  get downloaded_at() { return this.#downloaded_at; }

  toJSON() {
    return {
      document_id: this.#document_id,
      user_id: this.#user_id,
      downloaded_at: this.#downloaded_at,
    };
  }
}
