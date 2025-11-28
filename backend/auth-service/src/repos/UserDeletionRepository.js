import { BaseRepository } from "./BaseRepository.js";
import UserDeletion from "../models/UserDeletion.js";

export class UserDeletionRepository extends BaseRepository {
  constructor(pool) {
    super(pool, "user_deletions");
  }

  async softDelete(userDeletion) {
    return this.create(userDeletion);
  }
}
