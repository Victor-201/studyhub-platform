export default class DocumentComment {
  #id;
  #document_id;
  #user_id;
  #content;
  #parent_comment_id;
  #created_at;
  #updated_at;

  constructor(row = {}) {
    this.#id = row.id;
    this.#document_id = row.document_id;
    this.#user_id = row.user_id;
    this.#content = row.content;
    this.#parent_comment_id = row.parent_comment_id;
    this.#created_at = row.created_at ? new Date(row.created_at) : null;
    this.#updated_at = row.updated_at ? new Date(row.updated_at) : null;
  }

  get id() { return this.#id; }
  get document_id() { return this.#document_id; }
  get user_id() { return this.#user_id; }
  get content() { return this.#content; }
  get parent_comment_id() { return this.#parent_comment_id; }
  get created_at() { return this.#created_at; }
  get updated_at() { return this.#updated_at; }

  toJSON() {
    return {
      id: this.#id,
      document_id: this.#document_id,
      user_id: this.#user_id,
      content: this.#content,
      parent_comment_id: this.#parent_comment_id,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
    };
  }
}
