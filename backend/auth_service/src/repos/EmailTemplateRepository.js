import { BaseRepository } from "./BaseRepository.js";
import EmailTemplate from "../models/EmailTemplate.js";

export class EmailTemplateRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "email_templates");
  }

  async createTemplate(data) {
    const row = await this.create(data);
    return new EmailTemplate(row);
  }

  async findByName(name) {
    const row = await this.findById(name);
    return row ? new EmailTemplate(row) : null;
  }

  async findAllTemplates() {
    const rows = await this.findAll();
    return rows.map(row => new EmailTemplate(row));
  }

  async updateTemplate(name, data) {
    await this.updateById(name, data);
    const updated = await this.findById(name);
    return updated ? new EmailTemplate(updated) : null;
  }

  async deleteTemplate(name) {
    return await this.deleteById(name);
  }
}
