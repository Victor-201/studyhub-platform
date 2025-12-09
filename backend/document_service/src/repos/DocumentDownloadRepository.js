import { BaseRepository } from "./BaseRepository.js";
import DocumentDownload from "../models/DocumentDownload.js";

export default class DocumentDownloadRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "document_downloads");
  }

  async createDownload(data) {
    const row = {
      document_id: data.document_id,
      user_id: data.user_id,
      downloaded_at: data.downloaded_at || new Date(),
    };

    await super.create(row);
    return new DocumentDownload(row);
  }

  async countDownloads(document_id) {
    const [rows] = await this.pool.query(
      `SELECT COUNT(*) AS total FROM document_downloads WHERE document_id = ?`,
      [document_id]
    );
    return rows[0]?.total || 0;
  }

  async findByDocument(document_id) {
    const rows = await super.findAll({ document_id });
    return rows.map(r => new DocumentDownload(r));
  }

  async findByUser(user_id) {
    const rows = await super.findAll({ user_id });
    return rows.map(r => new DocumentDownload(r));
  }
}
