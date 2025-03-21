const express = require("express");
const PermissionController = require("../../controllers/permission.controller");
const RBACConstants = require("../../../share/constants/rbac.constants");
const RBACMiddleware = require("../../middlewares/rbac.middleware");
const AuthMiddleware = require("../../middlewares/auth.middleware");
const router = express.Router();

router.use(AuthMiddleware.checkToken);

router.get(
  "/",
  RBACMiddleware.checkPermission(RBACConstants.Permission.Views),
  PermissionController.getPermissionsHandler
);
router.get(
  "/:permissionId",
  RBACMiddleware.checkPermission(RBACConstants.Permission.View),
  PermissionController.getPermissionHandler
);
router.post(
  "/",
  RBACMiddleware.checkPermission(RBACConstants.Permission.Create),
  PermissionController.createPermissionHandler
);
router.patch(
  "/",

  RBACMiddleware.checkPermission(RBACConstants.Permission.Update),
  PermissionController.updatePermissionHandler
);
router.delete(
  "/",
  RBACMiddleware.checkPermission(RBACConstants.Permission.Delete),
  PermissionController.deletePermissionHandler
);

module.exports = router;
