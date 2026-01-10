import { randomUUID } from "crypto";
import { uploadToCloudinary, buildPreviewUrl } from "../utils/cloudinary.js";

export default class DocumentService {
  constructor({
    documentRepo,
    tagRepo,
    commentRepo,
    bookmarkRepo,
    downloadRepo,
    groupDocRepo,
    groupClient,
    outboxRepo,
    logger = console,
  }) {
    this.documentRepo = documentRepo;
    this.tagRepo = tagRepo;
    this.commentRepo = commentRepo;
    this.bookmarkRepo = bookmarkRepo;
    this.downloadRepo = downloadRepo;
    this.groupDocRepo = groupDocRepo;
    this.groupClient = groupClient;
    this.outboxRepo = outboxRepo;
    this.logger = logger;
  }

  /* ================= TAG HELPERS ================= */
  async _attachTagsToDocument(doc) {
    if (!doc) return null;

    const [tags, commentCount, bookmarkCount, downloadCount] =
      await Promise.all([
        this.tagRepo.findByDocument(doc.id),
        this.commentRepo.countComments(doc.id),
        this.bookmarkRepo.countBookmarks(doc.id),
        this.downloadRepo.countDownloads(doc.id),
      ]);

    return {
      id: doc.id,
      owner_id: doc.owner_id,
      title: doc.title,
      description: doc.description,
      visibility: doc.visibility,
      group_id: doc.group_id,

      tag: tags.map((t) => t.tag),

      stats: {
        comments: commentCount,
        bookmarks: bookmarkCount,
        downloads: downloadCount,
      },

      file_name: doc.file_name,
      storage_path: doc.storage_path,
      created_at: doc.created_at,
      updated_at: doc.updated_at,
    };
  }

  async _attachTagsToDocuments(docs = []) {
    return Promise.all(docs.map((d) => this._attachTagsToDocument(d)));
  }

  /* ================= GROUP ACCESS ================= */
  async _canAccessGroupDocument(document_id, user_id) {
    const groups = await this.groupDocRepo.findGroupsByDocument(document_id);

    for (const g of groups) {
      try {
        if (g.status === "APPROVED") {
          const { allowed } = await this.groupClient.canViewGroupDocuments(
            g.group_id,
            user_id
          );
          if (allowed) return true;
        } else {
          try {
            await this.groupClient.validateReviewer({
              group_id: g.group_id,
              reviewer_id: user_id,
            });
            return true;
          } catch {
            continue;
          }
        }
      } catch (err) {
        this.logger.error("Error checking group access:", err.message);
      }
    }

    return false;
  }

  async createDocument({
    owner_id,
    title,
    description,
    visibility = "PUBLIC",
    tags = [],
    group_id = null,
    file,
  }) {
    if (!file) throw new Error("file_required");

    const document_id = randomUUID();
    const now = new Date();

    const originalFileName = file.originalname;
    const ext = file.originalname?.split(".").pop()?.toLowerCase() || "";
    const publicId = `document_${document_id}`;

    const uploaded = await uploadToCloudinary(file.buffer, {
      public_id: publicId,
      filename: ext ? `${publicId}.${ext}` : publicId,
    });

    const doc = await this.documentRepo.create({
      id: document_id,
      owner_id,
      title,
      description,
      visibility,
      file_name: originalFileName,
      storage_path: uploaded.secure_url,
      created_at: now,
      updated_at: now,
    });

    if (tags?.length) {
      await this.tagRepo.attachTags(document_id, tags);
    }

    if (visibility === "GROUP") {
      if (!group_id) throw new Error("group_id_required");

      const { autoApprove } = await this.groupClient.evaluateDocumentApproval({
        group_id,
        requester_id: owner_id,
      });

      await this.groupDocRepo.createRecord({
        id: randomUUID(),
        group_id,
        document_id,
        status: autoApprove ? "APPROVED" : "PENDING",
        submitted_by: owner_id,
        reviewed_by: autoApprove ? owner_id : null,
        submitted_at: now,
        reviewed_at: autoApprove ? now : null,
      });
    }

    return this._attachTagsToDocument(doc);
  }

  async countDocuments() {
    const countDocuments = await this.documentRepo.countAllDocuments();
    return { countDocuments };
  }

