import { BaseRepository } from "./BaseRepository.js";
import Document from "../models/Document.js";

export default class DocumentRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "documents");
    this.pool = pool;
  }

  /**
   * Create new document - return model built from DB row
   */
  async create(data) {
    const row = await super.create(data); // super.create should return inserted row
    return new Document(row);
  }

  /**
   * Find document by ID
   */
  async findById(id) {
    const row = await super.findById(id);
    return row ? new Document(row) : null;
  }

  /**
   * Home feed (PUBLIC + GROUP APPROVED + PRIVATE of user)
   * - If userId provided, include PRIVATE documents owned by that user
   * - Paginated by limit/offset
   */
  async findHomeFeed({ userId = null, limit = 50, offset = 0 } = {}) {
    // Use LEFT JOIN to check for approved group_documents
    const params = [limit, offset];
    let privateClause = "";

    if (userId) {
      // if userId given include PRIVATE owned by user
      privateClause = ` OR (d.visibility = 'PRIVATE' AND d.owner_id = ?)`;
      params.unshift(userId); // we'll place owner_id before limit/offset, so adjust later
      // reorder to [limit, offset] => we want params = [userId, limit, offset]
      // but easier to build explicitly
      const [rows] = await this.pool.query(
        `
        SELECT DISTINCT d.*
        FROM documents d
        LEFT JOIN group_documents gd ON gd.document_id = d.id
        WHERE d.visibility = 'PUBLIC'
           OR (d.visibility = 'GROUP' AND gd.status = 'APPROVED')
           OR (d.visibility = 'PRIVATE' AND d.owner_id = ?)
        ORDER BY d.created_at DESC
        LIMIT ? OFFSET ?
        `,
        [userId, limit, offset]
      );
      return rows.map(r => new Document(r));
    } else {
      const [rows] = await this.pool.query(
        `
        SELECT DISTINCT d.*
        FROM documents d
        LEFT JOIN group_documents gd ON gd.document_id = d.id
        WHERE d.visibility = 'PUBLIC'
           OR (d.visibility = 'GROUP' AND gd.status = 'APPROVED')
        ORDER BY d.created_at DESC
        LIMIT ? OFFSET ?
        `,
        [limit, offset]
      );
      return rows.map(r => new Document(r));
    }
  }

  /**
   * List documents of owner with pagination
   */
  async findAllOfOwner(owner_id, { limit = 50, offset = 0 } = {}) {
    const [rows] = await this.pool.query(
      `SELECT * FROM documents 
       WHERE owner_id = ? 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [owner_id, limit, offset]
    );
    return rows.map(r => new Document(r));
  }

// Lấy tất cả PUBLIC documents của user
async findPublicOfUser(owner_id, { limit = 50, offset = 0 } = {}) {
  const [rows] = await this.pool.query(
    `
    SELECT * FROM documents
    WHERE owner_id = ? AND visibility = 'PUBLIC'
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
    `,
    [owner_id, limit, offset]
  );

  return rows.map(r => new Document(r));
}

  /**
   * Get public documents
   */
  async findPublic(limit = 50, offset = 0) {
    const [rows] = await this.pool.query(
      `SELECT * FROM documents 
       WHERE visibility = 'PUBLIC' 
       ORDER BY created_at DESC 
       LIMIT ? OFFSET ?`,
      [limit, offset]
    );
    return rows.map(r => new Document(r));
  }

  /**
   * Advanced Search
   */
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

    let sql = `
      SELECT DISTINCT d.* 
      FROM documents d
    `;

    // Conditional tag join
    if (tags && tags.length) {
      sql += ` JOIN document_tags dt ON dt.document_id = d.id `;
    } else {
      sql += ` LEFT JOIN document_tags dt ON dt.document_id = d.id `;
    }

    sql += ` LEFT JOIN group_documents gd ON gd.document_id = d.id `;

    // WHERE clause
    if (whereClauses.length) {
      sql += ` WHERE ` + whereClauses.join(" AND ");
    }

    // Tag filtering logic
    if (tags && tags.length) {
      const placeholders = tags.map(() => "?").join(", ");
      // push tags after existing params
      params.push(...tags);

      if (tagsMode === "AND") {
        sql += (whereClauses.length ? " AND " : " WHERE ") +
          ` dt.tag IN (${placeholders})
            GROUP BY d.id
            HAVING COUNT(DISTINCT dt.tag) = ${tags.length}`;
      } else {
        sql += (whereClauses.length ? " AND " : " WHERE ") +
          ` dt.tag IN (${placeholders})`;
      }
    }

    sql += ` ORDER BY d.created_at DESC LIMIT ? OFFSET ?`;
    params.push(limit, offset);

    const [rows] = await this.pool.query(sql, params);
    return rows.map(r => new Document(r));
  }

  /**
   * Update document by id
   */
  async update(id, updates) {
    const row = await super.update(id, updates);
    return row ? new Document(row) : null;
  }

  /**
   * Delete document by ID
   */
  async deleteById(id) {
    return await super.deleteById(id);
  }
}
