const express = require("express");
const RoleController = require("../../controllers/role.controller");
const RolePermissionController = require("../../controllers/role_permission.controller");
const AuthMiddleware = require("../../middlewares/auth.middleware");
const RBACMiddleware = require("../../middlewares/rbac.middleware");
const RBACConstants = require("../../../share/constants/rbac.constants");
const router = express.Router();

router.use(AuthMiddleware.checkToken);

// Role
router.get(
  "/",
  RBACMiddleware.checkPermission(RBACConstants.Role.View),

  RoleController.getRolesHandler
);
router.get(
  "/:roleId",

  RBACMiddleware.checkPermission(RBACConstants.Role.View),
  RoleController.getRoleHandler
);
router.post(
  "/",
  RBACMiddleware.checkPermission(RBACConstants.Role.Create),
  RoleController.createRoleHandler
);
router.patch(
  "/",
  RBACMiddleware.checkPermission(RBACConstants.Role.Update),
  RoleController.updateRoleHandler
);
router.delete(
  "/",
  RBACMiddleware.checkPermission(RBACConstants.Role.Delete),
  RoleController.deleteRoleHandler
);

// Role Permission
router.post(
  "/:roleId/permissions/:permissionId",
  RolePermissionController.assignPermissionToRoleHandler
);

router.get(
  "/:roleId/permissions",
  RolePermissionController.getRolePermissionsHandler
);

router.delete(
  "/:roleId/permissions/:permissionId",
  RolePermissionController.removePermissionFromRoleHandler
);

module.exports = router;
