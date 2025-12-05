import crypto from "crypto";

export function createTokenHash(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

export function generateRandomToken(length = 32) {
  return crypto.randomBytes(length).toString("hex");
}
