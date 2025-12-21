export class FollowController {
  /**
   * @param {Object} deps
   * @param {import('../services/FollowService.js').FollowService} deps.followService
   */
  constructor({ followService }) {
    this.followService = followService;
  }

  /** Follow a user */
  async follow({ body }, res) {
    try {
      await this.followService.follow(body.follower_id, body.target_user_id);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Unfollow a user */
  async unfollow({ body }, res) {
    try {
      await this.followService.unfollow(body.follower_id, body.target_user_id);
      res.json({ success: true });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Get follower/following counts */
  async getFollowCounts({ params }, res) {
    try {
      const counts = await this.followService.getFollowCounts(params.user_id);
      res.json(counts);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Danh sách followers */
  async getFollowers({ params }, res) {
    try {
      const users = await this.followService.getFollowers(params.user_id);
      res.json(users);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Danh sách following */
  async getFollowing({ params }, res) {
    try {
      const users = await this.followService.getFollowing(params.user_id);
      res.json(users);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Get mutual friends */
  async getFriends({ params }, res) {
    try {
      const friends = await this.followService.getFriends(params.user_id);
      res.json(friends);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Check if a user is following another user */
  async isFollowing({ query }, res) {
    try {
      const { follower_id, target_user_id } = query;
      const result = await this.followService.isFollowing(
        follower_id,
        target_user_id
      );
      res.json({ isFollowing: result });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  /** Check if two users are mutual friends */
  async isFriend({ query }, res) {
    try {
      const { user_a, user_b } = query;
      const result = await this.followService.isFriend(user_a, user_b);
      res.json({ isFriend: result });
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
}
