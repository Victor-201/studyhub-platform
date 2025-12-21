import { BaseRepository } from "./BaseRepository.js";
import DocumentTag from "../models/DocumentTag.js";

export default class DocumentTagRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "document_tags");
  }

  async createTag(data) {
    await super.create(data);
    return new DocumentTag(data);
  }

  async findByDocument(document_id) {
    const rows = await super.findAll({ document_id }, "tag ASC");
    return rows.map((r) => new DocumentTag(r));
  }

  async findByTag(tag) {
    const rows = await super.findAll({ tag }, "document_id ASC");
    return rows.map((r) => new DocumentTag(r));
  }

  async getAllTags() {
    const [rows] = await this.pool.query(`
    SELECT DISTINCT tag
    FROM document_tags
    ORDER BY tag ASC
  `);

    return rows.map((r) => r.tag);
  }

  async deleteTag(document_id, tag) {
    await this.pool.query(
      `DELETE FROM document_tags WHERE document_id = ? AND tag = ?`,
      [document_id, tag]
    );
  }

  async deleteAllTags(document_id) {
    await this.pool.query(`DELETE FROM document_tags WHERE document_id = ?`, [
      document_id,
    ]);
  }

  async attachTags(document_id, tags = []) {
    if (!Array.isArray(tags)) {
      try {
        tags = JSON.parse(tags);
      } catch {
        tags = [tags];
      }
    }

    // normalize + unique
    tags = [
      ...new Set(
        tags.map((t) => String(t).trim().toLowerCase()).filter(Boolean)
      ),
    ];

    if (tags.length === 0) return;

    const values = tags.map((tag) => [document_id, tag]);

    await this.pool.query(
      `INSERT INTO document_tags (document_id, tag) VALUES ?`,
      [values]
    );
  }
}
