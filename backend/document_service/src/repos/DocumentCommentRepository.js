import { BaseRepository } from "./BaseRepository.js";
import DocumentComment from "../models/DocumentComment.js";

export default class DocumentCommentRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "document_comments");
    this.pool = pool;
  }

  /* ================= CREATE ================= */
  async createComment(row) {
    await super.create(row);
    return new DocumentComment(row);
  }

  /* ================= FIND ================= */
  async findById(id) {
    const row = await super.findById(id);
    return row ? new DocumentComment(row) : null;
  }

  async findByDocument(document_id) {
    const [rows] = await this.pool.query(
      `
      SELECT *
      FROM document_comments
      WHERE document_id = ?
      ORDER BY created_at ASC
      `,
      [document_id]
    );
    return rows.map((r) => new DocumentComment(r));
  }

  async findByUser(user_id) {
    const [rows] = await this.pool.query(
      `
      SELECT *
      FROM document_comments
      WHERE user_id = ?
      ORDER BY created_at DESC
      `,
      [user_id]
    );
    return rows.map((r) => new DocumentComment(r));
  }

  async countAllComments() {
    const [rows] = await this.pool.query(
      `SELECT COUNT(*) AS total FROM document_comments`
    );
    return rows[0]?.total || 0;
  }

  async countComments(document_id) {
    const [rows] = await this.pool.query(
      `SELECT COUNT(*) AS total FROM document_comments WHERE document_id = ?`,
      [document_id]
    );
    return rows[0]?.total || 0;
  }

  /* ================= PAGINATION ================= */
  async findByDocumentPaginated(document_id, { limit = 20, offset = 0 } = {}) {
    limit = Number(limit);
    offset = Number(offset);

    const [rows] = await this.pool.query(
      `
      SELECT *
      FROM document_comments
      WHERE document_id = ?
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
      `,
      [document_id, limit, offset]
    );

    return rows.map((r) => new DocumentComment(r));
  }

 async findAllPaginated({ limit, offset }) {
    const [rows] = await this.pool.query(
      `
      SELECT
        id,
        document_id,
        user_id,
        content,
        parent_comment_id,
        created_at,
        updated_at
      FROM document_comments
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
      `,
      [limit, offset]
    );

    return rows.map((row) => new DocumentComment(row));
  }

  /* ================= UPDATE ================= */
  async updateById(id, updates) {
    return super.updateById(id, updates);
  }

  /* ================= DELETE ================= */
  async deleteComment(id) {
    return super.deleteById(id);
  }

  async deleteByDocument(document_id) {
    await this.pool.query(
      `DELETE FROM document_comments WHERE document_id = ?`,
      [document_id]
    );
    return true;
  }
}