  async countComments() {
    const countComments = await this.commentRepo.countAllComments();
    return { countComments };
  }
  /* ================= FEEDS ================= */
  async getPublicFeed({ limit = 50, offset = 0 }) {
    const docs = await this.documentRepo.findPublicFeed({ limit, offset });
    return this._attachTagsToDocuments(docs);
  }

  async getHomeFeed(user_id, token, { limit = 50, offset = 0 }) {
    if (!user_id) {
      const docs = await this.documentRepo.findPublicFeed({ limit, offset });
      return this._attachTagsToDocuments(docs);
    }

    let groups = [];
    try {
      groups = await this.groupClient.getUserGroups(token, user_id);
    } catch {}

    const groupIds = groups.map((g) => g.group_id);

    const docs = await this.documentRepo.findHomeFeed({
      user_id,
      groupIds,
      limit,
      offset,
    });

    return this._attachTagsToDocuments(docs);
  }

  async getMyDocuments(owner_id, { limit = 50, offset = 0 } = {}) {
    const docs = await this.documentRepo.findAllOfOwner(owner_id, {
      limit,
      offset,
    });
    return this._attachTagsToDocuments(docs);
  }

  async getUserPublicProfileDocuments(
    user_id,
    { limit = 50, offset = 0 } = {}
  ) {
    const docs = await this.documentRepo.findPublicOfUser(user_id, {
      limit,
      offset,
    });
    return this._attachTagsToDocuments(docs);
  }
  /* ================= DETAIL ================= */
  async getDocumentDetail(document_id, requester_id = null, isAdmin = false) {
    const doc = await this.documentRepo.findById(document_id);
    if (!doc) throw new Error("document_not_found");

    if (isAdmin) {
      return this._attachTagsToDocument(doc);
    }

    if (doc.visibility === "PUBLIC") {
      return this._attachTagsToDocument(doc);
    }

    if (doc.visibility === "PRIVATE") {
      if (doc.owner_id !== requester_id) throw new Error("forbidden");
      return this._attachTagsToDocument(doc);
    }

    if (doc.visibility === "GROUP") {
      const allowed = await this._canAccessGroupDocument(
        document_id,
        requester_id
      );
      if (!allowed) throw new Error("forbidden");
      return this._attachTagsToDocument(doc);
    }

    return this._attachTagsToDocument(doc);
  }

  /* ================= PREVIEW ================= */
  async getDocumentPreview(document_id, requester_id = null, isAdmin = false) {
    const doc = await this.documentRepo.findById(document_id);
    if (!doc) throw new Error("document_not_found");

    if (isAdmin) {
      return {
        document_id: doc.id,
        preview_url: buildPreviewUrl(doc),
      };
    }

    if (doc.visibility === "PUBLIC") {
      return {
        document_id: doc.id,
        preview_url: buildPreviewUrl(doc),
      };
    }

    if (doc.visibility === "PRIVATE") {
      if (doc.owner_id !== requester_id) throw new Error("forbidden");

      return {
        document_id: doc.id,
        preview_url: buildPreviewUrl(doc),
      };
    }

    if (doc.visibility === "GROUP") {
      const allowed = await this._canAccessGroupDocument(
        document_id,
        requester_id
      );
      if (!allowed) throw new Error("forbidden");

      return {
        document_id: doc.id,
        preview_url: buildPreviewUrl(doc),
      };
    }

    throw new Error("forbidden");
  }

  /* ================= GROUP ================= */
  async getApprovedDocuments({ limit = 50, offset = 0 } = {}) {
    const docs = await this.documentRepo.findAllDocuments({
      limit,
      offset,
    });
    return this._attachTagsToDocuments(docs);
  }

  /* ================= GROUP ================= */
  async getGroupApproved(
    group_id,
    requester_id,
    { limit = 50, offset = 0 } = {}
  ) {
    const { allowed, reason } = await this.groupClient.canViewGroupDocuments(
      group_id,
      requester_id
    );

    if (!allowed) throw new Error(reason || "forbidden");

    const docs = await this.groupDocRepo.findApprovedInGroup(group_id, {
      limit,
      offset,
    });
    return this._attachTagsToDocuments(docs);
  }

