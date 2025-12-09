// src/integrations/GroupServiceClient.js
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

async getMembership(group_id, user_id) {
  try {
    const res = await this.http.get(`/api/v1/group/${group_id}/membership`, {
      headers: { "x-user-id": user_id }
    });

    return {
      group: res.data.group,
      role: res.data.role,
    };
  } catch (err) {
    this.logger.error(
      "GroupServiceClient.getMembership error:",
      err.response?.data || err.message
    );
    throw err;
  }
}

  async evaluateDocumentApproval({ group_id, requester_id }) {
    const { group, role } = await this.getMembership(group_id, requester_id);
    const autoApprove = Number(group?.auto_approve_docs) === 1;

    if (autoApprove || role === "OWNER" || role === "MODERATOR") {
      return {
        autoApprove: true,
        requireReview: false,
        reviewer_id: requester_id
      };
    }

    return {
      autoApprove: false,
      requireReview: true,
      reviewer_id: null
    };
  }

  async validateReviewer({ group_id, reviewer_id }) {
    const { role } = await this.getMembership(group_id, reviewer_id);

    if (role !== "OWNER" && role !== "MODERATOR") {
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
        requester_id: user_id
      });

      return { allowed: true, ...approval };
    } catch (err) {
      return {
        allowed: false,
        reason: err.message || "group_service_error"
      };
    }
  }
}
