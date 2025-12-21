import { BaseRepository } from "./BaseRepository.js";
import Document from "../models/Document.js";

export default class DocumentRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "documents");
    this.pool = pool;
  }

  /** Create new document */
  async create(data) {
    const row = await super.create(data);
    return new Document(row);
  }

  /** Count documents */
  async countAllDocuments() {
    const [rows] = await this.pool.query(
      "SELECT COUNT(*) AS count FROM documents"
    );
    return rows[0].count;
  }

  /** Find document by ID */
  async findById(id) {
    const row = await super.findById(id);
    return row ? new Document(row) : null;
  }

  /** Get public feed */
  async findPublicFeed({ limit = 50, offset = 0 } = {}) {
    limit = Number(limit) || 50;
    offset = Number(offset) || 0;

    const sql = `
      SELECT 
        d.*,
        IFNULL(dd.count_download, 0) AS downloads,
        IFNULL(bm.count_bookmark, 0) AS bookmarks
      FROM documents d
      LEFT JOIN (
        SELECT document_id, COUNT(*) AS count_download
        FROM document_downloads GROUP BY document_id
      ) dd ON dd.document_id = d.id
      LEFT JOIN (
        SELECT document_id, COUNT(*) AS count_bookmark
        FROM document_bookmarks GROUP BY document_id
      ) bm ON bm.document_id = d.id
      WHERE d.visibility = 'PUBLIC'
      ORDER BY created_at DESC
      LIMIT ? OFFSET ?
    `;
    const [rows] = await this.pool.query(sql, [limit, offset]);
    return rows.map((r) => new Document(r));
  }

async findHomeFeed({ user_id, groupIds = [], limit = 50, offset = 0 } = {}) {
  if (!user_id) {
    // Guest → fallback sang public feed
    return this.findPublicFeed({ limit, offset });
  }

  limit = Number(limit) || 50;
  offset = Number(offset) || 0;

  const params = [user_id]; // loại bỏ document của chính user

  // điều kiện nhóm nếu có
  let groupCondition = "";
  if (groupIds.length > 0) {
    const placeholders = groupIds.map(() => "?").join(",");
    groupCondition = `OR (d.visibility = 'GROUP' AND gd.group_id IN (${placeholders}) AND gd.status = 'APPROVED')`;
    params.push(...groupIds);
  }

  params.push(limit, offset);

  // SQL lấy document kèm interaction + nhóm
  const sql = `
    SELECT
      d.*,
      gd.group_id,
      gd.status,
      IFNULL(dd.count_download, 0) AS downloads,
      IFNULL(bm.count_bookmark, 0) AS bookmarks
    FROM documents d
    LEFT JOIN group_documents gd
           ON gd.document_id = d.id
    LEFT JOIN (
      SELECT document_id, COUNT(*) AS count_download
      FROM document_downloads GROUP BY document_id
    ) dd ON dd.document_id = d.id
    LEFT JOIN (
      SELECT document_id, COUNT(*) AS count_bookmark
      FROM document_bookmarks GROUP BY document_id
    ) bm ON bm.document_id = d.id
    WHERE d.owner_id != ?
      AND (
            d.visibility = 'PUBLIC'
            ${groupCondition}
          )
    ORDER BY downloads * 2 + bookmarks * 3 + UNIX_TIMESTAMP(d.created_at)/1000000 + RAND() DESC
    LIMIT ? OFFSET ?
  `;

  const [rows] = await this.pool.query(sql, params);

  // lọc lại nhóm để chắc chắn user thực sự thuộc nhóm
  const groupSet = new Set(groupIds);
  const filtered = rows.filter((r) => {
    if (r.visibility === "PUBLIC") return true;
    if (r.visibility === "GROUP") {
      return groupSet.has(r.group_id) && r.status === "APPROVED";
    }
    return false;
  });

  // map thành object Document
  return filtered.map((r) => new Document(r));
}

  /** List documents of owner */
  async findAllOfOwner(owner_id, { limit = 50, offset = 0 } = {}) {
    const [rows] = await this.pool.query(
      `SELECT * FROM documents WHERE owner_id = ? ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [owner_id, limit, offset]
    );
    return rows.map((r) => new Document(r));
  }

  /** Get public documents of a user */
  async findPublicOfUser(owner_id, { limit = 50, offset = 0 } = {}) {
    const [rows] = await this.pool.query(
      `SELECT * FROM documents WHERE owner_id = ? AND visibility = 'PUBLIC' ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      [owner_id, limit, offset]
    );
    return rows.map((r) => new Document(r));
  }

  /** Advanced search */
  async search({
    keyword = null,
    tags = [],
    tagsMode = "OR",
    owner_id = null,
    visibility = null,
    page = 1,
    limit = 20,
  } = {}) {
    const offset = (page - 1) * limit;
    const params = [];
    const whereClauses = [];

    if (owner_id) {
      whereClauses.push("d.owner_id = ?");
      params.push(owner_id);
    }
    if (visibility) {
      whereClauses.push("d.visibility = ?");
      params.push(visibility);
    }
    if (keyword) {
      whereClauses.push("(d.title LIKE ? OR d.description LIKE ?)");
      params.push(`%${keyword}%`, `%${keyword}%`);
    }

    let sql = `SELECT DISTINCT d.* FROM documents d`;

    if (tags && tags.length) {
      sql += ` JOIN document_tags dt ON dt.document_id = d.id`;
    } else {
      sql += ` LEFT JOIN document_tags dt ON dt.document_id = d.id`;
    }

    sql += ` LEFT JOIN group_documents gd ON gd.document_id = d.id`;

    if (whereClauses.length) {
      sql += ` WHERE ` + whereClauses.join(" AND ");
    }

    if (tags && tags.length) {
      const placeholders = tags.map(() => "?").join(", ");
      params.push(...tags);
      if (tagsMode === "AND") {
        sql +=
          (whereClauses.length ? " AND " : " WHERE ") +
          ` dt.tag IN (${placeholders}) GROUP BY d.id HAVING COUNT(DISTINCT dt.tag) = ${tags.length}`;
      } else {
        sql +=
          (whereClauses.length ? " AND " : " WHERE ") +
          ` dt.tag IN (${placeholders})`;
      }
    }

    sql += ` ORDER BY d.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await this.pool.query(sql, params);
    return rows.map((r) => new Document(r));
  }

  /** Update document by id */
  async update(id, updates) {
    const row = await super.update(id, updates);
    return row ? new Document(row) : null;
  }

  /** Delete document */
  async deleteById(id) {
    return super.deleteById(id);
  }
}
