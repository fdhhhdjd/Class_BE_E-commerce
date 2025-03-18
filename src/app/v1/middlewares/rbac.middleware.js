const rolePermissionModel = require("../models/role_permission.model");

class RBACMiddleware {
  checkPermission(requiredPermission) {
    return async (req, res, next) => {
      try {
        const { userId } = req.infoUserByToken;

        if (!userId) {
          return res.status(401).send({
            message: "Unauthorized",
          });
        }

        const userPermissions = await rolePermissionModel.getUserPermissions(
          userId
        );

        if (!userPermissions || userPermissions.length === 0) {
          return res.status(403).send({
            message: "Forbidden: No permissions found",
          });
        }

        if (!userPermissions.includes(requiredPermission)) {
          return res
            .status(403)
            .json({ message: "Forbidden: Permission denied" });
        }

        next();
      } catch (error) {
        console.error("RBACMiddleware -> checkPermission -> error", error);
        return res.status(500).send({
          message: "Internal Server Error",
        });
      }
    };
  }
}

module.exports = new RBACMiddleware();
