import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET || "access_secret";
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET || "refresh_secret";

export function signAccessToken(payload, expiresIn = "15m") {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn });
}

export function signRefreshToken(payload, expiresIn = "7d") {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn });
}

export function verifyAccessToken(token) {
  return jwt.verify(token, ACCESS_TOKEN_SECRET);
}

export function verifyRefreshToken(token) {
  return jwt.verify(token, REFRESH_TOKEN_SECRET);
}
