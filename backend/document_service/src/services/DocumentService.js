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

      tag: tags.map((t) => t.tag),

      stats: {
        comments: commentCount,
        bookmarks: bookmarkCount,
        downloads: downloadCount,
      },

      storage_path: doc.storage_path,
      preview_url: buildPreviewUrl(doc),
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
      if (g.status !== "APPROVED") continue;

      try {
        const { allowed } = await this.groupClient.canViewGroupDocuments(
          g.group_id,
          user_id
        );
        if (allowed) return true;
      } catch (err) {
        this.logger.error("Error checking group access:", err.message);
      }
    }

    return false;
  }

  /* ================= CREATE ================= */
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
      storage_path: uploaded.secure_url,
      created_at: now,
      updated_at: now,
    });

    if (tags?.length) {
      await this.tagRepo.attachTags(document_id, tags);
    }

    if (visibility === "GROUP") {
      if (!group_id) throw new Error("group_id_required");

      const membership = await this.groupClient.getMembership(
        group_id,
        owner_id
      );
      if (!membership?.role) throw new Error("forbidden");

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

  /* ================= COUNTS ================= */
  async count() {
    const countDocuments = await this.documentRepo.countAllDocuments();
    const countComments = await this.commentRepo.countAllComments();
    return { countDocuments, countComments };
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
  async getDocumentDetail(document_id, requester_id = null) {
    const doc = await this.documentRepo.findById(document_id);
    if (!doc) throw new Error("document_not_found");

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

  /* ================= GROUP ================= */
  async getApprovedDocuments({ limit = 50, offset = 0 } = {}) {
    const docs = await this.groupDocRepo.findApprovedDocuments({
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

  /* ================= SEARCH ================= */
  async searchDocuments(params, requester_id, limit = 50) {
    params.page = Number(params.page) || 1;
    params.limit = params.limit || limit;

    const results = await this.documentRepo.search(params);

    const filtered = [];
    for (const doc of results) {
      try {
        await this.getDocumentDetail(doc.id, requester_id);
        filtered.push(doc);
      } catch {}
    }

    return this._attachTagsToDocuments(filtered);
  }

  /* ================= TAGS ================= */
  async getAllTags() {
    return await this.tagRepo.getAllTags();
  }
}
