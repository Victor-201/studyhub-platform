export default class GroupDocument {
  #id;
  #group_id;
  #document_id;
  #status;
  #submitted_by;
  #reviewed_by;
  #submitted_at;
  #reviewed_at;

  constructor(row = {}) {
    this.#id = row.id;
    this.#group_id = row.group_id;
    this.#document_id = row.document_id;
    this.#status = row.status;
    this.#submitted_by = row.submitted_by;
    this.#reviewed_by = row.reviewed_by;
    this.#submitted_at = row.submitted_at ? new Date(row.submitted_at) : null;
    this.#reviewed_at = row.reviewed_at ? new Date(row.reviewed_at) : null;
  }

  get id() { return this.#id; }
  get group_id() { return this.#group_id; }
  get document_id() { return this.#document_id; }
  get status() { return this.#status; }
  get submitted_by() { return this.#submitted_by; }
  get reviewed_by() { return this.#reviewed_by; }
  get submitted_at() { return this.#submitted_at; }
  get reviewed_at() { return this.#reviewed_at; }

  toJSON() {
    return {
      id: this.#id,
      group_id: this.#group_id,
      document_id: this.#document_id,
      status: this.#status,
      submitted_by: this.#submitted_by,
      reviewed_by: this.#reviewed_by,
      submitted_at: this.#submitted_at,
      reviewed_at: this.#reviewed_at,
    };
  }
}
