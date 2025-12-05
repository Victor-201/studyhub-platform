export default class EmailTemplate {
  #name;
  #subject_template;
  #body_template;
  #created_at;
  #updated_at;

  constructor(row = {}) {
    this.#name = row.name;
    this.#subject_template = row.subject_template;
    this.#body_template = row.body_template;
    this.#created_at = row.created_at ? new Date(row.created_at) : null;
    this.#updated_at = row.updated_at ? new Date(row.updated_at) : null;
  }

  get name() { return this.#name; }
  get subject_template() { return this.#subject_template; }
  get body_template() { return this.#body_template; }
  get created_at() { return this.#created_at; }
  get updated_at() { return this.#updated_at; }

    toJSON() {
    return {  
      name: this.#name,
      subject_template: this.#subject_template,
      body_template: this.#body_template,
      created_at: this.#created_at,
      updated_at: this.#updated_at,
    };
  }
}
