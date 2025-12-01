import { v4 as uuidv4 } from "uuid";
import path from "path";
import { fileTypeFromBuffer } from "file-type";
import { uploadToCloudinary } from "../utils/cloudinary.js";

export class ProfileService {
  /**
   * ProfileService constructor
   * @param {Object} deps - Dependencies
   * @param {import('../repos/UserRepository.js').default} deps.userRepo
   * @param {import('../repos/UserProfileDetailsRepository.js').default} deps.profileRepo
   * @param {import('../repos/UserPrivacySettingsRepository.js').default} deps.privacyRepo
   * @param {import('../repos/UserSocialLinksRepository.js').default} deps.socialRepo
   * @param {import('../repos/UserInterestsRepository.js').default} deps.interestsRepo
   */
  constructor({
    userRepo,
    profileRepo,
    privacyRepo,
    socialRepo,
    interestsRepo,
  }) {
    this.userRepo = userRepo;
    this.profileRepo = profileRepo;
    this.privacyRepo = privacyRepo;
    this.socialRepo = socialRepo;
    this.interestsRepo = interestsRepo;
  }

  /**
   * Get full profile of a user including details, privacy, social links and interests
   * @param {string} user_id - ID of the user
   * @returns {Promise<Object>} - Object containing user, details, privacy, socialLinks, interests
   * @throws {Error} If user not found
   */
  async getProfile(user_id) {
    const user = await this.userRepo.findById(user_id);
    if (!user) throw new Error("User not found");

    const details = await this.profileRepo.findByUserId(user_id);
    const privacy = await this.privacyRepo.findByUserId(user_id);
    const socialLinks = await this.socialRepo.findByUserId(user_id);
    const interests = await this.interestsRepo.findByUserId(user_id);

    return { user, details, privacy, socialLinks, interests };
  }

  /**
   * Update user's profile information
   * @param {string} user_id - ID of the user
   * @param {Object} data - Profile data
   * @param {string} data.display_name
   * @param {string} data.full_name
   * @param {string} data.bio
   * @param {string} data.gender
   * @param {string} data.birthday
   * @param {string} data.country
   * @param {string} data.city
   * @returns {Promise<Object>} - Updated user and details
   */
  async updateProfile(user_id, data) {
    const updatedUser = await this.userRepo.updateUserById(user_id, {
      display_name: data.display_name,
      full_name: data.full_name,
    });

    const updatedDetails = await this.profileRepo.upsert({
      user_id,
      bio: data.bio,
      gender: data.gender,
      birthday: data.birthday,
      country: data.country,
      city: data.city,
    });

    return { user: updatedUser, details: updatedDetails };
  }

  /**
   * Update user's avatar
   * @param {string} user_id - ID of the user
   * @param {Object} file - File object from multer
   * @param {Buffer|ArrayBuffer} file.buffer - File buffer
   * @param {string} [folder="avatars"] - Cloudinary folder
   * @returns {Promise<Object>} - Updated user with avatar URL
   * @throws {Error} If file is missing, not an image, or user not found
   */
  async updateAvatar(user_id, file, folder = "avatars") {
    if (!file || !file.buffer) throw new Error("No avatar file uploaded");

    const allowedExts = ["jpg", "jpeg", "png", "webp"];

    const type = await fileTypeFromBuffer(file.buffer);
    if (!type || !allowedExts.includes(type.ext)) {
      throw new Error("Uploaded file is not a valid image.");
    }

    const user = await this.userRepo.findById(user_id);
    if (!user) throw new Error("User not found");

    const publicId = `avatar_${user_id}`;
    const buffer = Buffer.isBuffer(file.buffer)
      ? file.buffer
      : Buffer.from(file.buffer);

    const uploaded = await uploadToCloudinary(buffer, {
      folder,
      public_id: publicId,
      overwrite: true,
    });

    return this.userRepo.updateUserById(user_id, {
      avatar_url: uploaded.secure_url,
    });
  }

  /**
   * Get privacy settings of a user
   * @param {string} user_id - ID of the user
   * @returns {Promise<Object>} - Privacy settings
   */
  async getPrivacy(user_id) {
    return this.privacyRepo.findByUserId(user_id);
  }

  /**
   * Update privacy settings of a user
   * @param {string} user_id - ID of the user
   * @param {Object} settings - Privacy settings to update
   * @returns {Promise<Object>} - Updated privacy settings
   */
  async updatePrivacy(user_id, settings) {
    return this.privacyRepo.upsert({ user_id, ...settings });
  }

  /**
   * Search users by query, country or interest
   * @param {Object} filters
   * @param {string} [filters.query] - Search text
   * @param {string} [filters.country] - Country filter
   * @param {string} [filters.interest] - Interest filter
   * @returns {Promise<Array<Object>>} - Array of matched users
   */
  async searchUsers({ query, country, interest }) {
    return this.userRepo.search({ query, country, interest });
  }

  /**
   * Add a social link for a user
   * @param {string} user_id - ID of the user
   * @param {string} platform - Platform name (e.g., Twitter, LinkedIn)
   * @param {string} url - URL of the social profile
   * @returns {Promise<Object>} - Created or updated social link
   */
  async addSocialLink(user_id, platform, url) {
    return this.socialRepo.upsert({
      id: uuidv4(),
      user_id,
      platform,
      url,
    });
  }

  /**
   * Remove a social link by ID
   * @param {string} id - Social link ID
   * @returns {Promise<number>} - Number of records deleted
   */
  async removeSocialLink(id) {
    return this.socialRepo.deleteById(id);
  }

  /**
   * Add an interest for a user
   * @param {string} user_id - ID of the user
   * @param {string} interest - Interest name
   * @returns {Promise<Object>} - Added interest record
   */
  async addInterest(user_id, interest) {
    return this.interestsRepo.addInterest(user_id, interest, uuidv4());
  }

  /**
   * Remove an interest for a user
   * @param {string} user_id - ID of the user
   * @param {string} interest - Interest name
   * @returns {Promise<number>} - Number of interests removed
   */
  async removeInterest(user_id, interest) {
    return this.interestsRepo.removeInterest(user_id, interest);
  }
}
