export default class DocumentBookmark {
  #document_id;
  #user_id;
  #bookmarked_at;

  constructor(row = {}) {
    this.#document_id = row.document_id;
    this.#user_id = row.user_id;
    this.#bookmarked_at = row.bookmarked_at ? new Date(row.bookmarked_at) : null;
  }

  get document_id() { return this.#document_id; }
  get user_id() { return this.#user_id; }
  get bookmarked_at() { return this.#bookmarked_at; }

  toJSON() {
    return {
      document_id: this.#document_id,
      user_id: this.#user_id,
      bookmarked_at: this.#bookmarked_at,
    };
  }
}
