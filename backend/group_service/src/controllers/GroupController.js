export class GroupController {
  /**
   * @param {Object} deps
   * @param {import("../services/GroupService.js").GroupService} deps.groupService
   */
  constructor({ groupService }) {
    this.groupService = groupService;
  }

  // 1. CREATE GROUP
  async createGroup(req, res) {
    try {
      const { name, description, access, auto_approve_docs } = req.body;
      const user_id = req.user?.id;
      const file = req.file || null;

      if (!name)
        return res
          .status(400)
          .json({ success: false, message: "Group name is required" });
      if (!user_id)
        return res
          .status(401)
          .json({ success: false, message: "Unauthorized" });

      const autoApprove =
        auto_approve_docs === true ||
        auto_approve_docs === "true" ||
        auto_approve_docs === 1 ||
        auto_approve_docs === "1";

      const group = await this.groupService.createGroup({
        name,
        description: description || null,
        access: access || "PUBLIC",
        auto_approve_docs: autoApprove ? 1 : 0,
        user_id,
        file,
      });

      res.status(201).json({ success: true, data: group });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }

  // 2. CHECK MEMBERSHIP
  async checkMembership(req, res) {
    try {
      const { group_id } = req.params;
      const user_id = req.header("x-user-id");

      const result = await this.groupService.checkMembership(group_id, user_id);
      res.json({ success: true, data: result });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }

  // 3. UPDATE GROUP INFO (name, description, access, auto_approve_docs)
  async updateGroup(req, res) {
    try {
      const { group_id } = req.params;
      const data = req.body;
      const updated = await this.groupService.updateGroup(group_id, data);
      res.json({ success: true, data: updated });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }

  // 4. UPDATE AVATAR
  async updateAvatar(req, res) {
    try {
      const { group_id } = req.params;
      const file = req.file;

      if (!file) throw new Error("No avatar file uploaded");

      const updated = await this.groupService.updateAvatar(group_id, file);

      res.json({ success: true, data: updated });
    } catch (err) {
      res.status(err.status || 500).json({
        success: false,
        message: err.message,
      });
    }
  }

  // 5. DELETE GROUP
  async deleteGroup(req, res) {
    try {
      const { group_id } = req.params;
      const actor_id = req.user.id;

      await this.groupService.deleteGroup(group_id, actor_id);
      res.json({ success: true });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }

  // 6-9. LIST GROUPS
  async getGroupDetail(req, res, next) {
    try {
      const { group_id } = req.params;
      const user_id = req.user.id;

      const group = await this.groupService.getGroupDetail(group_id, user_id);

      res.json({
        success: true,
        data: group,
      });
    } catch (err) {
      next(err);
    }
  }

  async listGroupsByUser(req, res) {
    try {
      const viewerId = req.user.id;
      const targetUserId = req.params.user_id;

      let result;

      if (viewerId === targetUserId) {
        result = await this.groupService.listGroupsByUser(targetUserId);
      } else {
        result = await this.groupService.listGroupsByUser(targetUserId, {
          publicOnly: true,
        });
      }

      res.json({ success: true, data: result });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }

  async listOwnedGroups(req, res) {
    try {
      const user_id = req.user.id;
      const result = await this.groupService.listOwnedGroups(user_id);
      res.json({ success: true, data: result });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }

  async findGroups(req, res) {
    try {
      const { name, access, limit, offset } = req.query;
      const user_id = req.user?.id;

      const limitNum = Number(limit) || 50;
      const offsetNum = Number(offset) || 0;

      const result = await this.groupService.findGroups(
        {
          name,
          access,
          limit: limitNum,
          offset: offsetNum,
        },
        user_id
      );

      res.json({ success: true, data: result });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }

  async listGroupsNotJoined(req, res) {
    try {
      const user_id = req.user.id;
      const { limit, offset } = req.query;

      const limitNum = Number(limit) || 50;
      const offsetNum = Number(offset) || 0;

      const result = await this.groupService.listGroupsNotJoined(user_id, {
        limit: limitNum,
        offset: offsetNum,
      });

      res.json({ success: true, data: result });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }

  // ADMIN
  async countGroups(req, res) {
    try {
      const result = await this.groupService.countGroups();
      res.json({ success: true, data: result });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }
  
  async getAllGroups(req, res) {  
    try {
      const { limit, offset } = req.query;
      const limitNum = Number(limit) || 50;
      const offsetNum = Number(offset) || 0;
      const result = await this.groupService.getAllGroups({ limit: limitNum, offset: offsetNum });
      res.json({ success: true, data: result });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }   
  }

  // 14-18. JOIN GROUP / REQUEST
  async joinGroup(req, res) {
    try {
      const { group_id } = req.params;
      const user_id = req.user.id;

      const result = await this.groupService.joinGroup(group_id, user_id);
      res.json({ success: true, data: result });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }

  async cancelJoinRequest(req, res) {
    try {
      const { group_id } = req.params;
      const user_id = req.user.id;

      await this.groupService.cancelJoinRequest(group_id, user_id);
      res.json({ success: true });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }

  async approveJoin(req, res) {
    try {
      const { request_id } = req.params;
      const actor_id = req.user.id;

      const result = await this.groupService.approveJoinRequest(
        request_id,
        actor_id
      );
      res.json({ success: true, data: result });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }

  async rejectJoin(req, res) {
    try {
      const { request_id } = req.params;
      const actor_id = req.user.id;

      const result = await this.groupService.rejectJoinRequest(
        request_id,
        actor_id
      );
      res.json({ success: true, data: result });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }

  // 19. INVITE MEMBER
  async inviteMember(req, res) {
    try {
      const { group_id } = req.params;
      const target_id = req.body.user_id;
      const actor_id = req.user.id;

      const result = await this.groupService.inviteMember(
        group_id,
        target_id,
        actor_id
      );
      res.json({ success: true, data: result });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }

  async isJoinPending(req, res) {
    try {
      const { group_id } = req.params;
      const user_id = req.user.id;
      const result = await this.groupService.isJoinPending(group_id, user_id);
      res.json({ success: true, data: { is_pending: result } });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }

  // 20. GET ACTIVITY LOGS
  async getActivityLogs(req, res) {
    try {
      const { group_id } = req.params;
      const { action, limit, offset } = req.query;

      const limitNum = Number(limit) || 50;
      const offsetNum = Number(offset) || 0;

      const logs = await this.groupService.getActivityLogs(group_id, action, {
        limit: limitNum,
        offset: offsetNum,
      });

      res.json({ success: true, data: logs });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }
}
