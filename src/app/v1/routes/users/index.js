const express = require("express");
const UserController = require("../../controllers/user.controller");
const UserRoleController = require("../../controllers/user_role.controller");
const AuthMiddleware = require("../../middlewares/auth.middleware");
const RBACMiddleware = require("../../middlewares/rbac.middleware");
const RBACConstants = require("../../../share/constants/rbac.constants");
const router = express.Router();

router.use(AuthMiddleware.checkToken);

//* User
router.get("/profile", UserController.getUser);
router.post("/update", UserController.updateUser);

//* User Role
router.post(
  "/:userId/roles/:roleId",
  RBACMiddleware.checkPermission(RBACConstants.Role.Create),
  UserRoleController.assignRoleToUserHandler
);

router.get(
  "/:userId/roles",

  RBACMiddleware.checkPermission(RBACConstants.Role.View),
  UserRoleController.getUserRolesHandler
);

router.delete(
  "/:userId/roles/:roleId",
  RBACMiddleware.checkPermission(RBACConstants.Role.Delete),
  UserRoleController.removeRoleFromUserHandler
);

module.exports = router;
