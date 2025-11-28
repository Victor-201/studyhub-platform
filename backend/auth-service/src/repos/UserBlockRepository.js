import { BaseRepository } from "./BaseRepository.js";
import UserBlock from "../models/UserBlock.js";

export class UserBlockRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "user_blocks");
  }

  async blockUser(userBlock) {
    return this.create(userBlock);
  }
}
