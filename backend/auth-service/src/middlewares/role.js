export function requireRole(roleName) {
  return async (req, res, next) => {
    try {
      const userRoles = req.user.roles || [];
      if (!userRoles.includes(roleName)) {
        return res.status(403).json({ error: "Forbidden" });
      }
      next();
    } catch (err) {
      res.status(500).json({ error: "Internal server error" });
    }
  };
}
