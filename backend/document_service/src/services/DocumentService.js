import { randomUUID } from "crypto";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export default class DocumentService {
  constructor({
    documentRepo,
    tagRepo,
    groupDocRepo,
    groupClient,
    outboxRepo,
    logger = console,
  }) {
    this.documentRepo = documentRepo;
    this.tagRepo = tagRepo;
    this.groupDocRepo = groupDocRepo;
    this.groupClient = groupClient;
    this.outboxRepo = outboxRepo;
    this.logger = logger;
  }

  /**
   * Create document
   */
  async createDocument({
    owner_id,
    title,
    description,
    visibility = "PUBLIC",
    tags = [],
    group_id = null,
    file,
  }) {
    if (!file) throw new Error("file required");

    const document_id = randomUUID();
    const now = new Date();

    const originalName = file.originalname || "file";
    const ext = originalName.includes(".") ? originalName.split(".").pop() : "";
    const cloudPublicId = `document_${document_id}`;

    // 1) upload to cloud
    const uploaded = await uploadToCloudinary(file.buffer, {
      public_id: cloudPublicId,
      filename: ext ? `${cloudPublicId}.${ext}` : cloudPublicId,
      extension: ext,
    });

    const storage_path = uploaded.secure_url;

    // 2) save document in DB
    let doc;
    try {
      doc = await this.documentRepo.create({
        id: document_id,
        owner_id,
        title,
        description,
        visibility,
        storage_path,
        created_at: now,
        updated_at: now,
      });
    } catch (err) {
      // Attempt best-effort cleanup of uploaded file if util supports it (non-fatal)
      try {
        if (typeof uploadToCloudinary.delete === "function") {
          await uploadToCloudinary.delete(cloudPublicId);
        }
      } catch (cleanupErr) {
        this.logger.warn("failed to cleanup uploaded cloud file", cleanupErr);
      }
      throw err;
    }

    // 3) handle group visibility
    let groupRecord = null;
    if (visibility === "GROUP") {
      if (!group_id) throw new Error("group_id required for GROUP visibility");

      const membership = await this.groupClient.getMembership(
        group_id,
        owner_id
      );
      if (!membership || !membership.role)
        throw new Error("forbidden_not_group_member");

      const { autoApprove } = await this.groupClient.evaluateDocumentApproval({
        group_id,
        requester_id: owner_id,
      });

      const status = autoApprove ? "APPROVED" : "PENDING";

      groupRecord = await this.groupDocRepo.createRecord({
        id: randomUUID(),
        group_id,
        document_id,
        status,
        submitted_by: owner_id,
        reviewed_by: autoApprove ? owner_id : null,
        submitted_at: now,
        reviewed_at: autoApprove ? now : null,
      });
    }

    // 4) tags
    if (
      tags &&
      tags.length > 0 &&
      this.tagRepo &&
      typeof this.tagRepo.attachTags === "function"
    ) {
      await this.tagRepo.attachTags(document_id, tags);
    }

    // 5) outbox
    if (this.outboxRepo && typeof this.outboxRepo.insertEvent === "function") {
      await this.outboxRepo.insertEvent("DOCUMENT.CREATED", {
        document_id,
        owner_id,
        visibility,
      });
    }

    return { document: doc, groupRecord };
  }

  // Guest feed: chỉ PUBLIC
  async getPublicFeed(limit = 20, offset = 0) {
    return await this.documentRepo.findPublic(limit, offset);
  }

  // Home feed cho user: PUBLIC + GROUP APPROVED + PRIVATE của user
  async getUserFeed(user_id, { limit = 50, offset = 0 } = {}) {
    // Use repository method that already merges rules and limits N+1 queries
    return await this.documentRepo.findHomeFeed({
      userId: user_id,
      limit,
      offset,
    });
  }

  // My documents
  async getMyDocuments(owner_id, { limit = 50, offset = 0 } = {}) {
    return await this.documentRepo.findAllOfOwner(owner_id, { limit, offset });
  }

async getUserPublicProfileDocuments(target_user_id, { limit = 50, offset = 0 } = {}) {
  // 1) PUBLIC của user
  const publicDocs = await this.documentRepo.findPublicOfUser(target_user_id, { limit, offset });

  // 2) GROUP APPROVED user đã đăng
  const groupRows = await this.groupDocRepo.findApprovedByUser(target_user_id, { limit, offset });

  const publicGroupDocs = [];

  for (const row of groupRows) {
    const g = row.groupDoc.group_id;

    try {
      // dùng GroupService để check visibility
      const membership = await this.groupClient.getMembership(g, target_user_id);

      if (membership?.group?.visibility === "PUBLIC") {
        publicGroupDocs.push(row.document);
      }
    } catch (err) {
      // nhóm không truy cập được → coi như không public
      this.logger.debug("skip group doc visibility check", err.message);
    }
  }

  // Hợp nhất
  return [...publicDocs, ...publicGroupDocs];
}

  // Approved documents trong tất cả groups
  async getApprovedDocuments({ limit = 50, offset = 0 } = {}) {
    return await this.groupDocRepo.findApprovedDocuments({ limit, offset });
  }

  // Approved documents trong 1 group
  async getGroupApproved(group_id, { limit = 50, offset = 0 } = {}) {
    return await this.groupDocRepo.findApprovedInGroup(group_id, {
      limit,
      offset,
    });
  }

  // Pending docs trong 1 group (mod/owner)
  async getGroupPending(
    group_id,
    reviewer_id,
    { limit = 50, offset = 0 } = {}
  ) {
    await this.groupClient.validateReviewer({ group_id, reviewer_id });
    return await this.groupDocRepo.findPendingInGroup(group_id, {
      limit,
      offset,
    });
  }

  // VIEW DOCUMENT DETAIL (CHECK ACCESS RULES)
  async getDocumentDetail(document_id, requester_id = null) {
    const doc = await this.documentRepo.findById(document_id);
    if (!doc) throw new Error("document_not_found");

    // PUBLIC always allowed
    if (doc.visibility === "PUBLIC") {
      return doc;
    }

    // PRIVATE -> only owner
    if (doc.visibility === "PRIVATE") {
      if (requester_id === doc.owner_id) return doc;
      throw new Error("forbidden");
    }

    // GROUP -> check group membership + approved state
    if (doc.visibility === "GROUP") {
      const groups = await this.groupDocRepo.findGroupsByDocument(document_id);

      for (const g of groups) {
        try {
          const membership = await this.groupClient.getMembership(
            g.group_id,
            requester_id
          );
          if (!membership || !membership.role) continue;

          // must be APPROVED
          if (g.status === "APPROVED") return doc;
        } catch (e) {
          // ignore per-group errors and continue checking others
          this.logger.debug("group membership check error", e);
        }
      }

      throw new Error("forbidden");
    }

    return doc;
  }

  // UPDATE DOCUMENT (ONLY OWNER)
  async updateDocument(document_id, user_id, updates = {}) {
    const doc = await this.documentRepo.findById(document_id);
    if (!doc) throw new Error("document_not_found");

    if (doc.owner_id !== user_id) throw new Error("forbidden");

    const updated = await this.documentRepo.update(document_id, updates);

    if (this.outboxRepo && typeof this.outboxRepo.insertEvent === "function") {
      await this.outboxRepo.insertEvent("DOCUMENT.UPDATED", {
        document_id,
        updated_by: user_id,
      });
    }

    return updated;
  }

  // DELETE DOCUMENT (OWNER OR GROUP MOD)
  async deleteDocument(document_id, user_id) {
    const doc = await this.documentRepo.findById(document_id);
    if (!doc) throw new Error("document_not_found");

    // PERSONAL VISIBILITY (PUBLIC or PRIVATE)
    if (doc.visibility !== "GROUP") {
      if (doc.owner_id !== user_id) throw new Error("forbidden");

      await this.documentRepo.deleteById(document_id);

      if (
        this.outboxRepo &&
        typeof this.outboxRepo.insertEvent === "function"
      ) {
        await this.outboxRepo.insertEvent("DOCUMENT.DELETED", {
          document_id,
          deleted_by: user_id,
        });
      }

      return true;
    }

    // GROUP DOCUMENT
    const groups = await this.groupDocRepo.findGroupsByDocument(document_id);

    for (const g of groups) {
      const membership = await this.groupClient.getMembership(
        g.group_id,
        user_id
      );

      const isPrivileged =
        membership &&
        (membership.role === "OWNER" || membership.role === "MODERATOR");
      const isSubmitter = g.submitted_by === user_id;

      if (isPrivileged || isSubmitter) {
        await this.documentRepo.deleteById(document_id);

        if (
          this.outboxRepo &&
          typeof this.outboxRepo.insertEvent === "function"
        ) {
          await this.outboxRepo.insertEvent("DOCUMENT.DELETED", {
            document_id,
            deleted_by: user_id,
            group_id: g.group_id,
          });
        }
        return true;
      }
    }

    throw new Error("forbidden");
  }

  // SEARCH DOCUMENTS
  // (PUBLIC + PRIVATE(owner) + GROUP(approved + member))
  async searchDocuments(params, requester_id, limit = 50) {
    const page = Number(params.page) || 1;
    params.limit = params.limit || limit;
    params.page = page;

    const results = await this.documentRepo.search(params);

    // filter by access rules (but number of results limited)
    const filtered = [];
    for (const doc of results) {
      try {
        const allowed = await this.getDocumentDetail(doc.id, requester_id);
        if (allowed) filtered.push(doc);
      } catch {}
    }

    return filtered;
  }
}
