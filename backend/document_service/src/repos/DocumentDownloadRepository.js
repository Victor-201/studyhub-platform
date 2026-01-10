import { BaseRepository } from "./BaseRepository.js";
import DocumentDownload from "../models/DocumentDownload.js";

export default class DocumentDownloadRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "document_downloads");
  }

  async createDownload(data) {
    await super.create(data);
    return new DocumentDownload(data);
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
    return rows.map((r) => new DocumentDownload(r));
  }

  async findByUser(user_id) {
    const rows = await super.findAll({ user_id });
    return rows.map((r) => new DocumentDownload(r));
  }
}
