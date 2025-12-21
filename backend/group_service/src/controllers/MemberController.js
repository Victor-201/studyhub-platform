export class MemberController {
  /**
   * @param {Object} deps
   * @param {import("../services/MemberService.js").MemberService} deps.memberService
   */
  constructor({ memberService }) {
    this.memberService = memberService;
  }

  // 10. LIST MEMBERS
  async listMembers(req, res) {
    try {
      const { group_id } = req.params;
      const { role, limit, offset } = req.query;

      const limitNum = Number(limit) || 50;
      const offsetNum = Number(offset) || 0;

      const members = await this.memberService.listMembers(group_id, role, {
        limit: limitNum,
        offset: offsetNum,
      });

      res.json({ success: true, data: members });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }

  // 11. LEAVE GROUP
  async leaveGroup(req, res) {
    try {
      const { group_id } = req.params;
      const user_id = req.user.id;

      await this.memberService.leaveGroup(group_id, user_id);
      res.json({ success: true });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }

  // 12. KICK MEMBER
  async kickMember(req, res) {
    try {
      const { group_id, user_id: target_id } = req.params;
      const actor_id = req.user.id;

      await this.memberService.kickMember(group_id, target_id, actor_id);
      res.json({ success: true });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }

  // 13. CHANGE ROLE
  async changeRole(req, res) {
    try {
      const { group_id, user_id: target_id } = req.params;
      const { role } = req.body;
      const actor_id = req.user.id;

      const result = await this.memberService.changeRole(
        group_id,
        target_id,
        role,
        actor_id
      );
      res.json({ success: true, data: result });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }

  // TRANSFER OWNERSHIP
  async transferOwnership(req, res) {
    try {
      const { group_id, new_owner_id: target_id } = req.params;
      const actor_id = req.user.id;

      const result = await this.memberService.changeRole(
        group_id,
        target_id,
        "OWNER",
        actor_id
      );
      res.json({ success: true, data: result });
    } catch (err) {
      res
        .status(err.status || 500)
        .json({ success: false, message: err.message });
    }
  }
}
