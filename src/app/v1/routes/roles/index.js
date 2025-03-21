const express = require("express");
const RoleController = require("../../controllers/role.controller");
const RolePermissionController = require("../../controllers/role_permission.controller");
const AuthMiddleware = require("../../middlewares/auth.middleware");
const RBACMiddleware = require("../../middlewares/rbac.middleware");
const RBACConstants = require("../../../share/constants/rbac.constants");
const router = express.Router();

router.use(AuthMiddleware.checkToken);

//* Role
router.get(
  "/",
  RBACMiddleware.checkPermission(RBACConstants.Role.Views),

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

//* Role Permission

router.get(
  "/:roleId/permissions",
  RBACMiddleware.checkPermission(RBACConstants.Role.Views),
  RolePermissionController.getRolePermissionsHandler
);
router.post(
  "/:roleId/permissions/:permissionId",
  RBACMiddleware.checkPermission(RBACConstants.Role.Assign),
  RolePermissionController.assignPermissionToRoleHandler
);

router.post(
  "/:roleId/permissions",
  // RBACMiddleware.checkPermission(RBACConstants.Role.Assign),
  RolePermissionController.assignPermissionToRoleBulkHandler
);

router.delete(
  "/:roleId/permissions/:permissionId",
  RBACMiddleware.checkPermission(RBACConstants.Role.Revoke),
  RolePermissionController.revokePermissionFromRoleHandler
);

router.delete(
  "/:roleId/permissions",
  RBACMiddleware.checkPermission(RBACConstants.Role.Revoke),
  RolePermissionController.revokePermissionFromRoleBulkHandler
);

module.exports = router;
