const authConstants = require("../../share/constants/auth.constants");
const rolePermissionModel = require("../models/role_permission.model");

class RBACMiddleware {
  checkPermission(requiredPermission) {
    return async (req, res, next) => {
      try {
        const { roleId, role } = req.infoUserByToken;

        if (!roleId || !role) {
          return res.status(401).send({
            message: "Unauthorized",
          });
        }

        if (role === authConstants.Role.User) {
          return res.status(403).send({
            message: "Forbidden: Permission denied",
          });
        }

        const userPermissions = await rolePermissionModel.getUserPermissions(
          roleId
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
