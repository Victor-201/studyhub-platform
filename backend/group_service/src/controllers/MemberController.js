export class MemberController {
  /**
   * @param {Object} deps
   * @param {import("../services/MemberService.js").MemberService} deps.memberService
   */
  constructor({ memberService }) {
    this.memberService = memberService;
  }

  async getGroupMembers(req, res) {
    try {
      const { group_id } = req.params;
      const members = await this.memberService.getMembersByGroup(group_id);
      res.json({ success: true, data: members });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async getUserGroups(req, res) {
    try {
      const user_id = req.user.id;
      const groups = await this.memberService.getUserGroups(user_id);
      res.json({ success: true, data: groups });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async removeMember(req, res) {
    try {
      const actor_id = req.user.id;
      const { group_id, user_id } = req.params;
      const result = await this.memberService.removeMember(group_id, user_id, actor_id);
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }

  async changeMemberRole(req, res) {
    try {
      const actor_id = req.user.id;
      const { group_id, user_id } = req.params;
      const { role } = req.body;
      const result = await this.memberService.changeMemberRole(group_id, user_id, role, actor_id);
      res.json({ success: true, data: result });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  }
}