  async getGroupPending(
    group_id,
    requester_id,
    { limit = 50, offset = 0 } = {}
  ) {
    const { allowed, reason } = await this.groupClient.canViewGroupDocuments(
      group_id,
      requester_id
    );

    if (!allowed) throw new Error(reason || "forbidden");

    const docs = await this.groupDocRepo.findPendingInGroup(group_id, {
      limit,
      offset,
    });
    return this._attachTagsToDocuments(docs);
  }

  /* ================= UPDATE ================= */
  async updateDocument(document_id, requester_id, updates) {
    const doc = await this.documentRepo.findById(document_id);
    if (!doc) throw new Error("document_not_found");
    if (doc.owner_id !== requester_id) throw new Error("forbidden");

    const updated = await this.documentRepo.update(document_id, {
      ...updates,
      updated_at: new Date(),
    });

    if (updates.tags) {
      await this.tagRepo.deleteAllTags(document_id);
      await this.tagRepo.attachTags(document_id, updates.tags);
    }

    return this._attachTagsToDocument(updated);
  }

  /* ================= DELETE ================= */
  async deleteDocument(document_id, requester_id) {
    const doc = await this.documentRepo.findById(document_id);
    if (!doc) throw new Error("document_not_found");
    if (doc.owner_id !== requester_id) throw new Error("forbidden");

    await this.tagRepo.deleteAllTags(document_id);
    await this.documentRepo.deleteById(document_id);
  }

  async searchDocuments(
    keyword,
    requester_id,
    { limit = 10, offset = 0 } = {}
  ) {
    if (!keyword) return [];

    const results = await this.documentRepo.searchByKeyword(
      keyword,
      limit,
      offset
    );
    if (!results || results.length === 0) return [];

    const filtered = [];
    const groupCache = {};

    for (const doc of results) {
      try {
        if (doc.visibility === "PUBLIC") {
          filtered.push(doc);
          continue;
        }

        if (doc.visibility === "PRIVATE") {
          if (doc.owner_id === requester_id) filtered.push(doc);
          continue;
        }

        if (doc.visibility === "GROUP") {
          const groups = await this.groupDocRepo.findGroupsByDocument(doc.id);
          let allowed = false;

          for (const g of groups) {
            try {
              if (g.status === "APPROVED") {
                if (!groupCache[g.group_id]) {
                  groupCache[g.group_id] =
                    await this.groupClient.canViewGroupDocuments(
                      g.group_id,
                      requester_id
                    );
                }
                if (groupCache[g.group_id].allowed) {
                  allowed = true;
                  break;
                }
              } else {
                // reviewer check
                await this.groupClient.validateReviewer({
                  group_id: g.group_id,
                  reviewer_id: requester_id,
                });
                allowed = true;
                break;
              }
            } catch {
              // nếu lỗi check quyền, bỏ luôn document này
              allowed = false;
              throw new Error(`Cannot access group ${g.group_id}`);
            }
          }

          if (allowed) filtered.push(doc);
        }
      } catch (err) {
        this.logger.error(
          `Skipping doc ${doc.id} due to group check error: ${err.message}`
        );
        continue; // bỏ doc này, tiếp tục vòng lặp
      }
    }

    return filtered;
  }

  /* ================= TAGS ================= */
  async getAllTags() {
    return await this.tagRepo.getAllTags();
  }

  async getCommentsByDocument(document_id, { limit = 10, offset = 0 }) {
    const latestComments = await this.commentRepo.findByDocumentPaginated(
      document_id,
      { limit, offset }
    );

    const allCommentsMap = new Map();

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

      return chain.reverse();
    };

    const results = [];
    for (const c of latestComments) {
      const parents = await fetchParentChain(c);
      results.push(...parents, c);
    }

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

  async getAllComments({ limit = 50, offset = 0 } = {}) {
    limit = Number.isInteger(+limit) ? Number(limit) : 50;
    offset = Number.isInteger(+offset) ? Number(offset) : 0;

    const comments = await this.commentRepo.findAllPaginated({ limit, offset });
    const total = await this.commentRepo.countAllComments();

    return {
      data: comments.map((c) => c.toJSON()),
      pagination: { limit, offset, total },
    };
  }
}
