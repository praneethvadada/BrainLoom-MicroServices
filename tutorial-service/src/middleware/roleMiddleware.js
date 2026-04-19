// src/middleware/roleMiddleware.js

/**
 * requireAdmin — allows any admin whose scope is "tutorial" OR "all".
 * Regular users are rejected.
 */
export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: admin only" });
  }

  const scope = req.user.scope || "";
  if (scope !== "tutorial" && scope !== "all") {
    return res.status(403).json({
      message: `Forbidden: your admin account does not have access to the tutorial service (your scope: "${scope}")`
    });
  }

  next();
};

/**
 * requireSuperAdmin — only allows super admins (is_super === true).
 * Use this to protect admin management routes.
 */
export const requireSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "admin" || !req.user.is_super) {
    return res.status(403).json({ message: "Forbidden: super admin only" });
  }

  next();
};

/**
 * requireScope(scope) — factory that checks for a specific scope.
 * Use this if you add more services and want fine-grained route-level control.
 *
 * Example:
 *   router.post("/publish", requireScope("tutorial"), controller.publish);
 */
export const requireScope = (requiredScope) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Forbidden: admin only" });
  }

  const scope = req.user.scope || "";
  if (scope !== requiredScope && scope !== "all") {
    return res.status(403).json({
      message: `Forbidden: requires "${requiredScope}" scope (your scope: "${scope}")`
    });
  }

  next();
};
