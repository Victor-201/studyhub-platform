// src/repos/DocumentCommentRepository.js
import { BaseRepository } from "./BaseRepository.js";
import DocumentComment from "../models/DocumentComment.js";

export default class DocumentCommentRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "document_comments");
  }

  async createComment(row) {
    // expects id, document_id, user_id, content, parent_comment_id, created_at, updated_at
    await super.create(row);
    return new DocumentComment(row);
  }

  async findById(id) {
    const row = await super.findById(id);
    return row ? new DocumentComment(row) : null;
  }

  async findByDocument(document_id) {
    const rows = await this.findAll({ document_id }, "created_at ASC");
    return rows.map(r => new DocumentComment(r));
  }

  async findByUser(user_id) {
    const rows = await this.findAll({ user_id }, "created_at DESC");
    return rows.map(r => new DocumentComment(r));
  }

  async deleteById(id) {
    await this.pool.query(`DELETE FROM document_comments WHERE id = ?`, [id]);
    return true;
  }

  async deleteByDocument(document_id) {
    await this.pool.query(`DELETE FROM document_comments WHERE document_id = ?`, [document_id]);
    return true;
  }
}
