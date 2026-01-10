import { BaseRepository } from "./BaseRepository.js";
import DocumentBookmark from "../models/DocumentBookmark.js";

export default class DocumentBookmarkRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "document_bookmarks");
  }

  async createBookmark(data) {
    const row = {
      document_id: data.document_id,
      user_id: data.user_id,
      bookmarked_at: data.bookmarked_at || new Date(),
    };

    await super.create(row);
    return new DocumentBookmark(row);
  }

  async isBookmarked(user_id, document_id) {
    const [rows] = await this.pool.query(
      `
      SELECT 1
      FROM document_bookmarks
      WHERE user_id = ? AND document_id = ?
      LIMIT 1
      `,
      [user_id, document_id]
    );

    return rows.length > 0;
  }

  async deleteBookmark(document_id, user_id) {
    await this.pool.query(
      `DELETE FROM document_bookmarks WHERE document_id = ? AND user_id = ?`,
      [document_id, user_id]
    );
    return true;
  }

  async findByUser(user_id) {
    const rows = await super.findAll({ user_id });
    return rows.map((r) => new DocumentBookmark(r));
  }

  async findByDocument(document_id) {
    const rows = await super.findAll({ document_id });
    return rows.map((r) => new DocumentBookmark(r));
  }

  async countBookmarks(document_id) {
    const [rows] = await this.pool.query(
      `SELECT COUNT(*) AS total 
     FROM document_bookmarks 
     WHERE document_id = ?`,
      [document_id]
    );
    return rows[0]?.total || 0;
  }
}
