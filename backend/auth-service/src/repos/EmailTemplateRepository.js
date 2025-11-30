import { BaseRepository } from "./BaseRepository.js";
import EmailTemplate from "../models/EmailTemplate.js";

export class EmailTemplateRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "email_templates");
  }

  async createTemplate(templateData) {
    const row = await this.create(templateData);
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

  async updateTemplate(name, updateData) {
    await this.updateById(name, updateData);
    const updated = await this.findById(name);
    return updated ? new EmailTemplate(updated) : null;
  }

  async deleteTemplate(name) {
    return await this.deleteById(name);
  }
}
