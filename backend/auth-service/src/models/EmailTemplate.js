export default class EmailTemplate {
  #name;
  #subjectTemplate;
  #bodyTemplate;
  #createdAt;
  #updatedAt;

  constructor(row = {}) {
    this.#name = row.name;
    this.#subjectTemplate = row.subject_template;
    this.#bodyTemplate = row.body_template;
    this.#createdAt = row.created_at ? new Date(row.created_at) : null;
    this.#updatedAt = row.updated_at ? new Date(row.updated_at) : null;
  }

  get name() { return this.#name; }
  get subjectTemplate() { return this.#subjectTemplate; }
  get bodyTemplate() { return this.#bodyTemplate; }
  get createdAt() { return this.#createdAt; }
  get updatedAt() { return this.#updatedAt; }
}
