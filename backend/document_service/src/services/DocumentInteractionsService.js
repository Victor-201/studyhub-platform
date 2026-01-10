import { randomUUID } from "crypto";

export default class DocumentInteractionsService {
  constructor({
    bookmarkRepo,
    commentRepo,
    downloadRepo,
    documentRepo,
    groupDocRepo,
    groupClient,
    outboxRepo,
    logger = console,
  }) {
    this.bookmarkRepo = bookmarkRepo;
    this.commentRepo = commentRepo;
    this.downloadRepo = downloadRepo;
    this.documentRepo = documentRepo;
    this.groupDocRepo = groupDocRepo;
    this.groupClient = groupClient;
    this.outboxRepo = outboxRepo;
    this.logger = logger;
  }

  /* ================= ACCESS ================= */
  async canAccess(document_id, user_id) {
    const doc = await this.documentRepo.findById(document_id);
    if (!doc) throw new Error("document_not_found");

    if (doc.visibility === "PUBLIC") return true;
    if (doc.visibility === "PRIVATE") return doc.owner_id === user_id;

    const groups = await this.groupDocRepo.findGroupsByDocument(document_id);
    if (!groups.length) return false;

    for (const g of groups) {
      if (g.status !== "APPROVED") continue;
      const { role } = await this.groupClient.getMembership(
        g.group_id,
        user_id
      );
      if (role) return true;
    }

    return false;
  }

  /* ================= BOOKMARK ================= */
  async isBookmarked(document_id, user_id) {
    return this.bookmarkRepo.isBookmarked(user_id, document_id);
  }

  async toggleBookmark(document_id, user_id) {
    if (!(await this.canAccess(document_id, user_id))) {
      throw new Error("forbidden");
    }

    const exists = await this.bookmarkRepo.isBookmarked(user_id, document_id);

    if (exists) {
      await this.bookmarkRepo.deleteBookmark(document_id, user_id);
      return { bookmarked: false };
    }

    try {
      await this.bookmarkRepo.createBookmark({
        document_id,
        user_id,
        bookmarked_at: new Date(),
      });
    } catch (err) {
      this.logger.warn("bookmark duplicate", err);
    }

    return { bookmarked: true };
  }

  /* ================= COMMENT ================= */
  async addComment(document_id, user_id, content, parent_comment_id = null) {
    if (!(await this.canAccess(document_id, user_id))) {
      throw new Error("forbidden");
    }

    if (!content || !content.trim()) {
      throw new Error("empty_comment");
    }

    if (parent_comment_id) {
      const parent = await this.commentRepo.findById(parent_comment_id);
      if (!parent) throw new Error("parent_comment_not_found");
      if (parent.document_id !== document_id) {
        throw new Error("invalid_parent_comment");
      }
    }

    const row = {
      id: randomUUID(),
      document_id,
      user_id,
      content: content.trim(),
      parent_comment_id,
      created_at: new Date(),
      updated_at: new Date(),
    };

    return this.commentRepo.createComment(row);
  }

  async updateComment(comment_id, user_id, content) {
    if (!content || !content.trim()) throw new Error("empty_comment");

    const comment = await this.commentRepo.findById(comment_id);
    if (!comment) throw new Error("comment_not_found");

    if (comment.user_id !== user_id) throw new Error("forbidden");

    await this.commentRepo.updateById(comment_id, {
      content: content.trim(),
      updated_at: new Date(),
    });

    return { updated: true };
  }

  async deleteComment(comment_id, user_id, isAdmin = false) {
    const comment = await this.commentRepo.findById(comment_id);
    if (!comment) {
      throw new Error("comment_not_found");
    }

    if (!isAdmin) {
      const isCommentOwner = comment.user_id === user_id;

      if (!isCommentOwner) {
        const document = await this.documentRepo.findById(comment.document_id);
        if (!document) {
          throw new Error("document_not_found");
        }
        const isDocumentOwner = document.owner_id === user_id;
        if (!isDocumentOwner) {
          throw new Error("forbidden");
        }
      }
    }

    await this.commentRepo.deleteById(comment_id);

    return { deleted: true };
  }

  async recordDownload(document_id, user_id) {
    if (!(await this.canAccess(document_id, user_id))) {
      throw new Error("forbidden");
    }

    const doc = await this.documentRepo.findById(document_id);
    if (!doc) throw new Error("document_not_found");

    this.logger.info("DOWNLOAD_DOCUMENT_INFO", {
      document_id: doc.id,
      title: doc.title,
      file_name: doc.file_name,
      owner_id: doc.owner_id,
      visibility: doc.visibility,
      storage_path: doc.storage_path,
      request_user: user_id,
      time: new Date().toISOString(),
    });

    try {
      await this.downloadRepo.createDownload({
        id: randomUUID(),
        document_id,
        user_id,
        downloaded_at: new Date(),
      });
    } catch (err) {
      this.logger.warn("download log error", err);
    }

    return doc;
  }

  async approveDocument({ document_id, user_id, group_id }) {
    const document = await this.documentRepo.findById(document_id);
    if (!document) throw new Error("document_not_found");

    const groupDoc = await this.groupDocRepo.findByGroupAndDocument(
      group_id,
      document_id
    );
    if (!groupDoc) throw new Error("group_document_not_found");

    if (groupDoc.status === "APPROVED") {
      return { approved: false, message: "Document already approved" };
    }

    await this.groupClient.validateReviewer({
      group_id,
      reviewer_id: user_id,
    });

    await this.groupDocRepo.approveDocument(groupDoc.id, user_id);

    return { approved: true };
  }

  async rejectDocument({ document_id, user_id, group_id }) {
    const document = await this.documentRepo.findById(document_id);
    if (!document) throw new Error("document_not_found");

    const groupDoc = await this.groupDocRepo.findByGroupAndDocument(
      group_id,
      document_id
    );
    if (!groupDoc) throw new Error("group_document_not_found");

    if (groupDoc.status === "REJECTED") {
      return { approved: false, message: "Document already rejected" };
    }

    await this.groupClient.validateReviewer({
      group_id,
      reviewer_id: user_id,
    });

    await this.groupDocRepo.rejectDocument(groupDoc.id, user_id);

    return { approved: true };
  }
}
