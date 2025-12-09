// src/services/DocumentInteractionsService.js
import { randomUUID } from "crypto";

export default class DocumentInteractionsService {
  constructor({ bookmarkRepo, commentRepo, downloadRepo, documentRepo, groupDocRepo, groupClient, outboxRepo, logger = console }) {
    this.bookmarkRepo = bookmarkRepo;
    this.commentRepo = commentRepo;
    this.downloadRepo = downloadRepo;
    this.documentRepo = documentRepo;
    this.groupDocRepo = groupDocRepo;
    this.groupClient = groupClient;
    this.outboxRepo = outboxRepo;
    this.logger = logger;
  }

  // ------------------
  // PERMISSION CHECKER
  // ------------------
  async canAccess(document_id, user_id) {
    const doc = await this.documentRepo.findById(document_id);
    if (!doc) throw new Error("document_not_found");

    if (doc.visibility === "PUBLIC") return true;
    if (doc.visibility === "PRIVATE") return doc.owner_id === user_id;

    // GROUP DOC
    const groups = await this.groupDocRepo.findGroupsByDocument(document_id);

    for (const g of groups) {
      if (g.status !== "APPROVED") continue;

      const membership = await this.groupClient.getMembership(g.group_id, user_id);
      if (membership.role) return true;
    }

    return false;
  }

  // ============================================================
  // BOOKMARK
  // ============================================================
  async toggleBookmark(document_id, user_id) {
    if (!(await this.canAccess(document_id, user_id))) {
      throw new Error("forbidden");
    }

    const exists = await this.bookmarkRepo.isBookmarked(user_id, document_id);

    if (exists) {
      await this.bookmarkRepo.deleteBookmark(document_id, user_id);
      await this.outboxRepo.insertEvent("DOCUMENT.UNBOOKMARKED", { document_id, user_id });
      return { bookmarked: false };
    }

    const bookmarked_at = new Date();
    const bookmark = await this.bookmarkRepo.createBookmark({
      document_id,
      user_id,
      bookmarked_at
    });

    await this.outboxRepo.insertEvent("DOCUMENT.BOOKMARKED", { document_id, user_id });
    return { bookmarked: true, bookmark };
  }

  // ============================================================
  // COMMENT
  // ============================================================
  async addComment(document_id, user_id, content, parent_comment_id = null) {
    const allowed = await this.canAccess(document_id, user_id);
    if (!allowed) throw new Error("forbidden");

    if (!content?.trim()) throw new Error("empty_comment");

    const now = new Date();
    const id = randomUUID();

    const comment = await this.commentRepo.createComment({
      id,
      document_id,
      user_id,
      content,
      parent_comment_id: parent_comment_id || null,
      created_at: now,
      updated_at: now
    });

    await this.outboxRepo.insertEvent("DOCUMENT.COMMENTED", {
      document_id,
      comment_id: id,
      user_id
    });

    return comment;
  }

  // ============================================================
  // DELETE COMMENT
  // ============================================================
  async deleteComment(comment_id, user_id) {
    const cmt = await this.commentRepo.findById(comment_id);
    if (!cmt) throw new Error("comment_not_found");

    const doc = await this.documentRepo.findById(cmt.document_id);
    if (!doc) throw new Error("document_not_found");

    const isOwner = cmt.user_id === user_id;

    let isModerator = false;

    // group check moderator
    if (doc.visibility === "GROUP") {
      const groups = await this.groupDocRepo.findGroupsByDocument(doc.id);

      for (const g of groups) {
        const membership = await this.groupClient.getMembership(g.group_id, user_id);
        if (["OWNER", "MODERATOR"].includes(membership.role)) {
          isModerator = true;
        }
      }
    }

    if (!isOwner && !isModerator) throw new Error("forbidden");

    await this.commentRepo.deleteById(comment_id);

    await this.outboxRepo.insertEvent("DOCUMENT.COMMENT_DELETED", {
      document_id: doc.id,
      comment_id,
      deleted_by: user_id
    });

    return true;
  }

  // ============================================================
  // DOWNLOAD RECORD
  // ============================================================
  async recordDownload(document_id, user_id) {
    const allowed = await this.canAccess(document_id, user_id);
    if (!allowed) throw new Error("forbidden");

    await this.downloadRepo.createDownload({
      document_id,
      user_id,
      downloaded_at: new Date()
    });

    await this.outboxRepo.insertEvent("DOCUMENT.DOWNLOADED", { document_id, user_id });

    return true;
  }

  // ============================================================
  // STATS
  // ============================================================
  async getDocumentStats(document_id) {
    const downloads = await this.downloadRepo.countDownloads(document_id);
    const bookmarks = await this.bookmarkRepo.countByDocument(document_id);
    const comments = await this.commentRepo.countByDocument(document_id);

    return {
      document_id,
      downloads,
      bookmarks,
      comments
    };
  }
}
