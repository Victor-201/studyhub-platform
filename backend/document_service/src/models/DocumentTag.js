export default class DocumentTag {
  #document_id;
  #tag;

  constructor(row = {}) {
    this.#document_id = row.document_id;
    this.#tag = row.tag;
  }

  get document_id() { return this.#document_id; }
  get tag() { return this.#tag; }

  toJSON() {
    return {
      document_id: this.#document_id,
      tag: this.#tag,
    };
  }
}
