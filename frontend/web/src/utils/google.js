// src/utils/google.js

/**
 * Decode Google ID Token (JWT)
 * @param {string} credential - response.credential từ Google
 * @returns {Object|null} decoded profile
 */
export const decodeGoogleCredential = (credential) => {
  try {
    if (!credential || typeof credential !== "string") return null;

    const parts = credential.split(".");
    if (parts.length !== 3) return null;

    const payload = parts[1];
    const decoded = JSON.parse(
      decodeURIComponent(
        atob(payload)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      )
    );

    return {
      sub: decoded.sub,           // Google user id
      email: decoded.email,
      email_verified: decoded.email_verified,
      name: decoded.name,
      picture: decoded.picture,
      given_name: decoded.given_name,
      family_name: decoded.family_name,
    };
  } catch (err) {
    console.error("decodeGoogleCredential error:", err);
    return null;
  }
};

/**
 * Check Google SDK loaded
 */
export const isGoogleSDKReady = () => {
  return !!(
    window.google &&
    window.google.accounts &&
    window.google.accounts.id
  );
};
