export class FollowService {
  /**
   * @param {Object} deps - Dependencies
   * @param {import('../repos/UserFollowsRepository.js').default} deps.followRepo - Repository for managing follows/friends
   */
  constructor({ followRepo }) {
    this.followRepo = followRepo;
  }

  /**
   * Follow a user
   * @param {string} follower_id - ID of the user who follows
   * @param {string} target_user_id - ID of the user being followed
   * @returns {Promise<Object>} - The follow record that was created
   * @throws {Error} If the follower tries to follow themselves
   */
  async follow(follower_id, target_user_id) {
    if (follower_id === target_user_id) throw new Error("Cannot follow self");
    return this.followRepo.follow(follower_id, target_user_id);
  }

  /**
   * Unfollow a user
   * @param {string} follower_id - ID of the user who unfollows
   * @param {string} target_user_id - ID of the user being unfollowed
   * @returns {Promise<number>} - Number of records deleted
   */
  async unfollow(follower_id, target_user_id) {
    return this.followRepo.unfollow(follower_id, target_user_id);
  }

  /**
   * Get the number of followers and following for a user
   * @param {string} user_id - User ID
   * @returns {Promise<{followers: number, following: number}>} - Object containing followers and following counts
   */
  async getFollowCounts(user_id) {
    return await this.followRepo.getFollowCounts(user_id);
  }

  /**
   * Lấy danh sách user đang follow user_id
   * @param {string} user_id - User ID
   * @returns {Promise<Array<Object>>}
   */
  async getFollowers(user_id) {
    return this.followRepo.getFollowers(user_id);
  }

  /**
   * Lấy danh sách user mà user_id đang follow
   * @param {string} user_id - User ID
   * @returns {Promise<Array<Object>>}
   */
  async getFollowing(user_id) {
    return this.followRepo.getFollowing(user_id);
  }

  /**
   * Get the list of friends (mutual follows) for a user
   * @param {string} user_id - User ID
   * @returns {Promise<Array<Object>>} - Array of friend records
   */
  async getFriends(user_id) {
    return this.followRepo.getFriends(user_id);
  }

  /**
   * Check if a user is following another user
   * @param {string} follower_id - ID of the follower
   * @param {string} target_user_id - ID of the user being followed
   * @returns {Promise<boolean>} - True if following, false otherwise
   */
  async isFollowing(follower_id, target_user_id) {
    const record = await this.followRepo.findByFollowerAndTarget(
      follower_id,
      target_user_id
    );
    return !!record;
  }

  /**
   * Check if two users are friends (mutual follow)
   * @param {string} user_a - ID of user A
   * @param {string} user_b - ID of user B
   * @returns {Promise<boolean>} - True if they are friends, false otherwise
   */
  async isFriend(user_a, user_b) {
    const friends = await this.followRepo.getFriends(user_a);
    return friends.some(
      (f) =>
        (f.user_a === user_a && f.user_b === user_b) ||
        (f.user_a === user_b && f.user_b === user_a)
    );
  }
}
