import axios from "axios";
import { env } from "../config/env.js";

export default class GroupServiceClient {
  constructor({ baseURL = env.GroupService, logger = console } = {}) {
    this.logger = logger;
    this.baseURL = baseURL;

    this.http = axios.create({
      baseURL,
      timeout: 5000,
    });
  }

  async getUserGroups(token, user_id) {
    try {
      const res = await this.http.get(`/api/v1/group/user/${user_id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return Array.isArray(res.data?.data) ? res.data.data : [];
    } catch (err) {
      this.logger.error(
        "GroupServiceClient.getUserGroups error:",
        err.response?.data || err.message
      );
      return [];
    }
  }

  async getMembership(group_id, user_id) {
    try {
      const res = await this.http.get(`/api/v1/group/${group_id}/membership`, {
        headers: { "x-user-id": user_id },
      });

      const group = res.data?.data?.group || null;
      const role = group?.role || null;

      return { group, role };
    } catch (err) {
      this.logger.error(
        "GroupServiceClient.getMembership error:",
        err.response?.data || err.message
      );
      throw err;
    }
  }

  async canViewGroupDocuments(group_id, user_id) {
    try {
      const { group, role } = await this.getMembership(group_id, user_id);
      if (!group) throw new Error("group_not_found");

      if (group.access === "PUBLIC") return { allowed: true };

      if (role) return { allowed: true };

      return { allowed: false, reason: "forbidden" };
    } catch (err) {
      this.logger.error(
        "canViewGroupDocuments error:",
        err.response?.data || err.message
      );
      return { allowed: false, reason: err.message || "group_service_error" };
    }
  }

  async evaluateDocumentApproval({ group_id, requester_id }) {
    const { group, role } = await this.getMembership(group_id, requester_id);

    if (!group) throw new Error("group_not_found");

    const autoApprove =
      Number(group?.auto_approve_docs) === 1 ||
      ["OWNER", "MODERATOR"].includes(role);

    return {
      autoApprove,
    };
  }

  async validateReviewer({ group_id, reviewer_id }) {
    const { role } = await this.getMembership(group_id, reviewer_id);

    if (!["OWNER", "MODERATOR"].includes(role)) {
      const err = new Error("reviewer_not_permitted");
      err.status = 403;
      throw err;
    }

    return true;
  }

  async canShareDocumentToGroup(group_id, user_id) {
    try {
      const approval = await this.evaluateDocumentApproval({
        group_id,
        requester_id: user_id,
      });

      return { allowed: true, ...approval };
    } catch (err) {
      return {
        allowed: false,
        reason: err.message || "group_service_error",
      };
    }
  }
}
