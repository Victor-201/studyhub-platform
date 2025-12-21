export function requireRole(roleName) {
  return (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const userRoles = req.user.role || [];  
      const roles = Array.isArray(userRoles) ? userRoles : [userRoles];

      if (!roles.includes(roleName)) {
        return res.status(403).json({ error: "Forbidden: insufficient role" });
      }

      next();
    } catch (err) {
      return res.status(500).json({ error: "Internal server error" });
    }
  };
}
