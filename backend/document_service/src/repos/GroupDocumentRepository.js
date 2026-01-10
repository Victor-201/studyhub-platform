import { BaseRepository } from "./BaseRepository.js";
import GroupDocument from "../models/GroupDocument.js";
import Document from "../models/Document.js";

export default class GroupDocumentRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "group_documents");
    this.pool = pool;
  }

  async createRecord(data) {
    const row = await super.create(data);
    return new GroupDocument(row);
  }

  async findByGroupAndDocument(group_id, document_id) {
    const [rows] = await this.pool.query(
      `
      SELECT * FROM group_documents
      WHERE group_id = ? AND document_id = ?
      LIMIT 1
      `,
      [group_id, document_id]
    );
    return rows[0] ? new GroupDocument(rows[0]) : null;
  }

  async findGroupsByDocument(document_id) {
    const [rows] = await this.pool.query(
      `SELECT * FROM group_documents WHERE document_id = ?`,
      [document_id]
    );
    return rows.map(r => new GroupDocument(r));
  }

  async findApprovedInGroup(group_id, { limit = 50, offset = 0 } = {}) {
    const [rows] = await this.pool.query(
      `
      SELECT d.* FROM documents d
      JOIN group_documents gd ON gd.document_id = d.id
      WHERE gd.group_id = ? AND gd.status = 'APPROVED'
      ORDER BY d.created_at DESC
      LIMIT ? OFFSET ?
      `,
      [group_id, limit, offset]
    );
    return rows.map(r => new Document(r));
  }

  async findPendingInGroup(group_id, { limit = 50, offset = 0 } = {}) {
    const [rows] = await this.pool.query(
      `
      SELECT d.* FROM documents d
      JOIN group_documents gd ON gd.document_id = d.id
      WHERE gd.group_id = ? AND gd.status = 'PENDING'
      ORDER BY gd.submitted_at ASC
      LIMIT ? OFFSET ?
      `,
      [group_id, limit, offset]
    );
    return rows.map(r => new Document(r));
  }

  async findApprovedByUser(user_id, { limit = 50, offset = 0 } = {}) {
  const [rows] = await this.pool.query(
    `
    SELECT gd.*, d.*
    FROM group_documents gd
    JOIN documents d ON d.id = gd.document_id
    WHERE gd.submitted_by = ?
      AND gd.status = 'APPROVED'
    ORDER BY d.created_at DESC
    LIMIT ? OFFSET ?
    `,
    [user_id, limit, offset]
  );

  return rows.map(r => ({
    groupDoc: new GroupDocument(r),
    document: new Document(r)
  }));
}


  async listByGroup(group_id, { status = null, limit = 50, offset = 0 } = {}) {
    let sql = `SELECT * FROM group_documents WHERE group_id = ?`;
    const params = [group_id];

    if (status) {
      sql += ` AND status = ?`;
      params.push(status);
    }

    sql += ` ORDER BY submitted_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await this.pool.query(sql, params);
    return rows.map(r => new GroupDocument(r));
  }

  async approveDocument(id, reviewer_id) {
    await this.pool.query(
      `
      UPDATE group_documents
      SET status='APPROVED', reviewed_by=?, reviewed_at=?
      WHERE id=?
      `,
      [reviewer_id, new Date(), id]
    );
    return new GroupDocument(await super.findById(id));
  }

  async rejectDocument(id, reviewer_id) {
    await this.pool.query(
      `
      UPDATE group_documents
      SET status='REJECTED', reviewed_by=?, reviewed_at=?
      WHERE id=?
      `,
      [reviewer_id, new Date(), id]
    );
    return new GroupDocument(await super.findById(id));
  }
}
