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

  async getCommentsByDocument(req, res) {
    try {
      const { limit = 50, offset = 0 } = req.query;

      const comments = await this.interactionsService.getCommentsByDocument(
        req.params.id,
        {
          limit: Number(limit),
          offset: Number(offset),
        }
      );

      return res.json(comments);
    } catch (err) {
      return res.status(403).json({ error: err.message });
    }
  }

  async getAllComments(req, res) {
    try {
      const { limit = 50, offset = 0 } = req.query;

      const comments = await this.interactionsService.getAllComments(
        {
          limit: Number(limit),
          offset: Number(offset),
        }
      );

      return res.json(comments);
    } catch (err) {
      return res.status(403).json({ error: err.message });
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
      const url = await this.interactionsService.recordDownload(
        req.params.id,
        req.user.id
      );
      return res.redirect(url);
    } catch (err) {
      return res.status(403).json({ error: err.message });
    }
  }
}
