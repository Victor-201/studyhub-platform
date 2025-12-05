import { v4 as uuidv4 } from "uuid";

export class GroupController {
  /**
   * @param {Object} deps
   * @param {import("../services/GroupService.js").GroupService} deps.groupService
   */
  constructor({ groupService }) {
    this.groupService = groupService;
  }

 async createGroup(req, res) {
    try {
      if (!req.body.name) {
        return res.status(400).json({
          success: false,
          message: "Group name is required",
        });
      }

      console.log("Request to create group:", req.user);

      const user_id = req.user.id;

      if (user_id == null) {
        return res.status(400).json({
          success: false,
          message: "User ID is required",
          user: req.user,
        });
      }

      const group = await this.groupService.createGroup({
        name: req.body.name,
        description: req.body.description || null,
        access: req.body.access || "PUBLIC",
        auto_approve_docs: req.body.auto_approve_docs ?? false,
        user_id,
        file: req.file,
        // folder dùng mặc định: "avatars"
      });

      res.status(201).json({
        success: true,
        data: group,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

  async checkMembership(req, res) {
    try {
      const user_id = req.user.id;
      const { group_id } = req.params;

      const { group, role } = await this.groupService.checkMembership(
        group_id,
        user_id
      );

      res.json({
        group: group.toJSON(),
        role,
      });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }

  async getGroup(req, res) {
    try {
      const { id } = req.params;
      const group = await this.groupService.getGroupById(id);
      if (!group)
        return res
          .status(404)
          .json({ success: false, message: "Group not found" });
      res.json({ success: true, data: group });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getGroupsByOwner(req, res) {
    try {
      const owner_id = req.user.id;
      const groups = await this.groupService.getUserOwnedGroups(owner_id);
      res.json({ success: true, data: groups });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async updateGroup(req, res) {
    try {
      const { id } = req.params;
      const group = await this.groupService.updateGroup(id, req.body);
      res.json({ success: true, data: group });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  /** Update avatar using Cloudinary */
  async updateAvatar({ params, file }, res) {
    try {
      if (!file) throw new Error("No avatar file uploaded");
      const updated = await this.groupService.updateAvatar(
        params.group_id,
        file.buffer
      );
      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  async deleteGroup(req, res) {
    try {
      const { id } = req.params;
      await this.groupService.deleteGroup(id);
      res.json({ success: true, message: "Group deleted" });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async requestJoin(req, res) {
    try {
      const user_id = req.user.id;
      const { group_id } = req.params;
      const result = await this.groupService.joinGroup(group_id, user_id);
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async approveJoin(req, res) {
    try {
      const actor_id = req.user.id;
      const { request_id } = req.params;
      const result = await this.groupService.approveJoinRequest(
        request_id,
        actor_id
      );
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async rejectJoin(req, res) {
    try {
      const actor_id = req.user.id;
      const { request_id } = req.params;
      const result = await this.groupService.rejectJoinRequest(
        request_id,
        actor_id
      );
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getPendingRequests(req, res) {
    try {
      const { group_id } = req.params;
      const list = await this.groupService.getPendingRequests(group_id);
      res.json({ success: true, data: list });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getActivityLogs(req, res) {
    try {
      const { group_id } = req.params;
      const logs = await this.groupService.getActivityLogs(group_id);
      res.json({ success: true, data: logs });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async searchGroups(req, res) {
    try {
      const { q, limit, offset } = req.query;
      const groups = await this.groupService.findGroups({
        namePattern: q,
        limit: Number(limit || 20),
        offset: Number(offset || 0),
      });
      res.json({ success: true, data: groups });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
