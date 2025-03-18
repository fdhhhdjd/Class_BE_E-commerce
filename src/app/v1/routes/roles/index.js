const express = require("express");
const RoleController = require("../../controllers/role.controller");
const RolePermissionController = require("../../controllers/role_permission.controller");
const AuthMiddleware = require("../../middlewares/auth.middleware");
const router = express.Router();

router.use(AuthMiddleware.checkToken);

// Role
router.get("/", RoleController.getRolesHandler);
router.get("/:roleId", RoleController.getRoleHandler);
router.post("/", RoleController.createRoleHandler);
router.patch("/", RoleController.updateRoleHandler);
router.delete("/", RoleController.deleteRoleHandler);

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
