export class DocumentInteractionsController {
  constructor({ interactionsService }) {
    this.interactionsService = interactionsService;
  }

  async toggleBookmark(req, res) {
    try {
      const result = await this.interactionsService.toggleBookmark(
        req.params.id,
        req.user.id
      );
      return res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async addComment(req, res) {
    try {
      const result = await this.interactionsService.addComment(
        req.params.id,
        req.user.id,
        req.body.content,
        req.body.parent_comment_id
      );
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async deleteComment(req, res) {
    try {
      const result = await this.interactionsService.deleteComment(
        req.params.comment_id,
        req.user.id
      );
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async recordDownload(req, res) {
    try {
      const result = await this.interactionsService.recordDownload(
        req.params.id,
        req.user.id
      );
      res.json({ success: result });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async stats(req, res) {
    try {
      const s = await this.interactionsService.getDocumentStats(req.params.id);
      res.json(s);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
