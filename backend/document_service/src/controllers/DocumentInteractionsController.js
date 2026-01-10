import axios from "axios";

export class DocumentInteractionsController {
  constructor({ interactionsService }) {
    this.interactionsService = interactionsService;
  }

  async isBookmarked(req, res) {
    try {
      const bookmarked = await this.interactionsService.isBookmarked(
        req.params.id,
        req.user.id
      );
      return res.json({ bookmarked });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
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
      const user = req.user;
      const isAdmin = Array.isArray(user?.role)
        ? user.role.includes("admin")
        : user?.role === "admin";
      const result = await this.interactionsService.deleteComment(
        req.params.comment_id,
        user?.id,
        isAdmin
      );
      res.json(result);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async recordDownload(req, res) {
    try {
      const doc = await this.interactionsService.recordDownload(
        req.params.id,
        req.user.id
      );

      const fileUrl = doc.storage_path;
      const fileName = doc.file_name;

      const response = await axios.get(fileUrl, {
        responseType: "stream",
      });

      res.setHeader("X-Filename", encodeURIComponent(fileName));

      res.setHeader("Access-Control-Expose-Headers", "X-Filename");

      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(
          fileName
        )}`
      );

      res.setHeader(
        "Content-Type",
        response.headers["content-type"] || "application/octet-stream"
      );

      response.data.pipe(res);

      response.data.on("error", (err) => {
        console.error("Stream error:", err);
        res.status(500).end("file_stream_error");
      });
    } catch (err) {
      console.error(err);

      if (err.message === "forbidden") {
        return res.status(403).json({ error: err.message });
      }

      if (err.message === "document_not_found") {
        return res.status(404).json({ error: err.message });
      }

      return res.status(500).json({ error: "internal_server_error" });
    }
  }

  async approveDocument(req, res) {
    try {
      const result = await this.interactionsService.approveDocument({
        document_id: req.params.id,
        user_id: req.user.id,
        group_id: req.body.group_id,
      });

      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }

  async rejectDocument(req, res) {
    try {
      const result = await this.interactionsService.rejectDocument({
        document_id: req.params.id,
        user_id: req.user.id,
        group_id: req.body.group_id,
      });

      return res.json(result);
    } catch (err) {
      return res.status(400).json({ error: err.message });
    }
  }
}
