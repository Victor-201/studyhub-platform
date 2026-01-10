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
      return this.findPublicFeed({ limit, offset });
    }

    limit = Number(limit) || 50;
    offset = Number(offset) || 0;

    const params = [user_id];

    let groupCondition = "";
    if (groupIds.length > 0) {
      const placeholders = groupIds.map(() => "?").join(",");
      groupCondition = `OR (d.visibility = 'GROUP' AND gd.group_id IN (${placeholders}) AND gd.status = 'APPROVED')`;
      params.push(...groupIds);
    }

    params.push(limit, offset);

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

  async findAllDocuments({ limit = 50, offset = 0 } = {}) {
    const [rows] = await this.pool.query(
      `
    SELECT 
        d.*,
        gd.group_id
    FROM documents d
    LEFT JOIN group_documents gd 
        ON gd.document_id = d.id AND gd.status = 'APPROVED'
    ORDER BY d.created_at DESC
    LIMIT ? OFFSET ?
    `,
      [limit, offset]
    );

    return rows.map((r) => {
      const doc = new Document(r);
      return {
        ...doc.toJSON(),
        group_id: r.group_id ?? null,
      };
    });
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

async searchByKeyword(keyword, limit = 10, offset = 0) {
  if (!keyword) return [];

  const sql = `
  SELECT *
  FROM (
    SELECT t.*,
           ROW_NUMBER() OVER (PARTITION BY t.id ORDER BY t.priority ASC) AS rn
    FROM (
      -- 1. title match
      SELECT d.id, d.owner_id, d.title, d.description, d.visibility, d.file_name,
             d.storage_path, d.created_at, d.updated_at, 1 AS priority
      FROM documents d
      WHERE d.title LIKE ?

      UNION ALL

      -- 2. tag match
      SELECT d.id, d.owner_id, d.title, d.description, d.visibility, d.file_name,
             d.storage_path, d.created_at, d.updated_at, 2 AS priority
      FROM documents d
      JOIN document_tags dt ON dt.document_id = d.id
      WHERE dt.tag LIKE ?

      UNION ALL

      -- 3. description match
      SELECT d.id, d.owner_id, d.title, d.description, d.visibility, d.file_name,
             d.storage_path, d.created_at, d.updated_at, 3 AS priority
      FROM documents d
      WHERE d.description LIKE ?
    ) AS t
  ) AS t2
  WHERE t2.rn = 1
  ORDER BY created_at DESC
  LIMIT ? OFFSET ?;
  `;

  const params = [
    `%${keyword}%`,
    `%${keyword}%`,
    `%${keyword}%`,
    limit,
    offset,
  ];

  const [rows] = await this.pool.query(sql, params);
  return rows;
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
