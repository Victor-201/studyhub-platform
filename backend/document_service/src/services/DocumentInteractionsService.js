import { randomUUID } from "crypto";
import { buildDownloadUrl } from "../utils/cloudinary.js";

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

  async deleteComment(comment_id, user_id) {
    const comment = await this.commentRepo.findById(comment_id);
    if (!comment) throw new Error("comment_not_found");

    const document = await this.documentRepo.findById(comment.document_id);
    if (!document) throw new Error("document_not_found");

    const isCommentOwner = comment.user_id === user_id;
    const isDocumentOwner = document.owner_id === user_id;

    if (!isCommentOwner && !isDocumentOwner) {
      throw new Error("forbidden");
    }

    await this.commentRepo.deleteComment(comment_id);
    return { deleted: true };
  }

  async getCommentsByDocument(document_id, { limit = 10, offset = 0 }) {
    // 1️⃣ Lấy comment mới nhất theo limit + offset
    const latestComments = await this.commentRepo.findByDocumentPaginated(
      document_id,
      { limit, offset }
    );

    const allCommentsMap = new Map();

    // 2️⃣ Lấy cha đến root nếu có
    const fetchParentChain = async (comment) => {
      const chain = [];
      let current = comment;

      while (current.parent_comment_id) {
        if (allCommentsMap.has(current.parent_comment_id)) {
          chain.push(allCommentsMap.get(current.parent_comment_id));
          break;
        }

        const parent = await this.commentRepo.findById(
          current.parent_comment_id
        );
        if (!parent) break;

        chain.push(parent);
        allCommentsMap.set(parent.id, parent);
        current = parent;
      }

      return chain.reverse(); // từ gốc → cha
    };

    // 3️⃣ Ghép cha + con
    const results = [];
    for (const c of latestComments) {
      const parents = await fetchParentChain(c);
      results.push(...parents, c);
    }

    // 4️⃣ Loại trùng (nếu nhiều comment share cha)
    const unique = [];
    const seen = new Set();
    for (const c of results) {
      if (!seen.has(c.id)) {
        unique.push(c);
        seen.add(c.id);
      }
    }

    return unique;
  }

  async getAllComments({ limit, offset }) {
    return this.commentRepo.findAllPaginated({ limit, offset });
  }

  /* ================= DOWNLOAD ================= */
  async recordDownload(document_id, user_id) {
    if (!(await this.canAccess(document_id, user_id))) {
      throw new Error("forbidden");
    }

    const doc = await this.documentRepo.findById(document_id);

    try {
      await this.downloadRepo.createDownload({
        document_id,
        user_id,
        downloaded_at: new Date(),
      });
    } catch {}

    return buildDownloadUrl(doc);
  }
}
